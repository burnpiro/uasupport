import { functions } from '../../firebase';
import { httpsCallable } from 'firebase/functions';

export async function addManager(organizationId, manager) {
  try {
    const addFunc = httpsCallable(functions, 'members-managers-addManagerToOrg');

    const res = await addFunc({ organizationId: organizationId, member: manager });

    return res;
  } catch (e) {
    return e;
  }
}

export async function removeManager(organizationId, manager) {
  try {
    const removeFunc = httpsCallable(functions, 'members-managers-removeManagerFromOrg');

    const res = await removeFunc({ organizationId: organizationId, member: manager });

    return res;
  } catch (e) {
    return e;
  }
}
