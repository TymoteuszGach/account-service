import { getInMemoryAccountRepository } from './account.repository.in-memory';
import { createTestAccount, suspendTestAccount } from './test-data';
import { changeEmailCommand } from '@use-cases';

describe('change account email address spec', () => {
  const repository = getInMemoryAccountRepository();

  beforeEach(async () => {
    await repository.clearAll();
  });

  describe('an account email address is changed', () => {
    it('if it is a valid email address', async () => {
      // Arrange
      const account = await createTestAccount(repository);
      const newEmail = 'new@example.com';

      // Act
      const changeEmailResult = await changeEmailCommand(repository).execute({
        accountId: account.id,
        newEmail,
      });

      // Assert
      const updatedAccount = changeEmailResult._unsafeUnwrap();
      expect(updatedAccount.email).toBe(newEmail);
    });
  });

  describe('an account email address cannot be changed', () => {
    it('if email address does not pass the validation', async () => {
      // Arrange
      const account = await createTestAccount(repository);
      const newEmail = 'invalid-email@test.1234';

      // Act
      const changeEmailResult = await changeEmailCommand(repository).execute({
        accountId: account.id,
        newEmail,
      });

      // Assert
      const failure = changeEmailResult._unsafeUnwrapErr();
      expect(failure.type).toBe('email-not-valid');
    });

    it('if account is not in active state', async () => {
      // Arrange
      const account = await createTestAccount(repository);
      await suspendTestAccount(repository, account.id);
      const newEmail = 'new@example.com';

      // Act
      const changeEmailResult = await changeEmailCommand(repository).execute({
        accountId: account.id,
        newEmail,
      });

      // Assert
      const failure = changeEmailResult._unsafeUnwrapErr();
      expect(failure.type).toBe('change-email-for-inactive-account');
    });

    it('if account does not exist', async () => {
      // Arrange
      await createTestAccount(repository);
      const newEmail = 'new@example.com';

      // Act
      const changeEmailResult = await changeEmailCommand(repository).execute({
        accountId: 'non-existent-account-id',
        newEmail,
      });

      // Assert
      const failure = changeEmailResult._unsafeUnwrapErr();
      expect(failure.type).toBe('account-not-found');
    });
  });
});
