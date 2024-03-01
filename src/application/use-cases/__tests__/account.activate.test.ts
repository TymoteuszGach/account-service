import { createTestAccount } from './test-data';
import { getInMemoryAccountRepository } from './account.repository.in-memory';
import { activateAccountCommand } from '@use-cases';

describe('activate account spec', () => {
  const repository = getInMemoryAccountRepository();

  beforeEach(async () => {
    await repository.clearAll();
  });

  describe('account is activated', () => {
    it('if account was inactive', async () => {
      // Arrange
      const account = await createTestAccount(repository, { state: 'inactive' });

      // Act
      const activateAccountResult = await activateAccountCommand(repository).execute({
        accountId: account.id,
      });

      // Assert
      const updatedAccount = activateAccountResult._unsafeUnwrap();
      expect(updatedAccount.state).toBe('active');
    });

    it('if account was suspended', async () => {
      // Arrange
      const account = await createTestAccount(repository, { state: 'suspended' });

      // Act
      const activateAccountResult = await activateAccountCommand(repository).execute({
        accountId: account.id,
      });

      // Assert
      const updatedAccount = activateAccountResult._unsafeUnwrap();
      expect(updatedAccount.state).toBe('active');
    });
  });

  describe('account cannot be activated', () => {
    it('if account was already active', async () => {
      // Arrange
      const account = await createTestAccount(repository, { state: 'active' });

      // Act
      const activateAccountResult = await activateAccountCommand(repository).execute({
        accountId: account.id,
      });

      // Assert
      const failure = activateAccountResult._unsafeUnwrapErr();
      expect(failure.type).toBe('activate-already-active-account');
    });

    it('if account does not exist', async () => {
      // Arrange
      await createTestAccount(repository);

      // Act
      const activateAccountResult = await activateAccountCommand(repository).execute({
        accountId: 'non-existent-account-id',
      });

      // Assert
      const failure = activateAccountResult._unsafeUnwrapErr();
      expect(failure.type).toBe('account-not-found');
    });
  });
});
