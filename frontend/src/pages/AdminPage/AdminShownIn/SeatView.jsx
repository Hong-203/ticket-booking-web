import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import './SeatView.css' // Chứa màu theo status
import { getSeatAvailable } from '../../../stores/Seat/seatApis'

const SeatView = ({ movieId, hallId, showtimeId }) => {
  const dispatch = useDispatch()
  const seatList = useSelector((state) => state.seat.seatList || [])

  useEffect(() => {
    if (movieId && hallId && showtimeId) {
      dispatch(
        getSeatAvailable(
          `movie_id=${movieId}&hall_id=${hallId}&showtime_id=${showtimeId}`
        )
      )
    }
  }, [movieId, hallId, showtimeId, dispatch])

  return (
    <div className="seat-container">
      <div className="seat-grid">
        {seatList.map((seat) => (
          <div
            key={seat.id}
            className={`seat-item ${seat.status} ${
              seat.description === 'Ghế đôi' ? 'double-seat' : ''
            }`}
            title={`${seat.name} - ${seat.description}`}
          >
            {seat.name}
          </div>
        ))}
      </div>
      <div className="seat-legend">
        <div>
          <span className="seat-item empty" /> Ghế trống
        </div>
        <div>
          <span className="seat-item booked" /> Đã đặt
        </div>
        <div>
          <span className="seat-item pending" /> Giữ chỗ
        </div>
        <div>
          <span className="seat-item double-seat" /> Ghế đôi
        </div>
      </div>
    </div>
  )
}

export default SeatView
