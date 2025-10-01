import React from 'react'
import { Modal, Form, Input } from 'antd'

const TheatreCreate = ({ visible, onCancel, onCreate }) => {
  const [form] = Form.useForm()

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        form.resetFields()
        onCreate(values)
      })
      .catch((info) => {
        console.log('Validate Failed:', info)
      })
  }

  return (
    <Modal
      title="Thêm rạp mới"
      visible={visible}
      onOk={handleOk}
      onCancel={() => {
        form.resetFields()
        onCancel()
      }}
      okText="Tạo"
      cancelText="Huỷ"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Tên rạp"
          rules={[{ required: true, message: 'Vui lòng nhập tên rạp' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="location"
          label="Tỉnh / Thành phố"
          rules={[{ required: true, message: 'Vui lòng nhập tỉnh/thành phố' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="locationDetails" label="Chi tiết địa chỉ">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default TheatreCreate
