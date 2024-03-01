import { Account, activateAccount, ActivateAccountFailure } from '@domain/model';
import { AccountNotFoundFailure, AccountRepository } from '@domain/port/account.repository';
import { ResultAsync } from 'neverthrow';
import { Command } from './command';

export type ActivateAccountCommandInput = {
  accountId: string;
};

export type ActivateAccountCommandFailure = AccountNotFoundFailure | ActivateAccountFailure;

export type ActivateAccountCommandResult = ResultAsync<Account, ActivateAccountCommandFailure>;

export const activateAccountCommand = (
  accountRepository: AccountRepository,
): Command<ActivateAccountCommandInput, ActivateAccountCommandResult> => {
  return {
    execute: (input) => {
      const { accountId } = input;

      return accountRepository
        .findById(accountId)
        .andThen((account) => activateAccount(account))
        .andThen((updatedAccount) => accountRepository.save(updatedAccount));
    },
  };
};
