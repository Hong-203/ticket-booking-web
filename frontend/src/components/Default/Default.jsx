import './Default.css'
import Header from '../Header/Header'
import AppFooter from '../Footer/Footer'

const Default = ({ children }) => {
  return (
    <div>
      <Header />
      <div className="content-wrapper">
        <div className="main-content">{children}</div>
      </div>
      <AppFooter />
    </div>
  )
}

export default Default
