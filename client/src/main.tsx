import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {BrowserRouter} from "react-router-dom";
import { Providers } from "./providers.tsx"
import { A } from 'node_modules/@daveyplate/better-auth-ui/dist/auth-ui-provider-3JMiYGSS';


createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Providers>
      <App />
    </Providers>
  </BrowserRouter>,
)
