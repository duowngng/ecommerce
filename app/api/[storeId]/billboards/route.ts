import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { collection, addDoc, serverTimestamp, getDoc, doc, getDocs, query } from "firebase/firestore"; 
import { db } from "@/lib/firebase/firebase-config";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } },
) {
  try {
    const { userId } = auth(); 
    const body = await req.json();

    const { label, imageUrl } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!label) {
      return new NextResponse("Label is required", { status: 400 });
    }

    if (!imageUrl) {
      return new NextResponse("Image URL is required", { status: 400 });
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
    
    // Store the billboard in the database
    const billboardRef = await addDoc(collection(db,"stores", params.storeId, "billboards"), {
      label: label,
      imageUrl: imageUrl,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    // Return the response
    return NextResponse.json(billboardRef);
  } catch (error) {
    console.log('[BILLBOARDS_POST]', error);
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
    
    // Store the billboard in the database
    const querySnapshot = await getDocs(
      query(
        collection(db,"stores", params.storeId, "billboards")
      ));

    const billboards: any[] = []; 
    querySnapshot.forEach((doc) => {
      billboards.push({ id: doc.id, ...doc.data() });
    });

    return NextResponse.json(billboards);
  } catch (error) {
    console.log('[BILLBOARDS_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}