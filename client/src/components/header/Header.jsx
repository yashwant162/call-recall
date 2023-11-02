/* eslint-disable no-unused-vars */

import { Link } from "react-router-dom";
import Logo from "../svg/Logo";

export default function Header() {
  return (
    <header
      className="w-full flex flex-col justify-between items-start 
                          h-15 py-3 px-4 flex-grow-1 bg-fifth mt-2"
    >
      {/* bg-gradient-to-r from-rose-100 to-teal-100 */}
      <div className="flex flex-row">
        <Link to={"/"} className="flex items-center gap-1 ml-2">
          <Logo />
          <div className="font-bold text-4xl bg-gradient-to-r from-white via-fourth to-fourth text-transparent bg-clip-text whitespace-nowrap tracking-wider">
            Call-Recall
          </div>
        </Link>
      </div>
      <div className="flex flex-row w-full items-center justify-center mt-2 " >
        <div className="h-[2px] border border-b w-full" style={{ background: 'linear-gradient(to right, rgb(195, 141, 147), rgb(255, 255, 255), rgb(195, 141, 147))', borderImage: 'linear-gradient(to right, rgb(195, 141, 147), rgb(195, 141, 147), rgb(255, 255, 255)) 1', borderImageSlice: 1 }} ></div>
      </div>
    </header>
  );
}
