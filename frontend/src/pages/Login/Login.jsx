import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import logo from "../../assets/Cinema-Logo-Background-PNG-Image.png";
import movieBackgroundVideo from "../../assets/video2.mp4";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Login.css";
import TextInput from "../../components/Icons/TextInput";
import PasswordInput from "../../components/Icons/PasswordInput";
import { login } from "../../stores/Users/userApis";
import { useDispatch } from "react-redux";

const Login = ({ setIsAdmin }) => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const baseURL = import.meta.env.VITE_BACKEND_URL;

  const handleLogin = async (event) => {
    event.preventDefault();

    const values = {
      identifier,
      password,
    };

    try {
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

      <div className="help-button">
        <button>Trợ giúp?</button>
      </div>

      <div className="login-box">
        <div className="form-content">
          <div className="logo-container">
            <img src={logo} alt="Logo" />
          </div>

          <form onSubmit={handleLogin}>
            <TextInput
              label="Email hoặc Số điện thoại"
              placeholder="Nhập email hoặc số điện thoại"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
            />
            <PasswordInput
              label="Mật khẩu"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="forgot-link">
              <Link to="/forgot-password">Quên mật khẩu?</Link>
            </div>

            <button type="submit" className="login-button">
              Đăng nhập
            </button>
          </form>

          <div className="separator">
            <hr />
            <span>hoặc</span>
            <hr />
          </div>

          <div className="social-login">
            <button className="google-button" onClick={handleGoogleLogin}>
              Đăng nhập bằng
              <Icon icon="logos:google-icon" className="icon" />
            </button>
            {/* <button className="facebook-button">
              Đăng nhập bằng
              <Icon icon="logos:facebook" className="icon" />
            </button> */}
          </div>
        </div>

        <div className="signup-section">
          <p>
            Chưa có tài khoản? <Link to="/signup">Đăng ký ngay</Link>
          </p>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Login;
