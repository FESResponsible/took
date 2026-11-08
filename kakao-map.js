// 카카오맵을 불러와 매장 지도를 그린다. 묶음 계산은 app.js가 맡고, 여기서는 표시만 한다.
const SDK_URL = 'https://dapi.kakao.com/v2/maps/sdk.js';
const KEY_PATTERN = /^[a-f0-9]{32}$/i;
const LOAD_TIMEOUT_MS = 8000;
const ZOOM_OFFSET = 20;
const MIN_LEVEL = 1;
const MAX_LEVEL = 14;
const BOUNDS_PADDING = 0.15;
const SAME_POSITION = 1e-7;
const PIN_LAYER = 2;
const ACTIVE_LAYER = 3;

let loading = null;

export const zoomToLevel = zoom => Math.min(MAX_LEVEL, Math.max(MIN_LEVEL, ZOOM_OFFSET - zoom));
export const levelToZoom = level => ZOOM_OFFSET - level;

/** 테스트에서 SDK 로딩 상태를 비운다. */
export function resetKakaoLoader() {
  loading = null;
}

function injectSdk(appKey, { doc, win, timeoutMs }) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Kakao SDK timeout')), timeoutMs);
    const finish = callback => value => { clearTimeout(timer); callback(value); };
    const script = doc.createElement('script');
    script.src = `${SDK_URL}?appkey=${encodeURIComponent(appKey)}&autoload=false`;
    script.async = true;
    script.onerror = finish(() => reject(new Error('Kakao SDK failed to load')));
    script.onload = () => {
      if (!win.kakao?.maps) { finish(reject)(new Error('Kakao SDK is unavailable')); return; }
      win.kakao.maps.load(finish(resolve));
    };
    doc.head.appendChild(script);
  });
}

/**
 * SDK를 한 번만 불러온다. 실패하면 다음 호출에서 다시 시도할 수 있다.
 * @param {string} appKey 카카오 JavaScript 키
 * @param {{doc?: Document, win?: Window, timeoutMs?: number}} env
 * @returns {Promise<void>}
 */
export function loadKakaoMaps(appKey, env = {}) {
  if (!KEY_PATTERN.test(String(appKey ?? ''))) return Promise.reject(new Error('invalid Kakao key'));
  if (!loading) {
    const context = { doc: env.doc ?? document, win: env.win ?? window, timeoutMs: env.timeoutMs ?? LOAD_TIMEOUT_MS };
    loading = injectSdk(appKey, context).catch(error => { loading = null; throw error; });
  }
  return loading;
}

function markerElement(doc, marker) {
  const anchor = doc.createElement('div');
  anchor.className = 'kakao-marker';
  const node = doc.createElement(marker.onClick ? 'button' : 'span');
  node.className = marker.className;
  node.setAttribute('aria-label', marker.ariaLabel);
  if (marker.onClick) {
    node.type = 'button';
    node.addEventListener('click', event => { event.stopPropagation(); marker.onClick(); });
  } else node.setAttribute('role', 'img');
  if (marker.label) {
    const name = doc.createElement('span');
    name.textContent = marker.label;
    const count = doc.createElement('strong');
    count.textContent = marker.count;
    node.appendChild(name);
    node.appendChild(count);
  }
  anchor.appendChild(node);
  return anchor;
}

function paddedBounds(map) {
  const bounds = map.getBounds();
  const southWest = bounds.getSouthWest();
  const northEast = bounds.getNorthEast();
  const latPad = (northEast.getLat() - southWest.getLat()) * BOUNDS_PADDING;
  const lngPad = (northEast.getLng() - southWest.getLng()) * BOUNDS_PADDING;
  return {
    south: southWest.getLat() - latPad,
    north: northEast.getLat() + latPad,
    west: southWest.getLng() - lngPad,
    east: northEast.getLng() + lngPad,
  };
}

const isInside = (area, marker) => marker.lat >= area.south && marker.lat <= area.north && marker.lng >= area.west && marker.lng <= area.east;

/**
 * @param {HTMLElement} element 지도를 넣을 영역
 * @param {{camera: {lat: number, lng: number, zoom: number}, onIdle: Function}} options
 * @param {{kakao?: object, doc?: Document}} env
 */
export function createKakaoMap(element, { camera, onIdle }, env = {}) {
  const { maps } = env.kakao ?? window.kakao;
  const doc = env.doc ?? document;
  const toPosition = point => new maps.LatLng(point.lat, point.lng);
  const map = new maps.Map(element, { center: toPosition(camera), level: zoomToLevel(camera.zoom) });
  let overlays = [];

  const readCamera = () => {
    const center = map.getCenter();
    return { lat: center.getLat(), lng: center.getLng(), zoom: levelToZoom(map.getLevel()) };
  };

  maps.event.addListener(map, 'idle', () => onIdle(readCamera()));

  return {
    setCamera(next) {
      const target = { lat: next.lat, lng: next.lng, level: zoomToLevel(next.zoom) }; // 이동 중 이벤트로 next가 바뀌어도 목표를 유지
      const current = readCamera();
      const moved = Math.abs(current.lat - target.lat) > SAME_POSITION || Math.abs(current.lng - target.lng) > SAME_POSITION;
      if (moved) map.setCenter(toPosition(target));
      if (target.level !== map.getLevel()) map.setLevel(target.level);
    },
    setMarkers(markers) {
      overlays.forEach(overlay => overlay.setMap(null));
      const area = paddedBounds(map);
      overlays = markers.filter(marker => isInside(area, marker)).map(marker => new maps.CustomOverlay({
        position: toPosition(marker),
        content: markerElement(doc, marker),
        xAnchor: 0,
        yAnchor: 0,
        clickable: Boolean(marker.onClick),
        zIndex: marker.isActive ? ACTIVE_LAYER : PIN_LAYER,
      }));
      overlays.forEach(overlay => overlay.setMap(map));
    },
    relayout() {
      map.relayout();
    },
  };
}
