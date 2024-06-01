import axiosAppInstance from '@renderer/app/axios'
import { getCollections } from './collection.controller'

export const createFolder = async (values: any) => {
  try {
    await axiosAppInstance.post('/folder', values)
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
