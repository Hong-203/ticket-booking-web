import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { Spin } from "antd";
import "./SearchPage.css";
import { getAllMovie } from "../../stores/Movie/movieApis";
import CollectionCard from "../../components/CollectionCard";

const SearchPage = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const movieList = useSelector((state) => state.movie.movieList || []);
  const loading = useSelector((state) => state.movie.loading);

  // Lấy query string ?q=
  const query = new URLSearchParams(location.search).get("search") || "";

  useEffect(() => {
    if (query.trim()) {
      dispatch(getAllMovie({ search: query, page: 1, limit: 20 }));
    }
  }, [dispatch, query]);

  return (
    <section className="section-search">
      <h2 className="search-heading">
        Kết quả tìm kiếm cho: <span>"{query}"</span>
      </h2>

      {loading ? (
        <Spin style={{ display: "block", margin: "2rem auto" }} size="large" />
      ) : movieList.length > 0 ? (
        <div className="search-result-grid">
          {movieList.map((movie) => (
            <CollectionCard key={movie.id} {...movie} />
          ))}
        </div>
      ) : (
        <p className="search-empty">Không tìm thấy phim nào phù hợp 😥</p>
      )}
    </section>
  );
};

export default SearchPage;
