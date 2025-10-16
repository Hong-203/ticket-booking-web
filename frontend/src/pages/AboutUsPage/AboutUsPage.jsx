import React from "react";
import { Row, Col, Card, Statistic, Timeline, Space, Button } from "antd";
import {
  FireOutlined,
  RocketOutlined,
  SafetyOutlined,
  TeamOutlined,
} from "@ant-design/icons";

export default function AboutUsPage() {
  const stats = [
    { label: "Rạp chiếu phim", value: 4, prefix: "🏢", color: "#ff6f61" },
    { label: "Thành phố", value: 1, prefix: "🌆", color: "#6a5acd" },
    { label: "Khách hàng", value: "2.5M+", prefix: "👥", color: "#ffb400" },
    { label: "Năm hoạt động", value: 1, prefix: "📅", color: "#00bfff" },
  ];

  const milestones = [
    {
      year: "",
      title: "Thành lập CineZone",
      desc: "Khởi đầu hành trình mang điện ảnh hiện đại đến Việt Nam",
    },
    {
      year: "",
      title: "Khai trương chi nhánh",
      desc: "Mở rộng mạng lưới rạp chiếu khắp các thành phố lớn",
    },
    {
      year: "",
      title: "Ra mắt ứng dụng di động",
      desc: "Cho phép khách hàng đặt vé một cách tiện lợi hơn bao giờ hết",
    },
    {
      year: "",
      title: "Công nghệ 4DX - IMAX",
      desc: "Nâng cấp trải nghiệm xem phim với công nghệ tối tân",
    },
    {
      year: "",
      title: "Hệ thống quản lý toàn diện",
      desc: "Triển khai nền tảng web, app mobile và quản lý desktop tích hợp",
    },
  ];

  const values = [
    {
      icon: <SafetyOutlined />,
      title: "Chất lượng",
      desc: "Cam kết cung cấp dịch vụ chiếu phim tốt nhất với âm thanh và hình ảnh sắc nét",
      color: "#ff6f61",
    },
    {
      icon: <TeamOutlined />,
      title: "Khách hàng là trung tâm",
      desc: "Luôn lắng nghe và cải thiện trải nghiệm của mỗi khách hàng",
      color: "#6a5acd",
    },
    {
      icon: <FireOutlined />,
      title: "Đổi mới",
      desc: "Không ngừng áp dụng công nghệ mới để đem đến những trải nghiệm độc đáo",
      color: "#ffb400",
    },
    {
      icon: <RocketOutlined />,
      title: "Phát triển bền vững",
      desc: "Cam kết với môi trường và cộng đồng xã hội",
      color: "#00bfff",
    },
  ];

  return (
    <div
      style={{
        padding: "40px 20px",
        background: "linear-gradient(135deg, #f5f7fa 0%, #e0f7fa 100%)",
        minHeight: "100vh",
        marginTop: "64px",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "60px" }}>
        <h1
          style={{
            fontSize: "48px",
            fontWeight: "bold",
            marginBottom: "16px",
            background: "linear-gradient(90deg, #ff6f61, #ffb400)",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          Về Chúng Tôi
        </h1>
        <p
          style={{
            fontSize: "18px",
            color: "#555555",
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          Khám phá hành trình 15 năm mang đến những trải nghiệm điện ảnh tuyệt
          vời cho hàng triệu khán giả Việt Nam
        </p>
      </div>

      {/* Stats Section */}
      <Row
        gutter={[24, 24]}
        style={{
          marginBottom: "80px",
          maxWidth: "1200px",
          margin: "0 auto 80px",
        }}
      >
        {stats.map((stat, idx) => (
          <Col xs={24} sm={12} lg={6} key={idx}>
            <Card
              style={{
                background: `linear-gradient(135deg, ${stat.color}20, ${stat.color}50)`,
                border: "none",
                borderRadius: "16px",
                textAlign: "center",
                transition: "all 0.3s ease",
                cursor: "pointer",
              }}
              hoverable
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow = `0 12px 24px ${stat.color}40`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div style={{ fontSize: "36px", marginBottom: "12px" }}>
                {stat.prefix}
              </div>
              <Statistic
                title={stat.label}
                value={stat.value}
                valueStyle={{
                  color: stat.color,
                  fontSize: "32px",
                  fontWeight: "bold",
                }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Mission Section */}
      <div style={{ maxWidth: "1000px", margin: "0 auto 80px" }}>
        <Card
          style={{
            background: "linear-gradient(135deg, #fff3e0, #ffe0b2)",
            borderRadius: "16px",
            padding: "40px",
            border: "none",
            boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
            transition: "transform 0.3s",
          }}
          hoverable
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = "scale(1.02)")
          }
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <h2
            style={{
              fontSize: "32px",
              marginBottom: "24px",
              background: "linear-gradient(90deg, #ff6f61, #ffb400)",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            Sứ mệnh của chúng tôi
          </h2>
          <p
            style={{
              fontSize: "16px",
              lineHeight: "1.8",
              color: "#555",
              marginBottom: "16px",
            }}
          >
            Tại CineZone, chúng tôi tin rằng điện ảnh là một hình thức nghệ
            thuật universal có khả năng kết nối con người từ khắp nơi trên thế
            giới. Sứ mệnh của chúng tôi là tạo ra những không gian chiếu phim
            tuyệt vời nơi mọi người có thể tận hưởng những bộ phim yêu thích của
            họ theo cách tốt nhất có thể.
          </p>
          <p style={{ fontSize: "16px", lineHeight: "1.8", color: "#555" }}>
            Với công nghệ tiên tiến, đội ngũ chuyên nghiệp và sự đầu tư liên tục
            vào cải thiện dịch vụ, chúng tôi cam kết mang đến trải nghiệm xem
            phim không quên được cho tất cả khách hàng.
          </p>
        </Card>
      </div>

      {/* Timeline Section */}
      <div style={{ maxWidth: "1000px", margin: "0 auto 80px" }}>
        <h2
          style={{
            fontSize: "32px",
            marginBottom: "40px",
            textAlign: "center",
            background: "linear-gradient(90deg, #ff6f61, #ffb400)",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          Hành trình phát triển
        </h2>
        <Timeline
          items={milestones.map((milestone, idx) => ({
            key: idx,
            dot: (
              <div
                style={{
                  width: "16px",
                  height: "16px",
                  background: "#ff6f61",
                  borderRadius: "50%",
                  marginTop: "4px",
                }}
              />
            ),
            children: (
              <Card
                style={{
                  background: "linear-gradient(135deg, #e0f7fa, #b2ebf2)",
                  borderRadius: "12px",
                  marginBottom: "24px",
                  border: "none",
                  boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
                  transition: "transform 0.3s",
                }}
                hoverable
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.02)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                <div
                  style={{
                    color: "#ff6f61",
                    fontWeight: "bold",
                    fontSize: "14px",
                    marginBottom: "8px",
                  }}
                >
                  {milestone.year}
                </div>
                <h3
                  style={{
                    color: "#1a1a1a",
                    fontSize: "18px",
                    fontWeight: "bold",
                    marginBottom: "8px",
                  }}
                >
                  {milestone.title}
                </h3>
                <p style={{ color: "#555", margin: 0 }}>{milestone.desc}</p>
              </Card>
            ),
          }))}
        />
      </div>

      {/* Values Section */}
      <div style={{ maxWidth: "1200px", margin: "0 auto 80px" }}>
        <h2
          style={{
            fontSize: "32px",
            marginBottom: "40px",
            textAlign: "center",
            background: "linear-gradient(90deg, #ff6f61, #ffb400)",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          Giá trị cốt lõi
        </h2>
        <Row gutter={[24, 24]}>
          {values.map((value, idx) => (
            <Col xs={24} sm={12} lg={6} key={idx}>
              <Card
                style={{
                  background: `linear-gradient(135deg, ${value.color}20, ${value.color}50)`,
                  borderRadius: "16px",
                  textAlign: "center",
                  height: "100%",
                  color: "#333",
                  border: "none",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
                  transition: "transform 0.3s",
                }}
                hoverable
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.05)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                <div
                  style={{
                    fontSize: "36px",
                    marginBottom: "16px",
                    color: value.color,
                  }}
                >
                  {value.icon}
                </div>
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: "bold",
                    marginBottom: "12px",
                    color: "#1a1a1a",
                  }}
                >
                  {value.title}
                </h3>
                <p
                  style={{ fontSize: "14px", lineHeight: "1.6", color: "#555" }}
                >
                  {value.desc}
                </p>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* CTA Section */}
      <div
        style={{ textAlign: "center", marginTop: "80px", marginBottom: "40px" }}
      >
        <h2
          style={{ fontSize: "28px", color: "#1a1a1a", marginBottom: "24px" }}
        >
          Hãy tham gia cộng đồng của chúng tôi
        </h2>
        <Space size="large">
          <Button
            size="large"
            style={{
              background: "linear-gradient(90deg, #ff6f61, #ffb400)",
              border: "none",
              color: "#fff",
              fontSize: "16px",
              padding: "24px 48px",
              fontWeight: "bold",
              transition: "all 0.3s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.05)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            Đặt vé ngay
          </Button>
          <Button
            size="large"
            style={{
              fontSize: "16px",
              padding: "24px 48px",
              color: "#ff6f61",
              borderColor: "#ff6f61",
              fontWeight: "bold",
              transition: "all 0.3s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#ff6f61";
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#ff6f61";
            }}
          >
            Liên hệ chúng tôi
          </Button>
        </Space>
      </div>
    </div>
  );
}
