import store from '@renderer/app/store'
import { insertIntoTab } from '@renderer/app/store/mock/tabSlice'
import { TabTypes } from '@renderer/utilities/TabTypes'

const CreateCollection = () => {
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
          <button
            className="bg-gray-300 px-2 py-1 text-xs font-semibold rounded-md shadow-sm hover:bg-gray-200 transition"
            onClick={() => handleTabCreate(TabTypes.CREATE_COLLECTION)}
          >
            New
          </button>
          <button className="bg-gray-300 px-2 py-1 text-xs font-semibold rounded-md shadow-sm hover:bg-gray-200 transition">
            Import
          </button>
        </div>
      </div>
    </>
  )
}

export default CreateCollection
