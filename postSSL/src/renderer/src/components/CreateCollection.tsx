import store from '@renderer/app/store'
import { insertIntoTab } from '@renderer/app/store/mock/tabSlice'
import { TabTypes } from '@renderer/utilities/TabTypes'
import { Button, theme } from 'antd'

const CreateCollection = () => {
  const { token } = theme.useToken()

  const handleTabCreate = (type: string) => {
    const payload: any = {
      type: type
    }
    store.dispatch(insertIntoTab(payload))
  }

  return (
    <>
      <div className="flex-grow flex items-center px-3">
        <div className="font-semibold">My Collections</div>
        <div className="ml-auto flex space-x-1">
          <Button
            size="small"
            type="primary"
            style={{
              color: token.colorText
            }}
            className="!font-semibold"
            onClick={() => handleTabCreate(TabTypes.CREATE_COLLECTION)}
          >
            New
          </Button>
          <Button
            style={{
              color: token.colorText
            }}
            size="small"
            type="primary"
            className="!font-semibold"
          >
            Import
          </Button>
        </div>
      </div>
    </>
  )
}

export default CreateCollection
