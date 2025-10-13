import React, { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Result, Button, Spin, Typography } from 'antd'
import {
  LoadingOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import { getUserProfile } from '../../stores/Users/userApis'

const { Title } = Typography

const AuthSuccess = ({ setIsAdmin }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const profile = useSelector((state) => state.user.profile || {})
  const getQueryParam = (param) => {
    return new URLSearchParams(location.search).get(param)
  }

  useEffect(() => {
    const token = getQueryParam('token')
    const error = getQueryParam('error')

    if (error) {
      setTimeout(() => navigate('/login'), 3000)
    } else if (token) {
      localStorage.setItem('token', token)
      dispatch(getUserProfile())
    }
  }, [location, navigate, dispatch])

  useEffect(() => {
    if (profile && profile.id) {
      const token = localStorage.getItem('token')

      const userData = {
        id: profile.id,
        username: profile.full_name,
        email: profile.email,
        phone: profile.phone_number,
        role: profile.account_type,
        token: token,
        isAdmin: profile.account_type === 'admin'
      }

      localStorage.setItem('user', JSON.stringify(userData))

      setTimeout(() => navigate('/'), 2000)
    }
  }, [profile, navigate])

  const token = getQueryParam('token')
  const error = getQueryParam('error')

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {error ? (
        <Result
          icon={<CloseCircleOutlined style={{ color: 'red' }} />}
          status="error"
          title="Đăng nhập Google thất bại!"
          subTitle={decodeURIComponent(error)}
          extra={
            <Button type="primary" onClick={() => navigate('/login')}>
              Thử lại
            </Button>
          }
        />
      ) : token ? (
        <Result
          icon={<CheckCircleOutlined style={{ color: 'green' }} />}
          status="success"
          title="Đăng nhập Google thành công!"
          subTitle="Đang chuyển hướng về trang chủ..."
        />
      ) : (
        <Spin
          indicator={<LoadingOutlined style={{ fontSize: 36 }} spin />}
          tip={<Title level={4}>Đang xử lý đăng nhập Google...</Title>}
        />
      )}
    </div>
  )
}

export default AuthSuccess
