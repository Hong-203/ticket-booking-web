import { Fragment, Suspense, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Default from './components/Default/Default'
import { routes } from './router/routes'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'

function App() {
  const getInitialAdminState = () => {
    try {
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser)
        return parsedUser?.isAdmin === true
      }
      return false
    } catch (error) {
      console.error('Lỗi khi parse user từ localStorage:', error)
      return false
    }
  }

  const [isAdmin, setIsAdmin] = useState(getInitialAdminState())
  const [loadingUser, setLoadingUser] = useState(false)

  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {routes.map(({ path, page: Page, isPrivate, isShowHeader }, idx) => {
            const Layout = isShowHeader ? Default : Fragment
            const element = (
              <Layout>
                <Page setIsAdmin={setIsAdmin} /> {/* Truyền setIsAdmin */}
              </Layout>
            )

            return (
              <Route
                key={idx}
                path={path}
                element={
                  isPrivate ? (
                    <ProtectedRoute isAllowed={isAdmin}>
                      {element}
                    </ProtectedRoute>
                  ) : (
                    element
                  )
                }
              />
            )
          })}
        </Routes>
      </Suspense>
    </Router>
  )
}

export default App
