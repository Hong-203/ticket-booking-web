import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// Bỏ import axios và các component input cũ
import { Icon } from "@iconify/react";
import { useDispatch } from "react-redux";
// Import các component từ Ant Design
import { Form, Input, Button, message } from "antd";

import logo from "../../assets/Cinema-Logo-Background-PNG-Image.png";
import movieBackgroundVideo from "../../assets/video2.mp4";
import "./Register.css";
import { register } from "../../stores/Users/userApis";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Sử dụng state để kiểm soát form, giữ nguyên logic state của bạn
  const [username, setUsername] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const baseURL = import.meta.env.VITE_BACKEND_URL;

  const handleGoogleLogin = () => {
    window.location.href = `${baseURL}/auth/google`;
  };

  // Sử dụng onSubmit của Antd Form để handle signup
  const onFinish = async (values) => {
    setLoading(true);

    try {
      // Logic đăng ký (vẫn giữ nguyên)
      const response = await dispatch(register(values));
      if (response) {
        message.success("Đăng ký thành công!");
        navigate("/login");
      } else {
        message.error("Đăng ký thất bại. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Lỗi khi đăng ký:", error);
      message.error("Đăng ký thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="res-signup-container">
      <video
        src={movieBackgroundVideo}
        autoPlay
        loop
        muted
        className="res-background-video"
      />

      <div className="res-overlay" />

      <div className="res-signup-box">
        <div className="res-signup-content">
          <div className="res-logo-container">
            <img src={logo} alt="Logo" className="res-logo" />
          </div>
          <h2 className="res-signup-title">Đăng ký</h2>

          {/* Thay thế form HTML bằng Form của Ant Design */}
          <Form
            name="register"
            onFinish={onFinish}
            layout="vertical"
            initialValues={{ username, identifier, password }}
            className="res-signup-form"
          >
            {/* Tên người dùng */}
            <Form.Item
              name="username"
              rules={[
                { required: true, message: "Vui lòng nhập tên người dùng!" },
              ]}
            >
              <Input
                placeholder="Nhập tên người dùng"
                prefix={<Icon icon="ant-design:user-outlined" />}
                size="large"
                onChange={(e) => setUsername(e.target.value)}
              />
            </Form.Item>

            {/* Email hoặc Số điện thoại (Identifier) */}
            <Form.Item
              name="identifier"
              rules={[
                { required: true, message: "Vui lòng nhập Email hoặc SĐT!" },
              ]}
            >
              <Input
                placeholder="name@domain.com"
                prefix={<Icon icon="ant-design:mail-outlined" />}
                size="large"
                onChange={(e) => setIdentifier(e.target.value)}
              />
            </Form.Item>

            {/* Mật khẩu */}
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Vui lòng tạo mật khẩu!" },
                { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự." },
              ]}
            >
              <Input.Password
                placeholder="Ít nhất 6 ký tự"
                prefix={<Icon icon="ant-design:lock-outlined" />}
                size="large"
                onChange={(e) => setPassword(e.target.value)}
                iconRender={(visible) =>
                  visible ? (
                    <Icon
                      icon="ant-design:eye-outlined"
                      style={{ color: "#fff" }}
                    />
                  ) : (
                    <Icon
                      icon="ant-design:eye-invisible-outlined"
                      style={{ color: "#fff" }}
                    />
                  )
                }
              />
            </Form.Item>

            {/* Nút Đăng ký */}
            <Form.Item style={{ marginBottom: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                className="res-signup-button"
                loading={loading}
                size="large"
              >
                {loading ? "Đang xử lý..." : "Đăng ký"}
              </Button>
            </Form.Item>
          </Form>

          <div className="res-separator">
            <hr />
            <span>HOẶC</span>
            <hr />
          </div>

          <div className="res-social-buttons">
            <Button
              className="res-social-button res-google"
              onClick={handleGoogleLogin}
              block
              size="large"
            >
              <Icon icon="logos:google-icon" className="res-icon" width={20} />
              Đăng ký với Google
            </Button>
          </div>
        </div>

        <div className="res-bottom-box">
          <p>
            Đã có tài khoản?{" "}
            <Link to="/login" className="res-login-link">
              Đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
