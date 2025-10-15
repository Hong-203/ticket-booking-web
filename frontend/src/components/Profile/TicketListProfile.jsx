import { List, Typography, Badge, Button, Modal } from "antd";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTicketById } from "../../stores/Ticket/ticketApis";
import TicketModal from "./TicketModalDetail";

const { Text } = Typography;

const TicketList = ({ bookedTickets }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();
  const ticketDetail = useSelector((state) => state.ticket.ticketDetails || {});

  const handleViewDetails = (ticket) => {
    dispatch(getTicketById(ticket.id));
    setIsModalOpen(true); // mở modal ngay, nội dung sẽ tự động cập nhật khi Redux có data
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const getStatusText = (status) => {
    switch (status) {
      case "confirmed":
        return "Đã xác nhận";
      case "pending":
        return "Chờ xác nhận";
      default:
        return status;
    }
  };

  return (
    <div style={{ height: "320px", overflowY: "auto" }}>
      <List
        dataSource={bookedTickets}
        renderItem={(item) => (
          <List.Item
            style={{
              padding: "12px 0",
              borderBottom: "1px solid #f0f0f0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <Text strong>{item.movie?.name}</Text>
              <br />
              <Text type="secondary" style={{ fontSize: "12px" }}>
                {new Date(item.showtime?.showtime_date).toLocaleDateString(
                  "vi-VN"
                )}{" "}
                • {item.hall?.theatre?.name} - {item.hall?.name}
              </Text>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Badge
                status={item.status === "confirmed" ? "success" : "processing"}
                text={getStatusText(item.status)}
              />
              <Button
                type="primary"
                size="small"
                onClick={() => handleViewDetails(item)}
              >
                Xem chi tiết
              </Button>
            </div>
          </List.Item>
        )}
      />

      <Modal
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        width={700}
        centered
      >
        <TicketModal ticketDetail={ticketDetail} />
      </Modal>
    </div>
  );
};

export default TicketList;
