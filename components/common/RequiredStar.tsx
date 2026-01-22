export default function RequiredStar({ className = "" }) {
  return (
    <span className={`text-red-500 ${className}`} title="Required field">
      *
    </span>
  );
}
