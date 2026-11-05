import type { Policy } from '@/domain/types';

/**
 * 팀이 정해야 하는 운영 값입니다. 지금 숫자는 모두 예시값입니다.
 * 결정되면 이 파일만 바꾸면 화면과 정산 계산에 모두 반영됩니다.
 */
export const DEFAULT_POLICY: Policy = {
  /** 짐 1개당 매장 정산액 (예시값: 인터뷰 기준 Bounce 일반 조건 수준) */
  payoutPerBagKrw: 2500,
  /** 노쇼 시 매장에 지급하는 비율 (예시값) */
  noShowCompensationRate: 0.5,
  /** 확인 필요 예약에 사장님이 응답할 시간. 지나면 자동 만료 (예시값) */
  approvalResponseMinutes: 30,
  /** 예약 시간 이후 이만큼 지나면 노쇼로 처리할 수 있음 (예시값) */
  noShowGraceMinutes: 60,
};

/** 정산 주기 안내 문구 (팀 결정 필요) */
export const SETTLEMENT_CYCLE_LABEL = '[정산 주기]마다 등록하신 계좌로 입금';

