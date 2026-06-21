"use server";

import { prisma } from "@/lib/prisma";
import { encrypt } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";

export async function signupAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Veuillez remplir tous les champs." };
  }

  // Vérifier si une agence existe déjà (si on veut limiter à une seule, décommenter)
  /*
  const existingAgencyCount = await prisma.agency.count();
  if (existingAgencyCount > 0) {
    return { error: "Une agence est déjà enregistrée sur ce système." };
  }
  */

  const existingEmail = await prisma.agency.findUnique({ where: { email } });
  if (existingEmail) {
    return { error: "Cet email est déjà utilisé." };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const agency = await prisma.agency.create({
    data: { email, password: hashedPassword }
  });

  // Créer la session
  const session = await encrypt({ agencyId: agency.id, email: agency.email });
  (await cookies()).set("session", session, { httpOnly: true, secure: true, sameSite: "lax", maxAge: 60 * 60 * 24 * 7 });

  redirect("/admin");
}

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Veuillez remplir tous les champs." };
  }

  const agency = await prisma.agency.findUnique({ where: { email } });
  if (!agency) {
    return { error: "Email ou mot de passe incorrect." };
  }

  const isValid = await bcrypt.compare(password, agency.password);
  if (!isValid) {
    return { error: "Email ou mot de passe incorrect." };
  }

  // Créer la session
  const session = await encrypt({ agencyId: agency.id, email: agency.email });
  (await cookies()).set("session", session, { httpOnly: true, secure: true, sameSite: "lax", maxAge: 60 * 60 * 24 * 7 });

  redirect("/admin");
}

export async function logoutAction() {
  (await cookies()).delete("session");
  redirect("/login");
}
