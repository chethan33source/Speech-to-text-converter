import os
from gtts import gTTS
from mutagen.mp3 import MP3
import time
import pygame
import speech_recognition as sr
import sounddevice as sd
import wave
import numpy as np
import serial

# Serial connection setup
try:
    data = serial.Serial('COM5', baudrate=9600, timeout=1)
    print("Connected to Arduino successfully.")
except Exception as e:
    print(f"Failed to connect to Arduino: {e}")

def send_to_arduino(message):
    try:
        data.write(str.encode(message + '\n'))
        print(f"Sent to Arduino: {message}")
    except Exception as e:
        print(f"Error sending data to Arduino: {e}")

def play_audio(text):
    try:
        print(f"Playing TTS: {text}")
        tts = gTTS(text=text, lang='en', slow=False)
        tts.save("answer.mp3")
        pygame.mixer.init()
        pygame.mixer.music.load("answer.mp3")
        pygame.mixer.music.play()

        while pygame.mixer.music.get_busy():
            time.sleep(0.1)

        pygame.mixer.quit()
        os.remove("answer.mp3")
    except Exception as e:
        print(f"Error during playback: {e}")

def record_audio(filename, duration=5, fs=44100, channels=2):
    try:
        print("Recording audio...")
        audio_data = sd.rec(int(duration * fs), samplerate=fs, channels=channels, dtype=np.int16)
        sd.wait()
        print("Recording complete.")

        with wave.open(filename, 'wb') as wf:
            wf.setnchannels(channels)
            wf.setsampwidth(2)
            wf.setframerate(fs)
            wf.writeframes(audio_data.tobytes())
    except Exception as e:
        print(f"Error during audio recording: {e}")

lang = 'en'

while True:
    try:
        filename = "input_audio.wav"
        record_audio(filename)

        recognizer = sr.Recognizer()
        with sr.AudioFile(filename) as source:
            recognizer.adjust_for_ambient_noise(source)
            audio_data = recognizer.record(source)

            try:
                recognized_text = recognizer.recognize_google(audio_data, language=lang).lower()
                print(f"Recognized Text: {recognized_text}")

                if 'kannada' in recognized_text:
                    play_audio("You chose Kannada")
                    lang = 'kn'
                elif 'english' in recognized_text:
                    play_audio("You chose English")
                    lang = 'en'
                elif 'hindi' in recognized_text:
                    play_audio("You chose Hindi")
                    lang = 'hi'
                else:
                    play_audio("Command not recognized.")

                send_to_arduino(recognized_text)

            except sr.UnknownValueError:
                print("Could not understand the audio.")
            except sr.RequestError as e:
                print(f"Google Speech Recognition service error: {e}")

    except Exception as e:
        print(f"Error in main loop: {e}")
