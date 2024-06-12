import { format } from "date-fns";

import { collection, doc, getDoc, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase-config";
import { formatter } from "@/lib/utils";

import { ProductClient } from "./components/client";
import { ProductColumn } from "./components/columns";
import { Product } from "@/types/types";

const ProductsPage = async ({
  params
}: {
  params: { storeId: string }
}) => {
  const querySnapshot = await getDocs(
    query(
      collection(db,"stores", params.storeId, "products"),
      orderBy("createdAt", "desc")
    ));

  const products: Product[] = []; 
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    products.push({ 
      ...data,
      id: doc.id, 
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate()
    } as Product);
  });

  const formattedProducts = await Promise.all(products.map(async (item) => {
    return {
    id: item.id,
    name: item.name,
    isFeatured: item.isFeatured,
    isArchived: item.isArchived,
    price: formatter.format(item.price),
    quantity: item.quantity,
    category: item.category.name,
    size: item.size.name,
    color: item.color.name,
    createdAt: format(item.createdAt, "MMMM do, yyyy")
    };
  }));

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductClient data={formattedProducts}/>
      </div>
    </div> 
  );
}

export default ProductsPage;