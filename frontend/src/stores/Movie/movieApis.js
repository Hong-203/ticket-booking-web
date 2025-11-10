import { message } from "antd";
import axios from "../Axioscustom";
import {
  createSuccess,
  deleteSuccess,
  doneSuccess,
  getError,
  getFailed,
  getRequest,
  getMovieSuccess,
  postDone,
  updateSuccess,
} from "./movieSlice";
import { getAuthConfig } from "../authConfig";

const getAllMovie =
  ({ status = "", page = 1, limit = 10, search = "" } = {}) =>
  async (dispatch) => {
    dispatch(getRequest());
    try {
      const config = getAuthConfig();
      const query = `?page=${page}&limit=${limit}${
        status ? `&status=${status}` : ""
      }${search ? `&search=${encodeURIComponent(search)}` : ""}`;

      const res = await axios.get(`/movies${query}`, config);

      if (res.data.message) {
        dispatch(getFailed(res.data.message));
      } else {
        dispatch(getMovieSuccess(res.data));
      }
    } catch (error) {
      dispatch(getError(error.message));
    }
  };

const getMovieById = (id) => async (dispatch) => {
  dispatch(getRequest());
  try {
    const config = getAuthConfig();
    const res = await axios.get(`/movies/${id}`, config);
    if (res.data.message) {
      dispatch(getFailed(res.data.message));
    } else {
      dispatch(doneSuccess(res.data));
    }
  } catch (error) {
    dispatch(getError(error.message));
  }
};

const getMovieBySlug = (slug) => async (dispatch) => {
  dispatch(getRequest());
  try {
    const config = getAuthConfig();
    const res = await axios.get(`/movies/slug/${slug}`, config);
    if (res.data.message) {
      dispatch(getFailed(res.data.message));
    } else {
      dispatch(doneSuccess(res.data));
    }
  } catch (error) {
    dispatch(getError(error.message));
  }
};

const editMovie = (id, data) => async (dispatch) => {
  dispatch(updateSuccess(data));
  try {
    const config = getAuthConfig();
    const res = await axios.patch(`/movies/${id}`, data, config);
    if (res.data.message) {
      dispatch(getFailed(res.data.message));
    } else {
      dispatch(doneSuccess(res.data));
    }
  } catch (error) {
    dispatch(getError(error.message));
  }
};

const deleteMovie = (id) => async (dispatch) => {
  dispatch(getRequest());
  try {
    const config = getAuthConfig();
    const res = await axios.delete(`/movies/${id}`, config);
    if (res.data.message) {
      dispatch(getFailed(res.data.message));
    } else {
      dispatch(deleteSuccess());
    }
  } catch (error) {
    dispatch(getError(error.message));
  }
};

const createMovie = (formData) => async (dispatch) => {
  dispatch(getRequest());
  try {
    const config = {
      ...getAuthConfig(),
      headers: {
        ...getAuthConfig().headers,
        "Content-Type": "multipart/form-data",
      },
    };

    const res = await axios.post("/movies", formData, config);
    if (res.data.message) {
      dispatch(getFailed(res.data.message));
    } else {
      dispatch(createSuccess(res.data));
    }
  } catch (error) {
    dispatch(getError(error.message));
  }
};

export {
  getAllMovie,
  getMovieById,
  editMovie,
  deleteMovie,
  createMovie,
  getMovieBySlug,
};
