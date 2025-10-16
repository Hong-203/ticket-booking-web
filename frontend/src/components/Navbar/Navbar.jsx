import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import logo from "../../assets/Logo_CineZone_1.png";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Select, Row, Col } from "antd";
import {
  setSelectedLocation,
  setSelectedTheatre,
} from "../../stores/selectionSlice";
import {
  getAllLocation,
  theatreByLocation,
} from "../../stores/Theatre/theatreApis";

const { Option } = Select;

const Navbar = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const isLoggedIn = storedUser && storedUser.token;
  const [isAdmin, setIsAdmin] = useState(false);
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

  return (
    <header className="navbar-header">
      <Row align="middle" justify="space-between" style={{ width: "100%" }}>
        {/* Phần 1: Logo */}
        <Col>
          <Link className="logo-container-nav" to="/">
            <img className="logo-web-my" src={logo} alt="CineZone Logo" />
          </Link>
        </Col>

        {/* Phần 2: Menu + Dropdowns */}
        <Col flex="auto">
          <Row align="middle" justify="center" gutter={16}>
            <Col>
              <ul className="nav-items">
                <li>
                  <Link className="nav-item" to="/">
                    Trang chủ
                  </Link>
                </li>
                <li>
                  <Link className="nav-item" to="/theatre">
                    Rạp chiếu
                  </Link>
                </li>
                <li>
                  <Link className="nav-item" to="/aboutus">
                    Về chúng tôi
                  </Link>
                </li>
                {isAdmin && (
                  <li>
                    <Link className="nav-item" to="/admin">
                      Admin
                    </Link>
                  </li>
                )}
              </ul>
            </Col>
          </Row>
        </Col>

        {/* Phần 3: User / Sign in */}
        <Col>
          {isLoggedIn ? (
            <Row align="middle" gutter={10}>
              <Col>
                <Select
                  value={selectedLocation}
                  onChange={handleLocationChange}
                  placeholder="Chọn khu vực"
                  style={{ width: 160 }}
                  allowClear
                >
                  {listLocation.map((loc) => (
                    <Option key={loc.slug_location} value={loc.slug_location}>
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
                <p className="nav-signed-name">{storedUser.username}</p>
              </Col>
              <Col>
                <Link to="/profile" className="customer-profile-btn">
                  <UserOutlined style={{ fontSize: "20px", color: "#000" }} />
                </Link>
              </Col>
              <Col>
                <LogoutOutlined
                  onClick={handleLogout}
                  style={{
                    fontSize: "20px",
                    color: "#000",
                    cursor: "pointer",
                  }}
                />
              </Col>
            </Row>
          ) : (
            <Row align="middle" gutter={10}>
              <Col>
                <Link to="/signup">
                  <button className="btn-auth btn-signup">Sign up</button>
                </Link>
              </Col>
              <Col>
                <Link to="/login">
                  <button className="btn-auth btn-login">Sign in</button>
                </Link>
              </Col>
            </Row>
          )}
        </Col>
      </Row>
    </header>
  );
};

export default Navbar;
