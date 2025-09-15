export default function HeaderText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <p
      className={`text-3xl text-light font-bold my-6 mobile:text-2xl mobile:my-3 ${className}`}
    >
      {text}
    </p>
  );
}
