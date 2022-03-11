import { functions } from '../../firebase';
import { httpsCallable } from 'firebase/functions';

export async function addAdminClaim(email) {
  try {
    const addAdminFunc = httpsCallable(functions, 'roles-addAdminRole-addAdminRole');

    const res = await addAdminFunc({ email: email });

    return res;
  } catch (e) {
    return e;
  }
}
