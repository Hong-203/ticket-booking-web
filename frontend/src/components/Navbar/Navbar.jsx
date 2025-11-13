import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import {
  LogoutOutlined,
  UserOutlined,
  SearchOutlined,
  CloseOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import logo from "../../assets/Logo_CineZone_1.png";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Select, Row, Col, Input } from "antd";
import {
  setSelectedLocation,
  setSelectedTheatre,
} from "../../stores/selectionSlice";
import {
  getAllLocation,
  theatreByLocation,
} from "../../stores/Theatre/theatreApis";
import { getAllMovie } from "../../stores/Movie/movieApis";

const { Option } = Select;

const Navbar = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const isLoggedIn = storedUser && storedUser.token;
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // State quản lý việc hiển thị thanh tìm kiếm nổi
  const [showSearch, setShowSearch] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (storedUser?.isAdmin === true) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [storedUser]);

  const listLocation = useSelector((state) => state.theatre.listLocation || []);
  const listTheatreByLocation = useSelector(
    (state) => state.theatre.theatreByLocation || []
  );
  const selectedLocation = useSelector(
    (state) => state.selection.selectedLocation
  );
  const selectedTheatre = useSelector(
    (state) => state.selection.selectedTheatre
  );

  useEffect(() => {
    dispatch(getAllLocation());
  }, [dispatch]);

  useEffect(() => {
    if (selectedLocation) {
      dispatch(theatreByLocation(selectedLocation));
    }
  }, [dispatch, selectedLocation]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleLocationChange = (slugLocation) => {
    dispatch(setSelectedLocation(slugLocation));
    dispatch(setSelectedTheatre(null));
  };

  const handleTheatreChange = (theatreId) => {
    dispatch(setSelectedTheatre(theatreId));
  };

  // Hàm BẬT/TẮT overlay tìm kiếm
  const handleSearchToggle = () => {
    // Nếu đang mở, đóng lại và xóa giá trị tìm kiếm
    if (showSearch) {
      setShowSearch(false);
      setSearchValue("");
    } else {
      // Nếu đang đóng, mở ra
      setShowSearch(true);
    }
  };

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  // Xử lý khi nhấn Enter HOẶC nhấn icon Search
  const handleSearchSubmit = (e) => {
    // Sử dụng onPressEnter của Input (e.key === 'Enter') hoặc click icon (e.type === 'click')
    if ((e.key === "Enter" || e.type === "click") && searchValue.trim()) {
      dispatch(getAllMovie({ page: 1, limit: 12, search: searchValue }));
      // ✅ Chuyển hướng đến trang kết quả
      navigate(`/search?search=${encodeURIComponent(searchValue)}`);
      setShowSearch(false); // Tự động đóng overlay sau khi tìm kiếm
      setSearchValue(""); // Xóa giá trị
    }
  };

  // Xử lý khi Input mất focus
  const handleInputBlur = () => {
    // Tắt thanh tìm kiếm nếu người dùng bỏ focus và không có giá trị
    if (!searchValue.trim()) {
      setShowSearch(false);
    }
  };

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="navbar-header">
      {/* ======================================= */}
      {/* 1. OVERLAY TÌM KIẾM (Chế độ NỔI) */}
      {/* ======================================= */}
      {showSearch && (
        <div className="search-overlay" onClick={handleSearchToggle}>
          <div
            className="search-input-container"
            // Ngăn chặn sự kiện click từ overlay lan truyền vào input container
            onClick={(e) => e.stopPropagation()}
          >
            <Input
              placeholder="Tìm kiếm phim..."
              value={searchValue}
              onChange={handleSearchChange}
              onPressEnter={handleSearchSubmit}
              onBlur={handleInputBlur}
              autoFocus
              className="overlay-search-input"
              // Tăng độ rộng Input
              style={{ width: "80%" }}
              suffix={
                <CloseOutlined
                  className="search-close-icon"
                  onClick={handleSearchToggle} // Click icon đóng overlay
                />
              }
            />
          </div>
        </div>
      )}

      {/* ======================================= */}
      {/* 2. NỘI DUNG NAVBAR CHÍNH */}
      {/* ======================================= */}
      <Row align="middle" justify="space-between" style={{ width: "100%" }}>
        {/* Phần 1: Logo */}
        <Col>
          <Link className="logo-container-nav" to="/">
            <img className="logo-web-my" src={logo} alt="CineZone Logo" />
          </Link>
        </Col>

        {/* Menu Toggle */}
        <Col className="menu-toggle-col">
          <button className="btn-menu" onClick={handleMenuToggle}>
            {isMenuOpen ? (
              <CloseOutlined className="menu-icon" />
            ) : (
              <MenuOutlined className="menu-icon" />
            )}
          </button>
        </Col>

        <Col
          flex="auto"
          className={`nav-full-content ${isMenuOpen ? "menu-open" : ""}`}
        >
          <Row align="middle" justify="space-between" style={{ width: "100%" }}>
            {/* Phần 2: Menu Links */}
            <Col className="nav-menu-links">
              <ul className="nav-items">
                <li>
                  <Link className="nav-item" to="/" onClick={handleMenuToggle}>
                    Trang chủ
                  </Link>
                </li>
                <li>
                  <Link
                    className="nav-item"
                    to="/theatre"
                    onClick={handleMenuToggle}
                  >
                    Rạp chiếu
                  </Link>
                </li>
                <li>
                  <Link
                    className="nav-item"
                    to="/aboutus"
                    onClick={handleMenuToggle}
                  >
                    Về chúng tôi
                  </Link>
                </li>
                {isAdmin && (
                  <li>
                    <Link
                      className="nav-item"
                      to="/admin"
                      onClick={handleMenuToggle}
                    >
                      Admin
                    </Link>
                  </li>
                )}
              </ul>
            </Col>

            {/* Phần 3: User / Sign in / Dropdowns / Search Button */}
            <Col className="nav-auth-controls">
              {isLoggedIn ? (
                <Row align="middle" gutter={[10, 10]} wrap={true}>
                  <Col className="hidden-mobile">
                    {/* Selects giữ nguyên */}
                    <Select
                      value={selectedLocation}
                      onChange={handleLocationChange}
                      placeholder="Chọn khu vực"
                      style={{ width: 160, color: "#000" }}
                      allowClear
                    >
                      {listLocation.map((loc) => (
                        <Option
                          key={loc.slug_location}
                          value={loc.slug_location}
                        >
                          {loc.location}
                        </Option>
                      ))}
                    </Select>
                    {selectedLocation && (
                      <Select
                        value={selectedTheatre}
                        onChange={handleTheatreChange}
                        placeholder="Chọn rạp"
                        style={{ width: 180 }}
                        allowClear
                      >
                        {listTheatreByLocation.map((theatre) => (
                          <Option key={theatre.id} value={theatre.id}>
                            {theatre.name}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </Col>
                  <Col>
                    <Row align="middle" gutter={10}>
                      {/* NÚT MỞ SEARCH OVERLAY */}
                      <Col>
                        <SearchOutlined
                          onClick={handleSearchToggle}
                          className="search-icon-nav"
                          style={{
                            fontSize: "20px",
                            color: "#000",
                            cursor: "pointer",
                          }}
                        />
                      </Col>
                      {/* User Info và Icons */}
                      <Col className="hidden-mobile">
                        <p className="nav-signed-name">{storedUser.username}</p>
                      </Col>
                      <Col>
                        <Link
                          to="/profile"
                          className="customer-profile-btn"
                          onClick={handleMenuToggle}
                        >
                          <UserOutlined
                            style={{ fontSize: "20px", color: "#000" }}
                          />
                        </Link>
                      </Col>
                      <Col>
                        <LogoutOutlined
                          onClick={() => {
                            handleLogout();
                            handleMenuToggle();
                          }}
                          className="logout-icon-nav"
                          style={{
                            fontSize: "20px",
                            color: "#000",
                            cursor: "pointer",
                          }}
                        />
                      </Col>
                    </Row>
                  </Col>
                </Row>
              ) : (
                <Row align="middle" gutter={10}>
                  {/* NÚT MỞ SEARCH OVERLAY (Chưa Đăng nhập) */}
                  <Col>
                    <SearchOutlined
                      onClick={handleSearchToggle}
                      style={{
                        fontSize: "20px",
                        color: "#000",
                        cursor: "pointer",
                      }}
                    />
                  </Col>
                  <Col>
                    <Link to="/signup" onClick={handleMenuToggle}>
                      <button
                        style={{ width: "135px" }}
                        className="btn-auth btn-signup"
                      >
                        Đăng ký
                      </button>
                    </Link>
                  </Col>
                  <Col>
                    <Link to="/login" onClick={handleMenuToggle}>
                      <button
                        style={{ width: "135px" }}
                        className="btn-auth btn-login"
                      >
                        Đăng nhập
                      </button>
                    </Link>
                  </Col>
                </Row>
              )}
            </Col>
          </Row>
        </Col>
      </Row>
    </header>
  );
};

export default Navbar;
