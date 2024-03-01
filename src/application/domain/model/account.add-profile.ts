import { Account } from './account';
import { newProfile } from './profile.new';
import { err, ok, Result } from 'neverthrow';

export type AddProfileFailure =
  | { type: 'add-profile-to-inactive-account' }
  | { type: 'too-many-profiles' }
  | { type: 'profile-name-already-exists' };

const addProfileToInactiveAccount: AddProfileFailure = { type: 'add-profile-to-inactive-account' };
const tooManyProfiles: AddProfileFailure = { type: 'too-many-profiles' };
const profileNameAlreadyExists: AddProfileFailure = { type: 'profile-name-already-exists' };

export const addProfile = (
  account: Account,
  profileName: string,
): Result<Account, AddProfileFailure> => {
  if (account.state !== 'active') {
    return err(addProfileToInactiveAccount);
  }

  if (account.profiles.length === 5) {
    return err(tooManyProfiles);
  }

  if (account.profiles.find((profile) => profile.name === profileName)) {
    return err(profileNameAlreadyExists);
  }

  return ok({
    ...account,
    profiles: [...account.profiles, newProfile(profileName)],
  });
};
