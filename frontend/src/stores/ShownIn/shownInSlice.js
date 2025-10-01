import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  shownInList: [],
  shownInDetails: [],
  loading: false,
  error: null,
  response: null
}

const shownInSlice = createSlice({
  name: 'shownin',
  initialState,
  reducers: {
    getRequest: (state) => {
      state.loading = true
    },
    doneSuccess: (state, action) => {
      state.shownInDetails = action.payload
      state.loading = false
      state.error = null
      state.response = null
    },
    getSTSuccess: (state, action) => {
      state.shownInList = action.payload
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
      state.shownInList = state.shownInList.filter(
        (item) => item.user_id !== action.payload
      )
      state.loading = false
      state.error = null
      state.response = 'Deleted successfully'
    },
    createSuccess: (state, action) => {
      if (!Array.isArray(state.shownInList)) {
        state.shownInList = []
      }
      state.shownInList.push(action.payload)
      state.loading = false
      state.error = null
      state.response = 'Created successfully'
    },
    updateSuccess: (state, action) => {
      if (Array.isArray(state.shownInList)) {
        const index = state.shownInList.findIndex(
          (item) => item.user_id === action.payload.user_id
        )
        if (index !== -1) {
          state.shownInList[index] = action.payload
        }
      } else {
        console.warn('shownInList is not an array!', state.shownInList)
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
  getSTSuccess,
  getFailed,
  getError,
  postDone,
  deleteSuccess,
  createSuccess,
  updateSuccess
} = shownInSlice.actions

export const shownInReducer = shownInSlice.reducer
