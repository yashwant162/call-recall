import { Outlet } from "react-router-dom";
import Header from "./header/Header";
import Footer from "./footer/Footer";
export default function Layout() {
  return (
    <div id="layout" className="p-0 flex flex-col min-h-screen bg-primary flex-grow-1">
      <Header />
      <Outlet />
      <Footer/>
    </div>
  );
}
