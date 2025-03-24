import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import {store} from './app/store.ts'
import {persistedStore} from './app/store.ts'
import App from './App.tsx'
import './index.css'
import { PersistGate } from 'redux-persist/integration/react'

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistedStore}>
  <StrictMode>
    <App />
  </StrictMode>
  </PersistGate> 
  </Provider>
)
