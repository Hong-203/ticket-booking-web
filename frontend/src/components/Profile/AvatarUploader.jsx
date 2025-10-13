import React, { useRef, useState } from 'react'
import { Avatar, Button, Upload, message } from 'antd'
import { UserOutlined, CameraOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import { updateAvatar } from '../../stores/Users/userApis'

const AvatarUploader = () => {
  const dispatch = useDispatch()
  const { profile } = useSelector((state) => state.user)
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef(null)

  // 👉 Khi bấm vào nút camera
  const handleClickUpload = () => {
    fileInputRef.current?.click()
  }

  // 👉 Khi chọn ảnh từ máy
  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // ✅ Giới hạn kích thước (tùy chọn)
    if (file.size > 3 * 1024 * 1024) {
      message.error('Ảnh quá lớn, vui lòng chọn ảnh dưới 3MB!')
      return
    }

    const formData = new FormData()
    formData.append('file', file)

    setLoading(true)
    const res = await dispatch(updateAvatar(formData))
    setLoading(false)

    if (res?.success) {
      message.success('Cập nhật ảnh đại diện thành công!')
      // Có thể cập nhật lại profile nếu cần
    } else {
      message.error(res?.message || 'Cập nhật thất bại!')
    }
  }

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <Avatar
        size={120}
        src={profile?.avatar_url}
        icon={<UserOutlined />}
        style={{
          border: '4px solid rgba(255,255,255,0.3)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
          opacity: loading ? 0.5 : 1,
          transition: 'opacity 0.3s ease'
        }}
      />
      <Button
        icon={<CameraOutlined />}
        size="small"
        shape="circle"
        onClick={handleClickUpload}
        loading={loading}
        style={{
          position: 'absolute',
          bottom: '0',
          right: '0',
          background: '#1890ff',
          border: 'none',
          color: 'white'
        }}
      />
      {/* input file ẩn */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </div>
  )
}

export default AvatarUploader
