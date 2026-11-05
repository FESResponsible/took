export function newId(): string {
  return crypto.randomUUID();
}

/** 다른 예약과 겹치지 않는 'TK-0000' 형식의 예약번호 */
export function newBookingCode(existingCodes: readonly string[]): string {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    const code = `TK-${String(Math.floor(1000 + Math.random() * 9000))}`;
    if (!existingCodes.includes(code)) return code;
  }
  throw new Error('예약번호를 만들지 못했어요. 다시 시도해 주세요.');
}

