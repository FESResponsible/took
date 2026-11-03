import { STORES, PRICING, NEAR_KM, filterStores, quote, validateBooking, localDate, toMinutes, setShowRealNames, resolveCopyMode, districtsFor, resolveArea } from './model.js';
import { initAnalytics, setCopyContext, track } from './analytics.js';

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
const state = {
  query: new URLSearchParams(location.search).get('q') || '',
  area: '전체',
  category: '전체',
  hours24: false,
  cold: false,
  sort: 'recommended',
  view: 'cards',
  bagCount: 1,
  bagNote: '',
  origin: null,
  nearOnly: false,
  focusedId: '',
  locating: false,
  favourites: new Set(Array.isArray(favouriteData) ? favouriteData.filter(id => STORES.some(store => store.id === id)) : []),
  selectedStore: null,
  bookingCount: 1,
  shoppingBags: 0,
  bookingTimes: []
};
let toastTimer;
let mapSrc = '';

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

function currentCriteria() {
  return { query: state.query, area: state.area, category: state.category, hours24: state.hours24, cold: state.cold, sort: state.sort, origin: state.origin, nearOnly: state.nearOnly };
}

function kakaoMapLink(name, lat, lng) {
  return 'https://map.kakao.com/link/map/' + encodeURIComponent(name) + ',' + lat + ',' + lng;
}

function googleMapLink(lat, lng) {
  return 'https://www.google.com/maps/search/?api=1&query=' + lat + ',' + lng;
}

function simpleMapEmbed(lat, lng) {
  const pad = 0.005;
  const bbox = [lng - pad, lat - pad, lng + pad, lat + pad].map(value => Number(value).toFixed(5)).join('%2C');
  return 'https://www.openstreetmap.org/export/embed.html?bbox=' + bbox + '&layer=mapnik&marker=' + lat + '%2C' + lng;
}

function halfHours(open, close) {
  const result = [];
  for (let minutes = toMinutes(open); minutes <= toMinutes(close); minutes += 30) result.push(String(Math.floor(minutes / 60)).padStart(2, '0') + ':' + String(minutes % 60).padStart(2, '0'));
  return result;
}

function timeOptions(times, selected) {
  return times.map(time => '<option value="' + time + '"' + (time === selected ? ' selected' : '') + '>' + time + '</option>').join('');
}

function nearestTime(times, desired) {
  if (!times.length) return desired;
  if (times.includes(desired)) return desired;
  const target = toMinutes(desired);
  return times.reduce((best, time) => Math.abs(toMinutes(time) - target) < Math.abs(toMinutes(best) - target) ? time : best);
}

function hoursText(store) {
  return store.hoursCard || (store.hours24 ? '24시간' : store.open + '–' + store.close);
}

function optionMarks(store) {
  const marks = [];
  if (store.hours24) marks.push('24시간');
  if (store.cold) marks.push('냉장/냉동');
  if (!marks.length) return '';
  return '<div class="store-options">' + marks.map(mark => '<span>' + mark + '</span>').join('') + '</div>';
}

function renderLocationStatus() {
  const element = $('#location-status');
  if (!state.origin) {
    element.hidden = true;
    element.innerHTML = '';
    $('#use-location').classList.remove('active');
    $('#use-location').setAttribute('aria-pressed', 'false');
    $('#use-location').textContent = state.locating ? '위치 확인 중' : '현재 위치';
    return;
  }
  element.hidden = false;
  $('#use-location').classList.add('active');
  $('#use-location').setAttribute('aria-pressed', 'true');
  $('#use-location').textContent = '현재 위치';
  element.innerHTML = '<span>' + (state.nearOnly ? '현재 위치에서 ' + NEAR_KM + 'km 안을 보여 주고 있어요.' : '현재 위치에서 가까운 순으로 전체 목록을 보여 주고 있어요.') + '</span><button type="button" id="toggle-near">' + (state.nearOnly ? '전체 목록 보기' : '주변만 보기') + '</button><button type="button" id="clear-location">위치 해제</button>';
}

function renderStores() {
  renderDistricts();
  const stores = filterStores(currentCriteria());
  if (state.view === 'map' && stores.length && !stores.some(store => store.id === state.focusedId)) state.focusedId = stores[0].id;
  const focused = stores.find(store => store.id === state.focusedId) || null;
  const lead = state.query ? '<strong>“' + escapeHtml(state.query) + '”</strong> ' : (state.area !== '전체' ? '<strong>' + escapeHtml(state.area) + '</strong> ' : (state.origin && state.nearOnly ? '현재 위치 주변 ' : '전체 '));
  $('#results-summary').innerHTML = lead + '보관 공간 <strong>' + stores.length + '</strong>곳';
  $('#store-grid').innerHTML = stores.map(store => {
    const saved = state.favourites.has(store.id);
    const distance = state.origin ? '<span class="store-distance">약 ' + store.distanceKm.toFixed(1) + 'km</span>' : '';
    const placeArea = store.district || store.area;
    return '<article class="store-card"><button class="store-image-button" data-store="' + store.id + '" aria-label="' + escapeHtml(store.name) + ' 상세 보기"><img src="' + store.image + '" alt="' + escapeHtml(store.type) + ' 분위기 예시 사진" loading="lazy" width="900" height="675" style="object-position:' + store.imagePosition + '"><span class="store-tag">' + escapeHtml(store.tag) + '</span></button><button class="save-button" data-favourite="' + store.id + '" aria-label="' + escapeHtml(store.name) + (saved ? ' 저장 해제' : ' 저장') + '" aria-pressed="' + saved + '">' + icon('heart') + '</button><div class="store-body"><div class="store-category"><span>' + escapeHtml(placeArea) + '</span><span>' + escapeHtml(store.type) + '</span></div><button class="store-title" data-store="' + store.id + '">' + escapeHtml(store.name) + '</button><div class="store-meta"><div class="store-access">' + icon('walk') + '<span>' + escapeHtml(store.placeLabel) + '</span></div><div class="store-hours">' + icon('clock') + '<span>' + hoursText(store) + '</span></div>' + optionMarks(store) + '</div><div class="store-price-row">' + (distance ? '<div class="store-price-stack">' + distance + '</div>' : '') + '<button class="store-open-link" data-store="' + store.id + '">예약하기' + icon('arrow') + '</button></div></div></article>';
  }).join('');
  $('#store-grid').hidden = state.view !== 'cards' || !stores.length;
  $('#place-map').hidden = state.view !== 'map' || !stores.length;
  $('#empty-state').hidden = stores.length > 0;
  $('#map-list').innerHTML = stores.map(store => '<article class="map-list-card' + (store.id === state.focusedId ? ' active' : '') + '"><button type="button" class="map-focus" data-focus="' + store.id + '"><img src="' + store.image + '" alt="" loading="lazy"><span><strong>' + escapeHtml(store.name) + '</strong><small><span>' + escapeHtml(store.placeLabel) + '</span><span>' + hoursText(store) + '</span></small></span></button><div class="map-card-actions"><button type="button" data-store="' + store.id + '">상세</button></div></article>').join('');
  if (state.view === 'map' && focused) {
    const src = simpleMapEmbed(focused.pinLat, focused.pinLng);
    const frame = $('#map-frame');
    if (mapSrc !== src) { mapSrc = src; frame.src = src; }
    const outsideMaps = focused.showMaps ? '<a href="' + kakaoMapLink(focused.realName, focused.lat, focused.lng) + '" target="_blank" rel="noopener noreferrer">카카오맵</a><a href="' + googleMapLink(focused.lat, focused.lng) + '" target="_blank" rel="noopener noreferrer">구글맵</a>' : '';
    $('#map-links').innerHTML = '<p>' + escapeHtml(focused.name) + '</p>' + outsideMaps;
  }
  paintAreaButtons();
  $$('[data-category]').forEach(button => { const active = button.dataset.category === state.category; button.classList.toggle('active', active); button.setAttribute('aria-pressed', String(active)); });
  $$('[data-option]').forEach(input => { input.checked = state[input.dataset.option] === true; });
  $('#cards-view').classList.toggle('active', state.view === 'cards');
  $('#cards-view').setAttribute('aria-pressed', String(state.view === 'cards'));
  $('#map-view').classList.toggle('active', state.view === 'map');
  $('#map-view').setAttribute('aria-pressed', String(state.view === 'map'));
  $('#sort-stores').value = state.sort;
  renderLocationStatus();
}

function clearTextQuery() {
  state.query = '';
  $('#location-search').value = '';
  const url = new URL(location.href);
  url.searchParams.delete('q');
  history.replaceState({}, '', url);
}

function runSearch(query = $('#location-search').value) {
  state.query = query.trim();
  state.area = '전체';
  state.origin = null;
  state.nearOnly = false;
  state.focusedId = '';
  if (state.sort === 'distance') state.sort = 'recommended';
  $('#location-search').value = state.query;
  const url = new URL(location.href);
  if (state.query) url.searchParams.set('q', state.query); else url.searchParams.delete('q');
  history.replaceState({}, '', url);
  closeBagPopover();
  renderStores();
  $('#places').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
}

function useCurrentLocation() {
  if (!navigator.geolocation) {
    toast('이 브라우저에서는 현재 위치를 사용할 수 없어요. 지역 이름으로 검색해 주세요.');
    if (state.sort === 'distance') state.sort = 'recommended';
    renderStores();
    return;
  }
  state.locating = true;
  renderLocationStatus();
  navigator.geolocation.getCurrentPosition(position => {
    state.locating = false;
    state.origin = { lat: position.coords.latitude, lng: position.coords.longitude };
    state.nearOnly = true;
    state.sort = 'distance';
    state.focusedId = '';
    clearTextQuery();
    renderStores();
    $('#places').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }, () => {
    state.locating = false;
    if (state.sort === 'distance' && !state.origin) state.sort = 'recommended';
    renderStores();
    toast('현재 위치를 가져오지 못했어요. 지역 이름으로 검색해 주세요.');
  }, { enableHighAccuracy: false, timeout: 8000, maximumAge: 60000 });
}

function closeBagPopover() {
  $('#bag-popover').hidden = true;
  $('#bag-toggle').setAttribute('aria-expanded', 'false');
}

function updateHeroBags(amount) {
  state.bagCount = Math.max(1, Math.min(10, state.bagCount + amount));
  state.bookingCount = state.bagCount;
  state.shoppingBags = Math.min(state.shoppingBags, state.bookingCount);
  $('#hero-bag-count').textContent = state.bagCount;
  $('#bag-label').textContent = '짐 ' + state.bagCount + '개';
  $('#hero-bag-minus').disabled = state.bagCount === 1;
  $('#hero-bag-plus').disabled = state.bagCount === 10;
}

function selectedPlan() {
  return $('#store-dialog-content input[name="plan"]:checked')?.value || 'day';
}

function clampShoppingBags() {
  state.shoppingBags = Math.max(0, Math.min(state.bookingCount, state.shoppingBags || 0));
}

function currentQuote() {
  const plan = selectedPlan();
  clampShoppingBags();
  return quote({
    plan,
    count: state.bookingCount,
    shoppingBagCount: state.shoppingBags,
    start: $('#booking-start')?.value,
    end: plan === 'hour' ? $('#booking-end')?.value : '',
    plus: Boolean($('#booking-plus-option')?.checked)
  });
}

function syncBookingPrice() {
  const plan = selectedPlan();
  const endRow = $('#end-row');
  if (endRow) endRow.hidden = plan !== 'hour';
  const start = $('#booking-start')?.value;
  const endSelect = $('#booking-end');
  if (plan === 'hour' && endSelect && start) {
    const times = state.bookingTimes.filter(time => time > start);
    const current = endSelect.value;
    endSelect.innerHTML = timeOptions(times, times.includes(current) ? current : times[0]);
  }
  const count = state.bookingCount;
  clampShoppingBags();
  const bagCountNode = $('#shopping-count');
  if (bagCountNode) bagCountNode.textContent = state.shoppingBags;
  const bagMinus = $('#shopping-minus');
  const bagPlus = $('#shopping-plus');
  if (bagMinus) bagMinus.disabled = state.shoppingBags === 0;
  if (bagPlus) bagPlus.disabled = state.shoppingBags >= count;
  let priced = null;
  try { priced = currentQuote(); } catch { priced = null; }
  const storageNode = $('#booking-storage');
  const plusNode = $('#booking-plus-fee');
  const total = $('#booking-total');
  const formulaNode = $('#booking-formula');
  const notes = $('#booking-adjust');
  if (priced) {
    if (storageNode) storageNode.textContent = money(priced.storage);
    if (plusNode) plusNode.textContent = money(priced.plusFee);
    if (total) total.textContent = money(priced.total);
    if (formulaNode) {
      if (priced.plan !== 'hour') formulaNode.textContent = money(PRICING.dayRate) + ' × ' + priced.units + '개';
      else if (priced.capped && priced.billedHours <= PRICING.dayHours) formulaNode.textContent = '하루 최대 ' + money(PRICING.dayRate) + ' × ' + priced.units + '개';
      else if (priced.capped) {
        const days = Math.floor(priced.billedHours / PRICING.dayHours);
        const rest = priced.billedHours % PRICING.dayHours;
        formulaNode.textContent = money(PRICING.dayRate) + ' × ' + days + '일' + (rest ? ' + ' + money(PRICING.hourRate) + ' × ' + rest + '시간' : '') + ' × ' + priced.units + '개';
      } else formulaNode.textContent = money(PRICING.hourRate) + ' × ' + priced.billedHours + '시간 × ' + priced.units + '개';
    }
    const messages = [];
    if (priced.shoppingBagCount > 0) messages.push('쇼핑백 ' + priced.shoppingBagCount + '개는 ' + priced.bagUnits + '개 요금으로 계산했어요');
    if (priced.minimumApplied) messages.push('시간권은 ' + PRICING.minHours + '시간부터예요');
    if (priced.capped) messages.push('하루 최대 요금이 적용됐어요');
    if (notes) {
      notes.hidden = messages.length === 0;
      notes.textContent = messages.join(' ');
    }
  } else if (formulaNode) {
    formulaNode.textContent = '시간을 다시 확인해 주세요.';
    if (notes) notes.hidden = true;
  }
  const countNode = $('#booking-count');
  if (countNode) countNode.textContent = count;
  const minus = $('#booking-minus');
  const plus = $('#booking-plus');
  if (minus) minus.disabled = count === 1;
  if (plus) plus.disabled = count === 10;
}

function openStore(id, source) {
  const store = STORES.find(item => item.id === id);
  if (!store) return;
  $('#store-dialog').classList.remove('survey-open');
  state.selectedStore = store;
  state.bookingCount = state.bagCount;
  state.shoppingBags = 0;
  state.bookingTimes = halfHours(store.open, store.close);
  const startChoices = state.bookingTimes.slice(0, -1);
  const desired = $('#search-start').value || '11:00';
  const start = nearestTime(startChoices, desired);
  const endDefault = state.bookingTimes.find(time => time >= '18:00' && time > start) || state.bookingTimes[state.bookingTimes.length - 1];
  const date = $('#search-date').value || localDate();
  const adjusted = start !== desired;
  if (source !== 'refresh') {
    const clue = source === 'reserve' ? 'reserve_click' : 'store_open';
    track(clue, { store_id: store.id, store_name: store.name, area: store.area });
  }
  const mapLinks = store.showMaps ? '<div class="detail-map-links"><a href="' + kakaoMapLink(store.realName, store.lat, store.lng) + '" target="_blank" rel="noopener noreferrer">카카오맵</a><a href="' + googleMapLink(store.lat, store.lng) + '" target="_blank" rel="noopener noreferrer">구글맵</a></div>' : '';
  const hoursDetail = (store.hoursLines || [hoursText(store)]).map(line => escapeHtml(line)).join('<br>');
  $('#store-dialog-content').innerHTML = '<div class="detail-layout"><div class="detail-intro"><img class="detail-hero" src="' + store.image + '" alt="' + escapeHtml(store.type) + ' 분위기 예시 사진" style="object-position:' + store.imagePosition + '"><p class="photo-note">사진은 비슷한 분위기를 보여주는 예시예요.</p><div class="detail-copy"><div class="eyebrow">YOUR LIGHT SPOT / ' + escapeHtml(store.district || store.area) + '</div><h2 id="store-title">' + escapeHtml(store.name) + '</h2><p class="detail-address">' + escapeHtml(store.addressLabel) + '</p><div class="detail-mini-map"><iframe title="' + escapeHtml(store.name) + ' 위치" src="' + simpleMapEmbed(store.pinLat, store.pinLng) + '" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>' + mapLinks + ' </div><div class="detail-facts"><span>' + icon('walk') + escapeHtml(store.placeLabel) + '</span><span>' + icon('clock') + hoursDetail + '</span>' + (store.cold ? '<span>' + icon('check') + '냉장/냉동 식품 보관</span>' : '') + '<span>' + icon('bag') + '종류와 상관없이 같은 요금</span><span>' + icon('map') + '고른 장소만 지도에 표시해요</span></div></div></div><form class="detail-booking" id="booking-form"><h3>잠시 맡길 준비를 해볼까요?</h3><p class="booking-subtitle">날짜와 시작 시간, 짐 종류를 정한 뒤 결제해 주세요.</p><label class="booking-label" for="booking-date">보관 날짜</label><input class="booking-date" type="date" id="booking-date" name="date" value="' + escapeHtml(date) + '" min="' + localDate() + '" required><label class="booking-label" for="booking-start">시작 시간</label><select id="booking-start" name="start" required>' + timeOptions(startChoices, start) + '</select>' + (adjusted ? '<p class="time-adjust">이 공간 운영시간에 맞춰 시작 시간을 바꿔 두었어요.</p>' : '') + '<div class="plan-switch" role="radiogroup" aria-label="요금제"><label class="plan-option"><input type="radio" name="plan" value="day" checked><span>하루권</span><small>개당 ' + money(PRICING.dayRate) + '</small></label><label class="plan-option"><input type="radio" name="plan" value="hour"><span>시간권</span><small>시간당 ' + money(PRICING.hourRate) + ' (' + PRICING.minHours + '시간부터, 하루 최대 ' + money(PRICING.dayRate) + ')</small></label></div><div class="time-row" id="end-row" hidden><label><span class="booking-label">찾는 시간</span><select id="booking-end" name="end">' + timeOptions(state.bookingTimes.filter(time => time > start), endDefault) + '</select></label></div><div class="booking-bags"><span class="booking-label">짐 개수</span><div class="booking-bag-row"><div><strong>맡길 짐 <span>종류와 같은 요금</span></strong><small>종류와 상관없이 같은 요금, 쇼핑백은 ' + PRICING.bagBundle + '개까지 1개</small></div><div class="stepper"><button type="button" id="booking-minus" aria-label="짐 수량 줄이기">−</button><output id="booking-count">' + state.bookingCount + '</output><button type="button" id="booking-plus" aria-label="짐 수량 늘리기">+</button></div></div></div><div class="booking-bags"><span class="booking-label">이 중 쇼핑백</span><div class="booking-bag-row"><div><strong>쇼핑백</strong><small>' + PRICING.bagBundle + '개까지 1개 요금</small></div><div class="stepper"><button type="button" id="shopping-minus" aria-label="쇼핑백 수량 줄이기">−</button><output id="shopping-count">0</output><button type="button" id="shopping-plus" aria-label="쇼핑백 수량 늘리기">+</button></div></div></div><label class="booking-label" for="booking-note">짐 종류</label><textarea id="booking-note" name="note" maxlength="120" required placeholder="예: 기내용 캐리어 하나와 종이 쇼핑백">' + escapeHtml(state.bagNote) + '</textarea><label class="booking-plus"><input type="checkbox" id="booking-plus-option" name="plus"><span><strong>안심 플러스</strong> (개당 +' + money(PRICING.plusRate) + '). 보상 한도를 30만 원에서 100만 원으로 올리고, 다른 짐과 분리된 선반에 보관해요.</span></label><div class="booking-lines"><div class="ticket-line"><span>보관료</span><b id="booking-storage"></b></div><div class="ticket-line"><span>안심 플러스</span><b id="booking-plus-fee"></b></div><div class="ticket-line booking-grand"><span>총 결제 금액<small id="booking-formula"></small></span><strong id="booking-total"></strong></div></div><p class="booking-adjust" id="booking-adjust" hidden></p><label class="booking-consent"><input type="checkbox" name="payConsent" required><span>선택한 일정과 요금으로 결제를 진행합니다.</span></label><div id="booking-errors" class="booking-errors" role="alert" hidden></div><button class="button button-primary booking-submit" type="submit">결제하기' + icon('arrow') + '</button></form></div>';
  syncBookingPrice();
  $('#store-dialog').showModal();
  $('#booking-date').focus();
}

function choiceSummary(booking) {
  const planLabel = booking.plan === 'hour' ? '시간권' : '하루권';
  const when = booking.plan === 'hour' ? escapeHtml(booking.start) + ' → ' + escapeHtml(booking.end) : escapeHtml(booking.start) + ' 시작';
  const bags = booking.shoppingBagCount ? '<div class="ticket-line"><span>쇼핑백</span><b>' + booking.shoppingBagCount + '개, ' + booking.units + '개 요금</b></div>' : '';
  const plus = '<div class="ticket-line"><span>안심 플러스</span><b>' + (booking.plus ? '포함' : '없음') + '</b></div>';
  return '<div class="ticket-line"><span>날짜</span><b>' + escapeHtml(dateLabel(booking.date)) + '</b></div><div class="ticket-line"><span>시간</span><b>' + when + '</b></div><div class="ticket-line"><span>요금제</span><b>' + planLabel + '</b></div><div class="ticket-line"><span>짐</span><b>' + booking.count + '개, ' + escapeHtml(booking.note.trim()) + '</b></div>' + bags + plus + '<div class="ticket-line"><span>총 결제 금액</span><b>' + money(booking.total) + '</b></div>';
}

function scaleChoices(name) {
  return '<div class="scale-row">' + [1, 2, 3, 4, 5].map(score => '<label class="scale-choice"><input type="radio" name="' + name + '" value="' + score + '" required><span>' + score + '</span></label>').join('') + '</div>';
}

function wordChoices(name, options) {
  return '<div class="pill-row">' + options.map(option => '<label class="pill-choice"><input type="radio" name="' + name + '" value="' + option.value + '" required><span>' + option.label + '</span></label>').join('') + '</div>';
}

function showMvp(booking) {
  const hesitations = [
    ['price', '가격'],
    ['unfamiliar', '처음 보는 매장이라 불안'],
    ['distance', '위치·거리'],
    ['hours', '운영시간'],
    ['loss', '분실·파손 걱정'],
    ['payment', '결제 방식'],
    ['none', '없었어요']
  ];
  $('#store-dialog').classList.add('survey-open');
  $('#store-dialog-content').innerHTML = '<div class="mvp-reveal"><div class="mvp-heart" aria-hidden="true">' + icon('heart') + '</div><p class="mvp-kicker">THANK YOU FOR TRYING TooK</p><h2 id="store-title">사실, TooK은 아직<br>정식 출시 전이에요.</h2><p class="mvp-lead">방금 고르신 예약은 이런 서비스가 정말 필요한지 확인하기 위한 테스트였어요.<br>실제 결제와 예약은 이루어지지 않았고, 어떤 비용도 청구되지 않아요.</p><p class="mvp-note">끝까지 골라 주신 경험이 저희에게 가장 정확한 답이에요. 1분만 더 들려주세요.</p><div class="mvp-tabs" role="tablist" aria-label="설문과 예약"><button type="button" id="mvp-tab-survey" role="tab" aria-selected="true" aria-controls="mvp-panel-survey" data-mvp-tab="survey">경험 설문</button><button type="button" id="mvp-tab-reservation" role="tab" aria-selected="false" aria-controls="mvp-panel-reservation" data-mvp-tab="reservation" tabindex="-1">내가 고른 예약</button></div><div id="mvp-panel-survey" role="tabpanel" aria-labelledby="mvp-tab-survey"><form id="survey-form"><div class="survey-question"><h3>1. 정식으로 출시되면 실제로 이용할 것 같나요?</h3>' + scaleChoices('intent') + '<div class="scale-caption"><span>전혀 아니에요</span><span>꼭 쓸 거예요</span></div></div><div class="survey-question"><h3>2. 방금 본 가격은 어땠나요?</h3>' + wordChoices('priceFeel', [{ value: 'cheap', label: '싸다' }, { value: 'fair', label: '적당하다' }, { value: 'bit-high', label: '조금 비싸다' }, { value: 'too-high', label: '너무 비싸다' }]) + '</div><div class="survey-question"><h3>3. 쇼핑백 1개를 2시간 맡긴다면 최대 얼마까지 낼 수 있나요?</h3><label class="won-field"><input id="survey-max-price" name="maxPrice" type="number" inputmode="numeric" min="0" max="1000000" step="100" required placeholder="예: 4000"><span>원</span></label></div><div class="survey-question"><h3>4. 안심 플러스(개당 ' + money(PRICING.plusRate) + ', 보상 100만 원)는 어땠나요?</h3>' + wordChoices('plusFeel', [{ value: 'no', label: '필요 없어요' }, { value: 'maybe', label: '비싸지 않으면 쓸 것 같아요' }, { value: 'yes', label: '꼭 필요해요' }]) + '</div><div class="survey-question"><h3>5. 예약 과정은 얼마나 쉬웠나요?</h3>' + scaleChoices('ease') + '<div class="scale-caption"><span>어려웠어요</span><span>아주 쉬웠어요</span></div></div><div class="survey-question"><h3>6. 결제 직전에 망설여진 점이 있었나요? <small>(여러 개 선택)</small></h3><div class="pill-row">' + hesitations.map(item => '<label class="pill-choice"><input type="checkbox" name="hesitation" value="' + item[0] + '"><span>' + item[1] + '</span></label>').join('') + '</div></div><div class="survey-question"><h3>7. 이런 점이 있으면 좋겠어요 <small>(선택)</small></h3><textarea name="wish" maxlength="400" placeholder="자유롭게 적어 주세요"></textarea></div><label class="survey-sms"><input type="checkbox" name="sms"><span>정식 출시 소식을 문자로 받을게요. 선택하지 않으면 입력하신 연락처는 7일 안에 삭제해요.</span></label><div id="survey-errors" class="booking-errors" role="alert" hidden></div><div class="mvp-actions"><button class="button button-primary" type="submit">의견 보내기' + icon('arrow') + '</button><button class="button button-outline" type="button" id="mvp-later">다음에 할게요</button></div></form><div id="survey-thanks" hidden><span class="success-icon">' + icon('check') + '</span><h3>의견을 이 브라우저에만 남겼어요.</h3><p>적은 내용은 서버로 보내지 않아요.</p></div></div><div id="mvp-panel-reservation" role="tabpanel" aria-labelledby="mvp-tab-reservation" hidden><div class="reservation-ticket"><strong>' + escapeHtml(state.selectedStore.name) + '</strong>' + choiceSummary(booking) + '</div><p class="mvp-note">이 금액은 체험 중 안내한 요금이에요. 결제는 청구되지 않았어요.</p></div></div>';
  $('#store-dialog').scrollTop = 0;
}

function showMvpTab(name) {
  $$('[data-mvp-tab]').forEach(button => {
    const selected = button.dataset.mvpTab === name;
    button.setAttribute('aria-selected', String(selected));
    button.tabIndex = selected ? 0 : -1;
  });
  const survey = $('#mvp-panel-survey');
  const reservation = $('#mvp-panel-reservation');
  if (survey) survey.hidden = name !== 'survey';
  if (reservation) reservation.hidden = name !== 'reservation';
}

function submitBooking(event) {
  event.preventDefault();
  const form = event.target;
  if (!form.reportValidity()) return;
  const plan = selectedPlan();
  const booking = {
    date: $('#booking-date').value,
    start: $('#booking-start').value,
    end: plan === 'hour' ? $('#booking-end').value : '',
    count: state.bookingCount,
    plan,
    note: $('#booking-note').value
  };
  const errors = validateBooking(booking, state.selectedStore);
  if (errors.length) {
    $('#booking-errors').hidden = false;
    $('#booking-errors').textContent = errors.join(' ');
    return;
  }
  const priced = currentQuote();
  booking.hours = priced.billedHours;
  booking.totalCount = priced.totalCount;
  booking.shoppingBagCount = priced.shoppingBagCount;
  booking.units = priced.units;
  booking.plus = priced.plus;
  booking.total = priced.total;
  track('booking_submit', { store_id: state.selectedStore.id, store_name: state.selectedStore.name, value: booking.total, plan: booking.plan, units: booking.units, plus: booking.plus });
  showMvp(booking);
}

function submitSurvey(event) {
  event.preventDefault();
  const form = event.target;
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const hesitations = data.getAll('hesitation').map(String);
  const errors = $('#survey-errors');
  if (!hesitations.length) {
    errors.hidden = false;
    errors.textContent = '결제 직전에 망설여진 점을 하나 이상 골라 주세요.';
    return;
  }
  errors.hidden = true;
  const entry = {
    intent: String(data.get('intent') || ''),
    priceFeel: String(data.get('priceFeel') || ''),
    maxPrice: Number(data.get('maxPrice')),
    plusFeel: String(data.get('plusFeel') || ''),
    ease: String(data.get('ease') || ''),
    hesitations,
    wish: String(data.get('wish') || '').trim().slice(0, 400),
    sms: data.get('sms') === 'on',
    createdAt: new Date().toISOString()
  };
  track('survey_submit', { intent: entry.intent, priceFeel: entry.priceFeel, plusFeel: entry.plusFeel, ease: entry.ease });
  const previous = storage.get('chaegim-experience-survey', []);
  const saved = storage.set('chaegim-experience-survey', [...(Array.isArray(previous) ? previous : []), entry].slice(-20));
  form.hidden = true;
  $('#survey-thanks').hidden = false;
  if (!saved) toast('의견을 이 브라우저에 남기지 못했어요.');
}

function getBookings() {
  const data = storage.get('linkeep-demo-bookings', []);
  return Array.isArray(data) ? data.filter(item => {
    if (!item || typeof item.note !== 'string' || !Number.isInteger(item.count) || !STORES.some(store => store.id === item.storeId)) return false;
    const store = STORES.find(store => store.id === item.storeId);
    return validateBooking(item, store, '2000-01-01').length === 0 && item.total === quote(item).total;
  }).slice(0, 20) : [];
}

function ticketHTML(booking) {
  const when = booking.plan === 'hour' ? escapeHtml(booking.start) + ' → ' + escapeHtml(booking.end) : escapeHtml(booking.start) + ' 시작';
  return '<div class="ticket-line"><span>날짜</span><b>' + escapeHtml(dateLabel(booking.date)) + '</b></div><div class="ticket-line"><span>시간</span><b>' + when + '</b></div><div class="ticket-line"><span>짐</span><b>' + booking.count + '개, ' + escapeHtml(booking.note) + '</b></div><div class="ticket-line"><span>안내 금액</span><b>' + money(booking.total) + '</b></div>';
}

function renderBookings() {
  const bookings = getBookings();
  $('#bookings-list').innerHTML = bookings.length ? bookings.map(booking => {
    const store = STORES.find(item => item.id === booking.storeId);
    return '<article class="saved-booking"><div class="saved-booking-head"><strong>' + escapeHtml(store.name) + '</strong><span class="booking-badge">SAVED</span></div>' + ticketHTML(booking) + '<button class="delete-booking" data-delete="' + escapeHtml(booking.id) + '">예약 취소</button></article>';
  }).join('') : '<div class="bookings-empty">' + icon('bag') + '<h3>아직 맡겨둔 여행이 없어요.</h3><p>마음에 드는 공간을 골라<br>결제를 진행해 보세요.</p><button class="button button-primary" id="find-from-bookings" type="button">공간 둘러보기' + icon('arrow') + '</button></div>';
  $('#find-from-bookings')?.addEventListener('click', () => { $('#bookings-dialog').close(); $('#places').scrollIntoView({ behavior: 'smooth' }); });
}

function openBookings() {
  renderBookings();
  $('#bookings-dialog').showModal();
}

$('#search-form').addEventListener('submit', event => {
  event.preventDefault();
  if (!event.currentTarget.reportValidity()) return;
  track('search', { query: $('#location-search').value.trim() });
  runSearch();
});
$$('[data-search]').forEach(button => button.addEventListener('click', () => {
  track('search', { query: button.dataset.search, source: 'popular' });
  runSearch(button.dataset.search);
}));
$$('[data-category]').forEach(button => button.addEventListener('click', () => {
  state.category = button.dataset.category;
  state.focusedId = '';
  renderStores();
}));
function buildCityButtons() {
  const group = document.querySelector('[aria-label="지역 필터"]');
  if (!group) return;
  const counts = new Map();
  STORES.forEach(store => counts.set(store.city, (counts.get(store.city) || 0) + 1));
  [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'ko'))
    .forEach(([city]) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.area = city;
      button.setAttribute('aria-pressed', 'false');
      button.textContent = city;
      group.append(button);
    });
}

function renderDistricts() {
  const group = document.querySelector('[aria-label="세부 지역"]');
  if (!group) return;
  const { city } = resolveArea(state.area);
  const names = city ? districtsFor(city) : [];
  group.hidden = names.length === 0;
  group.replaceChildren();
  if (!names.length) return;
  const all = document.createElement('button');
  all.type = 'button';
  all.dataset.area = city;
  all.textContent = city + ' 전체';
  group.append(all);
  names.forEach(name => {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.area = name;
    button.textContent = name;
    group.append(button);
  });
}

function paintAreaButtons() {
  const { city, district } = resolveArea(state.area);
  $$('[aria-label="지역 필터"] [data-area]').forEach(button => {
    const active = button.dataset.area === '전체' ? !city : button.dataset.area === city;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  $$('[aria-label="세부 지역"] [data-area]').forEach(button => {
    const active = district ? button.dataset.area === district : button.dataset.area === city;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
}

buildCityButtons();
document.querySelector('.area-stack').addEventListener('click', event => {
  const button = event.target.closest('button[data-area]');
  if (!button) return;
  state.area = button.dataset.area;
  state.focusedId = '';
  clearTextQuery();
  renderStores();
});
$('#sort-stores').addEventListener('change', event => {
  state.sort = event.target.value;
  if (state.sort === 'distance' && !state.origin) { useCurrentLocation(); return; }
  renderStores();
});
$$('[data-option]').forEach(input => input.addEventListener('change', () => {
  state[input.dataset.option] = input.checked;
  state.focusedId = '';
  renderStores();
}));
$('#reset-search').addEventListener('click', () => { state.hours24 = false; state.cold = false; state.area = '전체'; state.category = '전체'; state.origin = null; state.nearOnly = false; state.sort = 'recommended'; $$('[data-option]').forEach(input => { input.checked = false; }); runSearch(''); });
$('#cards-view').addEventListener('click', () => { state.view = 'cards'; renderStores(); });
$('#map-view').addEventListener('click', () => { state.view = 'map'; renderStores(); });
$('#use-location').addEventListener('click', useCurrentLocation);
$('#location-status').addEventListener('click', event => {
  if (event.target.id === 'toggle-near') { state.nearOnly = !state.nearOnly; state.focusedId = ''; renderStores(); }
  if (event.target.id === 'clear-location') { state.origin = null; state.nearOnly = false; if (state.sort === 'distance') state.sort = 'recommended'; state.focusedId = ''; renderStores(); }
});
$('#bag-toggle').addEventListener('click', () => {
  if ($('#bag-popover').hidden) {
    $('#bag-popover').hidden = false;
    $('#bag-toggle').setAttribute('aria-expanded', 'true');
    const rect = $('#bag-confirm').getBoundingClientRect();
    const overflow = rect.bottom - (window.innerHeight - 24);
    if (overflow > 0) window.scrollBy(0, overflow);
  } else closeBagPopover();
});
$('#hero-bag-minus').addEventListener('click', () => updateHeroBags(-1));
$('#hero-bag-plus').addEventListener('click', () => updateHeroBags(1));
$('#bag-note').addEventListener('input', event => { state.bagNote = event.target.value; });
$('#bag-confirm').addEventListener('click', () => { state.bagNote = $('#bag-note').value; closeBagPopover(); $('#bag-toggle').focus(); });
document.addEventListener('click', event => {
  if (!event.target.closest('.bag-field-wrap')) closeBagPopover();
  const favourite = event.target.closest('[data-favourite]');
  if (favourite) {
    const id = favourite.dataset.favourite;
    const adding = !state.favourites.has(id);
    if (adding) state.favourites.add(id); else state.favourites.delete(id);
    const saved = storage.set('linkeep-demo-favourites', [...state.favourites]);
    favourite.setAttribute('aria-pressed', String(adding));
    const store = STORES.find(item => item.id === id);
    favourite.setAttribute('aria-label', store.name + (adding ? ' 저장 해제' : ' 저장'));
    toast(saved ? (adding ? '마음에 드는 공간으로 저장했어요.' : '저장한 공간에서 해제했어요.') : '저장하지 못했어요. 잠시 후 다시 시도해 주세요.');
    return;
  }
  const focus = event.target.closest('[data-focus]');
  if (focus) { state.focusedId = focus.dataset.focus; state.view = 'map'; renderStores(); return; }
  const target = event.target.closest('[data-store]');
  if (target) openStore(target.dataset.store, target.classList.contains('store-open-link') ? 'reserve' : 'detail');
});
$('#store-dialog-content').addEventListener('click', event => {
  if (event.target.closest('#booking-minus')) { state.bookingCount = Math.max(1, state.bookingCount - 1); state.shoppingBags = Math.min(state.shoppingBags, state.bookingCount); state.bagCount = state.bookingCount; updateHeroBags(0); syncBookingPrice(); }
  if (event.target.closest('#booking-plus')) { state.bookingCount = Math.min(10, state.bookingCount + 1); state.bagCount = state.bookingCount; updateHeroBags(0); syncBookingPrice(); }
  if (event.target.closest('#shopping-minus')) { state.shoppingBags = Math.max(0, state.shoppingBags - 1); syncBookingPrice(); }
  if (event.target.closest('#shopping-plus')) { state.shoppingBags = Math.min(state.bookingCount, state.shoppingBags + 1); syncBookingPrice(); }
  const tab = event.target.closest('[data-mvp-tab]');
  if (tab) showMvpTab(tab.dataset.mvpTab);
  if (event.target.closest('#mvp-later')) $('#store-dialog').close();
});
$('#store-dialog-content').addEventListener('change', event => {
  if (event.target.name === 'plan' || event.target.id === 'booking-start' || event.target.id === 'booking-end' || event.target.id === 'booking-plus-option') syncBookingPrice();
  if (event.target.name === 'hesitation') {
    const boxes = $$('input[name="hesitation"]', $('#survey-form'));
    if (event.target.value === 'none' && event.target.checked) boxes.forEach(box => { if (box !== event.target) box.checked = false; });
    if (event.target.value !== 'none' && event.target.checked) boxes.forEach(box => { if (box.value === 'none') box.checked = false; });
  }
});
$('#store-dialog-content').addEventListener('input', event => {
  if (event.target.id === 'booking-note') state.bagNote = event.target.value;
});
$('#store-dialog-content').addEventListener('submit', event => {
  if (event.target.id === 'booking-form') submitBooking(event);
  if (event.target.id === 'survey-form') submitSurvey(event);
});
$$('.booking-trigger').forEach(button => button.addEventListener('click', openBookings));
$('#bookings-list').addEventListener('click', event => {
  const button = event.target.closest('[data-delete]');
  if (!button) return;
  if (button.dataset.confirm !== 'true') { button.dataset.confirm = 'true'; button.textContent = '삭제 확인'; return; }
  if (storage.set('linkeep-demo-bookings', getBookings().filter(booking => booking.id !== button.dataset.delete))) { renderBookings(); toast('예약을 취소했어요.'); }
  else toast('예약을 취소하지 못했어요. 잠시 후 다시 시도해 주세요.');
});
$$('.dialog-close').forEach(button => button.addEventListener('click', () => button.closest('dialog').close()));
$$('dialog').forEach(dialog => dialog.addEventListener('click', event => {
  const rect = dialog.getBoundingClientRect();
  if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
}));
$('#partner-open').addEventListener('click', () => {
  track('partner_cta_click', { source: 'partner_section' });
  $('#partner-form').hidden = false;
  $('#partner-success').hidden = true;
  $('#partner-dialog').showModal();
});
$('#partner-form').addEventListener('submit', event => {
  event.preventDefault();
  if (!event.currentTarget.reportValidity()) return;
  const data = new FormData(event.currentTarget);
  track('partner_submit', { store_name: String(data.get('store') || ''), area: String(data.get('area') || '') });
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
  if (event.key === 'Escape') { closeBagPopover(); closeMobileMenu(); }
  if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
  const current = event.target.closest('[data-mvp-tab]');
  if (!current) return;
  const tabs = $$('[data-mvp-tab]');
  const index = tabs.indexOf(current);
  const next = tabs[(index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length];
  showMvpTab(next.dataset.mvpTab);
  next.focus();
});
matchMedia('(min-width:681px)').addEventListener('change', event => { if (event.matches) closeMobileMenu(); });

function markCurrentSection() {
  const line = 128;
  const ids = ['story', 'places', 'how', 'faq'];
  let current = '';
  ids.forEach(id => {
    const section = document.getElementById(id);
    if (!section) return;
    const box = section.getBoundingClientRect();
    if (box.top <= line && box.bottom > line) current = id;
  });
  $$('.desktop-nav a[href^="#"], #mobile-nav a[href^="#"]').forEach(link => {
    const active = link.getAttribute('href') === '#' + current;
    if (active) link.setAttribute('aria-current', 'true');
    else link.removeAttribute('aria-current');
  });
}
let sectionTick = false;
document.addEventListener('scroll', () => {
  if (sectionTick) return;
  sectionTick = true;
  requestAnimationFrame(() => { markCurrentSection(); sectionTick = false; });
}, { passive: true });
markCurrentSection();

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
$('#search-date').value = localDate(tomorrow);
$('#search-date').min = localDate();
$('#location-search').value = state.query;
if (state.query) state.area = '전체';
const HIDE_NAMES_KEY = 'chaegim-dev-hide-names-v2';
const COPY_MODE_KEY = 'chaegim-dev-copy-mode';
const COPY = {
  tourism: {
    title: 'TooK — 짐은 툭, 여행은 쭉',
    meta: '숙소에 짐을 두기 어려운 시간, 가까운 공간에 맡기고 남은 여행을 가볍게 이어가세요. TooK.',
    html: {
      'hero-title': '짐은 툭,<br>여행은 <span class="underlined">쭉</span>',
      'hero-description': '숙소에 짐을 두기 어려운 시간,<br>가까운 공간에 맡기고 남은 여행을 가볍게 이어가세요.',
      'how-side': '짐을 맡기는 순간부터 다시 찾을 때까지.<br>여행을 방해하지 않는 간단한 과정.',
      'care-caption': '걱정은 줄이고,<br>여행의 순간은 더하고.'
    },
    text: {
      'hero-cta': '여행지 근처 보관 장소 찾기',
      'story-heading': '숙소에 짐을 두기 어려울 때',
      'story-lead': '도보나 대중교통으로 움직이는 여행에서, 숙소 보관이 어렵거나 되돌아가는 길이 부담일 때 써요.',
      'bubble-1-title': '체크인 전, 캐리어 없이 첫 일정을 시작하고 싶을 때',
      'bubble-1-body': '숙소 문을 열기 전에 근처를 먼저 둘러봐요.',
      'bubble-2-title': '체크아웃 후, 기차나 비행기 시간까지 일정이 남았을 때',
      'bubble-2-body': '이동 전까지 남은 일정은 빈손으로 이어가요.',
      'bubble-3-title': '당일 여행이거나 숙소가 멀어 짐을 두기 어려울 때',
      'bubble-3-body': '숙소가 멀면 가까운 공간에 잠시 맡겨요.',
      'persona-1-role': '동선',
      'persona-1-title': '숙소까지 다시 가기엔 시간이 아까워요',
      'persona-1-li-1': '도보나 대중교통으로 움직이다 숙소까지 돌아가기 어려워요',
      'persona-1-li-2': '몇 시간만 맡기고 같은 동네에서 찾고 싶어요',
      'persona-1-li-3': '짐 개수대로 요금이 보이면 좋겠어요',
      'persona-2-role': '빈손',
      'persona-2-title': '캐리어와 쇼핑백을 같이 들고 다닐 때',
      'persona-2-li-1': '종류가 달라도 같은 요금, 쇼핑백은 묶어서 맡기고 싶어요',
      'persona-2-li-3': '다시 찾을 시간과 장소를 미리 정하고 싶어요',
      'needs-how': '여행지 근처 공간을 고르고 지도에서 위치를 확인해요',
      'how-near': '여행 동선 가까이에',
      'partner-line': '남는 공간으로 여행객을 맞이하는 새로운 방법.',
      'closing-tail': '여행은 쭉',
      'footer-slogan': '짐은 툭, 여행은 쭉.',
      'footer-line': '가까운 공간에 맡기고 남은 여행을 가볍게 이어가세요.'
    }
  },
  daily: {
    title: 'TooK — 짐은 툭, 오늘은 가볍게',
    meta: '쇼핑하다 늘어난 쇼핑백도, 다음 약속까지 들고 다니기 부담스러운 가방도. 가까운 공간에 잠시 맡기고 오늘을 가볍게 즐기세요. TooK.',
    html: {
      'hero-title': '짐은 툭,<br>오늘은 <span class="underlined">가볍게</span>',
      'hero-description': '쇼핑하다 늘어난 쇼핑백도, 다음 약속까지 들고 다니기 부담스러운 가방도.<br>가까운 공간에 잠시 맡기고 오늘을 가볍게 즐기세요.',
      'how-side': '짐을 맡기는 순간부터 다시 찾을 때까지.<br>오늘 일정을 방해하지 않는 간단한 과정.',
      'care-caption': '걱정은 줄이고,<br>오늘의 일정은 가볍게.'
    },
    text: {
      'hero-cta': '가까운 보관 장소 찾기',
      'story-heading': '짐이 오늘을 무겁게 만들 때',
      'story-lead': '쇼핑 가방도, 약속 전까지 두기 힘든 짐도 가까운 공간에 맡겨요.',
      'bubble-1-title': '쇼핑백이 늘어난 날',
      'bubble-1-body': '손에 쌓인 가방을 가까운 곳에 잠시 맡겨요.',
      'bubble-2-title': '퇴근 후 약속 전',
      'bubble-2-body': '약속 장소까지 가방을 들고 가지 않아도 돼요.',
      'bubble-3-title': '짐 때문에 다음 활동이 불편한 날',
      'bubble-3-body': '잠깐 맡기고 다음 일정을 빈손으로 이어가요.',
      'persona-1-role': '쇼핑',
      'persona-1-title': '쇼핑백이 손에 쌓인 날',
      'persona-1-li-1': '가게를 옮겨 다닐 때 가방이 자꾸 늘어요',
      'persona-1-li-2': '몇 시간만 맡기고 같은 동네에서 찾고 싶어요',
      'persona-1-li-3': '짐 개수대로 요금이 보이면 좋겠어요',
      'persona-2-role': '약속 전',
      'persona-2-title': '퇴근 후, 다음 약속까지 가방이 부담일 때',
      'persona-2-li-1': '약속 장소까지는 빈손으로 가고 싶어요',
      'persona-2-li-3': '다시 찾을 시간과 장소를 미리 정하고 싶어요',
      'needs-how': '가까운 공간을 고르고 지도에서 위치를 확인해요',
      'how-near': '지금 있는 곳 가까이에',
      'partner-line': '남는 공간으로 오늘을 가볍게 보내는 사람을 맞이해요.',
      'closing-tail': '오늘은 가볍게',
      'footer-slogan': '짐은 툭, 오늘은 가볍게.',
      'footer-line': '가까운 공간에 잠시 맡기고 오늘을 가볍게 즐기세요.'
    }
  }
};
function hideRealNames() {
  return storage.get(HIDE_NAMES_KEY, false) === true;
}
function resolvedCopyMode() {
  const params = new URLSearchParams(location.search);
  const paramPresent = params.has('copy');
  const queryValue = paramPresent ? params.get('copy') : null;
  const storedValue = storage.get(COPY_MODE_KEY, null);
  const mode = resolveCopyMode(queryValue, storedValue, { paramPresent });
  if (paramPresent && (queryValue === 'tourism' || queryValue === 'daily')) storage.set(COPY_MODE_KEY, queryValue);
  return mode;
}
function applyCopy(mode) {
  const key = mode === 'daily' ? 'daily' : 'tourism';
  const pack = COPY[key];
  document.documentElement.dataset.copy = key;
  document.title = pack.title;
  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.setAttribute('content', pack.meta);
  Object.entries(pack.html).forEach(([name, value]) => {
    const node = document.querySelector('[data-copy="' + name + '"]');
    if (node) node.innerHTML = value;
  });
  Object.entries(pack.text).forEach(([name, value]) => {
    const node = document.querySelector('[data-copy="' + name + '"]');
    if (node) node.textContent = value;
  });
  setCopyContext(key);
  $$('input[name="copy-mode"]').forEach(input => { input.checked = input.value === key; });
}
applyCopy(resolvedCopyMode());
setShowRealNames(!hideRealNames());
updateHeroBags(0);
renderStores();
$('#open-dev').addEventListener('click', () => {
  $('#hide-real-names').checked = hideRealNames();
  const mode = document.documentElement.dataset.copy === 'daily' ? 'daily' : 'tourism';
  $$('input[name="copy-mode"]').forEach(input => { input.checked = input.value === mode; });
  $('#dev-dialog').showModal();
});
$$('input[name="copy-mode"]').forEach(input => {
  input.addEventListener('change', () => {
    if (!input.checked) return;
    const mode = input.value === 'daily' ? 'daily' : 'tourism';
    storage.set(COPY_MODE_KEY, mode);
    applyCopy(mode);
  });
});
$('#hide-real-names').addEventListener('change', event => {
  const hide = event.target.checked;
  storage.set(HIDE_NAMES_KEY, hide);
  setShowRealNames(!hide);
  const dialog = $('#store-dialog');
  const openId = dialog.open && state.selectedStore ? state.selectedStore.id : '';
  renderStores();
  if (openId) openStore(openId, 'refresh');
});

function applyOptionVisibility() {
  const has24 = STORES.some(store => store.hours24);
  const hasCold = STORES.some(store => store.cold);
  $$('[data-requires="hours24"]').forEach(element => { element.hidden = !has24; });
  $$('[data-requires="cold"]').forEach(element => { element.hidden = !hasCold; });
}
applyOptionVisibility();
initAnalytics();
