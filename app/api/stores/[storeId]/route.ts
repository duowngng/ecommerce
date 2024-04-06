import { db } from "@/lib/firebase/firebase-config";
import { auth } from "@clerk/nextjs";
import { deleteDoc, doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function PATCH (
  req: Request,
  { params }: { params: { storeId: string } }
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

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const docRef = doc(db, 'stores', params.storeId);
    const storeDoc = await getDoc(docRef);
    let data = storeDoc.data();

    if (data?.userId === userId) {
      await updateDoc(docRef, { 
      ...data,
      name: name, 
      updatedAt: serverTimestamp(), 
      });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.log('[STORE_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE (
  _req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const docRef = doc(db, 'stores', params.storeId);
    const storeDoc = await getDoc(docRef);

    if (storeDoc.data()?.userId == userId) {
      deleteDoc(docRef);
    }

    return NextResponse.json(storeDoc.data());
  } catch (error) {
    console.log('[STORE_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}