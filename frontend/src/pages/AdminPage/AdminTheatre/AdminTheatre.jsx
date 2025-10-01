import React, { useEffect, useState } from 'react'
import { Table, Tag, Space, Button, message } from 'antd'
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import {
  createTheatre,
  deleteTheatre,
  getAllTheatre,
  update
} from '../../../stores/Theatre/theatreApis'
import TheatreEdit from './TheatreEdit'
import TheatreCreate from './TheatreCreate'

const AdminTheatre = () => {
  const dispatch = useDispatch()
  const theatreList = useSelector((state) => state.theatre.theatreList || [])
  const [theatres, setTheatres] = useState([])
  const [editingTheatre, setEditingTheatre] = useState(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false)

  useEffect(() => {
    dispatch(getAllTheatre())
  }, [dispatch])

  useEffect(() => {
    if (Array.isArray(theatreList)) {
      setTheatres(theatreList)
    }
  }, [theatreList])

  const handleDeleteTheatre = async (id) => {
    try {
      await dispatch(deleteTheatre(id))
      message.success('Xoá rạp thành công!')
      dispatch(getAllTheatre())
    } catch (error) {
      message.error('Xoá thất bại!')
      console.error(error)
    }
  }

  const handleEditTheatre = (record) => {
    setEditingTheatre(record)
    setIsModalVisible(true)
  }

  const handleUpdateTheatre = async (updated) => {
    const { id, created_at, updated_at, ...payload } = updated
    try {
      await dispatch(update(id, payload))
      message.success('Cập nhật thành công!')
      setIsModalVisible(false)
      dispatch(getAllTheatres())
    } catch (error) {
      message.error('Cập nhật thất bại!')
    }
  }

  const handleCreateTheatre = async (payload) => {
    try {
      await dispatch(createTheatre(payload))
      message.success('Tạo rạp thành công!')
      setIsCreateModalVisible(false)
      dispatch(getAllTheatre())
    } catch (error) {
      message.error('Tạo rạp thất bại!')
      console.error(error)
    }
  }

  const columns = [
    {
      title: 'Tên rạp',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <b>{text}</b>
    },
    {
      title: 'Slug',
      dataIndex: 'slug_name',
      key: 'slug_name',
      render: (slug) => <Tag>{slug}</Tag>
    },
    {
      title: 'Tỉnh / Thành phố',
      dataIndex: 'location',
      key: 'location'
    },
    {
      title: 'Slug tỉnh',
      dataIndex: 'slug_location',
      key: 'slug_location',
      render: (slug) => <Tag color="blue">{slug}</Tag>
    },
    {
      title: 'Chi tiết địa chỉ',
      dataIndex: 'locationDetails',
      key: 'locationDetails'
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
            onClick={() => message.info(`Xem: ${record.name}`)}
          >
            Xem
          </Button>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEditTheatre(record)}
          >
            Sửa
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteTheatre(record.id)}
          >
            Xoá
          </Button>
        </Space>
      )
    }
  ]

  return (
    <div style={{ padding: 24 }}>
      <h2>Quản lý Rạp Chiếu</h2>
      <Button
        type="primary"
        style={{ marginBottom: 16 }}
        onClick={() => setIsCreateModalVisible(true)}
      >
        + Thêm rạp
      </Button>

      <Table
        columns={columns}
        dataSource={theatres}
        rowKey="id"
        bordered
        pagination={{ pageSize: 10 }}
      />
      <TheatreEdit
        visible={isModalVisible}
        theatreData={editingTheatre}
        onCancel={() => setIsModalVisible(false)}
        onUpdate={handleUpdateTheatre}
      />
      <TheatreCreate
        visible={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        onCreate={handleCreateTheatre}
      />
    </div>
  )
}

export default AdminTheatre
