export function formatTime(iso: string): string {
  const date = new Date(iso);
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

export function formatDay(iso: string, now: Date): string {
  const date = new Date(iso);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diff = Math.round((target.getTime() - today.getTime()) / 86_400_000);
  if (diff === 0) return '오늘';
  if (diff === 1) return '내일';
  if (diff === -1) return '어제';
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
}

export function formatWhen(iso: string, now: Date): string {
  return `${formatDay(iso, now)} ${formatTime(iso)}`;
}

export function formatKrw(amount: number): string {
  return `${amount.toLocaleString('ko-KR')}원`;
}

export function toDateKey(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}
