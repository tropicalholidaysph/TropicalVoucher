import { db } from "./firebase";
import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc, 
  doc, 
  query, 
  orderBy, 
  Timestamp 
} from "firebase/firestore";
import { Voucher } from "./types";

const VOUCHERS_COLLECTION = "vouchers";

export async function createVoucher(voucher: Omit<Voucher, 'id' | 'createdAt'>) {
  try {
    const docRef = await addDoc(collection(db, VOUCHERS_COLLECTION), {
      ...voucher,
      createdAt: Timestamp.now().toDate().toISOString(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error creating voucher:", error);
    return { success: false, error };
  }
}

export async function getVouchers(): Promise<Voucher[]> {
  try {
    const q = query(collection(db, VOUCHERS_COLLECTION), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Voucher[];
  } catch (error) {
    console.error("Error fetching vouchers:", error);
    return [];
  }
}

export async function getVoucherById(id: string): Promise<Voucher | null> {
  try {
    const docRef = doc(db, VOUCHERS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Voucher;
    }
    return null;
  } catch (error) {
    console.error("Error fetching voucher:", error);
    return null;
  }
}
