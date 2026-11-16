import type { ReactNode } from "react";
import Panel from "./ui/Panel";
import StatusBadge from "./ui/StatusBadge";

interface Capability { title: string; detail: string; }

interface Props {
  icon: ReactNode;
  title: string;
  tagline: string;
  stage: string;
  capabilities: Capability[];
  cta?: ReactNode;
}

export default function ModuleBriefing({ icon, title, tagline, stage, capabilities, cta }: Props) {
  return (
    <div className="stack">
      <Panel>
        <div className="briefing-head">
          <span className="briefing-icon">{icon}</span>
          <div>
            <h2>{title}</h2>
            <p>{tagline}</p>
          </div>
          <StatusBadge status="neutral" label={stage} />
        </div>
      </Panel>
      <div className="grid-2">
        {capabilities.map((c) => (
          <Panel key={c.title} title={c.title}>
            <p className="muted">{c.detail}</p>
          </Panel>
        ))}
      </div>
      {cta}
    </div>
  );
}