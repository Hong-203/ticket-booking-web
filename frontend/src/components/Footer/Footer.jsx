import React from "react";
import { Layout, Row, Col } from "antd";
import {
  FacebookOutlined,
  YoutubeOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./Footer.css";

const { Footer } = Layout;

const AppFooter = () => {
  const navigate = useNavigate();

  // Hàm dùng lại cho tất cả các link
  const goTo = (path) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Footer className="footer">
      <div className="footer-container">
        <Row gutter={[32, 32]}>
          {/* Logo + mô tả */}
          <Col xs={24} sm={12} md={8}>
            <h3 className="footer-logo" onClick={() => goTo("/")}>
              🎬 CineZone
            </h3>
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

          {/* Liên kết */}
          <Col xs={24} sm={12} md={5}>
            <h4>Liên kết</h4>
            <ul className="footer-links">
              <li onClick={() => goTo("/")}>Trang chủ</li>
              <li onClick={() => goTo("/phim-dang-cong-chieu")}>
                Phim đang chiếu
              </li>
              <li onClick={() => goTo("/phim-sap-chieu")}>Phim sắp chiếu</li>
              <li onClick={() => goTo("/aboutus")}>Giới thiệu CineZone</li>
            </ul>
          </Col>

          {/* Chính sách */}
          <Col xs={24} sm={12} md={5}>
            <h4>Chính sách</h4>
            <ul className="footer-links">
              <li onClick={() => goTo("/chinh-sach-bao-mat")}>
                Chính sách bảo mật
              </li>
              <li onClick={() => goTo("/dieu-khoan-su-dung")}>
                Điều khoản sử dụng
              </li>
              <li onClick={() => goTo("/huong-dan-thanh-toan")}>
                Hướng dẫn thanh toán
              </li>
            </ul>
          </Col>

          {/* Liên hệ */}
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

        {/* footer bottom */}
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} CineZone. All rights reserved.</p>
        </div>
      </div>
    </Footer>
  );
};

export default AppFooter;
