import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { HostName } from "./client/ApiClient";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "@fontsource/roboto/900.css";
import "./index.css";
import axios, { AxiosError } from "axios";
import store from "./store/ReduxStore";

//redux configuration
// axios configuration
axios.defaults.baseURL = HostName;
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log(error);
    return error;
  }
);
console.log("main js ");

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Router>
    <Provider store={store}>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </Provider>
  </Router>
);
