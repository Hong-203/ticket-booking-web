import { useSelector, useDispatch } from 'react-redux'
import { getHallSeats } from '../../../stores/Hall/hallApis'
import { useEffect, useState } from 'react'
import { Card, Col, Modal, Pagination, Row, Tag, Tooltip, Spin } from 'antd'

const HallSeatModal = ({ open, onClose, hallId }) => {
  const dispatch = useDispatch()
  const hallSeatState = useSelector((state) => state.hall.hallSeat || [])
  const loading = useSelector((state) => state.hall.loading)
  const [page, setPage] = useState(1)
  const limit = 24 // Matches API's expected limit based on totalPages: 12
  const [total, setTotal] = useState(0)

  useEffect(() => {
    if (open) {
      console.log(
        'Fetching seats for hallId:',
        hallId,
        'page:',
        page,
        'limit:',
        limit
      )
      dispatch(getHallSeats(hallId, page, limit)).then((res) => {
        if (res) {
          setTotal(res.total) // Access res.data.total
        } else {
          console.log('No valid total in response:', res)
        }
      })
    }
  }, [open, dispatch, hallId, page, limit])

  const handlePageChange = (newPage) => {
    setPage(newPage)
  }

  return (
    <Modal
      open={open}
      title="Danh sách ghế"
      onCancel={onClose}
      footer={null}
      width={800}
    >
      {loading ? (
        <Spin />
      ) : (
        <>
          <Row gutter={[16, 16]}>
            {hallSeatState.length > 0 ? (
              hallSeatState.map((seat) => (
                <Col xs={12} sm={8} md={6} lg={4} key={seat.id}>
                  <Card
                    size="small"
                    title={seat.name}
                    bordered
                    hoverable
                    style={{
                      borderColor:
                        seat.status === 'empty' ? '#52c41a' : '#f5222d',
                      textAlign: 'center'
                    }}
                  >
                    <Tooltip title={seat.description}>
                      <div>{seat.description}</div>
                    </Tooltip>
                    <Tag color={seat.status === 'empty' ? 'green' : 'red'}>
                      {seat.status === 'empty' ? 'Còn trống' : 'Đã đặt'}
                    </Tag>
                  </Card>
                </Col>
              ))
            ) : (
              <Col span={24}>Không có ghế nào</Col>
            )}
          </Row>

          <Pagination
            style={{ marginTop: 20, textAlign: 'right' }}
            current={page}
            pageSize={limit}
            total={total}
            onChange={handlePageChange}
            showSizeChanger={false} // Prevent limit changes
          />
        </>
      )}
    </Modal>
  )
}

export default HallSeatModal
