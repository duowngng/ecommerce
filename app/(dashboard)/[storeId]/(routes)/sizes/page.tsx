import { format } from "date-fns";

import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase-config";

import { SizeClient } from "./components/client";
import { SizeColumn } from "./components/columns";
import { Size } from "@/types/types";

const SizePage = async ({
  params
}: {
  params: { storeId: string }
}) => {
  const querySnapshot = await getDocs(
    query(
      collection(db,"stores", params.storeId, "sizes"),
      orderBy("createdAt", "desc")
    ));

  const sizes: Size[] = []; 
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    sizes.push({ 
      ...data,
      id: doc.id, 
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate()
    } as Size);
  });

  const formatedSizes: SizeColumn[] = sizes.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, "MMMM do, yyyy")
  }))

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizeClient data={formatedSizes}/>
      </div>
    </div> 
  );
}

export default SizePage;