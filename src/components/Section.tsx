import type { ReactNode } from 'react';

interface SectionProps {
  readonly title: string;
  readonly count?: number;
  readonly description?: string;
  readonly empty?: string;
  readonly children?: ReactNode;
  readonly isEmpty?: boolean;
}

export function Section({ title, count, description, empty, isEmpty = false, children }: SectionProps) {
  return (
    <section className="section">
      <h2 className="section-title">
        {title}
        {count !== undefined && <span className="section-count">{count}</span>}
      </h2>
      {description && <p className="section-desc">{description}</p>}
      {isEmpty ? <p className="empty">{empty}</p> : <div className="stack">{children}</div>}
    </section>
  );
}

