import React from 'react'
import {
  CheckCircleOutlined,
  CopyOutlined,
  HomeOutlined,
  ShoppingOutlined
} from '@ant-design/icons'
import { Card, Button, Divider, Row, Col, Typography, Space, Tag } from 'antd'
import './PaymentSuccess.css'
const { Title, Text } = Typography

const PaymentSuccess = () => {
  return (
    <div className="payment-success-container">
      <div className="payment-success-wrapper">
        {/* Header thành công */}
        <div className="success-header">
          <CheckCircleOutlined className="success-icon" />
          <Title level={2} className="success-title">
            Thanh toán thành công!
          </Title>
          <Text className="success-subtitle">
            Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đã được xác nhận.
          </Text>
        </div>
      </div>
    </div>
  )
}

export default PaymentSuccess
