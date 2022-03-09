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
import { shuffle } from 'lodash/collection';

// export async function getHomes() {
//   const homesCol = collection(db, 'homes');
//   const querySnapshot = await getDocs(homesCol);
//   return querySnapshot.docs
//     .map((doc) => ({
//       ...doc.data(),
//       id: doc.id
//     }))
//     .map((doc) => ({ ...doc, date: doc.date.toDate() }));
// }

export async function getMyHomes(uid) {
  const cols = collection(db, 'homes');
  const q = query(cols, where(`roles.${uid}`, '==', 'owner'))
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs
    .map((doc) => ({
      ...doc.data(),
      id: doc.id
    }))
    .map((doc) => ({ ...doc, date: doc.date.toDate() }));
}

export async function getHomes() {
  const storage = getStorage();
  const pathReference = ref(storage, 'homes-data');
  const url = await getDownloadURL(pathReference);
  const bundleData = await fetch(url, {
    method: 'GET', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors' // no-cors, *cors, same-origin
  });
  // // Load the bundle contents into the Firestore SDK
  await loadBundle(db, bundleData.body);
  //
  const query = await namedQuery(db, 'latest-homes-query');
  const storiesSnap = await getDocsFromCache(query);
  //
  return shuffle(
    storiesSnap.docs
      .map((doc) => ({
        ...doc.data(),
        id: doc.id
      }))
      .map((doc) => ({ ...doc, date: doc.date.toDate() })) || []
  );
}

export async function addHome(data) {
  const ref = await addDoc(collection(db, 'homes'), data);
  return {
    ...data,
    id: ref.id
  };
}

export async function removeHome(data) {
  await deleteDoc(doc(db, 'homes', data.id));
  return data.id;
}

export async function updateHome(data) {
  await setDoc(doc(db, 'homes', data.id), data);
  return data;
}
