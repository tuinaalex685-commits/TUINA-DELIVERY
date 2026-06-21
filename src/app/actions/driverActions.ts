"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";

export async function addDriver(formData: FormData): Promise<void> {
  const session = await getSession();
  if (!session) return;

  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;

  if (!name || !phone) return;

  await prisma.driver.create({
    data: { name, phone, agencyId: session.agencyId }
  });

  revalidatePath("/admin/drivers");
}

export async function deleteDriver(id: string): Promise<void> {
  const session = await getSession();
  if (!session) return;

  await prisma.driver.deleteMany({ where: { id, agencyId: session.agencyId } });
  revalidatePath("/admin/drivers");
}
