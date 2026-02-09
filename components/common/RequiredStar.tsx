export default function RequiredStar({ className = "" }) {
  return (
    <span className={`text-black-500 ${className}`} title="Required field">
      *
    </span>
  );
}
