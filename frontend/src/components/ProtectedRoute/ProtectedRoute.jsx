import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ isAllowed, children }) => {
  return isAllowed ? children : <Navigate to="/unauthorized" replace />
}

export default ProtectedRoute
