import React, { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Progress,
  Table,
  Space,
  Divider,
} from "antd";
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  UserOutlined,
  DollarOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Line } from "@ant-design/plots";
import axios from "axios";

const { Title, Text } = Typography;

export default function Dashboard() {
  const [overview, setOverview] = useState({});
  const [userStats, setUserStats] = useState({});
  const [ticketStats, setTicketStats] = useState({});
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [movieStats, setMovieStats] = useState([]);
  const [growth, setGrowth] = useState(0);
  const baseURL = import.meta.env.VITE_BACKEND_URL;
  useEffect(() => {
    (async () => {
      try {
        const [ov, us, ts, mv, rev] = await Promise.all([
          axios.get(`${baseURL}/statics/overview`),
          axios.get(`${baseURL}/statics/users`),
          axios.get(`${baseURL}/statics/tickets`),
          axios.get(`${baseURL}/statics/movies`),
          axios.get(`${baseURL}/statics/revenue/monthly`),
        ]);

        setOverview(ov.data);
        setUserStats(us.data);
        setTicketStats(ts.data);
        setMovieStats(mv.data);

        const revData = rev.data.map((r) => ({
          ...r,
          revenue: Number(r.revenue),
        }));
        setMonthlyRevenue(revData);

        // Tính phần trăm tăng trưởng
        if (revData.length >= 2) {
          const last = revData[revData.length - 1].revenue;
          const prev = revData[revData.length - 2].revenue;
          const percent = ((last - prev) / prev) * 100;
          setGrowth(percent);
        }
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      }
    })();
  }, []);

  // Config biểu đồ doanh thu
  const revenueConfig = {
    data: monthlyRevenue,
    xField: "month",
    yField: "revenue",
    smooth: true,
    height: 300,
    color: "#00d4ff",
    point: {
      size: 6,
      shape: "circle",
      style: {
        fill: "#fff",
        stroke: "#00d4ff",
        lineWidth: 3,
      },
    },
    areaStyle: { fillOpacity: 0.15 },
    tooltip: {
      formatter: (datum) => ({
        name: "Doanh thu",
        value: `$${datum.revenue.toLocaleString()}`,
      }),
    },
  };

  // Component hiển thị từng thẻ nhỏ
  const StatCard = ({
    icon: Icon,
    label,
    value,
    color,
    bgGradient,
    suffix,
  }) => (
    <Card
      bordered={false}
      style={{
        borderRadius: 16,
        background: bgGradient,
        boxShadow: `0 8px 24px ${color}30`,
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        cursor: "pointer",
        border: `2px solid ${color}20`,
        overflow: "hidden",
        position: "relative",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 16px 40px ${color}50`;
        e.currentTarget.style.transform = "translateY(-8px) scale(1.02)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = `0 8px 24px ${color}30`;
        e.currentTarget.style.transform = "translateY(0) scale(1)";
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -20,
          right: -20,
          width: 100,
          height: 100,
          borderRadius: "50%",
          background: `${color}15`,
        }}
      />
      <Space
        direction="vertical"
        style={{ width: "100%", position: "relative", zIndex: 1 }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: `${color}20`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon style={{ fontSize: 24, color }} />
          </div>
          <Text style={{ color: "#8c8c8c", fontSize: 13, fontWeight: 500 }}>
            {label}
          </Text>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 8,
            paddingLeft: 4,
          }}
        >
          <Title
            level={3}
            style={{ margin: 0, color: "#1f1f1f", fontWeight: 700 }}
          >
            {value}
          </Title>
          {suffix && <span style={{ color }}>{suffix}</span>}
        </div>
      </Space>
    </Card>
  );

  return (
    <div
      style={{
        background:
          "linear-gradient(135deg, #f0f4ff 0%, #e8f0ff 50%, #f0e8ff 100%)",
        minHeight: "100vh",
        // padding: "32px 24px",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <Title
          level={2}
          style={{
            margin: 0,
            background:
              "linear-gradient(120deg, #00d4ff 0%, #7928ca 50%, #ff006e 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            fontSize: 40,
            fontWeight: 800,
          }}
        >
          🎬 Dashboard Quản Lý Phim
        </Title>
        <Text
          style={{
            color: "#a0aec0",
            fontSize: 14,
            marginTop: 8,
            display: "block",
          }}
        >
          ✨ Tổng quan hiệu suất hệ thống hôm nay
        </Text>
      </div>

      {/* Statistics cards */}
      <Row gutter={[20, 20]} style={{ marginBottom: 28 }}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            icon={UserOutlined}
            label="Tổng Người Dùng"
            value={overview.totalUsers || 0}
            color="#00d4ff"
            bgGradient="linear-gradient(135deg, #00d4ff15 0%, #0099cc15 100%)"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            icon={DollarOutlined}
            label="Tổng Doanh Thu"
            value={`${(overview.totalRevenue || 0).toLocaleString("en-US")} đ`}
            color={growth >= 0 ? "#00ff88" : "#ff4466"}
            bgGradient={
              growth >= 0
                ? "linear-gradient(135deg, #00ff8815 0%, #00cc6615 100%)"
                : "linear-gradient(135deg, #ff446615 0%, #cc334415 100%)"
            }
            suffix={
              <Space size={4}>
                {growth >= 0 ? (
                  <ArrowUpOutlined
                    style={{ color: "#00ff88", fontSize: 16, fontWeight: 700 }}
                  />
                ) : (
                  <ArrowDownOutlined
                    style={{ color: "#ff4466", fontSize: 16, fontWeight: 700 }}
                  />
                )}
                <Text
                  style={{
                    color: growth >= 0 ? "#00ff88" : "#ff4466",
                    fontSize: 13,
                    fontWeight: 700,
                  }}
                >
                  {Math.abs(growth).toFixed(1)}%
                </Text>
              </Space>
            }
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            icon={UserOutlined}
            label="Tổng Vé Bán"
            value={overview.totalTickets || 0}
            color="#ffa500"
            bgGradient="linear-gradient(135deg, #ffa50015 0%, #ff8c0015 100%)"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            icon={VideoCameraOutlined}
            label="Tổng Phim"
            value={overview.totalMovies || 0}
            color="#ff006e"
            bgGradient="linear-gradient(135deg, #ff006e15 0%, #cc004d15 100%)"
          />
        </Col>
      </Row>

      {/* Biểu đồ doanh thu */}
      <Card
        bordered={false}
        style={{
          borderRadius: 16,
          background: "linear-gradient(135deg, #f9f9ff 0%, #ffffff 100%)",
          border: "2px solid #00aaff30",
          boxShadow: "0 8px 32px rgba(0, 170, 255, 0.15)",
          marginBottom: 28,
        }}
        title={
          <Title
            level={4}
            style={{ margin: 0, color: "#00d4ff", fontWeight: 700 }}
          >
            💰 Doanh Thu Hàng Tháng
          </Title>
        }
      >
        <Line {...revenueConfig} />
      </Card>

      {/* User Stats + Activity */}
      <Row gutter={[20, 20]} style={{ marginBottom: 28 }}>
        <Col xs={24} lg={12}>
          <Card
            bordered={false}
            style={{
              borderRadius: 16,
              background: "linear-gradient(135deg, #f0f4ff 0%, #ffffff 100%)",
              border: "2px solid #7928ca30",
              boxShadow: "0 8px 32px rgba(121, 40, 202, 0.1)",
            }}
            title={
              <Title
                level={4}
                style={{ margin: 0, color: "#c084fc", fontWeight: 700 }}
              >
                👥 Tổng Quan Người Dùng
              </Title>
            }
          >
            <Space direction="vertical" style={{ width: "100%" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "16px",
                  borderBottom: "2px solid #7928ca20",
                  borderRadius: 8,
                  background: "#7928ca08",
                }}
              >
                <Text strong style={{ color: "#e0e0e0" }}>
                  Tổng Người Dùng:
                </Text>
                <Text
                  style={{ color: "#a78bfa", fontWeight: 700, fontSize: 15 }}
                >
                  {userStats.totalUsers || 0}
                </Text>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "16px",
                  borderBottom: "2px solid #00ff8820",
                  borderRadius: 8,
                  background: "#00ff8808",
                }}
              >
                <Text strong style={{ color: "#e0e0e0" }}>
                  Người Dùng Mới Tháng Này:
                </Text>
                <Text
                  style={{ color: "#00ff88", fontWeight: 700, fontSize: 15 }}
                >
                  {userStats.newUsersThisMonth || 0}
                </Text>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "16px",
                  borderRadius: 8,
                  background: "#ffa50010",
                  border: "2px solid #ffa50020",
                }}
              >
                <Text strong style={{ color: "#e0e0e0" }}>
                  Người Dùng Hoạt Động:
                </Text>
                <Text
                  style={{ color: "#ffa500", fontWeight: 700, fontSize: 15 }}
                >
                  {userStats.activeUsers || 0}
                </Text>
              </div>
            </Space>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card
            bordered={false}
            style={{
              borderRadius: 16,
              background: "linear-gradient(135deg, #f9f9ff 0%, #ffffff 100%)",
              border: "2px solid #ff66b230",
              boxShadow: "0 8px 32px rgba(255, 102, 178, 0.1)",
            }}
            title={
              <Title
                level={4}
                style={{ margin: 0, color: "#ff78c8", fontWeight: 700 }}
              >
                📈 Hoạt Động
              </Title>
            }
          >
            <div style={{ textAlign: "center" }}>
              <Progress
                type="circle"
                percent={75}
                strokeColor={{
                  "0%": "#ff006e",
                  "100%": "#ff78c8",
                }}
                width={150}
                trailColor="#ff006e15"
              />
              <div style={{ marginTop: 24 }}>
                <Text style={{ color: "#e0e0e0" }}>
                  Thanh Toán Hàng Ngày:{" "}
                  <strong style={{ color: "#00d4ff", fontSize: 16 }}>
                    55%
                  </strong>
                </Text>
                <Divider style={{ margin: "12px 0", borderColor: "#404060" }} />
                <Text style={{ color: "#e0e0e0" }}>
                  Sở Thích:{" "}
                  <strong style={{ color: "#ffa500", fontSize: 16 }}>
                    20%
                  </strong>
                </Text>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Bảng Top Movies */}
      <Card
        bordered={false}
        style={{
          borderRadius: 16,
          background: "linear-gradient(135deg, #f9f9ff 0%, #ffffff 100%)",
          border: "2px solid #00cc8830",
          boxShadow: "0 8px 32px rgba(0, 204, 136, 0.1)",
        }}
        title={
          <Title
            level={4}
            style={{ margin: 0, color: "#00ff88", fontWeight: 700 }}
          >
            🎥 Phim Hàng Đầu
          </Title>
        }
      >
        <Table
          pagination={false}
          dataSource={movieStats.map((m, i) => ({
            key: i,
            movie: m.movie,
            tickets: Number(m.ticketsSold),
            revenue: Number(m.revenue),
          }))}
          columns={[
            {
              title: "Tên Phim",
              dataIndex: "movie",
              key: "movie",
              render: (text) => (
                <Text strong style={{ color: "#00d4ff" }}>
                  {text}
                </Text>
              ),
            },
            {
              title: "Vé Bán",
              dataIndex: "tickets",
              key: "tickets",
              align: "center",
              render: (val) => (
                <Text style={{ color: "#ffa500", fontWeight: 600 }}>{val}</Text>
              ),
            },
            {
              title: "Doanh Thu (đ)",
              dataIndex: "revenue",
              key: "revenue",
              align: "right",
              render: (val) => (
                <Text strong style={{ color: "#00ff88", fontSize: 14 }}>
                  {val.toLocaleString()}
                </Text>
              ),
            },
          ]}
          style={{ color: "#e0e0e0" }}
        />
      </Card>
    </div>
  );
}
