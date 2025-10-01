import React, { useEffect } from 'react'
import {
  Modal,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Button,
  Select,
  Space
} from 'antd'
import moment from 'moment'

const { TextArea } = Input
const { Option } = Select

const MovieEdit = ({ visible, movieData, onCancel, onUpdate }) => {
  const [form] = Form.useForm()

  useEffect(() => {
    if (movieData) {
      form.setFieldsValue({
        ...movieData,
        release_date: movieData.release_date
          ? moment(movieData.release_date)
          : null
      })
    }
  }, [movieData, form])

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        const updatedMovie = {
          ...movieData,
          ...values,
          release_date: values.release_date.format('YYYY-MM-DD')
        }
        onUpdate(updatedMovie)
      })
      .catch((info) => {
        console.log('Validation Failed:', info)
      })
  }

  return (
    <Modal
      visible={visible}
      title="Chỉnh sửa phim"
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          Lưu
        </Button>
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="name" label="Tên phim" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item
          name="language"
          label="Ngôn ngữ"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item name="synopsis" label="Tóm tắt" rules={[{ required: true }]}>
          <TextArea rows={3} />
        </Form.Item>

        <Form.Item
          name="rating"
          label="Điểm đánh giá"
          rules={[{ required: true }]}
        >
          <InputNumber min={0} max={10} step={0.1} />
        </Form.Item>

        <Form.Item
          name="duration"
          label="Thời lượng"
          rules={[{ required: true }]}
        >
          <Input placeholder="VD: 120 phút" />
        </Form.Item>

        <Form.Item
          name="top_cast"
          label="Top diễn viên"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="release_date"
          label="Ngày phát hành"
          rules={[{ required: true }]}
        >
          <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="trailer_url"
          label="Trailer URL"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="directors"
          label="Đạo diễn"
          rules={[{ required: true, type: 'array' }]}
        >
          <Select mode="tags" placeholder="Nhập đạo diễn" />
        </Form.Item>

        <Form.Item
          name="genres"
          label="Thể loại"
          rules={[{ required: true, type: 'array' }]}
        >
          <Select mode="tags" placeholder="Nhập thể loại" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default MovieEdit
