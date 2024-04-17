import { db } from "@/lib/firebase/firebase-config";
import { doc, getDoc } from "firebase/firestore";
import { SizeForm } from "./components/size-form";
import { Size } from "@/types/types";

const SizePage = async ({
  params
}: {
  params: { sizeId: string, storeId: string}
}) => {
  const docRef = doc(db, 'stores', params.storeId, 'sizes', params.sizeId);
  const sizeDoc = await getDoc(docRef);
  const sizeData = sizeDoc.data(); 
  if (sizeData) {
    sizeData.createdAt = sizeData.createdAt.toDate();
    sizeData.updatedAt = sizeData.updatedAt.toDate();
  }
  const size = sizeData as Size; 

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizeForm initialData={size}/>
      </div>
    </div>
  );
}

export default SizePage;