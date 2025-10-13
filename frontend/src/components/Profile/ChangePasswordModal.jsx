import React, { useState } from 'react'
import { Modal, Form, Input, Button } from 'antd'
import { EditOutlined } from '@ant-design/icons'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { changePassword } from '../../stores/Users/userApis'

const ChangePasswordModal = () => {
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()
  const dispatch = useDispatch()

  const handleChangePassword = () => {
    setVisible(true)
  }

  const handleOk = async () => {
    try {
      const values = await form.validateFields()
      const { oldPassword, newPassword } = values

      setLoading(true)

      const res = await dispatch(changePassword({ oldPassword, newPassword }))
      console.log('res', res)
      if (res?.success) {
        toast.success('Đổi mật khẩu thành công!')
        setVisible(false)
        form.resetFields()
      } else {
        toast.error(res?.message || 'Đổi mật khẩu thất bại, vui lòng thử lại!')
      }
    } catch (err) {
      console.error('Validation failed:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setVisible(false)
    form.resetFields()
  }

  return (
    <>
      <Button
        type="primary"
        icon={<EditOutlined />}
        onClick={handleChangePassword}
        style={{
          background: 'rgba(255,255,255,0.2)',
          border: '1px solid rgba(255,255,255,0.3)',
          backdropFilter: 'blur(10px)'
        }}
      >
        Đổi mật khẩu
      </Button>

      <Modal
        title="Đổi mật khẩu"
        open={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={loading}
        okText="Xác nhận"
        cancelText="Hủy"
      >
        <Form
          form={form}
          layout="vertical"
          name="changePasswordForm"
          initialValues={{ remember: true }}
        >
          <Form.Item
            name="oldPassword"
            label="Mật khẩu cũ"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu cũ!' }]}
          >
            <Input.Password placeholder="Nhập mật khẩu cũ" />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label="Mật khẩu mới"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
              { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
            ]}
          >
            <Input.Password placeholder="Nhập mật khẩu mới" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Xác nhận mật khẩu mới"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: 'Vui lòng xác nhận mật khẩu mới!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(
                    new Error('Mật khẩu xác nhận không khớp!')
                  )
                }
              })
            ]}
          >
            <Input.Password placeholder="Nhập lại mật khẩu mới" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default ChangePasswordModal
