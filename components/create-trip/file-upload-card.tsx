'use client';

import { useEffect, useRef, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '../ui/input';
import { FileText } from 'lucide-react';

export function FileUploadCard({
  label = 'Upload PDF Itinerary',
  accept = '.pdf',
  maxSizeMB = 5,
  onSelect,
  onMetaChange,
  initialMeta = null,
  upload,
}: {
  label?: string;
  accept?: string;
  maxSizeMB?: number;
  // called with the selected File (or null when cleared)
  onSelect?: (file: File | null) => void;
  // called with uploaded/meta information { id?, type?, url?, markedForDeletion? }
  onMetaChange?: (
    meta: {
      id?: number;
      type?: string;
      url?: string;
      markedForDeletion?: boolean;
    } | null,
  ) => void;
  // initial metadata to show existing file
  initialMeta?: {
    id?: number;
    type?: string;
    url?: string;
    markedForDeletion?: boolean;
  } | null;
  // optional upload function: (file) => Promise<{ id?, url, type? }>
  upload?: (file: File) => Promise<{ id?: number; url: string; type?: string }>;
  buttonLabel?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [meta, setMeta] = useState(initialMeta);

  useEffect(() => {
    setMeta(initialMeta);
  }, [initialMeta]);

  const maxSizeInBytes = maxSizeMB * 1024 * 1024; // MB limit

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const selectedFile = e.target.files?.[0] ?? null;

    if (selectedFile) {
      if (!selectedFile.type.includes('pdf')) {
        setError('Please select a PDF file.');
        setFile(null);
        return;
      }
      if (selectedFile.size > maxSizeInBytes) {
        setError('File size exceeds 5MB limit.');
        setFile(null);
        return;
      }
      setMeta(null);
      setFile(selectedFile);
      onSelect?.(selectedFile);

      // if upload function provided, upload immediately and report meta
      if (upload) {
        setUploading(true);
        upload(selectedFile)
          .then((res) => {
            const newMeta = {
              id: res.id,
              type: res.type,
              url: res.url,
              markedForDeletion: false,
            };
            setMeta(newMeta);
            onMetaChange?.(newMeta);
          })
          .catch((err) => {
            console.error('Upload failed:', err);
            setError('Upload failed. Please try again.');
            setFile(null);
            onSelect?.(null);
          })
          .finally(() => setUploading(false));
      }
    } else {
      setFile(null);
    }
  };

  const clearFile = () => {
    setFile(null);
    setError(null);
    setMeta(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    onSelect?.(null);
    onMetaChange?.(null);
  };

  const handleDropAreaClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className='relative w-full max-w-full mb-4 overflow-hidden'>
      <Label className='mb-2 block text-sm'>{label}</Label>

      <div
        className='flex flex-col items-center justify-center gap-3
                 rounded-lg border border-dashed border-gray-300
                 bg-gray-50 p-6 cursor-pointer
                 w-full max-w-full overflow-hidden box-border'
      >
        {meta?.url && (
          <a
            className='text-blue-400 hover:text-blue-800'
            href={meta.url}
            target='_black'
          >
            <FileText />
          </a>
        )}

        <div className='text-sm text-gray-600 text-center break-words max-w-full px-2'>
          {file || meta?.url
            ? `Selected: ${file?.name ?? ''}`
            : 'No file selected'}

          {uploading && (
            <div className='text-xs text-gray-500'>Uploading...</div>
          )}
        </div>

        {error && (
          <div className='text-red-500 text-xs text-center'>{error}</div>
        )}

        <div className="flex gap-3 flex-wrap justify-center max-w-full">
          <Input
            ref={inputRef}
            type="file"
            accept={accept}
            className="sr-only"
            onChange={onFileChange}
            aria-label={label}
          />

          {meta?.url || file ? (
            <Button
              type="button"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                clearFile();
              }}
              className="rounded-full"
            >
              Clear PDF
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline"
              className="rounded-full"
              onClick={handleDropAreaClick}
            >
              Choose PDF
            </Button>
          )}
        </div>


        <p className='text-center text-gray-500 text-sm mt-2'>
          Or create itinerary below
        </p>
      </div>
    </div>
  );
}
