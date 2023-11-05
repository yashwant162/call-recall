import GithubLogo from "../svg/GithubLogo";
import GmailLogo from "../svg/GmailLogo";

export default function Footer() {
  return (
    <footer className="mt-auto  bg-gradient-to-r from-fourth via-fourth to-white">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pb-2 text-center pt-2 text-gray-800 lg:text-sm md:text-sm text-xs font-semibold tracking-wider">
        <span>&copy; Call-Recall</span>
        <span>Yashwant Singh Rathore</span>
        <span>SKIT, JAIPUR</span>
        <span>+91-9588903532</span>
        <span>
          <a
            href="https://github.com/yashwant162"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="flex flex-row justify-center items-center gap-0">
              <GithubLogo /> yashwant162
            </div>
          </a>
        </span>
        <span>
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
        </span>
      </div>
    </footer>
  );
}
