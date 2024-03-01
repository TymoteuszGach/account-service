import {
  accountAlreadyExists,
  accountNotFound,
  AccountRepository,
} from '@domain/port/account.repository';
import { Account } from '@domain/model';
import { errAsync, okAsync } from 'neverthrow';

export type InMemoryAccountRepository = AccountRepository & {
  clearAll: () => Promise<void>;
};

export const getInMemoryAccountRepository = (): InMemoryAccountRepository => {
  const accounts: Map<string, Account> = new Map<string, Account>();
  return {
    saveNew: (account: Account) => {
      if (accounts.get(account.id)) {
        return errAsync(accountAlreadyExists);
      }
      accounts.set(account.id, account);
      return okAsync(account);
    },
    remove: (id: string) => {
      const account = accounts.get(id);
      if (!account) {
        return errAsync(accountNotFound);
      }
      accounts.delete(id);
      return okAsync(account);
    },
    findById: (id: string) => {
      const account = accounts.get(id);
      if (!account) {
        return errAsync(accountNotFound);
      }
      return okAsync(account);
    },
    findByProfileId: (profileId: string) => {
      const account = Array.from(accounts.values()).find((account) =>
        account.profiles.some((profile) => profile.id === profileId),
      );
      if (!account) {
        return errAsync(accountNotFound);
      }
      return okAsync(account);
    },
    save: (account: Account) => {
      const existingAccount = accounts.get(account.id);
      if (!existingAccount) {
        return errAsync(accountNotFound);
      }
      accounts.set(account.id, account);
      return okAsync(account);
    },
    clearAll: async () => {
      accounts.clear();
    },
  };
};
