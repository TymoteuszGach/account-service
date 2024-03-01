import { Account } from './account';
import { err, ok, Result } from 'neverthrow';

export type ActivateAccountFailure = { type: 'activate-already-active-account' };

const activateAlreadyActiveAccount: ActivateAccountFailure = {
  type: 'activate-already-active-account',
};

export const activateAccount = (account: Account): Result<Account, ActivateAccountFailure> => {
  if (account.state === 'active') {
    return err(activateAlreadyActiveAccount);
  }

  return ok({
    ...account,
    state: 'active',
  });
};
