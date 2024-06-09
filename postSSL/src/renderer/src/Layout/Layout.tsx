import '@renderer/assets/layout.css'

import Topbar from './Topbar'
import { ResizableBox } from 'react-resizable'
import CollectionMenu from './CollectionMenu'
import Tabs from '@renderer/components/common/Tabs'
import { useEffect, useRef } from 'react'
import { getCollections } from '@renderer/controllers/collection.controller'
import CreateCollection from '@renderer/components/CreateCollection'
import { useSelector } from 'react-redux'
import { TabTypes } from '@renderer/utilities/TabTypes'
import { ErrorBoundary } from 'react-error-boundary'
import { Button, theme } from 'antd'
import store from '@renderer/app/store'
import { clearTabs, updateTabs } from '@renderer/app/store/mock/tabSlice'
import { useNavigate } from 'react-router-dom'

export const Layout = () => {
  const collection_menu_ref: React.RefObject<HTMLDivElement> = useRef(null)
  const navigate = useNavigate()
  const { token } = theme.useToken()

  const refreshTabs = useSelector((state: any) => state.tabReducer.refreshTabs)
  const tabs = useSelector((state: any) => state.tabReducer.tabs)
  const collections = useSelector((state: any) => state.userReducer.collections)
  const folders = useSelector((state: any) => state.userReducer.folders)
  const apis = useSelector((state: any) => state.userReducer.apis)
  const accessToken = useSelector((state: any) => state.userReducer.accessToken)
  const activeTheme = useSelector((state: any) => state.settingsReducer.activeTheme)

  function fallbackRender({ error, resetErrorBoundary }) {
    store.dispatch(clearTabs())

    return (
      <div role="alert">
        <p>Something went wrong:</p>
        <pre style={{ color: 'red' }}>{error.message}</pre>
        <Button size="small" danger onClick={() => resetErrorBoundary()}>
          Reset
        </Button>
      </div>
    )
  }

  const loadCollections = async () => {
    await getCollections()
  }

  useEffect(() => {
    loadCollections()
  }, [])

  useEffect(() => {
    const newTabs: any = []

    for (const tab of tabs) {
      if (tab.type === TabTypes.API) {
        for (const api of apis) {
          if (api._id === tab._id) {
            newTabs.push(tab)
            break
          }
        }
      } else if (tab.type === TabTypes.COLLECTION) {
        for (const collection of collections) {
          if (collection._id === tab._id) {
            newTabs.push(tab)
            break
          }
        }
      } else if (tab.type === TabTypes.FOLDER) {
        for (const folder of folders) {
          if (folder._id === tab._id) {
            newTabs.push(tab)
            break
          }
        }
      } else if (tab.type === TabTypes.API_RESPONSE) {
        for (const api of apis) {
          for (const response of api.response) {
            if (response._id === tab.active_example_id) {
              newTabs.push(tab)
              break
            }
          }
        }
      } else {
        newTabs.push(tab)
      }
    }

    store.dispatch(updateTabs(newTabs))
  }, [refreshTabs])

  useEffect(() => {
    if (!accessToken) navigate('/login')
  }, [accessToken])

  return (
    <div
      style={{
        backgroundColor: token.colorPrimaryBg
      }}
      className="w-screen h-screen flex flex-col"
    >
      <div
        id="topbar"
        style={{
          borderBottom: '1px solid',
          borderColor: activeTheme === 'dark' ? token.colorBorderSecondary : token.colorBorder,
          backgroundColor: activeTheme === 'dark' ? token.colorBgElevated : token.colorBgLayout
        }}
        className="flex w-full"
      >
        <Topbar />
      </div>
      <div className="flex-grow flex">
        <div
          ref={collection_menu_ref}
          style={{
            backgroundColor: activeTheme === 'dark' ? token.colorBgElevated : token.colorBgLayout,
            borderRight: '1px solid',
            borderColor: activeTheme === 'dark' ? token.colorBorderSecondary : token.colorBorder
          }}
          className="h-full"
        >
          <ResizableBox
            width={300}
            minConstraints={[200, collection_menu_ref.current?.clientHeight || 200]}
            maxConstraints={[400, collection_menu_ref.current?.clientHeight || 200]}
            handleSize={[400, 400]}
            className="h-full flex flex-col"
            resizeHandles={['e']}
            axis="x"
          >
            <div
              style={{
                borderBottom: '1px solid',
                borderColor: activeTheme === 'dark' ? token.colorBorderSecondary : token.colorBorder
              }}
              className="h-[5vh] flex items-center"
            >
              <CreateCollection />
            </div>
            <div className="flex flex-grow">
              <div
                style={{
                  borderRight: '1px solid',
                  borderColor:
                    activeTheme === 'dark' ? token.colorBorderSecondary : token.colorBorder
                }}
                className="w-[80px]"
              ></div>
              <CollectionMenu />
            </div>
          </ResizableBox>
        </div>
        <div className="flex-grow flex">
          <ErrorBoundary fallbackRender={fallbackRender}>
            <Tabs />
          </ErrorBoundary>
        </div>
      </div>
    </div>
  )
}

// export default Main
