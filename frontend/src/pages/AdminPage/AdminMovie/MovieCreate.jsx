import React from 'react'
import {
  Modal,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Select,
  Upload,
  Button,
  message
} from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import moment from 'moment'

const { TextArea } = Input
const { Option } = Select

const MovieCreate = ({ visible, onCancel, onCreate }) => {
  const [form] = Form.useForm()

  const handleFinish = async (values) => {
    const formData = new FormData()

    const movieDto = {
      ...values,
      release_date: values.release_date.format('YYYY-MM-DD')
    }

    delete movieDto.image

    for (const key in movieDto) {
      const value = movieDto[key]
      if (Array.isArray(value)) {
        value.forEach((v) => formData.append(key, v))
      } else {
        formData.append(key, value)
      }
    }

    if (values.image?.[0]?.originFileObj) {
      formData.append('image', values.image[0].originFileObj) // ✅ thêm image đúng cách
    }
    onCreate(formData)
  }

  return (
    <Modal
      visible={visible}
      title="Tạo phim mới"
      onCancel={onCancel}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          rating: 0
        }}
      >
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

        <Form.Item
          name="image"
          label="Ảnh poster"
          valuePropName="fileList"
          getValueFromEvent={(e) => {
            if (Array.isArray(e)) return e
            return e?.fileList
          }}
          rules={[{ required: true, message: 'Vui lòng tải ảnh lên' }]}
        >
          <Upload listType="picture" beforeUpload={() => false} maxCount={1}>
            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Tạo phim
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default MovieCreate
