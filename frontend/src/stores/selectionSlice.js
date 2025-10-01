import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  selectedLocation: null,
  selectedTheatre: null
}

const selectionSlice = createSlice({
  name: 'selection',
  initialState,
  reducers: {
    setSelectedLocation: (state, action) => {
      state.selectedLocation = action.payload
    },
    setSelectedTheatre: (state, action) => {
      state.selectedTheatre = action.payload
    }
  }
})

export const { setSelectedLocation, setSelectedTheatre } =
  selectionSlice.actions

export const selectionReducer = selectionSlice.reducer
