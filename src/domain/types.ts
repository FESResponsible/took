export type BagSize = 'small' | 'medium' | 'large';

export type BagCount = Readonly<Record<BagSize, number>>;

export type BookingStatus =
  | 'pending_approval'
  | 'confirmed'
  | 'checked_in'
  | 'completed'
  | 'rejected'
  | 'expired'
  | 'no_show';

export type ApprovalReason =
  | 'size_not_accepted'
  | 'outside_hours'
  | 'long_stay'
  | 'group'
  | 'over_capacity';

export interface CheckInRecord {
  readonly at: string;
  readonly photos: readonly string[];
  readonly bagTotal: number;
  readonly bagCountMismatch: boolean;
}

export interface Booking {
  readonly id: string;
  readonly code: string;
  readonly customerName: string;
  readonly customerLanguage: string;
  readonly bags: BagCount;
  readonly dropOffAt: string;
  readonly pickUpAt: string;
  readonly status: BookingStatus;
  readonly createdAt: string;
  readonly approvalReasons: readonly ApprovalReason[];
  readonly approvalDeadline?: string;
  readonly decidedAt?: string;
  readonly checkIn?: CheckInRecord;
  readonly checkedOutAt?: string;
  readonly noShowAt?: string;
}

export interface OpenHours {
  /** 'HH:mm' */
  readonly open: string;
  /** 'HH:mm' */
  readonly close: string;
}

export interface StoreSettings {
  readonly maxBagsAtOnce: number;
  readonly acceptedSizes: Readonly<Record<BagSize, boolean>>;
  readonly openHours: OpenHours;
  readonly maxStorageDays: number;
  readonly groupBagThreshold: number;
  /** 'YYYY-MM-DD'. 이 날짜에는 새 예약을 받지 않는다. */
  readonly pausedOn?: string;
}

export interface Policy {
  readonly payoutPerBagKrw: number;
  readonly noShowCompensationRate: number;
  readonly approvalResponseMinutes: number;
  readonly noShowGraceMinutes: number;
}

export type TicketKind = 'dispute' | 'question' | 'other';

export interface Ticket {
  readonly id: string;
  readonly kind: TicketKind;
  readonly bookingId?: string;
  readonly message: string;
  readonly createdAt: string;
  readonly status: 'received';
}

export type ChatAuthor = 'guest' | 'store';

export interface ChatMessage {
  readonly id: string;
  readonly bookingId: string;
  readonly author: ChatAuthor;
  readonly body: string;
  readonly createdAt: string;
  /** 줄인 JPEG data URL. 데모에서는 이 브라우저에만 둔다. */
  readonly photos?: readonly string[];
  /** 손님이 보낸 메시지를 사장님이 연 시각 */
  readonly readAt?: string;
  /** 매장 메시지를 손님이 읽은 시각. 없으면 안 읽음. */
  readonly guestReadAt?: string;
}

export interface StoreProfile {
  readonly name: string;
  readonly managerName: string;
  readonly managerPhone: string;
  readonly managerEmail: string;
}

