import { CreateWishInput, WishValidationResult } from '../types/wishes';

export function sanitizePlainText(value: unknown): string {
  if (typeof value !== 'string') return '';
  return value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .trim();
}

export function validateWishInput(input: Partial<CreateWishInput> | null | undefined): WishValidationResult {
  const senderName = sanitizePlainText(input?.senderName);
  const className = sanitizePlainText(input?.className);
  const message = sanitizePlainText(input?.message);

  const fieldErrors: Partial<Record<keyof CreateWishInput, string>> = {};

  if (!senderName) {
    fieldErrors.senderName = 'Vui lòng nhập tên người gửi.';
  } else if (senderName.length < 2) {
    fieldErrors.senderName = 'Tên người gửi cần có ít nhất 2 ký tự.';
  } else if (senderName.length > 60) {
    fieldErrors.senderName = 'Tên người gửi không vượt quá 60 ký tự.';
  }

  if (!className) {
    fieldErrors.className = 'Vui lòng nhập tên lớp (ví dụ: 9A3).';
  } else if (className.length < 2) {
    fieldErrors.className = 'Tên lớp cần có ít nhất 2 ký tự (ví dụ: 9A3).';
  } else if (className.length > 20) {
    fieldErrors.className = 'Tên lớp không vượt quá 20 ký tự.';
  }

  if (!message) {
    fieldErrors.message = 'Vui lòng nhập nội dung lời chúc 20/11.';
  } else if (message.length < 10) {
    fieldErrors.message = 'Nội dung lời chúc cần có ít nhất 10 ký tự.';
  } else if (message.length > 600) {
    fieldErrors.message = 'Nội dung lời chúc không vượt quá 600 ký tự.';
  }

  const errorKeys = Object.keys(fieldErrors) as Array<keyof CreateWishInput>;
  const valid = errorKeys.length === 0;

  return {
    valid,
    cleaned: {
      senderName,
      className,
      message,
    },
    fieldErrors,
    errorMessage: valid ? undefined : fieldErrors[errorKeys[0]],
  };
}

