export default function HomePage() {
  return (
    <div className="h-full mb-4 mt-4 w-full">
      <div className="flex flex-col ">
        <div className="flex flex-row justify-center items-center">
        <button className="bg-blue-500 text-white py-2 px-4 rounded-lg ml-4">
            Upload File
          </button>
          <button className="bg-blue-500 text-white py-2 px-4 rounded-lg ml-4">
            Record Voice
          </button>
        </div>
        <div className="lg:flex lg:flex-row lg:items-center lg:justify-between lg:mt-4 sm:flex sm:flex-col sm:justify-center sm:items-center">
          <textarea
            className="w-2/5 h-[70vh] p-2 border border-gray-300 rounded-lg mb-4"
            placeholder="Enter JSON here"
          ></textarea>
          <button className="bg-blue-500 text-white py-2 px-4 rounded-lg ml-4">
            Convert
          </button>
          <textarea
            className="w-2/5 h-[70vh] p-2 border border-gray-300 rounded-lg"
            placeholder="Prettified JSON will appear here"
            readOnly
          ></textarea>
        </div>
      </div>
    </div>
  );
}
