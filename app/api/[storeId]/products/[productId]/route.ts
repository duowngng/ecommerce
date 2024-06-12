import { db } from "@/lib/firebase/firebase-config";
import { auth } from "@clerk/nextjs";
import { collection, deleteDoc, doc, getDoc, getDocs, query, serverTimestamp, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET (
  _req: Request,
  { params }: { params: { storeId: string, productId: string } }
) {
  try {
    if (!params.productId) {
      return new NextResponse("Product id is required", { status: 400 });
    }

    const productRef = doc(db, 'stores', params.storeId, 'products', params.productId);
    const productDoc = await getDoc(productRef);
    const productData = productDoc.data();

    return NextResponse.json({
      ...productData,
      id: productDoc.id,
    });
  } catch (error) {
    console.log('[PRODUCT_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH (
  req: Request,
  { params }: { params: { storeId: string, productId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { 
      name,
      quantity,
      price,
      categoryId,
      sizeId,
      colorId,
      images,
      isFeatured,
      isArchived,
    } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!images || !images.length) {
      return new NextResponse("Images are required", { status: 400 });
    }

    if (!quantity) {
      return new NextResponse("Quantity is required", { status: 400 });
    }

    if (!price) {
      return new NextResponse("Price is required", { status: 400 });
    }

    if (!categoryId) {
      return new NextResponse("Category is required", { status: 400 });
    }

    if (!sizeId) {
      return new NextResponse("Size is required", { status: 400 });
    }

    if (!colorId) {
      return new NextResponse("Color is required", { status: 400 });
    }

    if (!params.productId) {
      return new NextResponse("Product id is required", { status: 400 });
    }

    const storeRef = doc(db, 'stores', params.storeId);
    const storeDoc = await getDoc(storeRef);
    const storeData = storeDoc.data();

    if (storeData?.userId != userId){
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const productRef = doc(db, 'stores', params.storeId, 'products', params.productId);
    const productDoc = await getDoc(productRef);
    const productData = productDoc.data();

    if (storeData?.userId === userId) {
      await updateDoc(productRef, { 
      ...productData,
      name,
      quantity,
      price,
      categoryId,
      sizeId,
      colorId,
      isFeatured,
      isArchived,
      images,
      updatedAt: serverTimestamp(), 
      });
    }

    return NextResponse.json(productData);
  } catch (error) {
    console.log('[PRODUCT_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE (
  _req: Request,
  { params }: { params: { storeId: string, productId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.productId) {
      return new NextResponse("Product id is required", { status: 400 });
    }

    const storeRef = doc(db, 'stores', params.storeId);
    const storeDoc = await getDoc(storeRef);
    const productRef = doc(db, 'stores', params.storeId, 'products', params.productId);
    const productDoc = await getDoc(productRef);

    if (storeDoc.data()?.userId == userId) {
      deleteDoc(productRef);
    }

    return NextResponse.json(productDoc.data());
  } catch (error) {
    console.log('[PRODUCT_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}