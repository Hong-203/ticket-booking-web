import React, { useEffect, useState } from 'react'
import { Table, Tag, Space, Button, message, Image } from 'antd'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import {
  createFeature,
  deleteFeature,
  getAllFeature,
  updateFeature
} from '../../../stores/Feature/featureApis'
import FeatureCreate from './FeatureCreate'
import FeatureUpdate from './FeatureUpdate'

const AdminFeature = () => {
  const dispatch = useDispatch()
  const featureList = useSelector((state) => state.feature.featureList || [])
  const [features, setFeatures] = useState([])
  const [editingFeature, setEditingFeature] = useState(null)
  const [isEditVisible, setIsEditVisible] = useState(false)
  const [isCreateVisible, setIsCreateVisible] = useState(false)

  useEffect(() => {
    dispatch(getAllFeature())
  }, [dispatch])

  useEffect(() => {
    if (Array.isArray(featureList)) {
      setFeatures(featureList)
    }
  }, [featureList])

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteFeature(id))
      message.success('Xoá tính năng thành công!')
      dispatch(getAllFeature())
    } catch (error) {
      message.error('Xoá thất bại!')
    }
  }

  const handleEdit = (record) => {
    setEditingFeature(record)
    setIsEditVisible(true)
  }

  const handleUpdate = async (updated) => {
    const { id, theatre, ...payload } = updated
    payload.theatreId = theatre?.id || updated.theatreId
    try {
      await dispatch(updateFeature(id, payload))
      message.success('Cập nhật thành công!')
      setIsEditVisible(false)
      dispatch(getAllFeature())
    } catch (error) {
      message.error('Cập nhật thất bại!')
    }
  }

  const handleCreate = async (payload) => {
    try {
      await dispatch(createFeature(payload))
      message.success('Tạo tính năng thành công!')
      setIsCreateVisible(false)
      dispatch(getAllFeature())
    } catch (error) {
      message.error('Tạo thất bại!')
    }
  }

  const columns = [
    {
      title: 'Tên tính năng',
      dataIndex: 'title',
      key: 'title'
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description'
    },
    {
      title: 'Ảnh',
      dataIndex: 'imagePath',
      key: 'imagePath',
      render: (src) => (
        <Image
          width={80}
          src={src}
          alt="feature-img"
          style={{ objectFit: 'contain' }}
        />
      )
    },
    {
      title: 'Rạp',
      dataIndex: ['theatre', 'name'],
      key: 'theatre'
    },
    {
      title: 'Tỉnh / Thành phố',
      dataIndex: ['theatre', 'location'],
      key: 'location',
      render: (location, record) => <Tag color="blue">{location}</Tag>
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            Sửa
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            Xoá
          </Button>
        </Space>
      )
    }
  ]

  return (
    <div style={{ padding: 24 }}>
      <h2>Quản lý Tính Năng Rạp Chiếu</h2>
      <Button
        type="primary"
        onClick={() => setIsCreateVisible(true)}
        style={{ marginBottom: 16 }}
      >
        + Thêm tính năng
      </Button>

      <Table
        columns={columns}
        dataSource={features}
        rowKey="id"
        bordered
        pagination={{ pageSize: 10 }}
      />

      <FeatureUpdate
        visible={isEditVisible}
        onCancel={() => setIsEditVisible(false)}
        onUpdate={handleUpdate}
        initialValues={editingFeature}
      />

      <FeatureCreate
        visible={isCreateVisible}
        onCancel={() => setIsCreateVisible(false)}
        onCreate={handleCreate}
      />
    </div>
  )
}

export default AdminFeature
