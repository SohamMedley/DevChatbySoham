import google.generativeai as genai
import os
from flask import Flask, render_template, request, jsonify, session
import uuid
from datetime import datetime
import threading
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
app.secret_key = os.environ.get("SECRET_KEY", "dev-secret-key")

# Configure Gemini API
API_KEY = os.environ.get("GEMINI_API_KEY")
if not API_KEY:
    raise ValueError("Please set the GEMINI_API_KEY environment variable.")

genai.configure(api_key=API_KEY)

# In-memory chat sessions storage (for demo purposes only; use a database in production)
chat_sessions = {}
chat_sessions_lock = threading.Lock()

@app.route("/")
def index():
    # Generate a unique session ID if not exists
    if 'session_id' not in session:
        session['session_id'] = str(uuid.uuid4())
    
    session_id = session['session_id']
    with chat_sessions_lock:
        if session_id not in chat_sessions:
            model = genai.GenerativeModel('gemini-1.5-flash')
            chat_sessions[session_id] = {
                'model': model,
                'chat': model.start_chat(history=[]),
                'history': [],
                'created_at': datetime.now().isoformat()
            }
    return render_template('index.html')

@app.route("/get_response", methods=['POST'])
def get_gemini_response():
    user_message = request.form.get('user_message', '')
    session_id = session.get('session_id')
    
    if not session_id:
        return jsonify({'error': 'Invalid session'}), 400

    with chat_sessions_lock:
        if session_id not in chat_sessions:
            return jsonify({'error': 'Invalid session'}), 400
        chat_session = chat_sessions[session_id]
    
    try:
        # Send message to Gemini API
        response = chat_session['chat'].send_message(user_message)
        timestamp = datetime.now().isoformat()
        
        # If response is empty or missing text, treat it as partial/empty
        if not response or not getattr(response, 'text', '').strip():
            logger.warning("Gemini returned an empty or partial response.")
            return jsonify({
                'gemini_response': "I couldn't generate a full response. Please try again.",
                'session_id': session_id
            })
        
        # Store in chat history
        chat_session['history'].append({
            'role': 'user',
            'content': user_message,
            'timestamp': timestamp
        })
        chat_session['history'].append({
            'role': 'assistant',
            'content': response.text,
            'timestamp': timestamp
        })
        
        return jsonify({
            'gemini_response': response.text,
            'session_id': session_id
        })
    except Exception as e:
        error_str = str(e)
        # If the error includes "finish_reason: RECITATION", gracefully return a partial response message.
        if "finish_reason: RECITATION" in error_str:
            logger.info("Gemini gave a partial/recitation response: %s", error_str)
            return jsonify({
                'gemini_response': "Here’s the partial response I have so far... (Gemini ended early)",
                'session_id': session_id,
                'error': None
            })
        else:
            logger.error("Error in get_response: %s", error_str)
            return jsonify({
                'error': error_str,
                'gemini_response': "I'm having trouble connecting to Gemini right now. Please try again shortly."
            })

@app.route("/clear_chat", methods=['POST'])
def clear_chat():
    session_id = session.get('session_id')
    
    if not session_id:
        return jsonify({'error': 'Invalid session'}), 400
    
    with chat_sessions_lock:
        if session_id not in chat_sessions:
            return jsonify({'error': 'Invalid session'}), 400
        # Reset the chat session
        model = chat_sessions[session_id]['model']
        chat_sessions[session_id]['chat'] = model.start_chat(history=[])
        chat_sessions[session_id]['history'] = []
    
    return jsonify({'success': True, 'message': 'Chat history cleared'})

@app.route("/save_chat", methods=['POST'])
def save_chat():
    session_id = session.get('session_id')
    
    if not session_id:
        return jsonify({'error': 'Invalid session'}), 400
    
    with chat_sessions_lock:
        if session_id not in chat_sessions:
            return jsonify({'error': 'Invalid session'}), 400
        chat_history = chat_sessions[session_id]['history']
    
    return jsonify({
        'success': True,
        'history': chat_history,
        'chat_id': session_id
    })

@app.route("/get_chat_history", methods=['GET'])
def get_chat_history():
    session_id = session.get('session_id')
    
    if not session_id:
        return jsonify({'error': 'Invalid session'}), 400
    
    with chat_sessions_lock:
        if session_id not in chat_sessions:
            return jsonify({'error': 'Invalid session'}), 400
        chat_history = chat_sessions[session_id]['history']
    
    return jsonify({
        'success': True,
        'history': chat_history
    })

if __name__ == '__main__':
    app.run(debug=True)
