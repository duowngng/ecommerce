import { db } from "@/lib/firebase/firebase-config";
import { auth } from "@clerk/nextjs";
import { collection, deleteDoc, doc, getDoc, getDocs, query, serverTimestamp, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET (
  _req: Request,
  { params }: { params: { storeId: string, sizeId: string } }
) {
  try {
    if (!params.sizeId) {
      return new NextResponse("Size id is required", { status: 400 });
    }

    const sizeRef = doc(db, 'stores', params.storeId, 'sizes', params.sizeId);
    const sizeDoc = await getDoc(sizeRef);

    return NextResponse.json(sizeDoc.data());
  } catch (error) {
    console.log('[SIZE_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH (
  req: Request,
  { params }: { params: { storeId: string, sizeId: string } }
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

    if (!params.sizeId) {
      return new NextResponse("Size id is required", { status: 400 });
    }

    const storeRef = doc(db, 'stores', params.storeId);
    const storeDoc = await getDoc(storeRef);
    const storeData = storeDoc.data();

    if (storeData?.userId != userId){
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const sizeRef = doc(db, 'stores', params.storeId, 'sizes', params.sizeId);
    const sizeDoc = await getDoc(sizeRef);
    const sizeData = sizeDoc.data();

    if (storeData?.userId === userId) {
      await updateDoc(sizeRef, { 
      ...sizeData,
      name: name,
      value: value,
      updatedAt: serverTimestamp(), 
      });
    }

    return NextResponse.json(sizeData);
  } catch (error) {
    console.log('[SIZE_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE (
  _req: Request,
  { params }: { params: { storeId: string, sizeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.sizeId) {
      return new NextResponse("Size id is required", { status: 400 });
    }

    const storeRef = doc(db, 'stores', params.storeId);
    const storeDoc = await getDoc(storeRef);
    const sizeRef = doc(db, 'stores', params.storeId, 'sizes', params.sizeId);
    const sizeDoc = await getDoc(sizeRef);

    if (storeDoc.data()?.userId == userId) {
      deleteDoc(sizeRef);
    }

    return NextResponse.json(sizeDoc.data());
  } catch (error) {
    console.log('[SIZE_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}