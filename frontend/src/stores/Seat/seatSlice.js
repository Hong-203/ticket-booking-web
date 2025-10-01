import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  seatList: [],
  seatDetails: [],
  loading: false,
  error: null,
  response: null
}

const seatSlice = createSlice({
  name: 'seats',
  initialState,
  reducers: {
    getRequest: (state) => {
      state.loading = true
    },
    doneSuccess: (state, action) => {
      state.seatDetails = action.payload
      state.loading = false
      state.error = null
      state.response = null
    },
    getSeatSuccess: (state, action) => {
      state.seatList = action.payload
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
      state.seatList = state.seatList.filter(
        (item) => item.user_id !== action.payload
      )
      state.loading = false
      state.error = null
      state.response = 'Deleted successfully'
    },
    createSuccess: (state, action) => {
      if (!Array.isArray(state.seatList)) {
        state.seatList = []
      }
      state.seatList.push(action.payload)
      state.loading = false
      state.error = null
      state.response = 'Created successfully'
    },
    updateSuccess: (state, action) => {
      if (Array.isArray(state.seatList)) {
        const index = state.seatList.findIndex(
          (item) => item.user_id === action.payload.user_id
        )
        if (index !== -1) {
          state.seatList[index] = action.payload
        }
      } else {
        console.warn('seatList is not an array!', state.seatList)
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
  getSeatSuccess,
  getFailed,
  getError,
  postDone,
  deleteSuccess,
  createSuccess,
  updateSuccess
} = seatSlice.actions

export const seatReducer = seatSlice.reducer
