import { collection, getDocs, addDoc, setDoc, doc, deleteDoc } from 'firebase/firestore/lite';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../../firebase';

export async function getAids() {
  const transportCol = collection(db, 'aids');
  const transportSnapshot = await getDocs(transportCol);
  return transportSnapshot.docs
    .map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }))
    .map((doc) => ({ ...doc }));
}

export async function addAid(data) {
  await addDoc(collection(db, "aids"), data);
  return true;
}

export async function removeAid(data) {
  await deleteDoc(doc(db, "aids", data.id));
  return true;
}

export async function updateAid(data) {
  await setDoc(doc(db, "aids", data.id), data);
  return true;
}