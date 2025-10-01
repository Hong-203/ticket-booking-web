import React, { useEffect, useState } from 'react'
import {
  Card,
  Avatar,
  Row,
  Col,
  Typography,
  Button,
  Tag,
  Statistic,
  List,
  Badge,
  Space,
  Modal,
  Input,
  Select,
  DatePicker,
  message
} from 'antd'
import {
  UserOutlined,
  EditOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  WalletOutlined,
  ShoppingCartOutlined,
  CameraOutlined,
  ManOutlined,
  WomanOutlined
} from '@ant-design/icons'
import './Profile.css'
import { useDispatch, useSelector } from 'react-redux'
import { getUserProfile, updateUser } from '../../stores/Users/userApis'

const { Title, Text } = Typography
const { Option } = Select
const { TextArea } = Input

const ProfilePage = () => {
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [editFormData, setEditFormData] = useState({})
  const profile = useSelector((state) => state.user.profile || {})
  const dispatch = useDispatch()
  // const navigate = useNavigate()

  useEffect(() => {
    dispatch(getUserProfile())
  }, [dispatch])

  // Mock statistics data
  const statisticsData = {
    totalSpent: 15650000,
    ordersCount: 24,
    ticketsBooked: 8,
    favoriteProducts: 15
  }

  // Mock recent orders
  const recentOrders = [
    {
      id: 1,
      name: 'Vitamin C 1000mg',
      date: '2025-05-28',
      amount: 350000,
      status: 'completed'
    },
    {
      id: 2,
      name: 'Paracetamol 500mg',
      date: '2025-05-25',
      amount: 25000,
      status: 'completed'
    },
    {
      id: 3,
      name: 'Glucosamine 1500mg',
      date: '2025-05-20',
      amount: 480000,
      status: 'processing'
    },
    {
      id: 4,
      name: 'Omega-3 Fish Oil',
      date: '2025-05-15',
      amount: 720000,
      status: 'completed'
    }
  ]

  // Mock booked tickets
  const bookedTickets = [
    {
      id: 1,
      event: 'Hội thảo sức khỏe 2025',
      date: '2025-06-15',
      location: 'Hà Nội',
      status: 'confirmed'
    },
    {
      id: 2,
      event: 'Triển lãm y tế quốc tế',
      date: '2025-07-20',
      location: 'TP.HCM',
      status: 'confirmed'
    },
    {
      id: 3,
      event: 'Seminar dinh dưỡng',
      date: '2025-08-10',
      location: 'Đà Nẵng',
      status: 'pending'
    }
  ]

  const handleEditProfile = () => {
    setEditFormData({
      full_name: profile.full_name,
      email: profile.email || '',
      phone_number: profile.phone_number,
      gender: profile.gender,
      address: profile.address || ''
    })
    setEditModalVisible(true)
  }

  const handleSaveProfile = async () => {
    await dispatch(updateUser(profile.id, editFormData))
    message.success('Cập nhật thông tin thành công!')
    setEditModalVisible(false)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'green'
      case 'processing':
        return 'blue'
      case 'confirmed':
        return 'green'
      case 'pending':
        return 'orange'
      default:
        return 'default'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Đã hoàn thành'
      case 'processing':
        return 'Đang xử lý'
      case 'confirmed':
        return 'Đã xác nhận'
      case 'pending':
        return 'Chờ xác nhận'
      default:
        return status
    }
  }

  const handleInputChange = (field, value) => {
    setEditFormData((prev) => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        padding: '24px'
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Profile Header */}
        <Card
          style={{
            marginBottom: '24px',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          }}
        >
          <Row gutter={24} align="middle">
            <Col
              xs={24}
              sm={6}
              style={{ textAlign: 'center', marginBottom: '16px' }}
            >
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <Avatar
                  size={120}
                  src={profile.avatar_url}
                  icon={<UserOutlined />}
                  style={{
                    border: '4px solid rgba(255,255,255,0.3)',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.2)'
                  }}
                />
                <Button
                  icon={<CameraOutlined />}
                  size="small"
                  shape="circle"
                  style={{
                    position: 'absolute',
                    bottom: '0',
                    right: '0',
                    background: '#1890ff',
                    border: 'none',
                    color: 'white'
                  }}
                />
              </div>
            </Col>
            <Col xs={24} sm={18}>
              <div>
                <div style={{ marginBottom: '16px' }}>
                  <Title
                    level={2}
                    style={{
                      color: 'white',
                      margin: 0,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    {profile.full_name}
                    {profile.gender &&
                      (profile.gender === 'male' ? (
                        <ManOutlined style={{ color: '#87CEEB' }} />
                      ) : (
                        <WomanOutlined style={{ color: '#FFB6C1' }} />
                      ))}
                  </Title>
                  <Tag
                    color={profile.account_type === 'admin' ? 'red' : 'blue'}
                    style={{ marginTop: '8px' }}
                  >
                    {profile.account_type === 'admin'
                      ? 'Quản trị viên'
                      : 'Người dùng'}
                  </Tag>
                </div>

                <Space
                  direction="vertical"
                  size="small"
                  style={{ marginBottom: '16px' }}
                >
                  {profile.phone_number && (
                    <Text style={{ color: 'rgba(255,255,255,0.9)' }}>
                      <PhoneOutlined /> {profile.phone_number}
                    </Text>
                  )}
                  {profile.email && (
                    <Text style={{ color: 'rgba(255,255,255,0.9)' }}>
                      <MailOutlined /> {profile.email}
                    </Text>
                  )}
                  {profile.address && (
                    <Text style={{ color: 'rgba(255,255,255,0.9)' }}>
                      <EnvironmentOutlined /> {profile.address}
                    </Text>
                  )}
                  {profile.dob && (
                    <Text style={{ color: 'rgba(255,255,255,0.9)' }}>
                      <CalendarOutlined />{' '}
                      {new Date(profile.dob).toLocaleDateString('vi-VN')}
                    </Text>
                  )}
                </Space>
                <Space className="edit-btn-profile">
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={handleEditProfile}
                    style={{
                      background: 'rgba(255,255,255,0.2)',
                      border: '1px solid rgba(255,255,255,0.3)',
                      backdropFilter: 'blur(10px)'
                    }}
                  >
                    Chỉnh sửa thông tin
                  </Button>
                </Space>
              </div>
            </Col>
          </Row>
        </Card>

        {/* Statistics Section */}
        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col xs={12} sm={6}>
            <Card
              style={{
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #1890ff, #36cfc9)',
                color: 'white',
                textAlign: 'center'
              }}
            >
              <Statistic
                title={
                  <span style={{ color: 'rgba(255,255,255,0.9)' }}>
                    Số dư tài khoản
                  </span>
                }
                value={profile.account_balance}
                prefix={<WalletOutlined />}
                suffix="₫"
                valueStyle={{ color: 'white', fontSize: '20px' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card
              style={{
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #52c41a, #73d13d)',
                color: 'white',
                textAlign: 'center'
              }}
            >
              <Statistic
                title={
                  <span style={{ color: 'rgba(255,255,255,0.9)' }}>
                    Tổng chi tiêu
                  </span>
                }
                value={statisticsData.totalSpent}
                prefix={<ShoppingCartOutlined />}
                suffix="₫"
                valueStyle={{ color: 'white', fontSize: '20px' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card
              style={{
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #722ed1, #b37feb)',
                color: 'white',
                textAlign: 'center'
              }}
            >
              <Statistic
                title={
                  <span style={{ color: 'rgba(255,255,255,0.9)' }}>
                    Đơn hàng đã mua
                  </span>
                }
                value={statisticsData.ordersCount}
                prefix={<ShoppingCartOutlined />}
                valueStyle={{ color: 'white', fontSize: '20px' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card
              style={{
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #fa8c16, #ffc53d)',
                color: 'white',
                textAlign: 'center'
              }}
            >
              <Statistic
                title={
                  <span style={{ color: 'rgba(255,255,255,0.9)' }}>
                    Vé đã đặt
                  </span>
                }
                value={statisticsData.ticketsBooked}
                prefix={<CalendarOutlined />}
                valueStyle={{ color: 'white', fontSize: '20px' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Recent Activities */}
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card
              title={
                <span style={{ color: '#1890ff' }}>
                  <ShoppingCartOutlined /> Đơn hàng gần đây
                </span>
              }
              style={{
                borderRadius: '12px',
                height: '400px',
                overflow: 'hidden'
              }}
            >
              <div style={{ height: '320px', overflowY: 'auto' }}>
                <List
                  dataSource={recentOrders}
                  renderItem={(item) => (
                    <List.Item
                      style={{
                        padding: '12px 0',
                        borderBottom: '1px solid #f0f0f0'
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          width: '100%'
                        }}
                      >
                        <div>
                          <Text strong>{item.name}</Text>
                          <br />
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            {new Date(item.date).toLocaleDateString('vi-VN')}
                          </Text>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <Text
                            style={{ color: '#52c41a', fontWeight: 'bold' }}
                          >
                            {item.amount.toLocaleString()}₫
                          </Text>
                          <br />
                          <Tag
                            color={getStatusColor(item.status)}
                            style={{ marginTop: '4px' }}
                          >
                            {getStatusText(item.status)}
                          </Tag>
                        </div>
                      </div>
                    </List.Item>
                  )}
                />
              </div>
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card
              title={
                <span style={{ color: '#fa8c16' }}>
                  <CalendarOutlined /> Vé đã đặt
                </span>
              }
              style={{
                borderRadius: '12px',
                height: '400px',
                overflow: 'hidden'
              }}
            >
              <div style={{ height: '320px', overflowY: 'auto' }}>
                <List
                  dataSource={bookedTickets}
                  renderItem={(item) => (
                    <List.Item
                      style={{
                        padding: '12px 0',
                        borderBottom: '1px solid #f0f0f0'
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          width: '100%'
                        }}
                      >
                        <div>
                          <Text strong>{item.event}</Text>
                          <br />
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            {new Date(item.date).toLocaleDateString('vi-VN')} •{' '}
                            {item.location}
                          </Text>
                        </div>
                        <Badge
                          status={
                            item.status === 'confirmed'
                              ? 'success'
                              : 'processing'
                          }
                          text={getStatusText(item.status)}
                        />
                      </div>
                    </List.Item>
                  )}
                />
              </div>
            </Card>
          </Col>
        </Row>

        {/* Edit Profile Modal */}
        <Modal
          title="Chỉnh sửa thông tin cá nhân"
          open={editModalVisible}
          onCancel={() => setEditModalVisible(false)}
          footer={[
            <Button key="cancel" onClick={() => setEditModalVisible(false)}>
              Hủy
            </Button>,
            <Button key="save" type="primary" onClick={handleSaveProfile}>
              Lưu thay đổi
            </Button>
          ]}
          width={600}
        >
          <div style={{ padding: '16px 0' }}>
            <Row gutter={16}>
              <Col span={12}>
                <div style={{ marginBottom: '16px' }}>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '4px',
                      fontWeight: 'bold'
                    }}
                  >
                    Họ và tên *
                  </label>
                  <Input
                    value={editFormData.full_name || ''}
                    onChange={(e) =>
                      handleInputChange('full_name', e.target.value)
                    }
                    placeholder="Nhập họ và tên"
                  />
                </div>
              </Col>
              <Col span={12}>
                <div style={{ marginBottom: '16px' }}>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '4px',
                      fontWeight: 'bold'
                    }}
                  >
                    Số điện thoại *
                  </label>
                  <Input
                    value={editFormData.phone_number || ''}
                    onChange={(e) =>
                      handleInputChange('phone_number', e.target.value)
                    }
                    placeholder="Nhập số điện thoại"
                  />
                </div>
              </Col>
            </Row>

            <div style={{ marginBottom: '16px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '4px',
                  fontWeight: 'bold'
                }}
              >
                Email
              </label>
              <Input
                value={editFormData.email || ''}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Nhập email"
                type="email"
              />
            </div>

            <Row gutter={16}>
              <Col span={12}>
                <div style={{ marginBottom: '16px' }}>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '4px',
                      fontWeight: 'bold'
                    }}
                  >
                    Giới tính
                  </label>
                  <Select
                    value={editFormData.gender}
                    onChange={(value) => handleInputChange('gender', value)}
                    style={{ width: '100%' }}
                    placeholder="Chọn giới tính"
                  >
                    <Option value="male">Nam</Option>
                    <Option value="female">Nữ</Option>
                    <Option value="other">Khác</Option>
                  </Select>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ marginBottom: '16px' }}>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '4px',
                      fontWeight: 'bold'
                    }}
                  >
                    Ngày sinh
                  </label>
                  <DatePicker
                    style={{ width: '100%' }}
                    placeholder="Chọn ngày sinh"
                    onChange={(date) => handleInputChange('dob', date)}
                  />
                </div>
              </Col>
            </Row>

            <div style={{ marginBottom: '16px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '4px',
                  fontWeight: 'bold'
                }}
              >
                Địa chỉ
              </label>
              <TextArea
                value={editFormData.address || ''}
                onChange={(e) => handleInputChange('address', e.target.value)}
                rows={3}
                placeholder="Nhập địa chỉ"
              />
            </div>
          </div>
        </Modal>
      </div>
    </div>
  )
}

export default ProfilePage
