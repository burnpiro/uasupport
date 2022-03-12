import {
  collection,
  getDocs,
  addDoc,
  setDoc,
  doc,
  deleteDoc,
  getDoc,
  query,
  where,
  loadBundle,
  namedQuery,
  getDocsFromCache
} from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { db, storage } from '../../firebase';

export async function getVolunteers() {
  const col = collection(db, 'volunteers');
  console.log(col);
  try {
    const querySnapshot = await getDocs(col);
    return querySnapshot.docs
      .map((doc) => ({
        ...doc.data(),
        id: doc.id
      }))
      .map((doc) => ({ ...doc, createdAt: doc.createdAt.toDate() }));
  } catch (e) {
    return e;
  }
}

export async function getVolunteer(uid) {
  console.log(uid);
  try {
    const querySnapshot = await getDoc(doc(db, 'volunteers', uid));
    if (querySnapshot.exists()) {
      return {
        ...querySnapshot.data(),
        id: querySnapshot.id
      };
    }
    return null;
  } catch (e) {
    return e;
  }
}

export async function getVolunteersFromOrg(orgUid) {
  try {
    const cols = collection(db, 'volunteers');
    const q = query(cols, where(`orgs.${orgUid}`, '==', 'volunteer'))
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs
      .map((doc) => ({
        ...doc.data(),
        id: doc.id
      }))
      .map((doc) => ({ ...doc, createdAt: doc.createdAt.toDate() }));
  } catch (e) {
    return e;
  }
}

export async function removeVolunteer(data) {
  await deleteDoc(doc(db, 'volunteers', data.id));
  return data.id;
}

export async function addVolunteer(data) {
  const ref = await addDoc(collection(db, 'volunteers'), data);
  return {
    ...data,
    id: ref.id
  };
}

export async function updateOrganization(data) {
  await setDoc(doc(db, 'organizations', data.id), data);
  return data;
}
