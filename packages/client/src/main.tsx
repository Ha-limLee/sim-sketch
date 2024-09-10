import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { persistor, store } from "./app/store";
import { Provider } from "react-redux";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import { ThemeProvider } from "@mui/material/styles";
import { customTheme } from "./features/theme/theme";
import { PersistGate } from "redux-persist/integration/react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([{ path: "/", element: <App /> }]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ThemeProvider theme={customTheme}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </PersistGate>
  </Provider>,
);
