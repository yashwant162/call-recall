// Import necessary dependencies and styles
import "./App.css";
import axios from "axios";
import { Routes, Route } from "react-router-dom";

// Import components and pages
import Layout from "./components/Layout";
import HomePage from "./pages/homepage/HomePage";

// Configuring the default Axios settings for our API requests
axios.defaults.baseURL = "http://localhost:5000";
axios.defaults.withCredentials = true;

// Define the main App component including Routes.
function App() {
  return (
      <Routes>
        <Route path='/' element={<Layout/>}>
            <Route index element={<HomePage/>} />
        </Route>
      </Routes>
  );
}

// Export the App component as the main entry point of our application
export default App;
