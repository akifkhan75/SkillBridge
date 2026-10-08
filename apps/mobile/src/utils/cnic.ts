/** Pakistan CNIC as the card prints it: 12345-1234567-1 (13 digits). */
export function formatCnic(input: string): string {
  const d = input.replace(/\D/g, '').slice(0, 13);
  if (d.length <= 5) return d;
  if (d.length <= 12) return `${d.slice(0, 5)}-${d.slice(5)}`;
  return `${d.slice(0, 5)}-${d.slice(5, 12)}-${d.slice(12)}`;
}
export const isCompleteCnic = (v: string) => /^\d{5}-\d{7}-\d$/.test(v);
