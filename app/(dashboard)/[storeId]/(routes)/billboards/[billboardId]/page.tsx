import { db } from "@/lib/firebase/firebase-config";
import { doc, getDoc } from "firebase/firestore";
import { BillboardForm } from "./components/billboard-form";
import { Billboard } from "@/types/types";

const BillboardPage = async ({
  params
}: {
  params: { billboardId: string, storeId: string}
}) => {
  const docRef = doc(db, 'stores', params.storeId, 'billboards', params.billboardId);
  const billboardDoc = await getDoc(docRef);
  const billboardData = billboardDoc.data(); 
  if (billboardData) {
    billboardData.createdAt = billboardData.createdAt.toDate();
    billboardData.updatedAt = billboardData.updatedAt.toDate();
  }
  const billboard = billboardData as Billboard; 

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardForm initialData={billboard}/>
      </div>
    </div>
  );
}

export default BillboardPage;