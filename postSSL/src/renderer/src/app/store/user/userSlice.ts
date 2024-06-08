import { createSlice } from '@reduxjs/toolkit'

const initialState: any = {
  collections: [],
  folders: [],
  apis: [],
  user: null,
  accessToken: '',
  refreshToken: ''
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCollections: (state, action: any) => {
      state.collections = action.payload.collections || []
      state.folders = action.payload.folders || []
      state.apis = action.payload.apis || []
    },
    clearCollections: (state) => {
      state.collections = initialState.collections
    },
    setUser: (state, action) => {
      const { user, accessToken, refreshToken } = action.payload
      state.user = user
      state.accessToken = accessToken
      state.refreshToken = refreshToken
    },
    clearUser: (state) => {
      state.user = initialState.user
      state.accessToken = initialState.accessToken
      state.refreshToken = initialState.refreshToken
    }
  }
})

export const { clearCollections, setCollections, setUser, clearUser } = userSlice.actions

export default userSlice.reducer
