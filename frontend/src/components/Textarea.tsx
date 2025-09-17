import type { ChangeEventHandler } from 'react';

const Textarea = ({
  placeholder,
  value,
  onChange,
}: {
  placeholder: string;
  value: string | undefined;
  onChange: ChangeEventHandler<HTMLTextAreaElement>;
}) => (
  <textarea
    className="h-full w-full resize-none rounded-lg border border-gray-300 bg-gray-50 p-2 shadow-xs"
    placeholder={placeholder}
    onChange={onChange}
    value={value}
  />
);

export default Textarea;
