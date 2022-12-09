import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "@fontsource/roboto/900.css";
import "./index.css";
import axios from "axios";

localStorage.setItem(
  "token",
  JSON.stringify(
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzhiMjM4NTQ4YmE2ZDFhMzFlNGZiMjciLCJyb2xlIjoiVVNFUiIsImlhdCI6MTY3MDUwOTUzNH0.UnML6lk0QwxfDSZxwveVNZG1BTslCWJmklNaPQDdvWE"
  )
);
localStorage.setItem("userId", JSON.stringify("638b238548ba6d1a31e4fb27"));

axios.defaults.baseURL = "http://localhost:5000/";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>
);
