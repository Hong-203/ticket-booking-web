import { message } from 'antd'
import axios from '../Axioscustom'
import {
  createSuccess,
  deleteSuccess,
  doneSuccess,
  getError,
  getFailed,
  getRequest,
  getSearch,
  getSuccess,
  postDone,
  getProfile,
  updateSuccess
} from './userSlice'
import { getAuthConfig } from '../authConfig'

const register = (data) => async (dispatch) => {
  dispatch(getRequest())

  try {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const result = await axios.post('/auth/register', data, config)
    if (
      result.data.message &&
      result.data.message !== 'Verification code sent to email'
    ) {
      dispatch(getFailed(result.data.message))
      message.error(result.data.message)
      throw new Error(result.data.message)
    }

    dispatch(postDone())
    dispatch(getSuccess(result.data)) // hoặc dispatch action phù hợp với bạn

    message.success(
      result.data.message || 'Verification code sent to your email'
    )

    return result.data // để component xử lý tiếp
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || 'Register failed. Please try again.'
    dispatch(getFailed(errorMessage))
    message.error(errorMessage)
    console.error('Register error:', errorMessage)
    throw error
  }
}

const login = (data) => async (dispatch) => {
  dispatch(getRequest())

  try {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const response = await axios.post('/auth/login', data, config)
    const resData = response.data

    // Kiểm tra token
    if (!resData?.token) {
      const message = 'Đăng nhập không thành công. Token không tồn tại.'
      dispatch(getFailed(message))
      throw new Error(message)
    }

    // Format lại dữ liệu user lưu vào localStorage
    const userData = {
      id: resData.id,
      username: resData.username,
      email: resData.email,
      phone: resData.phone,
      role: resData.role,
      token: resData.token,
      isAdmin: resData.role === 'admin'
    }

    // Lưu vào localStorage
    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('token', resData.token)

    dispatch(postDone())
    dispatch(doneSuccess(userData))
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      'Đã xảy ra lỗi. Vui lòng thử lại.'
    dispatch(getError(errorMessage))
    console.error('Login error:', errorMessage)
    throw error
  }
}

const getUserProfile = () => async (dispatch) => {
  dispatch(getRequest())

  try {
    const config = getAuthConfig()
    const result = await axios.get(`/users/me`, config)

    if (result.data.message) {
      dispatch(getFailed(result.data.message))
      throw new Error(result.data.message)
    }

    dispatch(getProfile(result.data))
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || 'Search failed. Please try again.'
    dispatch(getFailed(errorMessage))
    console.error('Search user error:', errorMessage)
    throw error
  }
}

const updateUser = (id, userData) => async (dispatch) => {
  dispatch(getRequest())
  try {
    const config = getAuthConfig()
    const res = await axios.patch(`/users/${id}`, userData, config)
    if (res.data.message) {
      dispatch(getFailed(res.data.message))
    } else {
      dispatch(updateSuccess(res.data))
    }
  } catch (error) {
    dispatch(getError(error.message))
  }
}

const getAllUser = () => async (dispatch) => {
  dispatch(getRequest())
  try {
    const config = getAuthConfig()
    const res = await axios.get('/users')
    if (res.data.message) {
      dispatch(getFailed(res.data.message))
    } else {
      dispatch(getSuccess(res.data))
    }
  } catch (error) {
    dispatch(getError(error.message))
  }
}

const deleteUser = (id) => async (dispatch) => {
  dispatch(getRequest())
  try {
    const config = getAuthConfig()
    const res = await axios.delete(`/users/${id}`, config)
    if (res.data.message) {
      dispatch(getFailed(res.data.message))
    } else {
      dispatch(deleteSuccess(res.data))
    }
  } catch (error) {
    dispatch(getError(error.message))
  }
}

export { register, login, getUserProfile, updateUser, getAllUser, deleteUser }
