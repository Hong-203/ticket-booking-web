import { message } from 'antd'
import axios from '../Axioscustom'
import {
  createSuccess,
  deleteSuccess,
  doneSuccess,
  getError,
  getFailed,
  getRequest,
  getHallSuccess,
  postDone,
  updateSuccess,
  getHallSeat,
  getHallByTheatre
} from './hallSlice'
import { getAuthConfig } from '../authConfig'

const getAllHall = () => async (dispatch) => {
  dispatch(getRequest())
  try {
    const config = getAuthConfig()
    const res = await axios.get('/hall')
    if (res.data.message) {
      dispatch(getFailed(res.data.message))
    } else {
      dispatch(getHallSuccess(res.data))
    }
  } catch (error) {
    dispatch(getError(error.message))
  }
}

const allHallByTheatre = (id) => async (dispatch) => {
  dispatch(getRequest())
  try {
    const config = getAuthConfig()
    const res = await axios.get(`/hall/by-theatre/${id}`)
    if (res.data.message) {
      dispatch(getFailed(res.data.message))
    } else {
      dispatch(getHallByTheatre(res.data))
    }
  } catch (error) {
    dispatch(getError(error.message))
  }
}

const update = (id, hallData) => async (dispatch) => {
  dispatch(getRequest())
  try {
    const config = getAuthConfig()
    const res = await axios.patch(`/hall/${id}`, hallData, config)
    if (res.data.message) {
      dispatch(getFailed(res.data.message))
    } else {
      dispatch(updateSuccess(res.data))
    }
  } catch (error) {
    dispatch(getError(error.message))
  }
}

const deleteHall = (id) => async (dispatch) => {
  dispatch(getRequest())
  try {
    const config = getAuthConfig()
    const res = await axios.delete(`/hall/${id}`, config)
    if (res.data.message) {
      dispatch(getFailed(res.data.message))
    } else {
      dispatch(deleteSuccess(res.data))
    }
  } catch (error) {
    dispatch(getError(error.message))
  }
}

const createHall = (data) => async (dispatch) => {
  dispatch(getRequest())
  try {
    const config = getAuthConfig()
    const res = await axios.post('/hall', data, config)
    if (res.data.message) {
      dispatch(getFailed(res.data.message))
    } else {
      dispatch(createSuccess(res.data))
    }
  } catch (error) {
    dispatch(getError(error.message))
  }
}

const createHallwiseSeat = (data) => async (dispatch) => {
  dispatch(getRequest())
  try {
    const config = getAuthConfig()
    const res = await axios.post(
      '/hallwise-seat/assign-all-seats',
      data,
      config
    )
    if (res.data.message) {
      dispatch(getFailed(res.data.message))
    } else {
      dispatch(createSuccess(res.data))
    }
  } catch (error) {
    dispatch(getError(error.message))
  }
}

const getHallSeats = (hallId, page, limit) => async (dispatch) => {
  dispatch(getRequest())
  try {
    const config = getAuthConfig()
    const res = await axios.get(
      `/hall/hall-seats/${hallId}?type=A&status=empty&page=${page}&limit=${limit}`,
      config
    )
    if (res.data.message) {
      dispatch(getFailed(res.data.message))
      return null
    } else {
      dispatch(getHallSeat(res.data))
      return res
    }
  } catch (error) {
    dispatch(getError(error.message))
    return null
  }
}

export {
  getAllHall,
  update,
  deleteHall,
  createHall,
  createHallwiseSeat,
  getHallSeats,
  allHallByTheatre
}
