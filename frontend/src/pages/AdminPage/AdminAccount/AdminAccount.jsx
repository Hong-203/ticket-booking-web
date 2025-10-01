import React, { useEffect, useState } from 'react'
import { Table, Tag, Space, Button, message } from 'antd'
import { UserOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import UserEdit from './UserEdit' // Giả định UserEdit nằm trong cùng thư mục
import {
  deleteUser,
  getAllUser,
  updateUser
} from '../../../stores/Users/userApis' // Đường dẫn đến action Redux

const AdminAccount = () => {
  const dispatch = useDispatch()
  const usersList = useSelector((state) => state.user.usersList || [])
  const [users, setUsers] = useState([])
  const [editingUser, setEditingUser] = useState(null)
  const [isModalVisible, setIsModalVisible] = useState(false)

  useEffect(() => {
    dispatch(getAllUser())
  }, [dispatch])

  useEffect(() => {
    if (Array.isArray(usersList)) {
      setUsers(usersList)
    }
  }, [usersList])

  const handleDeleteUser = async (userId) => {
    try {
      await dispatch(deleteUser(userId)) // Bỏ comment khi có action deleteUsers
      message.success('Xoá người dùng thành công!')
      dispatch(getAllUser()) // Load lại danh sách sau khi xóa
    } catch (error) {
      message.error('Xoá thất bại!')
      console.error(error)
    }
  }

  const handleEditUser = (user) => {
    setEditingUser(user)
    setIsModalVisible(true)
  }

  const handleUpdateUser = async (updatedUser) => {
    const userId = updatedUser.id // Sử dụng 'id' thay vì 'user_id'
    const payload = { ...updatedUser }
    delete payload.id
    delete payload.created_at
    delete payload.updated_at
    delete payload.avatar_url
    delete payload.account_balance // Loại bỏ nếu trường này không được cập nhật từ form
    delete payload.is_active
    try {
      await dispatch(updateUser(userId, payload)) // Bỏ comment khi có action updateUser
      message.success('Cập nhật thành công!')
      setIsModalVisible(false)
      dispatch(getAllUser()) // Load lại danh sách sau khi cập nhật
    } catch (error) {
      message.error('Cập nhật thất bại!')
      console.error(error)
    }
  }

  const columns = [
    {
      title: 'Họ tên',
      dataIndex: 'full_name', // Đổi từ 'name' sang 'full_name'
      key: 'full_name',
      render: (text) => (
        <b>{text || <i style={{ color: '#999' }}>Chưa cập nhật</i>}</b>
      )
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (text) => text || <i style={{ color: '#999' }}>Chưa cập nhật</i>
    },
    {
      title: 'SĐT',
      dataIndex: 'phone_number', // Đổi từ 'phone' sang 'phone_number'
      key: 'phone_number',
      render: (text) => text || <i style={{ color: '#999' }}>Chưa cập nhật</i>
    },
    {
      title: 'Giới tính',
      dataIndex: 'gender',
      key: 'gender',
      render: (gender) =>
        gender || <i style={{ color: '#999' }}>Chưa cập nhật</i>
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'dob',
      key: 'dob',
      render: (dob) =>
        dob ? (
          moment(dob).format('DD/MM/YYYY') // Sử dụng moment để định dạng
        ) : (
          <i style={{ color: '#999' }}>Chưa cập nhật</i>
        )
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
      render: (text) => text || <i style={{ color: '#999' }}>Chưa cập nhật</i>
    },
    {
      title: 'Loại tài khoản', // Đổi từ 'Vai trò' sang 'Loại tài khoản'
      dataIndex: 'account_type', // Đổi từ 'role' sang 'account_type'
      key: 'account_type',
      render: (accountType) =>
        accountType === 'admin' ? (
          <Tag color="red">Admin</Tag>
        ) : (
          <Tag color="blue">Khách hàng</Tag> // Thêm nhãn cho khách hàng
        )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (isActive) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'Hoạt động' : 'Không hoạt động'}
        </Tag>
      )
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (createdAt) =>
        createdAt ? moment(createdAt).format('DD/MM/YYYY HH:mm') : ''
    },
    {
      title: 'Cập nhật cuối',
      dataIndex: 'updated_at',
      key: 'updated_at',
      render: (updatedAt) =>
        updatedAt ? moment(updatedAt).format('DD/MM/YYYY HH:mm') : ''
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            icon={<UserOutlined />}
            size="small"
            onClick={() => message.info(`Chi tiết: ${record.full_name}`)}
          >
            Xem
          </Button>
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEditUser(record)}
          >
            Sửa
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            size="small"
            onClick={() => handleDeleteUser(record.id)}
          >
            Xoá
          </Button>
        </Space>
      )
    }
  ]

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 16 }}>Quản lý người dùng</h2>
      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        bordered
      />

      <UserEdit
        visible={isModalVisible}
        userData={editingUser}
        onCancel={() => setIsModalVisible(false)}
        onUpdate={handleUpdateUser}
      />
    </div>
  )
}

export default AdminAccount
