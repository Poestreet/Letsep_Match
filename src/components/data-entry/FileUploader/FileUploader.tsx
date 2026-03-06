import React, { useRef, useState } from 'react';
import '../../../tokens.css';

interface FileUploaderProps {
  label: string;
  onChange: (files: FileList | null) => void;
  accept?: string;
  multiple?: boolean;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  label,
  onChange,
  accept,
  multiple = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [fileNames, setFileNames] = useState<string[]>([]);

  const handleFiles = (files: FileList | null) => {
    if (files) {
      setFileNames(Array.from(files).map((f) => f.name));
      onChange(files);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacings-base-1)',
        fontFamily: 'var(--typography-fontfamily2)',
      }}
    >
      <label
        style={{
          fontSize: '13px',
          fontWeight: 600,
          color: 'var(--foreground-default)',
        }}
      >
        {label}
      </label>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'var(--spacings-base-2)',
          padding: 'var(--spacings-base-8) var(--spacings-base-4)',
          borderRadius: 'var(--radius-lg)',
          border: dragging
            ? '2px dashed var(--border-accent)'
            : '2px dashed var(--border-default)',
          background: dragging ? 'var(--background-info)' : 'var(--background-subtle)',
          cursor: 'pointer',
          transition: 'border-color 0.15s, background 0.15s',
          textAlign: 'center',
        }}
      >
        <span style={{ fontSize: '32px' }}>📁</span>
        <div>
          <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--foreground-default)' }}>
            Drag & drop files here
          </div>
          <div style={{ fontSize: '12px', color: 'var(--carbon-fiber-50)', marginTop: '4px' }}>
            or click to browse
          </div>
        </div>
        {fileNames.length > 0 && (
          <div
            style={{
              fontSize: '12px',
              color: 'var(--foreground-accent)',
              fontWeight: 600,
              marginTop: 'var(--spacings-base-1)',
            }}
          >
            {fileNames.join(', ')}
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={(e) => handleFiles(e.target.files)}
        style={{ display: 'none' }}
      />
    </div>
  );
};
