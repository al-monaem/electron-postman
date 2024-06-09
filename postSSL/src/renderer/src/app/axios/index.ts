import { showToast } from '@renderer/utilities/toast'
import axios from 'axios'
import store from '../store'
import { clearUser } from '../store/user/userSlice'

const BASE_URL =
  import.meta.env.VITE_APP_ENV === 'production'
    ? import.meta.env.VITE_BACKEND_URL_PROD
    : import.meta.env.VITE_BACKEND_URL

const axiosAppInstance = axios.create({
  baseURL: `${BASE_URL}/app`
})

export const axiosMockInstance = axios.create({
  baseURL: `${BASE_URL}`
})

export const axiosAuthInstance = axios.create({
  baseURL: `${BASE_URL}/auth`
})

// const refreshAccessToken = (refreshToken) => {
//   // Example:
//   return axiosInstance.post(
//     '/auth/refreshToken',
//     { refreshToken },
//     {
//       headers: {
//         'Content-Type': 'application/json',
//         'ngrok-skip-browser-warning': true
//       }
//     }
//   )
// }

axiosAppInstance.interceptors.request.use(
  (config) => {
    config.headers['Authorization'] = `Bearer ${store.getState().userReducer.accessToken}`
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

axiosAuthInstance.interceptors.response.use(
  (response) => {
    if (response.status === 200) return response
    showToast(response.status, response.data.message)
    return response
  },
  async (error) => {
    if (error.code === 'ERR_NETWORK') {
      showToast(600, 'Server is currently offline.')
    }
    // const originalRequest = error.config
    // if (error.response.status === 401 && !originalRequest._retry) {
    //   originalRequest._retry = true

    //   try {
    //     const refreshToken = store.getState().userReducer.refreshToken
    //     if (refreshToken) {
    //       const response = await refreshAccessToken(refreshToken)

    //       const newAccessToken = response.data.data.accessToken
    //       originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`
    //       store.dispatch(setAccessToken({ accessToken: newAccessToken }))

    //       return axiosInstance(originalRequest)
    //     } else {
    //       store.dispatch(clearUserData())
    //       notify(500, 'Session Expired. Please login again.')
    //     }
    //   } catch (refreshError) {}
    // }
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.log(error.response)
      showToast(401, error.response?.data?.message || 'You are unauthoized to access this resource')
    } else if (error.response?.status) {
      showToast(
        error.response?.status,
        error.response?.data?.message || 'Could not access this resource'
      )
    }
    return Promise.reject(error)
  }
)

axiosAppInstance.interceptors.response.use(
  (response) => {
    // if (response.status === 200) return response
    // showToast(response.status, response.data.message)
    return response
  },
  async (error) => {
    if (error.code === 'ERR_NETWORK') {
      showToast(600, 'Server is currently offline.')
    }
    // const originalRequest = error.config
    // if (error.response.status === 401 && !originalRequest._retry) {
    //   originalRequest._retry = true

    //   try {
    //     const refreshToken = store.getState().userReducer.refreshToken
    //     if (refreshToken) {
    //       const response = await refreshAccessToken(refreshToken)

    //       const newAccessToken = response.data.data.accessToken
    //       originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`
    //       store.dispatch(setAccessToken({ accessToken: newAccessToken }))

    //       return axiosInstance(originalRequest)
    //     } else {
    //       store.dispatch(clearUserData())
    //       notify(500, 'Session Expired. Please login again.')
    //     }
    //   } catch (refreshError) {}
    // }
    if (error.response?.status === 401 || error.response?.status === 403) {
      showToast(401, error.response?.data?.message || 'You are unauthoized to access this resource')
      store.dispatch(clearUser())
    } else if (error.response?.status) {
      showToast(
        error.response?.status,
        error.response?.data?.message || 'Could not access this resource'
      )
    }
    return Promise.reject(error)
  }
)

export default axiosAppInstance
