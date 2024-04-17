import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { collection, addDoc, serverTimestamp, getDoc, doc, getDocs, query } from "firebase/firestore"; 
import { db } from "@/lib/firebase/firebase-config";
import { Size } from "@/types/types";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } },
) {
  try {
    const { userId } = auth(); 
    const body = await req.json();

    const { name, value } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!value) {
      return new NextResponse("Value is required", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const docRef = doc(db, 'stores', params.storeId);
    const storeDoc = await getDoc(docRef);
    const data = storeDoc.data();

    if (data?.userId != userId){
      return new NextResponse("Unauthorized", { status: 403 });
    }
    
    const sizeRef = await addDoc(collection(db,"stores", params.storeId, "sizes"), {
      name: name,
      value: value,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    // Return the response
    return NextResponse.json(sizeRef);
  } catch (error) {
    console.log('[SIZES_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } },
) {
  try {
    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }
    
    const querySnapshot = await getDocs(
      query(
        collection(db,"stores", params.storeId, "sizes")
      ));
  
    const sizes: Size[] = []; 
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      sizes.push({ 
        ...data,
        id: doc.id, 
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate()
      } as Size);
    });

    return NextResponse.json(sizes);
  } catch (error) {
    console.log('[SIZES_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}