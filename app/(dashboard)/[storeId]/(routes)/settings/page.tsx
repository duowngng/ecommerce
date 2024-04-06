import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "@/lib/firebase/firebase-config";
import { doc, getDoc } from "firebase/firestore";

import { SettingsForm } from "./components/settings-form";
import { Store } from "@/types/store";

interface SettingPageProps {
  params: {
    storeId: string;
  };
}

const SettingPage: React.FC<SettingPageProps> = async ({
  params
}) => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const docRef = doc(db, 'stores', params.storeId);
  const storeDoc = await getDoc(docRef);

  if (!storeDoc.exists() || storeDoc.data().userId !== userId) {
    redirect("/");
  }

  const storeData = storeDoc.data(); 
  storeData.createdAt = storeData.createdAt.toDate();
  storeData.updatedAt = storeData.updatedAt.toDate();
  const store = storeData as Store; 

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SettingsForm initialData={store}/>
      </div>
    </div>
  );
}

export default SettingPage;