import {
  collection,
  getDocs,
  addDoc,
  setDoc,
  doc,
  deleteDoc,
  query,
  where,
  loadBundle,
  namedQuery,
  getDocsFromCache
} from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../../firebase';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';

// export async function getTransport() {
//   const transportCol = collection(db, 'transport');
//   const transportSnapshot = await getDocs(transportCol);
//   return transportSnapshot.docs
//     .map((doc) => ({
//       ...doc.data(),
//       id: doc.id,
//     }))
//     .map((doc) => ({ ...doc, date: doc.date.toDate() }));
// }

export async function getMyTransport(uid) {
  const cols = collection(db, 'transport');
  const q = query(cols, where(`roles.${uid}`, '==', 'owner'))
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs
    .map((doc) => ({
      ...doc.data(),
      id: doc.id
    }))
    .map((doc) => ({ ...doc, date: doc.date.toDate() }));
}

export async function getTransport() {
  const storage = getStorage();
  const pathReference = ref(storage, 'transport-data');
  const url = await getDownloadURL(pathReference);
  const bundleData = await fetch(url, {
    method: 'GET', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors' // no-cors, *cors, same-origin
  });
  // // Load the bundle contents into the Firestore SDK
  await loadBundle(db, bundleData.body);
  //
  const query = await namedQuery(db, 'latest-transport-query');
  const storiesSnap = await getDocsFromCache(query);
  //
  return (
    storiesSnap.docs
      .map((doc) => ({
        ...doc.data(),
        id: doc.id
      }))
      .map((doc) => ({ ...doc, date: doc.date.toDate() })) || []
  );
}

export async function removeTransport(data) {
  await deleteDoc(doc(db, 'transport', data.id));
  return data.id;
}

export async function addTransport(data) {
  const ref = await addDoc(collection(db, 'transport'), data);
  return {
    ...data,
    id: ref.id
  };
}

export async function updateTransport(data) {
  await setDoc(doc(db, 'transport', data.id), data);
  return data;
}
