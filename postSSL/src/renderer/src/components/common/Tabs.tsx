import { TabTypes } from '@renderer/utilities/TabTypes'
import { useSelector } from 'react-redux'
import CreateCollectionTab from '../CreateCollectionTab'
import { Tabs as AntTabs, theme } from 'antd'
import store from '@renderer/app/store'
import { removeFromTab, switchTab } from '@renderer/app/store/mock/tabSlice'
import CreateFolderTab from '../CreateFolderTab'
import CreateApiTab from '../CreateApiTab'
import BreadCrumb from './BreadCrumb'

const Tabs = () => {
  const tabs = useSelector((state: any) => state.tabReducer.tabs)
  const activeTab = useSelector((state: any) => state.tabReducer.activeTab)
  const { token } = theme.useToken()

  const onEdit = (key: any, action: 'add' | 'remove') => {
    if (action === 'remove') {
      const payload: any = {
        removeTabIndex: key
      }
      store.dispatch(removeFromTab(payload))
    }
  }

  const onChange = (key: string) => {
    const payload: any = {
      activeTab: key
    }
    store.dispatch(switchTab(payload))
  }

  return (
    <AntTabs
      className="flex-grow"
      hideAdd
      onEdit={onEdit}
      onChange={onChange}
      type="editable-card"
      activeKey={activeTab}
      style={{
        backgroundColor: token.colorBgBase
      }}
      items={(tabs || []).map((tab: any, index: any) => {
        return {
          label:
            tab.type === TabTypes.CREATE_API || tab.type === TabTypes.API ? (
              <span className="flex justify-between items-center w-[120px]">
                <span
                  className={`${tab.modified ? 'w-[80%]' : ''} text-ellipsis whitespace-nowrap overflow-hidden flex items-center space-x-2`}
                >
                  <span
                    style={{
                      fontSize: '10px'
                    }}
                    className={`font-semibold ${tab.request?.method === 'GET' ? 'text-green-600' : tab.request?.method === 'POST' ? 'text-yellow-600' : tab.request?.method === 'PUT' ? 'text-blue-400' : tab.request?.method === 'PATCH' ? 'text-orange-400' : 'text-red-600'}`}
                  >
                    {tab.request?.method || 'GET'}
                  </span>
                  <span>{tab.name}</span>
                </span>
                {tab.modified && <div className="bg-red-500 w-2 h-2 rounded-full"></div>}
              </span>
            ) : tab.type === TabTypes.API_RESPONSE || tab.type === TabTypes.CREATE_API_RESPONSE ? (
              <span className="flex justify-between items-center w-[120px]">
                <span
                  className={`${tab.modified ? 'w-[80%]' : ''} text-ellipsis whitespace-nowrap overflow-hidden`}
                >
                  {tab.response.name}
                </span>
                {tab.modified && <div className="bg-red-500 w-2 h-2 rounded-full"></div>}
              </span>
            ) : (
              <span className="flex justify-between items-center w-[120px]">
                <span className="w-[100%] text-ellipsis whitespace-nowrap overflow-hidden">
                  {tab.name}
                </span>
              </span>
            ),
          children:
            tab.type === TabTypes.CREATE_COLLECTION ? (
              <CreateCollectionTab collection={tab} tabIndex={index} create={true} />
            ) : tab.type === TabTypes.COLLECTION ? (
              <BreadCrumb tab={tab} create={false}>
                <CreateCollectionTab collection={tab} tabIndex={index} create={false} />
              </BreadCrumb>
            ) : tab.type === TabTypes.CREATE_FOLDER ? (
              <CreateFolderTab folder={tab} tabIndex={index} create={true} />
            ) : tab.type === TabTypes.FOLDER ? (
              <BreadCrumb tab={tab} create={false}>
                <CreateFolderTab folder={tab} tabIndex={index} create={false} />
              </BreadCrumb>
            ) : tab.type === TabTypes.CREATE_API ? (
              <BreadCrumb tab={tab} create={true}>
                <CreateApiTab api={tab} tabIndex={index} create={true} />
              </BreadCrumb>
            ) : tab.type === TabTypes.API ? (
              <BreadCrumb tab={tab} create={false}>
                <CreateApiTab api={tab} tabIndex={index} create={false} />
              </BreadCrumb>
            ) : tab.type === TabTypes.API_RESPONSE ? (
              <BreadCrumb tab={tab} create={false}>
                <CreateApiTab api={tab} tabIndex={index} create={false} />
              </BreadCrumb>
            ) : tab.type === TabTypes.CREATE_API_RESPONSE ? (
              <BreadCrumb tab={tab} create={true}>
                <CreateApiTab api={tab} tabIndex={index} create={true} />
              </BreadCrumb>
            ) : (
              <></>
            ),
          key: index
        }
      })}
    />
  )
}

export default Tabs
