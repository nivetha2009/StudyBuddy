export default function PageHeader({ title, subtitle, children }) {
  return (
    <div className="border-b ruled">
      <div className="container-page flex flex-col gap-5 py-9 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-[34px] sm:text-[40px]">{title}</h1>
          {subtitle && <p className="mt-2 max-w-2xl text-[17px] text-muted">{subtitle}</p>}
        </div>
        {children && <div className="flex flex-wrap gap-2">{children}</div>}
      </div>
    </div>
  );
}
