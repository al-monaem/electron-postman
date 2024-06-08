import { axiosAuthInstance } from '@renderer/app/axios'
import store from '@renderer/app/store'
import { setUser } from '@renderer/app/store/user/userSlice'

export const register = async (values: any) => {
  try {
    await axiosAuthInstance.post('/register', values)
    return 200
  } catch (error) {
    console.log(error)
    return 500
  }
}

export const login = async (values: any) => {
  try {
    const response = await axiosAuthInstance.post('/login', values)
    if (response.status === 200) {
      store.dispatch(setUser(response.data))
    }
    return 200
  } catch (error) {
    console.log(error)
    return 500
  }
}
