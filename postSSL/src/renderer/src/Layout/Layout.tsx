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

export const Layout = () => {
  const collection_menu_ref: React.RefObject<HTMLDivElement> = useRef(null)

  const refreshTabs = useSelector((state: any) => state.tabReducer.refreshTabs)
  const tabs = useSelector((state: any) => state.tabReducer.tabs)
  const collections = useSelector((state: any) => state.userReducer.collections)
  const folders = useSelector((state: any) => state.userReducer.folders)
  const apis = useSelector((state: any) => state.userReducer.apis)

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
      } else {
        newTabs.push(tab)
      }
    }
  }, [refreshTabs])

  return (
    <div className="w-screen h-screen flex flex-col">
      <div id="topbar" className="flex w-full">
        <Topbar />
      </div>
      <div className="flex-grow flex">
        <div ref={collection_menu_ref} className="h-full">
          <ResizableBox
            width={300}
            minConstraints={[200, collection_menu_ref.current?.clientHeight || 200]}
            maxConstraints={[400, collection_menu_ref.current?.clientHeight || 200]}
            handleSize={[400, 400]}
            className="h-full flex flex-col"
            resizeHandles={['e']}
            axis="x"
          >
            <div className="h-[5vh] border-b flex items-center">
              <CreateCollection />
            </div>
            <div className="flex flex-grow">
              <div className="w-[80px] border-r"></div>
              <CollectionMenu />
            </div>
          </ResizableBox>
        </div>
        <div className="flex-grow flex">
          <Tabs />
        </div>
      </div>
    </div>
  )
}

// export default Main
