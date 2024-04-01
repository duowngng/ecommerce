import { db } from "@/lib/firebase/firebase-config";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { collection, getDocs, limit, query, where } from "firebase/firestore";

export default async function SetupLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const queryRef = query(
    collection(db, 'stores'),
    where('userId', '==', userId),
    limit(1)
  );
  
  const querySnapshot = await getDocs(queryRef);
  const store = querySnapshot.docs[0];

  if (store) {
    redirect(`/${store.id}`);
  }

  return (
    <>
      {children}
    </>
  )
}