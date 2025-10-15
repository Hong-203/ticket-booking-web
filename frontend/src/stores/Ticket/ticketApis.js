import { message } from "antd";
import axios from "../Axioscustom";
import {
  createSuccess,
  deleteSuccess,
  doneTicketSuccess,
  doneMyTicketSuccess,
  getError,
  getFailed,
  getRequest,
  getTicketSuccess,
  postDone,
  updateSuccess,
} from "./ticketSlice";
import { getAuthConfig } from "../authConfig";

const getTicketById = (ticketId) => async (dispatch) => {
  dispatch(getRequest());
  try {
    const config = getAuthConfig();
    const res = await axios.get(`/tickets/${ticketId}`, config);
    if (res.data.message) {
      dispatch(getFailed(res.data.message));
    } else {
      dispatch(doneTicketSuccess(res.data));
    }
  } catch (error) {
    dispatch(getError(error.message));
  }
};

const getMyTicket = () => async (dispatch) => {
  dispatch(getRequest());
  try {
    const config = getAuthConfig();
    const res = await axios.get(`/tickets/me`, config);
    if (res.data.message) {
      dispatch(getFailed(res.data.message));
    } else {
      dispatch(doneMyTicketSuccess(res.data));
    }
  } catch (error) {
    dispatch(getError(error.message));
  }
};

const createTicket = (data) => async (dispatch) => {
  dispatch(getRequest());
  try {
    const config = getAuthConfig();
    const res = await axios.post("/tickets", data, config);
    if (res.data.message) {
      dispatch(getFailed(res.data.message));
    } else {
      dispatch(createSuccess(res.data));
      return { success: true, data: res.data };
    }
  } catch (error) {
    dispatch(getError(error.message));
  }
};
export { getTicketById, createTicket, getMyTicket };
