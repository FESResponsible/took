import { STORES, BAG_TYPES, filterStores, calculateTotal, validateBooking, localDate } from './model.js';

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));
const escapeHtml = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
const icon = (name, className = '') => '<svg class="' + className + '" aria-hidden="true"><use href="#i-' + name + '"/></svg>';
const money = amount => Number(amount).toLocaleString('ko-KR') + '원';
const storage = {
  get(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } },
  set(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch { return false; } }
};
const favouriteData = storage.get('linkeep-demo-favourites', []);
const state = { query: new URLSearchParams(location.search).get('q') || '', area: '전체', lateOnly: false, sort: 'recommended', view: 'cards', bagCount: 1, favourites: new Set(Array.isArray(favouriteData) ? favouriteData.filter(id => STORES.some(store => store.id === id)) : []), selectedStore: null, bookingBags: { small: 0, medium: 1, large: 0 } };
let toastTimer;

function toast(message) {
  const element = $('#toast');
  clearTimeout(toastTimer);
  element.textContent = message;
  element.hidden = false;
  toastTimer = setTimeout(() => { element.hidden = true; }, 3300);
}

function dateLabel(date) {
  const parsed = new Date(date + 'T00:00:00');
  return Number.isNaN(parsed.getTime()) ? '날짜 확인 필요' : new Intl.DateTimeFormat('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' }).format(parsed);
}

function renderStores() {
  const stores = filterStores(state);
  $('#results-summary').innerHTML = (state.query ? '<strong>“' + escapeHtml(state.query) + '”</strong> 주변 ' : '') + '보관 공간 <strong>' + stores.length + '</strong>곳';
  $('#store-grid').innerHTML = stores.map(store => {
    const saved = state.favourites.has(store.id);
    return '<article class="store-card"><button class="store-image-button" data-store="' + store.id + '" aria-label="' + store.name + ' 상세 보기"><img src="' + store.image + '" alt="' + store.name + '의 분위기를 표현한 예시 사진" loading="lazy" width="900" height="675" style="object-position:' + store.imagePosition + '"><span class="store-tag">' + store.tag + '</span></button><button class="save-button" data-favourite="' + store.id + '" aria-label="' + store.name + (saved ? ' 저장 해제' : ' 저장') + '" aria-pressed="' + saved + '">' + icon('heart') + '</button><div class="store-body"><div class="store-category"><span>' + store.area + '</span><span>' + store.type + '</span></div><button class="store-title" data-store="' + store.id + '">' + store.name + '</button><div class="store-access">' + icon('walk') + '<span>' + store.station + ' 도보 ' + store.walk + '분</span><span class="access-hours">/ ' + store.open + '–' + store.close + '</span></div><div class="store-price-row"><span class="store-price">' + money(store.basePrice) + '<small>/ 개, 하루부터</small></span><button class="store-open-link" data-store="' + store.id + '">공간 보기' + icon('arrow') + '</button></div></div></article>';
  }).join('');
  $('#store-grid').hidden = state.view !== 'cards' || !stores.length;
  $('#illustrated-map').hidden = state.view !== 'map' || !stores.length;
  $('#empty-state').hidden = stores.length > 0;
  $('#map-pins').innerHTML = stores.map(store => '<button class="map-pin" style="left:' + store.x + '%;top:' + store.y + '%" data-store="' + store.id + '" aria-label="' + store.name + ' 상세 보기">' + money(store.basePrice) + '</button>').join('');
  $('#map-list').innerHTML = stores.map(store => '<button class="map-list-card" data-store="' + store.id + '"><img src="' + store.image + '" alt="" loading="lazy"><span><strong>' + store.name + '</strong><small>' + store.station + ' 도보 ' + store.walk + '분 / ' + store.open + '–' + store.close + '</small><b>' + money(store.basePrice) + '부터</b></span></button>').join('');
  $$('.area-filters button').forEach(button => { const active = button.dataset.area === state.area; button.classList.toggle('active', active); button.setAttribute('aria-pressed', String(active)); });
  $('#cards-view').classList.toggle('active', state.view === 'cards');
  $('#cards-view').setAttribute('aria-pressed', String(state.view === 'cards'));
  $('#map-view').classList.toggle('active', state.view === 'map');
  $('#map-view').setAttribute('aria-pressed', String(state.view === 'map'));
}

function runSearch(query = $('#location-search').value) {
  state.query = query.trim();
  state.area = '전체';
  $('#location-search').value = state.query;
  const url = new URL(location.href);
  if (state.query) url.searchParams.set('q', state.query); else url.searchParams.delete('q');
  history.replaceState({}, '', url);
  $('#bag-popover').hidden = true;
  $('#bag-toggle').setAttribute('aria-expanded', 'false');
  renderStores();
  $('#places').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
}

function updateHeroBags(amount) {
  state.bagCount = Math.max(1, Math.min(10, state.bagCount + amount));
  $('#hero-bag-count').textContent = state.bagCount;
  $('#bag-label').textContent = '짐 ' + state.bagCount + '개';
  $('#hero-bag-minus').disabled = state.bagCount === 1;
  $('#hero-bag-plus').disabled = state.bagCount === 10;
}

function halfHours(open, close) {
  const toMinutes = time => Number(time.split(':')[0]) * 60 + Number(time.split(':')[1]);
  const result = [];
  for (let minutes = toMinutes(open); minutes <= toMinutes(close); minutes += 30) result.push(String(Math.floor(minutes / 60)).padStart(2, '0') + ':' + String(minutes % 60).padStart(2, '0'));
  return result;
}

function timeOptions(times, selected) {
  return times.map(time => '<option value="' + time + '"' + (time === selected ? ' selected' : '') + '>' + time + '</option>').join('');
}

function openStore(id) {
  const store = STORES.find(item => item.id === id);
  if (!store) return;
  state.selectedStore = store;
  state.bookingBags = { small: 0, medium: state.bagCount, large: 0 };
  const times = halfHours(store.open, store.close);
  const start = times[2] || times[0];
  const end = times[Math.min(8, times.length - 1)];
  const date = $('#search-date').value || localDate();
  $('#store-dialog-content').innerHTML = '<div class="detail-layout"><div class="detail-intro"><img class="detail-hero" src="' + store.image + '" alt="' + store.name + ' 분위기 예시" style="object-position:' + store.imagePosition + '"><div class="detail-copy"><div class="eyebrow">YOUR LIGHT SPOT / ' + store.area + '</div><h2 id="store-title">' + store.name + '</h2><p class="detail-address">' + store.address + ' / 예시 공간</p><div class="detail-facts"><span>' + icon('walk') + store.station + '에서 도보 ' + store.walk + '분</span><span>' + icon('clock') + store.open + '–' + store.close + ' 운영 예시</span><span>' + icon('bag') + '소형, 중형, 특수 크기 선택</span><span>' + icon('camera') + '보관 전후 사진 확인 안내</span></div><p class="detail-note">이 공간의 이름, 위치와 사진은 시안용 예시예요. 실제 매장의 이용 가능 여부를 나타내지 않으며, 예약 및 결제가 접수되지 않아요.</p></div></div><form class="detail-booking" id="booking-form"><h3>잠시 맡길 준비를 해볼까요?</h3><p class="booking-subtitle">내 일정에 맞는 보관 내용을 선택해 보세요.</p><label class="booking-label" for="booking-date">보관 날짜</label><input class="booking-date" type="date" id="booking-date" name="date" value="' + escapeHtml(date) + '" min="' + localDate() + '" required><div class="time-row"><label><span class="booking-label">맡기는 시간</span><select id="booking-start" name="start" required>' + timeOptions(times.slice(0, -1), start) + '</select></label><label><span class="booking-label">찾는 시간</span><select id="booking-end" name="end" required>' + timeOptions(times.slice(1), end) + '</select></label></div><div class="booking-bags"><span class="booking-label">짐 크기와 개수</span>' + BAG_TYPES.map(type => '<div class="booking-bag-row"><div><strong>' + type.label + ' <span>' + money(Math.round(store.basePrice * type.multiplier)) + '</span></strong><small>' + type.detail + ' / 개, 하루</small></div><div class="stepper"><button type="button" data-bag="' + type.key + '" data-change="-1" aria-label="' + type.label + ' 짐 줄이기">−</button><output id="qty-' + type.key + '">' + state.bookingBags[type.key] + '</output><button type="button" data-bag="' + type.key + '" data-change="1" aria-label="' + type.label + ' 짐 늘리기">+</button></div></div>').join('') + '</div><div class="booking-total"><span>예상 보관 요금<small>하루 기준 예시 요금, 실제 청구 없음</small></span><strong id="booking-total">' + money(calculateTotal(store, state.bookingBags)) + '</strong></div><label class="booking-consent"><input type="checkbox" name="demoConsent" required><span>실제 예약 및 결제가 아닌 데모임을 확인했어요.</span></label><div id="booking-errors" class="booking-errors" role="alert" hidden></div><button class="button button-primary booking-submit" type="submit">데모 예약 내용 확인하기' + icon('arrow') + '</button></form></div>';
  updateBookingBags();
  $('#store-dialog').showModal();
  $('#booking-form').addEventListener('submit', submitBooking);
  $('#booking-start').addEventListener('change', () => {
    const from = $('#booking-start').value;
    const currentEnd = $('#booking-end').value;
    $('#booking-end').innerHTML = timeOptions(times.filter(time => time > from), currentEnd > from ? currentEnd : times.find(time => time > from));
  });
}

function updateBookingBags() {
  const totalCount = Object.values(state.bookingBags).reduce((sum, count) => sum + count, 0);
  BAG_TYPES.forEach(type => {
    $('#qty-' + type.key).textContent = state.bookingBags[type.key];
    $('[data-bag="' + type.key + '"][data-change="-1"]').disabled = state.bookingBags[type.key] === 0;
    $('[data-bag="' + type.key + '"][data-change="1"]').disabled = totalCount >= 10;
  });
  $('#booking-total').textContent = money(calculateTotal(state.selectedStore, state.bookingBags));
}

function getBookings() {
  const data = storage.get('linkeep-demo-bookings', []);
  return Array.isArray(data) ? data.filter(item => {
    if (!item || !STORES.some(store => store.id === item.storeId) || typeof item.id !== 'string' || !item.bags || !/^\d{4}-\d{2}-\d{2}$/.test(item.date)) return false;
    const store = STORES.find(store => store.id === item.storeId);
    return validateBooking(item, store, '2000-01-01').length === 0 && item.total === calculateTotal(store, item.bags);
  }).slice(0, 20) : [];
}

function ticketHTML(booking) {
  const bagLabel = BAG_TYPES.filter(type => booking.bags[type.key]).map(type => type.label + ' ' + booking.bags[type.key] + '개').join(', ');
  return '<div class="ticket-line"><span>날짜</span><b>' + escapeHtml(dateLabel(booking.date)) + '</b></div><div class="ticket-line"><span>맡기고 찾는 시간</span><b>' + escapeHtml(booking.start) + ' → ' + escapeHtml(booking.end) + '</b></div><div class="ticket-line"><span>짐</span><b>' + escapeHtml(bagLabel) + '</b></div><div class="ticket-line"><span>예시 요금</span><b>' + money(booking.total) + '</b></div>';
}

function submitBooking(event) {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const booking = { id: 'DEMO-' + (crypto.randomUUID ? crypto.randomUUID().slice(0, 8).toUpperCase() : Date.now().toString(36).toUpperCase()), storeId: state.selectedStore.id, date: $('#booking-date').value, start: $('#booking-start').value, end: $('#booking-end').value, bags: { ...state.bookingBags }, total: calculateTotal(state.selectedStore, state.bookingBags), createdAt: new Date().toISOString() };
  const errors = validateBooking(booking, state.selectedStore);
  if (errors.length) {
    $('#booking-errors').hidden = false;
    $('#booking-errors').textContent = errors.join(' ');
    return;
  }
  const saved = storage.set('linkeep-demo-bookings', [booking, ...getBookings()].slice(0, 20));
  if (!saved) {
    $('#booking-errors').hidden = false;
    $('#booking-errors').textContent = '이 브라우저에서는 데모 예약을 저장할 수 없어요. 브라우저의 사이트 데이터 저장 설정을 확인해 주세요.';
    return;
  }
  $('#store-dialog-content').innerHTML = '<div class="reservation-success"><span class="success-icon">' + icon('check') + '</span><div class="eyebrow">A LIGHTER DAY IS WAITING</div><h2 id="store-title">가벼운 하루를 준비했어요.</h2><p>데모 예약 내용을 이 브라우저에 저장했어요.<br>실제 예약이나 결제는 진행되지 않았어요.</p><div class="reservation-ticket"><strong>' + state.selectedStore.name + '</strong>' + ticketHTML(booking) + '<small>' + booking.id + ' / DEMO ONLY</small></div><div class="reservation-actions"><button class="button button-primary" id="success-my-bookings">내 데모 예약 보기' + icon('arrow') + '</button><button class="button button-outline" id="success-close">계속 둘러보기</button></div></div>';
  $('#store-dialog').scrollTop = 0;
  $('#success-my-bookings').addEventListener('click', () => { $('#store-dialog').close(); openBookings(); });
  $('#success-close').addEventListener('click', () => $('#store-dialog').close());
  $('#success-my-bookings').focus();
}

function renderBookings() {
  const bookings = getBookings();
  $('#bookings-list').innerHTML = bookings.length ? bookings.map(booking => {
    const store = STORES.find(item => item.id === booking.storeId);
    return '<article class="saved-booking"><div class="saved-booking-head"><strong>' + store.name + '</strong><span class="booking-badge">DEMO ONLY</span></div>' + ticketHTML(booking) + '<button class="delete-booking" data-delete="' + escapeHtml(booking.id) + '">데모 예약 삭제</button></article>';
  }).join('') : '<div class="bookings-empty">' + icon('bag') + '<h3>아직 맡겨둔 여행이 없어요.</h3><p>마음에 드는 공간을 골라<br>예약 흐름을 먼저 체험해 보세요.</p><button class="button button-primary" id="find-from-bookings">공간 둘러보기' + icon('arrow') + '</button></div>';
  $('#find-from-bookings')?.addEventListener('click', () => { $('#bookings-dialog').close(); $('#places').scrollIntoView({ behavior: 'smooth' }); });
}

function openBookings() {
  renderBookings();
  $('#bookings-dialog').showModal();
}

$('#search-form').addEventListener('submit', event => { event.preventDefault(); if (event.currentTarget.reportValidity()) runSearch(); });
$$('[data-search]').forEach(button => button.addEventListener('click', () => runSearch(button.dataset.search)));
$$('[data-area]').forEach(button => button.addEventListener('click', () => { state.area = button.dataset.area; state.query = ''; $('#location-search').value = ''; const url = new URL(location.href); url.searchParams.delete('q'); history.replaceState({}, '', url); renderStores(); }));
$('#sort-stores').addEventListener('change', event => { state.sort = event.target.value; renderStores(); });
$('#late-only').addEventListener('change', event => { state.lateOnly = event.target.checked; renderStores(); });
$('#reset-search').addEventListener('click', () => { state.lateOnly = false; $('#late-only').checked = false; runSearch(''); });
$('#cards-view').addEventListener('click', () => { state.view = 'cards'; renderStores(); });
$('#map-view').addEventListener('click', () => { state.view = 'map'; renderStores(); });
$('#bag-toggle').addEventListener('click', () => { const expanded = $('#bag-popover').hidden; $('#bag-popover').hidden = !expanded; $('#bag-toggle').setAttribute('aria-expanded', String(expanded)); });
$('#hero-bag-minus').addEventListener('click', () => updateHeroBags(-1));
$('#hero-bag-plus').addEventListener('click', () => updateHeroBags(1));
document.addEventListener('click', event => {
  if (!event.target.closest('.bag-field-wrap')) { $('#bag-popover').hidden = true; $('#bag-toggle').setAttribute('aria-expanded', 'false'); }
  const favourite = event.target.closest('[data-favourite]');
  if (favourite) {
    const id = favourite.dataset.favourite;
    const adding = !state.favourites.has(id);
    if (adding) state.favourites.add(id); else state.favourites.delete(id);
    const saved = storage.set('linkeep-demo-favourites', [...state.favourites]);
    favourite.setAttribute('aria-pressed', String(adding));
    const store = STORES.find(item => item.id === id);
    favourite.setAttribute('aria-label', store.name + (adding ? ' 저장 해제' : ' 저장'));
    toast(saved ? (adding ? '마음에 드는 공간으로 저장했어요.' : '저장한 공간에서 해제했어요.') : '현재 화면에만 반영했어요. 이 브라우저에서는 저장할 수 없어요.');
    return;
  }
  const target = event.target.closest('[data-store]');
  if (target) openStore(target.dataset.store);
});
$('#store-dialog-content').addEventListener('click', event => {
  const button = event.target.closest('[data-bag]');
  if (!button || button.disabled) return;
  const type = button.dataset.bag;
  const change = Number(button.dataset.change);
  const totalCount = Object.values(state.bookingBags).reduce((sum, count) => sum + count, 0);
  if (change > 0 && totalCount >= 10) return;
  state.bookingBags[type] = Math.max(0, state.bookingBags[type] + change);
  updateBookingBags();
});
$$('.booking-trigger').forEach(button => button.addEventListener('click', openBookings));
$('#bookings-list').addEventListener('click', event => {
  const button = event.target.closest('[data-delete]');
  if (!button) return;
  if (button.dataset.confirm !== 'true') { button.dataset.confirm = 'true'; button.textContent = '삭제 확인'; return; }
  if (storage.set('linkeep-demo-bookings', getBookings().filter(booking => booking.id !== button.dataset.delete))) { renderBookings(); toast('데모 예약을 삭제했어요.'); }
  else toast('브라우저 저장 설정으로 인해 삭제하지 못했어요.');
});
$$('.dialog-close').forEach(button => button.addEventListener('click', () => button.closest('dialog').close()));
$$('dialog').forEach(dialog => dialog.addEventListener('click', event => {
  const rect = dialog.getBoundingClientRect();
  if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
}));
$('#partner-open').addEventListener('click', () => { $('#partner-form').hidden = false; $('#partner-success').hidden = true; $('#partner-dialog').showModal(); });
$('#partner-form').addEventListener('submit', event => {
  event.preventDefault();
  if (!event.currentTarget.reportValidity()) return;
  event.currentTarget.reset();
  event.currentTarget.hidden = true;
  $('#partner-success').hidden = false;
  $('#partner-success .button').focus();
});
$('.mobile-menu-button').addEventListener('click', () => {
  const open = $('#mobile-nav').hidden;
  $('#mobile-nav').hidden = !open;
  $('.mobile-menu-button').setAttribute('aria-expanded', String(open));
  $('.mobile-menu-button').setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
  $('.mobile-menu-button use').setAttribute('href', open ? '#i-close' : '#i-menu');
});
function closeMobileMenu() { $('#mobile-nav').hidden = true; $('.mobile-menu-button').setAttribute('aria-expanded', 'false'); $('.mobile-menu-button').setAttribute('aria-label', '메뉴 열기'); $('.mobile-menu-button use').setAttribute('href', '#i-menu'); }
$$('#mobile-nav a').forEach(link => link.addEventListener('click', closeMobileMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') { $('#bag-popover').hidden = true; $('#bag-toggle').setAttribute('aria-expanded', 'false'); closeMobileMenu(); }
});
matchMedia('(min-width:681px)').addEventListener('change', event => { if (event.matches) closeMobileMenu(); });

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
$('#search-date').value = localDate(tomorrow);
$('#search-date').min = localDate();
$('#location-search').value = state.query;
updateHeroBags(0);
renderStores();
