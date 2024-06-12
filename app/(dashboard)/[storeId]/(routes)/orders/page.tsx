import { format } from "date-fns";

import { collection, doc, getDoc, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase-config";

import { OrderClient } from "./components/client";
import { OrderColumn } from "./components/columns";
import { Order } from "@/types/types";
import { formatter } from "@/lib/utils";

const OrdersPage = async ({
  params
}: {
  params: { storeId: string }
}) => {
  const querySnapshot = await getDocs(
    query(
      collection(db,"stores", params.storeId, "orders"),
      orderBy("createdAt", "desc")
    ));

  const orders: Order[] = []; 
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    orders.push({ 
      ...data,
      id: doc.id, 
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate()
    } as Order);
  });

  const formattedOrders: OrderColumn[] = await Promise.all(orders.map(async (item) => {
    const products = []

    for (let i = 0; i < item.orderItems.length; i++) {
      const productRef = doc(db, 'stores', params.storeId, "products", item.orderItems[i].product.id);
      const productSnapshot = await getDoc(productRef);
      const productData = productSnapshot.data();
      products.push(productData);
    }

    const productNames = products.map((product) => product?.name).join(', ');
    const totalPrice = products.reduce((total, item) => {
      return total + item?.price;
    }, 0);

    return {
      id: item.id,
      phone: item.phone,
      address: item.address,
      products: productNames,
      totalPrice: formatter.format(totalPrice),
      isPaid: item.isPaid,
      createdAt: format(item.createdAt, "MMMM do, yyyy")
    };
  }))

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrderClient data={formattedOrders}/>
      </div>
    </div> 
  );
}

export default OrdersPage;