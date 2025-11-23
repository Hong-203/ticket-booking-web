import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getMovieBySlug } from "../../stores/Movie/movieApis";
import { Tag, Typography, Spin, Row, Col, Button } from "antd"; // Removed Descriptions, Image, Divider
import "./MovieDetail.css";
import bgDetail from "../../assets/image.png";
import { toast } from "react-toastify";
import { ArrowLeftOutlined } from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;

const MovieDetail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { slug } = useParams();
  const movieDetail = useSelector((state) => state.movie.movieDetails);
  const [loading, setLoading] = useState(true);
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const currentUserId = storedUser && storedUser.id;
  useEffect(() => {
    dispatch(getMovieBySlug(slug)).finally(() => setLoading(false));
  }, [dispatch, slug]);

  if (loading || !movieDetail) {
    return <Spin className="movie-detail__loading" size="large" />;
  }

  const handleByShownIn = () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const currentUserId = storedUser && storedUser.id;

    if (!currentUserId) {
      toast.error("Vui lòng đăng nhập trước khi đặt vé!");
      navigate("/login");
    } else {
      navigate(`/movie-show-time/${slug}`);
    }
  };

  const {
    name,
    image_path,
    language,
    synopsis,
    rating,
    duration,
    top_cast,
    release_date,
    trailer_url,
    directors,
    genres,
  } = movieDetail;

  return (
    <div className="movie-detail__wrapper">
      {/* Hero Section */}
      <div
        className="movie-detail__hero"
        style={{ backgroundImage: `url(${bgDetail})` }}
      >
        <div className="movie-detail__hero-overlay">
          <div className="movie-detail__hero-content">
            <img
              src={image_path}
              alt={name}
              className="movie-detail__hero-poster"
            />
            <div className="movie-detail__hero-info">
              <Title level={1} className="movie-detail__title">
                {name}
              </Title>
              <Paragraph className="movie-detail__meta">
                <Text className="text-detail-movie-ss">{duration}</Text> |{" "}
                <Text className="text-detail-movie-ss">{language}</Text> |{" "}
                {/* <Text className="text-detail-movie-ss">DBMI: {rating}</Text> */}
              </Paragraph>
              <div className="movie-detail__tags">
                {genres?.map((g, i) => (
                  <Tag color="green" key={i}>
                    {g.genre}
                  </Tag>
                ))}
              </div>
              <Paragraph className="movie-detail__synopsis-short">
                {synopsis?.substring(0, 150)}... {/* Short synopsis for hero */}
              </Paragraph>
              <div className="movie-buy-ticket">
                <Button
                  type="primary"
                  size="large"
                  onClick={() => handleByShownIn()}
                >
                  Mua vé
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="movie-detail__content">
        <Row gutter={[32, 32]}>
          <Col xs={24} lg={13}>
            <Title level={3}>Tóm tắt</Title>
            <Paragraph className="movie-detail__synopsis-full">
              {synopsis}
            </Paragraph>

            <Title level={3} style={{ marginTop: "32px" }}>
              Diễn viên & đoàn làm phim
            </Title>
            <div className="movie-detail__section">
              <Text strong>Diễn viên:</Text> {top_cast}
            </div>
            <div className="movie-detail__section">
              <Text strong>Đạo diễn:</Text>{" "}
              {directors?.map((d, i) => (
                <Tag color="blue" key={i}>
                  {d.director}
                </Tag>
              ))}
            </div>
          </Col>

          <Col xs={24} lg={11}>
            <Title level={3}>Chi tiết phim</Title>
            <div className="movie-detail__section">
              <Text strong>Ngày công chiếu:</Text> {release_date}
            </div>
            <div className="movie-detail__section">
              <Text strong>Ngôn ngữ:</Text> {language}
            </div>
            <div className="movie-detail__section">
              <Text strong>Thời gian chiếu:</Text> {duration}
            </div>
            {/* <div className="movie-detail__section">
              <Text strong>DBMI:</Text> {rating}
            </div> */}

            {trailer_url && (
              <>
                <Title level={3} style={{ marginTop: "32px" }}>
                  Trailer
                </Title>
                <div className="movie-detail__trailer-wrapper">
                  <iframe
                    width="100%"
                    height="250"
                    src={trailer_url.replace("watch?v=", "embed/")}
                    title={`${name} Trailer`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </>
            )}
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default MovieDetail;
