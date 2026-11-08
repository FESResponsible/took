// 파트너 신청 내용을 검증해 구글 시트(Apps Script)로 보낸다.
const LIMITS = Object.freeze({ store: 80, area: 80, email: 254 });
const MAX_PAGE_LENGTH = 120;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ENDPOINT_PREFIX = 'https://script.google.com/macros/s/';

function requiredField(fields, name) {
  const value = String(fields[name] ?? '').trim();
  if (!value || value.length > LIMITS[name]) throw new Error(`invalid ${name}`);
  return value;
}

/**
 * @param {{store?: string, area?: string, email?: string, company_url?: string}} fields 폼 입력값
 * @param {string} page 접수한 사이트 주소
 * @returns {{store: string, area: string, email: string, company_url: string, page: string}}
 */
export function buildPartnerApplication(fields, page) {
  const email = requiredField(fields, 'email');
  if (!EMAIL_PATTERN.test(email)) throw new Error('invalid email');
  return {
    store: requiredField(fields, 'store'),
    area: requiredField(fields, 'area'),
    email,
    company_url: String(fields.company_url ?? ''), // 봇 차단용 숨김 칸
    page: String(page).slice(0, MAX_PAGE_LENGTH),
  };
}

/**
 * Apps Script는 응답 본문을 읽을 수 없어 no-cors로 보낸다.
 * 네트워크 오류가 나면 reject되므로 호출한 쪽에서 실패 안내를 보여 준다.
 * @param {string} endpoint Apps Script 웹앱 URL
 * @param {object} application buildPartnerApplication 결과
 * @param {typeof fetch} fetchImpl
 * @returns {Promise<void>}
 */
export async function sendPartnerApplication(endpoint, application, fetchImpl = fetch) {
  if (!String(endpoint ?? '').startsWith(ENDPOINT_PREFIX)) throw new Error('invalid endpoint');
  await fetchImpl(endpoint, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(application),
  });
}
