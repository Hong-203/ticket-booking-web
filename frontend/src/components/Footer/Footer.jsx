import React from 'react'
import { Layout, Row, Col } from 'antd'
import {
  FacebookOutlined,
  YoutubeOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined
} from '@ant-design/icons'
import './Footer.css'

const { Footer } = Layout

const AppFooter = () => {
  return (
    <Footer className="footer">
      <div className="footer-container">
        <Row gutter={[32, 32]}>
          <Col xs={24} sm={12} md={8}>
            <h3 className="footer-logo">🎬 CineZone</h3>
            <p>
              CineZone là hệ thống đặt vé xem phim trực tuyến nhanh chóng, tiện
              lợi, mang đến trải nghiệm giải trí tuyệt vời cho bạn và gia đình.
            </p>
            <div className="footer-socials">
              <FacebookOutlined />
              <YoutubeOutlined />
              <MailOutlined />
            </div>
          </Col>

          <Col xs={24} sm={12} md={5}>
            <h4>Liên kết</h4>
            <ul className="footer-links">
              <li>Trang chủ</li>
              <li>Phim đang chiếu</li>
              <li>Phim sắp chiếu</li>
              <li>Khuyến mãi</li>
            </ul>
          </Col>

          <Col xs={24} sm={12} md={5}>
            <h4>Chính sách</h4>
            <ul className="footer-links">
              <li>Chính sách bảo mật</li>
              <li>Điều khoản sử dụng</li>
              <li>Hướng dẫn thanh toán</li>
              <li>Chính sách hoàn vé</li>
            </ul>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <h4>Liên hệ</h4>
            <p>
              <EnvironmentOutlined /> 123 Đường Phim, Quận 1, TP.HCM
            </p>
            <p>
              <PhoneOutlined /> 0123 456 789
            </p>
            <p>
              <MailOutlined /> support@cinezone.vn
            </p>
          </Col>
        </Row>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} CineZone. All rights reserved.</p>
        </div>
      </div>
    </Footer>
  )
}

export default AppFooter
