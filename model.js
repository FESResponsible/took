export const STORES = [
  { id: 'yeonnam', name: '연남 스테이 커피', area: '홍대', keywords: '서울 홍대입구 연남 마포 hongdae yeonnam seoul', station: '홍대입구역 3번 출구', walk: 4, open: '09:00', close: '22:00', basePrice: 4400, image: 'assets/cafe-interior.jpg', imagePosition: 'center 55%', tag: '여행의 시작에 딱', address: '서울 마포구 연남동 일대', type: '카페', x: 25, y: 46 },
  { id: 'seoul-station', name: '서울역 트래블 라운지', area: '서울역', keywords: '서울 용산 기차역 서울역 seoul station yongsan', station: '서울역 12번 출구', walk: 3, open: '08:00', close: '22:00', basePrice: 4400, image: 'assets/seoul-city.jpg', imagePosition: 'center 60%', tag: '기차 타기 전, 가볍게', address: '서울 용산구 동자동 일대', type: '라운지', x: 48, y: 68 },
  { id: 'seongsu', name: '성수 아뜰리에', area: '성수', keywords: '서울 성수 서울숲 뚝섬 seongsu seoul forest', station: '성수역 3번 출구', walk: 5, open: '10:00', close: '21:00', basePrice: 4400, image: 'assets/cafe-warm.jpg', imagePosition: 'center 48%', tag: '골목 구경 전, 잠깐', address: '서울 성동구 성수동 일대', type: '카페', x: 79, y: 61 },
  { id: 'jongno', name: '종로 작은 서가', area: '종로', keywords: '서울 종로 경복궁 북촌 안국 익선동 jongno anguk bukchon', station: '안국역 2번 출구', walk: 4, open: '09:00', close: '20:00', basePrice: 4400, image: 'assets/seoul-alley.png', imagePosition: 'center 45%', tag: '고즈넉한 하루의 시작', address: '서울 종로구 계동 일대', type: '책방', x: 57, y: 28 },
  { id: 'myeongdong', name: '명동 데이 카페', area: '명동', keywords: '서울 명동 을지로 중구 myeongdong euljiro', station: '명동역 4번 출구', walk: 2, open: '09:00', close: '22:00', basePrice: 4400, image: 'assets/cafe-warm.jpg', imagePosition: 'center 65%', tag: '쇼핑백도 가볍게', address: '서울 중구 명동 일대', type: '카페', x: 59, y: 50 },
  { id: 'busan', name: '부산 오션 라운지', area: '부산', keywords: '부산 부산역 초량 busan pusan station', station: '부산역 1번 출구', walk: 5, open: '09:00', close: '21:00', basePrice: 4400, image: 'assets/cafe-interior.jpg', imagePosition: 'center 70%', tag: '바다 보러 가는 길', address: '부산 동구 초량동 일대', type: '라운지', x: 72, y: 82 }
];

export const BAG_TYPES = [
  { key: 'small', label: '소형', detail: '핸드백, 쇼핑백', multiplier: 1 },
  { key: 'medium', label: '중형', detail: '백팩, 일반 캐리어', multiplier: 1.5 },
  { key: 'large', label: '특수', detail: '대형 캐리어, 골프백', multiplier: 2 }
];

export function localDate(date = new Date()) {
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-');
}

export function filterStores({ query = '', area = '전체', lateOnly = false, sort = 'recommended' } = {}) {
  const tokens = query.trim().toLowerCase().replace(/역/g, '').split(/\s+/).filter(Boolean);
  const matches = STORES.filter(store => {
    const searchable = (store.name + ' ' + store.keywords + ' ' + store.station).toLowerCase().replace(/역/g, '');
    return (area === '전체' || store.area === area) && tokens.every(token => searchable.includes(token)) && (!lateOnly || store.close >= '22:00');
  });
  if (sort === 'walk') return matches.sort((a, b) => a.walk - b.walk);
  if (sort === 'price') return matches.sort((a, b) => a.basePrice - b.basePrice || a.walk - b.walk);
  return matches;
}

export function calculateTotal(store, bags) {
  if (!store) throw new Error('보관 공간을 선택해 주세요.');
  return BAG_TYPES.reduce((sum, type) => {
    const count = bags[type.key] || 0;
    if (!Number.isInteger(count) || count < 0 || count > 10) throw new Error('짐 수량을 확인해 주세요.');
    return sum + Math.round(store.basePrice * type.multiplier) * count;
  }, 0);
}

export function validateBooking({ date, start, end, bags }, store, today = localDate()) {
  const errors = [];
  const parsed = new Date(date + 'T00:00:00');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date || '') || Number.isNaN(parsed.getTime()) || localDate(parsed) !== date || date < today) errors.push('오늘 이후의 보관 날짜를 선택해 주세요.');
  const validTime = time => /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(time || '');
  if (!validTime(start) || !validTime(end) || start < store.open || end > store.close || start >= end) errors.push('운영시간 안에서 맡기고 찾을 시간을 선택해 주세요.');
  const count = BAG_TYPES.reduce((sum, type) => sum + (bags[type.key] || 0), 0);
  if (count < 1 || count > 10) errors.push('짐은 1개부터 10개까지 선택할 수 있어요.');
  try { calculateTotal(store, bags); } catch (error) { errors.push(error.message); }
  return errors;
}
