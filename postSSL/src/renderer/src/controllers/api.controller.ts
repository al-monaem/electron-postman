import axiosAppInstance, { axiosMockInstance } from '@renderer/app/axios'
import { Api } from '@renderer/app/interfaces/models'
import store from '@renderer/app/store'
import { removeActiveTab, updateApi, updateTabId } from '@renderer/app/store/mock/tabSlice'
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
          request: {
            ..._api.request,
            url: {
              ..._api.request.url,
              raw: _api.request.url.raw?.split('?')[0]
            }
          },
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
      store.dispatch(removeActiveTab())

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
    console.log(response)
    if (response.status === 201) {
      store.dispatch(
        updateApi({
          ...api,
          ...response.data,
          request: {
            ...response.data.request,
            url: {
              ...response.data.request.url,
              raw: response.data.request.url.raw.split('?')[0]
            }
          },
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

export const updateExample = async (example: any) => {
  try {
    const response = await axiosAppInstance.put(`/api/example`, example)
    if (response.status === 201) {
      store.dispatch(
        updateApi({
          ...example,
          ...response.data,
          request: {
            ...response.data.response.originalRequest,
            url: {
              ...response.data.response.originalRequest.url,
              raw: response.data.response.originalRequest.url?.raw?.split('?')[0]
            }
          },
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

export const deleteExample = async (api_id: string, example_id: string) => {
  try {
    await axiosAppInstance.delete(`api/example/${api_id}/${example_id}`)
    await getCollections()

    return 200
  } catch (error) {
    console.log(error)
    return 500
  }
}

export const deleteRequest = async (api_id: string) => {
  try {
    await axiosAppInstance.delete(`api/${api_id}`)
    await getCollections()

    return 200
  } catch (error) {
    console.log(error)
    return 500
  }
}

export const deleteFolder = async (folder_id: string) => {
  try {
    await axiosAppInstance.delete(`folder/${folder_id}`)
    await getCollections()

    return 200
  } catch (error) {
    console.log(error)
    return 500
  }
}

export const deleteCollection = async (collection_id: string) => {
  try {
    await axiosAppInstance.delete(`collection/${collection_id}`)
    await getCollections()

    return 200
  } catch (error) {
    console.log(error)
    return 500
  }
}

export const sendMockRequest = async (
  body: any,
  header: any,
  method: string,
  url: string
): Promise<any> => {
  try {
    if (!header['Content-Type']) {
      header['Content-Type'] = 'application/json'
    }

    if (method === 'GET') {
      const response = await axiosMockInstance.get(url, {
        headers: {
          ...header
        }
      })
      return response
    }

    if (method === 'POST') {
      const response = await axiosMockInstance.post(url, body, {
        headers: {
          ...header
        }
      })
      return response
    }

    if (method === 'PUT') {
      const response = await axiosMockInstance.put(url, body, {
        headers: {
          ...header
        }
      })
      return response
    }

    if (method === 'PATCH') {
      const response = await axiosMockInstance.patch(url, body, {
        headers: {
          ...header
        }
      })
      return response
    }

    if (method === 'DELETE') {
      const response = await axiosMockInstance.delete(url, {
        headers: {
          ...header
        }
      })
      return response
    }

    return {
      status: 500,
      message: 'Invalid method'
    }
  } catch (error: any) {
    return error.response ? error.response : error
  }
}
