from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import whisper
import shutil
import os
import uuid

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = whisper.load_model("base")

@app.get("/")
def home():
    return {"message": "Whisper Backend Running"}

@app.post("/transcribe")
async def transcribe_audio(file: UploadFile = File(...)):
    # Generate unique filename to avoid conflicts
    unique_filename = f"{uuid.uuid4()}_{file.filename}"
    
    try:
        with open(unique_filename, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        result = model.transcribe(unique_filename)

        return {
            "transcript": result["text"]
        }
    finally:
        # Clean up the temporary file
        if os.path.exists(unique_filename):
            os.remove(unique_filename)
