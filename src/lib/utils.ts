// Simple order number format: FF-YYYYMMDD-XXXX
// FF = Fungal Flux
// YYYYMMDD = Date
// XXXX = Random 4 digits

export function generateOrderNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
  
  return `FF-${year}${month}${day}-${random}`;
}