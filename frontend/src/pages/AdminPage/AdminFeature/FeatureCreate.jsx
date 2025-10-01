import React, { useEffect, useState } from 'react'
import { Modal, Form, Input, Select, message } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { getAllTheatre } from '../../../stores/Theatre/theatreApis'

const { Option } = Select

const FeatureCreate = ({ visible, onCancel, onCreate }) => {
  const [form] = Form.useForm()
  const dispatch = useDispatch()
  const theatres = useSelector((state) => state.theatre.theatreList || [])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (visible) {
      setLoading(true)
      dispatch(getAllTheatre())
        .catch(() => message.error('Không thể tải danh sách rạp'))
        .finally(() => setLoading(false))
    }
  }, [visible, dispatch])

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
      title="Thêm tính năng mới"
      visible={visible}
      onOk={handleOk}
      onCancel={() => {
        form.resetFields()
        onCancel()
      }}
      okText="Tạo"
      cancelText="Huỷ"
      confirmLoading={loading}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="title"
          label="Tên tính năng"
          rules={[{ required: true, message: 'Vui lòng nhập tên tính năng' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="description"
          label="Mô tả"
          rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
        >
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item
          name="imagePath"
          label="Link ảnh"
          rules={[{ required: true, message: 'Vui lòng nhập link ảnh' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="theatreId"
          label="Chọn rạp"
          rules={[{ required: true, message: 'Vui lòng chọn rạp' }]}
        >
          <Select placeholder="Chọn một rạp chiếu phim" loading={loading}>
            {theatres.map((theatre) => (
              <Option key={theatre.id} value={theatre.id}>
                {theatre.name} - {theatre.location}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default FeatureCreate
