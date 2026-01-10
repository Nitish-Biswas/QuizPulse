import requests
import html
import random
from typing import List, Dict, Any
from fastapi import HTTPException
from models import QuizQuestion
import os
from dotenv import load_dotenv

load_dotenv()
OPENTDB_URL = os.getenv("OPENTDB_URL")

def fetch_quiz_data() -> List[QuizQuestion]:
    """
    Fetches data from OpenTDB, cleans HTML entities, and structures it.
    Raises HTTPException if external API fails.
    """
    try:
        response = requests.get(OPENTDB_URL)
        response.raise_for_status()
        data = response.json()
        
        if data.get("response_code") != 0:
            raise ValueError("OpenTDB returned an error code")

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

        return processed_questions

    except requests.RequestException as e:
        # Log this error in a real app
        print(f"Error fetching data: {e}")
        raise HTTPException(status_code=503, detail="External Quiz API is unavailable")