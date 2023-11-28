# Call - Recalll

**Description:**
"Recall" is a web-based application designed to streamline the process of audio file transcription, offering a user-friendly interface for both uploading audio files and recording audio directly within the platform. This tool utilizes Google's Speech-to-Text API for accurate speech-to-text transcription and OpenAI's ChatGPT API to summarize generated text into concise key points.

**Key Features:**
- **Modern Technology Stack:** Built with React and Vite for the frontend, and enhanced with the power of Tailwind CSS  for a stylish and responsive design. The backend leverages the Express framework for robust functionality.
- **Audio Conversion:** Easily upload audio files or record audio within the application for processing.
- **Transcription:** Utilizes Google's Speech-to-Text API to transform spoken content into written text.
- **Text Summarization:** Employs OpenAI's ChatGPT to automatically summarize lengthy text into essential bullet points.
- **User-Friendly Interface:** The application offers an intuitive user interface for a seamless user experience.

## Installation

1. Clone the repository, Open it to reveal two subfolders: "server" and "client."

2. Open the project directory (call-recall) in your preferred code editor.

3. In the terminal, navigate to the "server" folder and run the following command to install server dependencies:
    ```bash
    npm install
    ```

4. Next, go to the "client" folder and run the following command to install client dependencies:
    ```bash
    npm install
    ```

5. Return to the "server" folder and run the following command to start the development server for the server:
    ```bash
    npm run dev
    ```

6. Navigate back to the "client" folder and run the following command to start the development server for the client:
    ```bash
    npm run dev
    ```

8. The application should now be up and running.

## Some Important Points

i. In the "server" folder, you'll find a .env file. This file contains highly sensitive information, including API keys for OpenAI and AssemblyAI. Treat this file with utmost care and avoid sharing it openly.

ii. To authenticate with the Google API, there is a file in the "server" folder named "tmpyashwant.json." This file is also highly sensitive, as it is used for authentication with Google's servers. The file is automatically imported into the project's environmental variables, and Google uses it to authenticate every request.
