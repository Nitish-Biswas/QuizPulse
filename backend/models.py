from pydantic import BaseModel, Field
from typing import List

class QuizQuestion(BaseModel):
    
    #Represents a single processed question sent to the Frontend.
    question: str
    choices: List[str]  # Shuffled list of all possible answers
    correct_answer: str

class QuizResponse(BaseModel):
    
    #The main response model for our API endpoint.
    questions: List[QuizQuestion]