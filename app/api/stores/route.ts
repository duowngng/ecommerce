import { NextResponse } from "next/server";
import { verifyUser } from "@/app/middleware";
import { collection, addDoc, serverTimestamp } from "firebase/firestore"; 
import { db } from "@/app/firebaseConfig";

export async function POST(
  req: Request,
) {
  try {
    const session = await verifyUser(req); 
    const { uid } = session; 

    if (!uid) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get the request body
    const body = await req.json();
    const { name } = body;

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    // Store the store in the database
    const store = await addDoc(collection(db, "stores"), {
      name: name,
      userId: uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    // Return the response
    return NextResponse.json(store);
  } catch (error) {
    console.log('[STORE_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}