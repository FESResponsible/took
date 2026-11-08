import { copyContextFor } from './model.js?v=80d34a02d562';

const STORAGE_KEY = 'chaegim-mvp-events';
const MAX_LOCAL = 200;
let copyContext = copyContextFor('tourism');

export function setCopyContext(mode) {
  copyContext = copyContextFor(mode);
}

function config() {
  return window.CHAEGIM_ANALYTICS || {};
}

function utmParams() {
  const params = new URLSearchParams(location.search);
  const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'fbclid'];
  const data = {};
  keys.forEach(key => {
    const value = params.get(key);
    if (value) data[key] = value;
  });
  return data;
}

function rememberAttribution() {
  const incoming = utmParams();
  if (!Object.keys(incoming).length) return storageGet('chaegim-mvp-attribution', {});
  storageSet('chaegim-mvp-attribution', { ...incoming, capturedAt: new Date().toISOString() });
  return incoming;
}

function storageGet(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
}

function storageSet(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch { return false; }
}

function saveLocal(eventName, params) {
  const list = storageGet(STORAGE_KEY, []);
  const next = [{ event: eventName, params, at: new Date().toISOString(), path: location.pathname + location.search }, ...list].slice(0, MAX_LOCAL);
  storageSet(STORAGE_KEY, next);
}

function ensureGa4(id) {
  if (!id || window.__chaegimGaReady) return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', id, { send_page_view: false, anonymize_ip: true });
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
  document.head.appendChild(script);
  window.__chaegimGaReady = true;
}

function ensureMeta(id) {
  if (!id || window.__chaegimMetaReady) return;
  /* eslint-disable */
  !(function (f, b, e, v, n, t, s) {
    if (f.fbq) return;
    n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
    if (!f._fbq) f._fbq = n;
    n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
    t = b.createElement(e); t.async = !0; t.src = v;
    s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
  })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
  /* eslint-enable */
  window.fbq('init', id);
  window.__chaegimMetaReady = true;
}

export function track(eventName, params = {}) {
  const cfg = config();
  const attribution = storageGet('chaegim-mvp-attribution', {});
  const payload = { ...attribution, ...params, ...copyContext, demo: true };
  saveLocal(eventName, payload);
  if (cfg.debug) console.info('[CHAEGIM track]', eventName, payload);

  if (cfg.ga4MeasurementId) {
    ensureGa4(cfg.ga4MeasurementId);
    window.gtag('event', eventName, payload);
  }

  if (cfg.metaPixelId) {
    ensureMeta(cfg.metaPixelId);
    const metaMap = {
      page_view: 'PageView',
      partner_cta_click: 'Lead',
      partner_submit: 'CompleteRegistration',
      store_open: 'ViewContent',
      reserve_click: 'AddToCart',
      booking_submit: 'InitiateCheckout',
      survey_submit: 'SubmitApplication'
    };
    const metaEvent = metaMap[eventName] || 'CustomEvent';
    if (metaEvent === 'Purchase') {
      window.fbq('track', 'Purchase', { value: Number(params.value || 0), currency: 'KRW', content_name: params.store_name || 'demo' });
    } else if (metaEvent === 'CustomEvent') {
      window.fbq('trackCustom', eventName, payload);
    } else {
      window.fbq('track', metaEvent, payload);
    }
  }
}

export function initAnalytics() {
  rememberAttribution();
  const cfg = config();
  if (cfg.ga4MeasurementId) ensureGa4(cfg.ga4MeasurementId);
  if (cfg.metaPixelId) ensureMeta(cfg.metaPixelId);
  track('page_view', { page_title: document.title });
}

export function getLocalEvents() {
  return storageGet(STORAGE_KEY, []);
}
