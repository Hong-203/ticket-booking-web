import React from "react";
import {
  Layout,
  Typography,
  Card,
  Divider,
  Space,
  theme,
  Steps,
  Collapse,
  Row,
  Col,
  Button,
} from "antd";
import {
  QrcodeOutlined,
  DollarCircleOutlined,
  MobileOutlined,
  CheckCircleOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";

const { Header, Content, Footer } = Layout;
const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;

// Dữ liệu giả định cho các bước thanh toán chung
const paymentSteps = [
  {
    title: "Chọn Gói Dịch vụ",
    description:
      "Truy cập trang Nâng cấp và chọn gói xem phù hợp với nhu cầu của bạn (Ví dụ: Standard, Premium).",
    icon: <DollarCircleOutlined />,
  },
  {
    title: "Xác nhận Đơn hàng",
    description:
      "Kiểm tra lại thông tin gói, thời hạn và tổng số tiền cần thanh toán.",
    icon: <CheckCircleOutlined />,
  },
  {
    title: "Chọn Ví điện tử",
    description:
      "Chọn phương thức thanh toán là **Momo** hoặc **ZaloPay** để tiếp tục.",
    icon: <MobileOutlined />,
  },
  {
    title: "Quét mã/Xác nhận",
    description:
      "Thực hiện quét mã QR hoặc xác nhận giao dịch trên ứng dụng Ví điện tử.",
    icon: <QrcodeOutlined />,
  },
  {
    title: "Hoàn tất",
    description:
      "Giao dịch thành công. Hệ thống sẽ tự động kích hoạt gói dịch vụ cho tài khoản của bạn.",
    icon: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
  },
];

// Dữ liệu chi tiết cho Momo
const momoGuide = `
1. **Mở ứng dụng MoMo:** Đăng nhập vào ứng dụng Ví MoMo trên điện thoại.
2. **Chọn tính năng "Quét Mã QR":** Hướng camera vào mã QR hiển thị trên màn hình thanh toán của CineZone.
3. **Kiểm tra thông tin:** Đảm bảo số tiền và tên người nhận là Công ty CineZone.
4. **Xác nhận giao dịch:** Nhấn "Xác nhận Thanh toán" và nhập mật khẩu/sử dụng sinh trắc học để hoàn tất.
5. **Giữ lại biên lai:** Giữ lại thông báo giao dịch thành công để đối chiếu nếu cần.
`;

// Dữ liệu chi tiết cho ZaloPay
const zalopayGuide = `
1. **Mở ứng dụng ZaloPay:** Đảm bảo bạn đã đăng nhập tài khoản ZaloPay trên điện thoại.
2. **Chọn tính năng "Quét Mã QR":** Sử dụng camera để quét mã QR được cung cấp bởi CineZone.
3. **Kiểm tra chi tiết:** Hệ thống sẽ tự động điền thông tin và số tiền. Bạn chỉ cần kiểm tra lại độ chính xác.
4. **Xác nhận Thanh toán:** Nhấn nút "Thanh toán" và xác nhận bằng mật khẩu ZaloPay/sinh trắc học.
5. **Nhận thông báo:** Bạn sẽ nhận được thông báo giao dịch thành công trên cả ZaloPay và CineZone.
`;

// Component chính
const PaymentGuideCineZone = () => {
  const { token } = theme.useToken();
  // Màu sắc đồng bộ với trang Điều khoản & Bảo mật:
  const primaryColor = "#722ed1"; // Tím đậm/Indigo
  const secondaryColor = "#faad14"; // Vàng cam

  return (
    <Layout
      style={{
        minHeight: "100vh",
        backgroundColor: token.colorBgContainerDisabled,
      }}
    >
      {/* HEADER */}
      <Header style={{ backgroundColor: primaryColor, padding: "0 20px" }}>
        <Title
          level={1}
          style={{ color: "white", margin: 0, lineHeight: "64px" }}
        >
          <Space size="middle">
            <DollarCircleOutlined />
            Hướng dẫn Thanh toán: **CineZone**
          </Space>
        </Title>
      </Header>

      {/* CONTENT */}
      <Content style={{ padding: "50px", maxWidth: "1200px", margin: "auto" }}>
        {/* Card Giới thiệu chung */}
        <Card
          style={{
            marginBottom: "30px",
            borderLeft: `5px solid ${secondaryColor}`,
          }}
          headStyle={{
            backgroundColor: token.colorPrimaryBg,
            borderBottom: `1px solid ${secondaryColor}`,
          }}
          title={
            <Title level={3} style={{ margin: 0, color: primaryColor }}>
              Thanh toán An toàn & Nhanh chóng
            </Title>
          }
        >
          <Paragraph>
            CineZone hiện tại hỗ trợ thanh toán qua hai ví điện tử hàng đầu tại
            Việt Nam là **MoMo** và **ZaloPay**. Quy trình thanh toán được thực
            hiện nhanh chóng qua mã QR để đảm bảo an toàn và kích hoạt dịch vụ
            ngay lập tức.
          </Paragraph>
          <Button
            type="primary"
            size="large"
            style={{
              backgroundColor: secondaryColor,
              borderColor: secondaryColor,
              color: primaryColor,
              fontWeight: "bold",
            }}
          >
            <Space>
              Nâng cấp Gói ngay <ArrowRightOutlined />
            </Space>
          </Button>
        </Card>

        <Divider
          orientation="left"
          style={{ color: primaryColor, borderColor: primaryColor }}
        >
          <Title level={4} style={{ margin: 0, color: primaryColor }}>
            <Space>
              <QrcodeOutlined /> QUY TRÌNH THANH TOÁN CHUNG
            </Space>
          </Title>
        </Divider>

        {/* Các Bước Thanh toán chung */}
        <Card style={{ marginBottom: "50px", padding: "20px" }}>
          <Steps
            direction="horizontal"
            size="large"
            responsive={true}
            current={-1} // Không làm nổi bật bước nào
            items={paymentSteps}
          />
        </Card>

        <Divider
          orientation="left"
          style={{ color: primaryColor, borderColor: primaryColor }}
        >
          <Title level={4} style={{ margin: 0, color: primaryColor }}>
            <Space>
              <MobileOutlined /> HƯỚNG DẪN CHI TIẾT THEO VÍ ĐIỆN TỬ
            </Space>
          </Title>
        </Divider>

        {/* Hướng dẫn chi tiết cho từng ví */}
        <Collapse
          defaultActiveKey={["1"]}
          size="large"
          expandIconPosition="right"
          style={{ marginBottom: "30px" }}
        >
          {/* Panel MoMo */}
          <Panel
            key="1"
            header={
              <Title level={4} style={{ margin: 0, color: "#A50064" }}>
                <Space>
                  <MobileOutlined style={{ color: "#A50064" }} /> Thanh toán qua
                  Ví MoMo
                </Space>
              </Title>
            }
            style={{ borderLeft: "5px solid #A50064" }}
          >
            <Row gutter={32}>
              <Col xs={24} md={16}>
                <pre
                  style={{
                    backgroundColor: token.colorFillAlter,
                    padding: "15px",
                    borderRadius: "5px",
                    whiteSpace: "pre-wrap",
                    color: token.colorText,
                    border: `1px solid #A50064`,
                  }}
                >
                  {momoGuide}
                </pre>
                <Paragraph style={{ marginTop: 10 }}>
                  <Text strong style={{ color: "#A50064" }}>
                    Lưu ý:
                  </Text>{" "}
                  MoMo là phương thức được đề xuất cho tốc độ giao dịch nhanh
                  nhất.
                </Paragraph>
              </Col>
              <Col
                xs={24}
                md={8}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img
                  src="https://fakeimg.pl/200x200/A50064/fff?text=QR+MOMO"
                  alt="QR Code Momo Sample"
                  style={{ border: `5px solid #A50064`, borderRadius: "10px" }}
                />
              </Col>
            </Row>
          </Panel>

          {/* Panel ZaloPay */}
          <Panel
            key="2"
            header={
              <Title level={4} style={{ margin: 0, color: "#0068FF" }}>
                <Space>
                  <MobileOutlined style={{ color: "#0068FF" }} /> Thanh toán qua
                  Ví ZaloPay
                </Space>
              </Title>
            }
            style={{ borderLeft: "5px solid #0068FF" }}
          >
            <Row gutter={32}>
              <Col xs={24} md={16}>
                <pre
                  style={{
                    backgroundColor: token.colorFillAlter,
                    padding: "15px",
                    borderRadius: "5px",
                    whiteSpace: "pre-wrap",
                    color: token.colorText,
                    border: `1px solid #0068FF`,
                  }}
                >
                  {zalopayGuide}
                </pre>
                <Paragraph style={{ marginTop: 10 }}>
                  <Text strong style={{ color: "#0068FF" }}>
                    Lưu ý:
                  </Text>{" "}
                  ZaloPay yêu cầu bạn có tài khoản Zalo đã được kích hoạt.
                </Paragraph>
              </Col>
              <Col
                xs={24}
                md={8}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img
                  src="https://fakeimg.pl/200x200/0068FF/fff?text=QR+ZALOPAY"
                  alt="QR Code ZaloPay Sample"
                  style={{ border: `5px solid #0068FF`, borderRadius: "10px" }}
                />
              </Col>
            </Row>
          </Panel>
        </Collapse>

        <Divider />

        {/* Liên hệ Hỗ trợ */}
        <div
          style={{
            textAlign: "center",
            padding: "20px",
            backgroundColor: token.colorPrimaryBg,
            borderRadius: "8px",
          }}
        >
          <Title level={3} style={{ color: primaryColor }}>
            Cần hỗ trợ?
          </Title>
          <Paragraph>
            Nếu bạn gặp bất kỳ vấn đề nào trong quá trình thanh toán (như lỗi
            giao dịch, tiền đã trừ nhưng gói chưa kích hoạt), vui lòng liên hệ
            ngay với bộ phận hỗ trợ của chúng tôi:
          </Paragraph>
          <Paragraph>
            <Text strong>Hotline Hỗ trợ 24/7:</Text> <Text code>1900 6789</Text>
            <br />
            <Text strong>Email:</Text> <Text code>support@cinezone.vn</Text>
          </Paragraph>
        </div>
      </Content>

      {/* FOOTER */}
      {/* <Footer
        style={{
          textAlign: "center",
          backgroundColor: primaryColor,
          color: "white",
        }}
      >
        CineZone ©{new Date().getFullYear()} - Hỗ trợ Thanh toán An toàn.
      </Footer> */}
    </Layout>
  );
};

export default PaymentGuideCineZone;
