// utils/documentNormalizer.ts
export function normalizeDocuments(docs: any[]): any[] {
  if (!Array.isArray(docs)) return [];
  return docs.map((d) => ({
    id: d.id ?? null,
    url: d.url ?? d.fileUrl ?? d.path ?? d.s3Url ?? null,
    type: d.type ?? "IMAGE",
    file: null,
    markedForDeletion: !!d.markedForDeletion,
  }));
}
