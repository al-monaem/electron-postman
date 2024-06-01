import './assets/main.css'

import ReactDOM from 'react-dom/client'
import App from './App'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import store from './app/store'
import { persistStore } from 'redux-persist'

const persistor = persistStore(store)

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
)
