"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";

import { driverSchema } from "@/lib/validations";

export async function addDriver(formData: FormData): Promise<void> {
  const session = await getSession();
  if (!session) return;

  const rawData = {
    name: formData.get("name") as string,
    phone: formData.get("phone") as string,
    agencyId: session.agencyId
  };

  const validationResult = driverSchema.safeParse(rawData);

  if (!validationResult.success) {
    throw new Error(validationResult.error.errors[0].message);
  }

  await prisma.driver.create({
    data: { name: validationResult.data.name, phone: validationResult.data.phone, agencyId: session.agencyId }
  });

  revalidatePath("/admin/drivers");
}

export async function deleteDriver(id: string): Promise<void> {
  const session = await getSession();
  if (!session) return;

  await prisma.driver.deleteMany({ where: { id, agencyId: session.agencyId } });
  revalidatePath("/admin/drivers");
}
