import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, Row, Col, Typography, Tag, Space, Spin, Empty } from "antd";
import {
  EnvironmentOutlined,
  HomeOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import {
  getAllLocation,
  theatreByLocation,
} from "../../stores/Theatre/theatreApis";

const { Title, Text } = Typography;

const TheatrePage = () => {
  const dispatch = useDispatch();
  const [selectedLocation, setSelectedLocation] = useState(null);

  const {
    listLocation,
    theatreByLocation: theatreList,
    loading,
  } = useSelector((state) => state.theatre);

  useEffect(() => {
    dispatch(getAllLocation());
  }, [dispatch]);

  const handleLocationClick = (slugLocation) => {
    setSelectedLocation(slugLocation);
    dispatch(theatreByLocation(slugLocation));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e0f7fa, #fff3e0)",
        padding: "40px 20px",
        marginTop: "64px",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "50px" }}>
          <Title
            level={1}
            style={{
              color: "#ff6f61",
              fontSize: "48px",
              marginBottom: "10px",
              textShadow: "2px 2px 4px rgba(0,0,0,0.15)",
            }}
          >
            🎬 Chọn Rạp Chiếu Phim
          </Title>
          <Text
            style={{
              color: "#333",
              fontSize: "18px",
            }}
          >
            Khám phá các rạp chiếu phim gần bạn
          </Text>
        </div>

        {/* Location Cards */}
        <div style={{ marginBottom: "40px" }}>
          <Title
            level={3}
            style={{
              color: "#0077b6",
              marginBottom: "24px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <EnvironmentOutlined /> Chọn Khu Vực
          </Title>

          {loading && !listLocation ? (
            <div style={{ textAlign: "center", padding: "60px" }}>
              <Spin size="large" />
            </div>
          ) : (
            <Row gutter={[16, 16]}>
              {listLocation?.map((loc) => (
                <Col xs={24} sm={12} md={6} key={loc.slug_location}>
                  <Card
                    hoverable
                    onClick={() => handleLocationClick(loc.slug_location)}
                    style={{
                      borderRadius: "12px",
                      border:
                        selectedLocation === loc.slug_location
                          ? "2px solid #ffb703"
                          : "2px solid transparent",
                      background:
                        selectedLocation === loc.slug_location
                          ? "linear-gradient(135deg, #ffb703, #fb8500)"
                          : "linear-gradient(135deg, #90e0ef, #48cae4)",
                      transition: "all 0.3s ease",
                      transform:
                        selectedLocation === loc.slug_location
                          ? "scale(1.03)"
                          : "scale(1)",
                      boxShadow:
                        selectedLocation === loc.slug_location
                          ? "0 6px 20px rgba(255, 183, 3, 0.3)"
                          : "0 4px 12px rgba(0,0,0,0.08)",
                    }}
                    bodyStyle={{ padding: "16px", textAlign: "center" }}
                  >
                    <EnvironmentOutlined
                      style={{
                        fontSize: "24px",
                        color: "#fff",
                        marginBottom: "8px",
                      }}
                    />
                    <Title
                      level={5}
                      style={{
                        color: "#fff",
                        margin: 0,
                        textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
                      }}
                    >
                      {loc.location}
                    </Title>
                    {selectedLocation === loc.slug_location && (
                      <Tag
                        color="gold"
                        style={{
                          marginTop: "8px",
                          fontSize: "12px",
                          fontWeight: "bold",
                        }}
                      >
                        ✓ Đã chọn
                      </Tag>
                    )}
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </div>

        {/* Theatre List */}
        {selectedLocation && (
          <div
            style={{
              background: "rgba(255, 255, 255, 0.95)",
              borderRadius: "20px",
              padding: "30px",
              boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
            }}
          >
            <Title
              level={3}
              style={{
                marginBottom: "24px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                color: "#0077b6",
              }}
            >
              <HomeOutlined /> Danh Sách Rạp
            </Title>

            {loading ? (
              <div style={{ textAlign: "center", padding: "60px" }}>
                <Spin size="large" />
              </div>
            ) : theatreList?.length > 0 ? (
              <Row gutter={[24, 24]}>
                {theatreList.map((theatre) => (
                  <Col xs={24} md={12} key={theatre.id}>
                    <Card
                      hoverable
                      style={{
                        borderRadius: "12px",
                        border: "2px solid #f0f0f0",
                        transition: "all 0.3s ease",
                        height: "100%",
                        background: "linear-gradient(135deg, #ade8f4, #caf0f8)",
                      }}
                      bodyStyle={{ padding: "24px" }}
                    >
                      <Space
                        direction="vertical"
                        size="middle"
                        style={{ width: "100%" }}
                      >
                        <div>
                          <Title
                            level={4}
                            style={{
                              margin: 0,
                              color: "#0077b6",
                              marginBottom: "8px",
                            }}
                          >
                            🎥 {theatre.name}
                          </Title>
                          <Tag color="#0077b6" style={{ fontSize: "13px" }}>
                            {theatre.location}
                          </Tag>
                        </div>

                        <div
                          style={{
                            background:
                              "linear-gradient(135deg, #0077b615 0%, #0096c715 100%)",
                            padding: "12px",
                            borderRadius: "8px",
                          }}
                        >
                          <Space direction="vertical" size="small">
                            <Text
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                color: "#333",
                              }}
                            >
                              <EnvironmentOutlined
                                style={{ color: "#0077b6" }}
                              />
                              <strong>Địa chỉ:</strong>{" "}
                              {theatre.locationDetails}
                            </Text>
                            <Text
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                color: "#333",
                                fontSize: "12px",
                              }}
                            >
                              <ClockCircleOutlined
                                style={{ color: "#0077b6" }}
                              />
                              Cập nhật: {formatDate(theatre.updated_at)}
                            </Text>
                          </Space>
                        </div>

                        <div
                          style={{
                            marginTop: "8px",
                            paddingTop: "12px",
                            borderTop: "1px solid #f0f0f0",
                          }}
                        >
                          <Tag
                            color="#0077b6"
                            style={{
                              borderRadius: "20px",
                              padding: "4px 12px",
                              fontSize: "12px",
                            }}
                          >
                            {theatre.slug_name}
                          </Tag>
                        </div>
                      </Space>
                    </Card>
                  </Col>
                ))}
              </Row>
            ) : (
              <Empty
                description="Không tìm thấy rạp chiếu phim nào"
                style={{ padding: "40px" }}
              />
            )}
          </div>
        )}

        {!selectedLocation && (
          <div
            style={{
              textAlign: "center",
              background: "rgba(255, 255, 255, 0.9)",
              borderRadius: "16px",
              padding: "60px 30px",
              boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
            }}
          >
            <Text
              style={{
                fontSize: "20px",
                color: "#0077b6",
                fontWeight: "500",
              }}
            >
              👆 Vui lòng chọn khu vực để xem danh sách rạp
            </Text>
          </div>
        )}
      </div>
    </div>
  );
};

export default TheatrePage;
