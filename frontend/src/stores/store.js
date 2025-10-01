import { configureStore } from '@reduxjs/toolkit'
import { userReducer } from './Users/userSlice'
import { theatreReducer } from './Theatre/theatreSlice'
import { featureReducer } from './Feature/featureSlice'
import { hallReducer } from './Hall/hallSlice'
import { showTimeReducer } from './Showtimes/showTimeSlice'
import { movieReducer } from './Movie/movieSlice'
import { shownInReducer } from './ShownIn/shownInSlice'
import { seatReducer } from './Seat/seatSlice'
import { selectionReducer } from './selectionSlice'
import { concessionItemsReducer } from './ConcessionItems/concessionItemsSlice'
import { ticketReducer } from './Ticket/ticketSlice'
import { paymentReducer } from './Payment/paymentSlice'

const store = configureStore({
  reducer: {
    user: userReducer,
    theatre: theatreReducer,
    feature: featureReducer,
    hall: hallReducer,
    showTime: showTimeReducer,
    movie: movieReducer,
    shownIn: shownInReducer,
    seat: seatReducer,
    selection: selectionReducer,
    concessionItemsReducer: concessionItemsReducer,
    ticket: ticketReducer,
    payment: paymentReducer
  }
})

export default store
