import requests
import html
import random
import logging
import time
from typing import List
from fastapi import HTTPException
from models import QuizQuestion
import os
from dotenv import load_dotenv

load_dotenv()

# Read OpenTDB URL from environment, fallback to default
OPENTDB_URL = os.getenv("OPENTDB_URL")

logger = logging.getLogger("uvicorn")

# Simple in-memory cache to reduce API calls & rate limits
_QUIZ_CACHE = {
    "data": None,
    "timestamp": 0
}

# Cache validity duration (seconds)
CACHE_DURATION = 10


def fetch_quiz_data() -> List[QuizQuestion]:
    """
    Fetches data from OpenTDB, cleans HTML entities, and structures it.
    Raises HTTPException if external API fails.
    """
    global _QUIZ_CACHE
    current_time = time.time()

    # 1. Serve from cache if still valid
    if (
        _QUIZ_CACHE["data"]
        and (current_time - _QUIZ_CACHE["timestamp"] < CACHE_DURATION)
    ):
        logger.info("⚡ CACHE HIT: Serving quiz data from memory.")
        return _QUIZ_CACHE["data"]

    try:
        logger.info("🌍 NETWORK: Fetching quiz data from OpenTDB...")
        response = requests.get(OPENTDB_URL, timeout=5)

        # Explicit handling for OpenTDB rate limits
        if response.status_code == 429:
            logger.warning("⚠️ RATE LIMIT (429): OpenTDB temporarily unavailable.")
            # Serve stale cache if available
            if _QUIZ_CACHE["data"]:
                logger.info("♻️ SERVING STALE CACHE DUE TO RATE LIMIT.")
                return _QUIZ_CACHE["data"]
            raise HTTPException(
                status_code=429,
                detail="Quiz service is busy. Please try again shortly."
            )

        response.raise_for_status()
        data = response.json()

        if data.get("response_code") != 0:
            raise ValueError(
                f"OpenTDB returned error code {data.get('response_code')}"
            )

        results = data.get("results", [])
        processed_questions = []

        for item in results:
            # 1. Decode HTML entities (e.g., &quot; -> ")
            question_text = html.unescape(item["question"])
            correct_answer = html.unescape(item["correct_answer"])
            incorrect_answers = [html.unescape(ans) for ans in item["incorrect_answers"]]

            # 2. Combine and shuffle choices
            all_choices = incorrect_answers + [correct_answer]
            random.shuffle(all_choices)

            # 3. Create the strictly typed object
            processed_questions.append(
                QuizQuestion(
                    question=question_text,
                    choices=all_choices,
                    correct_answer=correct_answer
                )
            )

        # Update cache after successful fetch
        _QUIZ_CACHE["data"] = processed_questions
        _QUIZ_CACHE["timestamp"] = current_time

        return processed_questions

    except requests.RequestException as e:
        # Log network-level errors
        logger.error(f"❌ NETWORK ERROR: {str(e)}")

        # Serve stale cache if available
        if _QUIZ_CACHE["data"]:
            logger.info("♻️ SERVING STALE CACHE DUE TO NETWORK FAILURE.")
            return _QUIZ_CACHE["data"]

        raise HTTPException(
            status_code=503,
            detail="External Quiz API is unavailable"
        )

    except Exception as e:
        # Re-throw explicit HTTPExceptions (like 429)
        if isinstance(e, HTTPException):
            raise e

        logger.error(f"❌ UNEXPECTED ERROR: {str(e)}")
        raise HTTPException(
            status_code=503,
            detail="External Quiz Service is currently unavailable. Please try again later."
        )
