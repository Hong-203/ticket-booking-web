import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Spin, Empty, Pagination } from "antd";
import { getAllMovieCS } from "../../stores/Movie/movieApis";
import CollectionCard from "../../components/CollectionCard";
import "./MoviePage.css";
import { DoubleLeftOutlined, DoubleRightOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const ComingSoonPage = () => {
  const dispatch = useDispatch();
  const movieListCS = useSelector((state) => state.movie.movieListCS || []);
  const [page, setPage] = useState(1);
  const [movieData, setMovieData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(getAllMovieCS({ status: "coming_soon", page: page, limit: 12 }));
  }, [dispatch, page]);

  useEffect(() => {
    if (Array.isArray(movieListCS)) {
      setMovieData(movieListCS);
      setLoading(false);
    }
  }, [movieListCS]);
  const handleNow = () => {
    navigate("/phim-dang-cong-chieu");
  };
  return (
    <div className="all-movie-page">
      <div className="movie-header-container">
        <h2 className="movie-section-title playing-now">🎬 Phim sắp chiếu</h2>
        <h2
          className="movie-section-title upcoming"
          onClick={() => handleNow()}
        >
          📅 Phim đang chiếu{" "}
          <DoubleRightOutlined className="arrow-icon-all-movie" />
        </h2>
      </div>

      {loading ? (
        <div className="loading-container">
          <Spin size="large" />
        </div>
      ) : movieData.length > 0 ? (
        <>
          <div className="movie-grid">
            {movieData.map((movie) => (
              <CollectionCard key={movie.id} {...movie} />
            ))}
          </div>

          <div className="pagination-container">
            <Pagination
              current={page}
              total={12}
              pageSize={12}
              onChange={(newPage) => {
                setPage(newPage);
                setLoading(true);
                dispatch(
                  getAllMovieCS({
                    status: "coming_soon",
                    page: newPage,
                    limit: 12,
                  })
                );
              }}
              showSizeChanger={false}
            />
          </div>
        </>
      ) : (
        <Empty description="Không tìm thấy phim sắp chiếu" />
      )}
    </div>
  );
};

export default ComingSoonPage;
