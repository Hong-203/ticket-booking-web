import React, { useEffect, useState } from 'react'
import { Table, Button, Space, Tag, message } from 'antd'
import { EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import {
  createHall,
  createHallwiseSeat,
  deleteHall,
  getAllHall,
  update
} from '../../../stores/Hall/hallApis'
import HallEdit from './HallEdit'
import { getAllTheatre } from '../../../stores/Theatre/theatreApis'
import HallCreate from './HallCreate'
import HallSyncSeats from './HallSyncSeats'
import HallSeatModal from './HallSeatModal'

const AdminHall = () => {
  const dispatch = useDispatch()
  const hallList = useSelector((state) => state.hall.hallList || [])
  const theatreList = useSelector((state) => state.theatre.theatreList || [])
  const [halls, setHalls] = useState([])
  const [editingHall, setEditingHall] = useState(null)
  const [theatres, setTheatres] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false)
  const [isSyncModalVisible, setIsSyncModalVisible] = useState(false)
  const [open, setOpen] = useState(false)
  const [selectedHallId, setSelectedHallId] = useState(null)

  useEffect(() => {
    dispatch(getAllHall())
    dispatch(getAllTheatre())
  }, [dispatch])
  useEffect(() => {
    if (Array.isArray(theatreList)) {
      setTheatres(theatreList)
    }
  }, [theatreList])
  useEffect(() => {
    if (Array.isArray(hallList)) {
      setHalls(hallList)
    }
  }, [hallList])

  const handleDeleteHall = async (id) => {
    try {
      await dispatch(deleteHall(id))
      message.success('Xoá phòng chiếu thành công!')
      dispatch(getAllHall())
    } catch (error) {
      message.error('Xoá thất bại!')
      console.error(error)
    }
  }

  const handleEditHall = (record) => {
    setEditingHall(record)
    setIsModalVisible(true)
  }

  const handleUpdateHall = async (updated) => {
    const { id, created_at, updated_at, theatre, ...payload } = updated
    try {
      await dispatch(update(id, payload))
      message.success('Cập nhật thành công!')
      setIsModalVisible(false)
      dispatch(getAllHall())
    } catch (error) {
      message.error('Cập nhật thất bại!')
    }
  }

  const handleCreateHall = async (payload) => {
    try {
      await dispatch(createHall(payload))
      message.success('Tạo phòng chiếu thành công!')
      setIsCreateModalVisible(false)
      dispatch(getAllHall())
    } catch (error) {
      message.error('Tạo thất bại!')
      console.error(error)
    }
  }

  const handleSyncHallSeats = async (data) => {
    try {
      await dispatch(createHallwiseSeat(data))
      message.success('Đồng bộ ghế thành công!')
      setIsSyncModalVisible(false)
    } catch (error) {
      message.error('Đồng bộ thất bại!')
      console.error(error)
    }
  }

  const columns = [
    {
      title: 'Tên phòng chiếu',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <b>{text}</b>
    },
    {
      title: 'Số ghế',
      dataIndex: 'totalSeats',
      key: 'totalSeats'
    },
    {
      title: 'Thuộc rạp',
      dataIndex: 'theatre',
      key: 'theatre',
      render: (theatre) => (theatre ? theatre.name : 'Không xác định')
    },
    {
      title: 'Địa chỉ rạp',
      dataIndex: 'theatre',
      key: 'locationDetails',
      render: (theatre) => theatre?.locationDetails
    },
    {
      title: 'Tỉnh / Thành phố',
      dataIndex: 'theatre',
      key: 'location',
      render: (theatre) => <Tag color="blue">{theatre?.location}</Tag>
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
            onClick={() => {
              setSelectedHallId(record.id)
              setOpen(true)
            }}
          >
            Xem
          </Button>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEditHall(record)}
          >
            Sửa
          </Button>
          <Button
            type="default"
            style={{ marginLeft: 8 }}
            onClick={() => setIsSyncModalVisible(true)}
          >
            Đồng bộ ghế
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteHall(record.id)}
          >
            Xoá
          </Button>
        </Space>
      )
    }
  ]

  return (
    <div style={{ padding: 24 }}>
      <h2>Quản lý Phòng Chiếu</h2>
      <Button
        type="primary"
        style={{ marginBottom: 16 }}
        onClick={() => setIsCreateModalVisible(true)}
      >
        + Thêm phòng chiếu
      </Button>

      <Table
        columns={columns}
        dataSource={halls}
        rowKey="id"
        bordered
        pagination={{ pageSize: 10 }}
      />

      <HallEdit
        visible={isModalVisible}
        hallData={editingHall}
        theatres={theatres} // TRUYỀN DANH SÁCH RẠP VÀO ĐÂY
        onCancel={() => setIsModalVisible(false)}
        onUpdate={handleUpdateHall}
      />
      <HallCreate
        visible={isCreateModalVisible}
        theatres={theatres}
        onCancel={() => setIsCreateModalVisible(false)}
        onCreate={handleCreateHall}
      />
      <HallSyncSeats
        visible={isSyncModalVisible}
        onCancel={() => setIsSyncModalVisible(false)}
        onSync={handleSyncHallSeats}
        halls={halls}
      />
      <HallSeatModal
        open={open}
        onClose={() => {
          setOpen(false)
          setSelectedHallId(null)
        }}
        hallId={selectedHallId}
      />
    </div>
  )
}

export default AdminHall
