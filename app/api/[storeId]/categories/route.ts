import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { collection, addDoc, serverTimestamp, getDoc, doc, getDocs, query } from "firebase/firestore"; 
import { db } from "@/lib/firebase/firebase-config";
import { Billboard, Category } from "@/types/types";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } },
) {
  try {
    const { userId } = auth(); 
    const body = await req.json();

    const { name, billboardId } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!billboardId) {
      return new NextResponse("Billboard id is required", { status: 400 });
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
    
    const categoryRef = await addDoc(collection(db,"stores", params.storeId, "categories"), {
      name: name,
      billboardId: billboardId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    // Return the response
    return NextResponse.json(categoryRef);
  } catch (error) {
    console.log('[CATEGORIES_POST]', error);
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
        collection(db,"stores", params.storeId, "categories")
      ));
  
    const categories: Category[] = []; 
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      categories.push({ 
        ...data,
        id: doc.id, 
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate()
      } as Category);
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.log('[CATEGORIES_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}