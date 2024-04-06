import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { collection, addDoc, serverTimestamp, getDoc } from "firebase/firestore"; 
import { db } from "@/lib/firebase/firebase-config";

export async function POST(
  req: Request,
) {
  try {
    const { userId } = auth(); 
    const body = await req.json();

    const { name } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    // Store the store in the database
    const storeRef = await addDoc(collection(db, "stores"), {
      name: name,
      userId: userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    // Return the response
    return NextResponse.json(storeRef);
  } catch (error) {
    console.log('[STORES_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}