import React, { useEffect, useState } from 'react'
import CinemaLayout from '../../components/CinemaLayout/CinemaLayout'
import MovieTicket from '../../components/MovieTicket/MovieTicket'
import { useParams } from 'react-router-dom'
import './BookingPage.css'
import { useDispatch, useSelector } from 'react-redux'
import { getAllShownIn } from '../../stores/ShownIn/shownInApis'
import ConcessionItems from '../../components/ConcessionItems/ConcessionItems'

const BookingPage = () => {
  const { movieId, hallId, showtimeId, slug } = useParams()
  const [movieInfo, setMovieInfo] = useState({})
  const [selectedSeats, setSelectedSeats] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const shownInList = useSelector((state) => state.shownIn.shownInList || [])
  const dispatch = useDispatch()
  const [cart, setCartItems] = useState({})

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const query = `movie_id=${movieId}&hall_id=${hallId}&showtime_id=${showtimeId}`
        await dispatch(getAllShownIn(query))
      } catch (err) {
        setError('Failed to fetch movie information')
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [dispatch, movieId, hallId, showtimeId])

  useEffect(() => {
    if (shownInList.length > 0) {
      setMovieInfo(shownInList[0])
    }
  }, [shownInList])

  if (isLoading) {
    return <div className="booking-page">Loading...</div>
  }

  if (error) {
    return <div className="booking-page">{error}</div>
  }

  console.log('cart', cart)

  return (
    <div className="booking-page">
      <div className="booking-container">
        <div className="booking-header">
          <h1 className="booking-title">Đặt Vé Xem Phim</h1>
          <p className="booking-subtitle">
            Chọn ghế và hoàn tất đặt vé của bạn
          </p>
        </div>

        <div className="booking-content">
          <div className="cinema-section">
            <CinemaLayout
              movieId={movieId}
              hallId={hallId}
              showtimeId={showtimeId}
              slug={slug}
              selectedSeats={selectedSeats}
              setSelectedSeats={setSelectedSeats}
            />
            <ConcessionItems onCartChange={(cart) => setCartItems(cart)} />
          </div>

          <div className="ticket-section">
            <div className="ticket-wrapper">
              <h3 className="section-title">Thông Tin Vé</h3>
              {Object.keys(movieInfo).length > 0 ? (
                <MovieTicket
                  movieId={movieId}
                  hallId={hallId}
                  showtimeId={showtimeId}
                  selectedSeats={selectedSeats}
                  slug={slug}
                  movieInfo={movieInfo}
                  concessionCart={cart}
                />
              ) : (
                <p>No movie information available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookingPage
