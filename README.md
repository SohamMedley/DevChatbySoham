# DevChat by Soham

**DevChat** is a specialized coding assistant powered by Google's Gemini AI. Designed to help developers debug code, generate snippets, and explain programming concepts, DevChat provides an intuitive, chat-based interface that looks and feels like ChatGPT but with a focus on code.

![DevChat Banner](images/banner-image.png)

## Features

- **Interactive Chat Interface**: Engage in natural language conversations to ask coding questions.
- **Smart Code Suggestions**: Receive intelligent code completions, debugging hints, and explanations.
- **Syntax-Highlighted Code Blocks**: Beautiful, ChatGPT-style code blocks with syntax highlighting using Highlight.js.
- **Code Button**: Easily copy code snippets with a single click.
- **Fullscreen Mode**: Toggle the chat interface to full screen for an enhanced mobile experience.
- **Chat History & Export**: Save and retrieve your conversation history.

## Tech Stack

- **Backend**: Python, Flask, Google Generative AI (Gemini)
- **Frontend**: HTML, CSS, JavaScript, Highlight.js (Monokai Sublime theme), Font Awesome
- **Deployment**: Render.com

## Installation
Follow these steps to run DevChat locally:

1. **Clone the repository**:
```bash
   git clone https://github.com/<your-username>/<your-repo>.git
   cd <your-repo> 
```

2. **Create a virtual environment**:
```bash
python -m venv venv
# On Windows use: venv\Scripts\activate
```

3. **Install dependencies**:
```bash
pip install --upgrade pip
pip install -r requirements.txt 
```

4. **Set up your environment variable for the Gemini API key:**
On Windows (PowerShell):
 ```bash
$env:GEMINI_API_KEY="YOUR_GEMINI_API_KEY" 
```

On macOS/Linux:
```bash 
export GEMINI_API_KEY="YOUR_GEMINI_API_KEY" 
```

5.**Run the application:**
```bash
python gemini_chatbot.py 
```

6.**Open your browser at http://localhost:5000 to start chatting with DevChat.**
**Deployment on Render**
*To deploy DevChat on Render:*
(i) Push your code to GitHub (ensure you have a requirements.txt at the root).

(ii) Create a new Web Service on Render.

(iii) Connect your GitHub repo.

(iv) Set the Build Command to:

```bash
pip install --upgrade pip && pip install -r requirements.txt 
```

(v) Set the Start Command to:

```bash
python gemini_chatbot.py 
```

(vi) Modify your app to bind to host='0.0.0.0' and use the port provided by Render:

```python
if __name__ == '__main__':
    import os
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=True, host='0.0.0.0', port=port)
```

(vii) Add your environment variable:
In Render’s dashboard, add an environment variable with:
Name: GEMINI_API_KEY
Value: YOUR_GEMINI_API_KEY
(viii) Deploy the service and test your deployed URL.

**UI & Customization**
>Fullscreen Toggle: Use the fullscreen button on the chat header to expand the chat window for a better mobile experience.
>Syntax Highlighting: Code blocks are rendered using Highlight.js with the Monokai Sublime theme. You can change the theme by editing the link in index.html.
>Code: Each code block has an icon-only “copy code” button that turns into a checkmark when the code is successfully copied.

**License**
This project is licensed under the MIT License.

**Contact**
For any questions or feedback, feel free to contact Soham (businessbysoham@gmail.com)
