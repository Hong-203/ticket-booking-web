import React, { useEffect, useState } from 'react'
import { Table, Button, Space, Tag, message } from 'antd'
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import {
  createShowTime,
  deleteShowTime,
  getAllShowTime,
  updateShowTime
} from '../../../stores/Showtimes/showTimeApis'
import ShowtimeEdit from './ShowtimeEdit'
import ShowtimeCreate from './ShowtimeCreate'

const AdminShowtime = () => {
  const dispatch = useDispatch()
  const showtimeList = useSelector(
    (state) => state.showTime.showTimesList || []
  )
  const [showtimes, setShowtimes] = useState([])
  const [editingShowtime, setEditingShowtime] = useState(null)
  const [isEditModalVisible, setIsEditModalVisible] = useState(false)
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false)

  useEffect(() => {
    dispatch(getAllShowTime())
  }, [dispatch])

  useEffect(() => {
    if (Array.isArray(showtimeList)) {
      setShowtimes(showtimeList)
    }
  }, [showtimeList])

  const handleEditShowtime = (record) => {
    setEditingShowtime(record)
    setIsEditModalVisible(true)
  }

  const handleUpdateShowtime = async (updated) => {
    const { id, created_at, updated_at, ...payload } = updated
    try {
      await dispatch(updateShowTime(id, payload))
      message.success('Cập nhật lịch chiếu thành công!')
      setIsEditModalVisible(false)
      dispatch(getAllShowTime())
    } catch (error) {
      message.error('Cập nhật thất bại!')
    }
  }

  const handleDeleteShowtime = async (id) => {
    try {
      await dispatch(deleteShowTime(id))
      message.success('Xoá lịch chiếu thành công!')
      dispatch(getAllShowTime())
    } catch (error) {
      message.error('Xoá thất bại!')
    }
  }

  const handleCreateShowtime = async (payload) => {
    try {
      await dispatch(createShowTime(payload))
      message.success('Tạo lịch chiếu thành công!')
      setIsCreateModalVisible(false)
      dispatch(getAllShowTime())
    } catch (error) {
      message.error('Tạo lịch chiếu thất bại!')
    }
  }

  const columns = [
    {
      title: 'Giờ chiếu',
      dataIndex: 'movie_start_time',
      key: 'movie_start_time',
      render: (text) => <b>{text}</b>
    },
    {
      title: 'Ngày chiếu',
      dataIndex: 'showtime_date',
      key: 'showtime_date',
      render: (date) => moment(date).format('DD/MM/YYYY')
    },
    {
      title: 'Định dạng',
      dataIndex: 'show_type',
      key: 'show_type',
      render: (type) => <Tag color="purple">{type}</Tag>
    },
    {
      title: 'Giá ghế',
      dataIndex: 'price_per_seat',
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
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() =>
              message.info(
                `Lịch chiếu: ${record.movie_start_time} - ${record.showtime_date}`
              )
            }
          >
            Xem
          </Button>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEditShowtime(record)}
          >
            Sửa
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteShowtime(record.id)}
          >
            Xoá
          </Button>
        </Space>
      )
    }
  ]

  return (
    <div style={{ padding: 24 }}>
      <h2>Quản lý Lịch Chiếu</h2>
      <Button
        type="primary"
        style={{ marginBottom: 16 }}
        onClick={() => setIsCreateModalVisible(true)}
      >
        + Thêm lịch chiếu
      </Button>

      <Table
        columns={columns}
        dataSource={showtimes}
        rowKey="id"
        bordered
        pagination={{ pageSize: 10 }}
      />

      <ShowtimeEdit
        visible={isEditModalVisible}
        showtimeData={editingShowtime}
        onCancel={() => setIsEditModalVisible(false)}
        onUpdate={handleUpdateShowtime}
      />

      <ShowtimeCreate
        visible={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        onCreate={handleCreateShowtime}
      />
    </div>
  )
}

export default AdminShowtime
