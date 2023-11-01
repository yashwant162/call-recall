import "./App.css";
import axios from "axios";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/homepage/HomePage";

axios.defaults.baseURL = "http://127.0.0.1:5000";
axios.defaults.withCredentials = true;
function App() {
  return (
      <Routes>
        <Route path='/' element={<Layout/>}>
            <Route index element={<HomePage/>} />
        </Route>
      </Routes>
  );
}

export default App;
