export const getAuthConfig = () => {
  const user =
    JSON.parse(localStorage.getItem('user')) || localStorage.getItem('token')
  const token = user?.token
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }
}
