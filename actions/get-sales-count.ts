import { db } from "@/lib/firebase/firebase-config"
import { collection, getDocs, query, where } from "firebase/firestore"

export const getSalesCount = async (storeId: string) => {
  const orderRef = collection(db, "stores", storeId, "orders");
  const paidOrders = await getDocs(query(orderRef, where("isPaid", "==", true)));
  const salesCount = paidOrders.size;

  return salesCount;
}