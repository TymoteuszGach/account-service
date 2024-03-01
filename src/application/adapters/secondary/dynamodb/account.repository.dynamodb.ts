import {
  accountAlreadyExists,
  accountNotFound,
  AccountRepository,
} from '@domain/port/account.repository';
import { errAsync } from 'neverthrow';

export const getDynamoDbAccountRepository = (): AccountRepository => {
  return {
    findById: () => {
      return errAsync(accountNotFound);
    },
    findByProfileId: () => {
      return errAsync(accountNotFound);
    },
    saveNew: () => {
      return errAsync(accountAlreadyExists);
    },
    save: () => {
      return errAsync(accountNotFound);
    },
    remove: () => {
      return errAsync(accountNotFound);
    },
  };
};
