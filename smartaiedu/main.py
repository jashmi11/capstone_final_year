# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai  # Gemini API client
import json

# -----------------------------
# FastAPI app
# -----------------------------
app = FastAPI()

# -----------------------------
# CORS setup for React frontend
# -----------------------------
origins = [
    "http://localhost:3000",  # React dev server
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# Pydantic model for user answers
# -----------------------------
class UserAnswers(BaseModel):
    answers: list[str]

# -----------------------------
# Initialize Gemini client (reads API key from environment)
# -----------------------------
client = genai.Client()

# -----------------------------
# Endpoint to predict learning style
# -----------------------------
@app.post("/predict-style")
def predict_style(data: UserAnswers):
    user_responses = "\n".join([f"{i+1}. {ans}" for i, ans in enumerate(data.answers)])

    prompt = (
        "Based on these responses, identify ONE final learning style "
        "(Visual, Auditory, Reading/Writing, Kinesthetic, or Multimodal). "
        "Respond in EXACT JSON with only these 2 fields:\n"
        "{learning_style: <style>, summary: <one-line summary>}.\n"
        "No explanations, no bullet points, no markdown.\n\n"
        f"User Responses:\n{user_responses}"
    )

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )
        learning_style_summary = response.text

    except Exception as e:
        print("Error calling Gemini API:", e)
        learning_style_summary = '{"learning_style": "Unknown", "summary": "Error predicting learning style."}'

    return json.loads(learning_style_summary)
