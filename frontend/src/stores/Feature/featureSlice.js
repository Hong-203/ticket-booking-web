import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  featureList: [],
  featureDetails: [],
  loading: false,
  error: null,
  response: null
}

const featureSlice = createSlice({
  name: 'theatre',
  initialState,
  reducers: {
    getRequest: (state) => {
      state.loading = true
    },
    doneSuccess: (state, action) => {
      state.featureDetails = action.payload
      state.loading = false
      state.error = null
      state.response = null
    },
    getSuccess: (state, action) => {
      state.featureList = action.payload
      state.loading = false
      state.error = null
      state.response = null
    },
    getFailed: (state, action) => {
      state.response = action.payload
      state.loading = false
      state.error = null
    },
    getError: (state, action) => {
      state.loading = false
      state.error = action.payload
    },
    postDone: (state) => {
      state.loading = false
      state.error = null
      state.response = null
    },
    deleteSuccess: (state, action) => {
      state.featureList = state.featureList.filter(
        (item) => item.user_id !== action.payload
      )
      state.loading = false
      state.error = null
      state.response = 'Deleted successfully'
    },
    createSuccess: (state, action) => {
      if (!Array.isArray(state.featureList)) {
        state.featureList = []
      }
      state.featureList.push(action.payload)
      state.loading = false
      state.error = null
      state.response = 'Created successfully'
    },
    updateSuccess: (state, action) => {
      if (Array.isArray(state.featureList)) {
        const index = state.featureList.findIndex(
          (item) => item.user_id === action.payload.user_id
        )
        if (index !== -1) {
          state.featureList[index] = action.payload
        }
      } else {
        console.warn('featureList is not an array!', state.featureList)
      }

      state.loading = false
      state.error = null
      state.response = 'Updated successfully'
    }
  }
})

export const {
  getRequest,
  doneSuccess,
  getSuccess,
  getFailed,
  getError,
  postDone,
  deleteSuccess,
  createSuccess,
  updateSuccess
} = featureSlice.actions

export const featureReducer = featureSlice.reducer
