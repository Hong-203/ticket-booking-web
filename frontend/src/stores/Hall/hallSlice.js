import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  hallList: [],
  hallDetails: [],
  hallSeat: [],
  hallByTheatre: [],
  loading: false,
  error: null,
  response: null
}

const hallSlice = createSlice({
  name: 'hall',
  initialState,
  reducers: {
    getRequest: (state) => {
      state.loading = true
    },
    doneSuccess: (state, action) => {
      state.hallDetails = action.payload
      state.loading = false
      state.error = null
      state.response = null
    },
    getHallSuccess: (state, action) => {
      state.hallList = action.payload
      state.loading = false
      state.error = null
      state.response = null
    },
    getHallSeat: (state, action) => {
      state.hallSeat = action.payload
      state.loading = false
      state.error = null
      state.response = null
    },
    getHallByTheatre: (state, action) => {
      state.hallByTheatre = action.payload
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
      state.hallList = state.hallList.filter(
        (item) => item.user_id !== action.payload
      )
      state.loading = false
      state.error = null
      state.response = 'Deleted successfully'
    },
    createSuccess: (state, action) => {
      if (!Array.isArray(state.hallList)) {
        state.hallList = []
      }
      state.hallList.push(action.payload)
      state.loading = false
      state.error = null
      state.response = 'Created successfully'
    },
    updateSuccess: (state, action) => {
      if (Array.isArray(state.hallList)) {
        const index = state.hallList.findIndex(
          (item) => item.user_id === action.payload.user_id
        )
        if (index !== -1) {
          state.hallList[index] = action.payload
        }
      } else {
        console.warn('hallList is not an array!', state.hallList)
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
  getHallSuccess,
  getFailed,
  getError,
  postDone,
  deleteSuccess,
  createSuccess,
  updateSuccess,
  getHallSeat,
  getHallByTheatre
} = hallSlice.actions

export const hallReducer = hallSlice.reducer
