import { db } from "@/lib/firebase/firebase-config"
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore"

export const getTotalRevenue = async (storeId: string) => {
  const orderRef = collection(db, "stores", storeId, "orders");
  const paidOrders = await getDocs(query(orderRef, where("isPaid", "==", true)));

  const totalRevenue = await paidOrders.docs.reduce(async (prevTotalPromise, order) => {
    const prevTotal = await prevTotalPromise;
    const orderData = order.data();
    
    const orderTotal = await orderData.orderItems.reduce(async (orderSum: any, item: { product: { connect: { id: any; }; }; }) => {
      const prevOrderItemSum = await orderSum; 
      const productId = item.product.connect.id;
      const productDoc = await getDoc(doc(db, "stores", storeId, "products", productId));
      const productData = productDoc.data();
      return prevOrderItemSum + productData?.price || 0;
    }, Promise.resolve(0));

    return prevTotal + orderTotal;
  }, Promise.resolve(0));

  return totalRevenue;
}