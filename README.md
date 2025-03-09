# DevChat by Soham

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)  ![Flask](https://img.shields.io/badge/Flask-3.1.0-brightgreen) ![Gemini API](https://img.shields.io/badge/Gemini_API-Powered-orange)

DevChat is a specialized coding assistant designed to help you with debugging, code generation, and explanation of programming concepts. Built with Python and Flask, and powered by Google's Gemini AI, DevChat offers a seamless and efficient coding support experience.

**[Live Demo] https://devchatbysoham.onrender.com/
## Features

* **Smart Code Suggestions:** Get intelligent code completions and debugging hints.
* **Chat History:** Save and retrieve your coding sessions anytime.
* **Code Snippets:** Easily copy code examples and snippets for your projects.
* **Responsive Design:** Enjoy a perfect coding assistant experience on any device.
* **Beautiful UI:** A modern and visually appealing interface designed to enhance your coding experience.
* **Inline Code Highlighting:** Code is automatically highlighted for easy reading.
* **Copy Code Buttons:** Easily copy code snippets with a single click.
* **Regenerate Responses:** Regenerate Gemini responses for different results.
* **Edit Prompts:** Edit your prompts directly in the chat interface.

## Screenshots

![Screenshot of DevChat Interface](path/to/your/screenshot.png) (Replace with a path or URL to your screenshot)

## Technologies Used

* **Backend:** Python, Flask
* **AI Model:** Google's Gemini API
* **Frontend:** HTML, CSS, JavaScript
* **UI/UX:** Modern, responsive design with gradient effects and animated backgrounds.
* **Code Highlighting:** Highlight.js
* **Deployment:** Render.com

## Installation

1.  **Clone the repository:**

    ```bash
    git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
    cd your-repo-name
    ```

2.  **Create a virtual environment (recommended):**

    ```bash
    python -m venv venv
    source venv/bin/activate  # On macOS/Linux
    venv\Scripts\activate  # On Windows
    ```

3.  **Install dependencies:**

    ```bash
    pip install -r requirements.txt
    ```

4.  **Set up environment variables:**

    * Create a `.env` file in the root directory.
    * Add your Gemini API key:

    ```
    GEMINI_API_KEY=YOUR_GEMINI_API_KEY
    SECRET_KEY=YOUR_SECRET_KEY
    ```

5.  **Run the application:**

    ```bash
    python gemini_chatbot.py
    ```

6.  **Or for production use gunicorn:**

    ```bash
    gunicorn gemini_chatbot:app
    ```

## Deployment

This application is designed to be easily deployed on Render.com. Simply connect your GitHub repository to Render, and it will automatically build and deploy your application.

Make sure to set the `GEMINI_API_KEY` and `SECRET_KEY` environment variables in your Render.com dashboard.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## Author

* Soham

## Acknowledgements

* Powered by Google's Gemini AI.
* Inspired by the need for a seamless coding assistant.
* Thank you to the Flask and Highlight.js communities.
