import React, { useState, useEffect, useMemo } from 'react'
import { Card, Badge, Tooltip, Spin } from 'antd'
import './CinemaLayout.css'
import { useDispatch, useSelector } from 'react-redux'
import { getSeatAvailable } from '../../stores/Seat/seatApis'
import { getAllShownIn } from '../../stores/ShownIn/shownInApis'

const CinemaLayout = ({
  movieId,
  hallId,
  showtimeId,
  selectedSeats,
  setSelectedSeats
}) => {
  const dispatch = useDispatch()
  const [seats, setSeats] = useState({})
  const [loading, setLoading] = useState(true)
  const storedUser = JSON.parse(localStorage.getItem('user'))
  const seatList = useSelector((state) => state.seat.seatList || [])
  const currentUserId = storedUser && storedUser.id
  // const shownInList = useSelector((state) => state.shownIn.shownInList || [])
  // const movieInfos = shownInList.length > 0 ? shownInList[0] : {}
  console.log('currentUserId', currentUserId)
  // Lấy thông tin ghế và suất chiếu khi có đủ các tham số
  useEffect(() => {
    const query = `movie_id=${movieId}&hall_id=${hallId}&showtime_id=${showtimeId}`
    // if (!movieId || !hallId || !showtimeId) return

    // dispatch(getAllShownIn(query))
    dispatch(getSeatAvailable(query))
  }, [dispatch, movieId, hallId, showtimeId])

  // useEffect(() => {
  //   if (shownInList.length > 0) {
  //     setMovieInfo(shownInList[0])
  //   }
  // }, [shownInList, setMovieInfo])
  // Cập nhật state seats từ seatList

  useEffect(() => {
    if (!Array.isArray(seatList)) return

    const seatData = {}
    seatList.forEach((seat) => {
      const type = seat.name.startsWith('L') ? 'couple' : 'single'
      console.log('seat', seat)
      let status = seat.status

      // Chỉ đánh dấu ghế pending nếu là của chính user hiện tại
      if (status === 'pending' && seat.user_id !== currentUserId) {
        status = 'booked' // coi như là đã bị người khác chọn
      }

      // Kiểm tra nếu user đang chọn lại (tương thích selectedSeats trong local)
      const isSelected = selectedSeats.some(
        (selectedSeat) => selectedSeat.name === seat.name
      )

      // Ưu tiên ghế user đang chọn
      if (isSelected) {
        status = 'pending'
      }

      seatData[seat.name] = { ...seat, type, status }
    })

    setSeats(seatData)
    setLoading(false)
  }, [seatList, selectedSeats, currentUserId])

  const handleSeatClick = (seatName) => {
    const seat = seats[seatName]
    if (
      seat.status === 'booked' ||
      (seat.status === 'pending' && seat.user_id !== currentUserId)
    )
      return

    // Cập nhật local state
    setSeats((prevSeats) => {
      const newSeats = {
        ...prevSeats,
        [seatName]: {
          ...seat,
          status: seat.status === 'empty' ? 'pending' : 'empty'
        }
      }

      // Cập nhật selectedSeats trong parent component
      const updatedSelectedSeats = Object.values(newSeats)
        .filter((s) => s.status === 'pending')
        .map((s) => ({
          id: s.id,
          name: s.name,
          type: s.type,
          row: s.name.charAt(0),
          number: s.name.slice(1)
        }))

      setSelectedSeats(updatedSelectedSeats)

      return newSeats
    })
  }

  const getSeatClassName = (seat) => {
    return `seat ${seat.type} ${seat.status}`
  }

  const renderSeatRow = (rowLetter, startIndex = 1, endIndex = 24) => {
    const row = []

    for (let i = startIndex; i <= endIndex; i++) {
      const seatName = `${rowLetter}${i}`
      const seat = seats[seatName]
      if (!seat) continue

      row.push(
        <Tooltip
          key={seatName}
          title={`Ghế ${seatName} - ${
            seat.type === 'single' ? 'Ghế đơn' : 'Ghế đôi'
          } - ${
            seat.status === 'booked'
              ? 'Đã đặt'
              : seat.status === 'pending'
              ? 'Đang chọn'
              : 'Có thể chọn'
          }`}
        >
          <div
            className={getSeatClassName(seat)}
            onClick={() => handleSeatClick(seatName)}
          >
            <span className="seat-number">{seatName}</span>
          </div>
        </Tooltip>
      )

      // Khoảng cách logic
      if (rowLetter !== 'L' && i === 12) {
        row.push(<div key={`${rowLetter}-gap`} className="seat-gap" />)
      } else if (rowLetter === 'L') {
        if (startIndex === 1 && i === 6) {
          row.push(<div key={`${rowLetter}-gap-1`} className="seat-gap" />)
        } else if (startIndex === 13 && i === 18) {
          row.push(<div key={`${rowLetter}-gap-2`} className="seat-gap" />)
        }
      }
    }

    return row
  }

  const getStatusCount = (status) =>
    Object.values(seats).filter((seat) => seat.status === status).length

  // Sử dụng selectedSeats từ props thay vì tính toán từ seats local
  const currentSelectedSeats = useMemo(
    () => selectedSeats || [],
    [selectedSeats]
  )

  // Tính tổng giá tiền
  const totalPrice = useMemo(() => {
    return currentSelectedSeats.reduce((total, seat) => {
      return total + (seat.price || 0)
    }, 0)
  }, [currentSelectedSeats])

  return (
    <div className="cinema-container">
      <Card className="cinema-card">
        {loading ? (
          <div className="loading-container">
            <Spin size="large" />
            <p>Đang tải dữ liệu ghế...</p>
          </div>
        ) : (
          <>
            {/* Màn hình */}
            <div className="screen-container">
              <div className="screen">
                <div className="screen-text">MÀN HÌNH</div>
              </div>
              <div className="screen-shadow" />
            </div>

            {/* Ghế thường */}
            <div className="seats-container">
              <div className="seat-section">
                <h4 className="section-title">Ghế Thường</h4>
                {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'].map(
                  (row) => (
                    <div key={row} className="seat-row">
                      <div className="row-label">{row}</div>
                      <div className="seats-in-row">
                        {renderSeatRow(row, 1, 24)}
                      </div>
                    </div>
                  )
                )}
              </div>

              {/* Khoảng cách giữa */}
              <div className="section-gap" />

              {/* Ghế đôi */}
              <div className="seat-section">
                <h4 className="section-title">Ghế Đôi VIP</h4>
                <div className="seat-row">
                  <div className="row-label">L</div>
                  <div className="seats-in-row">
                    {renderSeatRow('L', 1, 12)}
                  </div>
                </div>
                <div className="seat-row">
                  <div className="row-label">L</div>
                  <div className="seats-in-row">
                    {renderSeatRow('L', 13, 24)}
                  </div>
                </div>
              </div>
            </div>

            {/* Ghi chú */}
            <div className="legend">
              <div className="legend-item">
                <div className="seat single empty" />
                <span>Ghế trống ({getStatusCount('empty')})</span>
              </div>
              <div className="legend-item">
                <div className="seat single pending" />
                <span>Đang chọn ({getStatusCount('pending')})</span>
              </div>
              <div className="legend-item">
                <div className="seat single booked" />
                <span>Đã đặt ({getStatusCount('booked')})</span>
              </div>
            </div>

            {/* Thông tin tổng hợp */}
            <div className="summary">
              <div className="summary-content">
                <Badge count={currentSelectedSeats.length} showZero>
                  <div className="summary-item">
                    <strong>Ghế đã chọn: {currentSelectedSeats.length}</strong>
                  </div>
                </Badge>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  )
}

export default CinemaLayout
