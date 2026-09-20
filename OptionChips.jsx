import { cn } from '../utils/cn.js';

/** Single-select pill group used across the generators. */
export default function OptionChips({ label, options, value, onChange, name }) {
  return (
    <fieldset>
      {label && <legend className="mb-2 text-[14px] font-semibold text-muted">{label}</legend>}
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const optionValue = typeof option === 'string' ? option : option.value;
          const optionLabel = typeof option === 'string' ? option : option.label;
          const active = optionValue === value;

          return (
            <button
              key={optionValue}
              type="button"
              name={name}
              aria-pressed={active}
              onClick={() => onChange(optionValue)}
              className={cn('chip', active ? 'chip-active' : 'text-muted hover:text-ink')}
            >
              {optionLabel}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
