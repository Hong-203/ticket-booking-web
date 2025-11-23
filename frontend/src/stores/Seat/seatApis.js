import { message } from "antd";
import axios from "../Axioscustom";
import {
  createSuccess,
  deleteSuccess,
  doneSuccess,
  getError,
  getFailed,
  getRequest,
  getSeatSuccess,
  postDone,
  updateSuccess,
} from "./seatSlice";
import { getAuthConfig } from "../authConfig";

const getSeatAvailable =
  (query = "") =>
  async (dispatch) => {
    dispatch(getRequest());
    try {
      const config = getAuthConfig();
      const res = await axios.get(
        `/seats/available${query ? `?${query}` : ""}`,
        config
      );
      if (res.data.message) {
        dispatch(getFailed(res.data.message));
      } else {
        dispatch(getSeatSuccess(res.data));
      }
    } catch (error) {
      dispatch(getError(error.message));
    }
  };

const createBooking = (data) => async (dispatch) => {
  dispatch(getRequest());
  try {
    const config = getAuthConfig();
    const res = await axios.post("/seats/seat-booking", data, config);
    if (res.data.message) {
      dispatch(getFailed(res.data.message));
      return { unsuccess: true, message: res.data.message };
    } else {
      dispatch(createSuccess(res.data));
      return { success: true, data: res.data };
    }
  } catch (error) {
    dispatch(getError(error.message));
  }
};
export { getSeatAvailable, createBooking };
