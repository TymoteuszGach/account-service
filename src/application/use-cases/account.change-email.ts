import { AccountNotFoundFailure, AccountRepository } from '@domain/port/account.repository';
import { Account, changeEmail, ChangeEmailFailure } from '@domain/model';
import { Command } from './command';
import { ResultAsync } from 'neverthrow';

export type ChangeEmailCommandInput = Readonly<{
  accountId: string;
  newEmail: string;
}>;

export type ChangeEmailCommandFailure = AccountNotFoundFailure | ChangeEmailFailure;

export type ChangeEmailCommandResult = ResultAsync<Account, ChangeEmailCommandFailure>;

export const changeEmailCommand = (
  accountRepository: AccountRepository,
): Command<ChangeEmailCommandInput, ChangeEmailCommandResult> => {
  return {
    execute: (input) => {
      const { accountId, newEmail } = input;

      return accountRepository
        .findById(accountId)
        .andThen((account) => changeEmail(account, newEmail))
        .andThen((updatedAccount) => accountRepository.save(updatedAccount));
    },
  };
};
