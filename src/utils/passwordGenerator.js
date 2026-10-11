/**
 * Generates an easy-to-read simulated temporary password
 * Format: FSL-XXXX-YYYY where X is uppercase and Y is numbers
 */
export function generateTemporaryPassword() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const nums = '23456789';
  
  let p1 = '';
  for (let i = 0; i < 4; i++) {
    p1 += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  let p2 = '';
  for (let i = 0; i < 4; i++) {
    p2 += nums.charAt(Math.floor(Math.random() * nums.length));
  }
  
  return `TMP-${p1}-${p2}`;
}
