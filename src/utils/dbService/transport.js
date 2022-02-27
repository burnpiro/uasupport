import { collection, getDocs, addDoc } from 'firebase/firestore/lite';
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

export async function addTransport(transport) {
  await addDoc(collection(db, "transport"), transport);
  return true;
}