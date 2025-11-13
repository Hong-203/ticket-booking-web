import React, { useState } from "react";
import {
  Card,
  Button,
  InputNumber,
  Badge,
  Typography,
  Row,
  Col,
  Space,
} from "antd";
import {
  ShoppingCartOutlined,
  PlusOutlined,
  MinusOutlined,
} from "@ant-design/icons";
import "./ConcessionItems.css";

const { Title, Text } = Typography;
const { Meta } = Card;

const ConcessionItems = ({ onCartChange }) => {
  const [cart, setCart] = useState({});

  // Danh sách sản phẩm cố định
  const products = [
    {
      id: "8790cb57-2967-4933-a304-3cdd1e06a789",
      name: "Bắp rang bơ",
      description: "Bắp rang bơ thơm ngon, giòn tan",
      price: "50000.00",
      image_url:
        "https://intriphat.com/wp-content/uploads/2022/11/In-Hop-Dung-Bap-Rang-Bo-Dep-Chat-luong-2.jpg",
      category: "snack",
    },
    {
      id: "aefaeb73-71f6-465c-b962-d9d4d722665d",
      name: "Combo Coca Cola + Bắp rang bơ",
      description: "Combo tiết kiệm với Coca Cola và Bắp rang bơ",
      price: "70000.00",
      image_url:
        "https://statics.vincom.com.vn/xu-huong/anh_thumbnail/MicrosoftTeams-image-(13)-1696745006.png",
      category: "combo",
    },
    {
      id: "cd0c6e7c-c373-4955-86fc-49f41df4821c",
      name: "Coca Cola",
      description: "Nước ngọt Coca Cola mát lạnh",
      price: "20000.00",
      image_url:
        "https://vnn-imgs-a1.vgcloud.vn/img2.infonet.vn/w800/Uploaded/2020/vowpcgmv/2015_04_05/coca.jpg?width=260&s=zjuH2E-lsNrgTA5ctAsifA",
      category: "drink",
    },
  ];

  // Màu sắc và nhãn theo danh mục
  const categoryColors = {
    snack: "#ff7875",
    combo: "#52c41a",
    drink: "#1890ff",
  };

  const categoryLabels = {
    snack: "Đồ ăn vặt",
    combo: "Combo",
    drink: "Đồ uống",
  };

  // Định dạng tiền tệ
  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(parseFloat(price));

  // Cập nhật số lượng sản phẩm trong giỏ
  const updateQuantity = (productId, quantity) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    const newCart = { ...cart };

    if (quantity <= 0) {
      delete newCart[productId];
    } else {
      newCart[productId] = { product, quantity };
    }

    setCart(newCart);
    onCartChange?.(newCart);
  };

  return (
    <div className="concession-container">
      <div className="concession-wrapper">
        <div className="concession-header">
          <Title level={1} className="header-title">
            🍿 Menu Đồ Ăn & Thức Uống
          </Title>
        </div>

        <Row gutter={[24, 24]}>
          {products.map((product) => {
            const quantity = cart[product.id]?.quantity || 0;

            return (
              <Col xs={24} sm={12} lg={8} key={product.id}>
                <Card
                  hoverable
                  className="product-card"
                  cover={
                    <div className="product-image-wrapper">
                      <img
                        alt={product.name}
                        src={product.image_url}
                        className="product-image-order"
                      />
                      <Badge
                        count={categoryLabels[product.category]}
                        className={`category-badge category-${product.category}`}
                        style={{
                          backgroundColor: categoryColors[product.category],
                        }}
                      />
                    </div>
                  }
                  actions={[
                    <div key="actions" className="product-actions">
                      <Space direction="vertical" className="actions-space">
                        <div className="product-price">
                          {formatPrice(product.price)}
                        </div>

                        <div className="quantity-controls">
                          <Button
                            type="primary"
                            shape="circle"
                            icon={<MinusOutlined />}
                            size="small"
                            onClick={() =>
                              updateQuantity(product.id, quantity - 1)
                            }
                            disabled={quantity === 0}
                            className="quantity-btn quantity-btn-minus"
                          />

                          <InputNumber
                            min={0}
                            max={99}
                            value={quantity}
                            onChange={(value) =>
                              updateQuantity(product.id, value || 0)
                            }
                            controls={false}
                            className="quantity-input"
                          />

                          <Button
                            type="primary"
                            shape="circle"
                            icon={<PlusOutlined />}
                            size="small"
                            onClick={() =>
                              updateQuantity(product.id, quantity + 1)
                            }
                            className="quantity-btn quantity-btn-plus"
                          />
                        </div>
                      </Space>
                    </div>,
                  ]}
                >
                  <Meta
                    title={<div className="product-title">{product.name}</div>}
                    description={
                      <Text className="product-description">
                        {product.description}
                      </Text>
                    }
                  />
                </Card>
              </Col>
            );
          })}
        </Row>
      </div>
    </div>
  );
};

export default ConcessionItems;
