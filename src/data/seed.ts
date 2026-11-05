import { DEFAULT_POLICY } from '@/config/policy';
import type { BagCount, Booking, ChatMessage, StoreSettings } from '@/domain/types';
import type { PartnerState } from '@/state/reducer';

const SAMPLE_PHOTO = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="320" height="240" viewBox="0 0 320 240">' +
    '<rect width="320" height="240" fill="#ecebe4"/>' +
    '<rect x="110" y="70" width="100" height="130" rx="14" fill="#c9c8bd"/>' +
    '<rect x="140" y="48" width="40" height="26" rx="6" fill="none" stroke="#9a998f" stroke-width="6"/>' +
    '<text x="160" y="226" font-family="sans-serif" font-size="16" text-anchor="middle" fill="#6b6b64">예시 사진</text>' +
    '</svg>',
)}`;

const DEFAULT_SETTINGS: StoreSettings = {
  maxBagsAtOnce: 8,
  acceptedSizes: { small: true, medium: true, large: true },
  openHours: { open: '09:00', close: '21:00' },
  maxStorageDays: 3,
  groupBagThreshold: 5,
};

const bags = (small: number, medium: number, large: number): BagCount => ({ small, medium, large });

const SEED_CHAT_PHOTO = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="480" height="360" viewBox="0 0 480 360">' +
    '<rect width="480" height="360" fill="#d7f6f0"/>' +
    '<rect x="146" y="96" width="112" height="160" rx="18" fill="#08cbaa"/>' +
    '<rect x="246" y="132" width="92" height="124" rx="16" fill="#00b9c8"/>' +
    '<rect x="176" y="70" width="52" height="30" rx="8" fill="none" stroke="#213a3c" stroke-width="8"/>' +
    '<rect x="270" y="112" width="44" height="24" rx="8" fill="none" stroke="#213a3c" stroke-width="8"/>' +
    '<rect x="118" y="268" width="246" height="12" rx="6" fill="#213a3c"/>' +
    '</svg>',
)}`;

/** 데모 대화. 손님 메시지는 아직 읽지 않은 상태로 둔다. */
export function createSeedMessages(now: Date): ChatMessage[] {
  const ago = (minutes: number) => new Date(now.getTime() - minutes * 60_000).toISOString();
  return [
    { id: 'seed-m1', bookingId: 'seed-c1', author: 'guest', body: '안녕하세요. 짐은 매장 안 카운터에 맡기면 될까요?', createdAt: ago(46) },
    { id: 'seed-m2', bookingId: 'seed-c1', author: 'guest', body: '지금 역에서 걸어가고 있어요.', createdAt: ago(38) },
    { id: 'seed-m6', bookingId: 'seed-c1', author: 'guest', body: '매장 앞 모습이에요.', photos: [SEED_CHAT_PHOTO], createdAt: ago(34) },
    { id: 'seed-m3', bookingId: 'seed-c4', author: 'guest', body: '내일 찾는 시간을 15시로 바꿀 수 있을까요? 비행기가 당겨졌어요.', createdAt: ago(24) },
    { id: 'seed-m4', bookingId: 'seed-s1', author: 'guest', body: '캐리어랑 백팩, 두 개 맞는지 확인해 주세요.', createdAt: ago(200), readAt: ago(185) },
    { id: 'seed-m5', bookingId: 'seed-s1', author: 'store', body: '네, 두 개 모두 받아 두었어요.', createdAt: ago(180), guestReadAt: ago(170) },
    { id: 'seed-m7', bookingId: 'seed-s1', author: 'store', body: '찾으러 오실 때 예약 화면을 보여 주세요.', createdAt: ago(12) },
  ];
}

/** 데모 시연용 예약. 모든 시간은 화면을 연 시각 기준으로 만든다. */
export function createSeedState(now: Date): PartnerState {
  const fromNow = (minutes: number): string => new Date(now.getTime() + minutes * 60_000).toISOString();
  const onDay = (dayOffset: number, hour: number): string =>
    new Date(now.getFullYear(), now.getMonth(), now.getDate() + dayOffset, hour).toISOString();

  const base = (id: string, code: string, name: string, language: string, bagCount: BagCount) => ({
    id,
    code,
    customerName: name,
    customerLanguage: language,
    bags: bagCount,
    createdAt: fromNow(-24 * 60),
    approvalReasons: [],
  });

  const completed = (day: number, id: string, code: string, name: string, language: string, bagCount: BagCount): Booking => ({
    ...base(id, code, name, language, bagCount),
    status: 'completed',
    dropOffAt: onDay(-day, 11),
    pickUpAt: onDay(-day, 17),
    checkIn: { at: onDay(-day, 11), photos: [SAMPLE_PHOTO], bagTotal: bagCount.small + bagCount.medium + bagCount.large, bagCountMismatch: false },
    checkedOutAt: onDay(-day, 17),
  });

  const bookings: Booking[] = [
    {
      ...base('seed-p1', 'TK-3187', 'Wang Wei', '중국어', bags(0, 2, 4)),
      status: 'pending_approval',
      dropOffAt: fromNow(180),
      pickUpAt: fromNow(420),
      createdAt: fromNow(-8),
      approvalReasons: ['group'],
      approvalDeadline: fromNow(22),
    },
    { ...base('seed-c1', 'TK-2041', 'Emma Wilson', '영어', bags(0, 1, 1)), status: 'confirmed', dropOffAt: fromNow(60), pickUpAt: fromNow(360) },
    { ...base('seed-c2', 'TK-5521', 'Sato Yui', '일본어', bags(1, 0, 0)), status: 'confirmed', dropOffAt: fromNow(150), pickUpAt: fromNow(300) },
    { ...base('seed-c3', 'TK-7730', 'Lucas Martin', '프랑스어', bags(0, 1, 0)), status: 'confirmed', dropOffAt: fromNow(-100), pickUpAt: fromNow(180) },
    { ...base('seed-c4', 'TK-6402', 'Nguyen An', '베트남어', bags(0, 2, 0)), status: 'confirmed', dropOffAt: onDay(1, 10), pickUpAt: onDay(1, 17) },
    {
      ...base('seed-s1', 'TK-1189', 'Olivia Chen', '영어', bags(0, 1, 1)),
      status: 'checked_in',
      dropOffAt: fromNow(-180),
      pickUpAt: fromNow(120),
      checkIn: { at: fromNow(-175), photos: [SAMPLE_PHOTO], bagTotal: 2, bagCountMismatch: false },
    },
    {
      ...base('seed-s2', 'TK-4410', '박지훈', '한국어', bags(1, 0, 0)),
      status: 'checked_in',
      dropOffAt: fromNow(-300),
      pickUpAt: fromNow(-30),
      checkIn: { at: fromNow(-295), photos: [SAMPLE_PHOTO], bagTotal: 1, bagCountMismatch: false },
    },
    completed(1, 'seed-d1', 'TK-1024', 'Sophie Brown', '영어', bags(0, 2, 0)),
    completed(2, 'seed-d2', 'TK-1031', 'Tanaka Ren', '일본어', bags(1, 1, 0)),
    completed(3, 'seed-d3', 'TK-1047', 'Li Na', '중국어', bags(0, 1, 2)),
    completed(5, 'seed-d4', 'TK-1058', 'Daniel Kim', '영어', bags(0, 1, 0)),
    completed(6, 'seed-d5', 'TK-1066', 'Chloe Dubois', '프랑스어', bags(0, 0, 1)),
    {
      ...base('seed-n1', 'TK-1072', 'Mateo Garcia', '스페인어', bags(0, 2, 0)),
      status: 'no_show',
      dropOffAt: onDay(-4, 10),
      pickUpAt: onDay(-4, 16),
      noShowAt: onDay(-4, 11),
    },
  ];

  return {
    version: 1,
    store: { name: '데모 매장', managerName: '[담당자 이름]', managerPhone: '[전화]', managerEmail: '[이메일]' },
    settings: DEFAULT_SETTINGS,
    policy: DEFAULT_POLICY,
    bookings,
    tickets: [],
    messages: createSeedMessages(now),
    notice: null,
  };
}

