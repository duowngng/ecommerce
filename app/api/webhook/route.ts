import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase-config";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body, 
      signature, 
      process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  const address = session?.customer_details?.address;

  const addressComponents = [
    address?.line1,
    address?.line2,
    address?.city,
    address?.state,
    address?.postal_code,
    address?.country
  ];

  const addressString = addressComponents.filter((c) => c !== null).join(', ');

  if (event.type === "checkout.session.completed") {
    const orderId = session?.metadata?.orderId || "";
    const storeId = session?.metadata?.storeId || "";

    const orderRef = doc(
      db,
      "stores",
      storeId,
      "orders",
      orderId
    );
    const orderDoc = await getDoc(orderRef);
    const orderData = orderDoc.data();

    const order = await updateDoc(orderRef, {
      ...orderData, 
      isPaid: true,
      address: addressString,
      phone: session?.customer_details?.phone || "",
    });


    for (const orderItem of orderData?.orderItems) {

      const productRef = doc(
        db,
        "stores",
        storeId,
        "products",
        orderItem.product.id
      );
      const productDoc = await getDoc(productRef);
      const productData = productDoc.data();

      const newQuantity = productData?.quantity - orderItem.quantity;

      await updateDoc(productRef, {
        quantity: newQuantity,
        isArchived: newQuantity === 0,
        isFeatured: newQuantity > 0,
      });
    } 
  }

  return new NextResponse(null, { status: 200 });
}