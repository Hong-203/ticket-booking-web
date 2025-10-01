import React, { useEffect, useState } from 'react'
import { Card, Typography, Tag, Rate, Divider, Skeleton } from 'antd'
import {
  CalendarOutlined,
  ClockCircleOutlined,
  HomeOutlined
} from '@ant-design/icons'
import './TicketDetail.css'
import { useDispatch, useSelector } from 'react-redux'
import { getTicketById } from '../../stores/Ticket/ticketApis'

const { Title, Text } = Typography

const TicketDetail = ({ ticketId }) => {
  const dispatch = useDispatch()

  useEffect(() => {
    if (ticketId) {
      dispatch(getTicketById(ticketId))
    }
  }, [dispatch, ticketId])

  const ticketDetail = useSelector((state) => state.ticket.ticketDetails)
  const loading = useSelector((state) => state.ticket.loading)

  if (loading || !ticketDetail) {
    return (
      <Card className="movie-ticket" bordered={false}>
        <Skeleton active paragraph={{ rows: 10 }} />
      </Card>
    )
  }

  const selectedSeats = ticketDetail?.seats?.map((s) => s.seat) || []
  const selectedMovie = ticketDetail?.movie || {}
  const concessionCart = (ticketDetail?.concessions || []).reduce(
    (acc, item) => {
      acc[item.item.id] = {
        id: item.item.id,
        product: item.item,
        quantity: item.quantity
      }
      return acc
    },
    {}
  )
  const totalPrice = parseFloat(ticketDetail?.total_price || 0)
  const ticketTotal = parseFloat(ticketDetail?.seat_total_price || 0)

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleBack = () => {
    console.log('Back clicked')
  }

  const handleBookingConfrim = () => {
    console.log('Booking confirmed')
  }

  return (
    <div className="ticket-container">
      <Card className="movie-ticket" bordered={false}>
        {/* Header Section */}
        <div className="ticket-header">
          <img
            src={selectedMovie?.image_path}
            alt={selectedMovie?.name}
            className="movie-poster"
          />
          <div>
            <Title level={3} className="movie-title">
              {selectedMovie?.name}
            </Title>
            <div className="rating-section">
              <Rate disabled defaultValue={5} />
              <Text strong>{selectedMovie?.rating}/10</Text>
            </div>
            <Tag className="show-type-tag">
              {ticketDetail.showtime?.show_type}
            </Tag>
          </div>
        </div>

        {/* Body Section */}
        <div className="ticket-body">
          <div className="movie-info-row">
            <div className="info-item">
              <CalendarOutlined className="info-icon" />
              <Text className="info-text">
                {formatDate(ticketDetail.showtime?.showtime_date)}
              </Text>
            </div>
          </div>

          <div className="movie-info-row">
            <div className="info-item">
              <ClockCircleOutlined className="info-icon" />
              <Text className="info-text">
                {ticketDetail.showtime?.movie_start_time}
              </Text>
            </div>
          </div>

          <div className="movie-info-row">
            <div className="info-item">
              <HomeOutlined className="info-icon" />
              <Text className="info-text">{ticketDetail.hall?.name}</Text>
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
              <Text className="info-text">{formatPrice(ticketTotal)}</Text>
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
            Rạp {ticketDetail.hall?.theatre?.name}
          </div>
          <div className="theatre-location-ticket">
            {ticketDetail.hall?.theatre?.locationDetails}
          </div>
        </div>

        {/* Footer Section */}
        <div className="ticket-footer">
          <div className="qr-placeholder">QR CODE</div>
          <div className="ticket-id">
            <div>
              <strong>Mã vé:</strong>
            </div>
            <div>{ticketDetail?.movie?.id.slice(-8).toUpperCase()}</div>
            <div style={{ marginTop: 4, fontSize: '11px' }}>
              Cinezone Ticket
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default TicketDetail
