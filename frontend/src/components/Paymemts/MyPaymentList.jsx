import { useState } from "react";
import {
  List,
  Tag,
  Typography,
  Modal,
  Button,
  Divider,
  Row,
  Col,
  Card,
  Space,
} from "antd";
import {
  DollarOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  CreditCardOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";

const { Text, Title } = Typography;

const getStatusColor = (status) =>
  status === "completed" ? "green" : "orange";
const getStatusText = (status) =>
  status.charAt(0).toUpperCase() + status.slice(1);

export default function MyPaymentList({ myPayments }) {
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = (payment) => {
    setSelectedPayment(payment);
    setIsModalVisible(true);
  };

  const handleClose = () => {
    setSelectedPayment(null);
    setIsModalVisible(false);
  };

  const InfoRow = ({ icon, label, value, valueColor }) => (
    <Row style={{ marginBottom: 12 }}>
      <Col span={8}>
        <Text type="secondary">
          {icon} {label}:
        </Text>
      </Col>
      <Col span={16}>
        <Text strong style={{ color: valueColor }}>
          {value}
        </Text>
      </Col>
    </Row>
  );

  return (
    <>
      <div style={{ height: "320px", overflowY: "auto" }}>
        <List
          dataSource={myPayments}
          renderItem={(item) => (
            <List.Item
              style={{ padding: "12px 0", borderBottom: "1px solid #f0f0f0" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  cursor: "pointer",
                }}
                onClick={() => showModal(item)}
              >
                <div>
                  <Text strong>{item.payment_code}</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: "12px" }}>
                    {new Date(item.created_at).toLocaleDateString("vi-VN")}
                  </Text>
                </div>
                <div>
                  <Text strong>{item.method}</Text>
                </div>
                <div style={{ textAlign: "right" }}>
                  <Text style={{ color: "#52c41a", fontWeight: "bold" }}>
                    {Number(item.amount).toLocaleString()}₫
                  </Text>
                  <br />
                  <Tag color={getStatusColor(item.status)}>
                    {getStatusText(item.status)}
                  </Tag>
                </div>
              </div>
            </List.Item>
          )}
        />
      </div>

      <Modal
        title={null}
        open={isModalVisible}
        onCancel={handleClose}
        footer={null}
        width={800}
        centered
        bodyStyle={{ padding: 0 }}
      >
        {selectedPayment && (
          <>
            {/* Header */}
            <div
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                padding: "24px",
                borderRadius: "8px 8px 0 0",
              }}
            >
              <Row justify="space-between" align="middle">
                <Col>
                  <Title level={4} style={{ color: "white", margin: 0 }}>
                    <CreditCardOutlined /> {selectedPayment.payment_code}
                  </Title>
                  <Text style={{ color: "rgba(255,255,255,0.9)" }}>
                    Chi tiết thanh toán
                  </Text>
                </Col>
                <Col>
                  <div style={{ textAlign: "right" }}>
                    <Title level={3} style={{ color: "white", margin: 0 }}>
                      {Number(selectedPayment.amount).toLocaleString()}₫
                    </Title>
                    <Tag
                      color={getStatusColor(selectedPayment.status)}
                      style={{ marginTop: 8 }}
                    >
                      {getStatusText(selectedPayment.status)}
                    </Tag>
                  </div>
                </Col>
              </Row>
            </div>

            {/* Body */}
            <div style={{ padding: "24px" }}>
              {/* Thông tin thanh toán */}
              <Card
                title={
                  <span>
                    <InfoCircleOutlined /> Thông tin thanh toán
                  </span>
                }
                size="small"
                style={{ marginBottom: 16 }}
              >
                <InfoRow
                  icon={<CreditCardOutlined />}
                  label="Phương thức"
                  value={selectedPayment.method}
                />
                <InfoRow
                  icon={<DollarOutlined />}
                  label="Số tiền"
                  value={`${Number(selectedPayment.amount).toLocaleString()}₫`}
                  valueColor="#52c41a"
                />
                <InfoRow
                  icon={<InfoCircleOutlined />}
                  label="Ghi chú"
                  value={selectedPayment.note || "Không có"}
                />
                <Row style={{ marginBottom: 0 }}>
                  <Col span={12}>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      <CalendarOutlined /> Tạo lúc:{" "}
                      {new Date(selectedPayment.created_at).toLocaleString(
                        "vi-VN"
                      )}
                    </Text>
                  </Col>
                  <Col span={12} style={{ textAlign: "right" }}>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      Cập nhật:{" "}
                      {new Date(selectedPayment.updated_at).toLocaleString(
                        "vi-VN"
                      )}
                    </Text>
                  </Col>
                </Row>
              </Card>

              <Row gutter={16}>
                {/* Thông tin người dùng */}
                <Col span={12}>
                  <Card
                    title={
                      <span>
                        <UserOutlined /> Thông tin khách hàng
                      </span>
                    }
                    size="small"
                    style={{ height: "100%" }}
                  >
                    <Space
                      direction="vertical"
                      size="small"
                      style={{ width: "100%" }}
                    >
                      <div>
                        <Text type="secondary">Họ tên:</Text>
                        <br />
                        <Text strong>{selectedPayment.user.full_name}</Text>
                      </div>
                      <div>
                        <Text type="secondary">
                          <MailOutlined /> Email:
                        </Text>
                        <br />
                        <Text>{selectedPayment.user.email}</Text>
                      </div>
                      <div>
                        <Text type="secondary">
                          <PhoneOutlined /> SĐT:
                        </Text>
                        <br />
                        <Text>{selectedPayment.user.phone_number}</Text>
                      </div>
                      <div>
                        <Text type="secondary">
                          <EnvironmentOutlined /> Địa chỉ:
                        </Text>
                        <br />
                        <Text>{selectedPayment.user.address}</Text>
                      </div>
                      <div>
                        <Tag
                          color={
                            selectedPayment.user.is_active ? "green" : "red"
                          }
                        >
                          {selectedPayment.user.is_active ? (
                            <>
                              <CheckCircleOutlined /> Active
                            </>
                          ) : (
                            "Inactive"
                          )}
                        </Tag>
                        <Tag color="blue">
                          {selectedPayment.user.account_type}
                        </Tag>
                      </div>
                    </Space>
                  </Card>
                </Col>

                {/* Thông tin vé */}
                <Col span={12}>
                  <Card
                    title={
                      <span>
                        <CalendarOutlined /> Thông tin vé
                      </span>
                    }
                    size="small"
                    style={{ height: "100%" }}
                  >
                    <Space
                      direction="vertical"
                      size="small"
                      style={{ width: "100%" }}
                    >
                      <div>
                        <Text type="secondary">Mã vé:</Text>
                        <br />
                        <Text code>
                          {selectedPayment.ticket.id.substring(0, 20)}...
                        </Text>
                      </div>
                      <Divider style={{ margin: "12px 0" }} />
                      <Row justify="space-between">
                        <Text type="secondary">Tiền ghế:</Text>
                        <Text strong>
                          {Number(
                            selectedPayment.ticket.seat_total_price
                          ).toLocaleString()}
                          ₫
                        </Text>
                      </Row>
                      <Row justify="space-between">
                        <Text type="secondary">Tiền đồ ăn:</Text>
                        <Text strong>
                          {Number(
                            selectedPayment.ticket.concession_total_price
                          ).toLocaleString()}
                          ₫
                        </Text>
                      </Row>
                      <Divider style={{ margin: "12px 0" }} />
                      <Row justify="space-between">
                        <Text strong>Tổng tiền:</Text>
                        <Text strong style={{ color: "#52c41a", fontSize: 16 }}>
                          {Number(
                            selectedPayment.ticket.total_price
                          ).toLocaleString()}
                          ₫
                        </Text>
                      </Row>
                      <div style={{ marginTop: 8 }}>
                        <Tag color="purple">
                          {selectedPayment.ticket.status}
                        </Tag>
                      </div>
                      <Text type="secondary" style={{ fontSize: 11 }}>
                        Tạo:{" "}
                        {new Date(
                          selectedPayment.ticket.created_at
                        ).toLocaleString("vi-VN")}
                      </Text>
                    </Space>
                  </Card>
                </Col>
              </Row>
            </div>

            {/* Footer */}
            <div
              style={{
                padding: "16px 24px",
                background: "#f5f5f5",
                borderRadius: "0 0 8px 8px",
                textAlign: "right",
              }}
            >
              <Button type="primary" onClick={handleClose}>
                Đóng
              </Button>
            </div>
          </>
        )}
      </Modal>
    </>
  );
}
