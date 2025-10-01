import React, { useEffect } from 'react'
import { Modal, Form, Input } from 'antd'

const TheatreEdit = ({ visible, theatreData, onCancel, onUpdate }) => {
  const [form] = Form.useForm()

  useEffect(() => {
    if (theatreData) {
      form.setFieldsValue({
        name: theatreData.name,
        location: theatreData.location,
        locationDetails: theatreData.locationDetails
      })
    }
  }, [theatreData])

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        onUpdate({ id: theatreData.id, ...values })
        form.resetFields()
      })
      .catch((info) => {
        console.log('Validate Failed:', info)
      })
  }

  return (
    <Modal
      title="Chỉnh sửa rạp chiếu"
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
          label="Tên rạp"
          rules={[{ required: true, message: 'Vui lòng nhập tên rạp' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="location"
          label="Khu vực"
          rules={[{ required: true, message: 'Vui lòng nhập khu vực' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="locationDetails"
          label="Địa chỉ chi tiết"
          rules={[
            { required: true, message: 'Vui lòng nhập địa chỉ chi tiết' }
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default TheatreEdit
