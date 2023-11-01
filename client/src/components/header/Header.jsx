/* eslint-disable no-unused-vars */

import { Link } from "react-router-dom";
import Logo from "../svg/Logo";

export default function Header() {
  return (
    <header
      className="w-full flex flex-row justify-between items-center bg-secondary
                          h-15 py-3 flex-grow-1"
    >
      <Link to={"/"} className="flex items-center gap-1 ml-2">
        <Logo />
        <div className="font-bold text-4xl text-slate-6 whitespace-nowrap">
          Call-Recall
        </div>
      </Link>
    </header>
  );
}
