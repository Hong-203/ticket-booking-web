import { message } from "antd";
import axios from "../Axioscustom";
import {
  createPaySuccess,
  deleteSuccess,
  doneSuccess,
  getError,
  getFailed,
  getRequest,
  getPaySuccess,
  postDone,
  updateSuccess,
  doneMyPaySuccess,
} from "./paymentSlice";
import { getAuthConfig } from "../authConfig";

const createPayMomo = (data) => {
  return async (dispatch) => {
    dispatch(getRequest());
    try {
      const config = getAuthConfig();
      const res = await axios.post("/payments/create-momo", data, config);
      console.log("res", res);
      if (res.data.message) {
        dispatch(getFailed(res.data.message));
      } else {
        dispatch(createPaySuccess(res.data));
      }
      return res;
    } catch (error) {
      dispatch(getError(error.message));
      throw error;
    }
  };
};

const createPayZaloPay = (data) => {
  return async (dispatch) => {
    dispatch(getRequest());
    try {
      const config = getAuthConfig();
      const res = await axios.post("/payments/create-zalopay", data, config);
      console.log("res", res);
      if (res.data.message) {
        dispatch(getFailed(res.data.message));
      } else {
        dispatch(createPaySuccess(res.data));
      }
      return res;
    } catch (error) {
      dispatch(getError(error.message));
      throw error;
    }
  };
};

const getMyPayments =
  (filter = {}) =>
  async (dispatch) => {
    dispatch(getRequest());
    try {
      const config = {
        ...getAuthConfig(),
        params: filter, // đây là params query
      };
      const res = await axios.get(`/payments/me`, config);
      if (res.data.message) {
        dispatch(getFailed(res.data.message));
      } else {
        dispatch(doneMyPaySuccess(res.data));
      }
    } catch (error) {
      dispatch(getError(error.message));
    }
  };

const getAllPayments =
  (filter = {}) =>
  async (dispatch) => {
    dispatch(getRequest());
    try {
      const config = {
        ...getAuthConfig(),
        params: filter,
      };
      const res = await axios.get(`/payments`, config);
      if (res.data.message) {
        dispatch(getFailed(res.data.message));
      } else {
        dispatch(getPaySuccess(res.data));
      }
    } catch (error) {
      dispatch(getError(error.message));
    }
  };

export { createPayMomo, createPayZaloPay, getMyPayments, getAllPayments };
