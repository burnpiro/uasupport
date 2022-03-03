import {collection, getDocs, addDoc, setDoc, doc, deleteDoc} from 'firebase/firestore/lite';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../../firebase';

export async function getTransport() {
  const transportCol = collection(db, 'transport');
  const transportSnapshot = await getDocs(transportCol);
  return transportSnapshot.docs
    .map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }))
    .map((doc) => ({ ...doc, date: doc.date.toDate() }));
}

export async function removeTransport(data) {
  await deleteDoc(doc(db, "transport", data.id));
  return true;
}

export async function addTransport(transport) {
  const ref = await addDoc(collection(db, "transport"), transport);
  return ref;
}

export async function updateTransport(data) {
  await setDoc(doc(db, "transport", data.id), data);
  return true;
}