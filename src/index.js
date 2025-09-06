import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { GoogleOAuthProvider } from "@react-oauth/google";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
   <GoogleOAuthProvider clientId="885873323934-j4s6c3qsdg72vvtkh2f3325p8dddv28i.apps.googleusercontent.com">
    <Provider store={store}>
    <App />
  </Provider>
  </GoogleOAuthProvider>
);
