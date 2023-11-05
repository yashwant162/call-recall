import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UploadLogo from "../../components/svg/UploadLogo";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import LoadingDots from "../../components/common/LoadingDots";
import Spinner from "../../components/common/Spinner";
import MicIcon from "../../components/svg/MicIcon";
import CopyIcon from "../../components/svg/CopyIcon";
import useHomePage from "./useHomePage";

export default function HomePage() {
  const {
    selectedFile,
    generatedText,
    summarizedText,
    isfilePresent,
    audioBlob,
    isRecording,
    text1,
    text2,
    language,
    loading1,
    loading2,
    getRootProps,
    getInputProps,
    isDragActive,
    summarizeText,
    toggleRecording,
    toggleLanguage,
    handleCancelRequest,
  } = useHomePage();

  return (
    <div className="h-full mb-4 mt-4 w-full">
      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        style={{ fontSize: "12px" }}
      />
      <div className="flex flex-col lg:mb-4">
        <div className="flex flex-col sm:flex-row md:flex-row lg:flex-row justify-center items-center lg:gap-6 md:gap-6 sm:gap-4 gap-4 mb-4 lg:pl-20 lg:pr-20">
          <div
            title="Drop or upload audio files here"
            {...getRootProps()}
            className="flex flex-col items-center justify-center lg:w-96 lg:h-32 border-2 border-gray-600 border-dashed
              rounded-lg cursor-pointer bg-primary bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-gray-700 via-gray-900 to-black transition duration-300 ease-in-out
              py-2 px-2  hover:border-fourth"
          >
            <div className="flex flex-col items-center justify-center">
              {isfilePresent === false && selectedFile === null && (
                <div className="flex flex-col items-center justify-center ">
                  <UploadLogo />
                  {audioBlob !== null ? (
                    <div className="flex flex-col gap-2 justify-center items-center text-gray-500 font-semibold tracking-wider text-md">
                      <span className="text-sm font-extralight">
                        (Click to add another file)
                      </span>
                      <p>recorded_audio.mp4</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center">
                      <p className="mb-2 text-sm text-gray-500 tracking-wider">
                        <span className="font-semibold hover:text-fourth tracking-tighter">
                          Click to upload
                        </span>{" "}
                        or drag and drop
                      </p>
                      <p className=" text-xs text-gray-500 tracking-wider hidden md:hidden lg:block">
                        MP3, MP4, WAV or AAC
                      </p>
                    </div>
                  )}
                </div>
              )}
              {isfilePresent === true && selectedFile !== null && (
                <div className="flex flex-row gap-2 items-center text-gray-500 font-semibold tracking-wider text-md">
                  <Spinner />
                  <div>Uploading File</div>
                </div>
              )}
              {isDragActive &&
                selectedFile === null &&
                isfilePresent === false && (
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400 font-semibold">
                    Drop the file here
                  </p>
                )}
              {selectedFile !== null && isfilePresent === false && (
                <div className="flex flex-col gap-2 justify-center items-center text-gray-500 font-semibold tracking-wider text-md">
                  <UploadLogo />
                  <span className="text-sm font-extralight">
                    {" "}
                    (Click to add another file)
                  </span>
                  <p>
                    {selectedFile.name} {(selectedFile.size / 1024).toFixed(1)}{" "}
                    KB
                  </p>
                </div>
              )}
            </div>
          </div>
          <input {...getInputProps()} className="hidden" />
          <div className=" inline-flex items-center justify-center text-gray-500 font-semibold tracking-wider text-md lg:w-40 lg:h-32">
            OR
          </div>
          <div className="flex flex-col lg:flex-row md:flex-row sm:flex-row items-center tracking-wider lg:w-96 lg:h-32 md:w-56 md:h-14 lg:gap-5 md:gap-3 sm:gap-2 gap-2 text-red-400">
            <button
              title="Click to record your own audio"
              onClick={toggleRecording}
              className={` font-medium rounded-full text-sm lg:px-6 lg:py-6 md:px-4 md:py-4 sm:px-4 sm:py-4 px-4 py-4 text-center inline-flex hover:text-white 
                 items-center ${
                   isRecording
                     ? " border border-green-500 hover:bg-green-700 text-green-400"
                     : "text-red-500 border border-fourth hover:bg-red-600 "
                 } `}
            >
              <MicIcon />
            </button>
            <span
              className={`${isRecording ? "text-green-400" : "text-red-500"}`}
            >
              {isRecording ? "Recording" : "Record your voice"}
            </span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-col md:flex-col lg:flex-row lg:pl-20 lg:pr-20 md:pl-14 md:pr-14 sm:pl-14 sm:pr-14 md:flew-col items-center justify-between lg:mt-4 mb-4">
          <div
            className="relative w-4/5 lg:w-2/5 md:w-4/5 sm:w-4/5 h-[50vh] border border-fourth p-2 rounded-lg bg-primary bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-gray-700 via-gray-900 to-black"
            title="Transcribed text will come here"
          >
            {loading1 ? (
              <div className="flex flex-col items-center justify-center h-full gap-4">
                <LoadingDots />
                <div
                  onClick={handleCancelRequest}
                  className="text-md font-semibold cursor-pointer text-gray-500 hover:text-gray-300 gap-2"
                >
                  Cancel Request
                </div>
              </div>
            ) : (
              <textarea
                className="w-full h-full tracking-wider text-white font-semibold text-opacity-75 p-2 resize-none focus:outline-none placeholder:tracking-wider placeholder:text-white placeholder:text-opacity-30 placeholder:font-semibold cursor-default bg-primary bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))]"
                placeholder="Speech generated text will come here"
                readOnly
                value={text1}
              />
            )}
            <CopyIcon textToCopy={generatedText} />
          </div>

          <div className="flex flex-col justify-center items-center lg:gap-8 md:gap-6 sm:gap-6 gap-6 md:my-6 mx-6 my-6 lg:mx-6">
            <div>
              <button
                title="Click to toggle the language for which you want to process the audio"
                onClick={toggleLanguage}
                className={` rounded-full text-md px-4 py-4 text-center inline-flex hover:border-gray-300 
                 font-semibold text-gray-300  items-center border border-gray-600`}
              >
                <p className="w-3 h-3 inline-flex items-center justify-center">
                  {language === "English" ? "En" : "ह"}
                </p>
              </button>
            </div>
            <button
              onClick={generatedText && summarizeText}
              className={` ${
                generatedText
                  ? " group bg-gradient-to-br from-fourth to-white group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white"
                  : "text-gray-700 bg-gray-800"
              }  relative inline-flex items-center justify-center p-0.5 overflow-hidden text-lg font-medium rounded-lg `}
            >
              <span
                className={` ${
                  generatedText
                    ? "transition-all ease-in duration-75 bg-gray-900 rounded-md group-hover:bg-opacity-0 hover:text-gray-800 "
                    : "transition-all ease-in duration-75 bg-gray-900 rounded-md group-hover:bg-opacity-0"
                } font-semibold relative px-5 py-2.5 `}
              >
                <div
                  title="Click to generate summary"
                  className="flex flex-row items-center tracking-wider"
                >
                  {loading2 && <LoadingSpinner />}
                  {!loading2 && "Convert"}
                </div>
              </span>
            </button>
          </div>

          <div
            className="relative w-4/5 lg:w-2/5 md:w-4/5 sm:w-4/5 h-[50vh] border border-fourth p-2 rounded-lg bg-primary bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-gray-700 via-gray-900 to-black"
            title="Summarized text will come here"
          >
            {loading2 ? (
              <div className="flex flex-col items-center justify-center h-full gap-4">
                <LoadingDots />
                <div
                  onClick={handleCancelRequest}
                  className="text-md font-semibold cursor-pointer text-gray-500 hover:text-gray-300 gap-2"
                >
                  Cancel Request
                </div>
              </div>
            ) : (
              <textarea
                className="w-full h-full tracking-wider text-white font-semibold text-opacity-75 p-2 resize-none focus:outline-none placeholder:tracking-wider placeholder:text-white placeholder:text-opacity-30 placeholder:font-semibold cursor-default bg-primary bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))]"
                placeholder="Summarized text will be displayed here"
                readOnly
                value={text2}
              />
            )}
            <CopyIcon textToCopy={summarizedText} />
          </div>
        </div>
      </div>
    </div>
  );
}
