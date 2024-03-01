import { Account, addProfile, AddProfileFailure } from '@domain/model';
import { AccountNotFoundFailure, AccountRepository } from '@domain/port/account.repository';
import { Command } from './command';
import { ResultAsync } from 'neverthrow';

export type AddProfileCommandInput = Readonly<{
  accountId: string;
  profileName: string;
}>;

export type AddProfileCommandFailure = AddProfileFailure | AccountNotFoundFailure;

export type AddProfileCommandResult = ResultAsync<Account, AddProfileCommandFailure>;

export const addProfileCommand = (
  accountRepository: AccountRepository,
): Command<AddProfileCommandInput, AddProfileCommandResult> => {
  return {
    execute: (input: AddProfileCommandInput) => {
      const { accountId, profileName } = input;

      return accountRepository
        .findById(accountId)
        .andThen((account) => addProfile(account, profileName))
        .andThen((updatedAccount) => accountRepository.save(updatedAccount));
    },
  };
};
