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

export async function getManagers() {
  const col = collection(db, 'managers');
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

export async function getManager(uid) {
  console.log(uid);
  try {
    const querySnapshot = await getDoc(doc(db, 'managers', uid));
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

export async function getManagersFromOrg(orgUid) {
  try {
    const cols = collection(db, 'managers');
    const q = query(cols, where(`organization`, '==', orgUid))
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

export async function updateManager(data) {
  await setDoc(doc(db, 'managers', data.id), data);
  return data;
}
