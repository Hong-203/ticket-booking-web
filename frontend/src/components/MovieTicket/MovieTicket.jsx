import React from 'react'
import { Card, Typography, Space, Divider, Tag, Rate } from 'antd'
import {
  CalendarOutlined,
  ClockCircleOutlined,
  HomeOutlined,
  VideoCameraOutlined
} from '@ant-design/icons'
import './MovieTicket.css'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { createBooking } from '../../stores/Seat/seatApis'
import { createTicket } from '../../stores/Ticket/ticketApis'

const { Title, Text } = Typography

const MovieTicket = ({
  movieId,
  hallId,
  showtimeId,
  selectedSeats,
  slug,
  movieInfo,
  concessionCart
}) => {
  console.log('concessionCart', concessionCart)
  const ticketData = movieInfo
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const handleBack = () => {
    navigate(`/movie-show-time/${slug}`)
  }
  console.log('selectedSeats', selectedSeats)
  console.log('movieInfo', movieInfo)
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const calculateTicketTotal = () => {
    const basePrice = ticketData.showtime.price_per_seat

    const ticketTotal = selectedSeats.reduce((total, seat) => {
      const multiplier = seat.type === 'couple' ? 2.1 : 1
      return total + basePrice * multiplier
    }, 0)

    return ticketTotal
  }

  const calculateConcessionTotal = () => {
    if (!concessionCart) return 0

    return Object.values(concessionCart).reduce((total, item) => {
      return total + parseFloat(item.product.price) * item.quantity
    }, 0)
  }

  const ticketTotal = calculateTicketTotal()
  const concessionTotal = calculateConcessionTotal()
  const totalPrice = ticketTotal + concessionTotal

  if (
    !movieInfo ||
    !movieInfo.movie ||
    !movieInfo.showtime ||
    !movieInfo.hall ||
    !movieInfo.hall.theatre
  ) {
    return <div>Đang tải thông tin vé...</div>
  }

  const getBookingData = (
    ticketTotal,
    concessionCart,
    selectedSeats,
    seat_booking_ids
  ) => {
    // Tính tổng tiền của bắp nước
    const concessionTotal = concessionCart
      ? Object.values(concessionCart).reduce((total, item) => {
          return total + parseFloat(item.product.price) * item.quantity
        }, 0)
      : 0

    // Tạo danh sách item bắp nước
    const concessions = concessionCart
      ? Object.values(concessionCart).map((item) => ({
          item_id: item.product.id,
          quantity: item.quantity
        }))
      : []

    // Tạo object dữ liệu cuối cùng
    return {
      seat_total_price: ticketTotal,
      concession_total_price: concessionTotal,
      seat_booking_ids: seat_booking_ids,
      concessions
    }
  }

  const handleBookingConfirm = async () => {
    const data = {
      seat_ids: selectedSeats.map((seat) => seat.id),
      movie_id: movieId,
      hall_id: hallId,
      showtime_id: showtimeId
    }

    const bookingData = await dispatch(createBooking(data))
    if (!bookingData) {
      console.error('Booking failed.')
      return
    }

    const seat_booking_ids = bookingData.map((b) => b.id)

    const datas = getBookingData(
      ticketTotal,
      concessionCart,
      selectedSeats,
      seat_booking_ids
    )

    const ticketData = await dispatch(createTicket(datas))
    console.log('ticketData', ticketData)
    const ticketId = ticketData.id
    navigate(`/payment/${ticketId}`)
  }

  return (
    <div className="ticket-container">
      <Card className="movie-ticket" bordered={false}>
        {/* Header Section */}
        <div className="ticket-header">
          <img
            src={ticketData.movie.image_path}
            alt={ticketData.movie.name}
            className="movie-poster"
          />
          <div>
            <Title level={3} className="movie-title">
              {ticketData.movie.name}
            </Title>
            <div className="rating-section">
              <Rate disabled defaultValue={5} />
              <Text strong>{ticketData.movie.rating}/10</Text>
            </div>
            <Tag className="show-type-tag">{ticketData.showtime.show_type}</Tag>
          </div>
        </div>

        {/* Body Section */}
        <div className="ticket-body">
          {/* <div className="synopsis">{ticketData.movie.synopsis}</div> */}

          {/* <div className="cast-info">
            <strong>Diễn viên:</strong> {ticketData.movie.top_cast}
          </div> */}

          {/* <Divider /> */}

          <div className="movie-info-row">
            <div className="info-item">
              <CalendarOutlined className="info-icon" />
              <Text className="info-text">
                {formatDate(ticketData.showtime.showtime_date)}
              </Text>
            </div>
          </div>

          <div className="movie-info-row">
            <div className="info-item">
              <ClockCircleOutlined className="info-icon" />
              <Text className="info-text">
                {ticketData.showtime.movie_start_time}
              </Text>
            </div>
          </div>

          <div className="movie-info-row">
            <div className="info-item">
              <HomeOutlined className="info-icon" />
              <Text className="info-text">{ticketData.hall.name}</Text>
            </div>
          </div>
          <div className="movie-info-row">
            <div className="info-item">
              <HomeOutlined className="info-icon" />
              <Text className="info-text">
                Ghế:{' '}
                {selectedSeats.length > 0
                  ? selectedSeats.map((seat) => seat.name).join(', ')
                  : 'Chưa chọn'}
              </Text>
            </div>
            <div className="info-item">
              <Text className="info-text"> {formatPrice(ticketTotal)}</Text>
            </div>
          </div>
        </div>

        {/* Concession Section */}
        {concessionCart && Object.keys(concessionCart).length > 0 && (
          <div className="concession-item-wrapper">
            {Object.values(concessionCart).map((item) => (
              <div key={item.id} className="concession-item">
                <div className="concession-details">
                  <div className="concession-info">
                    <Text strong>{item.product.name}</Text>
                    <div>
                      <strong>{item.quantity}</strong> x{' '}
                      {formatPrice(parseFloat(item.product.price))} ={' '}
                      {formatPrice(
                        parseFloat(item.product.price) * item.quantity
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="movie-info-row">
          <div className="price-movie-ticket">
            <div className="price-tag">{formatPrice(totalPrice)}</div>
          </div>
        </div>

        <div className="theatre-info">
          <div className="theatre-name-ticket">
            Rạp {ticketData.hall.theatre.name}
          </div>
          <div className="theatre-location-ticket">
            {ticketData.hall.theatre.locationDetails}
          </div>
        </div>

        {/* Footer Section */}
        <div className="ticket-footer">
          <div className="qr-placeholder">QR CODE</div>
          <div className="ticket-id">
            <div>
              <strong>Mã vé:</strong>
            </div>
            <div>{ticketData.movie_id.slice(-8).toUpperCase()}</div>
            <div style={{ marginTop: 4, fontSize: '11px' }}>
              Cinezone Ticket
            </div>
          </div>
        </div>
        <div className="booking-actions">
          <button className="btn-back" onClick={() => handleBack()}>
            <i className="icon-arrow-left"></i> Quay Lại
          </button>
          <button
            className="btn-confirm"
            onClick={() => handleBookingConfirm()}
          >
            Xác Nhận Đặt Vé <i className="icon-arrow-right"></i>
          </button>
        </div>
      </Card>
    </div>
  )
}

export default MovieTicket
