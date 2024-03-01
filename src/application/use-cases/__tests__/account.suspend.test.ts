import { getInMemoryAccountRepository } from './account.repository.in-memory';
import { suspendAccountCommand } from '@use-cases';
import { createTestAccount } from './test-data';

describe('suspend account spec', () => {
  const repository = getInMemoryAccountRepository();

  beforeEach(async () => {
    await repository.clearAll();
  });

  describe('account is suspended', () => {
    it('if account was active', async () => {
      // Arrange
      const account = await createTestAccount(repository, { state: 'active' });

      // Act
      const suspendAccountResult = await suspendAccountCommand(repository).execute({
        accountId: account.id,
      });

      // Assert
      const updatedAccount = suspendAccountResult._unsafeUnwrap();
      expect(updatedAccount.state).toBe('suspended');
    });

    it('if account was inactive', async () => {
      // Arrange
      const account = await createTestAccount(repository, { state: 'inactive' });

      // Act
      const suspendAccountResult = await suspendAccountCommand(repository).execute({
        accountId: account.id,
      });

      // Assert
      const updatedAccount = suspendAccountResult._unsafeUnwrap();
      expect(updatedAccount.state).toBe('suspended');
    });
  });

  describe('account cannot be suspended', () => {
    it('if account was already suspended', async () => {
      // Arrange
      const account = await createTestAccount(repository, { state: 'suspended' });

      // Act
      const suspendAccountResult = await suspendAccountCommand(repository).execute({
        accountId: account.id,
      });

      // Assert
      const failure = suspendAccountResult._unsafeUnwrapErr();
      expect(failure.type).toBe('suspend-already-suspended-account');
    });

    it('if account does not exist', async () => {
      // Arrange
      await createTestAccount(repository);

      // Act
      const suspendAccountResult = await suspendAccountCommand(repository).execute({
        accountId: 'non-existent-account-id',
      });

      // Assert
      const failure = suspendAccountResult._unsafeUnwrapErr();
      expect(failure.type).toBe('account-not-found');
    });
  });
});
