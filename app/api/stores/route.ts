import { NextResponse } from "next/server";
import { getAuth, User } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore"; 
import { db } from "@/app/firebaseConfig";

export async function POST(
  req: Request,
  user: User,
) {
  try {
    
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    } 
    console.log(user);
    // Get the request body
    const body = await req.json();
    const { name, userId } = body;

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    // Store the post in the database
    const store = await addDoc(collection(db, "stores"), {
      name: name,
      userId: userId,
    });
    // Return the response
    return NextResponse.json(store);
  } catch (error) {
    console.log('[STORE_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}