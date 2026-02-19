from fastapi import FastAPI
from dotenv import load_dotenv
import os
import google.generativeai as genai

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("models/gemini-1.5-flash")

app = FastAPI()

@app.get("/analyze")
def analyze():
    response = model.generate_content("Say API working")
    return {"result": response.text}
