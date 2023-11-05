/* eslint-disable no-unused-vars */

// Import necessary libraries and components
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useReactMediaRecorder } from "react-media-recorder";
import { useDropzone } from "react-dropzone";

/**
 * Custom React hook for managing the functionality of the homepage.
 * This hook encapsulates the state management and logic for audio recording,
 * file upload, text generation, and summarization, language selection, and more.
 * @returns {Object} An object containing various state variables and functions
 * to be used in the homepage component.
 */
export default function useHomePage() {

  // State variables for managing various aspects of the homepage
  const [selectedFile, setSelectedFile] = useState(null); // Selected audio file
  const [generatedText, setGeneratedText] = useState(""); // Transcribed text
  const [summarizedText, setSummarizedText] = useState(""); // Summarized text
  const [isfilePresent, setIsFilePresent] = useState(false); // Flag for file presence
  const [audioBlob, setAudioBlob] = useState(null); // Recorded audio blob
  const [isRecording, setIsRecording] = useState(false); // Flag for audio recording
  const [text1, setText1] = useState(""); // Partial transcribed text
  const [text2, setText2] = useState(""); // Partial summarized text
  const [request, setRequest] = useState(null); // Axios request object
  const [language, setLanguage] = useState("English"); // Selected language
  const [loading1, setLoading1] = useState(false); // Flag for loading transcribed text
  const [loading2, setLoading2] = useState(false); // Flag for loading summarized text

  // Effect to animate the display of generated text (transcribed)
  useEffect(() => {
    let currentIndex = text1 ? text1.length : 0;
    if (!loading1 && currentIndex < generatedText.length) {
      const timer = setTimeout(() => {
        setText1(generatedText.slice(0, currentIndex + 1));
      }, 40);

      return () => clearTimeout(timer);
    }
  }, [text1, generatedText, loading1]);

  // Effect to animate the display of summarized text
  useEffect(() => {
    let currentIndex = text2 ? text2.length : 0;
    if (!loading2 && currentIndex < summarizedText.length) {
      const timer = setTimeout(() => {
        setText2(summarizedText.slice(0, currentIndex + 1));
      }, 30);

      return () => clearTimeout(timer);
    }
  }, [text2, summarizedText, loading2]);

  // audio recording using the useReactMediaRecorder hook
  const { status, startRecording, stopRecording, mediaBlobUrl } =
    useReactMediaRecorder({
      audio: true,
      onStop: async (blobUrl) => {
        // console.log(status);
        setGeneratedText("");
        setSummarizedText("");
        setAudioBlob(blobUrl);
        stopRecording();

        // Fetch and upload the recorded audio
        const response = await fetch(blobUrl);
        const blob = await response.blob();
        const formData = new FormData();
        formData.append("audioFile", blob, "uploaded_audio.mp4");
        // console.log("sending audio");
        const fileName = await uploadAudio(formData);
        // console.log("using record", fileName);

        // Handle the case when the audio file could not be uploaded.
        if (fileName === null) {
          setSelectedFile(null);
          setAudioBlob(null);
          setIsFilePresent(false);
          setGeneratedText("");
          setText1("");
          return;
        }

        // Set loading state and fetch transcribed text
        toast.success("File Recorded Successfully");
        setLoading1(true);
        setText1("");
        fileName.language = language;
        const text = await getGeneratedText(fileName);
        // console.log("text received", text);

        // Handle the case when the uploaded audio could not be processed or the result came as empty.
        if (text === null) {
          // console.log("text === null");
          setLoading1(false);
          setSelectedFile(null);
          setAudioBlob(null);
          return;
        }
        setGeneratedText(text);
        setLoading1(false);
      },
    });

  // Function to upload audio file to the server  
  const uploadAudio = async (formData) => {
    try {
      var { data } = await axios.post(
        "/api/data/upload-audio",
        formData
      );
      // console.log("File uploaded successfully", data.fileUrl);
      return data;
    } catch (error) {
      // Handle and log errors using toast during audio upload.
      const errorTitle = error.response.data.title;
      const errorMessage = error.response.data.message;
      toast.error(
        <p>
          {errorTitle}
          <br />
          {errorMessage}
        </p>
      );
      console.error("File upload error", error.response);
      return null;
    }
  };

  // Function to get transcribed text from the server
  const getGeneratedText = async (fileName) => {

    // using axios CancelToken to allow request to be cancellled manually.
    const request = axios.CancelToken.source();
    setRequest(request);

    try {
      const { data } = await axios.post(
        "/api/data/convert-to-text",
        fileName,
        { cancelToken: request.token }
      );
      // console.log("received text", data.text);
      return data.text;
    } catch (error) {
      if (axios.isCancel(error)) {
        // Request was canceled, handle accordingly
        console.log("Request canceled:", error.message);
        setRequest(null);
      } else {
        // Handle and log errors during text generation
        const errorTitle = error.response.data.title;
        const errorMessage = error.response.data.message;
        toast.error(
          <p>
            {errorTitle}
            <br />
            {errorMessage}
          </p>
        );
        console.error("Text Generation error", error.response);
      }
      return null;
    }
  };

  // Callback for handling dropped files using the Dropzone
  const onDrop = useCallback(
    async (acceptedFiles) => {
      // Get the first accepted file
      const file = acceptedFiles[0];

      // Clear any existing generated and summarized text
      setGeneratedText("");
      setSummarizedText("");
      setSelectedFile(null);

      if (file) {
        // Set the selected file and indicate that a file is present
        setSelectedFile(file);
        setIsFilePresent(true);

        // Create a FormData object and append the selected file
        const formData = new FormData();
        formData.append("audioFile", file);

        // Upload the audio file and get the file name
        var fileName = await uploadAudio(formData);
        
        // console.log(fileName);

        if (fileName === null) {
          // If file upload fails, reset the state and return
          setSelectedFile(null);
          setIsFilePresent(false);
          setGeneratedText("");
          setText1("");
          return;
        }
        
        // Add a delay to simulate processing and remove the file presence indicator
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setIsFilePresent(false);
        setLoading1(true);
        setText1("");

        // Set the language of the file name and get generated text
        fileName.language = language;
        const text = await getGeneratedText(fileName);
        
        // console.log(text);
        if (text === null) {
          // If text generation fails, reset the state and return
          setLoading1(false);
          setSelectedFile(null);
          return;
        }

        // Update the generated text and reset the loading state
        setGeneratedText(text);
        setLoading1(false);
      }
    },
    [language]
  );
  
  // UseDropzone hook to manage file drop functionality
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, // Attach the onDrop callback
    accept: { // Specify accepted file formats
      "audio/*":['.mp3', '.wav', '.ogg', '.flac', '.aac', '.mp4']
    }
  });

  // Function to summarize text
  const summarizeText = async () => {
    if (loading2) {
      return; // Do nothing if already loading
    }

    if (generatedText == "") {
      // If there's no generated text, simulate loading and return
      setLoading2(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setLoading2(false);
      return;
    }
    setLoading2(true);

    // Create a cancel token for the request
    const request = axios.CancelToken.source();
    setRequest(request);

    const sendData = {
      text: generatedText, // Data to send for text summarization
    };
    try {
      const { data } = await axios.post(
        "/api/data/summarize-text",
        sendData,
        { cancelToken: request.token }
      );
      // console.log(data.text);

      setText2(""); // Clear existing text2
      toast.success("Text summarized successfully.");
      setSummarizedText(data.text); // Set the summarized text
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Request canceled:", error.message);
        setRequest(null);
      } else {

        // Handle error and show a toast message
        toast.error(
          <p>
            Something went wrong.
            <br />
            Text could not be summarized. <br />
            Please Try Again
          </p>,
          { position: "bottom-center" }
        );
        // console.log(err);
      }
    }
    setLoading2(false);
  };
  // Function to toggle recording audio
  const toggleRecording = () => {
    if (isRecording) {
      stopRecording(); // Stop recording if already recording
    } else {
      startRecording(); // Start recording if not already recording
    }

    setIsRecording(!isRecording); // Toggle the recording state
  };

  // Function to toggle the language setting between English and Hindi
  const toggleLanguage = () => {
    if (language === "English") {
      setLanguage("Hindi"); // Set to Hindi if it was English before
      toast.info("Language is set to Hindi")
    } else {
      setLanguage("English"); // Set to English if it was Hindi before
      toast.info("Language is set to English",)
    }
  };

  // Function to handle canceling a request, if one is in progress
  const handleCancelRequest = () => {
    if (request) {
      request.cancel(); // Cancel the request if it exists and ongoing mainly for transcribing and summarizing.
      toast.info("Request Canceled."); // Show a toast message for the same
    }
  };

  // Exported functions and state variables for use in the homepage component
  return {
    // State variables
    selectedFile,
    setSelectedFile,
    generatedText,
    setGeneratedText,
    summarizedText,
    setSummarizedText,
    isfilePresent,
    setIsFilePresent,
    audioBlob,
    setAudioBlob,
    isRecording,
    setIsRecording,
    text1,
    setText1,
    text2,
    setText2,
    request,
    setRequest,
    language,
    setLanguage,
    loading1,
    setLoading1,
    loading2,
    setLoading2,
  
    // Functions and hooks
    getRootProps,
    getInputProps,
    isDragActive,
    summarizeText,
    toggleRecording,
    toggleLanguage,
    handleCancelRequest
  };
}
