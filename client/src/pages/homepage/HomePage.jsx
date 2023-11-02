/* eslint-disable no-unused-vars */
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import UploadLogo from "../../components/svg/UploadLogo";
import LoadingSpinner from "../../components/svg/LoadingSpinner";
import LoadingDots from "../../components/svg/LoadingDots";
import Spinner from "../../components/svg/Spinner";

export default function HomePage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [generatedText, setGeneratedText] = useState("");
  const [summarizedText, setSummarizedText] = useState("");
  const [isfilePresent, setIsFilePresent] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    setSummarizedText("");
    if (file) {
      setSelectedFile(file);
      isfilePresent(true);
      const formData = new FormData();
      formData.append("audioFile", file);
      try {
        var fileName = await axios.post(
          "http://localhost:5000/api/data/upload-audio",
          formData
        );
        console.log("File uploaded successfully", fileName);
      } catch (error) {
        console.error("File upload error", error);
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
      isfilePresent(false);
      setLoading1(true);
      const { data } = await axios.post(
        "http://localhost:5000/api/data/convert-to-text",
        fileName
      );
      const text = data.text;
      console.log(text);
      setGeneratedText(text);
      setLoading1(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "audio/*",
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

    const sendData = {
      text: generatedText,
    };
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/data/summarize-text",
        sendData
      );
      console.log(data.text);
      setSummarizedText(data.text);
    } catch (err) {
      console.log(err);
    }
    setLoading2(false);
  };

  return (
    <div className="h-full mb-4 mt-4 w-full">
      <div className="flex flex-col lg:mb-4">
        <div className="flex flex-row justify-center items-center mb-4">
          <div
            {...getRootProps()}
            className="flex flex-col items-center justify-center lg:w-96 lg:h-32 border-2 border-gray-600 border-dashed
              rounded-lg cursor-pointer bg-primary bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-gray-700 via-gray-900 to-black transition duration-300 ease-in-out
              py-2 px-2  hover:border-fourth"
          >
            <div className="flex flex-col items-center justify-center">
              {isfilePresent === false ? (
                <div className="flex flex-col items-center justify-center ">
                  <UploadLogo />
                  <p className="mb-2 text-sm text-gray-500 tracking-wider">
                    <span className="font-semibold hover:text-fourth tracking-tighter">
                      Click to upload
                    </span>{" "}
                    or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 tracking-wider">
                    MP3, MP4, WAV or AAC
                  </p>
                </div>
              ) : (
                <div className="flex flex-row gap-2 items-center text-gray-500 font-semibold tracking-wider text-md">
                  <Spinner />
                  <div>Uploading File</div>
                </div>
              )}
              {isDragActive && selectedFile === null && (
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400 font-semibold">
                  Drop the file here
                </p>
              )}
            </div>

            {/* {selectedFile && (
                <div className="">
                  <p>
                    {selectedFile.name} {(selectedFile.size / 1024).toFixed(1)}{" "}
                    KB
                  </p>
                  <p></p>
                </div>
              )} */}
          </div>
          <input {...getInputProps()} className="hidden" />
        </div>
        <div className="lg:pl-20 lg:pr-20 lg:flex lg:flex-row lg:items-center lg:justify-between lg:mt-4 sm:flex sm:flex-col sm:justify-center sm:items-center">
          {/* <textarea
            className="w-2/5 h-[50vh] tracking-wider font-semibold text-opacity-75 text-white p-2 border border-fourth rounded-lg resize-none focus:outline-none placeholder:tracking-wider placeholder:text-white placeholder:text-opacity-30 placeholder:font-semibold bg-primary bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-gray-700 via-gray-900 to-black"
            placeholder="Speech generated text will come here"
            readOnly
            value={loading1 ? "Generating Text..." : generatedText}
          ></textarea> */}
          <div className="w-2/5 h-[50vh] border border-fourth p-2 rounded-lg bg-primary bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-gray-700 via-gray-900 to-black">
            {loading1 ? (
              <LoadingDots />
            ) : (
              <textarea
                className="w-full h-full tracking-wider text-white font-semibold text-opacity-75 p-2 resize-none focus:outline-none placeholder:tracking-wider placeholder:text-white placeholder:text-opacity-30 placeholder:font-semibold bg-primary bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))]"
                placeholder="Speech generated text will come here"
                readOnly
                value={generatedText}
              />
            )}
          </div>

          <button
            onClick={generatedText && summarizeText}
            className={` ${
              generatedText
                ? " group bg-gradient-to-br from-fourth to-white group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white"
                : "text-gray-700 bg-gray-800"
            } relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-lg font-medium rounded-lg `}
          >
            <span
              className={` ${
                generatedText
                  ? "transition-all ease-in duration-75 bg-gray-900 rounded-md group-hover:bg-opacity-0 hover:text-gray-800 "
                  : "transition-all ease-in duration-75 bg-gray-900 rounded-md group-hover:bg-opacity-0"
              } font-semibold relative px-5 py-2.5 `}
            >
              <div className="flex flex-row items-center tracking-wider">
                {loading2 && <LoadingSpinner />}
                {!loading2 && "Convert"}
              </div>
            </span>
          </button>

          <div className="w-2/5 h-[50vh] border border-fourth p-2 rounded-lg bg-primary bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-gray-700 via-gray-900 to-black">
            {loading2 ? (
              <LoadingDots />
            ) : (
              <textarea
                className="w-full h-full tracking-wider text-white font-semibold text-opacity-75 p-2 resize-none focus:outline-none placeholder:tracking-wider placeholder:text-white placeholder:text-opacity-30 placeholder:font-semibold bg-primary bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))]"
                placeholder="Summarized text will be displayed here"
                readOnly
                value={summarizedText}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
