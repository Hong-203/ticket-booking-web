import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
// import { showLoginModal } from '../../../reducers/authSlice'
// import { resetCart } from '../../../reducers/cartSlice'
import { TextEffect } from '../TextEffect'
import './HeroSection.css'
import heroImg from '../../assets/hero-img.webp'

const HeroSection = () => {
  // const navigate = useNavigate()
  // const { isAuthenticated, signedPerson } = useSelector(
  //   (store) => store.authentication
  // )
  const dispatch = useDispatch()

  return (
    <section className="section-hero">
      <div className="container hero">
        <div className="hero-text">
          <h1 className="heading-primary">
            <TextEffect preset="slide">
              Mở cánh cửa đến thế giới điện ảnh diệu kỳ
            </TextEffect>
          </h1>

          <p className="hero-description">
            Hãy đắm chìm trong sức hấp dẫn mê hoặc của điện ảnh khi bạn bước vào
            không gian tuyệt mỹ của chúng tôi — nơi mang đến trải nghiệm xem
            phim đỉnh cao chưa từng có.
          </p>
          <div className="hero-btn-container">
            <button
              onClick={() => {
                // dispatch(resetCart())
                // isAuthenticated && signedPerson.person_type === 'Customer'
                //   ? navigate('/purchase')
                //   : dispatch(showLoginModal())
              }}
              className="btn btn-full"
            >
              Buy a ticket
            </button>
            <div to="#nowShowing" className="btn btn-outline">
              Learn more &darr;
            </div>
          </div>

          <div className="hero-review-section">
            <div className="customers-img">
              <img
                src={heroImg}
                className="customer-img"
                alt="Customer Photo"
              />
              <img
                src={heroImg}
                className="customer-img"
                alt="Customer Photo"
              />
              <img
                src={heroImg}
                className="customer-img"
                alt="Customer Photo"
              />
              <img
                src={heroImg}
                className="customer-img"
                alt="Customer Photo"
              />
              <img
                src={heroImg}
                className="customer-img"
                alt="Customer Photo"
              />
              <img
                src={heroImg}
                className="customer-img"
                alt="Customer Photo"
              />
            </div>

            <p className="hero-review-text">
              <span>100,000+</span> tickets sold last year
            </p>
          </div>
        </div>

        <div className="hero-img-box">
          <img className="hero-img" src={heroImg} alt="Hero Image" />
        </div>
      </div>
    </section>
  )
}
export default HeroSection
