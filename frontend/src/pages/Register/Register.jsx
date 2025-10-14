import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Icon } from "@iconify/react";
import TextInput from "../../components/Icons/TextInput";
import PasswordInput from "../../components/Icons/PasswordInput";
import logo from "../../assets/Cinema-Logo-Background-PNG-Image.png";
import movieBackgroundVideo from "../../assets/video2.mp4";
import { useDispatch } from "react-redux";
import "./Register.css";
import { register } from "../../stores/Users/userApis";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [username, setUsername] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const baseURL = import.meta.env.VITE_BACKEND_URL;

  const handleGoogleLogin = () => {
    window.location.href = `${baseURL}/auth/google`;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const values = {
        username,
        identifier,
        password,
      };
      const response = await dispatch(register(values));
      if (response) {
        navigate("/login");
      } else {
        alert("Đăng ký thất bại. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Lỗi khi đăng ký:", error);
      setError("Đăng ký thất bại. Vui lòng thử lại.");
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

          <form onSubmit={handleSignup} className="res-signup-form">
            <TextInput
              label="Tên người dùng"
              placeholder="Nhập tên người dùng"
              className="res-input-padding"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <TextInput
              label="Email hoặc Số điện thoại"
              placeholder="name@domain.com"
              className="res-input-padding"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
            />

            <PasswordInput
              label="Tạo mật khẩu"
              placeholder="Ít nhất 6 ký tự"
              className="res-input-padding"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="submit"
              className="res-signup-button"
              disabled={loading}
            >
              {loading ? "Đang đăng ký..." : "Đăng ký"}
            </button>
          </form>

          <div className="res-separator">
            <hr />
            <span>hoặc</span>
            <hr />
          </div>

          <div className="res-social-buttons">
            <button
              className="res-social-button res-google"
              onClick={handleGoogleLogin}
            >
              Đăng ký bằng
              <Icon icon="logos:google-icon" className="res-icon" width={32} />
            </button>
            {/* <button className="res-social-button res-facebook">
              Đăng ký bằng
              <Icon icon="logos:facebook" className="res-icon" width={34} />
            </button> */}
          </div>
        </div>

        <div className="res-bottom-box">
          <p>
            Đã có tài khoản?{" "}
            <Link to="/login" className="res-login-link">
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
