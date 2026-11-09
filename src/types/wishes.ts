export interface WishItem {
  id: string;
  senderName: string;
  className: string;
  message: string;
  createdAt: string;
}

export interface CreateWishInput {
  senderName: string;
  className: string;
  message: string;
}

export type WishesModalMode = 'submit' | 'view';

export interface WishValidationResult {
  valid: boolean;
  cleaned: CreateWishInput;
  fieldErrors: Partial<Record<keyof CreateWishInput, string>>;
  errorMessage?: string;
}

