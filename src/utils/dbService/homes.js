import {collection, getDocs, addDoc, setDoc, doc, deleteDoc} from 'firebase/firestore/lite';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../../firebase';

export async function getHomes() {
  const transportCol = collection(db, 'homes');
  const transportSnapshot = await getDocs(transportCol);
  return transportSnapshot.docs
    .map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }))
    .map((doc) => ({ ...doc, date: doc.date.toDate() }));
}

export async function addHome(transport) {
  await addDoc(collection(db, "homes"), transport);
  return true;
}

export async function removeHome(data) {
  await deleteDoc(doc(db, "homes", data.id));
  return true;
}

export async function updateHome(data) {
  await setDoc(doc(db, "homes", data.id), data);
  return true;
}