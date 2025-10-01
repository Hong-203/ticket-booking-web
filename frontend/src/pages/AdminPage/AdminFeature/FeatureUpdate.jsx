import React, { useEffect, useState } from 'react'
import { Modal, Form, Input, Select, message } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { getAllTheatre } from '../../../stores/Theatre/theatreApis'

const { Option } = Select

const FeatureUpdate = ({ visible, onCancel, onUpdate, initialValues }) => {
  const [form] = Form.useForm()
  const dispatch = useDispatch()
  const theatres = useSelector((state) => state.theatre.theatreList || [])
  const [loading, setLoading] = useState(false)

  // Load theatres mỗi khi mở modal
  useEffect(() => {
    if (visible) {
      setLoading(true)
      dispatch(getAllTheatre())
        .catch(() => message.error('Không thể tải danh sách rạp'))
        .finally(() => setLoading(false))
    }
  }, [visible, dispatch])

  useEffect(() => {
    if (visible && initialValues) {
      form.setFieldsValue({
        title: initialValues.title,
        description: initialValues.description,
        imagePath: initialValues.imagePath,
        theatreId: initialValues.theatre?.id || initialValues.theatreId
      })
    } else {
      form.resetFields()
    }
  }, [visible, initialValues, form])

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        form.resetFields()
        onUpdate({ id: initialValues.id, ...values })
      })
      .catch((info) => {
        console.log('Validate Failed:', info)
      })
  }

  return (
    <Modal
      title="Cập nhật tính năng"
      visible={visible}
      onOk={handleOk}
      onCancel={() => {
        form.resetFields()
        onCancel()
      }}
      okText="Cập nhật"
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

export default FeatureUpdate
