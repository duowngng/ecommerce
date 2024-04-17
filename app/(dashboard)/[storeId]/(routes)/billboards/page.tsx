import { format } from "date-fns";

import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase-config";

import { BillboardClient } from "./components/client";
import { BillboardColumn } from "./components/columns";
import { Billboard } from "@/types/types";

const BillboardsPage = async ({
  params
}: {
  params: { storeId: string }
}) => {
  const querySnapshot = await getDocs(
    query(
      collection(db,"stores", params.storeId, "billboards"),
      orderBy("createdAt", "desc")
    ));

  const billboards: Billboard[] = []; 
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    billboards.push({ 
      ...data,
      id: doc.id, 
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate()
    } as Billboard);
  });

  const formatedBillboards: BillboardColumn[] = billboards.map((item) => ({
    id: item.id,
    label: item.label,
    imageUrl: item.imageUrl,
    createdAt: format(item.createdAt, "MMMM do, yyyy")
  }))

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardClient data={formatedBillboards}/>
      </div>
    </div> 
  );
}

export default BillboardsPage;