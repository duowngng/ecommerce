import { db } from "@/lib/firebase/firebase-config";
import { doc, getDoc } from "firebase/firestore";

interface DashboardPageProps {
  params: { storeId: string }
};

const DashboardPage: React.FC<DashboardPageProps> = async ({
  params
}) => {
  const docRef = doc(db, 'stores', params.storeId);
  const storeDoc = await getDoc(docRef);
  const store = storeDoc.data()

  return (
    <div>
      Active Store: {store?.name}
    </div>
  )
}

export default DashboardPage