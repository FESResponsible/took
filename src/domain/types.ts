export type BookingStatus = 'pending_approval' | 'confirmed' | 'checked_in' | 'completed' | 'rejected' | 'expired' | 'no_show';

export interface Store {
  readonly id: string;
  readonly name: string;
  readonly area: string;
  /** 이 날짜에는 새 예약을 받지 않는다. YYYY-MM-DD */
  readonly pausedOn?: string;
}

export interface Booking {
  readonly id: string;
  readonly code: string;
  readonly storeId: string;
  readonly customerName: string;
  readonly bags: number;
  readonly dropOffAt: string;
  readonly pickUpAt: string;
  readonly status: BookingStatus;
  readonly checkedOutAt?: string;
  readonly noShowAt?: string;
}

export interface Inquiry {
  readonly id: string;
  readonly storeId: string;
  readonly title: string;
  readonly body: string;
  readonly createdAt: string;
}

export interface Note {
  readonly id: string;
  readonly inquiryId: string;
  readonly body: string;
  readonly createdAt: string;
}

export interface SupplierState {
  readonly version: 1;
  readonly stores: readonly Store[];
  readonly bookings: readonly Booking[];
  readonly inquiries: readonly Inquiry[];
  readonly notes: readonly Note[];
}
