import { db } from "@/lib/firebase/firebase-config";
import { getAuth } from "firebase-admin/auth";
import { redirect } from "next/navigation";
import { collection, getDocs, limit, query, where } from "firebase/firestore";

export default async function SetupLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    redirect("/sign-in");
  }

  if (user) {
    const queryRef = query(
      collection(db, 'stores'),
      where('userId', '==', user.uid),
      limit(1));

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
}
  }

  if (user) {
    const queryRef = query(
      collection(db, 'stores'),
      where('userId', '==', user.uid),
      limit(1));

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
}