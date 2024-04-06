import { auth } from "@clerk/nextjs";
import { db } from "@/lib/firebase/firebase-config";
import { doc, getDoc } from "firebase/firestore";
import { redirect } from "next/navigation";

import Navbar from "@/components/navbar";


export default async function DashboardLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { storeId: string }
})  {
  const { userId } = auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  const docRef = doc(db, 'stores', params.storeId);
  const storeDoc = await getDoc(docRef);

  if (!storeDoc.exists() || storeDoc.data().userId !== userId) {
    redirect("/");
  }

  return (
    <>
      <Navbar />
      {children}
    </>
  );

}