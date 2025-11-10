import TicketDetail from "../components/TicketDetail/TicketDetail";
import AboutUsPage from "../pages/AboutUsPage/AboutUsPage";
import AdminPageHome from "../pages/AdminPage/AdminPageHome/AdminPageHome";
import AdminShowin from "../pages/AdminPage/AdminShownIn/AdminShowin";
import AllMoviePage from "../pages/AllMoviePage/AllMoviePage";
import ComingSoonPage from "../pages/AllMoviePage/ComingSoonPage";
import AuthSuccess from "../pages/AuthSuccess/AuthSuccess";
import BookingPage from "../pages/BookingPage/BookingPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage/ForgotPasswordPage";
import HomePage from "../pages/Home/HomePage";
import Login from "../pages/Login/Login";
import MovieDetail from "../pages/MovieDetail/MovieDetail";
import MovieShowtime from "../pages/MovieShowTime/MovieShowTime";
import NotPoundPage from "../pages/NotPoundPage/NotPoundPage";
import PaymentPage from "../pages/PaymentPage/PaymentPage";
import PaymentSuccess from "../pages/PaymentSuccess/PaymentSuccess";
import ProfilePage from "../pages/Profile/Profile";
import Register from "../pages/Register/Register";
import SearchPage from "../pages/SearchPage/SearchPage";
import TheatrePage from "../pages/TheatrePage/TheatrePage";

export const routes = [
  {
    path: "/",
    page: HomePage,
    isShowHeader: true,
  },
  {
    path: "/search",
    page: SearchPage,
    isShowHeader: true,
  },
  {
    path: "/phim-dang-cong-chieu",
    page: AllMoviePage,
    isShowHeader: true,
  },
  {
    path: "/phim-sap-chieu",
    page: ComingSoonPage,
    isShowHeader: true,
  },
  {
    path: `/movie-detail/:slug`,
    page: MovieDetail,
    isShowHeader: true,
  },
  {
    path: `/movie-show-time/:slug`,
    page: MovieShowtime,
    isShowHeader: true,
  },
  {
    path: `/:slug/seat/:movieId/:hallId/:showtimeId`,
    page: BookingPage,
    isShowHeader: true,
  },
  {
    path: `/payment/:ticketId`,
    page: PaymentPage,
    isShowHeader: true,
  },
  {
    path: "/payment-success",
    page: PaymentSuccess,
    isShowHeader: true,
  },
  {
    path: "/login",
    page: Login,
  },
  {
    path: "/forgot-password",
    page: ForgotPasswordPage,
  },
  {
    path: "/auth-success",
    page: AuthSuccess,
  },
  {
    path: "/admin",
    page: AdminPageHome,
  },
  {
    path: "/admin/shownin",
    page: AdminShowin,
  },
  {
    path: "/signup",
    page: Register,
  },
  {
    path: "/profile",
    page: ProfilePage,
  },
  {
    isShowHeader: true,
    path: "/aboutus",
    page: AboutUsPage,
  },
  {
    isShowHeader: true,
    path: "/theatre",
    page: TheatrePage,
  },
  {
    path: "*",
    page: NotPoundPage,
  },
];
//PaymentSuccess
