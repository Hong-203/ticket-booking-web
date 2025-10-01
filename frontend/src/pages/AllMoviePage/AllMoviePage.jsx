import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Spin, Empty, Pagination } from 'antd'
import { getAllMovie } from '../../stores/Movie/movieApis'
import CollectionCard from '../../components/CollectionCard'
import './MoviePage.css'
import { DoubleRightOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

const AllMoviePage = () => {
  const dispatch = useDispatch()
  const movieList = useSelector((state) => state.movie.movieList || [])
  const [page, setPage] = useState(1)
  const [movieData, setMovieData] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  useEffect(() => {
    dispatch(getAllMovie({ status: 'now_showing', page: page, limit: 12 }))
  }, [dispatch])

  useEffect(() => {
    if (Array.isArray(movieList)) {
      setMovieData(movieList)
      setLoading(false)
    }
  }, [movieList])
  const handleComingSoon = () => {
    navigate('/phim-sap-chieu')
  }
  return (
    <div className="all-movie-page">
      <div className="movie-header-container">
        <h2 className="movie-section-title playing-now">🎬 Phim đang chiếu</h2>
        <h2
          className="movie-section-title upcoming"
          onClick={() => handleComingSoon()}
        >
          📅 Phim sắp chiếu{' '}
          <DoubleRightOutlined className="arrow-icon-all-movie" />
        </h2>
      </div>

      {loading ? (
        <div className="loading-container">
          <Spin size="large" />
        </div>
      ) : movieData.length > 0 ? (
        <>
          <div className="movie-grid">
            {movieData.map((movie) => (
              <CollectionCard key={movie.id} {...movie} />
            ))}
          </div>

          <div className="pagination-container">
            <Pagination
              current={page}
              total={12}
              pageSize={10}
              onChange={(newPage) => {
                setPage(newPage)
                setLoading(true)
                dispatch(
                  getAllMovie({
                    status: 'now_showing',
                    page: newPage,
                    limit: 12
                  })
                )
              }}
              showSizeChanger={false}
            />
          </div>
        </>
      ) : (
        <Empty description="No movies found" />
      )}
    </div>
  )
}

export default AllMoviePage
