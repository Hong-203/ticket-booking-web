import React, { useEffect, useRef, useState } from "react";
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
  message,
} from "antd";
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
  WomanOutlined,
} from "@ant-design/icons";
const { RangePicker } = DatePicker;
import "./Profile.css";
import { useDispatch, useSelector } from "react-redux";
import {
  getUserProfile,
  updateAvatar,
  updateUser,
} from "../../stores/Users/userApis";
import ChangePasswordModal from "../../components/Profile/ChangePasswordModal";
import { toast } from "react-toastify";
import { getMyTicket } from "../../stores/Ticket/ticketApis";
import TicketList from "../../components/Profile/TicketListProfile";
import { getMyPayments } from "../../stores/Payment/paymentApis";
import MyPaymentList from "../../components/Paymemts/MyPaymentList";

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const ProfilePage = () => {
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const profile = useSelector((state) => state.user.profile || {});
  const myTickets = useSelector((state) => state.ticket.myTickets || []);
  const myPayments = useSelector((state) => state.payment.myPayments || []);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  useEffect(() => {
    dispatch(getUserProfile());
    dispatch(getMyTicket());
    dispatch(getMyPayments());
  }, [dispatch]);

  const statisticsData = {
    totalSpent: myTickets.totalSpent,
    ordersCount: myTickets.totalTickets,
    ticketsBooked: myTickets.totalTickets,
    favoriteProducts: 15,
  };

  const [status, setStatus] = useState("");
  const [method, setMethod] = useState("");
  const [email, setEmail] = useState("");
  const [dateRange, setDateRange] = useState([]);

  const handleFilter = () => {
    const filter = {
      status: status || undefined,
      method: method || undefined,
      email: email || undefined,
      startDate: dateRange[0]?.format("YYYY-MM-DD"),
      endDate: dateRange[1]?.format("YYYY-MM-DD"),
    };
    dispatch(getMyPayments(filter));
  };
  console.log("myTickets", myTickets);
  const listMyBooked = myTickets.tickets;
  const handleEditProfile = () => {
    setEditFormData({
      full_name: profile.full_name,
      email: profile.email || "",
      phone_number: profile.phone_number,
      gender: profile.gender,
      address: profile.address || "",
    });
    setEditModalVisible(true);
  };
  const handleSaveProfile = async () => {
    await dispatch(updateUser(profile.id, editFormData));
    toast.success("Cập nhật thông tin thành công!");
    setEditModalVisible(false);
  };

  const handleInputChange = (field, value) => {
    setEditFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      toast.error("Ảnh quá lớn, vui lòng chọn ảnh dưới 3MB!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    const res = await dispatch(updateAvatar(formData));
    setLoading(false);

    if (res?.success) {
      toast.success("Cập nhật ảnh đại diện thành công!");
      dispatch(getUserProfile());
    } else {
      toast.error(res?.message || "Cập nhật thất bại!");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        padding: "24px",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <Card
          style={{
            marginBottom: "24px",
            borderRadius: "16px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
          }}
        >
          <Row gutter={24} align="middle">
            <Col
              xs={24}
              sm={6}
              style={{ textAlign: "center", marginBottom: "16px" }}
            >
              <div style={{ position: "relative", display: "inline-block" }}>
                <Avatar
                  size={120}
                  src={profile?.avatar_url}
                  icon={<UserOutlined />}
                  style={{
                    border: "4px solid rgba(255,255,255,0.3)",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
                    opacity: loading ? 0.5 : 1,
                    transition: "opacity 0.3s ease",
                  }}
                />
                <Button
                  icon={<CameraOutlined />}
                  size="small"
                  shape="circle"
                  onClick={handleClickUpload}
                  loading={loading}
                  style={{
                    position: "absolute",
                    bottom: "0",
                    right: "0",
                    background: "#1890ff",
                    border: "none",
                    color: "white",
                  }}
                />
                {/* input file ẩn */}
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
              </div>
            </Col>
            <Col xs={24} sm={18}>
              <div>
                <div style={{ marginBottom: "16px" }}>
                  <Title
                    level={2}
                    style={{
                      color: "white",
                      margin: 0,
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    {profile.full_name}
                    {profile.gender &&
                      (profile.gender === "male" ? (
                        <ManOutlined style={{ color: "#87CEEB" }} />
                      ) : (
                        <WomanOutlined style={{ color: "#FFB6C1" }} />
                      ))}
                  </Title>
                  <Tag
                    color={profile.account_type === "admin" ? "red" : "blue"}
                    style={{ marginTop: "8px" }}
                  >
                    {profile.account_type === "admin"
                      ? "Quản trị viên"
                      : "Người dùng"}
                  </Tag>
                </div>

                <Space
                  direction="vertical"
                  size="small"
                  style={{ marginBottom: "16px" }}
                >
                  {profile.phone_number && (
                    <Text style={{ color: "rgba(255,255,255,0.9)" }}>
                      <PhoneOutlined /> {profile.phone_number}
                    </Text>
                  )}
                  {profile.email && (
                    <Text style={{ color: "rgba(255,255,255,0.9)" }}>
                      <MailOutlined /> {profile.email}
                    </Text>
                  )}
                  {profile.address && (
                    <Text style={{ color: "rgba(255,255,255,0.9)" }}>
                      <EnvironmentOutlined /> {profile.address}
                    </Text>
                  )}
                  {profile.dob && (
                    <Text style={{ color: "rgba(255,255,255,0.9)" }}>
                      <CalendarOutlined />{" "}
                      {new Date(profile.dob).toLocaleDateString("vi-VN")}
                    </Text>
                  )}
                </Space>
                <Space
                  className="edit-btn-profile"
                  direction="horizontal"
                  size="middle"
                  style={{
                    display: "flex",
                    justifyContent: "flex-end", // hoặc 'center'
                    width: "100%",
                  }}
                >
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={handleEditProfile}
                    style={{
                      background: "rgba(255,255,255,0.2)",
                      border: "1px solid rgba(255,255,255,0.3)",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    Chỉnh sửa thông tin
                  </Button>
                  <ChangePasswordModal />
                </Space>
              </div>
            </Col>
          </Row>
        </Card>

        <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
          <Col xs={12} sm={6}>
            <Card
              style={{
                borderRadius: "12px",
                background: "linear-gradient(135deg, #1890ff, #36cfc9)",
                color: "white",
                textAlign: "center",
              }}
            >
              <Statistic
                title={
                  <span style={{ color: "rgba(255,255,255,0.9)" }}>
                    Số dư tài khoản
                  </span>
                }
                value={profile.account_balance}
                prefix={<WalletOutlined />}
                suffix="₫"
                valueStyle={{ color: "white", fontSize: "20px" }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card
              style={{
                borderRadius: "12px",
                background: "linear-gradient(135deg, #52c41a, #73d13d)",
                color: "white",
                textAlign: "center",
              }}
            >
              <Statistic
                title={
                  <span style={{ color: "rgba(255,255,255,0.9)" }}>
                    Tổng chi tiêu
                  </span>
                }
                value={statisticsData.totalSpent}
                prefix={<ShoppingCartOutlined />}
                suffix="₫"
                valueStyle={{ color: "white", fontSize: "20px" }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card
              style={{
                borderRadius: "12px",
                background: "linear-gradient(135deg, #722ed1, #b37feb)",
                color: "white",
                textAlign: "center",
              }}
            >
              <Statistic
                title={
                  <span style={{ color: "rgba(255,255,255,0.9)" }}>
                    Đơn hàng đã mua
                  </span>
                }
                value={statisticsData.ordersCount}
                prefix={<ShoppingCartOutlined />}
                valueStyle={{ color: "white", fontSize: "20px" }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card
              style={{
                borderRadius: "12px",
                background: "linear-gradient(135deg, #fa8c16, #ffc53d)",
                color: "white",
                textAlign: "center",
              }}
            >
              <Statistic
                title={
                  <span style={{ color: "rgba(255,255,255,0.9)" }}>
                    Vé đã đặt
                  </span>
                }
                value={statisticsData.ticketsBooked}
                prefix={<CalendarOutlined />}
                valueStyle={{ color: "white", fontSize: "20px" }}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card
              title={
                <span style={{ color: "#1890ff" }}>
                  <ShoppingCartOutlined /> Lịch sử thanh toán
                </span>
              }
              style={{
                borderRadius: "12px",
                height: "400px",
                overflow: "hidden",
              }}
            >
              <div style={{ marginBottom: 12 }}>
                <Row gutter={[8, 8]}>
                  <Col span={8}>
                    <Select
                      placeholder="Status"
                      value={status}
                      onChange={setStatus}
                      style={{ width: "100%", fontSize: 12 }}
                      allowClear
                    >
                      <Select.Option value="pending">Pending</Select.Option>
                      <Select.Option value="completed">Completed</Select.Option>
                    </Select>
                  </Col>

                  <Col span={8}>
                    <Select
                      placeholder="Method"
                      value={method}
                      onChange={setMethod}
                      style={{ width: "100%", fontSize: 12 }}
                      allowClear
                    >
                      <Select.Option value="momo">MoMo</Select.Option>
                      <Select.Option value="zalopay">ZaloPay</Select.Option>
                    </Select>
                  </Col>

                  <Col span={8}>
                    <Input
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{ width: "100%", fontSize: 12 }}
                    />
                  </Col>
                </Row>

                <Row gutter={[8, 8]} style={{ marginTop: 8 }}>
                  <Col span={20}>
                    <RangePicker
                      onChange={(dates) => setDateRange(dates)}
                      format="YYYY-MM-DD"
                      size="small"
                      style={{ width: "100%", fontSize: 12 }}
                    />
                  </Col>

                  <Col span={4}>
                    <Button
                      type="primary"
                      size="small"
                      onClick={handleFilter}
                      style={{ width: "100%" }}
                    >
                      Lọc
                    </Button>
                  </Col>
                </Row>
              </div>
              <div style={{ height: "320px", overflowY: "auto" }}>
                <MyPaymentList myPayments={myPayments} />
              </div>
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card
              title={
                <span style={{ color: "#fa8c16" }}>
                  <CalendarOutlined /> Vé đã đặt
                </span>
              }
              style={{
                borderRadius: "12px",
                height: "400px",
                overflow: "hidden",
              }}
            >
              <div style={{ height: "320px", overflowY: "auto" }}>
                <TicketList bookedTickets={listMyBooked} />
              </div>
            </Card>
          </Col>
        </Row>
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
            </Button>,
          ]}
          width={600}
        >
          <div style={{ padding: "16px 0" }}>
            <Row gutter={16}>
              <Col span={12}>
                <div style={{ marginBottom: "16px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "4px",
                      fontWeight: "bold",
                    }}
                  >
                    Họ và tên *
                  </label>
                  <Input
                    value={editFormData.full_name || ""}
                    onChange={(e) =>
                      handleInputChange("full_name", e.target.value)
                    }
                    placeholder="Nhập họ và tên"
                  />
                </div>
              </Col>
              <Col span={12}>
                <div style={{ marginBottom: "16px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "4px",
                      fontWeight: "bold",
                    }}
                  >
                    Số điện thoại *
                  </label>
                  <Input
                    value={editFormData.phone_number || ""}
                    onChange={(e) =>
                      handleInputChange("phone_number", e.target.value)
                    }
                    placeholder="Nhập số điện thoại"
                  />
                </div>
              </Col>
            </Row>

            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "4px",
                  fontWeight: "bold",
                }}
              >
                Email
              </label>
              <Input
                value={editFormData.email || ""}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Nhập email"
                type="email"
              />
            </div>

            <Row gutter={16}>
              <Col span={12}>
                <div style={{ marginBottom: "16px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "4px",
                      fontWeight: "bold",
                    }}
                  >
                    Giới tính
                  </label>
                  <Select
                    value={editFormData.gender}
                    onChange={(value) => handleInputChange("gender", value)}
                    style={{ width: "100%" }}
                    placeholder="Chọn giới tính"
                  >
                    <Option value="male">Nam</Option>
                    <Option value="female">Nữ</Option>
                    <Option value="other">Khác</Option>
                  </Select>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ marginBottom: "16px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "4px",
                      fontWeight: "bold",
                    }}
                  >
                    Ngày sinh
                  </label>
                  <DatePicker
                    style={{ width: "100%" }}
                    placeholder="Chọn ngày sinh"
                    onChange={(date) => handleInputChange("dob", date)}
                  />
                </div>
              </Col>
            </Row>

            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "4px",
                  fontWeight: "bold",
                }}
              >
                Địa chỉ
              </label>
              <TextArea
                value={editFormData.address || ""}
                onChange={(e) => handleInputChange("address", e.target.value)}
                rows={3}
                placeholder="Nhập địa chỉ"
              />
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default ProfilePage;
