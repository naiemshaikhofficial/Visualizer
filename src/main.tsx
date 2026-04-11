import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { initiateSecurityGuards } from './utils/security'

// LEVEL 3: NUCLEAR PROTECTION KERNEL
initiateSecurityGuards();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
