import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { collection, addDoc, serverTimestamp, getDoc, doc, getDocs, query, where, or, orderBy } from "firebase/firestore"; 
import { db } from "@/lib/firebase/firebase-config";
import { Product } from "@/types/types";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } },
) {
  try {
    const { userId } = auth(); 
    const body = await req.json();

    const { 
      name,
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

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const docRef = doc(db, 'stores', params.storeId);
    const storeDoc = await getDoc(docRef);
    const data = storeDoc.data();

    if (data?.userId != userId){
      return new NextResponse("Unauthorized", { status: 403 });
    }
    
    const categoryDoc = await getDoc(doc(db, "stores", params.storeId, "categories", categoryId));
    const colorDoc = await getDoc(doc(db, "stores", params.storeId, "colors", colorId));
    const sizeDoc = await getDoc(doc(db, "stores", params.storeId, "sizes", sizeId));
    
    if (!categoryDoc.exists || !colorDoc.exists || !sizeDoc.exists) {
      return new NextResponse("Invalid category, color, or size ID", { status: 400 });
    }
    
    const categoryData = categoryDoc.data();
    const colorData = colorDoc.data();
    const sizeData = sizeDoc.data();

    // Store the product in the database
    const productRef = await addDoc(collection(db,"stores", params.storeId, "products"), {
      name,
      price,
      isFeatured,
      isArchived,
      images,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      category: {
        id: categoryId,
        name: categoryData?.name,
      },
      color: {
        id: colorId,
        name: colorData?.name,
      },
      size: {
        id: sizeId,
        name: sizeData?.name,
      }
    });
    // Return the response
    return NextResponse.json(productRef);
  } catch (error) {
    console.log('[PRODUCTS_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } },
) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId"); // Optional
    const colorId = searchParams.get("colorId"); // Optional
    const sizeId = searchParams.get("sizeId"); // Optional
    const isFeatured = searchParams.get("isFeatured"); // Optional

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const queryConstraints = [where('isArchived', '==', false)];
    if (categoryId) {
      queryConstraints.push(where('categoryId', '==', categoryId));
    }
    if (colorId) {
      queryConstraints.push(where('colorId', '==', colorId));
    }
    if (sizeId) {
      queryConstraints.push(where('sizeId', '==', sizeId));
    }
    if (isFeatured === 'true') {
      queryConstraints.push(where('isFeatured', '==', true));
    }
    
    const querySnapshot = await getDocs(
      query(
        collection(db,"stores", params.storeId, "products"),
        orderBy("createdAt", "desc"),
        ...queryConstraints,
      ));
  
    const products: Product[] = []; 
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      products.push({ 
        ...data,
        id: doc.id, 
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate()
      } as Product);
    });

    return NextResponse.json(products);
  } catch (error) {
    console.log('[PRODUCTS_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}