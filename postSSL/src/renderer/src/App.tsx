import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { Layout } from './Layout'
import { ConfigProvider, theme } from 'antd'
import { useLayoutEffect, useRef } from 'react'
import { Toast } from 'primereact/toast'
import { App as AntApp } from 'antd'
import Auth from './components/auth/Auth'

function App(): JSX.Element {
  // const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  const toast = useRef(null)

  useLayoutEffect(() => {
    window['toast'] = toast.current || {}
  }, [])

  return (
    <>
      <ConfigProvider
        theme={{
          algorithm: theme.darkAlgorithm,
          token: {
            colorPrimary: '#3b4252'
          },
          cssVar: true
        }}
      >
        <AntApp>
          <Router>
            <Routes>
              <Route path="/login" element={<Auth />} />
              <Route path="/" element={<Layout />} />
            </Routes>
          </Router>
        </AntApp>
      </ConfigProvider>
      <Toast ref={toast} />
    </>
  )
}

export default App
