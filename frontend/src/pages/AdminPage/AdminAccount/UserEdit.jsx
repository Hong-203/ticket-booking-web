import React, { useEffect } from 'react'
import { Modal, Form, Input, Select, DatePicker } from 'antd'
import moment from 'moment' // Import moment để xử lý ngày tháng

const { Option } = Select

const UserEdit = ({ visible, onCancel, onUpdate, userData }) => {
  const [form] = Form.useForm()

  useEffect(() => {
    if (userData) {
      // Khi userData thay đổi, cập nhật giá trị cho form
      // Chú ý: DatePicker cần giá trị moment object
      form.setFieldsValue({
        ...userData,
        dob: userData.dob ? moment(userData.dob) : null, // Chuyển đổi chuỗi ngày thành đối tượng moment
        gender: userData.gender // Giới tính có thể là 'male' hoặc 'female'
        // name: userData.full_name, // Không cần dòng này nếu dùng name="full_name"
        // phone: userData.phone_number, // Không cần dòng này nếu dùng name="phone_number"
        // role: userData.account_type, // Không cần dòng này nếu dùng name="account_type"
      })
    }
  }, [userData, form])

  const handleOk = () => {
    form.validateFields().then((values) => {
      // Khi gửi form, chuyển đổi moment object của dob thành chuỗi ISO 8601 nếu cần gửi lên API
      const updatedValues = {
        ...values,
        dob: values.dob ? values.dob.toISOString() : null // Chuyển đổi lại thành chuỗi ISO
      }
      onUpdate({ ...userData, ...updatedValues })
    })
  }

  return (
    <Modal
      title="Cập nhật người dùng"
      open={visible}
      onCancel={onCancel}
      onOk={handleOk}
      okText="Cập nhật"
      cancelText="Huỷ"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Họ tên"
          name="full_name" // Đổi từ "name" sang "full_name"
          rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              type: 'email',
              message: 'Vui lòng nhập email hợp lệ'
            }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Số điện thoại"
          name="phone_number"
          rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
        >
          {/* Đổi từ "phone" sang "phone_number" */}
          <Input />
        </Form.Item>
        <Form.Item label="Giới tính" name="gender">
          <Select allowClear placeholder="Chọn giới tính">
            <Option value="male">Nam</Option>
            <Option value="female">Nữ</Option>
            <Option value="other">Khác</Option>
          </Select>
        </Form.Item>
        <Form.Item label="Ngày sinh" name="dob">
          <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
        </Form.Item>
        <Form.Item label="Địa chỉ" name="address">
          <Input />
        </Form.Item>
        <Form.Item
          label="Loại tài khoản" // Đổi từ "Vai trò" sang "Loại tài khoản"
          name="account_type" // Đổi từ "role" sang "account_type"
          rules={[{ required: true, message: 'Vui lòng chọn loại tài khoản' }]}
        >
          <Select>
            <Option value="customer">Khách hàng</Option>{' '}
            <Option value="staff">Nhân viên</Option>{' '}
            <Option value="admin">Admin</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default UserEdit
