import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// Add this import to apply the required toast styles
import 'react-toastify/dist/ReactToastify.css'; 
import App from './App.jsx'
import { ToastContainer } from 'react-toastify';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToastContainer position="top-right" />
    <App />
  </StrictMode>,
)