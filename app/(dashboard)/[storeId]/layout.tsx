import { auth, db } from "@/lib/firebase/firebase-config";
import { collection, doc } from "firebase/firestore";
import { redirect } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";

export default function DashboardLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { storeId: string }
})  {
  const [ user, loading ] = useAuthState(auth);
  
  
  if (!user && !loading) {
    redirect("/sign-in");
  }

  const storeRef = doc(collection(db, 'stores'), params.storeId);

  if (!storeRef) {
    redirect("/");
  }

  if (user) {
    return (
      <>
        <div>This is navbar</div>
        {children}
      </>
    );
  }
}