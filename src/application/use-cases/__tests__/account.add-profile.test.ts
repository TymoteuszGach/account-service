import { getInMemoryAccountRepository } from './account.repository.in-memory';
import { addProfileCommand } from '@use-cases';
import { addTestProfiles, createTestAccount } from './test-data';

describe('add profile to account spec', () => {
  const repository = getInMemoryAccountRepository();

  beforeEach(async () => {
    await repository.clearAll();
  });

  describe('a profile is added', () => {
    it('if profile name is not `default`', async () => {
      // Arrange
      const account = await createTestAccount(repository);
      const profileName = 'test-profile';

      // Act
      const addProfileResult = await addProfileCommand(repository).execute({
        accountId: account.id,
        profileName,
      });

      // Assert
      const updatedAccount = addProfileResult._unsafeUnwrap();
      const addedProfile = updatedAccount?.profiles.find((profile) => profile.name === profileName);
      expect(addedProfile).toBeDefined();
    });
  });

  describe('a profile cannot be added', () => {
    it('if profile name is `default`', async () => {
      // Arrange
      const account = await createTestAccount(repository);
      const profileName = 'default';

      // Act
      const addProfileResult = await addProfileCommand(repository).execute({
        accountId: account.id,
        profileName,
      });

      // Assert
      const failure = addProfileResult._unsafeUnwrapErr();
      expect(failure.type).toBe('profile-name-already-exists');
    });

    it('if profile with the same name already exists', async () => {
      // Arrange
      const profileName = 'test-profile';
      const account = await createTestAccount(repository);
      await addTestProfiles(repository, account, [profileName]);

      // Act
      const addProfileResult = await addProfileCommand(repository).execute({
        accountId: account.id,
        profileName,
      });

      // Assert
      const failure = addProfileResult._unsafeUnwrapErr();
      expect(failure.type).toBe('profile-name-already-exists');
    });

    it('if there are more than 5 profiles in the account', async () => {
      // Arrange
      const account = await createTestAccount(repository);
      await addTestProfiles(repository, account, [
        'profile-1',
        'profile-2',
        'profile-3',
        'profile-4',
      ]);

      // Act
      const addProfileResult = await addProfileCommand(repository).execute({
        accountId: account.id,
        profileName: 'profile-5',
      });

      // Assert
      const failure = addProfileResult._unsafeUnwrapErr();
      expect(failure.type).toBe('too-many-profiles');
    });

    it('if account is not active', async () => {
      // Arrange
      const account = await createTestAccount(repository, { state: 'inactive' });

      // Act
      const addProfileResult = await addProfileCommand(repository).execute({
        accountId: account.id,
        profileName: 'test-profile',
      });

      // Assert
      const failure = addProfileResult._unsafeUnwrapErr();
      expect(failure.type).toBe('add-profile-to-inactive-account');
    });

    it('if account does not exist', async () => {
      // Arrange
      await createTestAccount(repository);

      // Act
      const addProfileResult = await addProfileCommand(repository).execute({
        accountId: 'non-existent-account-id',
        profileName: 'test-profile',
      });

      // Assert
      const failure = addProfileResult._unsafeUnwrapErr();
      expect(failure.type).toBe('account-not-found');
    });
  });
});
