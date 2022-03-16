const {
  loadBundle,
  namedQuery,
  getDocsFromCache,
  getDocs,
  collection,
  addDoc,
  setDoc,
  query,
  where,
  doc,
  deleteDoc
} = require('firebase/firestore');
import { ref, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { db, storage } from '../../firebase';
import { sample } from 'lodash';

export async function getMyGroups(uid) {
  const cols = collection(db, 'groups');
  const q = query(cols, where(`roles.${uid}`, '==', 'owner'))
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs
    .map((doc) => ({
      ...doc.data(),
      id: doc.id
    }))
    .map((doc) => ({ ...doc })) || []
}

export async function getGroups() {
  try {
    const pathReference = ref(storage, 'groups-data');
    const url = await getDownloadURL(pathReference);
    const bundleData = await fetch(url, {
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors' // no-cors, *cors, same-origin
    });
    // // Load the bundle contents into the Firestore SDK
    await loadBundle(db, bundleData.body);
    //
    const query = await namedQuery(db, 'latest-groups-query');
    const storiesSnap = await getDocsFromCache(query);

    return (
      storiesSnap.docs
        .map((doc) => ({
          ...doc.data(),
          id: doc.id
        }))
        .map((doc) => ({...doc})) || []
    );
  } catch (e) {
    return [];
  }
}

export async function addGroup(data) {
  const ref = await addDoc(collection(db, 'groups'), data);
  return {
    ...data,
    id: ref.id
  };
}

export async function removeGroup(data) {
  await deleteDoc(doc(db, 'groups', data.id));
  return data.id;
}

export async function updateGroup(data) {
  await setDoc(doc(db, 'groups', data.id), data);
  return data;
}
