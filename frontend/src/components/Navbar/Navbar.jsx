import { Link, useNavigate } from 'react-router-dom'
import './Navbar.css'
import { LogoutOutlined, UserOutlined } from '@ant-design/icons'
import logo from '../../assets/Cinema-Logo-Background-PNG-Image.png'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { Select } from 'antd'
import {
  setSelectedLocation,
  setSelectedTheatre
} from '../../stores/selectionSlice'
import {
  getAllLocation,
  theatreByLocation
} from '../../stores/Theatre/theatreApis'

const { Option } = Select

const Navbar = () => {
  const storedUser = JSON.parse(localStorage.getItem('user'))
  const isLoggedIn = storedUser && storedUser.token
  const [isAdmin, setIsAdmin] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  useEffect(() => {
    if (storedUser?.isAdmin === true) {
      setIsAdmin(true)
    } else {
      setIsAdmin(false)
    }
  }, [storedUser])
  const listLocation = useSelector((state) => state.theatre.listLocation || [])
  const listTheatreByLocation = useSelector(
    (state) => state.theatre.theatreByLocation || []
  )
  const selectedLocation = useSelector(
    (state) => state.selection.selectedLocation
  )
  const selectedTheatre = useSelector(
    (state) => state.selection.selectedTheatre
  )

  useEffect(() => {
    dispatch(getAllLocation())
  }, [dispatch])
  useEffect(() => {
    if (selectedLocation) {
      dispatch(theatreByLocation(selectedLocation))
    }
  }, [dispatch, selectedLocation])

  const handleLogout = () => {
    localStorage.removeItem('user')
    navigate('/')
  }

  const handleLocationChange = (slugLocation) => {
    dispatch(setSelectedLocation(slugLocation))
    dispatch(setSelectedTheatre(null)) // reset selected theatre khi đổi khu vực
  }

  const handleTheatreChange = (theatreId) => {
    dispatch(setSelectedTheatre(theatreId))
  }

  return (
    <header className="navbar-header">
      <button className="btn-menu">{/* Menu icon */}</button>

      <Link className="logo-container-nav" to="/">
        <img className="logo-web-my" src={logo} alt="" />
        <h1 className="logo-text">CineZone</h1>
      </Link>

      <nav>
        <ul className="nav-items">
          <li>
            <Link className="nav-item" to="/">
              Home
            </Link>
          </li>
          <li>
            <Link className="nav-item" to="/showtimes">
              Showtimes
            </Link>
          </li>
          <li>
            <Link className="nav-item" to="/aboutus">
              About Us
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
      </nav>

      <div className="nav-signup">
        <div className="nav-dropdowns">
          {/* Dropdown chọn khu vực */}
          <Select
            value={selectedLocation}
            onChange={handleLocationChange}
            placeholder="Chọn khu vực"
            style={{ width: 160, marginRight: 10 }}
            allowClear
          >
            {listLocation.map((loc) => (
              <Option key={loc.slug_location} value={loc.slug_location}>
                {loc.location}
              </Option>
            ))}
          </Select>
          {selectedLocation ? (
            <Select
              value={selectedTheatre}
              onChange={handleTheatreChange}
              placeholder="Chọn rạp"
              style={{ width: 180, marginRight: 10 }}
              allowClear
              disabled={!selectedLocation}
            >
              {listTheatreByLocation.map((theatre) => (
                <Option key={theatre.id} value={theatre.id}>
                  {theatre.name}
                </Option>
              ))}
            </Select>
          ) : (
            ''
          )}
        </div>

        {isLoggedIn ? (
          <>
            <p className="nav-signed-name">{storedUser.username}</p>
            <Link to="/profile" className="customer-profile-btn">
              <UserOutlined style={{ fontSize: '20px', color: '#fff' }} />
            </Link>
            <LogoutOutlined
              onClick={handleLogout}
              style={{
                fontSize: '20px',
                color: '#fff',
                paddingLeft: '10px',
                cursor: 'pointer'
              }}
            />
          </>
        ) : (
          <>
            <Link to="/signup">
              <button className="btn-auth btn-signup">Sign up</button>
            </Link>
            <Link to="/login">
              <button className="btn-auth btn-login">Sign in</button>
            </Link>
          </>
        )}
      </div>
    </header>
  )
}

export default Navbar
