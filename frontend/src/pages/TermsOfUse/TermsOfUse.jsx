import React from "react";
import { Layout, Typography, Card, Divider, Space, theme } from "antd";
import {
  LockOutlined,
  InfoCircleOutlined,
  WarningOutlined,
  FileTextOutlined,
} from "@ant-design/icons";

const { Header, Content, Footer } = Layout;
const { Title, Paragraph, Text, Link } = Typography;

// Dữ liệu giả định cho các điều khoản
const termsData = [
  {
    icon: <InfoCircleOutlined style={{ color: "#1890ff" }} />,
    title: "1. Chấp nhận các Điều khoản",
    content:
      "Bằng việc truy cập hoặc sử dụng dịch vụ CineZone, bạn xác nhận đã đọc, hiểu và đồng ý bị ràng buộc bởi các điều khoản sử dụng này. Nếu bạn không đồng ý với bất kỳ điều khoản nào, vui lòng không sử dụng dịch vụ của chúng tôi. Các điều khoản này có hiệu lực từ ngày **01/01/2024**.",
    key: "acceptance",
  },
  {
    icon: <LockOutlined style={{ color: "#faad14" }} />,
    title: "2. Quyền và Trách nhiệm của Người dùng",
    content:
      "Bạn cam kết sử dụng dịch vụ hợp pháp và không vi phạm quyền của bên thứ ba. Nghiêm cấm chia sẻ tài khoản, sử dụng bot/script để truy cập tự động. Mọi nội dung do người dùng đăng tải (nếu có) phải tuân thủ pháp luật hiện hành và không chứa nội dung gây thù ghét, bạo lực, hoặc vi phạm bản quyền.",
    key: "user-responsibilities",
    subsections: [
      {
        heading: "2.1. Độ tuổi tối thiểu",
        text: "Bạn phải đủ **18 tuổi** trở lên, hoặc có sự đồng ý của phụ huynh/người giám hộ để sử dụng dịch vụ có giới hạn độ tuổi.",
      },
      {
        heading: "2.2. Bảo mật tài khoản",
        text: "Bạn có trách nhiệm bảo mật mật khẩu và thông tin đăng nhập của mình. CineZone sẽ không chịu trách nhiệm cho bất kỳ tổn thất nào phát sinh do việc bạn không bảo vệ thông tin tài khoản.",
      },
    ],
  },
  {
    icon: <FileTextOutlined style={{ color: "#52c41a" }} />,
    title: "3. Sở hữu Trí tuệ",
    content:
      "Tất cả nội dung trên CineZone, bao gồm phim, chương trình, đồ họa, logo và mã nguồn, đều thuộc sở hữu của Công ty Cổ phần Giải trí CineZone hoặc các bên cấp phép. Bạn chỉ được phép sử dụng nội dung cho mục đích xem cá nhân, phi thương mại. Việc sao chép, phân phối hoặc tạo tác phẩm phái sinh mà không có sự cho phép bằng văn bản là **nghiêm cấm**.",
    key: "ip",
  },
  {
    icon: <WarningOutlined style={{ color: "#ff4d4f" }} />,
    title: "4. Giới hạn Trách nhiệm và Tuyên bố Từ chối",
    content:
      'Dịch vụ được cung cấp "nguyên trạng" ("as is"). CineZone không đảm bảo rằng dịch vụ sẽ không bị gián đoạn, không có lỗi, hoặc an toàn. Trong mọi trường hợp, CineZone sẽ không chịu trách nhiệm đối với bất kỳ thiệt hại gián tiếp, ngẫu nhiên, đặc biệt hoặc mang tính trừng phạt nào phát sinh từ việc sử dụng hoặc không thể sử dụng dịch vụ.',
    key: "liability",
  },
  {
    icon: <LockOutlined style={{ color: "#722ed1" }} />,
    title: "5. Thay đổi Điều khoản",
    content:
      "CineZone có quyền sửa đổi các điều khoản này bất cứ lúc nào. Chúng tôi sẽ thông báo cho bạn về bất kỳ thay đổi quan trọng nào qua email hoặc thông báo trên dịch vụ. Việc bạn tiếp tục sử dụng dịch vụ sau khi các thay đổi có hiệu lực đồng nghĩa với việc bạn chấp nhận các điều khoản đã được sửa đổi.",
    key: "changes",
  },
];

// Component chính
const TermsOfServiceCineZone = () => {
  // Sử dụng hook của antd để lấy các token màu mặc định
  const { token } = theme.useToken();

  // Định nghĩa màu sắc chủ đạo
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
            <FileTextOutlined />
            Điều khoản sử dụng: **CineZone**
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
              Chào mừng đến với CineZone!
            </Title>
          }
        >
          <Paragraph>
            Các điều khoản sử dụng này ("Điều khoản") quản lý việc sử dụng của
            bạn đối với trang web, ứng dụng di động và các dịch vụ khác do
            CineZone cung cấp (gọi chung là "Dịch vụ"). Vui lòng đọc kỹ các điều
            khoản này trước khi sử dụng Dịch vụ.
          </Paragraph>
          <Paragraph>
            <Text strong style={{ color: secondaryColor }}>
              Cập nhật lần cuối:
            </Text>{" "}
            <Text italic>Ngày 01 tháng 11 năm 2025</Text>
          </Paragraph>
        </Card>

        {/* Các Điều khoản chi tiết */}
        <Space direction="vertical" size="large" style={{ display: "flex" }}>
          {termsData.map((term, index) => (
            <Card
              key={term.key}
              hoverable
              style={{
                borderRadius: "10px",
                boxShadow: `0 4px 12px rgba(0, 0, 0, 0.1)`,
                border: "1px solid #e8e8e8",
              }}
              title={
                <Space>
                  {term.icon}
                  <Title level={4} style={{ margin: 0, color: primaryColor }}>
                    {term.title}
                  </Title>
                </Space>
              }
            >
              <Paragraph style={{ color: token.colorTextSecondary }}>
                {term.content}
              </Paragraph>

              {/* Tiểu mục nếu có */}
              {term.subsections && (
                <div
                  style={{
                    marginTop: "15px",
                    padding: "15px",
                    borderLeft: `3px solid ${token.colorBorderSecondary}`,
                    backgroundColor: token.colorFillAlter,
                  }}
                >
                  {term.subsections.map((sub, subIndex) => (
                    <div key={subIndex} style={{ marginBottom: "10px" }}>
                      <Text strong style={{ color: secondaryColor }}>
                        {sub.heading}:
                      </Text>{" "}
                      <Text>{sub.text}</Text>
                    </div>
                  ))}
                </div>
              )}

              {/* Chỉ hiển thị Divider nếu không phải mục cuối cùng */}
              {index < termsData.length - 1 && (
                <Divider style={{ margin: "15px 0" }} />
              )}
            </Card>
          ))}
        </Space>

        <Divider />

        {/* Thông tin Liên hệ */}
        <div style={{ textAlign: "center", padding: "20px" }}>
          <Title level={3} style={{ color: primaryColor }}>
            Liên hệ chúng tôi
          </Title>
          <Paragraph>
            Nếu bạn có bất kỳ câu hỏi nào về các Điều khoản này, vui lòng liên
            hệ với chúng tôi tại:
          </Paragraph>
          <Paragraph>
            <Text strong>Email Hỗ trợ:</Text>{" "}
            <Link href="mailto:support@cinezone.com" target="_blank">
              support@cinezone.com
            </Link>
            <br />
            {/* <Text strong>Địa chỉ:</Text> Tầng 18, Tòa nhà Giải trí, 123 Đường
            Phim Ảnh, Thành phố Điện ảnh, Việt Nam. */}
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
        CineZone ©{new Date().getFullYear()} - Tất cả các quyền được bảo lưu.
      </Footer> */}
    </Layout>
  );
};

export default TermsOfServiceCineZone;
