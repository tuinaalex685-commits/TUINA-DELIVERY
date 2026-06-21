"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

function generateTrackingId() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export async function createOrder(formData: FormData) {
  const agencyId = formData.get('agencyId') as string;
  const senderName = formData.get("senderName") as string;
  const senderPhone = formData.get("senderPhone") as string;
  const senderAddress = formData.get("senderAddress") as string;
  
  const receiverName = formData.get("receiverName") as string;
  const receiverPhone = formData.get("receiverPhone") as string;
  const receiverAddress = formData.get("receiverAddress") as string;
  
  const packageDesc = formData.get("packageDesc") as string;
  const packageValue = formData.get("packageValue") as string;
  const paymentMethod = formData.get("paymentMethod") as string;

  const trackingId = generateTrackingId();

  const newOrder = await prisma.order.create({
    data: {
      trackingId,
      senderName,
      senderPhone,
      senderAddress,
      receiverName,
      receiverPhone,
      receiverAddress,
      packageDesc,
      packageValue: packageValue || null,
      paymentMethod,
      agencyId: agencyId || null,
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
