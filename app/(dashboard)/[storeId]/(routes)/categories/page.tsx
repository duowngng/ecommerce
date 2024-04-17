import { format } from "date-fns";

import { collection, doc, getDoc, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase-config";

import { CategoryClient } from "./components/client";
import { CategoryColumn } from "./components/columns";
import { Billboard, Category } from "@/types/types";

const CategoriesPage = async ({
  params
}: {
  params: { storeId: string }
}) => {
  const querySnapshot = await getDocs(
    query(
      collection(db,"stores", params.storeId, "categories"),
      orderBy("createdAt", "desc")
    ));

  const categories: Category[] = []; 
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    categories.push({ 
      ...data,
      id: doc.id, 
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate()
    } as Category);
  });

  const formattedCategories = await Promise.all(categories.map(async (item) => {
    const billboardRef = doc(db, 'stores', params.storeId, "billboards", item.billboardId);
    const billboardSnapshot = await getDoc(billboardRef);
  
    const billboardData = billboardSnapshot.data();
    return {
      id: item.id,
      name: item.name,
      billboardLabel: billboardData?.label,
      createdAt: format(item.createdAt, "MMMM do, yyyy")
    };
  }));

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryClient data={formattedCategories}/>
      </div>
    </div> 
  );
}

export default CategoriesPage;