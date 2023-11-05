const axios = require('axios');
const fs = require('fs-extra');
const assemblyasiHeaders = require("../services/assemblyaiClient");
const openaiHeaders = require("../services/openai")
const speech = require('@google-cloud/speech');
const { spawnSync } = require('child_process');
process.env.GOOGLE_APPLICATION_CREDENTIALS = 'tmpyashwant.json'

const uploadAudio = async (req, res) => {

  const convertToWav = (inputPath, outputPath) => {
    const ffmpegPath = 'C:\\ffmpeg\\bin\\ffmpeg.exe';
    const args = [
      '-i', inputPath,
      '-f', 's16le',
      '-acodec', 'pcm_s16le',
      '-ar', '44100',
      '-ac', '1',
      outputPath
    ];
    const result = spawnSync(ffmpegPath, args);
    if (result.error) {
      console.error('Error:', result.error);
    } else {
      console.log('stdout:', result.stdout.toString());
      console.error('stderr:', result.stderr.toString());
      console.log('Exit code:', result.status);
    }
  }

  console.log(req.body.formData);
  const uploadedFile = req.file;

  if (uploadedFile) {
    var fileUrl = uploadedFile.path;
    console.log('File stored at:', fileUrl);

    // convert to .wav
    let parts = fileUrl.split('.');
    parts[parts.length - 1] = 'wav';
    let newFileUrl = parts.join('.');
    convertToWav(fileUrl, newFileUrl)
    console.log("converted");
    fileUrl = newFileUrl
    res.json({ success: true, fileUrl });
  } else {
    res.status(400).json({ success: false, message: 'No file uploaded' });
  }
}

const convertSpeechToText = async (req, res) => {
  const data = req.body
  console.log("data received", data)
  const fileURL = data.fileUrl
  console.log(fileURL)

  const client = new speech.SpeechClient();

  const file = await fs.readFile(fileURL)
  const audioBytes = file.toString('base64')

  const audio = {
    content: audioBytes,
  };

  const config = {
    encoding: 'LINEAR16',
    sampleRateHertz: 44100,
    languageCode: 'hi-IN',
  };

  const request = {
    audio: audio,
    config: config,
  };

  const finalText = await new Promise((resolve, reject) => {
    client.recognize(request)
      .then(data => {
        resolve(data);
      })
      .catch(err => {
        reject(err);
      });
  });
  console.log("Response: ", finalText);
  const transcription = finalText[0].results.map(r => r.alternatives[0].transcript).join("\n")
  console.log(`Transcription: ${transcription}`);

  res.json({ text: transcription })
}

const summarizeText = async (req, res) => {
  console.log("came here");
  const { text } = req.body
  console.log(text);

  const url = "https://api.openai.com/v1/chat/completions"
  const headers = openaiHeaders
  const prompt = "Summarize this text first a brief paragarh of what its about then in bulletins \
                the key takeaways of the speech text. the input is"
  const data = {
    "model": "gpt-3.5-turbo",
    "messages": [{ "role": "user", "content": `${prompt} ${text}` }],
    "temperature": 0.7
  }

  const response = await axios.post(url, data, { headers })
  console.log(response.data.choices[0].message.content);

  result = { text: response.data.choices[0].message.content }
  res.json(result)
}

const convertSpeechToTextUsingAssemblyAI = async (req, res) => {
  const data = req.body
  console.log("data received", data)
  const fileURL = data.fileUrl
  console.log(fileURL)
  const headers = assemblyasiHeaders
  const baseUrl = 'https://api.assemblyai.com/v2'
  const path = fileURL
  const audioData = await fs.readFile(path)
  const uploadResponse = await axios.post(`${baseUrl}/upload`, audioData, {
    headers
  })
  const uploadUrl = uploadResponse.data.upload_url
  const sendData = {
    audio_url: uploadUrl
  }
  const url = `${baseUrl}/transcript`
  const response = await axios.post(url, sendData, { headers: headers })

  const transcriptId = response.data.id
  const pollingEndpoint = `${baseUrl}/transcript/${transcriptId}`

  while (true) {
    const pollingResponse = await axios.get(pollingEndpoint, {
      headers: headers
    })
    const transcriptionResult = pollingResponse.data

    if (transcriptionResult.status === 'completed') {
      console.log(transcriptionResult.text)
      var finalText = transcriptionResult.text
      break
    } else if (transcriptionResult.status === 'error') {
      throw new Error(`Transcription failed: ${transcriptionResult.error}`)
    } else {
      await new Promise((resolve) => setTimeout(resolve, 3000))
    }
  }

  res.json({ text: finalText })

}

module.exports = { uploadAudio, convertSpeechToText, convertSpeechToTextUsingAssemblyAI, summarizeText }