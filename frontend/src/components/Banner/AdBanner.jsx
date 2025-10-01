import React from 'react'
import { Carousel, Button } from 'antd'
import './AdBanner.css'

import banner1 from '../../assets/banner1.png'
import banner2 from '../../assets/banner2.png'
import banner3 from '../../assets/banner3.png'

const banners = [
  {
    id: 1,
    title: 'Mua vé xem phim online',
    description: 'Nhanh chóng - Tiện lợi - Không cần xếp hàng!',
    image: banner1,
    buttonText: 'Xem ngay'
  },
  {
    id: 2,
    title: 'Ưu đãi thành viên',
    description: 'Giảm giá 50% cho lần mua đầu tiên',
    image: banner2,
    buttonText: 'Đăng ký'
  },
  {
    id: 3,
    title: 'Suất chiếu đặc biệt',
    description: 'Chỉ có vào cuối tuần! Số lượng có hạn!',
    image: banner3,
    buttonText: 'Đặt vé'
  }
]


const AdBanner = () => {
  return (
    <div className="ad-banner-container">
      <Carousel autoplay>
        {banners.map((banner) => (
        <div key={banner.id} className="ad-slide">
          <img src={banner.image} alt={banner.title} className="ad-slide-img" />
          <div className="ad-overlay" />
        </div>
        ))}
      </Carousel>
    </div>
  )
}

export default AdBanner
