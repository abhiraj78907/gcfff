export function filterBySubEntry<T extends { subEntryId?: string }>(
  items: T[],
  subEntryId: string
): T[] {
  if (!Array.isArray(items) || !subEntryId) return items ?? [];
  return items.filter((item) => item?.subEntryId === subEntryId);
}


