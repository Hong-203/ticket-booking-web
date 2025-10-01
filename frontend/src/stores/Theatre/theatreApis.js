import { message } from 'antd'
import axios from '../Axioscustom'
import {
  createSuccess,
  deleteSuccess,
  doneSuccess,
  getError,
  getFailed,
  getRequest,
  getSuccess,
  postDone,
  updateSuccess,
  getLocation,
  getTheatreByLocation
} from './theatreSlice'
import { getAuthConfig } from '../authConfig'

const getAllTheatre = () => async (dispatch) => {
  dispatch(getRequest())
  try {
    const config = getAuthConfig()
    const res = await axios.get('/theatre')
    if (res.data.message) {
      dispatch(getFailed(res.data.message))
    } else {
      dispatch(getSuccess(res.data))
    }
  } catch (error) {
    dispatch(getError(error.message))
  }
}

const getAllLocation = () => async (dispatch) => {
  dispatch(getRequest())
  try {
    const config = getAuthConfig()
    const res = await axios.get('/theatre/locations')
    if (res.data.message) {
      dispatch(getFailed(res.data.message))
    } else {
      dispatch(getLocation(res.data))
    }
  } catch (error) {
    dispatch(getError(error.message))
  }
}

const theatreByLocation = (slug) => async (dispatch) => {
  dispatch(getRequest())
  try {
    const config = getAuthConfig()
    const res = await axios.get(`/theatre/location/${slug}`)
    if (res.data.message) {
      dispatch(getFailed(res.data.message))
    } else {
      dispatch(getTheatreByLocation(res.data))
    }
  } catch (error) {
    dispatch(getError(error.message))
  }
}

const createTheatre = (data) => async (dispatch) => {
  dispatch(getRequest())
  try {
    const config = getAuthConfig()
    const res = await axios.post('/theatre', data, config)
    if (res.data.message) {
      dispatch(getFailed(res.data.message))
    } else {
      dispatch(createSuccess(res.data))
    }
  } catch (error) {
    dispatch(getError(error.message))
  }
}

const update = (id, theatreData) => async (dispatch) => {
  dispatch(getRequest())
  try {
    const config = getAuthConfig()
    const res = await axios.patch(`/theatre/${id}`, theatreData, config)
    if (res.data.message) {
      dispatch(getFailed(res.data.message))
    } else {
      dispatch(updateSuccess(res.data))
    }
  } catch (error) {
    dispatch(getError(error.message))
  }
}

const deleteTheatre = (id) => async (dispatch) => {
  dispatch(getRequest())
  try {
    const config = getAuthConfig()
    const res = await axios.delete(`/theatre/${id}`, config)
    if (res.data.message) {
      dispatch(getFailed(res.data.message))
    } else {
      dispatch(deleteSuccess(res.data))
    }
  } catch (error) {
    dispatch(getError(error.message))
  }
}

export {
  getAllTheatre,
  update,
  deleteTheatre,
  createTheatre,
  theatreByLocation,
  getAllLocation
}
