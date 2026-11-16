import Button from "./Button";
import { IconAlert, IconRefresh } from "../icons";

interface Props {
  title: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
  retrying?: boolean;
}

export default function ErrorState({ title, message, onRetry, retryLabel = "Coba lagi", retrying = false }: Props) {
  return (
    <div className="state-block">
      <span className="state-icon"><IconAlert size={26} /></span>
      <strong>{title}</strong>
      <p className="muted">{message}</p>
      {onRetry && (
        <Button size="sm" onClick={onRetry} loading={retrying} icon={<IconRefresh size={14} />}>{retryLabel}</Button>
      )}
    </div>
  );
}