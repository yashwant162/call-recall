// Import necessary dependencies and components
import { Outlet } from "react-router-dom";

// Import components and pages
import Header from "./header/Header";
import Footer from "./footer/Footer";

// Define the Layout component, which serves as the layout for our application
export default function Layout() {
  return (
    // Create a container div for the layout with flex properties
    <div className="p-0 flex flex-col min-h-screen flex-grow-1 bg-fifth">

      {/* Include the Header component at the top of the layout */}
      <Header />

      {/* Use the Outlet component to render child routes within the layout */}
      <Outlet />
      
      {/* Include the Footer component at the bottom of the layout */} 
      <Footer/>
    </div>
  );
}
