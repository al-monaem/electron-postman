import { Route, HashRouter as Router, Routes } from 'react-router-dom'
import { Layout } from './Layout'
import { Button, ConfigProvider, theme } from 'antd'
import { useLayoutEffect, useRef } from 'react'
import { Toast } from 'primereact/toast'
import { App as AntApp } from 'antd'
import Auth from './components/auth/Auth'
import { ErrorBoundary } from 'react-error-boundary'
import { useSelector } from 'react-redux'

function App(): JSX.Element {
  // const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  const toast = useRef(null)
  const { token } = theme.useToken()
  const activeTheme = useSelector((state: any) => state.settingsReducer.activeTheme)
  const activeThemeHex = useSelector((state: any) => state.settingsReducer.activeThemeHex)

  function fallbackRender({ resetErrorBoundary }) {
    return (
      <div className="flex items-center justify-center w-screen h-screen flex-col">
        <p
          style={{
            color: token.colorText
          }}
          className="font-semibold text-2xl"
        >
          Something Went Wrong!
        </p>
        <Button
          size="large"
          danger
          onClick={() => {
            localStorage.removeItem('persist:root')
            resetErrorBoundary()
            window.location.reload()
          }}
        >
          Reset
        </Button>
      </div>
    )
  }

  useLayoutEffect(() => {
    window['toast'] = toast.current || {}
  }, [])

  return (
    <>
      <ConfigProvider
        theme={{
          algorithm: activeTheme === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
          token: {
            ...(activeTheme === 'dark'
              ? { colorPrimary: activeThemeHex }
              : { colorBgLayout: activeThemeHex, colorPrimary: '#9ab3aa', colorBgBase: '#ffffff' })
          },
          cssVar: true
        }}
      >
        <AntApp>
          <Router>
            <Routes>
              <Route path="/login" element={<Auth />} />
              <Route
                path="/"
                element={
                  <ErrorBoundary fallbackRender={fallbackRender}>
                    <Layout />
                  </ErrorBoundary>
                }
              />
            </Routes>
          </Router>
        </AntApp>
      </ConfigProvider>
      <Toast ref={toast} />
    </>
  )
}

export default App
