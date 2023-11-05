const axios = require('axios');  // Import the axios library for making HTTP requests.
const fs = require('fs-extra');  // Import the fs-extra library for working with the file system.
const assemblyasiHeaders = require("../services/assemblyaiClient"); // Import headers for AssemblyAI service.
const openaiHeaders = require("../services/openai");  // Import headers for OpenAI service.
const speech = require('@google-cloud/speech');  // Import the Google Cloud Speech-to-Text library.
const { spawnSync } = require('child_process');  // Import the spawnSync function from the child_process module for executing shell commands synchronously.

process.env.GOOGLE_APPLICATION_CREDENTIALS = 'tmpyashwant.json';  // Set the environment variable for Google Cloud credentials.


// Route handler for uploading an audio file
const uploadAudio = async (req, res) => {

  // Function to convert the uploaded audio file to WAV format
  const convertToWav = (inputPath, outputPath) => {
    const ffmpegPath = 'C:\\ffmpeg\\bin\\ffmpeg.exe'; // Path to the FFmpeg executable
    // arguments to pass for audio conversion 
    const args = [
      '-i', inputPath,        // Input file path: Specifies the path to the input audio file.
      '-f', 's16le',           // Output format: Specifies the audio format as signed 16-bit little-endian (s16le).
      '-acodec', 'pcm_s16le',  // Audio codec: Sets the audio codec to signed 16-bit little-endian (pcm_s16le).
      '-ar', '44100',          // Audio sample rate: Sets the audio sample rate to 44,100 Hz.
      '-ac', '1',              // Number of audio channels: Specifies mono audio with one channel.
      outputPath              // Output file path: Specifies the path to the converted .wav audio file.
    ];

    // Executes the FFmpeg command synchronously, converting the input audio file to a specified format.
    // The result object contains information about the execution, including exit status, stdout, and stderr.
    const result = spawnSync(ffmpegPath, args);

    if (result.error) {
      // console.error('Error:', result.error);
      // If there's an error during conversion, return an error object
      return {error: result.error}
    } else {
      // If conversion is successful, return null
      // console.log('stdout:', result.stdout.toString());
      // console.error('stderr:', result.stderr.toString());
      // console.log('Exit code:', result.status);
      return null
    }
  }

  const validExtensions = ['mp3', 'wav', 'ogg', 'flac', 'aac', 'mp4'];

  // console.log(req.body.formData);
  const uploadedFile = req.file;

  if (uploadedFile) {
    var fileUrl = uploadedFile.path;
    // console.log('File stored at:', fileUrl);

    // convert to .wav 
    let parts = fileUrl.split('.');
    // console.log("ext here", parts[parts.length - 1]);

    // Check if the file extension is valid for audio processing
    if (!validExtensions.includes(`${parts[parts.length - 1].toLowerCase()}`)) {
      res.status(400)
      throw new Error("This is not a valid audio file extension")
    }

    parts[parts.length - 1] = 'wav'; // Change the extension to 'wav'
    let newFileUrl = parts.join('.');
    const converted = convertToWav(fileUrl, newFileUrl)
    if (converted !== null) {
      res.status(405).json({ success: false, message: 'File could not be converted.' });
    }

    // Update the file URL to the WAV file
    fileUrl = newFileUrl

    // Respond with the success status and the file URL
    res.json({ success: true, fileUrl: fileUrl });

  } else {
    // If no file was uploaded, respond with an error status
    res.status(400).json({ success: false, message: 'No file uploaded' });
  }
}

// Route handler for converting speech to text using Google Speech-to-text API
const convertSpeechToText = async (req, res) => {

  // Extract data from the request body
  const data = req.body
  // console.log("data received", data)
  
  // Extract the file URL and language from the data
  const fileURL = data.fileUrl
  const lang = data.language
  
  // Create a new instance of the Google Cloud Speech Client
  const client = new speech.SpeechClient();

  // Read the audio file from the specified URL
  const file = await fs.readFile(fileURL)
  const audioBytes = file.toString('base64')

  const audio = {
    content: audioBytes,
  };

  // Configure the recognition parameters, including encoding, sample rate, and language
  const config = {
    encoding: 'LINEAR16',
    sampleRateHertz: 44100,
    languageCode: lang === "English" ? 'en-US' : 'hi-IN',
  };

  // Create a request object with the audio content and configuration
  const request = {
    audio: audio,
    config: config,
  };

  // Perform speech recognition and wait for the results
  const finalText = await new Promise((resolve, reject) => {
    client.recognize(request)
      .then(data => {
        resolve(data);
      })
      .catch(err => {
        reject(err);
      });
  });
  // console.log("Response: ", finalText);

  // Extract transcriptions from the recognition results
  const transcription = finalText[0].results.map(r => r.alternatives[0].transcript).join("\n")
  // console.log(`Transcription: ${transcription}`);

  // Check if the transcription is empty and handle the error
  if (transcription === "") {
    res.status(405)
    throw new Error("The Transcription received from Google was Empty. Please Try Again")
  }

  // Send the transcribed text as the response
  res.json({ text: transcription })
}

const summarizeText = async (req, res) => {
  
  // Extract the 'text' from the request body
  const { text } = req.body
  // console.log(text);

  // Define the URL for the OpenAI API
  const url = "https://api.openai.com/v1/chat/completions"

  // Set the headers for the OpenAI API, typically containing an API key
  const headers = openaiHeaders

  // Define a prompt for the model, including instructions and the input text
  const prompt = "Please provide a concise summary of the following text. Begin with a brief paragraph \
          that explains what the text is about, followed by bullet points highlighting the key insights and takeaways \
          from the speech text. You can reference the input below."
  
  // Prepare the data for the API request, including the model, messages, and temperature
  const data = {
    "model": "gpt-3.5-turbo",
    "messages": [{ "role": "user", "content": `${prompt} ${text}` }],
    "temperature": 0.7
  }

  // Make a POST request to the OpenAI API with the provided data and headers
  const response = await axios.post(url, data, { headers })

  // Extract the summary from the API response
  const summary = response.data.choices[0].message.content
  // console.log("summary: ", summary);

  // Check if the summary is empty and handle the error
  if (summary === "") {
    res.status(405)
    throw new Error("The Summary Received from ChatGPT was Empty. Please Try Again")
  }

  // Prepare the result object with the text summary
  result = { text: summary }

  // Send the summary as the response
  res.json(result)
}

const convertSpeechToTextUsingAssemblyAI = async (req, res) => {
  // Extract the data from the request body
  const data = req.body
  // console.log("data received", data)

  // Retrieve the file URL from the data
  const fileURL = data.fileUrl
  // console.log(fileURL)

  // Define headers for making requests to AssemblyAI
  const headers = assemblyasiHeaders

  // Base URL for AssemblyAI API
  const baseUrl = 'https://api.assemblyai.com/v2'

  // Define the path to the audio file
  const path = fileURL

  // Read the audio file data from the specified path
  const audioData = await fs.readFile(path)

  // Send a POST request to AssemblyAI to upload the audio data
  const uploadResponse = await axios.post(`${baseUrl}/upload`, audioData, {
    headers
  })

  // Extract the upload URL from the response
  const uploadUrl = uploadResponse.data.upload_url

  // Prepare data for creating a transcription request
  const sendData = {
    audio_url: uploadUrl
  }

  // Define the URL for creating a new transcription
  const url = `${baseUrl}/transcript`

  // Send a POST request to initiate the transcription process
  const response = await axios.post(url, sendData, { headers: headers })

  // Extract the unique transcript ID
  const transcriptId = response.data.id
  
  // Define the polling endpoint to check the transcription status
  const pollingEndpoint = `${baseUrl}/transcript/${transcriptId}`

  // Continuously poll for the transcription result
  while (true) {

    // Send a GET request to the polling endpoint
    const pollingResponse = await axios.get(pollingEndpoint, {
      headers: headers
    })

    // Retrieve the transcription status and result
    const transcriptionResult = pollingResponse.data

    // Check if the transcription process is completed
    if (transcriptionResult.status === 'completed') {
      // console.log(transcriptionResult.text)

      // Extract the final transcribed text
      var finalText = transcriptionResult.text
      break

      // Check if there is an error in transcription
    } else if (transcriptionResult.status === 'error') {

      // Throw an error with the transcription failure message
      throw new Error(`Transcription failed: ${transcriptionResult.error}`)
    } else {
      
      // Wait for a short duration before polling again
      await new Promise((resolve) => setTimeout(resolve, 3000))
    }
  }

  // Respond with the final transcribed text
  res.json({ text: finalText })

}

module.exports = { uploadAudio, convertSpeechToText, convertSpeechToTextUsingAssemblyAI, summarizeText }