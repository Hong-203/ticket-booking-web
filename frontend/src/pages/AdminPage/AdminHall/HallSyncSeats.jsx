import React from 'react'
import { Modal, Form, Select } from 'antd'

const HallSyncSeats = ({ visible, onCancel, onSync, halls }) => {
  const [form] = Form.useForm()

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        onSync({ hallId: values.hallId })
        form.resetFields()
      })
      .catch((info) => {
        console.log('Validate Failed:', info)
      })
  }

  return (
    <Modal
      title="Đồng bộ ghế cho phòng chiếu"
      open={visible}
      onOk={handleOk}
      onCancel={() => {
        form.resetFields()
        onCancel()
      }}
      okText="Đồng bộ"
      cancelText="Huỷ"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="hallId"
          label="Chọn phòng chiếu"
          rules={[{ required: true, message: 'Vui lòng chọn phòng chiếu' }]}
        >
          <Select placeholder="Chọn phòng">
            {halls.map((hall) => (
              <Select.Option key={hall.id} value={hall.id}>
                {hall.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default HallSyncSeats
