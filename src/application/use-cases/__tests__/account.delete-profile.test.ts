import { getInMemoryAccountRepository } from './account.repository.in-memory';
import { addTestProfiles, createTestAccount, suspendTestAccount } from './test-data';
import { deleteProfileCommand } from '@use-cases';

describe('delete profile from account spec', () => {
  const repository = getInMemoryAccountRepository();

  beforeEach(async () => {
    await repository.clearAll();
  });

  describe('a profile is deleted', () => {
    it('if profile is an existing non-default profile', async () => {
      // Arrange
      const profileName = 'test-profile';
      let account = await createTestAccount(repository);
      account = await addTestProfiles(repository, account, [profileName]);
      const profileToDelete = account.profiles.find((profile) => profile.name === profileName);
      expect(profileToDelete).toBeDefined();

      // Act
      const deleteProfileResult = await deleteProfileCommand(repository).execute({
        profileId: profileToDelete!.id,
      });

      // Assert
      const updatedAccount = deleteProfileResult._unsafeUnwrap();
      const isOnlyDefaultProfileLeft =
        updatedAccount.profiles.length === 1 && updatedAccount.profiles[0].isDefault;
      expect(isOnlyDefaultProfileLeft).toBeTruthy();
    });
  });

  describe('a profile cannot be deleted', () => {
    it('if profile is the default profile', async () => {
      // Arrange
      const account = await createTestAccount(repository);
      const defaultProfile = account.profiles.find((profile) => profile.isDefault);
      expect(defaultProfile).toBeDefined();

      // Act
      const deleteProfileResult = await deleteProfileCommand(repository).execute({
        profileId: defaultProfile!.id,
      });

      // Assert
      const failure = deleteProfileResult._unsafeUnwrapErr();
      expect(failure.type).toBe('delete-default-profile');
    });

    it('if profile does not exist', async () => {
      // Arrange
      await createTestAccount(repository);

      // Act
      const deleteProfileResult = await deleteProfileCommand(repository).execute({
        profileId: 'non-existent-profile-id',
      });

      // Assert
      const failure = deleteProfileResult._unsafeUnwrapErr();
      expect(failure.type).toBe('account-not-found');
    });

    it('if account is suspended', async () => {
      // Arrange
      let account = await createTestAccount(repository);
      account = await addTestProfiles(repository, account, ['test-profile']);
      account = await suspendTestAccount(repository, account.id);

      const profileToDelete = account.profiles.find((profile) => !profile.isDefault);
      expect(profileToDelete).toBeDefined();

      // Act
      const deleteProfileResult = await deleteProfileCommand(repository).execute({
        profileId: profileToDelete!.id,
      });

      // Assert
      const failure = deleteProfileResult._unsafeUnwrapErr();
      expect(failure.type).toBe('delete-profile-from-inactive-account');
    });
  });
});
