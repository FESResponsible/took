import { SPACES } from './spaces.js?v=096c6c10072e';
import { MAP_SPACES } from './map-spaces.js?v=6b08f818d019';
import { placeSearchText } from './i18n.js?v=74336576c436';

export const SHOW_REAL_NAMES = true;
export const PRICING = {
  hourRate: 1000,
  dayRate: 5000,
  minHours: 2,
  dayHours: 24,
  bagBundle: 3,
  plusRate: 1000
};
export const DAY_RATE = PRICING.dayRate;
export const HOUR_RATE = PRICING.hourRate;
export const NEAR_KM = 5;
export const AREAS = ['홍대·연남', '성수', '강남', '건대', '송리단길·잠실', '대학로', '종로·익선', '명동', '신촌·이대'];
const DISTRICT_MIN = 3;
const DISTRICT_RULES = {
  서울: [
    ['홍대·연남', /홍대|연남|서교|합정|상수역|연희|연트럴/],
    ['성수', /성수|뚝섬|서울숲/],
    ['건대', /건대|건국대|어린이대공원/],
    ['송리단길·잠실', /잠실|송리단|석촌|방이|송파나루|삼전/],
    ['대학로', /대학로|혜화|성균관대/],
    ['종로·익선', /종로|익선|인사동|광화문|경복궁|안국|북촌|삼청|종각|통인시장/],
    ['명동', /명동|남대문|회현|충무로/],
    ['신촌·이대', /신촌|이대역|연세대|대현동/],
    ['강남', /강남|역삼|신논현|선릉|삼성역|압구정|청담|신사역/]
  ],
  부산: [
    ['광안리', /광안리|광안역|광안1|광안터널|경성대|금련산|민락/],
    ['해운대', /해운대|좌동|송정|동백|오시리아|센텀/],
    ['서면', /서면|부전|전포|범내골/],
    ['남포·광복', /남포|광복|자갈치/]
  ],
  인천: [
    ['공항', /공항|운서|파라다이스/],
    ['개항장', /개항장|신포|월미|동인천|송월/],
    ['부평', /부평/]
  ],
  대구: [
    ['동대구', /동대구/]
  ],
  대전: [
    ['스카이로드', /스카이로드|대흥|중앙로역/]
  ]
};

function cityForRegion(region) {
  return AREAS.includes(region) || region === '기타' ? '서울' : region;
}

function districtFor(region, realName) {
  if (AREAS.includes(region)) return region;
  const found = (DISTRICT_RULES[region] || []).find(([, pattern]) => pattern.test(realName || ''));
  return found ? found[0] : '';
}
export const CATEGORIES = ['공방', '보드게임카페', '만화카페', '방탈출'];

const CATEGORY_LABEL = {
  '공방·원데이클래스': '공방',
  '보드게임카페': '보드게임카페',
  '만화카페': '만화카페',
  '방탈출': '방탈출'
};
const CATEGORY_IMAGES = {
  '공방·원데이클래스': [
    ['assets/workshop-studio.jpg', 'center 62%'],
    ['assets/workshop-beads.jpg', 'center 58%']
  ],
  '보드게임카페': [
    ['assets/boardgame-table.jpg', 'center 70%'],
    ['assets/boardgame-shelf.jpg', 'center 55%']
  ],
  '만화카페': [
    ['assets/comic-shelves.jpg', 'center 50%'],
    ['assets/comic-nook.jpg', 'center 55%']
  ],
  '방탈출': [
    ['assets/escape-desk.jpg', 'center 55%'],
    ['assets/escape-door.jpg', 'center 48%']
  ]
};
const GROUP_IMAGES = {
  '카페·디저트': [
    ['assets/cafe-warm.jpg', 'center 55%'],
    ['assets/cafe-interior.jpg', 'center 50%']
  ],
  '숙박': [
    ['assets/seoul-city.jpg', 'center 42%'],
    ['assets/seoul-alley.png', 'center 60%']
  ]
};
const DEFAULT_IMAGES = [
  ['assets/seoul-city.jpg', 'center 42%'],
  ['assets/seoul-alley.png', 'center 60%']
];

function letter(index) {
  let value = index;
  let result = '';
  do {
    result = String.fromCharCode(65 + (value % 26)) + result;
    value = Math.floor(value / 26) - 1;
  } while (value >= 0);
  return result;
}

function roundCoord(value) {
  return Math.round(value * 1000) / 1000;
}

const STATIONS = {
  '강남역': [37.497952, 127.027619],
  '압구정역': [37.527268, 127.028614],
  '삼성역': [37.508844, 127.06316],
  '천호역': [37.53852, 127.123572],
  '미아사거리역': [37.613292, 127.030053],
  '서울대입구역': [37.481284, 126.952713],
  '신림역': [37.484201, 126.929715],
  '건대입구역': [37.540389, 127.07023],
  '신도림역': [37.508961, 126.891224],
  '구로디지털단지역': [37.4852, 126.901451],
  '노원역': [37.655128, 127.061368],
  '공릉역': [37.6256, 127.0728],
  '회기역': [37.589756, 127.057977],
  '이수역': [37.486263, 126.981989],
  '홍대입구역': [37.557192, 126.925381],
  '망원역': [37.555964, 126.910454],
  '이대역': [37.556733, 126.946013],
  '합정역': [37.549463, 126.913739],
  '성수역': [37.544581, 127.055961],
  '성신여대입구역': [37.592624, 127.016403],
  '한성대입구역': [37.588375, 127.006118],
  '잠실새내역': [37.511687, 127.086162],
  '석촌역': [37.50538, 127.106979],
  '삼각지역': [37.534777, 126.97311],
  '구파발역': [37.636363, 126.918821],
  '혜화역': [37.582336, 127.001844],
  '종로3가역': [37.571607, 126.991806],
  '동묘앞역': [37.573204, 127.016429],
  '명동역': [37.560989, 126.986325]
};

const STATION_NAME = {
  '건대': '건대입구역',
  '홍대': '홍대입구역',
  '성수': '성수역',
  '성수동': '성수역',
  '대학로': '혜화역',
  '명동': '명동역',
  '합정': '합정역',
  '이대': '이대역',
  '송리단길': '석촌역',
  '샤로수길': '서울대입구역',
  '연남동': '홍대입구역',
  '망원동': '망원역',
  '익선동': '종로3가역',
  '성신대입구역': '성신여대입구역'
};

function stationName(nearby) {
  if (STATIONS[nearby]) return nearby;
  return STATION_NAME[nearby] || nearby;
}

function walkMinutes(lat, lng, station) {
  const point = STATIONS[station];
  if (!point) return 1;
  const earth = 6371;
  const dLat = (lat - point[0]) * Math.PI / 180;
  const dLng = (lng - point[1]) * Math.PI / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(point[0] * Math.PI / 180) * Math.cos(lat * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  const meters = 2 * earth * Math.asin(Math.min(1, Math.sqrt(h))) * 1000;
  return Math.max(1, Math.round(meters / 75));
}

function padTime(value) {
  const [hour, minute] = value.split(':').map(Number);
  if (hour >= 24) return '23:30';
  return String(hour).padStart(2, '0') + ':' + String(minute).padStart(2, '0');
}

function bookingWindow(hoursText) {
  const match = String(hoursText || '').match(/(\d{1,2}:\d{2})\s*~\s*(\d{1,2}:\d{2})/);
  if (!match) return { open: '00:00', close: '23:30', hoursFlexible: true };
  let open = padTime(match[1]);
  let close = padTime(match[2]);
  if (close <= open) close = '23:30';
  return { open, close, hoursFlexible: false };
}

function buildStores(spaces) {
  const counts = {};
  return spaces.map(space => {
    const type = CATEGORY_LABEL[space.category] || space.category;
    const key = space.region + '\0' + space.category;
    const index = counts[key] || 0;
    counts[key] = index + 1;
    const alias = space.region + ' ' + type + ' ' + letter(index);
    const photos = CATEGORY_IMAGES[space.category] || GROUP_IMAGES[space.group] || (space.list === 'map' ? DEFAULT_IMAGES : CATEGORY_IMAGES['공방·원데이클래스']);
    const [image, imagePosition] = photos[index % photos.length];
    const hoursLines = String(space.hoursText || '').split(/\s*;\s*/).map(line => line.trim()).filter(Boolean);
    const window = bookingWindow(space.hoursText);
    const station = stationName(space.nearby);
    const knownStation = Boolean(STATIONS[station]);
    const walk = knownStation || space.list !== 'map' ? walkMinutes(space.lat, space.lng, station) : 0;
    const placeLabel = space.placeLabel || (space.list === 'map' && !knownStation ? (space.nearby || space.addressShort) : station + '에서 도보 ' + walk + '분');
    return {
      id: space.region + '-' + type + '-' + String(index + 1).padStart(2, '0'),
      list: space.list || 'candidate',
      alias,
      name: alias,
      realName: space.realName,
      area: space.region,
      city: cityForRegion(space.region),
      district: districtFor(space.region, space.realName),
      category: space.category,
      group: space.group || '',
      type,
      nearby: space.nearby,
      station,
      walk,
      placeLabel,
      address: space.address,
      addressShort: space.addressShort,
      addressLabel: space.addressShort,
      hoursText: space.hoursText,
      hoursCard: hoursLines[0] || space.hoursText,
      hoursLines,
      open: window.open,
      close: window.close,
      hoursFlexible: window.hoursFlexible,
      hours24: typeof space.hours24 === 'boolean' ? space.hours24 : /24\s*시간|24시/.test(space.hoursText),
      cold: false,
      lateNight: Boolean(space.lateNight),
      popularity: space.popularity,
      lat: space.lat,
      lng: space.lng,
      pinLat: roundCoord(space.lat),
      pinLng: roundCoord(space.lng),
      showMaps: false,
      tag: space.nearby,
      image,
      imagePosition,
      searchText: ''
    };
  });
}

function presentStore(store, showRealNames) {
  store.name = showRealNames ? store.realName : store.alias;
  store.addressLabel = showRealNames ? store.address : store.addressShort;
  store.pinLat = showRealNames ? store.lat : roundCoord(store.lat);
  store.pinLng = showRealNames ? store.lng : roundCoord(store.lng);
  store.showMaps = showRealNames;
  const parts = [store.city, store.district, store.area, store.nearby, store.addressShort, store.alias, store.type];
  if (showRealNames) parts.push(store.realName, store.address);
  store.searchText = parts.filter(Boolean).join(' ');
}

export let showRealNames = SHOW_REAL_NAMES;
export function setShowRealNames(value) {
  showRealNames = Boolean(value);
  STORES.forEach(store => presentStore(store, showRealNames));
  return showRealNames;
}

export function districtsFor(city) {
  const counts = new Map();
  STORES.forEach(store => {
    if (store.city !== city || !store.district) return;
    counts.set(store.district, (counts.get(store.district) || 0) + 1);
  });
  const order = (DISTRICT_RULES[city] || []).map(([name]) => name);
  return [...counts.keys()]
    .filter(name => AREAS.includes(name) || counts.get(name) >= DISTRICT_MIN)
    .sort((a, b) => {
      const ia = AREAS.indexOf(a);
      const ib = AREAS.indexOf(b);
      if (ia !== -1 || ib !== -1) return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
      const ra = order.indexOf(a);
      const rb = order.indexOf(b);
      if (ra !== -1 || rb !== -1) return (ra === -1 ? 99 : ra) - (rb === -1 ? 99 : rb);
      return counts.get(b) - counts.get(a) || a.localeCompare(b, 'ko');
    });
}

export function resolveArea(area) {
  if (!area || area === '전체') return { city: '', district: '' };
  const match = STORES.find(store => store.district === area);
  if (match && !STORES.some(store => store.city === area)) return { city: match.city, district: area };
  if (STORES.some(store => store.city === area)) return { city: area, district: '' };
  return { city: '', district: '' };
}

export function resolveCopyMode(queryValue, storedValue, options = {}) {
  const present = options.paramPresent === true || (queryValue != null && queryValue !== '');
  if (present) return queryValue === 'tourism' || queryValue === 'daily' ? queryValue : 'tourism';
  return storedValue === 'tourism' || storedValue === 'daily' ? storedValue : 'tourism';
}

export function copyContextFor(mode) {
  const copy_mode = mode === 'daily' ? 'daily' : 'tourism';
  return { copy_mode, copy_version: copy_mode + '-1' };
}

export const STORES = buildStores([...SPACES, ...MAP_SPACES]);
setShowRealNames(SHOW_REAL_NAMES);

export function localDate(date = new Date()) {
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-');
}

export function toMinutes(time) {
  const [hour, minute] = String(time || '').split(':').map(Number);
  return hour * 60 + minute;
}

export function isTime(time) {
  return /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(time || '');
}

export function distanceKm(from, to) {
  const earth = 6371;
  const dLat = (to.lat - from.lat) * Math.PI / 180;
  const dLng = (to.lng - from.lng) * Math.PI / 180;
  const lat1 = from.lat * Math.PI / 180;
  const lat2 = to.lat * Math.PI / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * earth * Math.asin(Math.min(1, Math.sqrt(h)));
}

export function billedHours(start, end) {
  if (!isTime(start) || !isTime(end)) throw new Error('시간을 확인해 주세요.');
  const minutes = toMinutes(end) - toMinutes(start);
  if (minutes <= 0) throw new Error('찾는 시간을 시작 시간보다 늦게 선택해 주세요.');
  return Math.ceil(minutes / 60);
}

export function filterStores({ query = '', area = '전체', category = '전체', sort = 'recommended', origin = null, nearOnly = false, hours24 = false, cold = false } = {}) {
  const tokens = query.trim().toLowerCase().replace(/역/g, '').split(/\s+/).filter(Boolean);
  let matches = STORES.filter(store => {
    const searchable = (store.searchText + ' ' + store.name + ' ' + store.type + ' ' + placeSearchText(store)).toLowerCase().replace(/역/g, '');
    const areaOk = area === '전체' || store.area === area || store.city === area || store.district === area;
    const categoryOk = category === '전체' || store.type === category;
    return areaOk && categoryOk && tokens.every(token => searchable.includes(token)) && (!hours24 || store.hours24) && (!cold || store.cold);
  }).map(store => origin ? { ...store, distanceKm: distanceKm(origin, store) } : store);
  if (origin && nearOnly) matches = matches.filter(store => store.distanceKm <= NEAR_KM);
  if (sort === 'distance' && origin) return matches.sort((a, b) => a.distanceKm - b.distanceKm || b.popularity - a.popularity);
  return matches.sort((a, b) => b.popularity - a.popularity || a.name.localeCompare(b.name, 'ko'));
}

export function billableUnits(totalCount, shoppingBagCount = 0) {
  if (!Number.isInteger(totalCount) || totalCount < 1 || totalCount > 10) throw new Error('짐 수량을 확인해 주세요.');
  let bags = Number.isInteger(shoppingBagCount) ? shoppingBagCount : 0;
  if (bags < 0) bags = 0;
  if (bags > totalCount) bags = totalCount;
  const bagUnits = bags === 0 ? 0 : Math.ceil(bags / PRICING.bagBundle);
  return {
    totalCount,
    shoppingBagCount: bags,
    bagUnits,
    units: totalCount - bags + bagUnits
  };
}

export function feePerUnit({ plan, hours }) {
  if (plan === 'day') return { amount: PRICING.dayRate, hours: 0, billedHours: 0, minimumApplied: false, capped: false };
  if (plan !== 'hour') throw new Error('요금제를 선택해 주세요.');
  if (!Number.isInteger(hours) || hours < 1) throw new Error('시간을 확인해 주세요.');
  const minimumApplied = hours < PRICING.minHours;
  const billedHours = minimumApplied ? PRICING.minHours : hours;
  const fullDays = Math.floor(billedHours / PRICING.dayHours);
  const rest = billedHours % PRICING.dayHours;
  const restRaw = rest * PRICING.hourRate;
  const amount = fullDays * PRICING.dayRate + (rest === 0 ? 0 : Math.min(restRaw, PRICING.dayRate));
  return {
    amount,
    hours,
    billedHours,
    minimumApplied,
    capped: fullDays > 0 || restRaw >= PRICING.dayRate
  };
}

export function quote({ plan, count, shoppingBagCount = 0, start, end, hours, plus = false } = {}) {
  const units = billableUnits(count, shoppingBagCount);
  const priced = plan === 'hour'
    ? feePerUnit({ plan, hours: Number.isInteger(hours) ? hours : billedHours(start, end) })
    : feePerUnit({ plan, hours: 0 });
  const storage = priced.amount * units.units;
  const plusOn = Boolean(plus);
  const plusFee = plusOn ? PRICING.plusRate * units.units : 0;
  return {
    plan,
    hours: priced.hours,
    billedHours: priced.billedHours,
    totalCount: units.totalCount,
    shoppingBagCount: units.shoppingBagCount,
    bagUnits: units.bagUnits,
    units: units.units,
    plus: plusOn,
    storage,
    plusFee,
    total: storage + plusFee,
    minimumApplied: priced.minimumApplied,
    capped: priced.capped
  };
}

export function calculateTotal(input) {
  return quote(input).total;
}

function withinHours(store, time) {
  if (!isTime(time)) return false;
  if (store.hoursFlexible) return true;
  return time >= store.open && time < store.close;
}

export function validateBooking({ date, start, end, count, plan, note }, store, today = localDate()) {
  const errors = [];
  const parsed = new Date((date || '') + 'T00:00:00');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date || '') || Number.isNaN(parsed.getTime()) || localDate(parsed) !== date || date < today) errors.push('오늘 이후의 보관 날짜를 선택해 주세요.');
  if (!withinHours(store, start)) errors.push('운영시간 안에서 시작 시간을 선택해 주세요.');
  if (plan !== 'day' && plan !== 'hour') errors.push('요금제를 선택해 주세요.');
  if (plan === 'hour') {
    const outside = store.hoursFlexible ? (!isTime(end) || end <= start) : (!isTime(end) || end > store.close || end <= start);
    if (outside) errors.push('운영시간 안에서 찾는 시간을 선택해 주세요.');
  }
  if (!Number.isInteger(count) || count < 1 || count > 10) errors.push('짐은 1개부터 10개까지 선택할 수 있어요.');
  const luggage = typeof note === 'string' ? note.trim() : '';
  if (luggage.length < 1 || luggage.length > 120) errors.push('짐 종류를 1자에서 120자 사이로 적어 주세요.');
  if (!errors.length) {
    try { calculateTotal({ plan, count, start, end }); }
    catch (error) { errors.push(error.message); }
  }
  return errors;
}
