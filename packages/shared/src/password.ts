// Password rules shared by the signup form (live hints) and the API (enforcement).

export const PASSWORD_MIN = 8;
/** bcrypt only uses the first 72 bytes, so longer input would be silently truncated. */
export const PASSWORD_MAX_BYTES = 72;

const COMMON = new Set([
  'password', 'password1', 'password123', '12345678', '123456789', '1234567890', 'qwertyui',
  'qwerty123', 'iloveyou', 'abc12345', '11111111', '00000000', 'admin123', 'welcome1', 'letmein1',
]);

export type PasswordIssue = 'TOO_SHORT' | 'TOO_LONG' | 'COMMON' | 'IS_PHONE' | 'ALL_SAME';

export function checkPassword(password: string, phoneDigits?: string): PasswordIssue[] {
  const issues: PasswordIssue[] = [];
  if (password.length < PASSWORD_MIN) issues.push('TOO_SHORT');
  if (new TextEncoder().encode(password).length > PASSWORD_MAX_BYTES) issues.push('TOO_LONG');
  if (COMMON.has(password.toLowerCase())) issues.push('COMMON');
  if (/^(.)\1+$/.test(password)) issues.push('ALL_SAME');
  const digits = phoneDigits?.replace(/\D/g, '');
  const pw = password.replace(/\D/g, '').replace(/^0+/, '');
  if (digits && pw.length >= 6 && digits.endsWith(pw)) issues.push('IS_PHONE');
  return issues;
}

export function passwordIssueMessage(issue: PasswordIssue): string {
  switch (issue) {
    case 'TOO_SHORT': return `Use at least ${PASSWORD_MIN} characters.`;
    case 'TOO_LONG': return 'That password is too long.';
    case 'COMMON': return 'That password is too easy to guess. Try something less common.';
    case 'ALL_SAME': return 'Use a mix of different characters.';
    case 'IS_PHONE': return 'Your password should not be your phone number.';
  }
}
