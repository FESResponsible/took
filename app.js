import { STORES, PRICING, NEAR_KM, filterStores, quote, validateBooking, localDate, toMinutes, setShowRealNames, resolveCopyMode, districtsFor, resolveArea } from './model.js?v=2fa1423b91f3';
import { initAnalytics, setCopyContext, track } from './analytics.js?v=21002a001178';
import { t, copyPack, loadLocale, saveLocale, getLocale, localeLang, labelPlace, displayName, formatAddress, formatMoney, formatDate, formatHours, formatAccess, formatNumber, unitPhrase, bagCountLabel, translateError } from './i18n.js?v=27efcc2ef48c';

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));
const escapeHtml = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
const icon = (name, className = '') => '<svg class="' + className + '" aria-hidden="true"><use href="#i-' + name + '"/></svg>';
const money = amount => formatMoney(amount);
const storage = {
  get(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } },
  set(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch { return false; } }
};
loadLocale(storage);
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
  return formatDate(date);
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
  return formatHours(store.hoursCard || (store.hours24 ? '24시간' : store.open + '–' + store.close));
}

function optionMarks(store) {
  const marks = [];
  if (store.hours24) marks.push(t('mark.hours24'));
  if (store.cold) marks.push(t('mark.cold'));
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
    $('#use-location').textContent = state.locating ? t('location.finding') : t('search.here');
    return;
  }
  element.hidden = false;
  $('#use-location').classList.add('active');
  $('#use-location').setAttribute('aria-pressed', 'true');
  $('#use-location').textContent = t('search.here');
  element.innerHTML = '<span>' + (state.nearOnly ? t('location.near', { km: NEAR_KM }) : t('location.all')) + '</span><button type="button" id="toggle-near">' + (state.nearOnly ? t('location.showAll') : t('location.onlyNear')) + '</button><button type="button" id="clear-location">' + t('location.clear') + '</button>';
}

function renderStores() {
  renderDistricts();
  const stores = filterStores(currentCriteria());
  if (state.view === 'map' && stores.length && !stores.some(store => store.id === state.focusedId)) state.focusedId = stores[0].id;
  const focused = stores.find(store => store.id === state.focusedId) || null;
  const countHtml = '<strong>' + escapeHtml(formatNumber(stores.length)) + '</strong>';
  const lead = state.query
    ? t('results.query', { query: '<strong>“' + escapeHtml(state.query) + '”</strong>', count: countHtml })
    : (state.area !== '전체'
      ? t('results.area', { area: '<strong>' + escapeHtml(labelPlace(state.area)) + '</strong>', count: countHtml })
      : (state.origin && state.nearOnly ? t('results.near', { count: countHtml }) : t('results.all', { count: countHtml })));
  $('#results-summary').innerHTML = lead;
  $('#store-grid').innerHTML = stores.map(store => {
    const saved = state.favourites.has(store.id);
    const name = displayName(store);
    const distance = state.origin ? '<span class="store-distance">' + escapeHtml(t('card.distance', { km: store.distanceKm.toFixed(1) })) + '</span>' : '';
    const placeArea = labelPlace(store.district || store.area);
    return '<article class="store-card"><button class="store-image-button" data-store="' + store.id + '" aria-label="' + escapeHtml(t('card.open', { name })) + '"><img src="' + store.image + '" alt="' + escapeHtml(t('card.photoAlt', { type: labelPlace(store.type) })) + '" loading="lazy" width="900" height="675" style="object-position:' + store.imagePosition + '"><span class="store-tag">' + escapeHtml(labelPlace(store.tag)) + '</span></button><button class="save-button" data-favourite="' + store.id + '" aria-label="' + escapeHtml(saved ? t('card.unsave', { name }) : t('card.save', { name })) + '" aria-pressed="' + saved + '">' + icon('heart') + '</button><div class="store-body"><div class="store-category"><span>' + escapeHtml(placeArea) + '</span><span>' + escapeHtml(labelPlace(store.type)) + '</span></div><button class="store-title" data-store="' + store.id + '">' + escapeHtml(name) + '</button><div class="store-meta"><div class="store-access">' + icon('walk') + '<span>' + escapeHtml(formatAccess(store.placeLabel)) + '</span></div><div class="store-hours">' + icon('clock') + '<span>' + escapeHtml(hoursText(store)) + '</span></div>' + optionMarks(store) + '</div><div class="store-price-row">' + (distance ? '<div class="store-price-stack">' + distance + '</div>' : '') + '<button class="store-open-link" data-store="' + store.id + '">' + escapeHtml(t('card.reserve')) + icon('arrow') + '</button></div></div></article>';
  }).join('');
  $('#store-grid').hidden = state.view !== 'cards' || !stores.length;
  $('#place-map').hidden = state.view !== 'map' || !stores.length;
  $('#empty-state').hidden = stores.length > 0;
  $('#map-list').innerHTML = stores.map(store => '<article class="map-list-card' + (store.id === state.focusedId ? ' active' : '') + '"><button type="button" class="map-focus" data-focus="' + store.id + '"><img src="' + store.image + '" alt="" loading="lazy"><span><strong>' + escapeHtml(displayName(store)) + '</strong><small><span>' + escapeHtml(formatAccess(store.placeLabel)) + '</span><span>' + escapeHtml(hoursText(store)) + '</span></small></span></button><div class="map-card-actions"><button type="button" data-store="' + store.id + '">' + escapeHtml(t('card.detail')) + '</button></div></article>').join('');
  if (state.view === 'map' && focused) {
    const src = simpleMapEmbed(focused.pinLat, focused.pinLng);
    const frame = $('#map-frame');
    if (mapSrc !== src) { mapSrc = src; frame.src = src; }
    const outsideMaps = focused.showMaps ? '<a href="' + kakaoMapLink(focused.realName, focused.lat, focused.lng) + '" target="_blank" rel="noopener noreferrer">' + escapeHtml(t('map.kakao')) + '</a><a href="' + googleMapLink(focused.lat, focused.lng) + '" target="_blank" rel="noopener noreferrer">' + escapeHtml(t('map.google')) + '</a>' : '';
    $('#map-links').innerHTML = '<p>' + escapeHtml(displayName(focused)) + '</p>' + outsideMaps;
  }
  paintAreaButtons();
  $$('[data-category]').forEach(button => {
    const active = button.dataset.category === state.category;
    button.textContent = button.dataset.category === '전체' ? t('filter.all') : labelPlace(button.dataset.category);
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  $$('[data-search]').forEach(button => { button.textContent = labelPlace(button.dataset.search); });
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
    toast(t('toast.noGeo'));
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
    toast(t('toast.geoFail'));
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
  $('#bag-label').textContent = bagCountLabel(state.bagCount);
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
      const units = unitPhrase(priced.units, 'item');
      if (priced.plan !== 'hour') formulaNode.textContent = t('formula.day', { money: money(PRICING.dayRate), units });
      else if (priced.capped && priced.billedHours <= PRICING.dayHours) formulaNode.textContent = t('formula.cap', { money: money(PRICING.dayRate), units });
      else if (priced.capped) {
        const days = Math.floor(priced.billedHours / PRICING.dayHours);
        const rest = priced.billedHours % PRICING.dayHours;
        formulaNode.textContent = rest
          ? t('formula.mix', { dayMoney: money(PRICING.dayRate), days: unitPhrase(days, 'day'), hourMoney: money(PRICING.hourRate), hours: unitPhrase(rest, 'hour'), units })
          : t('formula.mixNoRest', { dayMoney: money(PRICING.dayRate), days: unitPhrase(days, 'day'), units });
      } else formulaNode.textContent = t('formula.hour', { money: money(PRICING.hourRate), hours: unitPhrase(priced.billedHours, 'hour'), units });
    }
    const messages = [];
    if (priced.shoppingBagCount > 0) messages.push(t('note.bags', { bags: formatNumber(priced.shoppingBagCount), units: formatNumber(priced.bagUnits) }));
    if (priced.minimumApplied) messages.push(t('note.minimum', { hours: formatNumber(PRICING.minHours) }));
    if (priced.capped) messages.push(t('note.cap'));
    if (notes) {
      notes.hidden = messages.length === 0;
      notes.textContent = messages.join(' ');
    }
  } else if (formulaNode) {
    formulaNode.textContent = t('formula.check');
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
  state.mvpBooking = null;
  state.selectedStore = store;
  if (source !== 'refresh') {
    state.bookingCount = state.bagCount;
    state.shoppingBags = 0;
  }
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
  const name = displayName(store);
  const mapLinks = store.showMaps ? '<div class="detail-map-links"><a href="' + kakaoMapLink(store.realName, store.lat, store.lng) + '" target="_blank" rel="noopener noreferrer">' + escapeHtml(t('map.kakao')) + '</a><a href="' + googleMapLink(store.lat, store.lng) + '" target="_blank" rel="noopener noreferrer">' + escapeHtml(t('map.google')) + '</a></div>' : '';
  const hoursDetail = (store.hoursLines || [store.hoursCard || '']).map(line => escapeHtml(formatHours(line))).join('<br>');
  $('#store-dialog-content').innerHTML = '<div class="detail-layout"><div class="detail-intro"><img class="detail-hero" src="' + store.image + '" alt="' + escapeHtml(t('card.photoAlt', { type: labelPlace(store.type) })) + '" style="object-position:' + store.imagePosition + '"><p class="photo-note">' + escapeHtml(t('detail.photoNote')) + '</p><div class="detail-copy"><div class="eyebrow">YOUR LIGHT SPOT / ' + escapeHtml(labelPlace(store.district || store.area)) + '</div><h2 id="store-title">' + escapeHtml(name) + '</h2><p class="detail-address">' + escapeHtml(formatAddress(store.addressLabel)) + '</p><div class="detail-mini-map"><iframe title="' + escapeHtml(t('detail.mapTitle', { name })) + '" src="' + simpleMapEmbed(store.pinLat, store.pinLng) + '" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>' + mapLinks + ' </div><div class="detail-facts"><span>' + icon('walk') + escapeHtml(formatAccess(store.placeLabel)) + '</span><span>' + icon('clock') + hoursDetail + '</span>' + (store.cold ? '<span>' + icon('check') + escapeHtml(t('detail.cold')) + '</span>' : '') + '<span>' + icon('bag') + escapeHtml(t('detail.sameRate')) + '</span><span>' + icon('map') + escapeHtml(t('detail.mapNote')) + '</span></div></div></div><form class="detail-booking" id="booking-form"><h3>' + escapeHtml(t('booking.title')) + '</h3><p class="booking-subtitle">' + escapeHtml(t('booking.subtitle')) + '</p><label class="booking-label" for="booking-date">' + escapeHtml(t('booking.date')) + '</label><input class="booking-date" type="date" id="booking-date" name="date" value="' + escapeHtml(date) + '" min="' + localDate() + '" required><label class="booking-label" for="booking-start">' + escapeHtml(t('booking.start')) + '</label><select id="booking-start" name="start" required>' + timeOptions(startChoices, start) + '</select>' + (adjusted ? '<p class="time-adjust">' + escapeHtml(t('booking.adjusted')) + '</p>' : '') + '<div class="plan-switch" role="radiogroup" aria-label="' + escapeHtml(t('booking.plan')) + '"><label class="plan-option"><input type="radio" name="plan" value="day" checked><span>' + escapeHtml(t('booking.day')) + '</span><small>' + escapeHtml(t('booking.dayPrice', { money: money(PRICING.dayRate) })) + '</small></label><label class="plan-option"><input type="radio" name="plan" value="hour"><span>' + escapeHtml(t('booking.hour')) + '</span><small>' + escapeHtml(t('booking.hourPrice', { money: money(PRICING.hourRate), min: formatNumber(PRICING.minHours), cap: money(PRICING.dayRate) })) + '</small></label></div><div class="time-row" id="end-row" hidden><label><span class="booking-label">' + escapeHtml(t('booking.end')) + '</span><select id="booking-end" name="end">' + timeOptions(state.bookingTimes.filter(time => time > start), endDefault) + '</select></label></div><div class="booking-bags"><span class="booking-label">' + escapeHtml(t('booking.count')) + '</span><div class="booking-bag-row"><div><strong>' + escapeHtml(t('search.popoverTitle')) + ' <span>' + escapeHtml(t('booking.same')) + '</span></strong><small>' + escapeHtml(t('booking.bagHint', { count: formatNumber(PRICING.bagBundle) })) + '</small></div><div class="stepper"><button type="button" id="booking-minus" aria-label="' + escapeHtml(t('booking.minus')) + '">−</button><output id="booking-count">' + state.bookingCount + '</output><button type="button" id="booking-plus" aria-label="' + escapeHtml(t('booking.plus')) + '">+</button></div></div></div><div class="booking-bags"><span class="booking-label">' + escapeHtml(t('booking.shopping')) + '</span><div class="booking-bag-row"><div><strong>' + escapeHtml(t('summary.bags')) + '</strong><small>' + escapeHtml(t('booking.shoppingHint', { count: formatNumber(PRICING.bagBundle) })) + '</small></div><div class="stepper"><button type="button" id="shopping-minus" aria-label="' + escapeHtml(t('booking.shoppingMinus')) + '">−</button><output id="shopping-count">' + state.shoppingBags + '</output><button type="button" id="shopping-plus" aria-label="' + escapeHtml(t('booking.shoppingPlus')) + '">+</button></div></div></div><label class="booking-label" for="booking-note">' + escapeHtml(t('booking.note')) + '</label><textarea id="booking-note" name="note" maxlength="120" required placeholder="' + escapeHtml(t('booking.notePh')) + '">' + escapeHtml(state.bagNote) + '</textarea><label class="booking-plus"><input type="checkbox" id="booking-plus-option" name="plus"><span>' + escapeHtml(t('booking.plusLabel', { money: money(PRICING.plusRate) })) + '</span></label><div class="booking-lines"><div class="ticket-line"><span>' + escapeHtml(t('booking.storage')) + '</span><b id="booking-storage"></b></div><div class="ticket-line"><span>' + escapeHtml(t('booking.plusFee')) + '</span><b id="booking-plus-fee"></b></div><div class="ticket-line booking-grand"><span>' + escapeHtml(t('booking.total')) + '<small id="booking-formula"></small></span><strong id="booking-total"></strong></div></div><p class="booking-adjust" id="booking-adjust" hidden></p><label class="booking-consent"><input type="checkbox" name="payConsent" required><span>' + escapeHtml(t('booking.consent')) + '</span></label><div id="booking-errors" class="booking-errors" role="alert" hidden></div><button class="button button-primary booking-submit" type="submit">' + escapeHtml(t('booking.submit')) + icon('arrow') + '</button></form></div>';
  syncBookingPrice();
  if (source !== 'refresh') {
    $('#store-dialog').showModal();
    $('#booking-date').focus();
  }
}

function choiceSummary(booking) {
  const planLabel = booking.plan === 'hour' ? t('booking.hour') : t('booking.day');
  const when = booking.plan === 'hour' ? escapeHtml(booking.start) + ' → ' + escapeHtml(booking.end) : escapeHtml(t('summary.start', { time: booking.start }));
  const bags = booking.shoppingBagCount ? '<div class="ticket-line"><span>' + escapeHtml(t('summary.bags')) + '</span><b>' + escapeHtml(t('summary.bagValue', { count: formatNumber(booking.shoppingBagCount), units: formatNumber(booking.units) })) + '</b></div>' : '';
  const plus = '<div class="ticket-line"><span>' + escapeHtml(t('booking.plusFee')) + '</span><b>' + escapeHtml(booking.plus ? t('summary.plusOn') : t('summary.plusOff')) + '</b></div>';
  return '<div class="ticket-line"><span>' + escapeHtml(t('summary.date')) + '</span><b>' + escapeHtml(dateLabel(booking.date)) + '</b></div><div class="ticket-line"><span>' + escapeHtml(t('summary.time')) + '</span><b>' + when + '</b></div><div class="ticket-line"><span>' + escapeHtml(t('summary.plan')) + '</span><b>' + escapeHtml(planLabel) + '</b></div><div class="ticket-line"><span>' + escapeHtml(t('summary.luggage')) + '</span><b>' + escapeHtml(t('summary.luggageValue', { count: formatNumber(booking.count), note: booking.note.trim() })) + '</b></div>' + bags + plus + '<div class="ticket-line"><span>' + escapeHtml(t('booking.total')) + '</span><b>' + escapeHtml(money(booking.total)) + '</b></div>';
}

function scaleChoices(name) {
  return '<div class="scale-row">' + [1, 2, 3, 4, 5].map(score => '<label class="scale-choice"><input type="radio" name="' + name + '" value="' + score + '" required><span>' + score + '</span></label>').join('') + '</div>';
}

function wordChoices(name, options) {
  return '<div class="pill-row">' + options.map(option => '<label class="pill-choice"><input type="radio" name="' + name + '" value="' + option.value + '" required><span>' + option.label + '</span></label>').join('') + '</div>';
}

function showMvp(booking) {
  state.mvpBooking = booking;
  const hesitations = ['price', 'unfamiliar', 'distance', 'hours', 'loss', 'payment', 'none'].map(value => [value, t('hesitation.' + value)]);
  $('#store-dialog').classList.add('survey-open');
  $('#store-dialog-content').innerHTML = '<div class="mvp-reveal"><div class="mvp-heart" aria-hidden="true">' + icon('heart') + '</div><p class="mvp-kicker">THANK YOU FOR TRYING TooK</p><h2 id="store-title">' + t('mvp.title') + '</h2><p class="mvp-lead">' + t('mvp.lead') + '</p><p class="mvp-note">' + escapeHtml(t('mvp.note')) + '</p><div class="mvp-tabs" role="tablist" aria-label="' + escapeHtml(t('mvp.tabs')) + '"><button type="button" id="mvp-tab-survey" role="tab" aria-selected="true" aria-controls="mvp-panel-survey" data-mvp-tab="survey">' + escapeHtml(t('mvp.survey')) + '</button><button type="button" id="mvp-tab-reservation" role="tab" aria-selected="false" aria-controls="mvp-panel-reservation" data-mvp-tab="reservation" tabindex="-1">' + escapeHtml(t('mvp.reservation')) + '</button></div><div id="mvp-panel-survey" role="tabpanel" aria-labelledby="mvp-tab-survey"><form id="survey-form"><div class="survey-question"><h3>' + escapeHtml(t('mvp.q1')) + '</h3>' + scaleChoices('intent') + '<div class="scale-caption"><span>' + escapeHtml(t('mvp.low')) + '</span><span>' + escapeHtml(t('mvp.high')) + '</span></div></div><div class="survey-question"><h3>' + escapeHtml(t('mvp.q2')) + '</h3>' + wordChoices('priceFeel', [{ value: 'cheap', label: t('mvp.cheap') }, { value: 'fair', label: t('mvp.fair') }, { value: 'bit-high', label: t('mvp.bitHigh') }, { value: 'too-high', label: t('mvp.tooHigh') }]) + '</div><div class="survey-question"><h3>' + escapeHtml(t('mvp.q3')) + '</h3><label class="won-field"><input id="survey-max-price" name="maxPrice" type="number" inputmode="numeric" min="0" max="1000000" step="100" required placeholder="' + escapeHtml(t('mvp.pricePh')) + '"><span>' + escapeHtml(t('mvp.won')) + '</span></label></div><div class="survey-question"><h3>' + escapeHtml(t('mvp.q4', { money: money(PRICING.plusRate) })) + '</h3>' + wordChoices('plusFeel', [{ value: 'no', label: t('mvp.no') }, { value: 'maybe', label: t('mvp.maybe') }, { value: 'yes', label: t('mvp.yes') }]) + '</div><div class="survey-question"><h3>' + escapeHtml(t('mvp.q5')) + '</h3>' + scaleChoices('ease') + '<div class="scale-caption"><span>' + escapeHtml(t('mvp.hard')) + '</span><span>' + escapeHtml(t('mvp.easy')) + '</span></div></div><div class="survey-question"><h3>' + escapeHtml(t('mvp.q6')) + ' <small>' + escapeHtml(t('mvp.multi')) + '</small></h3><div class="pill-row">' + hesitations.map(item => '<label class="pill-choice"><input type="checkbox" name="hesitation" value="' + item[0] + '"><span>' + escapeHtml(item[1]) + '</span></label>').join('') + '</div></div><div class="survey-question"><h3>' + escapeHtml(t('mvp.q7')) + ' <small>' + escapeHtml(t('mvp.optional')) + '</small></h3><textarea name="wish" maxlength="400" placeholder="' + escapeHtml(t('mvp.wishPh')) + '"></textarea></div><label class="survey-sms"><input type="checkbox" name="sms"><span>' + escapeHtml(t('mvp.sms')) + '</span></label><div id="survey-errors" class="booking-errors" role="alert" hidden></div><div class="mvp-actions"><button class="button button-primary" type="submit">' + escapeHtml(t('mvp.send')) + icon('arrow') + '</button><button class="button button-outline" type="button" id="mvp-later">' + escapeHtml(t('mvp.later')) + '</button></div></form><div id="survey-thanks" hidden><span class="success-icon">' + icon('check') + '</span><h3>' + escapeHtml(t('mvp.thanksTitle')) + '</h3><p>' + escapeHtml(t('mvp.thanksBody')) + '</p></div></div><div id="mvp-panel-reservation" role="tabpanel" aria-labelledby="mvp-tab-reservation" hidden><div class="reservation-ticket"><strong>' + escapeHtml(displayName(state.selectedStore)) + '</strong>' + choiceSummary(booking) + '</div><p class="mvp-note">' + escapeHtml(t('mvp.priceNote')) + '</p></div></div>';
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
    $('#booking-errors').textContent = errors.map(translateError).join(' ');
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
    errors.textContent = t('survey.needHesitation');
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
  if (!saved) toast(t('toast.surveyFail'));
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
  const when = booking.plan === 'hour' ? escapeHtml(booking.start) + ' → ' + escapeHtml(booking.end) : escapeHtml(t('summary.start', { time: booking.start }));
  return '<div class="ticket-line"><span>' + escapeHtml(t('summary.date')) + '</span><b>' + escapeHtml(dateLabel(booking.date)) + '</b></div><div class="ticket-line"><span>' + escapeHtml(t('summary.time')) + '</span><b>' + when + '</b></div><div class="ticket-line"><span>' + escapeHtml(t('summary.luggage')) + '</span><b>' + escapeHtml(t('summary.luggageValue', { count: formatNumber(booking.count), note: booking.note })) + '</b></div><div class="ticket-line"><span>' + escapeHtml(t('summary.guide')) + '</span><b>' + escapeHtml(money(booking.total)) + '</b></div>';
}

function renderBookings() {
  const bookings = getBookings();
  $('#bookings-list').innerHTML = bookings.length ? bookings.map(booking => {
    const store = STORES.find(item => item.id === booking.storeId);
    return '<article class="saved-booking"><div class="saved-booking-head"><strong>' + escapeHtml(displayName(store)) + '</strong><span class="booking-badge">' + escapeHtml(t('bookings.saved')) + '</span></div>' + ticketHTML(booking) + '<button class="delete-booking" data-delete="' + escapeHtml(booking.id) + '">' + escapeHtml(t('bookings.cancel')) + '</button></article>';
  }).join('') : '<div class="bookings-empty">' + icon('bag') + '<h3>' + escapeHtml(t('bookings.emptyTitle')) + '</h3><p>' + t('bookings.emptyBody') + '</p><button class="button button-primary" id="find-from-bookings" type="button">' + escapeHtml(t('bookings.find')) + icon('arrow') + '</button></div>';
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
  const group = document.querySelector('[data-filter="region"]');
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
      button.textContent = labelPlace(city);
      group.append(button);
    });
}

function renderDistricts() {
  const group = document.querySelector('[data-filter="district"]');
  if (!group) return;
  const { city } = resolveArea(state.area);
  const names = city ? districtsFor(city) : [];
  group.hidden = names.length === 0;
  group.replaceChildren();
  if (!names.length) return;
  const all = document.createElement('button');
  all.type = 'button';
  all.dataset.area = city;
  all.textContent = t('filter.cityAll', { city: labelPlace(city) });
  group.append(all);
  names.forEach(name => {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.area = name;
    button.textContent = labelPlace(name);
    group.append(button);
  });
}

function paintAreaButtons() {
  const { city, district } = resolveArea(state.area);
  $$('[data-filter="region"] [data-area]').forEach(button => {
    const active = button.dataset.area === '전체' ? !city : button.dataset.area === city;
    button.textContent = button.dataset.area === '전체' ? t('filter.all') : labelPlace(button.dataset.area);
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  $$('[data-filter="district"] [data-area]').forEach(button => {
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
    favourite.setAttribute('aria-label', adding ? t('card.unsave', { name: displayName(store) }) : t('card.save', { name: displayName(store) }));
    toast(saved ? (adding ? t('toast.saved') : t('toast.unsaved')) : t('toast.saveFail'));
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
  if (button.dataset.confirm !== 'true') { button.dataset.confirm = 'true'; button.textContent = t('bookings.confirmDelete'); return; }
  if (storage.set('linkeep-demo-bookings', getBookings().filter(booking => booking.id !== button.dataset.delete))) { renderBookings(); toast(t('toast.cancelled')); }
  else toast(t('toast.cancelFail'));
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
  $('.mobile-menu-button').setAttribute('aria-label', open ? t('a11y.menuClose') : t('a11y.menuOpen'));
  $('.mobile-menu-button use').setAttribute('href', open ? '#i-close' : '#i-menu');
});
function closeMobileMenu() { $('#mobile-nav').hidden = true; $('.mobile-menu-button').setAttribute('aria-expanded', 'false'); $('.mobile-menu-button').setAttribute('aria-label', t('a11y.menuOpen')); $('.mobile-menu-button use').setAttribute('href', '#i-menu'); }
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
  const pack = copyPack(key);
  document.documentElement.dataset.copy = key;
  document.title = pack.title;
  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.setAttribute('content', pack.meta);
  Object.entries(pack.html).forEach(([name, value]) => {
    const node = document.querySelector('[data-copy="' + name + '"]');
    if (node && value) node.innerHTML = value;
  });
  Object.entries(pack.text).forEach(([name, value]) => {
    const node = document.querySelector('[data-copy="' + name + '"]');
    if (node && value) node.textContent = value;
  });
  setCopyContext(key);
  $$('input[name="copy-mode"]').forEach(input => { input.checked = input.value === key; });
}
function applyDom() {
  document.documentElement.lang = localeLang();
  $$('[data-i18n]').forEach(node => {
    const value = t(node.dataset.i18n);
    if (value) node.textContent = value;
  });
  $$('[data-i18n-html]').forEach(node => {
    const value = t(node.dataset.i18nHtml);
    if (value) node.innerHTML = value;
  });
  $$('[data-i18n-placeholder]').forEach(node => {
    const value = t(node.dataset.i18nPlaceholder);
    if (value) node.setAttribute('placeholder', value);
  });
  $$('[data-i18n-attr]').forEach(node => {
    String(node.dataset.i18nAttr || '').split(';').forEach(pair => {
      const split = pair.indexOf(':');
      if (split < 1) return;
      const attr = pair.slice(0, split).trim();
      const value = t(pair.slice(split + 1).trim());
      if (attr && value) node.setAttribute(attr, value);
    });
  });
  const locale = getLocale();
  $$('[data-locale]').forEach(button => {
    const selected = button.dataset.locale === locale;
    button.setAttribute('aria-checked', selected ? 'true' : 'false');
    button.tabIndex = selected ? 0 : -1;
  });
}
function checkedValue(form, name) {
  return form?.querySelector('input[name="' + name + '"]:checked')?.value || '';
}
function snapshotSurvey() {
  const form = $('#survey-form');
  if (!form) return null;
  return {
    thanks: Boolean($('#survey-thanks') && !$('#survey-thanks').hidden),
    tab: $('[data-mvp-tab][aria-selected="true"]')?.dataset.mvpTab || 'survey',
    intent: checkedValue(form, 'intent'),
    priceFeel: checkedValue(form, 'priceFeel'),
    maxPrice: $('#survey-max-price')?.value || '',
    plusFeel: checkedValue(form, 'plusFeel'),
    ease: checkedValue(form, 'ease'),
    hesitations: $$('input[name="hesitation"]', form).filter(input => input.checked).map(input => input.value),
    wish: form.querySelector('[name="wish"]')?.value || '',
    sms: Boolean(form.querySelector('[name="sms"]')?.checked)
  };
}
function restoreSurvey(snap) {
  if (!snap) return;
  const form = $('#survey-form');
  if (!form) return;
  const choose = (name, value) => {
    if (!value) return;
    const input = form.querySelector('input[name="' + name + '"][value="' + value + '"]');
    if (input) input.checked = true;
  };
  choose('intent', snap.intent);
  choose('priceFeel', snap.priceFeel);
  choose('plusFeel', snap.plusFeel);
  choose('ease', snap.ease);
  const price = $('#survey-max-price');
  if (price) price.value = snap.maxPrice;
  $$('input[name="hesitation"]', form).forEach(input => { input.checked = snap.hesitations.includes(input.value); });
  const wish = form.querySelector('[name="wish"]');
  if (wish) wish.value = snap.wish;
  const sms = form.querySelector('[name="sms"]');
  if (sms) sms.checked = snap.sms;
  if (snap.thanks) {
    form.hidden = true;
    const thanks = $('#survey-thanks');
    if (thanks) thanks.hidden = false;
  }
  if (snap.tab && snap.tab !== 'survey') showMvpTab(snap.tab);
}
function snapshotBooking() {
  const form = $('#booking-form');
  if (!form) return null;
  return {
    date: $('#booking-date')?.value || '',
    start: $('#booking-start')?.value || '',
    end: $('#booking-end')?.value || '',
    note: $('#booking-note')?.value || '',
    plan: selectedPlan(),
    plus: Boolean($('#booking-plus-option')?.checked),
    consent: Boolean(form.querySelector('[name="payConsent"]')?.checked)
  };
}
function restoreBooking(snap) {
  if (!snap) return;
  const date = $('#booking-date');
  if (date && snap.date) date.value = snap.date;
  const start = $('#booking-start');
  if (start && [...start.options].some(option => option.value === snap.start)) start.value = snap.start;
  const plan = $('#store-dialog-content input[name="plan"][value="' + snap.plan + '"]');
  if (plan) plan.checked = true;
  syncBookingPrice();
  const end = $('#booking-end');
  if (end && [...end.options].some(option => option.value === snap.end)) end.value = snap.end;
  const note = $('#booking-note');
  if (note) note.value = snap.note;
  const plus = $('#booking-plus-option');
  if (plus) plus.checked = snap.plus;
  const consent = $('#booking-form [name="payConsent"]');
  if (consent) consent.checked = snap.consent;
  syncBookingPrice();
}
function refreshOpenSurfaces() {
  const menuButton = $('.mobile-menu-button');
  if (menuButton?.getAttribute('aria-expanded') === 'true') menuButton.setAttribute('aria-label', t('a11y.menuClose'));
  if ($('#bookings-dialog')?.open) renderBookings();
  const storeDialog = $('#store-dialog');
  if (storeDialog?.open && state.mvpBooking) {
    const snap = snapshotSurvey();
    showMvp(state.mvpBooking);
    restoreSurvey(snap);
    return;
  }
  if (storeDialog?.open && state.selectedStore) {
    const snap = snapshotBooking();
    openStore(state.selectedStore.id, 'refresh');
    restoreBooking(snap);
  }
}
function applyLanguage() {
  applyDom();
  applyCopy(resolvedCopyMode());
  const bagLabel = $('#bag-label');
  if (bagLabel) bagLabel.textContent = bagCountLabel(state.bagCount);
  renderStores();
  refreshOpenSurfaces();
}
function selectLocale(id, focusButton) {
  const next = saveLocale(storage, id);
  applyLanguage();
  if (!focusButton) return;
  const group = focusButton.closest('[role="radiogroup"]');
  group?.querySelector('[data-locale="' + next + '"]')?.focus();
}
$$('[data-lang-switch]').forEach(group => {
  group.addEventListener('click', event => {
    const button = event.target.closest('[data-locale]');
    if (!button || !group.contains(button)) return;
    selectLocale(button.dataset.locale);
  });
  group.addEventListener('keydown', event => {
    const button = event.target.closest('[data-locale]');
    if (!button || !group.contains(button)) return;
    const buttons = $$('[data-locale]', group);
    const index = buttons.indexOf(button);
    let nextIndex = -1;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = (index + 1) % buttons.length;
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = (index - 1 + buttons.length) % buttons.length;
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = buttons.length - 1;
    else if (event.key === ' ' || event.key === 'Enter') { event.preventDefault(); selectLocale(button.dataset.locale, button); return; }
    else return;
    event.preventDefault();
    selectLocale(buttons[nextIndex].dataset.locale, buttons[nextIndex]);
  });
});
setShowRealNames(!hideRealNames());
updateHeroBags(0);
applyLanguage();
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
