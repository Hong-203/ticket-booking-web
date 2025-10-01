import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  concessionItemsList: [],
  concessionItemsDetails: [],
  loading: false,
  error: null,
  response: null
}

const concessionItemsSlice = createSlice({
  name: 'concession-items',
  initialState,
  reducers: {
    getRequest: (state) => {
      state.loading = true
    },
    doneSuccess: (state, action) => {
      state.concessionItemsDetails = action.payload
      state.loading = false
      state.error = null
      state.response = null
    },
    getSuccess: (state, action) => {
      state.concessionItemsList = action.payload
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
      state.concessionItemsList = state.concessionItemsList.filter(
        (item) => item.user_id !== action.payload
      )
      state.loading = false
      state.error = null
      state.response = 'Deleted successfully'
    },
    createSuccess: (state, action) => {
      if (!Array.isArray(state.concessionItemsList)) {
        state.concessionItemsList = []
      }
      state.concessionItemsList.push(action.payload)
      state.loading = false
      state.error = null
      state.response = 'Created successfully'
    },
    updateSuccess: (state, action) => {
      if (Array.isArray(state.concessionItemsList)) {
        const index = state.concessionItemsList.findIndex(
          (item) => item.user_id === action.payload.user_id
        )
        if (index !== -1) {
          state.concessionItemsList[index] = action.payload
        }
      } else {
        console.warn(
          'concessionItemsList is not an array!',
          state.concessionItemsList
        )
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
} = concessionItemsSlice.actions

export const concessionItemsReducer = concessionItemsSlice.reducer
