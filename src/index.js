import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

import "bootstrap/dist/css/bootstrap.min.css";
import { HelmetProvider } from "react-helmet-async";
import { StoreProvider } from "./Store";

ReactDOM.render(
  <StoreProvider>
    <HelmetProvider>
      <PayPalScriptProvider deferLoading={true}>
        <App />
      </PayPalScriptProvider>
    </HelmetProvider>
  </StoreProvider>,
  document.getElementById("root")
);
