import { format } from "date-fns";

import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase-config";

import { ColorClient } from "./components/client";
import { ColorColumn } from "./components/columns";
import { Color } from "@/types/types";

const ColorsPage = async ({
  params
}: {
  params: { storeId: string }
}) => {
  const querySnapshot = await getDocs(
    query(
      collection(db,"stores", params.storeId, "colors"),
      orderBy("createdAt", "desc")
    ));

  const colors: Color[] = []; 
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    colors.push({ 
      ...data,
      id: doc.id, 
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate()
    } as Color);
  });

  const formatedColors: ColorColumn[] = colors.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, "MMMM do, yyyy")
  }))

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColorClient data={formatedColors}/>
      </div>
    </div> 
  );
}

export default ColorsPage;