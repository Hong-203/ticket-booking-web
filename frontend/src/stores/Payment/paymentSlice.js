import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  payList: [],
  payDetails: [],
  loading: false,
  error: null,
  response: null
}

const paySlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    getRequest: (state) => {
      state.loading = true
    },
    doneSuccess: (state, action) => {
      state.payDetails = action.payload
      state.loading = false
      state.error = null
      state.response = null
    },
    getPaySuccess: (state, action) => {
      state.payList = action.payload
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
      state.payList = state.payList.filter(
        (item) => item.user_id !== action.payload
      )
      state.loading = false
      state.error = null
      state.response = 'Deleted successfully'
    },
    createPaySuccess: (state, action) => {
      if (!Array.isArray(state.payList)) {
        state.payList = []
      }
      state.payList.push(action.payload)
      state.loading = false
      state.error = null
      state.response = 'Created successfully'
    },
    updateSuccess: (state, action) => {
      if (Array.isArray(state.payList)) {
        const index = state.payList.findIndex(
          (item) => item.user_id === action.payload.user_id
        )
        if (index !== -1) {
          state.payList[index] = action.payload
        }
      } else {
        console.warn('payList is not an array!', state.payList)
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
  getPaySuccess,
  getFailed,
  getError,
  postDone,
  deleteSuccess,
  createPaySuccess,
  updateSuccess
} = paySlice.actions

export const paymentReducer = paySlice.reducer
