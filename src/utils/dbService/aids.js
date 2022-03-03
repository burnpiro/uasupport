const {
  loadBundle,
  namedQuery,
  getDocsFromCache,
  getDocs,
  collection,
  addDoc,
  setDoc,
  doc,
  deleteDoc
} = require('firebase/firestore');
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../../firebase';

export async function getAids() {
  // const transportCol = collection(db, 'aids');
  // const transportSnapshot = await getDocs(transportCol);
  // return transportSnapshot.docs
  //   .map((doc) => ({
  //     ...doc.data(),
  //     id: doc.id,
  //   }))
  //   .map((doc) => ({ ...doc }));
  const storage = getStorage();
  const pathReference = ref(storage, 'aids-data');
  const url = await getDownloadURL(pathReference);
  const bundleData = await fetch(url, {
    method: 'GET', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors' // no-cors, *cors, same-origin
  });
  // // Load the bundle contents into the Firestore SDK
  await loadBundle(db, bundleData.body);
  //
  const query = await namedQuery(db, 'latest-aids-query');
  const storiesSnap = await getDocsFromCache(query);
  //
  return (
    storiesSnap.docs
      .map((doc) => ({
        ...doc.data(),
        id: doc.id
      }))
      .map((doc) => ({ ...doc })) || []
  );
}

export async function addAid(data) {
  const ref = await addDoc(collection(db, 'aids'), data);
  return {
    ...data,
    id: ref.id
  };
}

export async function removeAid(data) {
  await deleteDoc(doc(db, 'aids', data.id));
  return data.id;
}

export async function updateAid(data) {
  await setDoc(doc(db, 'aids', data.id), data);
  return data;
}
