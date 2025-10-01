import React, { useEffect } from 'react'
import { Modal, Form, Select, message } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { getAllMovie } from '../../../stores/Movie/movieApis'
import { getAllHall } from '../../../stores/Hall/hallApis'
import { getAllShowTime } from '../../../stores/Showtimes/showTimeApis'

const ShowtimeInUpdate = ({ visible, onCancel, onUpdate, oldData }) => {
  const [form] = Form.useForm()
  const dispatch = useDispatch()

  const movieList = useSelector((state) => state.movie.movieList || [])
  const hallList = useSelector((state) => state.hall.hallList || [])
  const showtimeList = useSelector(
    (state) => state.showTime.showTimesList || []
  )

  useEffect(() => {
    dispatch(getAllMovie({ status: '', page: 1, limit: 100 }))
    dispatch(getAllHall())
    dispatch(getAllShowTime())
  }, [dispatch])

  useEffect(() => {
    if (oldData) {
      form.setFieldsValue({
        movie_id: oldData.movie_id,
        showtime_id: oldData.showtime_id,
        hall_id: oldData.hall_id
      })
    }
  }, [oldData, form])

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        const payload = {
          old: oldData,
          new: values
        }
        onUpdate(payload)
        form.resetFields()
      })
      .catch(() => {
        message.error('Vui lòng điền đầy đủ thông tin.')
      })
  }

  return (
    <Modal
      visible={visible}
      title="Cập nhật Showtime In"
      onCancel={() => {
        form.resetFields()
        onCancel()
      }}
      onOk={handleOk}
      okText="Cập nhật"
      cancelText="Huỷ"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="movie_id"
          label="Phim"
          rules={[{ required: true, message: 'Vui lòng chọn phim!' }]}
        >
          <Select placeholder="Chọn phim">
            {movieList.map((movie) => (
              <Select.Option key={movie.id} value={movie.id}>
                {movie.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="showtime_id"
          label="Lịch chiếu"
          rules={[{ required: true, message: 'Vui lòng chọn lịch chiếu!' }]}
        >
          <Select placeholder="Chọn lịch chiếu">
            {showtimeList.map((showtime) => (
              <Select.Option key={showtime.id} value={showtime.id}>
                {`${showtime.movie_start_time} - ${showtime.showtime_date}`}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="hall_id"
          label="Phòng chiếu"
          rules={[{ required: true, message: 'Vui lòng chọn phòng!' }]}
        >
          <Select placeholder="Chọn phòng chiếu">
            {hallList.map((hall) => (
              <Select.Option key={hall.id} value={hall.id}>
                {`${hall.name} - ${hall.theatre.name}`}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ShowtimeInUpdate
