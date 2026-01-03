import { createRoot } from 'react-dom/client'
import './index.css'
import App from "./App.tsx"
import { BrowserRouter } from 'react-router'
import {AuthProvider} from './contexts/auth.context'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <AuthProvider>
        <App />
    </AuthProvider>
  </BrowserRouter>,
)