import { db } from "@/lib/firebase/firebase-config"
import { collection, getDocs, query, where } from "firebase/firestore"

export const getStockCount = async (storeId: string) => {
  const productRef = collection(db, "stores", storeId, "products");
  const stockProducts = await getDocs(query(productRef, where("isArchived", "==", false)));
  const stockCount = stockProducts.size;

  return stockCount;
}