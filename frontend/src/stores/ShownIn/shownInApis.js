import { message } from 'antd'
import axios from '../Axioscustom'
import {
  createSuccess,
  deleteSuccess,
  doneSuccess,
  getError,
  getFailed,
  getRequest,
  getSTSuccess,
  postDone,
  updateSuccess
} from './shownInSlice'
import { getAuthConfig } from '../authConfig'

const getAllShownIn =
  (query = '') =>
  async (dispatch) => {
    dispatch(getRequest())
    try {
      const config = getAuthConfig()
      const res = await axios.get(
        `/shown-in${query ? `?${query}` : ''}`,
        config
      )
      if (res.data.message) {
        dispatch(getFailed(res.data.message))
      } else {
        dispatch(getSTSuccess(res.data))
      }
    } catch (error) {
      dispatch(getError(error.message))
    }
  }

const createShownIn = (data) => async (dispatch) => {
  dispatch(postDone())
  try {
    const config = getAuthConfig()
    const res = await axios.post('/shown-in', data, config)
    if (res.data.message) {
      dispatch(getFailed(res.data.message))
    } else {
      dispatch(getSTSuccess(res.data))
    }
  } catch (error) {
    dispatch(getError(error.message))
  }
}

const updateShownIn = (data) => async (dispatch) => {
  dispatch(postDone())
  try {
    const config = getAuthConfig()
    const res = await axios.patch('/shown-in', data, config)
    if (res.data.message) {
      dispatch(getFailed(res.data.message))
    } else {
      dispatch(updateSuccess(res.data))
    }
  } catch (error) {
    dispatch(getError(error.message))
  }
}

const deleteShownIn = (id) => async (dispatch) => {
  dispatch(deleteDone())
  try {
    const config = getAuthConfig()
    const res = await axios.delete(`/shown-in/${id}`, config)
    if (res.data.message) {
      dispatch(getFailed(res.data.message))
    } else {
      dispatch(deleteSuccess(res.data))
    }
  } catch (error) {
    dispatch(getError(error.message))
  }
}

export { getAllShownIn, createShownIn, updateShownIn, deleteShownIn }
