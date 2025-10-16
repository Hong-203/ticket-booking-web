import React, { useState, useEffect, useMemo } from "react";
import { Card, Badge, Tooltip, Spin } from "antd";
import "./CinemaLayout.css";
import { useDispatch, useSelector } from "react-redux";
import { getSeatAvailable } from "../../stores/Seat/seatApis";
import { getAllShownIn } from "../../stores/ShownIn/shownInApis";

const CinemaLayout = ({
  movieId,
  hallId,
  showtimeId,
  selectedSeats,
  setSelectedSeats,
}) => {
  const dispatch = useDispatch();
  const [seats, setSeats] = useState({});
  const [loading, setLoading] = useState(true);
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const seatList = useSelector((state) => state.seat.seatList || []);
  const currentUserId = storedUser && storedUser.id;

  useEffect(() => {
    const query = `movie_id=${movieId}&hall_id=${hallId}&showtime_id=${showtimeId}`;
    dispatch(getSeatAvailable(query));
  }, [dispatch, movieId, hallId, showtimeId]);

  useEffect(() => {
    if (!Array.isArray(seatList)) return;

    const seatData = {};
    const userSelectedSeats = [];

    seatList.forEach((seat) => {
      // ✅ Xác định loại ghế
      let type = "single";
      if (seat?.name?.startsWith("L")) type = "couple";
      else if (["F", "G", "H", "I", "J"].includes(seat?.name?.charAt(0)))
        type = "vip";

      let status = seat.status;

      if (seat.user_id === currentUserId && status !== "booked") {
        status = "pending";
      }

      if (status === "pending" && seat.user_id !== currentUserId) {
        status = "booked";
      }

      const seatInfo = { ...seat, type, status };
      seatData[seat.name] = seatInfo;

      if (status === "pending" && seat.user_id === currentUserId) {
        userSelectedSeats.push({
          id: seat.id,
          name: seat.name,
          type,
          row: seat.name.charAt(0),
          number: seat.name.slice(1),
          price: seat.price || 0,
        });
      }
    });

    setSeats(seatData);
    setLoading(false);

    if (selectedSeats.length === 0 && userSelectedSeats.length > 0) {
      setSelectedSeats(userSelectedSeats);
    }
  }, [seatList, selectedSeats, currentUserId, setSelectedSeats]);

  const handleSeatClick = (seatName) => {
    const seat = seats[seatName];
    if (!seat) return;

    if (
      seat.status === "booked" ||
      (seat.status === "pending" && seat.user_id !== currentUserId)
    )
      return;

    const isSelected = selectedSeats.some((s) => s.name === seatName);

    if (isSelected) {
      const updated = selectedSeats.filter((s) => s.name !== seatName);
      setSelectedSeats(updated);
    } else {
      const newSeat = {
        id: seat.id,
        name: seat.name,
        type: seat.type,
        row: seat.name.charAt(0),
        number: seat.name.slice(1),
        price: seat.price || 0,
      };
      const updated = [...selectedSeats, newSeat];
      setSelectedSeats(updated);
    }
  };

  const getSeatClassName = (seat) => {
    const isSelected = selectedSeats.some((s) => s.name === seat.name);
    const isBooked =
      seat.status === "booked" ||
      (seat.status === "pending" && seat.user_id !== currentUserId);

    if (isBooked) return `seat ${seat.type} booked`;
    if (isSelected) return `seat ${seat.type} pending`;
    return `seat ${seat.type} empty`;
  };

  const renderSeatRow = (rowLetter, startIndex = 1, endIndex = 24) => {
    const row = [];

    for (let i = startIndex; i <= endIndex; i++) {
      const seatName = `${rowLetter}${i}`;
      const seat = seats[seatName];
      if (!seat) continue;

      row.push(
        <Tooltip
          key={seatName}
          title={`Ghế ${seatName} - ${
            seat.type === "single"
              ? "Ghế đơn"
              : seat.type === "vip"
              ? "Ghế VIP"
              : "Ghế đôi"
          } - ${
            seat.status === "booked"
              ? "Đã đặt"
              : seat.status === "pending"
              ? "Đang chọn"
              : "Có thể chọn"
          }`}
        >
          <div
            className={getSeatClassName(seat)}
            onClick={() => handleSeatClick(seatName)}
          >
            <span className="seat-number">{seatName}</span>
          </div>
        </Tooltip>
      );

      if (rowLetter !== "L" && i === 12) {
        row.push(<div key={`${rowLetter}-gap`} className="seat-gap" />);
      } else if (rowLetter === "L") {
        if (startIndex === 1 && i === 6) {
          row.push(<div key={`${rowLetter}-gap-1`} className="seat-gap" />);
        } else if (startIndex === 13 && i === 18) {
          row.push(<div key={`${rowLetter}-gap-2`} className="seat-gap" />);
        }
      }
    }

    return row;
  };

  const getStatusCount = (status) =>
    Object.values(seats).filter((seat) => seat.status === status).length;

  const currentSelectedSeats = useMemo(
    () => selectedSeats || [],
    [selectedSeats]
  );

  const totalPrice = useMemo(() => {
    return currentSelectedSeats.reduce((total, seat) => {
      return total + (seat.price || 0);
    }, 0);
  }, [currentSelectedSeats]);

  return (
    <div className="cinema-container">
      <Card className="cinema-card">
        {loading ? (
          <div className="loading-container">
            <Spin size="large" />
            <p>Đang tải dữ liệu ghế...</p>
          </div>
        ) : (
          <>
            {/* Màn hình */}
            <div className="screen-container">
              <div className="screen">
                <div className="screen-text">MÀN HÌNH</div>
              </div>
              <div className="screen-shadow" />
            </div>

            <div className="seats-container">
              {/* Ghế thường */}
              <div className="seat-section">
                <h4 className="section-title">Ghế Thường</h4>
                {["A", "B", "C", "D", "E"].map((row) => (
                  <div key={row} className="seat-row">
                    <div className="row-label">{row}</div>
                    <div className="seats-in-row">
                      {renderSeatRow(row, 1, 24)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Ghế VIP */}
              <div className="seat-section">
                <h4 className="section-title">Ghế VIP</h4>
                {["F", "G", "H", "I", "J"].map((row) => (
                  <div key={row} className="seat-row">
                    <div className="row-label">{row}</div>
                    <div className="seats-in-row">
                      {renderSeatRow(row, 1, 24)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Khoảng cách giữa */}
              <div className="section-gap" />

              {/* Ghế đôi */}
              <div className="seat-section">
                <h4 className="section-title">Ghế Đôi</h4>
                <div className="seat-row">
                  <div className="row-label">L</div>
                  <div className="seats-in-row">
                    {renderSeatRow("L", 1, 12)}
                  </div>
                </div>
                <div className="seat-row">
                  <div className="row-label">L</div>
                  <div className="seats-in-row">
                    {renderSeatRow("L", 13, 24)}
                  </div>
                </div>
              </div>
            </div>

            {/* Ghi chú */}
            <div className="legend">
              <div className="legend-item">
                <div className="seat single empty" />
                <span>Ghế trống ({getStatusCount("empty")})</span>
              </div>
              <div className="legend-item">
                <div className="seat single pending" />
                <span>Đang chọn {currentSelectedSeats.length}</span>
              </div>
              <div className="legend-item">
                <div className="seat single booked" />
                <span>Đã đặt ({getStatusCount("booked")})</span>
              </div>
            </div>

            <div className="summary">
              <div className="summary-content">
                <Badge count={currentSelectedSeats.length} showZero>
                  <div className="summary-item">
                    <strong>Ghế đã chọn: {currentSelectedSeats.length}</strong>
                  </div>
                </Badge>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default CinemaLayout;
