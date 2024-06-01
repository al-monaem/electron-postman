import axiosAppInstance from '@renderer/app/axios'
import { Api } from '@renderer/app/interfaces/models'
import store from '@renderer/app/store'
import { updateApi, updateTabId } from '@renderer/app/store/mock/tabSlice'
import { TabTypes } from '@renderer/utilities/TabTypes'
import { getCollections } from './collection.controller'

export const createApi = async (api: any) => {
  try {
    const response = await axiosAppInstance.post('/api', api)
    if (response.status === 201) {
      const _api = response.data.api
      const payload: Api = {
        ...api,
        new_id: _api._id
      }

      store.dispatch(updateTabId(payload))
      store.dispatch(
        updateApi({
          ..._api,
          type: TabTypes.API,
          name: api.name,
          modified: false
        })
      )
      await getCollections()
      return 200
    }
    return 500
  } catch (error) {
    console.log(error)
    return 500
  }
}

export const createExample = async (example: any) => {
  try {
    const response = await axiosAppInstance.post('/api/example', example)

    if (response.status === 201) {
      const _api = response.data.api
      const payload: Api = {
        ...example,
        new_id: _api._id
      }

      store.dispatch(updateTabId(payload))
      store.dispatch(
        updateApi({
          ...example,
          active_example_id: response.data._id,
          response: response.data,
          request: response.data.originalRequest
        })
      )

      await getCollections()
      return 200
    }
    return 500
  } catch (error) {
    console.log(error)
    return 500
  }
}

export const updateApiReqeust = async (api: any) => {
  try {
    const response = await axiosAppInstance.put(`/api`, api)
    if (response.status === 201) {
      store.dispatch(
        updateApi({
          ...api,
          ...response.data,
          modified: false
        })
      )
      await getCollections()
    }
    return 500
  } catch (error) {
    console.log(error)
    return 500
  }
}
