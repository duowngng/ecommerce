import Stripe from "stripe";
import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import { collection, addDoc, serverTimestamp, getDoc, doc } from "firebase/firestore"; 
import { db } from "@/lib/firebase/firebase-config";

const corsHeader ={
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeader });
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  const { items } = await req.json();

  if (!items || items.length === 0) {
    return new NextResponse("Cart items are required", { status: 400 });
  }


  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

  for (const item of items) {
    const productDoc = await getDoc(
      doc(db, "stores", params.storeId, "products", item.product.id)
    );
    const productData = productDoc.data();

    line_items.push({
      quantity: item.quantity,
      price_data: {
        currency: 'USD',
        product_data: {
          name: productData?.name,
        },
        unit_amount: productData?.price * 100,
      },
    });
  };

  const order = await addDoc(collection(db, "stores", params.storeId, "orders"), {
    storeId: params.storeId,
    isPaid: false,
    orderItems: items,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  const session = await stripe.checkout.sessions.create({
    line_items,
    mode:"payment",
    billing_address_collection: "required",
    phone_number_collection: {
      enabled: true,
    },
    success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
    cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?canceled=1`,
    metadata: {
      orderId: order.id,
      storeId: params.storeId,
    },
  });

  return NextResponse.json({ url: session.url }, { 
    headers: corsHeader 
  });
}