import { db } from "@/lib/firebase/firebase-config";
import { auth } from "@clerk/nextjs";
import { collection, deleteDoc, doc, getDoc, getDocs, query, serverTimestamp, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET (
  _req: Request,
  { params }: { params: { storeId: string, billboardId: string } }
) {
  try {
    if (!params.billboardId) {
      return new NextResponse("Billboard id is required", { status: 400 });
    }

    const billboardRef = doc(db, 'stores', params.storeId, 'billboards', params.billboardId);
    const billboardDoc = await getDoc(billboardRef);

    return NextResponse.json(billboardDoc.data());
  } catch (error) {
    console.log('[BILLBOARD_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH (
  req: Request,
  { params }: { params: { storeId: string, billboardId: string } }
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

    if (!params.billboardId) {
      return new NextResponse("Billboard id is required", { status: 400 });
    }

    const storeRef = doc(db, 'stores', params.storeId);
    const storeDoc = await getDoc(storeRef);
    const storeData = storeDoc.data();

    if (storeData?.userId != userId){
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const billboardRef = doc(db, 'stores', params.storeId, 'billboards', params.billboardId);
    const billboardDoc = await getDoc(billboardRef);
    const billboardData = billboardDoc.data();

    if (storeData?.userId === userId) {
      await updateDoc(billboardRef, { 
      ...billboardData,
      label: label,
      imageUrl: imageUrl, 
      updatedAt: serverTimestamp(), 
      });
    }

    return NextResponse.json(billboardData);
  } catch (error) {
    console.log('[BILLBOARD_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE (
  _req: Request,
  { params }: { params: { storeId: string, billboardId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.billboardId) {
      return new NextResponse("Billboard id is required", { status: 400 });
    }

    const billboardRef = doc(db, 'stores', params.storeId, 'billboards', params.billboardId);
    const billboardDoc = await getDoc(billboardRef);

    if (billboardDoc.data()?.userId == userId) {
      deleteDoc(billboardRef);
    }

    return NextResponse.json(billboardDoc.data());
  } catch (error) {
    console.log('[BILLBOARD_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}