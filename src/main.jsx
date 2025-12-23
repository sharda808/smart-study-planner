import { StrictMode } from 'react'
import React from 'react'

import { createRoot } from 'react-dom/client'
import './output.css'
import './index.css'
import App from './App.jsx'
import "./chartSetup.js";
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
<BrowserRouter>
    <App />
</BrowserRouter>
)
