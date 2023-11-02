const axios = require('axios');
const fs = require('fs-extra');
const assemblyasiHeaders = require("../services/assemblyaiClient");
const openaiHeaders = require("../services/openai")
const testApi = (req, res) => {
  result = {
    "Success": true
  }
  res.json(result)
}

const uploadAudio = (req, res) => {
  console.log(req.body.formData);
  const uploadedFile = req.file;

  if (uploadedFile) {
    const fileUrl = uploadedFile.path;
    console.log('File stored at:', fileUrl);
    res.json({ success: true, fileUrl });
  } else {
    res.status(400).json({ success: false, message: 'No file uploaded' });
  }
}

const convertSpeechToText = async (req, res) => {
  const {data} = req.body
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

  res.json({text: finalText})

} 

const summarizeText = async (req, res) => {
  console.log("came here");
  const {text} = req.body
  console.log(text);

  const url = "https://api.openai.com/v1/chat/completions"
  const headers = openaiHeaders
  const prompt = "Summarize this text first a brief paragarh of what its about then in bulletins \
                the key takeaways of the speech text. the input is"
  const data = {
    "model": "gpt-3.5-turbo",
    "messages": [{"role": "user", "content": `${prompt} ${text}`}],
    "temperature": 0.7
  }

  const response = await axios.post(url, data, {headers})
  console.log(response.data.choices[0].message.content);

  result = {text : response.data.choices[0].message.content}
  res.json(result)
}

module.exports = { testApi, uploadAudio, convertSpeechToText, summarizeText }