import "./HomeCollection.css";
import { useEffect, useState } from "react";
import { Spin } from "antd";
import CollectionCard from "../CollectionCard";
import { getAllMovie } from "../../stores/Movie/movieApis";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const HomeCollection = () => {
  const override = {
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
  };
  const movieList = useSelector((state) => state.movie.movieList || []);
  const [movieData, setMovieData] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(getAllMovie({ status: "now_showing", page: 1, limit: 6 }));
  }, [dispatch, 1]);

  useEffect(() => {
    if (Array.isArray(movieList)) {
      setMovieData(movieList);
      setLoading(false);
    }
  }, [movieList]);

  const latestMoviesCards = movieData.map((latestMovie) => (
    <CollectionCard key={latestMovie.id} {...latestMovie} />
  ));

  const latestMovieCardsDouble = movieData.map((latestMovie) => (
    <CollectionCard key={latestMovie.id + 6} {...latestMovie} />
  ));

  const handlePlayingNow = () => {
    navigate("/phim-dang-cong-chieu");
  };
  return (
    <section className="section-home-collection" id="nowShowing">
      <div className="home-collection-heading-container">
        <h1
          className="heading-secondary heading-collection"
          onClick={() => handlePlayingNow()}
        >
          Đang công chiếu &rarr;
        </h1>
      </div>

      {loading && <Spin style={override} size="large" />}
      {!loading && (
        <div className="home-collection-container">
          <div className="home-collection-inner">{latestMoviesCards}</div>
          <div className="home-collection-inner">{latestMovieCardsDouble}</div>
        </div>
      )}
    </section>
  );
};

export default HomeCollection;
