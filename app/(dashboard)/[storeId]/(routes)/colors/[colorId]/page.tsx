import { db } from "@/lib/firebase/firebase-config";
import { doc, getDoc } from "firebase/firestore";
import { ColorForm } from "./components/color-form";
import { Color } from "@/types/types";

const ColorPage = async ({
  params
}: {
  params: { colorId: string, storeId: string}
}) => {
  const docRef = doc(db, 'stores', params.storeId, 'colors', params.colorId);
  const colorDoc = await getDoc(docRef);
  const colorData = colorDoc.data(); 
  if (colorData) {
    colorData.createdAt = colorData.createdAt.toDate();
    colorData.updatedAt = colorData.updatedAt.toDate();
  }
  const color = colorData as Color; 

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColorForm initialData={color}/>
      </div>
    </div>
  );
}

export default ColorPage;