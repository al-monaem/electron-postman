import { useSelector } from 'react-redux'
import { Tree } from 'primereact/tree'
import { useRef, useState } from 'react'
import { Collection } from '@renderer/app/interfaces/models'
import { BsCollectionFill } from 'react-icons/bs'
import { TabTypes } from '@renderer/utilities/TabTypes'
import store from '@renderer/app/store'
import { insertIntoTab } from '@renderer/app/store/mock/tabSlice'
import { ContextMenu } from 'primereact/contextmenu'
import { theme } from 'antd'
import { FaFolderOpen } from 'react-icons/fa'
import { TbApi } from 'react-icons/tb'
import { MdDelete } from 'react-icons/md'
import {
  deleteCollection,
  deleteExample,
  deleteFolder,
  deleteRequest
} from '@renderer/controllers/api.controller'

const CollectionMenu = () => {
  const collections = useSelector((state: any) => state.userReducer.collections)
  const apis = useSelector((state: any) => state.userReducer.apis)
  const activeTheme = useSelector((state: any) => state.settingsReducer.activeTheme)

  const contextMenu: any = useRef()
  const { token } = theme.useToken()

  const [selectedKey, setSelectedKey] = useState({
    key: '',
    type: ''
  })
  const [contextMenuItem, setContextMenuItems] = useState<any>([])

  const handleExampleDelete = async (api_id: string, example_id: string) => {
    await deleteExample(api_id, example_id)
  }

  const handleRequestDelete = async (api_id: string) => {
    await deleteRequest(api_id)
  }

  const handleFolderDelete = async (folder_id: string) => {
    await deleteFolder(folder_id)
  }

  const handleCollectionDelete = async (collection_id: string) => {
    await deleteCollection(collection_id)
  }

  const onSelect = (e: any) => {
    const payload: any = {
      ...e.node.data,
      type: e.node.type
    }

    store.dispatch(insertIntoTab(payload))

    setSelectedKey(() => {
      return {
        key: e.node.key,
        type: e.node.type
      }
    })
  }

  const getChildren = (item: any, collection: Collection) => {
    const items: any = []
    ;(item || []).map((_item: any) => {
      const data: any = {
        key: _item._id,
        leaf: _item.item?.length ? false : true,
        label: (
          <div
            style={{
              fontFamily: 'var(--ant-font-family)'
            }}
            className="w-full"
            onContextMenu={(event: any) => {
              onRightClick(event, {
                ..._item,
                item: [],
                collection_id: collection._id,
                type: _item.item ? TabTypes.FOLDER : TabTypes.API
              })
            }}
          >
            {_item.name}
          </div>
        ),
        children: getChildren(_item.item, collection),
        type: _item.item ? TabTypes.FOLDER : TabTypes.API,
        data: {
          ..._item,
          item: []
        },
        icon: _item.item ? (
          <FaFolderOpen className="mr-2 w-3 h-3" />
        ) : (
          <span
            style={{
              fontSize: '10px',
              marginRight: '8px'
            }}
            className={`${
              _item.request?.method === 'GET'
                ? 'text-green-600'
                : _item.request?.method === 'POST'
                  ? 'text-yellow-600'
                  : _item.request?.method === 'PUT'
                    ? 'text-blue-400'
                    : _item.request?.method === 'PATCH'
                      ? 'text-orange-400'
                      : 'text-red-600'
            } font-semibold`}
          >
            {_item.request?.method || 'GET'}
          </span>
        ),
        className: 'p-0'
      }

      if (!_item.item) {
        const examples: any = []
        ;(_item.response || []).map((example: any) => {
          examples.push({
            ...data,
            ..._item,
            key: example._id,
            label: (
              <div
                onContextMenu={(event: any) => {
                  onRightClick(event, {
                    ..._item,
                    item: [],
                    collection_id: collection._id,
                    type: TabTypes.API_RESPONSE,
                    data: {
                      ...data.data,
                      ...example,
                      _id: _item._id,
                      active_example_id: example._id
                    }
                  })
                }}
              >
                {example.name}
              </div>
            ),
            type: TabTypes.API_RESPONSE,
            data: {
              ...data.data,
              ...example,
              _id: _item._id,
              active_example_id: example._id
            },
            icon: <TbApi className="w-3 h-3 mr-2" />
          })
        })

        delete data.item
        data.children = examples
      }

      items.push(data)
    })

    return items
  }

  const onRightClick = (event: any, data: any) => {
    if (contextMenu.current) {
      setContextMenuItems(() => {
        if (data.type === TabTypes.COLLECTION) {
          return [
            {
              label: 'Create New Folder',
              icon: <FaFolderOpen className="w-3 h-3 mr-2" />,
              command: () => {
                const payload: any = {
                  type: TabTypes.CREATE_FOLDER,
                  collection_id: data?._id
                }
                store.dispatch(insertIntoTab(payload))
              }
            },
            {
              label: 'Create New Api',
              icon: <TbApi className="w-3 h-3 mr-2" />,
              command: () => {
                const payload: any = {
                  type: TabTypes.CREATE_API,
                  collection_id: data?.collection_id,
                  _id: Math.floor(Math.random() * 283152156).toString()
                }
                store.dispatch(insertIntoTab(payload))
              }
            },
            {
              label: 'Delete Collection',
              icon: <MdDelete className="w-3 h-3 mr-2" />,
              command: () => handleCollectionDelete(data._id)
            }
          ]
        }
        if (data.type === TabTypes.FOLDER) {
          return [
            {
              label: 'Create New Api',
              icon: <TbApi className="w-3 h-3 mr-2" />,
              command: () => {
                const payload: any = {
                  type: TabTypes.CREATE_API,
                  folder_id: data?._id,
                  collection_id: data?.collection_id,
                  _id: Math.floor(Math.random() * 283152156).toString()
                }
                store.dispatch(insertIntoTab(payload))
              }
            },
            {
              label: 'Delete Folder',
              icon: <MdDelete className="w-3 h-3 mr-2" />,
              command: () => {
                handleFolderDelete(data._id)
              }
            }
          ]
        }
        if (data.type === TabTypes.API) {
          return [
            {
              label: 'Create New Example',
              icon: <TbApi className="w-3 h-3 mr-2" />,
              command: () => {
                const api = apis.find((api: any) => api._id === data._id) || []
                let sameNameCount = 0

                for (const response of api.response || []) {
                  if (response.name === data.name) sameNameCount++
                }

                const exampleId = `create-${Math.random() * 213761}`

                const payload: any = {
                  ...data,
                  type: TabTypes.CREATE_API_RESPONSE,
                  active_example_id: exampleId,
                  response: {
                    _id: exampleId,
                    name: `${data.name}${sameNameCount ? ` - ${sameNameCount + 1}` : ''}`,
                    body: '',
                    header: []
                  },
                  request: {
                    ...data.request,
                    url: {
                      ...data.request.url,
                      raw: data.request.url.raw?.split('?')[0]
                    }
                  },
                  modified: true
                }
                store.dispatch(insertIntoTab(payload))
              }
            },
            {
              label: 'Delete Request',
              icon: <MdDelete className="w-3 h-3 mr-2" />,
              command: () => {
                handleRequestDelete(data._id)
              }
            }
          ]
        }
        if (data.type === TabTypes.API_RESPONSE) {
          return [
            {
              label: 'Delete Example',
              icon: <MdDelete className="w-3 h-3 mr-2" />,
              command: () => {
                handleExampleDelete(data._id, data.data.active_example_id)
              }
            }
          ]
        }
        return []
      })

      contextMenu.current.show({
        ...event,
        stopPropagation: () => {},
        preventDefault: () => {}
      })
    }
  }

  return (
    <>
      <div className="w-full h-full">
        <Tree
          selectionMode="single"
          selectionKeys={selectedKey.key}
          className="p-0 text-sm !border-none"
          onNodeClick={onSelect}
          style={{
            backgroundColor: activeTheme === 'dark' ? token.colorBgElevated : token.colorBgLayout
          }}
          value={collections.map((collection: Collection) => {
            const treeNode: any = {
              key: collection._id,
              leaf: collection.item?.length ? false : true,
              label: (
                <div
                  className="w-full flex items-center justify-between more"
                  onContextMenu={(event: any) => {
                    onRightClick(event, {
                      ...collection,
                      item: [],
                      collection_id: collection._id,
                      type: TabTypes.COLLECTION
                    })
                  }}
                >
                  <div>{collection.name}</div>
                  {/* <div
                    className="threedot mr-1"
                    style={{
                      visibility: 'hidden'
                    }}
                  >
                    <Dropdown
                      menu={{
                        items: [
                          {
                            key: 'Create_Folder',
                            label: <div className="text-xs">Create Folder</div>
                          }
                        ]
                      }}
                      placement="bottomRight"
                      trigger={['click']}
                    >
                      <Button
                        type="text"
                        size="small"
                        icon={<BsThreeDots className="w-3 h-3" />}
                      ></Button>
                    </Dropdown>
                  </div> */}
                </div>
              ),
              children: getChildren(collection.item, collection),
              type: TabTypes.COLLECTION,
              data: {
                ...collection,
                item: []
              },
              icon: <BsCollectionFill className="mr-2 w-3 h-3" />,
              className: 'p-0'
            }

            return treeNode
          })}
        />
      </div>
      <ContextMenu
        className="p-0 w-[160px]"
        style={{
          borderColor: token.colorBorder
        }}
        ref={contextMenu}
        model={contextMenuItem}
      />
    </>
  )
}

export default CollectionMenu
