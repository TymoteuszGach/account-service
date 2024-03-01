import { Account } from '@domain/model';
import { ResultAsync } from 'neverthrow';

export type AccountRepository = {
  findById: (id: string) => ResultAsync<Account, AccountNotFoundFailure>;
  findByProfileId: (profileId: string) => ResultAsync<Account, AccountNotFoundFailure>;
  saveNew: (account: Account) => ResultAsync<Account, AccountAlreadyExistsFailure>;
  save: (account: Account) => ResultAsync<Account, AccountNotFoundFailure>;
  remove: (id: string) => ResultAsync<Account, AccountNotFoundFailure>;
};

export type AccountNotFoundFailure = { type: 'account-not-found' };

export type AccountAlreadyExistsFailure = { type: 'account-already-exists' };

export const accountNotFound: AccountNotFoundFailure = {
  type: 'account-not-found',
};

export const accountAlreadyExists: AccountAlreadyExistsFailure = {
  type: 'account-already-exists',
};
