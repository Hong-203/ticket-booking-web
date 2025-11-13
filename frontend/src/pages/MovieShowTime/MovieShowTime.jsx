import React, { useState, useMemo, useEffect } from "react";
import {
  Card,
  Tag,
  Button,
  Row,
  Col,
  Typography,
  Image,
  Space,
  Divider,
  Select,
} from "antd";
import {
  ArrowLeftOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  ReloadOutlined,
  StarFilled,
} from "@ant-design/icons";
import "./MovieShowtime.css";
import { useDispatch, useSelector } from "react-redux";
import { getAllShownIn } from "../../stores/ShownIn/shownInApis";
import {
  getAllTheatre,
  theatreByLocation,
} from "../../stores/Theatre/theatreApis";
import { useNavigate, useParams } from "react-router-dom";
import CinemaLayout from "../../components/CinemaLayout/CinemaLayout";
const { Title, Text, Paragraph } = Typography;

const MovieShowtime = () => {
  const { slug } = useParams();
  const shownInList = useSelector((state) => state.shownIn.shownInList || []);
  const listTheatreByLocation = useSelector(
    (state) => state.theatre.theatreByLocation || []
  );
  const [theatres, setTheatres] = useState([]);
  const selectedLocation = useSelector(
    (state) => state.selection.selectedLocation
  );
  const [filterMovieId, setFilterMovieId] = useState("");
  const [filterTheatreId, setFilterTheatreId] = useState("");
  const [filterDate, setFilterDate] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const query = slug ? `slug_name=${slug}` : "";
    dispatch(getAllShownIn(query));
    if (selectedLocation) {
      dispatch(theatreByLocation(selectedLocation));
    }
  }, [dispatch, slug, selectedLocation]);

  useEffect(() => {
    if (Array.isArray(listTheatreByLocation)) {
      setTheatres(listTheatreByLocation);
    }
    if (Array.isArray(listTheatreByLocation)) {
      setTheatres(listTheatreByLocation);
    }
  }, [listTheatreByLocation]);

  const fetchFilteredData = () => {
    const params = new URLSearchParams();
    if (filterMovieId) params.append("movie_id", filterMovieId);
    if (filterTheatreId) params.append("theatre_id", filterTheatreId);
    if (filterDate) params.append("showtime_date", filterDate);
    dispatch(getAllShownIn(params.toString()));
  };
  const handleClearFilter = () => {
    setFilterMovieId("");
    setFilterTheatreId("");
    setFilterDate("");
    dispatch(getAllShownIn());
  };

  const processedData = useMemo(() => {
    if (!shownInList.length) return { movie: null, dates: [] };

    const movie = shownInList[0].movie;

    const dateGroups = shownInList.reduce((acc, item) => {
      const date = item.showtime.showtime_date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(item);
      return acc;
    }, {});

    const sortedDates = Object.keys(dateGroups)
      .sort()
      .map((date) => {
        const dateShowtimes = dateGroups[date];

        const theatreGroups = dateShowtimes.reduce((acc, item) => {
          const theatreId = item.hall.theatre.id;
          if (!acc[theatreId]) {
            acc[theatreId] = {
              theatre: item.hall.theatre,
              showtimes: [],
            };
          }
          acc[theatreId].showtimes.push({
            ...item.showtime,
            hall: item.hall,
          });
          return acc;
        }, {});

        return {
          date,
          theatres: Object.values(theatreGroups),
        };
      });

    return { movie, dates: sortedDates };
  }, [shownInList]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("vi-VN", options);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatTime = (timeString) => {
    if (timeString === "00:00") return "00:00";
    return timeString;
  };

  if (!processedData.movie) {
    return (
      <div
        className="empty-state"
        style={{ textAlign: "center", padding: "40px 0", color: "#fff" }}
      >
        <img
          src="https://cdn-icons-png.flaticon.com/512/7486/7486791.png"
          alt="No showtimes"
          style={{ width: 200, marginBottom: 24, opacity: 0.7 }}
        />
        <Title level={3}>Hiện chưa có suất chiếu nào cho phim này</Title>
        <Paragraph type="secondary">
          Có thể rạp chưa cập nhật lịch chiếu, hoặc bạn đã lọc theo tiêu chí
          chưa có dữ liệu phù hợp. Vui lòng thử lại sau hoặc kiểm tra lại các bộ
          lọc bạn đã chọn.
        </Paragraph>
        <div style={{ marginTop: 24, color: "#fff" }}>
          <Button
            type="primary"
            icon={<ReloadOutlined />}
            onClick={() => window.location.reload()}
            style={{ marginRight: 8, color: "#fff" }}
          >
            Tải lại trang
          </Button>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => window.history.back()}
          >
            Quay lại
          </Button>
        </div>
      </div>
    );
  }

  const { movie, dates } = processedData;
  const handleSeats = (hall_id, showtime_id) => {
    const movieId = movie.id;
    const hallId = hall_id;
    const showtimeId = showtime_id;
    const slug = movie.slug;
    navigate(`/${slug}/seat/${movieId}/${hallId}/${showtimeId}`);
  };
  return (
    <>
      <div className="movie-showtime-container">
        {/* Movie Header */}
        <div className="movie-header">
          <div className="movie-info">
            <div className="movie-poster">
              <Image
                width={200}
                height={300}
                src={movie.image_path}
                alt={movie.name}
                style={{ objectFit: "cover" }}
                fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAAEsCAYAAACvoiLyAAAACXBIWXMAAAsTAAALEwEAmpwYAAAKT2lDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVNnVFPpFj333vRCS4iAlEtvUhUIIFJCi4AUkSYqIQkQSoghodkVUcERRUUEG8igiAOOjoCMFVEsDIoK2AfkIaKOg6OIisr74Xuja9a89+bN/rXXPues852zzwfACAyWSDNRNYAMqUIeEeCDx8TG4eQuQIEKJHAAEAizZCFz/SMBAPh+PDwrIsAHvgABeNMLCADATZvAMByH/w/qQplcAYCEAcB0kThLCIAUAEB6jkKmAEBGAYCdmCZTAKAEAGDLY2LjAFAtAGAnf+bTAICd+Jl7AQBblCEVAaCRACATZYhEAGg7AKzPVopFAFgwABRmS8Q5ANgtADBJV2ZIALC3AMDOEAuyAAgMADBRiIUpAAR7AGDIIyN4AISZABRG8lc88SuuEOcqAAB4mbI8uSQ5RYFbCC1xB1dXLh4ozkkXKxQ2YQJhmkAuwnmZGTKBNA/g88wAAKCRFRHgg/P9eM4Ors7ONo62Dl8t6r8G/yJiYuP+5c+rcEAAAOF0ftH+LC+zGoA7BoBt/qIl7gRoXgugdfeLZrIPQLUAoOnaV/Nw+H48PEWhkLnZ2eXk5NhKxEJbYcpXff5nwl/AV/1s+X48/Pf14L7iJIEyXYFHBPjgwsz0TKUcz5IJhGLc5o9H/LcL//wd0yLESWK5WCoU41EScY5EmozzMqUiiUKSKcUl0v9k4t8s+wM+3zUAsGo+AXuRLahdYwP2SycQWHTA4vcAAPK7b8HUKAgDgGiD4c93/+8//UegJQCAZkmScQAAXkQkLlTKsz/HCAAARKCBKrBBG/TBGCzABhzBBdzBC/xgNoRCJMTCQhBCCmSAHHJgKayCQiiGzbAdKmAv1EAdNMBRaIaTcA4uwlW4Dj1wD/phCJ7BKLyBCQRByAgTYSHaiAFiilgjjggXmYX4IcFIBBKLJCDJiBRRIkuRNUgxUopUIFVIHfI9cgI5h1xGupE7yAAygvyGvEcxlIGyUT3UDLVDuag3GoRGogvQZHQxmo8WoJvQcrQaPYw2oefQq2gP2o8+Q8cwwOgYBzPEbDAuxsNCsTgsCZNjy7EirAyrxhqwVqwDu4n1Y8+xdwQSgUXACTYEd0IgYR5BSFhMWE7YSKggHCQ0EdoJNwkDhFHCJyKTqEu0JroR+cQYYjIxh1hILCPWEo8TLxB7iEPENyQSiUMyJ7mQAkmxpFTSEtJG0m5SI+ksqZs0SBojk8naZGuyBzmULCAryIXkneTD5DPkG+Qh8lsKnWJAcaT4U+IoUspqShnlEOU05QZlmDJBVaOaUt2ooVQRNY9aQq2htlKvUYeoEzR1mjnNgxZJS6WtopXTGmgXaPdpr+h0uhHdlR5Ol9BX0svpR+iX6AP0dwwNhhWDx4hnKBmbGAcYZxl3GK+YTKYZ04sZx1QwNzHrmOeZD5lvVVgqtip8FZHKCpVKlSaVGyovVKmqpqreqgtV81XLVI+pXlN9rkZVM1PjqQnUlqtVqp1Q61MbU2epO6iHqmeob1Q/pH5Z/YkGWcNMw09DpFGgsV/jvMYgC2MZs3gsIWsNq4Z1gTXEJrHN2Xx2KruY/R27iz2qqaE5QzNKM1ezUvOUZj8H45hx+Jx0TgnnKKeX836K3hTvKeIpG6Y0TLkxZVxrqpaXllirSKtRq0frvTau7aedpr1Fu1n7gQ5Bx0onXCdHZ4/OBZ3nU9lT3acKpxZNPTr1ri6qa6UbobtEd79up+6Ynr5egJ5Mb6feeb3n+hx9L/1U/W36p/VHDFgGswwkBtsMzhg8xTVxbzwdL8fb8VFDXcNAQ6VhlWGX4YSRudE8o9VGjUYPjGnGXOMk423GbcajJgYmISZLTepN7ppSTbmmKaY7TDtMx83MzaLN1pk1mz0x1zLnm+eb15vft2BaeFostqi2uGVJsuRaplnutrxuhVo5WaVYVVpds0atna0l1rutu6cRp7lOk06rntZnw7Dxtsm2qbcZsOXYBtuutm22fWFnYhdnt8Wuw+6TvZN9un2N/T0HDYfZDqsdWh1+c7RyFDpWOt6azpzuP33F9JbpL2dYzxDP2DPjthPLKcRpnVOb00dnF2e5c4PziIuJS4LLLpc+Lpsbxt3IveRKdPVxXeF60vWdm7Obwu2o26/uNu5p7ofcn8w0nymeWTNz0MPIQ+BR5dE/C5+VMGvfrH5PQ0+BZ7XnIy9jL5FXrdewt6V3qvdh7xc+9j5yn+M+4zw33jLeWV/MN8C3yLfLT8Nvnl+F30N/I/9k/3r/0QCngCUBZwOJgUGBWwL7+Hp8Ib+OPzrbZfay2e1BjKC5QRVBj4KtguXBrSFoyOyQrSH355jOkc5pDoVQfujW0Adh5mGLw34MJ4WHhVeGP45wiFga0TGXNXfR3ENz30T6RJZE3ptnMU85ry1KNSo+qi5qPNo3ujS6P8YuZlnM1VidWElsSxw5LiquNm5svt/87fOH4p3iC+N7F5gvyF1weaHOwvSFpxapLhIsOpZATIhOOJTwQRAqqBaMJfITdyWOCnnCHcJnIi/RNtGI2ENcKh5O8kgqTXqS7JG8NXkkxTOlLOW5hCepkLxMDUzdmzqeFpp2IG0yPTq9MYOSkZBxQqohTZO2Z+pn5mZ2y6xlhbL+xW6Lty8elQfJa7OQrAVZLQq2QqboVFoo1yoHsmdlV2a/zYnKOZarnivN7c="
              ></Image>
            </div>
            <div className="movie-details">
              <Title level={1}>{movie.name}</Title>
              <div className="movie-meta">
                <div className="meta-item">
                  <span className="rating-badge">
                    <StarFilled />
                    {movie.rating}
                  </span>
                </div>
                <div className="meta-item">
                  <ClockCircleOutlined />
                  <span>{movie.duration}</span>
                </div>
                <div className="meta-item">
                  <span>{movie.language}</span>
                </div>
              </div>
              <Paragraph
                style={{
                  color: "rgba(255,255,255,0.9)",
                  fontSize: "1rem",
                  marginBottom: "12px",
                }}
              >
                {movie.synopsis}
              </Paragraph>
              <Text style={{ color: "rgba(255,255,255,0.8)" }}>
                <strong>Diễn viên:</strong> {movie.top_cast}
              </Text>
            </div>
          </div>
        </div>

        <Row
          className="showtime-filters-row"
          gutter={16}
          style={{ marginBottom: 16 }}
        >
          <Col span={6}>
            <Select
              style={{ width: "100%" }}
              placeholder="Chọn rạp chiếu"
              value={filterTheatreId || undefined}
              onChange={setFilterTheatreId}
              allowClear
            >
              {theatres.map((theatre) => (
                <Select.Option key={theatre.id} value={theatre.id}>
                  {`${theatre.name}`}
                </Select.Option>
              ))}
            </Select>
          </Col>
          <Col span={6}>
            <Select
              style={{ width: "100%" }}
              placeholder="Chọn ngày chiếu"
              value={filterDate || undefined}
              onChange={setFilterDate}
              allowClear
            >
              {dates.map((d) => (
                <Select.Option key={d.date} value={d.date}>
                  {d.date}
                </Select.Option>
              ))}
            </Select>
          </Col>

          <Col span={6}>
            <Space>
              <Button type="primary" onClick={fetchFilteredData}>
                Lọc
              </Button>
              <Button onClick={handleClearFilter}>Xoá lọc</Button>
            </Space>
          </Col>
        </Row>
        {dates.map(({ date, theatres }) => (
          <div key={date} className="showtime-section">
            <div className="date-header">
              <Title level={2}>
                <CalendarOutlined />
                {formatDate(date)}
              </Title>
            </div>

            {theatres.map(({ theatre, showtimes }) => (
              <div key={theatre.id} className="theatre-card">
                <div className="theatre-header">
                  <div>
                    <Title level={3} className="theatre-name">
                      {theatre.name}
                    </Title>
                    <div className="theatre-location">
                      <EnvironmentOutlined />
                      <span>{theatre.locationDetails}</span>
                    </div>
                  </div>
                </div>

                <div className="showtime-grid">
                  {showtimes.map((showtime) => (
                    <Button
                      key={showtime.id}
                      className="showtime-button"
                      onClick={() => handleSeats(showtime.hall.id, showtime.id)}
                    >
                      <div className="showtime-time">
                        {formatTime(showtime.movie_start_time)}
                      </div>
                      <Tag className="showtime-type" color="blue">
                        {showtime.show_type}
                      </Tag>
                      <div className="showtime-price">
                        {formatPrice(showtime.price_per_seat)}
                      </div>
                      <Text type="secondary" style={{ fontSize: "0.8rem" }}>
                        {showtime.hall.name} - {showtime.hall.totalSeats} ghế
                      </Text>
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
};

export default MovieShowtime;
