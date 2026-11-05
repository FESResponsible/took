const QR_PREFIX = 'took://booking/';
const QR_PATTERN = /^(?:took:\/\/booking\/)?(TK-\d{4})$/i;

/** 고객 화면에 보여 줄 QR의 내용 */
export function buildQrPayload(code: string): string {
  return `${QR_PREFIX}${code}`;
}

/**
 * QR에서 읽은 글자에서 예약번호만 꺼낸다. TooK 형식이 아니면 null.
 * QR 내용은 외부 입력이라 링크로 열지 않고 예약번호로만 쓴다.
 */
export function parseQrPayload(text: string): string | null {
  const match = QR_PATTERN.exec(text.trim());
  return match ? match[1].toUpperCase() : null;
}

