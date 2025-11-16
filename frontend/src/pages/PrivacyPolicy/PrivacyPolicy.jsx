import React from "react";
import {
  Layout,
  Typography,
  Card,
  Divider,
  Space,
  theme,
  Tag,
  Row,
  Col,
} from "antd";
import {
  SafetyOutlined,
  UserOutlined,
  DatabaseOutlined,
  MailOutlined,
  SettingOutlined,
} from "@ant-design/icons";

const { Header, Content, Footer } = Layout;
const { Title, Paragraph, Text, Link } = Typography;

// Dữ liệu giả định cho Chính sách Bảo mật
const privacyPolicyData = [
  {
    icon: <UserOutlined style={{ color: "#0050b3" }} />,
    title: "1. Thông tin chúng tôi thu thập",
    content:
      "CineZone thu thập thông tin để cung cấp dịch vụ tốt hơn cho tất cả người dùng. Loại thông tin thu thập phụ thuộc vào cách bạn sử dụng dịch vụ của chúng tôi.",
    key: "info-collection",
    details: [
      {
        heading: "1.1. Thông tin bạn cung cấp trực tiếp",
        tag: "Bắt buộc",
        text: "Bao gồm tên, địa chỉ email, mật khẩu (được mã hóa), và thông tin thanh toán (chỉ giữ lại 4 số cuối của thẻ để tham chiếu) khi bạn đăng ký tài khoản hoặc mua gói dịch vụ.",
      },
      {
        heading: "1.2. Dữ liệu sử dụng và xem",
        tag: "Tự động",
        text: "Ghi lại lịch sử xem, sở thích phim ảnh, danh sách yêu thích, thời gian xem, và tương tác với nội dung. Dữ liệu này giúp chúng tôi đề xuất nội dung phù hợp và tối ưu hóa trải nghiệm.",
      },
      {
        heading: "1.3. Dữ liệu kỹ thuật và thiết bị",
        tag: "Kỹ thuật",
        text: "Thu thập thông tin về thiết bị bạn sử dụng (model, hệ điều hành, ID thiết bị duy nhất), địa chỉ IP, loại trình duyệt, ngôn ngữ và cài đặt múi giờ.",
      },
      {
        heading: "1.4. Thông tin từ bên thứ ba",
        tag: "Tích hợp",
        text: "Nếu bạn đăng nhập bằng tài khoản mạng xã hội (Google, Facebook), chúng tôi sẽ nhận được thông tin công khai từ hồ sơ đó theo chính sách của bên thứ ba.",
      },
    ],
  },
  {
    icon: <DatabaseOutlined style={{ color: "#13c2c2" }} />,
    title: "2. Cách chúng tôi sử dụng thông tin",
    content:
      "Chúng tôi sử dụng thông tin thu thập được cho các mục đích hợp pháp sau đây:",
    key: "info-usage",
    details: [
      {
        heading: "2.1. Cung cấp và duy trì Dịch vụ",
        tag: "Thiết yếu",
        text: "Xử lý giao dịch, cung cấp quyền truy cập vào nội dung, quản lý tài khoản và hỗ trợ kỹ thuật.",
      },
      {
        heading: "2.2. Cá nhân hóa trải nghiệm",
        tag: "Cải tiến",
        text: "Phân tích thói quen xem để đề xuất phim, chương trình TV và quảng cáo phù hợp với sở thích của bạn.",
      },
      {
        heading: "2.3. Nghiên cứu và Phát triển",
        tag: "Nội bộ",
        text: "Phân tích dữ liệu người dùng tổng thể để cải tiến tính năng, tối ưu hóa hiệu suất ứng dụng và phát triển các dịch vụ mới.",
      },
      {
        heading: "2.4. Liên lạc và Marketing",
        tag: "Marketing",
        text: "Gửi thông báo về cập nhật dịch vụ, các chương trình khuyến mãi, và thông tin liên quan đến tài khoản của bạn. Bạn luôn có thể hủy đăng ký nhận thông báo marketing.",
      },
    ],
  },
  {
    icon: <SafetyOutlined style={{ color: "#7cb305" }} />,
    title: "3. Chia sẻ và Tiết lộ Thông tin",
    content:
      "CineZone cam kết bảo vệ thông tin của bạn và chỉ chia sẻ trong các trường hợp nghiêm ngặt cần thiết.",
    key: "info-sharing",
    details: [
      {
        heading: "3.1. Nhà cung cấp dịch vụ bên ngoài",
        tag: "Hợp tác",
        text: "Chúng tôi chia sẻ thông tin (đã mã hóa hoặc ẩn danh khi có thể) với các đối tác xử lý thanh toán, lưu trữ dữ liệu, và phân tích hiệu suất.",
      },
      {
        heading: "3.2. Yêu cầu pháp lý và Bảo vệ quyền",
        tag: "Pháp luật",
        text: "Chúng tôi có thể tiết lộ thông tin cá nhân nếu được yêu cầu bởi luật pháp hoặc nhằm mục đích bảo vệ quyền lợi, tài sản hoặc sự an toàn của CineZone, người dùng của chúng tôi hoặc công chúng.",
      },
      {
        heading: "3.3. Chuyển đổi kinh doanh",
        tag: "Thương vụ",
        text: "Trong trường hợp sáp nhập, mua lại hoặc bán tài sản, thông tin cá nhân của bạn có thể là một phần của tài sản được chuyển giao. Chúng tôi sẽ thông báo trước về thay đổi quyền sở hữu hoặc sử dụng thông tin.",
      },
    ],
  },
  {
    icon: <SettingOutlined style={{ color: "#eb2f96" }} />,
    title: "4. Quyền riêng tư của bạn",
    content: "Bạn có quyền kiểm soát thông tin cá nhân của mình.",
    key: "user-rights",
    details: [
      {
        heading: "4.1. Quyền truy cập và Chỉnh sửa",
        tag: "Kiểm soát",
        text: "Bạn có thể truy cập và cập nhật hầu hết thông tin cá nhân của mình thông qua trang cài đặt tài khoản.",
      },
      {
        heading: "4.2. Quyền Xóa bỏ",
        tag: "Xóa",
        text: "Bạn có quyền yêu cầu xóa dữ liệu cá nhân của mình. Tuy nhiên, chúng tôi có thể giữ lại một số thông tin nếu cần thiết để tuân thủ nghĩa vụ pháp lý hoặc giải quyết tranh chấp.",
      },
      {
        heading: "4.3. Từ chối nhận Marketing",
        tag: "Tùy chọn",
        text: 'Bạn có thể từ chối nhận email marketing từ chúng tôi bằng cách nhấp vào liên kết "Hủy đăng ký" ở cuối mỗi email.',
      },
    ],
  },
];

// Component chính
const PrivacyPolicyCineZone = () => {
  const { token } = theme.useToken();
  // Màu sắc đồng bộ với trang Điều khoản:
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
            <SafetyOutlined />
            Chính sách Bảo mật: **CineZone**
          </Space>
        </Title>
      </Header>

      {/* CONTENT */}
      <Content style={{ padding: "50px", maxWidth: "1200px", margin: "auto" }}>
        {/* Card Giới thiệu chung */}
        <Card
          style={{
            marginBottom: "30px",
            borderLeft: `5px solid ${primaryColor}`,
          }}
          headStyle={{
            backgroundColor: token.colorPrimaryBg,
            borderBottom: `1px solid ${primaryColor}`,
          }}
          title={
            <Title level={3} style={{ margin: 0, color: primaryColor }}>
              Bảo vệ Dữ liệu của Bạn là Ưu tiên hàng đầu của chúng tôi
            </Title>
          }
        >
          <Paragraph>
            Chính sách bảo mật này mô tả cách Công ty Cổ phần Giải trí CineZone
            thu thập, sử dụng và bảo vệ thông tin cá nhân của bạn khi bạn sử
            dụng Dịch vụ của chúng tôi. Chúng tôi cam kết bảo mật và tôn trọng
            quyền riêng tư của bạn.
          </Paragraph>
          <Paragraph>
            <Text strong style={{ color: secondaryColor }}>
              Ngày có hiệu lực:
            </Text>{" "}
            <Text italic>Ngày 01 tháng 01 năm 2025</Text>
          </Paragraph>
        </Card>

        {/* Các Mục Chính sách chi tiết */}
        <Space direction="vertical" size="large" style={{ display: "flex" }}>
          {privacyPolicyData.map((section, index) => (
            <Card
              key={section.key}
              style={{
                borderRadius: "10px",
                boxShadow: `0 4px 12px rgba(0, 0, 0, 0.1)`,
                border: "1px solid #e8e8e8",
              }}
              title={
                <Space>
                  {section.icon}
                  <Title level={4} style={{ margin: 0, color: primaryColor }}>
                    {section.title}
                  </Title>
                </Space>
              }
            >
              <Paragraph
                style={{
                  color: token.colorTextSecondary,
                  marginBottom: "20px",
                }}
              >
                {section.content}
              </Paragraph>

              {/* Các chi tiết/tiểu mục */}
              <Row gutter={[16, 16]}>
                {section.details.map((detail, detailIndex) => (
                  <Col xs={24} md={12} key={detailIndex}>
                    <Card
                      size="small"
                      style={{
                        height: "100%",
                        borderLeft: `3px solid ${secondaryColor}`,
                      }}
                    >
                      <Space direction="vertical" size={5}>
                        <Tag color={primaryColor}>{detail.tag}</Tag>
                        <Text strong style={{ color: primaryColor }}>
                          {detail.heading}
                        </Text>
                        <Paragraph
                          style={{
                            margin: 0,
                            fontSize: token.fontSizeSM,
                            color: token.colorText,
                          }}
                        >
                          {detail.text}
                        </Paragraph>
                      </Space>
                    </Card>
                  </Col>
                ))}
              </Row>

              {/* Chỉ hiển thị Divider nếu không phải mục cuối cùng */}
              {index < privacyPolicyData.length - 1 && (
                <Divider style={{ margin: "30px 0 15px 0" }} />
              )}
            </Card>
          ))}
        </Space>

        <Divider />

        {/* Thông tin Liên hệ và Khiếu nại */}
        <div style={{ textAlign: "center", padding: "20px" }}>
          <Title level={3} style={{ color: primaryColor }}>
            Thông tin Liên hệ và Khiếu nại
          </Title>
          <Paragraph>
            Nếu bạn có bất kỳ câu hỏi hoặc quan ngại nào về Chính sách Bảo mật
            này hoặc cách chúng tôi xử lý dữ liệu của bạn, vui lòng liên hệ với
            Nhân viên Bảo vệ Dữ liệu (DPO) của chúng tôi:
          </Paragraph>
          <Paragraph>
            <MailOutlined style={{ marginRight: 8, color: secondaryColor }} />
            <Text strong>Email DPO:</Text>{" "}
            <Link href="mailto:support@cinezone.vn" target="_blank">
              support@cinezone.vn
            </Link>
            <br />
            <Text strong>Số điện thoại:</Text> +84 900 123 456
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
        CineZone ©{new Date().getFullYear()} - Chính sách Bảo mật.
      </Footer> */}
    </Layout>
  );
};

export default PrivacyPolicyCineZone;
