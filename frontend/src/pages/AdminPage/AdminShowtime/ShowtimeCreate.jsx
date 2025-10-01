import React from 'react'
import {
  Modal,
  Form,
  Input,
  InputNumber,
  DatePicker,
  TimePicker,
  Select
} from 'antd'
import moment from 'moment'

const ShowtimeCreate = ({ visible, onCancel, onCreate }) => {
  const [form] = Form.useForm()

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        const formatted = {
          ...values,
          movie_start_time: moment(values.movie_start_time).format('HH:mm'),
          showtime_date: moment(values.showtime_date).format('YYYY-MM-DD')
        }
        form.resetFields()
        onCreate(formatted)
      })
      .catch((info) => {
        console.log('Validate Failed:', info)
      })
  }

  return (
    <Modal
      title="Thêm lịch chiếu mới"
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
          name="movie_start_time"
          label="Giờ bắt đầu"
          rules={[{ required: true, message: 'Vui lòng chọn giờ bắt đầu' }]}
        >
          <TimePicker format="HH:mm" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="showtime_date"
          label="Ngày chiếu"
          rules={[{ required: true, message: 'Vui lòng chọn ngày chiếu' }]}
        >
          <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="show_type"
          label="Định dạng phim"
          rules={[{ required: true, message: 'Vui lòng chọn định dạng phim' }]}
        >
          <Select placeholder="Chọn định dạng">
            <Select.Option value="2D">2D</Select.Option>
            <Select.Option value="3D">3D</Select.Option>
            <Select.Option value="IMAX">IMAX</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="price_per_seat"
          label="Giá ghế (VNĐ)"
          rules={[{ required: true, message: 'Vui lòng nhập giá ghế' }]}
        >
          <InputNumber
            min={0}
            step={1000}
            style={{ width: '100%' }}
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            }
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ShowtimeCreate
