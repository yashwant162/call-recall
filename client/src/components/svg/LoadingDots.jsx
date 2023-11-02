export default function LoadingDots() {
  return (
    <div className="flex space-x-2 justify-center items-center h-full bg-primary bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-gray-700 via-gray-900 to-black">
      <span className="sr-only"></span>
      <div className="h-4 w-4 bg-fourth rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="h-4 w-4 bg-fourth rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="h-4 w-4 bg-fourth rounded-full animate-bounce"></div>
    </div>
  );
}
