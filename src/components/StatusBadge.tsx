import type { BookingStatus } from '@/domain/types';
import { STATUS_LABEL } from '@/ui/labels';

export function StatusBadge({ status }: { status: BookingStatus }) {
  return <span className={`badge badge-${status}`}>{STATUS_LABEL[status]}</span>;
}
