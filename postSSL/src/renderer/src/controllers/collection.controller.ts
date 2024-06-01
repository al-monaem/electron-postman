import axiosAppInstance from '@renderer/app/axios'
import store from '@renderer/app/store'
import { refreshTabs } from '@renderer/app/store/mock/tabSlice'
import { clearCollections, setCollections } from '@renderer/app/store/user/userSlice'

export const createCollection = async (values: any) => {
  try {
    await axiosAppInstance.post('/collection', values)
    await getCollections()
    return {
      status: 200
    }
  } catch (error) {
    console.log(error)
    return {
      status: 500
    }
  }
}

export const getCollections = async () => {
  try {
    const response = await axiosAppInstance.get('collections')
    store.dispatch(setCollections(response.data))
    store.dispatch(refreshTabs())
  } catch (error) {
    store.dispatch(clearCollections())
  }
}
