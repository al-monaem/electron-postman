import { createSlice } from '@reduxjs/toolkit'

const initialState: any = {
  activeTheme: 'dark',
  activeThemeHex: '#3b4252'
}

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    switchTheme: (state) => {
      state.activeTheme = state.activeTheme === 'light' ? 'dark' : 'light'
      state.activeThemeHex = state.activeTheme === 'dark' ? '#3b4252' : '#f0f0f0'
    }
  }
})

export const { switchTheme } = settingsSlice.actions

export default settingsSlice.reducer
