import { useState, useMemo, useCallback } from 'react';

export interface Document {
  id: number | null;
  type: string | null;
  url: string | null;
  file: File | null;
  markedForDeletion: boolean;
}

interface UseDocumentsManagerReturn {
  documents: Document[];
  availableIndexes: number[];
  error: string | null;
  handleAddFiles: (files: FileList | File[]) => void;
  handleMarkForDeletion: (id: number | null, idx: number) => void;
  resetError: () => void;
  resetDocuments: () => void;
  setDocuments: React.Dispatch<React.SetStateAction<Document[]>>;
}

export const EMPTY_DOCUMENT: Document = {
  id: null,
  type: null,
  url: null,
  file: null,
  markedForDeletion: false,
};

export function useDocumentsManager(
  initialDocuments: Document[] = [],
  maxAllowedDocs: number = 6,
): UseDocumentsManagerReturn {
  // --- Initialization helper ---
  const initializeDocuments = useCallback((): Document[] => {
    const docs = [...initialDocuments];
    if (
      process.env.NODE_ENV === 'development' &&
      initialDocuments.length > maxAllowedDocs
    ) {
      console.warn(
        `[useDocumentsManager] initialDocuments (${initialDocuments.length}) exceed maxAllowedDocs (${maxAllowedDocs}). Truncating.`,
      );
    }
    while (docs.length < maxAllowedDocs) docs.push({ ...EMPTY_DOCUMENT });
    return docs.slice(0, maxAllowedDocs);
  }, [initialDocuments, maxAllowedDocs]);

  const [documents, setDocuments] = useState<Document[]>(initializeDocuments);
  const [error, setError] = useState<string | null>(null);

  // --- Derived: available indexes ---
  const getAvailableIndexes = (docs: Document[]): number[] =>
    docs
      .map((doc, idx) =>
        (!doc.file && (!doc.id || doc.markedForDeletion)) ? idx : null,
      )
      .filter((v): v is number => v !== null);

  const availableIndexes = useMemo(
    () => getAvailableIndexes(documents),
    [documents],
  );

  // --- Utility: revoke blob URLs safely ---
  const revokeIfBlob = (url?: string | null) => {
    if (url && url.startsWith('blob:')) {
      try {
        URL.revokeObjectURL(url);
      } catch {
        /* ignore */
      }
    }
  };

  // --- Error management ---
  const resetError = () => setError(null);

  // --- Reset everything to initial state ---
  const resetDocuments = () => {
    setDocuments(initializeDocuments());
    resetError();
  };

  // --- Mark slot for deletion or clear ---
  const handleMarkForDeletion = (id: number | null, idx: number) => {
    setDocuments((prev) => {
      const updated = [...prev];
      const current = updated[idx];
      if (!current) return prev;

      revokeIfBlob(current.url);

      if (current.id && current.id === id) {
        updated[idx] = {
          ...current,
          markedForDeletion: true,
          file: null,
          url: null,
        };
      } else {
        updated[idx] = { ...EMPTY_DOCUMENT };
      }

      return updated;
    });
  };

  // --- Add files intelligently ---
  const handleAddFiles = (files: FileList | File[]) => {
    resetError();
    const newFiles = Array.from(files);
    if (!newFiles.length) return;

    setDocuments((prevDocs) => {
      const updated = [...prevDocs];
      const replaceIndexes: number[] = [];
      const emptyIndexes: number[] = [];

      updated.forEach((doc, idx) => {
        const isReplaceCandidate = !!doc.id && doc.markedForDeletion && !doc.file;
        const isEmpty = !doc.id && !doc.file;
        if (isReplaceCandidate) replaceIndexes.push(idx);
        else if (isEmpty) emptyIndexes.push(idx);
      });

      const capacity = replaceIndexes.length + emptyIndexes.length;
      if (newFiles.length > capacity) {
        setError(
          `Only ${capacity} slot(s) available. You tried to add ${newFiles.length}. Max allowed: ${maxAllowedDocs}.`,
        );
        return prevDocs;
      }

      const assignFileToIndex = (file: File, idx: number, isReplace: boolean) => {
        const prev = updated[idx];
        revokeIfBlob(prev?.url);

        const blobUrl = URL.createObjectURL(file);
        updated[idx] = {
          ...EMPTY_DOCUMENT,
          id: isReplace ? prev.id : null,
          type: file.type,
          url: blobUrl,
          file,
          // keep markedForDeletion=true for replacements (per backend contract)
          markedForDeletion: isReplace ? true : false,
        };
      };

      let filePtr = 0;

      // Fill replacement slots first
      for (const idx of replaceIndexes) {
        const f = newFiles[filePtr++];
        if (!f) break;
        assignFileToIndex(f, idx, true);
      }

      // Fill empty slots next
      for (const idx of emptyIndexes) {
        const f = newFiles[filePtr++];
        if (!f) break;
        assignFileToIndex(f, idx, false);
      }

      return updated;
    });
  };

  return {
    documents,
    availableIndexes,
    error,
    handleAddFiles,
    handleMarkForDeletion,
    resetError,
    resetDocuments,
    setDocuments,
  };
}
