import * as bcrypt from 'bcrypt';

export async function hash(passwordToHash: string) {
  return await bcrypt.hash(passwordToHash, 5);
}

export async function compare(plainTextPass: string, hashedPass: string) {
  if (!(plainTextPass && hashedPass)) return null;

  return await bcrypt.compare(plainTextPass, hashedPass);
}
