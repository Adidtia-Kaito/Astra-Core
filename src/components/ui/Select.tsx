import { useId, type SelectHTMLAttributes } from "react";

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
}

export default function Select({ label, hint, id, children, className = "", ...rest }: Props) {
  const auto = useId();
  const selectId = id ?? auto;
  return (
    <div className={`field ${className}`}>
      {label && <label className="field-label" htmlFor={selectId}>{label}</label>}
      <select id={selectId} className="select" {...rest}>{children}</select>
      {hint && <span className="field-hint">{hint}</span>}
    </div>
  );
}