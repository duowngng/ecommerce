import { db } from "@/lib/firebase/firebase-config"
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore"

interface GraphData {
  name: string;
  total: number;
}

export const getGraphRevenue = async (storeId: string) => {
  const orderRef = collection(db, "stores", storeId, "orders");
  const paidOrders = await getDocs(query(orderRef, where("isPaid", "==", true)));
  const monthlyRevenue: { [key: number]: number } = {};

  for (const order of paidOrders.docs) {
    const orderData = order.data();
    const orderDate = new Date(orderData.createdAt.toDate());
    const orderMonth = orderDate.getMonth();
    let revenueForOrder = 0;

    for (const item of orderData.orderItems) {
      const productDoc = await getDoc(doc(db, "stores", storeId, "products", item.product.connect.id));
      const productData = productDoc.data();
      revenueForOrder += productData?.price || 0;
    }
    
    monthlyRevenue[orderMonth] = (monthlyRevenue[orderMonth] || 0) + revenueForOrder;
  };

  const graphData: GraphData[] = [
    {name: "Jan", total:  0},
    {name: "Feb", total:  0},
    {name: "Mar", total:  0},
    {name: "Apr", total:  0},
    {name: "May", total:  0},
    {name: "Jun", total:  0},
    {name: "Jul", total:  0},
    {name: "Aug", total:  0},
    {name: "Sep", total:  0},
    {name: "Oct", total:  0},
    {name: "Nov", total:  0},
    {name: "Dec", total:  0},
  ];

  for (const month in monthlyRevenue) {
    graphData[parseInt(month)].total = monthlyRevenue[month];
  }

  console.log(graphData);
  return graphData;
}