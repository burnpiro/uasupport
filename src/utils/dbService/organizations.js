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

export async function getOrganizations() {
  const col = collection(db, 'organizations');
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

export async function getOrganization(uid) {
  console.log(uid);
  try {
    const querySnapshot = await getDoc(doc(db, 'organizations', uid));
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

export async function removeOrganization(data) {
  await deleteDoc(doc(db, 'organizations', data.id));
  return data.id;
}

export async function addOrganization(data) {
  const ref = await addDoc(collection(db, 'organizations'), data);
  return {
    ...data,
    id: ref.id
  };
}

export async function updateOrganization(data) {
  await setDoc(doc(db, 'organizations', data.id), data);
  return data;
}
