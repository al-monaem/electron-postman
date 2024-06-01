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

const CollectionMenu = () => {
  const collections = useSelector((state: any) => state.userReducer.collections)
  const apis = useSelector((state: any) => state.userReducer.apis)
  const contextMenu: any = useRef()
  const { token } = theme.useToken()

  const [selectedKey, setSelectedKey] = useState({
    key: '',
    type: ''
  })
  const [contextMenuItem, setContextMenuItems] = useState<any>([])

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
        icon: _item.item ? <FaFolderOpen className="mr-2" /> : <TbApi className="mr-2" />,
        className: 'p-0'
      }

      if (!_item.item) {
        const examples: any = []
        ;(_item.response || []).map((example: any) => {
          examples.push({
            ...data,
            ..._item,
            key: example._id,
            label: example.name,
            type: TabTypes.API_RESPONSE,
            data: {
              ...data.data,
              active_example_id: example._id
            }
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
              icon: <FaFolderOpen className="w-4 h-4 mr-2" />,
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
              icon: <TbApi className="w-4 h-4 mr-2" />,
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
              icon: <MdDelete className="w-4 h-4 mr-2" />
            }
          ]
        }
        if (data.type === TabTypes.FOLDER) {
          return [
            {
              label: 'Create New Api',
              icon: <TbApi className="w-4 h-4 mr-2" />,
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
              icon: <MdDelete className="w-4 h-4 mr-2" />
            }
          ]
        }
        if (data.type === TabTypes.API) {
          return [
            {
              label: 'Create New Example',
              icon: <TbApi className="w-4 h-4 mr-2" />,
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
                  modified: true
                }
                store.dispatch(insertIntoTab(payload))
              }
            },
            {
              label: 'Delete Folder',
              icon: <MdDelete className="w-4 h-4 mr-2" />
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
          className="p-0 text-sm"
          onNodeClick={onSelect}
          value={collections.map((collection: Collection) => {
            const treeNode: any = {
              key: collection._id,
              leaf: collection.item?.length ? false : true,
              label: (
                <div
                  className="w-full"
                  style={{
                    fontFamily: 'var(--ant-font-family)'
                  }}
                  onContextMenu={(event: any) => {
                    onRightClick(event, {
                      ...collection,
                      item: [],
                      collection_id: collection._id,
                      type: TabTypes.COLLECTION
                    })
                  }}
                >
                  {collection.name}
                </div>
              ),
              children: getChildren(collection.item, collection),
              type: TabTypes.COLLECTION,
              data: {
                ...collection,
                item: []
              },
              icon: <BsCollectionFill className="mr-2" />,
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
