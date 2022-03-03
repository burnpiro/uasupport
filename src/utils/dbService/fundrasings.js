import { collection, getDocs, addDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../../firebase';

export async function getFundraising() {
  const transportCol = collection(db, 'fundraising');
  const transportSnapshot = await getDocs(transportCol);
  return transportSnapshot.docs
    .map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }))
    .map((doc) => ({ ...doc, createdAt: doc.createdAt.toDate() }));
}