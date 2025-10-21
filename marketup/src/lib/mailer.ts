import { createPasswordResetEmail, createWelcomeEmail, sendEmail } from './email-templates';

export async function sendPasswordResetEmail(to: string, code: string) {
  const template = createPasswordResetEmail(code);
  return await sendEmail(to, template);
}

export async function sendWelcomeEmail(to: string, userName: string) {
  const template = createWelcomeEmail(userName);
  return await sendEmail(to, template);
}


