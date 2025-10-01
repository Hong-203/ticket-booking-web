import { message } from 'antd'
import axios from '../Axioscustom'
import {
  createPaySuccess,
  deleteSuccess,
  doneSuccess,
  getError,
  getFailed,
  getRequest,
  getPaySuccess,
  postDone,
  updateSuccess
} from './paymentSlice'
import { getAuthConfig } from '../authConfig'

const createPayMomo = (data) => {
  return async (dispatch) => {
    dispatch(getRequest())
    try {
      const config = getAuthConfig()
      const res = await axios.post('/payments/create-momo', data, config)
      console.log('res', res)
      if (res.data.message) {
        dispatch(getFailed(res.data.message))
      } else {
        dispatch(createPaySuccess(res.data))
      }
      return res
    } catch (error) {
      dispatch(getError(error.message))
      throw error
    }
  }
}

const createPayZaloPay = (data) => {
  return async (dispatch) => {
    dispatch(getRequest())
    try {
      const config = getAuthConfig()
      const res = await axios.post('/payments/create-zalopay', data, config)
      console.log('res', res)
      if (res.data.message) {
        dispatch(getFailed(res.data.message))
      } else {
        dispatch(createPaySuccess(res.data))
      }
      return res
    } catch (error) {
      dispatch(getError(error.message))
      throw error
    }
  }
}

export { createPayMomo, createPayZaloPay }
