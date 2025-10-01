import React, { useEffect, useState } from 'react'
import { Table, Button, Space, Tag, message, Image, Select } from 'antd'
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import {
  createMovie,
  deleteMovie,
  editMovie,
  getAllMovie
} from '../../../stores/Movie/movieApis'
import MovieDetailModal from './MovieDetail'
import MovieEdit from './MovieEdit'
import MovieCreate from './MovieCreate'

const AdminMovie = () => {
  const dispatch = useDispatch()
  const movieList = useSelector((state) => state.movie.movieList || [])
  const [movies, setMovies] = useState([])
  const [editingMovie, setEditingMovie] = useState(null)
  const [isEditModalVisible, setIsEditModalVisible] = useState(false)
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false)
  const [filterStatus, setFilterStatus] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false)
  const [selectedMovieId, setSelectedMovieId] = useState(null)

  const limit = 10

  useEffect(() => {
    dispatch(getAllMovie({ status: filterStatus, page: currentPage, limit }))
  }, [dispatch, filterStatus, currentPage])

  useEffect(() => {
    if (Array.isArray(movieList)) {
      setMovies(movieList)
    }
  }, [movieList])

  const handleEditMovie = (record) => {
    setEditingMovie(record)
    setIsEditModalVisible(true)
  }

  const handleUpdateMovie = async (updated) => {
    const { id, created_at, updated_at, ...payload } = updated
    try {
      await dispatch(editMovie(id, payload))
      message.success('Cập nhật phim thành công!')
      setIsEditModalVisible(false)
      dispatch(getAllMovie())
    } catch (error) {
      message.error('Cập nhật thất bại!')
    }
  }

  const handleDeleteMovie = async (id) => {
    try {
      await dispatch(deleteMovie(id))
      message.success('Xoá phim thành công!')
      dispatch(getAllMovie())
    } catch (error) {
      message.error('Xoá thất bại!')
    }
  }

  const handleCreateMovie = async (payload) => {
    try {
      await dispatch(createMovie(payload))
      message.success('Tạo phim thành công!')
      setIsCreateModalVisible(false)
      dispatch(getAllMovie())
    } catch (error) {
      message.error('Tạo phim thất bại!')
    }
  }

  const handleViewDetail = (record) => {
    setSelectedMovieId(record.id)
    setIsDetailModalVisible(true)
  }

  const columns = [
    {
      title: 'Ảnh',
      dataIndex: 'image_path',
      key: 'image_path',
      render: (url) => <Image width={80} src={url} />
    },
    {
      title: 'Tên phim',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Ngôn ngữ',
      dataIndex: 'language',
      key: 'language'
    },
    {
      title: 'Thời lượng',
      dataIndex: 'duration',
      key: 'duration'
    },
    {
      title: 'Điểm đánh giá',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating) => <Tag color="gold">{rating}</Tag>
    },
    {
      title: 'Ngày phát hành',
      dataIndex: 'release_date',
      key: 'release_date',
      render: (date) => moment(date).format('DD/MM/YYYY')
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date) => moment(date).format('DD/MM/YYYY HH:mm')
    },
    {
      title: 'Cập nhật',
      dataIndex: 'updated_at',
      key: 'updated_at',
      render: (date) => moment(date).format('DD/MM/YYYY HH:mm')
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
          >
            Xem
          </Button>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEditMovie(record)}
          >
            Sửa
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteMovie(record.id)}
          >
            Xoá
          </Button>
        </Space>
      )
    }
  ]

  return (
    <div style={{ padding: 24 }}>
      <h2>Quản lý Phim</h2>
      <Button
        type="primary"
        style={{ marginBottom: 16 }}
        onClick={() => setIsCreateModalVisible(true)}
      >
        + Thêm phim
      </Button>
      <div
        style={{
          marginBottom: 16,
          display: 'flex',
          alignItems: 'center',
          gap: 8
        }}
      >
        <span>Trạng thái:</span>
        <Select
          value={filterStatus}
          onChange={(value) => {
            setFilterStatus(value)
            setCurrentPage(1)
          }}
          style={{ width: 200 }}
          placeholder="Chọn trạng thái"
          allowClear
        >
          <Option value="">Tất cả</Option>
          <Option value="now_showing">Đang chiếu</Option>
          <Option value="coming_soon">Sắp chiếu</Option>
        </Select>
      </div>

      <Table
        columns={columns}
        dataSource={movies}
        rowKey="id"
        bordered
        pagination={{
          current: currentPage,
          pageSize: limit,
          total: useSelector((state) => state.movie.total),
          onChange: (page) => setCurrentPage(page)
        }}
      />

      <MovieEdit
        visible={isEditModalVisible}
        movieData={editingMovie}
        onCancel={() => setIsEditModalVisible(false)}
        onUpdate={handleUpdateMovie}
      />

      <MovieCreate
        visible={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        onCreate={handleCreateMovie}
      />

      <MovieDetailModal
        visible={isDetailModalVisible}
        movieId={selectedMovieId}
        onClose={() => setIsDetailModalVisible(false)}
      />
    </div>
  )
}

export default AdminMovie
