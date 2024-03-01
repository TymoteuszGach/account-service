import { Account } from './account';
import { validateEmail } from '@domain/model/email';
import { err, ok, Result } from 'neverthrow';

export type ChangeEmailFailure =
  | { type: 'change-email-for-inactive-account' }
  | { type: 'email-not-valid' };

const changeEmailForInactiveAccount: ChangeEmailFailure = {
  type: 'change-email-for-inactive-account',
};

const emailNotValid: ChangeEmailFailure = {
  type: 'email-not-valid',
};

export const changeEmail = (
  account: Account,
  newEmail: string,
): Result<Account, ChangeEmailFailure> => {
  if (account.state !== 'active') {
    return err(changeEmailForInactiveAccount);
  }

  if (!validateEmail(newEmail)) {
    return err(emailNotValid);
  }

  return ok({
    ...account,
    email: newEmail,
  });
};
