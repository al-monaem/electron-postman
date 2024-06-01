import { createSlice } from '@reduxjs/toolkit'

const initialState: any = {
  collections: [],
  folders: [],
  apis: []
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
    }
  }
})

export const { clearCollections, setCollections } = userSlice.actions

export default userSlice.reducer
