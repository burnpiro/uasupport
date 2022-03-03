import {collection, getDocs, addDoc, setDoc, doc, deleteDoc} from 'firebase/firestore';
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
  return data.id;
}

export async function addTransport(transport) {
  const ref = await addDoc(collection(db, "transport"), transport);
  return {
    ...data,
    id: ref.id
  };
}

export async function updateTransport(data) {
  await setDoc(doc(db, "transport", data.id), data);
  return data;
}