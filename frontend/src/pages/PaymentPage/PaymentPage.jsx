import React, { useEffect, useState } from "react";
import {
  Card,
  Button,
  Form,
  Input,
  Radio,
  Select,
  Divider,
  Typography,
  message,
  Row,
  Col,
  Spin,
} from "antd";
import {
  CreditCardOutlined,
  BankOutlined,
  MobileOutlined,
  SafetyOutlined,
  CheckCircleOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import TicketDetail from "../../components/TicketDetail/TicketDetail";
import "./PaymentPage.css";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  createPayMomo,
  createPayZaloPay,
} from "../../stores/Payment/paymentApis";

const { Title, Text } = Typography;
const { Option } = Select;

const PaymentPage = () => {
  const [form] = Form.useForm();
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { ticketId } = useParams();

  // Khi ticketId thay đổi → simulate loading nhỏ
  useEffect(() => {
    if (!ticketId) {
      console.warn("ticketId is missing from URL");
      setPageLoading(false);
      return;
    }

    // Giả lập chờ dữ liệu hoặc xác nhận có ticketId
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 400); // chờ 0.4s để Spin hiển thị nhẹ

    return () => clearTimeout(timer);
  }, [ticketId]);

  // Set thông tin người dùng vào form
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      form.setFieldsValue({
        email: storedUser.email,
        phone: storedUser.phone,
      });
    }
  }, [form]);

  const paymentMethods = [
    {
      value: "card",
      label: "Thẻ tín dụng/ghi nợ",
      icon: <CreditCardOutlined />,
      description: "Visa, Mastercard, JCB",
    },
    {
      value: "banking",
      label: "Chuyển khoản ngân hàng",
      icon: <BankOutlined />,
      description: "Internet Banking, QR Banking",
    },
    {
      value: "momo",
      label: "Ví MoMo",
      icon: <MobileOutlined />,
      description: "Thanh toán qua ví điện tử MoMo",
    },
    {
      value: "zalopay",
      label: "ZaloPay",
      icon: <MobileOutlined />,
      description: "Thanh toán qua ví điện tử ZaloPay",
    },
  ];

  const banks = [
    "Vietcombank",
    "Techcombank",
    "BIDV",
    "VietinBank",
    "Agribank",
    "MBBank",
    "ACB",
    "Sacombank",
  ];

  const handlePayment = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      if (paymentMethod === "momo") {
        const res = await dispatch(createPayMomo({ ticketId }));
        if (res?.data?.payUrl) {
          window.location.href = res.data.payUrl;
        }
      } else if (paymentMethod === "zalopay") {
        const res = await dispatch(createPayZaloPay({ ticketId }));
        if (res?.data?.order_url) {
          window.location.href = res.data.order_url;
        }
      } else {
        message.info("Phương thức này chưa được hỗ trợ backend");
      }
    } catch (error) {
      console.error(error);
      message.error("Thanh toán thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const renderPaymentForm = () => {
    switch (paymentMethod) {
      case "card":
        return (
          <>
            <Form.Item
              name="cardNumber"
              label="Số thẻ"
              rules={[
                { required: true, message: "Vui lòng nhập số thẻ" },
                { pattern: /^\d{16}$/, message: "Số thẻ phải có 16 chữ số" },
              ]}
            >
              <Input
                placeholder="1234 5678 9012 3456"
                maxLength={16}
                prefix={<CreditCardOutlined />}
              />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="expiryDate"
                  label="Ngày hết hạn"
                  rules={[
                    { required: true, message: "Vui lòng nhập ngày hết hạn" },
                  ]}
                >
                  <Input placeholder="MM/YY" maxLength={5} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="cvv"
                  label="CVV"
                  rules={[
                    { required: true, message: "Vui lòng nhập CVV" },
                    { pattern: /^\d{3,4}$/, message: "CVV phải có 3-4 chữ số" },
                  ]}
                >
                  <Input placeholder="123" maxLength={4} />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="cardHolder"
              label="Tên chủ thẻ"
              rules={[{ required: true, message: "Vui lòng nhập tên chủ thẻ" }]}
            >
              <Input placeholder="NGUYEN VAN A" />
            </Form.Item>
          </>
        );

      case "banking":
        return (
          <Form.Item
            name="bank"
            label="Chọn ngân hàng"
            rules={[{ required: true, message: "Vui lòng chọn ngân hàng" }]}
          >
            <Select placeholder="Chọn ngân hàng của bạn">
              {banks.map((bank) => (
                <Option key={bank} value={bank}>
                  {bank}
                </Option>
              ))}
            </Select>
          </Form.Item>
        );

      default:
        return null;
    }
  };

  return (
    <Spin spinning={pageLoading} tip="Đang tải dữ liệu...">
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#f5f5f5",
          padding: "24px",
          fontFamily: "Inter, sans-serif",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          {/* Header */}
          <div style={{ marginBottom: "24px" }}>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={handleBack}
              style={{ marginBottom: "16px" }}
            >
              Quay lại
            </Button>
            <Title level={2} style={{ margin: 0 }}>
              Thanh toán
            </Title>
          </div>

          <Row gutter={24}>
            {/* Payment Form */}
            <Col xs={24} lg={14}>
              <Card title="Phương thức thanh toán" bordered={false}>
                <div style={{ marginBottom: "24px" }}>
                  <Radio.Group
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    style={{ width: "100%" }}
                  >
                    {paymentMethods.map((method) => (
                      <div key={method.value} style={{ marginBottom: "12px" }}>
                        <Radio value={method.value} style={{ width: "100%" }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "12px",
                            }}
                          >
                            <span
                              style={{ fontSize: "18px", color: "#1890ff" }}
                            >
                              {method.icon}
                            </span>
                            <div>
                              <div style={{ fontWeight: "bold" }}>
                                {method.label}
                              </div>
                              <Text
                                type="secondary"
                                style={{ fontSize: "12px" }}
                              >
                                {method.description}
                              </Text>
                            </div>
                          </div>
                        </Radio>
                      </div>
                    ))}
                  </Radio.Group>
                </div>

                <Divider />

                <Form form={form} layout="vertical" onFinish={handlePayment}>
                  {renderPaymentForm()}

                  <Divider>Thông tin liên hệ</Divider>

                  <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                      { required: true, message: "Vui lòng nhập email" },
                      { type: "email", message: "Email không hợp lệ" },
                    ]}
                  >
                    <Input placeholder="example@email.com" />
                  </Form.Item>

                  <Form.Item
                    name="phone"
                    label="Số điện thoại"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập số điện thoại",
                      },
                      {
                        pattern: /^[0-9]{10}$/,
                        message: "Số điện thoại không hợp lệ",
                      },
                    ]}
                  >
                    <Input placeholder="0901234567" />
                  </Form.Item>

                  <div
                    style={{
                      backgroundColor: "#f6ffed",
                      border: "1px solid #b7eb8f",
                      borderRadius: "6px",
                      padding: "12px",
                      marginBottom: "24px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <SafetyOutlined style={{ color: "#52c41a" }} />
                      <Text style={{ color: "#52c41a", fontWeight: "bold" }}>
                        Bảo mật SSL 256-bit
                      </Text>
                    </div>
                    <Text style={{ fontSize: "12px", color: "#52c41a" }}>
                      Thông tin thanh toán của bạn được mã hóa và bảo mật
                    </Text>
                  </div>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loading}
                      size="large"
                      block
                      icon={<CheckCircleOutlined />}
                      style={{
                        height: "50px",
                        fontSize: "16px",
                        fontWeight: "bold",
                      }}
                    >
                      {loading ? "Đang xử lý..." : "Thanh toán ngay"}
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            </Col>

            <Col xs={24} lg={10}>
              <div style={{ position: "sticky", top: "24px" }}>
                {ticketId ? (
                  <TicketDetail ticketId={ticketId} />
                ) : (
                  <Spin tip="Đang tải chi tiết vé..." />
                )}
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </Spin>
  );
};

export default PaymentPage;
