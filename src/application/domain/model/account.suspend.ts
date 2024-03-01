import { Account } from './account';
import { err, ok, Result } from 'neverthrow';

export type SuspendAccountFailure = { type: 'suspend-already-suspended-account' };

const suspendAlreadySuspendedAccount: SuspendAccountFailure = {
  type: 'suspend-already-suspended-account',
};

export const suspendAccount = (account: Account): Result<Account, SuspendAccountFailure> => {
  if (account.state === 'suspended') {
    return err(suspendAlreadySuspendedAccount);
  }

  return ok({
    ...account,
    state: 'suspended',
  });
};
