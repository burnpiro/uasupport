import { functions } from '../../firebase';
import { httpsCallable } from 'firebase/functions';

export async function addVolunteer(organizationId, manager) {
  try {
    const addFunc = httpsCallable(functions, 'members-volunteers-addVolunteerToOrg');

    const res = await addFunc({ organizationId: organizationId, member: manager });

    return res;
  } catch (e) {
    return e;
  }
}


export async function removeVolunteer(organizationId, manager) {
  try {
    const removeFunc = httpsCallable(functions, 'members-volunteers-removeVolunteerFromOrg');

    const res = await removeFunc({ organizationId: organizationId, member: manager });

    return res;
  } catch (e) {
    return e;
  }
}
