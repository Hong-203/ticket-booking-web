// src/pages/Admin/Movie/MovieDetailModal.jsx
import React, { useEffect } from 'react'
import {
  Descriptions,
  Image,
  Spin,
  Typography,
  Tag,
  Divider,
  Modal
} from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { getMovieById } from '../../../stores/Movie/movieApis'

const { Title } = Typography

const MovieDetailModal = ({ visible, movieId, onClose }) => {
  const dispatch = useDispatch()
  const movieDetails = useSelector((state) => state.movie.movieDetails)
  const loading = useSelector((state) => state.movie.loading)
  const error = useSelector((state) => state.movie.error)

  useEffect(() => {
    if (visible && movieId) {
      dispatch(getMovieById(movieId))
    }
  }, [dispatch, movieId, visible])

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      onOk={onClose}
      title={movieDetails?.name || 'Chi tiết phim'}
      width={700}
    >
      {loading ? (
        <Spin fullscreen />
      ) : error ? (
        <div>Lỗi: {error}</div>
      ) : !movieDetails ? (
        <div>Không tìm thấy phim</div>
      ) : (
        <div>
          <Image
            width={200}
            src={movieDetails.image_path}
            alt={movieDetails.name}
          />

          <Descriptions bordered column={1} style={{ marginTop: 16 }}>
            <Descriptions.Item label="Ngôn ngữ">
              {movieDetails.language}
            </Descriptions.Item>
            <Descriptions.Item label="Thời lượng">
              {movieDetails.duration}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày khởi chiếu">
              {movieDetails.release_date}
            </Descriptions.Item>
            <Descriptions.Item label="Điểm đánh giá">
              {movieDetails.rating}
            </Descriptions.Item>
            <Descriptions.Item label="Top diễn viên">
              {movieDetails.top_cast}
            </Descriptions.Item>
            <Descriptions.Item label="Tóm tắt">
              {movieDetails.synopsis}
            </Descriptions.Item>
            <Descriptions.Item label="Trailer">
              <a
                href={movieDetails.trailer_url}
                target="_blank"
                rel="noreferrer"
              >
                Xem trailer
              </a>
            </Descriptions.Item>
          </Descriptions>

          <Divider />

          <Title level={4}>Đạo diễn</Title>
          {movieDetails.directors?.map((d, index) => (
            <Tag key={index} color="blue">
              {d.director}
            </Tag>
          ))}

          <Divider />

          <Title level={4}>Thể loại</Title>
          {movieDetails.genres?.map((g, index) => (
            <Tag key={index} color="green">
              {g.genre}
            </Tag>
          ))}
        </div>
      )}
    </Modal>
  )
}

export default MovieDetailModal
