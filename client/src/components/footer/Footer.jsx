import GithubLogo from "../svg/GithubLogo";
import GmailLogo from "../svg/GmailLogo";

export default function Footer() {
  return (
    <footer
      className="mt-auto md:gap-6 px-20 text-white bg-fifth
                           py-4 flex justify-between w-full text-sm items-center tracking-wider"
    >
      <ul className="flex gap-5 font-semibold cursor-pointer items-center">
        <li>&copy; Call-Recall</li>

        <li>+91-9588903532</li>
        <li>
          <a
            href="mailto:yashwantsingh162@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="flex flex-row justify-center items-center gap-0">
              <GmailLogo />
              yashwantsingh162@gmail.com
            </div>
          </a>
        </li>
        <li>
          <a
            href="https://github.com/yashwant162"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="flex flex-row justify-center items-center gap-0">
              <GithubLogo /> yashwant162
            </div>
          </a>
        </li>
      </ul>
      <ul className="flex gap-4 font-medium tracking-wider">
        <li className="flex items-center gap-2 cursor-pointer">
          Yashwant Singh Rathore
        </li>
        <li className="cursor-pointer flex gap-1 items-center">SKIT, Jaipur</li>
        <li className="cursor-pointer flex gap-1 items-center"></li>
      </ul>
    </footer>
  );
}
