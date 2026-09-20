export default function SectionHeading({ title, subtitle, align = 'left', children }) {
  return (
    <div className={align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      <h2 className="text-3xl sm:text-[34px]">{title}</h2>
      {subtitle && <p className="mt-3 text-[17px] text-muted">{subtitle}</p>}
      {children}
    </div>
  );
}
