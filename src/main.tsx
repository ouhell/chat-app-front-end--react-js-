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
import { GoogleOAuthProvider } from "@react-oauth/google";

//redux configuration
// axios configuration
axios.defaults.baseURL = HostName;
axios.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    console.log(error);
    return Promise.reject(error);
  }
);
console.log("main js ");

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Router>
    <Provider store={store}>
      <GoogleOAuthProvider clientId="731231285423-q3j4eiurg4gisql8m74imnmjj09uusb1.apps.googleusercontent.com">
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </GoogleOAuthProvider>
    </Provider>
  </Router>
);
