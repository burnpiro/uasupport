import {
  collection,
  getDocs,
  addDoc,
  loadBundle,
  namedQuery,
  getDocsFromCache
} from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { db, storage } from '../../firebase';
import { getDownloadURL, ref } from 'firebase/storage';

export async function getFundraising() {
  // const transportCol = collection(db, 'fundraising');
  // const transportSnapshot = await getDocs(transportCol);
  // return transportSnapshot.docs
  //   .map((doc) => ({
  //     ...doc.data(),
  //     id: doc.id,
  //   }))
  //   .map((doc) => ({ ...doc, createdAt: doc.createdAt.toDate() }));
  try {
    const pathReference = ref(storage, 'fundraising-data');
    const url = await getDownloadURL(pathReference);
    const bundleData = await fetch(url, {
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors' // no-cors, *cors, same-origin
    });
    // // Load the bundle contents into the Firestore SDK
    await loadBundle(db, bundleData.body);
    //
    const query = await namedQuery(db, 'latest-fundraising-query');
    const storiesSnap = await getDocsFromCache(query);
    //
    return (
      storiesSnap.docs
        .map((doc) => ({
          ...doc.data(),
          id: doc.id
        }))
        .map((doc) => ({...doc, createdAt: doc.createdAt.toDate()})) || []
    );
  } catch (e) {
    return [];
  }
}
