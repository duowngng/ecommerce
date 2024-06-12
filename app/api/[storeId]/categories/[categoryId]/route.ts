import { db } from "@/lib/firebase/firebase-config";
import { auth } from "@clerk/nextjs";
import { collection, deleteDoc, doc, getDoc, getDocs, query, serverTimestamp, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET (
  _req: Request,
  { params }: { params: { storeId: string, categoryId: string } }
) {
  try {
    if (!params.categoryId) {
      return new NextResponse("Category id is required", { status: 400 });
    }

    const categoryRef = doc(db, 'stores', params.storeId, 'categories', params.categoryId);
    const categoryDoc = await getDoc(categoryRef);
    const categoryData = categoryDoc.data();

    return NextResponse.json({
      ...categoryData,
      id: categoryDoc.id,
    });
  } catch (error) {
    console.log('[CATEGORY_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH (
  req: Request,
  { params }: { params: { storeId: string, categoryId: string } }
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

    if (!params.categoryId) {
      return new NextResponse("Category id is required", { status: 400 });
    }

    const storeRef = doc(db, 'stores', params.storeId);
    const storeDoc = await getDoc(storeRef);
    const storeData = storeDoc.data();

    if (storeData?.userId != userId){
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const categoryRef = doc(db, 'stores', params.storeId, 'categories', params.categoryId);
    const categoryDoc = await getDoc(categoryRef);
    const categoryData = categoryDoc.data();

    if (storeData?.userId === userId) {
      await updateDoc(categoryRef, { 
      ...categoryData,
      name: name,
      billboardId: billboardId,
      updatedAt: serverTimestamp(), 
      });
    }

    return NextResponse.json(categoryData);
  } catch (error) {
    console.log('[CATEGORY_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE (
  _req: Request,
  { params }: { params: { storeId: string, categoryId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.categoryId) {
      return new NextResponse("Category id is required", { status: 400 });
    }

    const storeRef = doc(db, 'stores', params.storeId);
    const storeDoc = await getDoc(storeRef);
    const categoryRef = doc(db, 'stores', params.storeId, 'categories', params.categoryId);
    const categoryDoc = await getDoc(categoryRef);

    if (storeDoc.data()?.userId == userId) {
      deleteDoc(categoryRef);
    }

    return NextResponse.json(categoryDoc.data());
  } catch (error) {
    console.log('[CATEGORY_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}