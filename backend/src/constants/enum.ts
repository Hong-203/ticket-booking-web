export enum Environment {
  local = 'local',
  production = 'production',
  dev = 'dev',
  test = 'test',
}

export enum EQuerySort {
  ASC = 'ASC',
  DESC = 'DESC',
}

export enum LanguageCode {
  EN = 'en',
  VI = 'vi',
}

export enum Gender {
  Male = 'male',
  Female = 'female',
  Other = 'other',
}

export enum AccountType {
  Customer = 'customer',
  Staff = 'staff',
  Admin = 'admin',
}

export enum SeatStatus {
  Booked = 'booked',
  Empty = 'empty',
  Pending = 'pending',
}

export enum SeatBookingStatus {
  Empty = 'empty',
  Pending = 'pending',
  Booked = 'booked',
}

export enum ReleaseStatus {
  NOW_SHOWING = 'now_showing',
  COMING_SOON = 'coming_soon',
}

export enum ConcessionCategory {
  DRINK = 'drink',
  SNACK = 'snack',
  COMBO = 'combo',
}

export enum TicketStatus {
  PENDING = 'pending',
  BOOKED = 'booked',
}

export enum PaymentMethod {
  CASH = 'cash',
  CREDIT_CARD = 'credit_card',
  MOMO = 'momo',
  ZALOPAY = 'zalopay',
  VNPAY = 'vnpay',
}

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELED = 'canceled',
}
