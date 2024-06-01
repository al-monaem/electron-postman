import { showToast } from '@renderer/utilities/toast'
import axios from 'axios'

const axiosAppInstance = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/app`
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
    // config.headers['Authorization'] = `Bearer ${
    //   store.getState().userReducer.accessToken
    // }`;
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

axiosAppInstance.interceptors.response.use(
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
      showToast(401, 'You are unauthoized to access this resource')
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