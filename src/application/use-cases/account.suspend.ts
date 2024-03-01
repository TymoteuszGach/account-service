import { Account, suspendAccount, SuspendAccountFailure } from '@domain/model';
import { AccountNotFoundFailure, AccountRepository } from '@domain/port/account.repository';
import { Command } from './command';
import { ResultAsync } from 'neverthrow';

export type SuspendAccountCommandInput = Readonly<{
  accountId: string;
}>;

export type SuspendAccountCommandFailure = AccountNotFoundFailure | SuspendAccountFailure;

export type SuspendAccountCommandResult = ResultAsync<Account, SuspendAccountCommandFailure>;

export const suspendAccountCommand = (
  accountRepository: AccountRepository,
): Command<SuspendAccountCommandInput, SuspendAccountCommandResult> => {
  return {
    execute: (input) => {
      const { accountId } = input;

      return accountRepository
        .findById(accountId)
        .andThen((account) => suspendAccount(account))
        .andThen((updatedAccount) => accountRepository.save(updatedAccount));
    },
  };
};
