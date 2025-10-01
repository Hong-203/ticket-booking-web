import React, { useEffect } from 'react'
import { Modal, Form, Input, InputNumber, Select } from 'antd'

const HallEdit = ({ visible, hallData, theatres, onCancel, onUpdate }) => {
  const [form] = Form.useForm()
  useEffect(() => {
    if (hallData) {
      form.setFieldsValue({
        name: hallData.name,
        totalSeats: hallData.totalSeats,
        theatre: hallData.theatre?.id // lấy id của rạp
      })
    }
  }, [hallData, form])

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        onUpdate({ id: hallData.id, ...values })
        form.resetFields()
      })
      .catch((info) => {
        console.log('Validate Failed:', info)
      })
  }

  return (
    <Modal
      title="Chỉnh sửa phòng chiếu"
      open={visible}
      onOk={handleOk}
      onCancel={() => {
        onCancel()
        form.resetFields()
      }}
      okText="Cập nhật"
      cancelText="Hủy"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Tên phòng"
          rules={[{ required: true, message: 'Vui lòng nhập tên phòng' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="totalSeats"
          label="Tổng số ghế"
          rules={[{ required: true, message: 'Vui lòng nhập số ghế' }]}
        >
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="theatre"
          label="Thuộc rạp"
          rules={[{ required: true, message: 'Vui lòng chọn rạp chiếu' }]}
        >
          <Select placeholder="Chọn rạp">
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

export default HallEdit
