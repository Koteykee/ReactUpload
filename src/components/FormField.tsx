import type { InputHTMLAttributes } from "react";

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label?: string;
  type?: string;
  error?: string;
  className?: string;
}

export const FormField = ({
  id,
  label,
  type = "text",
  error,
  className,
  ...rest
}: FormFieldProps) => {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="text-[20px]">
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        className={`text-[18px] p-1 bg-white border min-w-[300px] ${
          error ? "border-[#E62828] border-2" : ""
        }`}
        {...rest}
      />
      {error && (
        <div className="text-[18px] text-[#E62828] first-letter:uppercase">
          {error}
        </div>
      )}
    </div>
  );
};
