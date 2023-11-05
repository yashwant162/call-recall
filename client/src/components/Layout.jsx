import { Outlet } from "react-router-dom";
import Header from "./header/Header";
import Footer from "./footer/Footer";
export default function Layout() {
  return (
    <div className="p-0 flex flex-col min-h-screen flex-grow-1 bg-fifth">
      <Header />
      <Outlet />
      <Footer/>
    </div>
  );
}
