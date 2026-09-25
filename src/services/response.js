export function toArray(value) {
  if (Array.isArray(value)) return value;
  if (!value || typeof value !== 'object') return [];

  for (const key of ['data', 'items', 'content', 'results']) {
    if (Array.isArray(value[key])) return value[key];
  }

  return [];
}