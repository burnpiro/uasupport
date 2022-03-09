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
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../../firebase';
import { sample } from 'lodash';

// import aids from './aid-zbior.json';

// export async function getAids() {
//   const transportCol = collection(db, 'aids');
//   const transportSnapshot = await getDocs(transportCol);
//   return transportSnapshot.docs
//     .map((doc) => ({
//       ...doc.data(),
//       id: doc.id
//     }))
//     .map((doc) => ({ ...doc }));
// }

export async function getMyAids(uid) {
  const cols = collection(db, 'aids');
  const q = query(cols, where(`roles.${uid}`, '==', 'owner'))
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs
    .map((doc) => ({
      ...doc.data(),
      id: doc.id
    }))
    .map((doc) => ({ ...doc })) || []
}

export async function getAids() {
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

  return (
    storiesSnap.docs
      .map((doc) => ({
        ...doc.data(),
        id: doc.id
      }))
      .map((doc) => ({ ...doc })) || []
  );
  // return (Array(10000).fill(0).map(() => generateRandomAidElement()))
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
  // for (let i =0; i<aids.length; i++) {
  //   if(aids[i].from != null && aids[i].from.length > 0) {
  //     await addDoc(collection(db, "aids"), {...aids[i]});
  //   }
  // }
  await setDoc(doc(db, 'aids', data.id), data);
  return data;
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function generateRandomAidElement() {
  return {
    id: uuidv4(),
    from: [getRandomArbitrary(49.1, 54.5), getRandomArbitrary(14.07, 24.09)],
    addressFrom: 'test address',
    name:
      'test Name' +
      sample([
        'medical-aid',
        'medical-aid',
        'medical-aid',
        'medical-aid',
        'standard-aid',
        'standard-aid',
        'standard-aid',
        'blood-aid',
        'blood-aid',
        'food-aid',
        'food-aid',
        'animal-aid'
      ]),
    aidType: sample([
      'medical-aid',
      'medical-aid',
      'medical-aid',
      'medical-aid',
      'standard-aid',
      'standard-aid',
      'standard-aid',
      'blood-aid',
      'blood-aid',
      'food-aid',
      'food-aid',
      'animal-aid'
    ]),
    phone: '12345213'
  };
}
