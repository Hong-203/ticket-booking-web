import React, { useEffect, useState } from "react";
import { Carousel, Rate } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import "./MovieSlider.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllMovieCS } from "../../stores/Movie/movieApis";

const MovieSlider = () => {
  const movieListCS = useSelector((state) => state.movie.movieListCS || []);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    dispatch(getAllMovieCS({ status: "coming_soon", page: 1, limit: 6 }));
  }, [dispatch, 1]);
  useEffect(() => {
    if (Array.isArray(movieListCS)) {
      setMovies(movieListCS);
      setLoading(false);
    }
  }, [movieListCS]);
  const CustomArrow = ({ direction, onClick }) => (
    <div className={`custom-arrow ${direction}`} onClick={onClick}>
      {direction === "prev" ? <LeftOutlined /> : <RightOutlined />}
    </div>
  );
  const getYoutubeThumbnail = (url) => {
    try {
      const urlObj = new URL(url);
      const videoId = urlObj.searchParams.get("v");
      if (videoId) {
        return `https://img.youtube.com/vi/${videoId}/sddefault.jpg`;
      }
      return "";
    } catch {
      return "";
    }
  };
  const handleComingSoon = () => {
    navigate("/phim-sap-chieu");
  };
  return (
    <div className="movie-slider-container">
      <div className="home-collection-heading-container">
        <h1
          className="heading-secondary-skc heading-collection"
          onClick={() => handleComingSoon()}
        >
          Sắp khởi chiếu &rarr;
        </h1>
      </div>
      <Carousel
        autoplay
        autoplaySpeed={5000}
        effect="fade"
        arrows
        prevArrow={<CustomArrow direction="prev" />}
        nextArrow={<CustomArrow direction="next" />}
        dotPosition="bottom"
      >
        {movieListCS.map((movie) => (
          <div key={movie.id} className="slide-item">
            <div
              className="slide-background"
              style={{
                backgroundImage: `url(${getYoutubeThumbnail(
                  movie.trailer_url
                )})`,
              }}
            >
              <div className="slide-overlay"></div>
              <div className="slide-content">
                <div className="movie-info">
                  <h1 className="movie-title-hori">{movie.name}</h1>
                  <div className="movie-meta">
                    <span className="movie-year">{movie.release_date}</span>
                    <span className="separator">•</span>
                    <span className="movie-duration">{movie.duration}</span>
                    <span className="separator">•</span>
                    {/* <div className="movie-rating">
                      {movie.rating} <span className="star-icon">★</span>
                    </div> */}
                  </div>
                  {/* <div className="movie-genres">
                    {" "} */}
                  {movie.genres.map((genre, index) => (
                    <div key={index} className="movie-genres">
                      {genre.genre}
                    </div>
                  ))}
                  {/* </div> */}
                </div>

                <div className="characters-section">
                  {movie.directors.map((character, index) => (
                    <div key={index} className="character-item">
                      {character.director}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default MovieSlider;
