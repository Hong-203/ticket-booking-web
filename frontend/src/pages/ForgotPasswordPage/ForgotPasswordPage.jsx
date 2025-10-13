import React, { useState } from 'react'
import { Form, Input, Button, Typography, message } from 'antd'
import {
  MailOutlined,
  LockOutlined,
  SafetyOutlined,
  CheckCircleOutlined
} from '@ant-design/icons'
import { forgotPassword } from '../../stores/Users/userApis'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'

const { Title, Text } = Typography

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [email, setEmail] = useState('')
  const dispatch = useDispatch()
  const handleSubmit = async () => {
    if (!email) {
      toast.error('Vui lòng nhập email!')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Email không hợp lệ!')
      return
    }

    setLoading(true)
    try {
      // gọi API forgot password
      const res = await dispatch(forgotPassword({ email }))

      if (res?.success) {
        toast.success('Email khôi phục đã được gửi!')
        setEmailSent(true)
      } else {
        toast.error('Gửi email thất bại, vui lòng thử lại!')
      }
    } catch (err) {
      toast.error('Đã xảy ra lỗi, vui lòng thử lại!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}
    >
      {/* Left Side - Form */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px'
        }}
      >
        <div
          style={{
            background: 'white',
            borderRadius: '20px',
            padding: '50px',
            maxWidth: '480px',
            width: '100%',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }}
        >
          {!emailSent ? (
            <>
              <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <div
                  style={{
                    width: '70px',
                    height: '70px',
                    background:
                      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px',
                    fontSize: '32px',
                    color: 'white'
                  }}
                >
                  <LockOutlined />
                </div>
                <Title
                  level={2}
                  style={{ marginBottom: '10px', color: '#1a1a1a' }}
                >
                  Quên Mật Khẩu?
                </Title>
                <Text style={{ color: '#666', fontSize: '15px' }}>
                  Đừng lo lắng! Nhập email của bạn và chúng tôi sẽ gửi mật khẩu
                  mới
                </Text>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <Text
                  style={{
                    fontWeight: 600,
                    marginBottom: '8px',
                    display: 'block'
                  }}
                >
                  Email
                </Text>
                <Input
                  prefix={<MailOutlined style={{ color: '#667eea' }} />}
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onPressEnter={handleSubmit}
                  size="large"
                  style={{ borderRadius: '10px', padding: '12px' }}
                />
              </div>

              <Button
                type="primary"
                loading={loading}
                onClick={handleSubmit}
                block
                size="large"
                style={{
                  height: '50px',
                  borderRadius: '10px',
                  background:
                    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  fontSize: '16px',
                  fontWeight: '600',
                  marginBottom: '20px'
                }}
              >
                Tạo Mật Khẩu Mới
              </Button>

              <div style={{ textAlign: 'center' }}>
                <Text style={{ color: '#666' }}>
                  Nhớ mật khẩu rồi?{' '}
                  <a href="#" style={{ color: '#667eea', fontWeight: '600' }}>
                    Đăng nhập
                  </a>
                </Text>
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  background:
                    'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 30px',
                  fontSize: '40px',
                  color: 'white'
                }}
              >
                <CheckCircleOutlined />
              </div>
              <Title
                level={2}
                style={{ marginBottom: '15px', color: '#1a1a1a' }}
              >
                Kiểm Tra Email!
              </Title>
              <Text
                style={{
                  color: '#666',
                  fontSize: '15px',
                  display: 'block',
                  marginBottom: '30px'
                }}
              >
                Chúng tôi đã gửi mật khẩu reset đến email của bạn. Vui lòng kiểm
                tra hộp thư. Hãy đổi lại mật khẩu để đảm bảo an toàn !!!
              </Text>
              <Button
                type="primary"
                size="large"
                onClick={() => {
                  setEmailSent(false)
                  setEmail('')
                }}
                style={{
                  height: '50px',
                  borderRadius: '10px',
                  background:
                    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  fontWeight: '600',
                  width: '100%'
                }}
              >
                Quay Lại
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Right Side - Illustration */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
          position: 'relative'
        }}
      >
        <div
          style={{
            textAlign: 'center',
            color: 'white',
            maxWidth: '500px'
          }}
        >
          {/* Security Icon Animation */}
          <div
            style={{
              width: '250px',
              height: '250px',
              margin: '0 auto 40px',
              position: 'relative'
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(10px)',
                border: '2px solid rgba(255,255,255,0.2)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
              }}
            >
              <SafetyOutlined style={{ fontSize: '120px', color: 'white' }} />
            </div>

            {/* Decorative circles */}
            <div
              style={{
                position: 'absolute',
                top: '-20px',
                right: '-20px',
                width: '80px',
                height: '80px',
                background: 'rgba(255,255,255,0.15)',
                borderRadius: '50%',
                animation: 'float 3s ease-in-out infinite'
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: '0',
                left: '-30px',
                width: '100px',
                height: '100px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '50%',
                animation: 'float 4s ease-in-out infinite'
              }}
            />
          </div>

          <Title
            level={1}
            style={{ color: 'white', marginBottom: '20px', fontSize: '42px' }}
          >
            Bảo Mật Tài Khoản
          </Title>
          <Text
            style={{
              color: 'rgba(255,255,255,0.9)',
              fontSize: '18px',
              lineHeight: '1.6'
            }}
          >
            Chúng tôi luôn đặt bảo mật của bạn lên hàng đầu.
            <br />
            Mật khẩu reset sẽ được mã hóa. <br />
            Vui lòng vào đổi lại mật khẩu mới để đảm bảo an toàn !
          </Text>

          {/* Feature Points */}
          {/* <div style={{ marginTop: '50px', textAlign: 'left' }}>
            {[
              { icon: <SafetyOutlined />, text: 'Bảo mật 2 lớp' },
              { icon: <LockOutlined />, text: 'Mã hóa end-to-end' },
              { icon: <CheckCircleOutlined />, text: 'Xác thực nhanh chóng' }
            ].map((item, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '20px',
                  background: 'rgba(255,255,255,0.1)',
                  padding: '15px 20px',
                  borderRadius: '10px',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <div
                  style={{
                    fontSize: '24px',
                    marginRight: '15px',
                    color: 'white'
                  }}
                >
                  {item.icon}
                </div>
                <Text style={{ color: 'white', fontSize: '16px' }}>
                  {item.text}
                </Text>
              </div>
            ))}
          </div> */}
        </div>

        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
        `}</style>
      </div>
    </div>
  )
}
