import { Account, deleteProfile, DeleteProfileFailure } from '@domain/model';
import { AccountNotFoundFailure, AccountRepository } from '@domain/port/account.repository';
import { Command } from './command';
import { ResultAsync } from 'neverthrow';

export type DeleteProfileCommandInput = Readonly<{
  profileId: string;
}>;

export type DeleteProfileCommandFailure = DeleteProfileFailure | AccountNotFoundFailure;

export type DeleteProfileCommandResult = ResultAsync<Account, DeleteProfileCommandFailure>;

export const deleteProfileCommand = (
  accountRepository: AccountRepository,
): Command<DeleteProfileCommandInput, DeleteProfileCommandResult> => {
  return {
    execute: (input) => {
      const { profileId } = input;

      return accountRepository
        .findByProfileId(profileId)
        .andThen((account) => deleteProfile(account, profileId))
        .andThen((updatedAccount) => accountRepository.save(updatedAccount));
    },
  };
};
