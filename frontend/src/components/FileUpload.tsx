import type { ChangeEventHandler } from 'react';

const FileUpload = ({
  id,
  file,
  accept,
  onChange,
}: {
  id: string;
  file: File | null;
  accept: string | undefined;
  onChange: ChangeEventHandler<HTMLInputElement>;
}) => {
  const maxFileDisplayNameLength = 30;
  return (
    <label
      id={id}
      htmlFor={`${id}-input`}
      className="box-border flex h-full w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-5 shadow-sm"
    >
      <i className="fa-solid fa-cloud-arrow-up pb-5 text-6xl text-slate-700" />

      <p className="text-sm text-gray-700">
        Clique aqui ou arraste o arquivo com o conteúdo do e-mail
      </p>
      <p className="pb-2 text-xs text-gray-600">PDF ou TXT</p>

      {file && (
        <p className="text-xs text-gray-600">
          {file.name.slice(0, maxFileDisplayNameLength) +
            (file.name.length >= maxFileDisplayNameLength ? '...' : '')}
        </p>
      )}
      <input
        hidden
        type="file"
        id={`${id}-input`}
        accept={accept}
        onChange={onChange}
      />
    </label>
  );
};

export default FileUpload;
