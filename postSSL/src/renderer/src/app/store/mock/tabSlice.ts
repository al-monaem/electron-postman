import { createSlice } from '@reduxjs/toolkit'
import { Api, Collection, Folder } from '@renderer/app/interfaces/models'
import { TabTypes } from '@renderer/utilities/TabTypes'

const initialState: any = {
  tabs: [],
  activeTab: 0,
  refreshTab: 0
}

const tabSlice = createSlice({
  name: 'tabs',
  initialState,
  reducers: {
    refreshTabs: (state) => {
      state.refreshTabs = Math.random() * 213861
    },
    insertIntoTab: (state, action: any) => {
      console.log(action.payload.type)
      if (
        action.payload.type === TabTypes.CREATE_API ||
        action.payload.type === TabTypes.CREATE_COLLECTION ||
        action.payload.type === TabTypes.CREATE_FOLDER
      ) {
        const index = state.tabs.findIndex((value: any) => value.type === action.payload.type)
        if (index === -1) {
          if (action.payload.type === TabTypes.CREATE_COLLECTION) {
            const collection: Collection = {
              name: 'New Collection',
              description: 'New Collection',
              schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
              type: TabTypes.CREATE_COLLECTION,
              _exporter_id: Math.floor(Math.random() * 1000000)
            }

            state.tabs.push(collection)
            state.activeTab = state.tabs.length - 1
          }
          if (action.payload.type === TabTypes.CREATE_FOLDER) {
            const folder: Folder = {
              name: 'New Folder',
              description: 'New Folder',
              type: TabTypes.CREATE_FOLDER,
              collection_id: action.payload.collection_id
            }

            state.tabs.push(folder)
            state.activeTab = state.tabs.length - 1
          }
          if (action.payload.type === TabTypes.CREATE_API) {
            const example_id = `create-${Math.round(Math.random() * 12471386)}`

            const api: any = {
              _id: action.payload._id,
              name: 'New Api',
              type: TabTypes.CREATE_API,
              collection_id: action.payload.collection_id,
              folder_id: action.payload.folder_id,
              modified: true,
              request: {
                method: 'GET',
                header: [],
                body: {
                  mode: 'raw',
                  raw: '',
                  options: {
                    raw: {
                      language: 'json'
                    }
                  }
                },
                url: {
                  raw: `${import.meta.env.VITE_APP_ENV === 'production' ? import.meta.env.VITE_BACKEND_URL_PROD : import.meta.env.VITE_BACKEND_URL}/${action.payload.collection_id}`
                }
              },
              response: {
                _id: example_id,
                body: '',
                name: '',
                header: []
              }
            }

            state.tabs.push(api)
            state.activeTab = state.tabs.length - 1
          }
        } else {
          state.activeTab = index
          return
        }
      } else {
        if (
          action.payload.type === TabTypes.API_RESPONSE ||
          action.payload.type === TabTypes.API ||
          action.payload.type === TabTypes.CREATE_API_RESPONSE
        ) {
          const index = state.tabs.findIndex((value: any) => value._id === action.payload._id)
          if (index !== -1) {
            const sameExample = state.tabs.findIndex(
              (value: any) =>
                value.active_example_id === action.payload.active_example_id &&
                value.type === action.payload.type &&
                value._id === action.payload._id
            )
            if (sameExample !== -1) {
              state.activeTab = sameExample
              return
            }
          }
        } else {
          const index = state.tabs.findIndex((value: any) => value._id === action.payload._id)
          if (index !== -1) {
            state.activeTab = index
            return
          }
        }

        if (action.payload.type === TabTypes.COLLECTION) {
          const collection: Collection = {
            name: action.payload.name,
            description: action.payload.description,
            schema: action.payload.schema,
            type: TabTypes.COLLECTION,
            _exporter_id: action.payload._exporter_id,
            _id: action.payload._id
          }

          state.tabs.push(collection)
          state.activeTab = state.tabs.length - 1
        }
        if (action.payload.type === TabTypes.FOLDER) {
          const folder: Folder = {
            name: action.payload.name,
            description: action.payload.description,
            type: TabTypes.FOLDER,
            _id: action.payload._id,
            item: action.payload.item,
            collection_id: action.payload.collection_id
          }

          state.tabs.push(folder)
          state.activeTab = state.tabs.length - 1
        }
        if (action.payload.type === TabTypes.API) {
          const api: any = {
            _id: action.payload._id,
            collection_id: action.payload.collection_id,
            folder_id: action.payload.folder_id,
            name: action.payload.name,
            type: TabTypes.API,
            modified: false,
            request: {
              ...action.payload.request,
              url: {
                ...action.payload.request.url,
                raw: action.payload.request.url.raw?.split('?')[0]
              }
            },
            response: {
              body: '',
              header: [],
              name: ''
            },
            active_example_id: action.payload.active_example_id
          }

          state.tabs.push(api)
          state.activeTab = state.tabs.length - 1
        }
        if (action.payload.type === TabTypes.API_RESPONSE) {
          const example = action.payload.response?.find(
            (response: any) => response._id === action.payload.active_example_id
          )

          const api: Api = {
            _id: action.payload._id,
            collection_id: action.payload.collection_id,
            folder_id: action.payload.folder_id,
            name: action.payload.name,
            type: TabTypes.API_RESPONSE,
            modified: false,
            request: {
              ...example.originalRequest,
              url: {
                ...example.originalRequest.url,
                raw: example.originalRequest.url.raw?.split('?')[0]
              }
            },
            response: example,
            active_example_id: action.payload.active_example_id
          }

          state.tabs.push(api)
          state.activeTab = state.tabs.length - 1
        }
        if (action.payload.type === TabTypes.CREATE_API_RESPONSE) {
          const api: Api = {
            _id: action.payload._id,
            collection_id: action.payload.collection_id,
            folder_id: action.payload.folder_id,
            name: action.payload.name,
            type: TabTypes.CREATE_API_RESPONSE,
            modified: true,
            request: action.payload.request,
            response: action.payload.response,
            active_example_id: action.payload.active_example_id
          }

          state.tabs.push(api)
          state.activeTab = state.tabs.length - 1
        }
      }
    },
    removeFromTab: (state, action: any) => {
      const index = action.payload.removeTabIndex
      state.tabs.splice(index, 1)
    },
    clearTabs: (state) => {
      state.tabs = initialState.tabs
    },
    switchTab: (state, action: any) => {
      if (action.payload.activeTab < 0 || action.payload.activeTab >= state.tabs.length)
        state.activeTab = 0
      else state.activeTab = action.payload.activeTab
    },
    updateTabType: (state, action: any) => {
      const tabIndex = action.payload.tabIndex
      state.tabs[tabIndex].type = action.payload.type
      state.tabs[tabIndex].name = action.payload.name
      state.tabs[tabIndex].description = action.payload.description
    },
    updateApi: (state, action) => {
      let tabIndex: number
      if (action.payload.active_example_id) {
        tabIndex = state.tabs.findIndex(
          (tab: Api) => tab.active_example_id === action.payload.active_example_id
        )
      } else {
        tabIndex = state.tabs.findIndex(
          (tab: Api) => tab._id === action.payload._id && !tab.active_example_id
        )
      }

      if (tabIndex !== -1) {
        const tab = state.tabs[tabIndex]
        if (
          tab.type === TabTypes.API ||
          tab.type === TabTypes.CREATE_API ||
          tab.type === TabTypes.CREATE_API_RESPONSE ||
          tab.type === TabTypes.API_RESPONSE
        ) {
          state.tabs[tabIndex] = {
            ...tab,
            name: action.payload.name,
            modified: action.payload.modified !== undefined ? action.payload.modified : true,
            request: action.payload.request,
            response: action.payload.response,
            type: action.payload.type || tab.type
          }
        }
      }
    },
    updateBasics: (state, action) => {
      const tabIndex = state.tabs.findIndex((tab: Api) => tab._id === action.payload._id)
      if (tabIndex !== -1) {
        const tab = state.tabs[tabIndex]
        state.tabs[tabIndex] = {
          ...tab,
          name: action.payload.name,
          modified: true,
          description: action.payload.description || ''
        }
      }
    },
    updateTabId: (state, action) => {
      const tabIndex = state.tabs.findIndex((tab: Api) => tab._id === action.payload._id)
      if (tabIndex !== -1) {
        const tab = state.tabs[tabIndex]
        state.tabs[tabIndex] = {
          ...tab,
          _id: action.payload.new_id
        }
      }
    },
    removeActiveTab: (state) => {
      state.tabs.splice(state.activeTab, 1)
    },
    updateTabs: (state, action) => {
      state.tabs = action.payload
    }
  }
})

export const {
  insertIntoTab,
  removeFromTab,
  clearTabs,
  switchTab,
  updateTabType,
  updateApi,
  updateBasics,
  updateTabId,
  refreshTabs,
  removeActiveTab,
  updateTabs
} = tabSlice.actions

export default tabSlice.reducer
