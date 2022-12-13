import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "@fontsource/roboto/900.css";
import "./index.css";
import axios from "axios";
import Store from "./store/ReduxStore";

//redux configuration

// axios configuration
axios.defaults.baseURL = "http://localhost:5000/";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Router>
    <Provider store={Store}>
      <App />
    </Provider>
  </Router>
);
