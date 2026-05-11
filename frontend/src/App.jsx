import { useState, useRef } from "react"
import axios from "axios"

function App() {

  const [recording, setRecording] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])
  const streamRef = useRef(null)

  const startRecording = async () => {
    try {
      setError("")
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      })
      streamRef.current = stream

      const mediaRecorder = new MediaRecorder(stream)

      mediaRecorderRef.current = mediaRecorder

      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorder.onstop = async () => {
        setLoading(true)
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        })

        const formData = new FormData()

        formData.append("file", audioBlob, "recording.wav")

        try {
          const response = await axios.post(
            "http://127.0.0.1:8000/transcribe",
            formData,
            { timeout: 30000 }
          )

          setTranscript(response.data.transcript)
        } catch (err) {
          setError("Failed to transcribe audio. Please try again.")
          console.error(err)
        } finally {
          setLoading(false)
        }
      }

      mediaRecorder.start()
      setRecording(true)
    } catch (err) {
      setError("Failed to access microphone. Please check permissions.")
      console.error(err)
    }
  }

  const clearTranscript = () => {
    setTranscript("")
    setError("")
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(transcript)
      // Could add a toast notification here
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      setRecording(false)
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white flex items-center justify-center px-4 py-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),rgba(255,255,255,0))]"></div>
      
      <div className="relative z-10 text-center max-w-4xl w-full">
        <div className="mb-8">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-pulse">
            AI Speech Assistant
          </h1>
          <p className="text-gray-300 text-lg md:text-xl mb-2">
            Powered by OpenAI Whisper
          </p>
          <div className="w-16 md:w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-500/50 rounded-xl text-red-200 animate-fade-in">
            ⚠️ {error}
          </div>
        )}

        <div className="mb-8">
          {!recording ? (
            <button
              onClick={startRecording}
              className="group relative px-8 md:px-10 py-4 md:py-5 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg md:text-xl font-semibold hover:from-blue-500 hover:to-purple-500 transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-blue-500/25"
            >
              <span className="flex items-center gap-3">
                <span className="text-2xl group-hover:animate-bounce">🎤</span>
                Start Recording
              </span>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-20 blur-xl transition-opacity"></div>
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="group relative px-8 md:px-10 py-4 md:py-5 rounded-full bg-gradient-to-r from-red-600 to-pink-600 text-white text-lg md:text-xl font-semibold transform scale-110 shadow-2xl shadow-red-500/50 animate-pulse"
            >
              <span className="flex items-center gap-3">
                <span className="text-2xl">🔴</span>
                Stop Recording
              </span>
              <div className="absolute inset-0 rounded-full bg-red-600 opacity-30 blur-xl animate-ping"></div>
            </button>
          )}
        </div>

        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm p-6 md:p-8 rounded-3xl min-h-[280px] text-left border border-gray-700/50 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-100">
                Live Transcript
              </h2>
            </div>
            {transcript && (
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={copyToClipboard}
                  className="px-3 md:px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 rounded-lg transition-colors text-sm font-medium"
                  title="Copy to clipboard"
                >
                  📋 Copy
                </button>
                <button
                  onClick={clearTranscript}
                  className="px-3 md:px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-300 rounded-lg transition-colors text-sm font-medium"
                  title="Clear transcript"
                >
                  🗑️ Clear
                </button>
              </div>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-4">
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-300 text-lg">Transcribing your speech...</p>
              </div>
            </div>
          ) : (
            <p className={`text-gray-200 leading-relaxed text-lg transition-all duration-500 ${transcript ? 'animate-fade-in' : ''}`}>
              {transcript || "Your AI transcript will appear here..."}
            </p>
          )}
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            Click the microphone to start recording 
          </p>
        </div>
      </div>
    </div>
  )
}

export default App