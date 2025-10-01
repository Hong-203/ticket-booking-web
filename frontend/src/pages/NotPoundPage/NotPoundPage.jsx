import React from 'react'
import { Button, Typography } from 'antd'
import { HomeOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import 'antd/dist/reset.css'
import './NotPoundPage.css'

const { Title, Paragraph } = Typography

const NotFoundPage = () => {
  return (
    <div className="notfound-container">
      <div className="notfound-content">
        <img
          src="https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif"
          alt="404 Not Found"
          className="notfound-image"
        />
        <Title level={2} className="notfound-title">
          Oops! Trang Không Tồn Tại
        </Title>
        <Paragraph className="notfound-description">
          Trang bạn đang tìm kiếm có thể đã bị xóa, đổi tên hoặc tạm thời không
          khả dụng.
        </Paragraph>
        <Button
          type="primary"
          icon={<HomeOutlined />}
          size="large"
          className="notfound-button"
        >
          <Link to="/">Về Trang Chủ</Link>
        </Button>
      </div>
    </div>
  )
}

export default NotFoundPage
