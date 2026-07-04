'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getAgencySettings() {
  const agency = await prisma.agency.findFirst();
  return agency;
}

export async function updateAgencySettings(formData: FormData) {
  try {
    const name = formData.get('name') as string;
    const whatsappNumber = formData.get('whatsappNumber') as string;
    const orangeMoneyNumber = formData.get('orangeMoneyNumber') as string;

    const agency = await prisma.agency.findFirst();

    if (!agency) {
      return { success: false, error: "Aucune agence trouvée dans le système." };
    }

    await prisma.agency.update({
      where: { id: agency.id },
      data: {
        name,
        whatsappNumber,
        orangeMoneyNumber
      }
    });

    revalidatePath('/admin');
    revalidatePath('/admin/settings');
    revalidatePath('/order');

    return { success: true };
  } catch (error) {
    console.error("Erreur mise à jour paramètres:", error);
    return { success: false, error: "Erreur lors de la mise à jour." };
  }
}
