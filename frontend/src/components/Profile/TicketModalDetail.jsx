import React from "react";
import { Row, Col, Typography, Divider, Image, Tag, Space } from "antd";
import {
  ClockCircleOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  UserOutlined,
  ShoppingOutlined,
  VideoCameraOutlined,
  QrcodeOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const TicketModal = ({ ticketDetail }) => {
  if (!ticketDetail || !ticketDetail.id) return null;

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("vi-VN", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div style={{ padding: "10px" }}>
      <div
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          padding: "16px",
          borderRadius: "6px",
          marginBottom: "10px",
        }}
      >
        <div style={{ padding: "16px", borderRadius: "6px 6px 0 0" }}>
          <Row gutter={12}>
            <Col span={8}>
              <Image
                src={ticketDetail.movie.image_path}
                alt={ticketDetail.movie.name}
                style={{ borderRadius: "6px", width: "100%" }}
                preview={false}
              />
            </Col>
            <Col span={16}>
              <Title level={4} style={{ color: "white", marginTop: 0 }}>
                {ticketDetail.movie.name}
              </Title>
              <Space
                direction="vertical"
                size="small"
                style={{ width: "100%" }}
              >
                <Text
                  style={{ color: "rgba(255,255,255,0.9)", fontSize: "12px" }}
                >
                  <UserOutlined /> Diễn viên: {ticketDetail.movie.top_cast}
                </Text>
                <Text
                  style={{ color: "rgba(255,255,255,0.9)", fontSize: "12px" }}
                >
                  <VideoCameraOutlined /> Định dạng:{" "}
                  <Tag color="gold">{ticketDetail.showtime.show_type}</Tag>
                </Text>
                <Text
                  style={{ color: "rgba(255,255,255,0.9)", fontSize: "12px" }}
                >
                  ⭐ Đánh giá: {ticketDetail.movie.rating}/10
                </Text>
              </Space>
            </Col>
          </Row>
        </div>

        <div style={{ padding: "16px", background: "white" }}>
          <Row gutter={[12, 12]}>
            <Col span={12}>
              <Space
                direction="vertical"
                size="small"
                style={{ width: "100%" }}
              >
                <Text strong style={{ fontSize: "14px", color: "#1890ff" }}>
                  <EnvironmentOutlined /> Rạp Chiếu
                </Text>
                <Text style={{ fontSize: "13px" }}>
                  {ticketDetail.hall.theatre.name}
                </Text>
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  {ticketDetail.hall.theatre.locationDetails}
                </Text>
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  Phòng: {ticketDetail.hall.name}
                </Text>
              </Space>
            </Col>

            <Col span={12}>
              <Space
                direction="vertical"
                size="small"
                style={{ width: "100%" }}
              >
                <Text strong style={{ fontSize: "14px", color: "#1890ff" }}>
                  <CalendarOutlined /> Thời Gian
                </Text>
                <Text style={{ fontSize: "13px" }}>
                  {formatDate(ticketDetail.showtime.showtime_date)}
                </Text>
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  <ClockCircleOutlined /> Giờ chiếu:{" "}
                  {ticketDetail.showtime.movie_start_time}
                </Text>
              </Space>
            </Col>
          </Row>

          <Divider style={{ margin: "12px 0" }} />

          <Row gutter={[12, 12]}>
            <Col span={12}>
              <Space
                direction="vertical"
                size="small"
                style={{ width: "100%" }}
              >
                <Text strong style={{ fontSize: "14px", color: "#1890ff" }}>
                  🎫 Ghế Ngồi
                </Text>
                {ticketDetail.seats.map((seatInfo) => (
                  <Tag
                    key={seatInfo.id}
                    color="red"
                    style={{
                      fontSize: "14px",
                      padding: "4px 8px",
                      marginTop: "4px",
                    }}
                  >
                    {seatInfo.seat.name}
                  </Tag>
                ))}
                <Text
                  type="secondary"
                  style={{
                    marginTop: "4px",
                    display: "block",
                    fontSize: "12px",
                  }}
                >
                  {ticketDetail.seats[0].seat.description}
                </Text>
              </Space>
            </Col>

            <Col span={12}>
              {ticketDetail.concessions.length > 0 && (
                <Space
                  direction="vertical"
                  size="small"
                  style={{ width: "100%" }}
                >
                  <Text strong style={{ fontSize: "14px", color: "#1890ff" }}>
                    <ShoppingOutlined /> Đồ Ăn & Nước
                  </Text>
                  {ticketDetail.concessions.map((concession) => (
                    <div key={concession.item.id} style={{ marginTop: "4px" }}>
                      <Text style={{ fontSize: "12px" }}>
                        {concession.item.name}
                      </Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: "12px" }}>
                        Số lượng: {concession.quantity} x{" "}
                        {formatPrice(concession.item.price)}
                      </Text>
                    </div>
                  ))}
                </Space>
              )}
            </Col>
          </Row>

          <Divider style={{ margin: "12px 0" }} />

          <div style={{ textAlign: "center", marginBottom: "12px" }}>
            <Text
              strong
              style={{
                fontSize: "14px",
                color: "#1890ff",
                display: "block",
                marginBottom: "8px",
              }}
            >
              <QrcodeOutlined /> Mã Vé
            </Text>
            <Image
              src={ticketDetail?.barcode?.barcodeUrl || ""}
              alt="Barcode"
              style={{ maxWidth: "200px" }}
              preview={false}
            />
            <div style={{ marginTop: "4px" }}>
              <Text type="secondary" style={{ fontSize: "12px" }}>
                Mã: {ticketDetail?.barcode?.code || ""}
              </Text>
              <br />
              <Tag
                color={
                  ticketDetail?.barcode?.status === "ACTIVE" ? "green" : "red"
                }
                style={{ marginTop: "2px", fontSize: "12px" }}
              >
                {ticketDetail?.barcode?.status || ""}
              </Tag>
            </div>
          </div>

          <Divider style={{ margin: "12px 0" }} />

          <Row justify="space-between" style={{ fontSize: "14px" }}>
            <Col>
              <Space direction="vertical" size="small">
                <div>
                  <Text>Tiền ghế:</Text>
                  <Text strong style={{ marginLeft: "4px" }}>
                    {formatPrice(ticketDetail.seat_total_price)}
                  </Text>
                </div>
                <div>
                  <Text>Tiền đồ ăn:</Text>
                  <Text strong style={{ marginLeft: "4px" }}>
                    {formatPrice(ticketDetail.concession_total_price)}
                  </Text>
                </div>
              </Space>
            </Col>
            <Col>
              <div
                style={{
                  textAlign: "right",
                  background: "#f0f0f0",
                  padding: "8px 12px",
                  borderRadius: "6px",
                }}
              >
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  Tổng cộng
                </Text>
                <br />
                <Title level={4} style={{ margin: 0, color: "#ff4d4f" }}>
                  {formatPrice(ticketDetail.total_price)}
                </Title>
              </div>
            </Col>
          </Row>
        </div>

        <div
          style={{
            background: "#f5f5f5",
            padding: "8px",
            textAlign: "center",
            borderRadius: "0 0 6px 6px",
          }}
        >
          <Text type="secondary" style={{ fontSize: "10px" }}>
            Vui lòng xuất trình vé này tại quầy để nhận ghế và đồ ăn
          </Text>
        </div>
      </div>
    </div>
  );
};

export default TicketModal;
