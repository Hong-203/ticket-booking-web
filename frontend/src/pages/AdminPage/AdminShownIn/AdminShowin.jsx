import React, { useEffect, useState } from 'react'
import {
  Table,
  Button,
  Space,
  Tag,
  message,
  Image,
  Select,
  Row,
  Col,
  Modal
} from 'antd'
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import {
  createShownIn,
  deleteShownIn,
  getAllShownIn,
  updateShownIn
} from '../../../stores/ShownIn/shownInApis'
import ShowtimeInCreate from './ShownInCreate'
import ShowtimeInUpdate from './ShowtimeInUpdate'
import { getAllMovie } from '../../../stores/Movie/movieApis'
import { getAllHall } from '../../../stores/Hall/hallApis'
import { getAllShowTime } from '../../../stores/Showtimes/showTimeApis'
import SeatView from './SeatView'

const AdminShowin = () => {
  const dispatch = useDispatch()

  const shownInList = useSelector((state) => state.shownIn.shownInList || [])
  const hallList = useSelector((state) => state.hall.hallList || [])
  const movieList = useSelector((state) => state.movie.movieList || [])
  const showtimeList = useSelector(
    (state) => state.showTime.showTimesList || []
  )

  const [showins, setShowins] = useState([])
  const [editingShowin, setEditingShowin] = useState(null)
  const [isEditModalVisible, setIsEditModalVisible] = useState(false)
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false)

  const [filterMovieId, setFilterMovieId] = useState('')
  const [filterHallId, setFilterHallId] = useState('')
  const [filterShowtimeId, setFilterShowtimeId] = useState('')

  const [isSeatViewVisible, setIsSeatViewVisible] = useState(false)
  const [seatViewData, setSeatViewData] = useState({
    movieId: null,
    hallId: null,
    showtimeId: null
  })

  const fetchFilteredData = () => {
    const params = new URLSearchParams()
    if (filterMovieId) params.append('movie_id', filterMovieId)
    if (filterHallId) params.append('hall_id', filterHallId)
    if (filterShowtimeId) params.append('showtime_id', filterShowtimeId)
    dispatch(getAllShownIn(params.toString()))
  }

  useEffect(() => {
    dispatch(getAllMovie({ status: '', page: 1, limit: 100 }))
    dispatch(getAllHall())
    dispatch(getAllShowTime())
    dispatch(getAllShownIn()) // Mặc định gọi tất cả
  }, [dispatch])

  useEffect(() => {
    if (Array.isArray(shownInList)) {
      setShowins(shownInList)
    }
  }, [shownInList])

  const handleEditShowin = (record) => {
    setEditingShowin(record)
    setIsEditModalVisible(true)
  }

  const handleUpdateShowin = async (newData) => {
    if (!editingShowin) return
    try {
      await dispatch(updateShownIn(newData))
      message.success('Cập nhật phòng vé thành công!')
      setIsEditModalVisible(false)
      setEditingShowin(null)
      fetchFilteredData()
    } catch (error) {
      message.error('Cập nhật phòng vé thất bại!')
    }
  }

  const handleDeleteShowin = async (id) => {
    try {
      await dispatch(deleteShownIn(id))
      message.success('Xoá phòng vé thành công!')
      fetchFilteredData()
    } catch (error) {
      message.error('Xoá thất bại!')
    }
  }

  const handleCreateShowin = async (payload) => {
    try {
      await dispatch(createShownIn(payload))
      message.success('Tạo phòng vé thành công!')
      setIsCreateModalVisible(false)
      fetchFilteredData()
    } catch (error) {
      message.error('Tạo phòng vé thất bại!')
    }
  }

  const handleViewSeat = (record) => {
    setSeatViewData({
      movieId: record.movie?.id,
      hallId: record.hall?.id,
      showtimeId: record.showtime?.id
    })
    setIsSeatViewVisible(true)
  }

  const handleClearFilter = () => {
    setFilterMovieId('')
    setFilterHallId('')
    setFilterShowtimeId('')
    dispatch(getAllShownIn())
  }

  const columns = [
    {
      title: 'Phim',
      key: 'movie',
      render: (_, record) => (
        <Space>
          <Image
            src={record.movie?.image_path}
            alt={record.movie?.name}
            width={50}
            height={75}
            style={{ objectFit: 'cover' }}
          />
          <div>{record.movie?.name}</div>
        </Space>
      )
    },
    {
      title: 'Phòng chiếu',
      dataIndex: ['hall', 'name'],
      key: 'hall_name'
    },
    {
      title: 'Ngày chiếu',
      dataIndex: ['showtime', 'showtime_date'],
      key: 'showtime_date',
      render: (date) => moment(date).format('DD/MM/YYYY')
    },
    {
      title: 'Giờ chiếu',
      dataIndex: ['showtime', 'movie_start_time'],
      key: 'movie_start_time'
    },
    {
      title: 'Định dạng',
      dataIndex: ['showtime', 'show_type'],
      key: 'show_type',
      render: (type) => <Tag color="purple">{type}</Tag>
    },
    {
      title: 'Giá vé',
      dataIndex: ['showtime', 'price_per_seat'],
      key: 'price_per_seat',
      render: (price) => `${price?.toLocaleString()} đ`
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
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button icon={<EyeOutlined />} onClick={() => handleViewSeat(record)}>
            Xem
          </Button>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEditShowin(record)}
          >
            Sửa
          </Button>
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDeleteShowin(record.showtime_id)}
          >
            Xoá
          </Button>
        </Space>
      )
    }
  ]

  return (
    <div style={{ padding: 24 }}>
      <h2>Quản lý phòng vé (Showin)</h2>

      {/* Bộ lọc */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Select
            style={{ width: '100%' }}
            placeholder="Chọn phim"
            value={filterMovieId || undefined}
            onChange={setFilterMovieId}
            allowClear
          >
            {movieList.map((movie) => (
              <Select.Option key={movie.id} value={movie.id}>
                {movie.name}
              </Select.Option>
            ))}
          </Select>
        </Col>
        <Col span={6}>
          <Select
            style={{ width: '100%' }}
            placeholder="Chọn phòng chiếu"
            value={filterHallId || undefined}
            onChange={setFilterHallId}
            allowClear
          >
            {hallList.map((hall) => (
              <Select.Option key={hall.id} value={hall.id}>
                {`${hall.name} - ${hall.theatre?.name}`}
              </Select.Option>
            ))}
          </Select>
        </Col>
        <Col span={6}>
          <Select
            style={{ width: '100%' }}
            placeholder="Chọn suất chiếu"
            value={filterShowtimeId || undefined}
            onChange={setFilterShowtimeId}
            allowClear
          >
            {showtimeList.map((s) => (
              <Select.Option key={s.id} value={s.id}>
                {s.movie_start_time} - {s.showtime_date}
              </Select.Option>
            ))}
          </Select>
        </Col>
        <Col span={6}>
          <Space>
            <Button type="primary" onClick={fetchFilteredData}>
              Lọc
            </Button>
            <Button onClick={handleClearFilter}>Xoá lọc</Button>
            <Button type="dashed" onClick={() => setIsCreateModalVisible(true)}>
              + Thêm phòng vé
            </Button>
          </Space>
        </Col>
      </Row>

      {/* Bảng dữ liệu */}
      <Table
        columns={columns}
        dataSource={showins}
        rowKey={(record) => record.showtime_id}
        bordered
        pagination={{ pageSize: 10 }}
      />

      {/* Modal cập nhật */}
      <ShowtimeInUpdate
        visible={isEditModalVisible}
        onCancel={() => {
          setIsEditModalVisible(false)
          setEditingShowin(null)
        }}
        onUpdate={handleUpdateShowin}
        oldData={{
          movie_id: editingShowin?.movie?.id || '',
          showtime_id: editingShowin?.showtime?.id || '',
          hall_id: editingShowin?.hall?.id || ''
        }}
      />

      {/* Modal tạo */}
      <ShowtimeInCreate
        visible={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        onCreate={handleCreateShowin}
      />

      <Modal
        title="Sơ đồ ghế"
        visible={isSeatViewVisible}
        onCancel={() => setIsSeatViewVisible(false)}
        footer={null}
        width={1200}
      >
        <SeatView
          movieId={seatViewData.movieId}
          hallId={seatViewData.hallId}
          showtimeId={seatViewData.showtimeId}
        />
      </Modal>
    </div>
  )
}

export default AdminShowin
