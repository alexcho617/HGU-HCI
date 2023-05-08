# 실행 전 모듈 먼저 설치
# brew install portaudio && pip install pyaudio
# pip install openai
# pip install python-dotenv
# pip install Flask
# brew install ffmpeg
# .env 파일 생성해서 아래 노션에 있는 KEY 복붙
# https://www.notion.so/API-e9f3135d79834fd689467e2314c68007?pvs=4

import os
import speech_recognition as sr
import pyaudio
import openai
from dotenv import load_dotenv
from flask import Flask, render_template, request
from pydub import AudioSegment
from pydub.playback import play
from gtts import gTTS
from io import BytesIO


# Flask 애플리케이션 생성
app = Flask(__name__)

load_dotenv()

# https://platform.openai.com/account/api-keys
# Create new secret key 클릭해서 api key 생성
openai.api_key = os.environ.get('OPENAI_API_KEY')


# OpenAI GPT-3로 응답 생성
def get_openai_response(prompt, print_output=False):
    completions = openai.Completion.create(
        engine='text-davinci-003',
        temperature=0.5,
        prompt=prompt,
        max_tokens=3072,
        n=1,
        stop=None,
    )
    if print_output:
        print(completions)
    return completions.choices[0].text

# 음성 입력을 텍스트로 변환하는 함수


def recognize_speech():
    r = sr.Recognizer()
    with sr.Microphone() as source:
        print("음성을 입력하세요.")
        audio = r.listen(source)
    try:
        text = r.recognize_google(audio, language='ko-KR')
        
        print("인식된 텍스트: " + text)
        return text
    except sr.UnknownValueError:
        print("음성을 인식할 수 없습니다.")
        return None
    except sr.RequestError as e:
        print("구글 음성 인식 API에 접근할 수 없습니다: {0}".format(e))
        return None


def play_audio(text):
    tts = gTTS(text=text, lang='ko')
    # tts.save("test1.mp3")
    audio = BytesIO()
    tts.write_to_fp(audio)
    audio.seek(0)
    speak = AudioSegment.from_file(audio, format="mp3")
    play(speak)
# Flask 라우트 및 뷰 함수

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/get_openai_response', methods=['POST'])
def get_response():
    if request.method == 'POST':
        text = request.form['text']
        response = get_openai_response(text)
        play_audio(response)
        return response


@app.route('/speech_to_text', methods=['GET'])
def speech_to_text():
    text = recognize_speech()
    if text is not None:
        return text
    else:
        return "음성 인식에 실패했습니다."


@app.route('/set_category', methods=['POST'])
def set_category():
    selected_category = request.form['category']
    session['selected_category'] = selected_category
    return 'Category set!'


@app.route('/love')
def love():
    prompt = os.environ.get('love_sentence')
    response = get_openai_response(prompt)
    return render_template('love.html', response=response)

@app.route('/Career')
def career():
    prompt = os.environ.get('career_sentence')
    response = get_openai_response(prompt)
    return render_template('Career.html', response=response)


@app.route('/Health')
def health():
    prompt = os.environ.get('health_sentence')
    response = get_openai_response(prompt)
    return render_template('Health.html', response=response)


@app.route('/Finance')
def finance():
    prompt = os.environ.get('finance_sentence')
    response = get_openai_response(prompt)
    return render_template('Finance.html', response=response)


if __name__ == '__main__':
    app.run()
