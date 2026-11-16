interface Props {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
  description?: string;
}

export default function Switch({ checked, onChange, label, description }: Props) {
  return (
    <button type="button" role="switch" aria-checked={checked} className="switch-row" onClick={() => onChange(!checked)}>
      <span className="switch-text">
        <span className="switch-label">{label}</span>
        {description && <span className="switch-desc">{description}</span>}
      </span>
      <span className={`switch ${checked ? "on" : ""}`}><span className="switch-knob" /></span>
    </button>
  );
}