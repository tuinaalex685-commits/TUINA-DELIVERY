"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

function generateTrackingId() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

import { orderSchema } from "@/lib/validations";

export async function createOrder(formData: FormData) {
  // Anti-Spam (Honeypot) Check
  const honeypot = formData.get("_website");
  if (honeypot) {
    // Si un bot remplit le champ caché, on fait semblant que ça a marché pour ne pas l'alerter
    return { success: true, trackingId: "B0T-DETECTED-IGNORE" };
  }

  const rawData = {
    agencyId: formData.get('agencyId') as string,
    senderName: formData.get("senderName") as string,
    senderPhone: formData.get("senderPhone") as string,
    senderAddress: formData.get("senderAddress") as string,
    receiverName: formData.get("receiverName") as string,
    receiverPhone: formData.get("receiverPhone") as string,
    receiverAddress: formData.get("receiverAddress") as string,
    packageDesc: formData.get("packageDesc") as string,
    packageValue: formData.get("packageValue") as string,
    paymentMethod: formData.get("paymentMethod") as string,
  };

  const validationResult = orderSchema.safeParse(rawData);
  
  if (!validationResult.success) {
    throw new Error(validationResult.error.errors[0].message);
  }

  const trackingId = generateTrackingId();
  const data = validationResult.data;

  const newOrder = await prisma.order.create({
    data: {
      trackingId,
      senderName: data.senderName,
      senderPhone: data.senderPhone,
      senderAddress: data.senderAddress,
      receiverName: data.receiverName,
      receiverPhone: data.receiverPhone,
      receiverAddress: data.receiverAddress,
      packageDesc: data.packageDesc,
      packageValue: data.packageValue || null,
      paymentMethod: data.paymentMethod,
      agencyId: data.agencyId || null,
      status: "pending"
    }
  });

  revalidatePath('/admin');
  return { success: true, trackingId };
}

export async function updateOrderStatus(trackingId: string, newStatus: string) {
  await prisma.order.update({
    where: { trackingId },
    data: { status: newStatus }
  });
  revalidatePath(`/track/${trackingId}`);
  revalidatePath(`/livreur/${trackingId}`);
  revalidatePath('/admin');
}

export async function assignDriver(trackingId: string, driverId: string) {
  await prisma.order.update({
    where: { trackingId },
    data: { 
      driverId, 
      status: "assigned" 
    }
  });
  revalidatePath("/admin");
  revalidatePath(`/admin/orders/${trackingId}`);
}
