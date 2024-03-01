import { Account } from './account';
import { err, ok, Result } from 'neverthrow';

export type DeleteProfileFailure =
  | { type: 'delete-profile-from-inactive-account' }
  | { type: 'delete-non-existent-profile' }
  | { type: 'delete-default-profile' };

const deleteProfileFromInactiveAccount: DeleteProfileFailure = {
  type: 'delete-profile-from-inactive-account',
};

const deleteNonExistentProfile: DeleteProfileFailure = {
  type: 'delete-non-existent-profile',
};

const deleteDefaultProfile: DeleteProfileFailure = {
  type: 'delete-default-profile',
};

export const deleteProfile = (
  account: Account,
  profileId: string,
): Result<Account, DeleteProfileFailure> => {
  if (account.state !== 'active') {
    return err(deleteProfileFromInactiveAccount);
  }

  const profileToDeleteIndex = account.profiles.findIndex((p) => p.id === profileId);
  if (profileToDeleteIndex === -1) {
    return err(deleteNonExistentProfile);
  }

  const profileToDelete = account.profiles[profileToDeleteIndex];
  if (profileToDelete.isDefault) {
    return err(deleteDefaultProfile);
  }

  const updatedProfiles = account.profiles.toSpliced(profileToDeleteIndex, 1);

  return ok({
    ...account,
    profiles: updatedProfiles,
  });
};
