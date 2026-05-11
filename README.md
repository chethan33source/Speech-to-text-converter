# AI Speech Assistant

A modern, premium speech-to-text application powered by OpenAI's Whisper AI model. Record audio in real-time and get instant transcriptions with a beautiful, interactive interface.

## Features

- Real-time audio recording
- Powered by OpenAI Whisper AI
- Premium, responsive UI with animations
- Mobile-friendly design
- Copy transcript to clipboard
- Clear transcript functionality
- Fast transcription with loading states
- Secure file handling with automatic cleanup

## Tech Stack

### Frontend
- React 19
- Vite
- Tailwind CSS
- Axios for API calls

### Backend
- FastAPI
- OpenAI Whisper
- Python 3.8+

## Setup Instructions

### Prerequisites
- Python 3.8 or higher
- Node.js 18 or higher
- Git

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Activate the virtual environment:
   ```bash
   .\venv\Scripts\activate  # Windows
   # or
   source venv/bin/activate  # macOS/Linux
   ```

3. Install dependencies:
   ```bash
   pip install fastapi uvicorn[standard] openai-whisper
   ```

4. Start the backend server:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5174`

## Usage

1. Click the "Start Recording" button to begin recording audio
2. Speak clearly into your microphone
3. Click "Stop Recording" when finished
4. Wait for the AI to process your speech
5. View your transcript in the live transcript area
6. Use the copy button to copy the transcript to clipboard
7. Use the clear button to reset the transcript

## API Endpoints

### GET /
Returns a welcome message indicating the backend is running.

### POST /transcribe
Accepts an audio file upload and returns the transcribed text.

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: file (audio file)

**Response:**
```json
{
  "transcript": "Your transcribed text here..."
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
