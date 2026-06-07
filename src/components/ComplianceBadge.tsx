import { FilingStatus, InspectionImpact, FILING_STATUS_LABELS, INSPECTION_IMPACT_LABELS } from '@/types';
import { CheckCircle, Clock, XCircle, AlertTriangle, Check, RefreshCw } from 'lucide-react';

interface FilingBadgeProps {
  status: FilingStatus;
}

export function FilingBadge({ status }: FilingBadgeProps) {
  const configs: Record<FilingStatus, { icon: typeof CheckCircle; className: string }> = {
    filed: { icon: CheckCircle, className: 'status-filed' },
    pending: { icon: Clock, className: 'status-pending' },
    not_filed: { icon: XCircle, className: 'status-not-filed' },
  };

  const { icon: Icon, className } = configs[status];

  return (
    <span className={`status-badge inline-flex items-center gap-1 ${className}`}>
      <Icon className="w-3 h-3" />
      {FILING_STATUS_LABELS[status]}
    </span>
  );
}

interface InspectionBadgeProps {
  impact: InspectionImpact;
}

export function InspectionBadge({ impact }: InspectionBadgeProps) {
  const configs: Record<InspectionImpact, { icon: typeof Check; className: string; label: string }> = {
    no_impact: { icon: Check, className: 'status-filed', label: INSPECTION_IMPACT_LABELS[impact] },
    need_restore: { icon: RefreshCw, className: 'status-pending', label: INSPECTION_IMPACT_LABELS[impact] },
    may_fail: { icon: AlertTriangle, className: 'status-not-filed', label: INSPECTION_IMPACT_LABELS[impact] },
  };

  const { icon: Icon, className, label } = configs[impact];

  return (
    <span className={`status-badge inline-flex items-center gap-1 ${className}`}>
      <Icon className="w-3 h-3" />
      年检: {label}
    </span>
  );
}
