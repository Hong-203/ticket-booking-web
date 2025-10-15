import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  ticketList: [],
  ticketDetails: [],
  myTickets: [],
  loading: false,
  error: null,
  response: null,
};

const ticketSlice = createSlice({
  name: "ticket",
  initialState,
  reducers: {
    getRequest: (state) => {
      state.loading = true;
    },
    doneTicketSuccess: (state, action) => {
      state.ticketDetails = action.payload;
      state.loading = false;
      state.error = null;
      state.response = null;
    },
    doneMyTicketSuccess: (state, action) => {
      state.myTickets = action.payload;
      state.loading = false;
      state.error = null;
      state.response = null;
    },
    getTicketSuccess: (state, action) => {
      state.ticketList = action.payload;
      state.loading = false;
      state.error = null;
      state.response = null;
    },
    getFailed: (state, action) => {
      state.response = action.payload;
      state.loading = false;
      state.error = null;
    },
    getError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    postDone: (state) => {
      state.loading = false;
      state.error = null;
      state.response = null;
    },
    deleteSuccess: (state, action) => {
      state.ticketList = state.ticketList.filter(
        (item) => item.user_id !== action.payload
      );
      state.loading = false;
      state.error = null;
      state.response = "Deleted successfully";
    },
    createSuccess: (state, action) => {
      if (!Array.isArray(state.ticketList)) {
        state.ticketList = [];
      }
      state.ticketList.push(action.payload);
      state.loading = false;
      state.error = null;
      state.response = "Created successfully";
    },
    updateSuccess: (state, action) => {
      if (Array.isArray(state.ticketList)) {
        const index = state.ticketList.findIndex(
          (item) => item.user_id === action.payload.user_id
        );
        if (index !== -1) {
          state.ticketList[index] = action.payload;
        }
      } else {
        console.warn("ticketList is not an array!", state.ticketList);
      }

      state.loading = false;
      state.error = null;
      state.response = "Updated successfully";
    },
  },
});

export const {
  getRequest,
  doneTicketSuccess,
  doneMyTicketSuccess,
  getTicketSuccess,
  getFailed,
  getError,
  postDone,
  deleteSuccess,
  createSuccess,
  updateSuccess,
} = ticketSlice.actions;

export const ticketReducer = ticketSlice.reducer;
