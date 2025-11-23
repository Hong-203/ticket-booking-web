import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  movieList: [],
  movieListCS: [],
  movieDetails: [],
  loading: false,
  error: null,
  response: null,
  total: null,
  page: null,
  limit: null,
  totalPages: null,
};

const movieSlice = createSlice({
  name: "movie",
  initialState,
  reducers: {
    getRequest: (state) => {
      state.loading = true;
    },
    doneSuccess: (state, action) => {
      state.movieDetails = action.payload;
      state.loading = false;
      state.error = null;
      state.response = null;
    },
    getMovieSuccess: (state, action) => {
      state.movieList = action.payload;
      state.total = action.payload.total;
      state.page = action.payload.page;
      state.limit = action.payload.limit;
      state.totalPages = action.payload.totalPages;
      state.loading = false;
      state.error = null;
      state.response = null;
    },
    getMovieSuccessCS: (state, action) => {
      state.movieListCS = action.payload;
      state.total = action.payload.total;
      state.page = action.payload.page;
      state.limit = action.payload.limit;
      state.totalPages = action.payload.totalPages;
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
      state.movieList = state.movieList.filter(
        (item) => item.user_id !== action.payload
      );
      state.loading = false;
      state.error = null;
      state.response = "Deleted successfully";
    },
    createSuccess: (state, action) => {
      if (!Array.isArray(state.movieList)) {
        state.movieList = [];
      }
      state.movieList.push(action.payload);
      state.loading = false;
      state.error = null;
      state.response = "Created successfully";
    },
    updateSuccess: (state, action) => {
      if (Array.isArray(state.movieList)) {
        const index = state.movieList.findIndex(
          (item) => item.user_id === action.payload.user_id
        );
        if (index !== -1) {
          state.movieList[index] = action.payload;
        }
      } else {
        console.warn("movieList is not an array!", state.movieList);
      }

      state.loading = false;
      state.error = null;
      state.response = "Updated successfully";
    },
  },
});

export const {
  getRequest,
  doneSuccess,
  getMovieSuccess,
  getFailed,
  getError,
  postDone,
  deleteSuccess,
  createSuccess,
  updateSuccess,
  getMovieSuccessCS,
} = movieSlice.actions;

export const movieReducer = movieSlice.reducer;
