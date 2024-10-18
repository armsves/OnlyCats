import React from "react"
import "./index.css"
import App from "./App"
import { AuthProvider } from "./auth";
import { createRoot } from 'react-dom/client';
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<React.StrictMode>
  <AuthProvider>
    <ToastContainer autoClose={700} />
    <App />
  </AuthProvider>
</React.StrictMode>
);
