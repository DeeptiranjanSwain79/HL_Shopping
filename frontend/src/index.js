import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
import store from "./store";

import { positions, transitions, Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";

import {StripeProvider} from "react-stripe-elements"

const options = {
  timeout: 5000,
  position: positions.BOTTOM_CENTER,
  transition: transitions.SCALE,
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <StripeProvider apiKey="pk_test_51LUVg8SJg6C6AJ2flgbg37CNZ9nXcXgSvQlxzOdjQWxpKyvbaeAE422hs1WucdczuuUwRvFo97qTw5PZVSXsW36800MDobzCLO">
    <Provider store={store}>
      <AlertProvider template={AlertTemplate} {...options}>
        <App />
      </AlertProvider>
    </Provider>
  </StripeProvider>
);

