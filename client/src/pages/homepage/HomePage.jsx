import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";

export default function HomePage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [generatedText, setGeneratedText] = useState("")
  const [summarizedText, setSummarizedText] = useState("")
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    setSummarizedText("")
    if (file) {
      setSelectedFile(file);
      const formData = new FormData();
      formData.append("audioFile", file);
      try {
        var fileName = await axios.post("http://localhost:5000/api/data/upload-audio", formData)
        console.log("File uploaded successfully", fileName);
      } catch(error) {
        console.error("File upload error", error);
      }
      setLoading1(true)
      const {data} = await axios.post("http://localhost:5000/api/data/convert-to-text",fileName)
      const text = data.text
      console.log(text)
      setGeneratedText(text)
      setLoading1(false)
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({onDrop,accept: "audio/*"});

  const summarizeText = async () => {
    const sendData = {
      text: generatedText
    }
    // const sendData = {
    //   text: "Say hello"
    // }
    setLoading2(true)
    const {data} = await axios.post("http://localhost:5000/api/data/summarize-text", sendData)
    console.log(data.text)
    setSummarizedText(data.text)
    setLoading2(false)
  }

  return (
    <div className="h-full mb-4 mt-4 w-full">
      <div className="flex flex-col ">
        <div className="flex flex-row justify-center items-center">
          <div>
            <div
              {...getRootProps()}
              className="bg-blue-500 text-white py-2 px-4 rounded-lg ml-4 cursor-pointer"
            >
              {isDragActive
                ? "Drop the file here"
                : "Click or drag a file to upload"}
          {selectedFile && (
            <div className="">
              <p>{selectedFile.name} {selectedFile.size/1024} KB</p>
              <p></p>
            </div>
          )}
            </div>
            <input {...getInputProps()} className="hidden" />
          </div>
          <button className="bg-blue-500 text-white py-2 px-4 rounded-lg  d-lg ml-4">
            Record Voice
          </button>
        </div>
        <div className="lg:flex lg:flex-row lg:items-center lg:justify-between lg:mt-4 sm:flex sm:flex-col sm:justify-center sm:items-center">
          <textarea
            className="w-2/5 h-[70vh] p-2 border border-gray-300 rounded-lg mb-4 resize-none"
            placeholder="Speech generated text will come here"
            readOnly
            value={loading1 ? 'Generating Text...' : generatedText}
          ></textarea>
          {generatedText && (<button className="bg-blue-500 text-white py-2 px-4 rounded-lg ml-4"
            onClick={summarizeText}
          >
            Convert
          </button>)}
          <textarea
            className="w-2/5 h-[70vh] p-2 border border-gray-300 rounded-lg resize-none"
            placeholder="Summarized text will be displayed here"
            readOnly
            value={loading2 ? 'Summarizing Text...' : summarizedText}
          ></textarea>
        </div>
      </div>
    </div>
  );
}
