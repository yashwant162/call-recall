/* eslint-disable no-unused-vars */
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useReactMediaRecorder } from "react-media-recorder";
import { useDropzone } from "react-dropzone";
export default function useHomePage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [generatedText, setGeneratedText] = useState("");
  const [summarizedText, setSummarizedText] = useState("");
  const [isfilePresent, setIsFilePresent] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [request, setRequest] = useState(null);
  const [language, setLanguage] = useState("English");
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);

  useEffect(() => {
    let currentIndex = text1 ? text1.length : 0;
    if (!loading1 && currentIndex < generatedText.length) {
      const timer = setTimeout(() => {
        setText1(generatedText.slice(0, currentIndex + 1));
      }, 40);

      return () => clearTimeout(timer);
    }
  }, [text1, generatedText, loading1]);

  useEffect(() => {
    let currentIndex = text2 ? text2.length : 0;
    if (!loading2 && currentIndex < summarizedText.length) {
      const timer = setTimeout(() => {
        setText2(summarizedText.slice(0, currentIndex + 1));
      }, 30);

      return () => clearTimeout(timer);
    }
  }, [text2, summarizedText, loading2]);

  const { status, startRecording, stopRecording, mediaBlobUrl } =
    useReactMediaRecorder({
      audio: true,
      onStop: async (blobUrl) => {
        // console.log(status);
        setGeneratedText("");
        setSummarizedText("");
        setAudioBlob(blobUrl);
        stopRecording();
        const response = await fetch(blobUrl);
        const blob = await response.blob();
        const formData = new FormData();
        formData.append("audioFile", blob, "uploaded_audio.mp4");
        // console.log("sending audio");
        const fileName = await uploadAudio(formData);
        // console.log("using record", fileName);
        toast.success("File Recorded Successfully");
        setLoading1(true);
        setText1("");
        fileName.language = language;
        const text = await getGeneratedText(fileName);
        // console.log("text received", text);
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

  const uploadAudio = async (formData) => {
    try {
      var { data } = await axios.post(
        "http://localhost:5000/api/data/upload-audio",
        formData
      );
      // console.log("File uploaded successfully", data.fileUrl);
      return data;
    } catch (error) {
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

  const getGeneratedText = async (fileName) => {
    const request = axios.CancelToken.source();
    setRequest(request);

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/data/convert-to-text",
        fileName,
        { cancelToken: request.token }
      );
      // console.log("received text", data.text);
      return data.text;
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Request canceled:", error.message);
        setRequest(null);
      } else {
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

  const onDrop = useCallback(
    async (acceptedFiles) => {
      const file = acceptedFiles[0];
      setGeneratedText("");
      setSummarizedText("");
      setSelectedFile(null);
      if (file) {
        setSelectedFile(file);
        setIsFilePresent(true);
        const formData = new FormData();
        formData.append("audioFile", file);

        var fileName = await uploadAudio(formData);
        // console.log(fileName);
        if (fileName === null) {
          setSelectedFile(null);
          setIsFilePresent(false);
          setGeneratedText("");
          setText1("");
          return;
        }
        // console.log("file name received using dropbox", fileName);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setIsFilePresent(false);
        setLoading1(true);
        setText1("");
        fileName.language = language;
        // console.log("lang",language);
        const text = await getGeneratedText(fileName);
        // console.log(text);
        if (text === null) {
          setLoading1(false);
          setSelectedFile(null);
          return;
        }
        setGeneratedText(text);
        setLoading1(false);
      }
    },
    [language]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {"audio/*":['.mp3', '.wav', '.ogg', '.flac', '.aac', '.mp4']}
  });

  const summarizeText = async () => {
    if (loading2) {
      return;
    }

    if (generatedText == "") {
      setLoading2(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setLoading2(false);
      return;
    }
    setLoading2(true);

    const request = axios.CancelToken.source();
    setRequest(request);

    const sendData = {
      text: generatedText,
    };
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/data/summarize-text",
        sendData,
        { cancelToken: request.token }
      );
      // console.log(data.text);
      setText2("");
      toast.success("Text summarized successfully.");
      setSummarizedText(data.text);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Request canceled:", error.message);
        setRequest(null);
      } else {
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

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }

    setIsRecording(!isRecording);
  };

  const toggleLanguage = () => {
    if (language === "English") {
      setLanguage("Hindi");
    } else {
      setLanguage("English");
    }
  };

  const handleCancelRequest = () => {
    if (request) {
      request.cancel();
      toast.info("Request Canceled.");
    }
  };

  return {
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
    getRootProps,
    getInputProps,
    isDragActive,
    summarizeText,
    toggleRecording,
    toggleLanguage,
    handleCancelRequest
  };
}
