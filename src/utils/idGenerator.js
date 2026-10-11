export function generateId(prefix = 'id') {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;
}

export function generateRefCode() {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const nums = '123456789';
  let l = '';
  let n = '';
  for (let i = 0; i < 3; i++) l += letters.charAt(Math.floor(Math.random() * letters.length));
  for (let i = 0; i < 4; i++) n += nums.charAt(Math.floor(Math.random() * nums.length));
  return `REQ-${l}${n}`;
}
