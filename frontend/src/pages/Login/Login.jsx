import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useDispatch } from "react-redux";
// Import Ant Design components
import { Form, Input, Button, message } from "antd";
import logo from "../../assets/Cinema-Logo-Background-PNG-Image.png";
import movieBackgroundVideo from "../../assets/video2.mp4";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Login.css";
import { login } from "../../stores/Users/userApis";

const Login = ({ setIsAdmin }) => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const baseURL = import.meta.env.VITE_BACKEND_URL;

  // Thay thế handleLogin cũ bằng onFinish của Antd Form
  const onFinish = async (values) => {
    // values chứa identifier và password từ form

    try {
      // Logic đăng nhập (Giữ nguyên)
      await dispatch(login(values));
      toast.success("Đăng nhập thành công!");

      const storedUser = localStorage.getItem("user");
      const parsedUser = JSON.parse(storedUser);

      if (parsedUser?.isAdmin === true || parsedUser?.role === "admin") {
        setIsAdmin(true);
        setTimeout(() => {
          navigate("/admin");
        }, 100);
      } else {
        setIsAdmin(false);
        navigate("/");
      }
    } catch (error) {
      toast.error("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${baseURL}/auth/google`;
  };

  return (
    <div className="login-container">
      <video
        src={movieBackgroundVideo}
        autoPlay
        loop
        muted
        className="background-video"
      />
      <div className="overlay" />

      {/* Box đăng nhập mới: nhỏ gọn và căn giữa, sử dụng class chung để tái sử dụng style */}
      <div className="res-signup-box">
        <div className="res-signup-content">
          <div className="logo-container">
            <img src={logo} alt="Logo" className="res-logo" />
          </div>
          <h2 className="res-signup-title">Đăng nhập</h2>

          {/* Thay thế form HTML bằng Ant Design Form */}
          <Form
            name="login"
            onFinish={onFinish}
            layout="vertical"
            initialValues={{ identifier, password }}
            className="res-signup-form" // Dùng chung class form với Register để áp dụng style dark theme
          >
            {/* Email/SĐT */}
            <Form.Item
              name="identifier"
              rules={[
                { required: true, message: "Vui lòng nhập Email hoặc SĐT!" },
              ]}
              style={{ marginBottom: "20px" }} // Tăng khoảng cách cho dễ nhìn
            >
              <Input
                placeholder="Nhập email hoặc số điện thoại"
                prefix={<Icon icon="ant-design:user-outlined" />}
                size="large"
                onChange={(e) => setIdentifier(e.target.value)}
              />
            </Form.Item>

            {/* Mật khẩu */}
            <Form.Item
              name="password"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
              style={{ marginBottom: "10px" }}
            >
              <Input.Password
                placeholder="Nhập mật khẩu"
                prefix={
                  <Icon
                    style={{ color: "#fff" }}
                    icon="ant-design:lock-outlined"
                  />
                }
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

            <div className="forgot-link">
              <Link to="/forgot-password" className="res-login-link">
                Quên mật khẩu?
              </Link>
            </div>

            {/* Nút Đăng nhập */}
            <Form.Item style={{ marginBottom: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                className="res-signup-button" // Dùng chung class nút cam
                size="large"
                block
              >
                Đăng nhập
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
              Đăng nhập với Google
            </Button>
          </div>
        </div>

        <div className="res-bottom-box">
          <p>
            Chưa có tài khoản?{" "}
            <Link to="/signup" className="res-login-link">
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Login;
