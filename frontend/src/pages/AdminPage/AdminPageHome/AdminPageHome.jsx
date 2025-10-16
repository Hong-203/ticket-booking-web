import React, { useState } from "react";
import { Layout, Menu, Button } from "antd";
import {
  FileTextOutlined,
  CommentOutlined,
  UserOutlined,
  ShoppingOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import "./AdminPageHome.css";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import AdminAccount from "../AdminAccount/AdminAccount";
import AdminTheatre from "../AdminTheatre/AdminTheatre";
import AdminFeature from "../AdminFeature/AdminFeature";
import AdminHall from "../AdminHall/AdminHall";
import AdminShowtime from "../AdminShowtime/AdminShowtime";
import AdminMovie from "../AdminMovie/AdminMovie";
import AdminShowin from "../AdminShownIn/AdminShowin";
import Dashboard from "../Dashboard/Dashboard";
const { Header, Sider, Content } = Layout;

const AdminPageHome = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState("articles");
  const user = JSON.parse(localStorage.getItem("user"));
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };
  const renderContent = () => {
    switch (selectedKey) {
      case "dashboard":
        return <Dashboard />;
      case "movie":
        return <AdminMovie />;
      case "shownin":
        return <AdminShowin />;
      case "users":
        return <AdminAccount />;
      case "theatre":
        return <AdminTheatre />;
      case "feature":
        return <AdminFeature />;
      case "hall":
        return <AdminHall />;
      case "showtime":
        return <AdminShowtime />;
      case "categories":
        return;
      case "logout":
        navigate("/");
        return null;
      case "homepage":
        navigate("/");
      default:
        return <h2>Chào mừng đến trang Admin</h2>;
    }
  };
  //AdminShowtime
  return (
    <Layout className="admin-layout">
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="ad-logo">{user.name}</div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["articles"]}
          onClick={(e) => setSelectedKey(e.key)}
        >
          <Menu.Item key="homepage" icon={<FileTextOutlined />}>
            Trang chủ
          </Menu.Item>
          <Menu.Item key="dashboard" icon={<FileTextOutlined />}>
            Thống kê
          </Menu.Item>
          <Menu.Item key="movie" icon={<FileTextOutlined />}>
            Movie
          </Menu.Item>
          <Menu.Item key="shownin" icon={<CommentOutlined />}>
            Phòng vé
          </Menu.Item>
          <Menu.Item key="users" icon={<UserOutlined />}>
            Người dùng
          </Menu.Item>
          <Menu.Item key="theatre" icon={<AppstoreOutlined />}>
            Rạp
          </Menu.Item>
          <Menu.Item key="feature" icon={<ShoppingOutlined />}>
            Đặc trưng rạp
          </Menu.Item>
          <Menu.Item key="hall" icon={<ShoppingOutlined />}>
            Phòng chiếu phim
          </Menu.Item>
          <Menu.Item key="showtime" icon={<ShoppingOutlined />}>
            Suất chiếu
          </Menu.Item>
          <Menu.Item key="categories" icon={<UnorderedListOutlined />}>
            Danh mục
          </Menu.Item>
          <Menu.Item
            key="logout"
            icon={<LogoutOutlined />}
            onClick={handleLogout}
          >
            Đăng xuất
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header className="admin-header">
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: "18px", width: 48, height: 48 }}
          />
          <h1>Admin Dashboard</h1>
        </Header>
        <Content className="admin-content">{renderContent()}</Content>
      </Layout>
    </Layout>
  );
};

export default AdminPageHome;
