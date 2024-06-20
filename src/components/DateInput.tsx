import React from 'react';
import { useController, Control } from 'react-hook-form';

interface DateInputProps {
  name: string;
  control: Control<any>;
}

const DateInput: React.FC<DateInputProps> = ({ name, control }) => {
  const {
    field: { onChange, onBlur, value, ref },
    fieldState: { error },
  } = useController({ name, control });
  const formattedDate = value instanceof Date ? value.toISOString().substring(0, 10) : '';
  return (
    <div>
      <input
        type="date"
        onChange={(e) => onChange(new Date(e.target.value))}
        onBlur={onBlur}
        value={formattedDate}
        ref={ref}
        className="border-[2] border-black"
      />
      {error && <p>{error.message}</p>}
    </div>
  );
};

export default DateInput;
