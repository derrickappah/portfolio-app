import React from "react";
import ReactDOM from "react-dom/client";
import "@/index.css";
import App from "@/App";

// Make Supabase available globally for testing
import { supabase } from "./lib/supabase";
if (typeof window !== 'undefined') {
  window.supabase = supabase;
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
