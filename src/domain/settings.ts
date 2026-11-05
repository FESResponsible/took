import { BAG_SIZES } from './bags';
import { parseHHmm } from './time';
import type { StoreSettings } from './types';

const isIntBetween = (value: number, min: number, max: number): boolean =>
  Number.isInteger(value) && value >= min && value <= max;

function openHoursError(settings: StoreSettings): string | null {
  try {
    const open = parseHHmm(settings.openHours.open);
    const close = parseHHmm(settings.openHours.close);
    return open < close ? null : '운영 시간은 시작이 종료보다 빨라야 해요.';
  } catch {
    return '운영 시간을 HH:mm 형식으로 입력해 주세요.';
  }
}

/** 문제가 없으면 빈 배열. 있으면 사장님에게 보여 줄 문장들. */
export function validateSettings(settings: StoreSettings): string[] {
  const problems: Array<string | null> = [
    isIntBetween(settings.maxBagsAtOnce, 1, 200) ? null : '최대 짐 개수는 1~200 사이로 입력해 주세요.',
    BAG_SIZES.some((size) => settings.acceptedSizes[size]) ? null : '받을 수 있는 짐 크기를 하나 이상 골라 주세요.',
    openHoursError(settings),
    isIntBetween(settings.maxStorageDays, 1, 30) ? null : '최대 보관 일수는 1~30일 사이로 입력해 주세요.',
    isIntBetween(settings.groupBagThreshold, 2, 100) ? null : '단체 기준은 짐 2~100개 사이로 입력해 주세요.',
  ];
  return problems.filter((problem): problem is string => problem !== null);
}

