import store from '@renderer/app/store'
import { insertIntoTab, updateApi, updateBasics } from '@renderer/app/store/mock/tabSlice'
import {
  createApi,
  createExample,
  updateApiReqeust,
  updateExample
} from '@renderer/controllers/api.controller'
import { TabTypes } from '@renderer/utilities/TabTypes'
import { Breadcrumb, Button, Input } from 'antd'
import { useEffect, useState } from 'react'
import { BsCollectionFill } from 'react-icons/bs'
import { FaFolderOpen } from 'react-icons/fa'
import { IoIosSave } from 'react-icons/io'
import { TbApi } from 'react-icons/tb'
import { useSelector } from 'react-redux'
import _ from 'lodash'

const BreadCrumb = ({ children, tab, create }) => {
  const [_api] = useState(JSON.parse(JSON.stringify(tab)))

  const collections = useSelector((state: any) => state.userReducer.collections)
  const folders = useSelector((state: any) => state.userReducer.folders)
  const apis = useSelector((state: any) => state.userReducer.apis)
  const activeTab = useSelector((state: any) => state.tabReducer.activeTab)
  const tabs = useSelector((state: any) => state.tabReducer.tabs)

  const [items, setItems]: any = useState([])

  const handleNameChange = (e: any) => {
    const item = JSON.parse(JSON.stringify(tab))
    _api.modified = item.modified

    if (tab.type !== TabTypes.API_RESPONSE && tab.type !== TabTypes.CREATE_API_RESPONSE) {
      item.name = e.target.value

      if (!_.isEqual(item, _api)) item.modified = true
      else item.modified = false

      store.dispatch(updateBasics(item))
    } else {
      item.response.name = e.target.value

      console.log(item)
      console.log(_api)

      if (!_.isEqual(item, _api)) item.modified = true
      else item.modified = false

      store.dispatch(updateApi(item))
    }
  }

  const handleSave = async () => {
    if (tab?.type === TabTypes.CREATE_API) {
      await createApi(tab)
    }
  }

  const handleUpdateAPI = async () => {
    const item = JSON.parse(JSON.stringify(tab))
    await updateApiReqeust(item)
  }

  const handleExampleCreate = async () => {
    const item = JSON.parse(JSON.stringify(tab))
    await createExample(item)
  }

  const handleUpdateExample = async () => {
    const item = JSON.parse(JSON.stringify(tab))
    await updateExample(item)
  }

  useEffect(() => {
    const tab = tabs[activeTab]

    if (!tab) return

    if (tab?.type === TabTypes.COLLECTION) {
      setItems([
        {
          title: (
            <span className="flex items-center space-x-1">
              <BsCollectionFill className="w-3 h-3" />
              <span>{tab.name}</span>
            </span>
          )
        }
      ])
    }
    if (tab.type === TabTypes.FOLDER) {
      const collection = collections.find((c) => c._id === tab.collection_id)
      const breadCrumb: any = []
      if (collection) {
        breadCrumb.push({
          title: (
            <a
              onClick={(e) => {
                e.preventDefault()
                store.dispatch(
                  insertIntoTab({
                    ...collection,
                    type: TabTypes.COLLECTION
                  })
                )
              }}
            >
              <span className="flex items-center space-x-1">
                <BsCollectionFill className="w-3 h-3" />
                <span>{collection.name}</span>
              </span>
            </a>
          )
        })
      }
      breadCrumb.push({
        title: (
          <div className="flex items-center space-x-1">
            <FaFolderOpen className="w-3 h-3" />
            <div>{tab.name}</div>
          </div>
        )
      })
      setItems(breadCrumb)
    }

    if (
      tab?.type === TabTypes.API ||
      tab.type === TabTypes.CREATE_API ||
      tab.type === TabTypes.API_RESPONSE ||
      tab.type === TabTypes.CREATE_API_RESPONSE
    ) {
      let breadCrumb: any = []

      if (tab.folder_id) {
        const folder = folders.find((f: any) => f._id === tab.folder_id)
        if (folder) {
          breadCrumb.push({
            title: (
              <a
                onClick={(e) => {
                  e.preventDefault()
                  store.dispatch(
                    insertIntoTab({
                      ...folder,
                      type: TabTypes.FOLDER
                    })
                  )
                }}
              >
                <span className="flex items-center space-x-1">
                  <FaFolderOpen className="w-3 h-3" />
                  <span>{folder.name}</span>
                </span>
              </a>
            )
          })
          const collection = collections.find((c: any) => c._id === folder.collection_id)
          if (collection) {
            breadCrumb = [
              {
                title: (
                  <a
                    onClick={(e) => {
                      e.preventDefault()
                      store.dispatch(
                        insertIntoTab({
                          ...collection,
                          type: TabTypes.COLLECTION
                        })
                      )
                    }}
                  >
                    <span className="flex items-center space-x-1">
                      <BsCollectionFill className="w-3 h-3" />
                      <span>{collection.name}</span>
                    </span>
                  </a>
                )
              },
              ...breadCrumb
            ]
          }
        }
      }

      if (tab?.type === TabTypes.CREATE_API_RESPONSE || tab?.type === TabTypes.API_RESPONSE) {
        const api = apis.find((api: any) => api._id === tab._id)

        if (api) {
          breadCrumb.push({
            title: (
              <a
                onClick={(e) => {
                  e.preventDefault()
                  store.dispatch(
                    insertIntoTab({
                      ...api,
                      type: TabTypes.API,
                      modified: false
                    })
                  )
                }}
              >
                <span className="flex items-center space-x-1">
                  <TbApi className="w-3 h-3" />
                  <span>{api.name}</span>
                </span>
              </a>
            )
          })
        }

        const _tab = tabs.find(
          (t) => t._id === tab._id && t.active_example_id === tab.active_example_id
        )

        if (_tab) {
          breadCrumb.push({
            title: (
              <Input
                value={_tab?.response?.name}
                onChange={(e: any) => handleNameChange(e)}
                className="!border-none !rounded-sm hover:bg-gray-100 focus:bg-gray-100 !p-0"
              />
            )
          })
        }
      } else {
        breadCrumb.push({
          title: (
            <Input
              value={tab.name}
              onChange={(e: any) => handleNameChange(e)}
              className="!border-none !rounded-sm hover:bg-gray-100 focus:bg-gray-100 !p-0"
            />
          )
        })
      }
      setItems(breadCrumb)
    }
  }, [activeTab, tabs])

  return (
    <div className="flex flex-col flex-grow h-full">
      <div className="border-b pb-3 px-6 flex justify-between items-center">
        <Breadcrumb items={items} className="m-0" />
        <Button
          className="!flex !font-semibold items-center justify-center"
          icon={<IoIosSave className="w-4 h-4" />}
          disabled={
            tab.type !== TabTypes.CREATE_API &&
            tab.type !== TabTypes.CREATE_API_RESPONSE &&
            tab.type !== TabTypes.CREATE_COLLECTION &&
            tab.type !== TabTypes.CREATE_FOLDER &&
            !tab.modified
          }
          type="primary"
          onClick={() => {
            if (create) {
              if (tab.type === TabTypes.CREATE_API_RESPONSE) handleExampleCreate()
              else handleSave()
            } else {
              if (tab.type === TabTypes.API) handleUpdateAPI()
              if (tab.type === TabTypes.API_RESPONSE) handleUpdateExample()
            }
          }}
        >
          Save
        </Button>
      </div>
      <div className="flex w-full h-full">{children}</div>
    </div>
  )
}

export default BreadCrumb
