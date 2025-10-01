import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  theatreList: [],
  theatreDetails: [],
  theatreByLocation: [],
  listLocation: [],
  loading: false,
  error: null,
  response: null
}

const theatreSlice = createSlice({
  name: 'theatre',
  initialState,
  reducers: {
    getRequest: (state) => {
      state.loading = true
    },
    doneSuccess: (state, action) => {
      state.theatreDetails = action.payload
      state.loading = false
      state.error = null
      state.response = null
    },
    getSuccess: (state, action) => {
      state.theatreList = action.payload
      state.loading = false
      state.error = null
      state.response = null
    },
    getLocation: (state, action) => {
      state.listLocation = action.payload
      state.loading = false
      state.error = null
      state.response = null
    },
    getTheatreByLocation: (state, action) => {
      state.theatreByLocation = action.payload
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
      state.theatreList = state.theatreList.filter(
        (item) => item.user_id !== action.payload
      )
      state.loading = false
      state.error = null
      state.response = 'Deleted successfully'
    },
    createSuccess: (state, action) => {
      if (!Array.isArray(state.theatreList)) {
        state.theatreList = []
      }
      state.theatreList.push(action.payload)
      state.loading = false
      state.error = null
      state.response = 'Created successfully'
    },
    updateSuccess: (state, action) => {
      if (Array.isArray(state.theatreList)) {
        const index = state.theatreList.findIndex(
          (item) => item.user_id === action.payload.user_id
        )
        if (index !== -1) {
          state.theatreList[index] = action.payload
        }
      } else {
        console.warn('theatreList is not an array!', state.theatreList)
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
  updateSuccess,
  getTheatreByLocation,
  getLocation
} = theatreSlice.actions

export const theatreReducer = theatreSlice.reducer
