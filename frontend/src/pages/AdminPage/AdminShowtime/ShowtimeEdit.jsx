import React, { useEffect } from 'react'
import {
  Modal,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Select,
  TimePicker
} from 'antd'
import moment from 'moment'

const showTypeOptions = ['2D', '3D', 'IMAX', '4DX'] // ví dụ show_type

const ShowtimeEdit = ({ visible, onCancel, onUpdate, showtimeData }) => {
  const [form] = Form.useForm()

  useEffect(() => {
    if (showtimeData) {
      form.setFieldsValue({
        movie_start_time: showtimeData.movie_start_time
          ? moment(showtimeData.movie_start_time, 'HH:mm')
          : null,
        show_type: showtimeData.show_type || null,
        showtime_date: showtimeData.showtime_date
          ? moment(showtimeData.showtime_date)
          : null,
        price_per_seat: showtimeData.price_per_seat || 0
      })
    }
  }, [showtimeData, form])

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        const payload = {
          ...values,
          id: showtimeData.id,
          showtime_date: values.showtime_date.format('YYYY-MM-DD'),
          movie_start_time: values.movie_start_time.format('HH:mm'),
          price_per_seat: Number(values.price_per_seat),
          show_type: values.show_type
        }
        onUpdate(payload)
      })
      .catch((info) => {
        console.log('Validation Failed:', info)
      })
  }

  return (
    <Modal
      title="Chỉnh sửa Suất Chiếu"
      visible={visible}
      onCancel={onCancel}
      onOk={handleOk}
      okText="Cập nhật"
      cancelText="Hủy"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="movie_start_time"
          label="Thời gian bắt đầu (HH:mm)"
          rules={[
            { required: true, message: 'Vui lòng nhập thời gian bắt đầu!' }
          ]}
        >
          <TimePicker format="HH:mm" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="show_type"
          label="Loại suất chiếu"
          rules={[
            { required: true, message: 'Vui lòng chọn loại suất chiếu!' }
          ]}
        >
          <Select placeholder="Chọn loại suất chiếu">
            {showTypeOptions.map((type) => (
              <Select.Option key={type} value={type}>
                {type}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="showtime_date"
          label="Ngày chiếu"
          rules={[{ required: true, message: 'Vui lòng chọn ngày chiếu!' }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="price_per_seat"
          label="Giá vé mỗi ghế (VNĐ)"
          rules={[{ required: true, message: 'Vui lòng nhập giá vé!' }]}
        >
          <InputNumber
            min={0}
            style={{ width: '100%' }}
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            }
            parser={(value) => value.replace(/,*/g, '')}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ShowtimeEdit
