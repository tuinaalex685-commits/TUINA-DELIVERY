"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";

export async function addDriver(formData: FormData) {
  const session = await getSession();
  if (!session) return { error: "Non autorisé" };

  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;

  if (!name || !phone) return { error: "Nom et téléphone requis" };

  await prisma.driver.create({
    data: { name, phone, agencyId: session.agencyId }
  });

  revalidatePath("/admin/drivers");
}

export async function deleteDriver(id: string) {
  const session = await getSession();
  if (!session) return { error: "Non autorisé" };

  await prisma.driver.deleteMany({ where: { id, agencyId: session.agencyId } });
  revalidatePath("/admin/drivers");
}
