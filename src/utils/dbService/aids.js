import { collection, getDocs, addDoc } from 'firebase/firestore/lite';
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