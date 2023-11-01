export default function Footer() {
  return (
    <footer
      className="mt-auto md:gap-6 px-20 text-gray-400
                          bg-ternary py-4 flex justify-between w-full text-sm items-center "
    >
      <ul className="flex gap-3 font-normal cursor-pointer items-center">
        <li>&copy; Call-Recall</li>

        <li>+91-9588903532</li>
        <li>
          <a href="mailto:yashwantsingh162@gmail.com" target="_blank" rel="noopener noreferrer">
            @yashwantsingh162@gmail.com
          </a>
        </li>
        <li>
          <a
            href="https://github.com/yashwant162"
            target="_blank"
            rel="noopener noreferrer"
          >
            yashwant162
          </a>
        </li>
      </ul>
      <ul className="flex gap-4 font-medium ">
        <li className="flex items-center gap-2 cursor-pointer">
          Yashwant Singh Rathore
        </li>
        <li className="cursor-pointer flex gap-1 items-center">SKIT, Jaipur</li>
        <li className="cursor-pointer flex gap-1 items-center">
        </li>
      </ul>
    </footer>
  );
}
