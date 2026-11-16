export default function LoadingState({ label = "Memuat…" }: { label?: string }) {
  return (
    <div className="state-block">
      <span className="spinner spinner-lg" />
      <p>{label}</p>
    </div>
  );
}