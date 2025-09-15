export default function SubHeaderText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return <p className={`text-xl font-bold ${className}`}>{text}</p>;
}
