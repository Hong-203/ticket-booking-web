import React from 'react'
import { Modal, Form, Input, InputNumber, Select } from 'antd'

const HallCreate = ({ visible, onCancel, onCreate, theatres }) => {
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
      title="Thêm phòng chiếu mới"
      open={visible}
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
          label="Tên phòng chiếu"
          rules={[{ required: true, message: 'Vui lòng nhập tên phòng chiếu' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="totalSeats"
          label="Tổng số ghế"
          rules={[{ required: true, message: 'Vui lòng nhập tổng số ghế' }]}
        >
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="theatre"
          label="Thuộc rạp"
          rules={[{ required: true, message: 'Vui lòng chọn rạp' }]}
        >
          <Select placeholder="Chọn rạp chiếu">
            {theatres.map((t) => (
              <Select.Option key={t.id} value={t.id}>
                {t.name} - {t.location}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default HallCreate
