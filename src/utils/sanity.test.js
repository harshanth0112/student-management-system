import { describe, it, expect } from 'vitest';
import { generateTemporaryPassword } from './passwordGenerator';
import { emailSchema } from './validators';

describe('Phase 1 Utility Sanity Tests', () => {
  it('generates temporary password matching TMP-XXXX-YYYY format', () => {
    const pwd = generateTemporaryPassword();
    expect(pwd).toMatch(/^TMP-[A-Z]{4}-\d{4}$/);
  });

  it('validates strictly @gmail.com emails', () => {
    const valid = emailSchema.safeParse('alex.turner@gmail.com');
    expect(valid.success).toBe(true);

    const invalid = emailSchema.safeParse('alex.turner@yahoo.com');
    expect(invalid.success).toBe(false);
  });
});
