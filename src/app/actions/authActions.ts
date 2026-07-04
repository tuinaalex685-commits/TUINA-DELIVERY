"use server";

import { prisma } from "@/lib/prisma";
import { encrypt } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";

import { authSchema } from "@/lib/validations";
import { sendVerificationEmail } from "@/lib/email";
import crypto from "crypto";

export async function signupAction(prevState: any, formData: FormData) {
  const rawData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const validationResult = authSchema.safeParse(rawData);
  if (!validationResult.success) {
    return { error: validationResult.error.issues[0].message };
  }
  
  const { email, password } = validationResult.data;

  try {
    const existingEmail = await prisma.agency.findUnique({ where: { email } });
    if (existingEmail) {
      return { error: "Cet email est déjà utilisé." };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    await prisma.agency.create({
      data: { 
        email, 
        password: hashedPassword,
        verificationToken 
      }
    });

    // Envoi de l'email de vérification
    await sendVerificationEmail(email, verificationToken);
  } catch (error) {
    console.error("Signup error:", error);
    return { error: "Impossible de se connecter à la base de données. Vérifiez vos identifiants Supabase." };
  }

  // Redirection vers une page d'attente
  redirect("/verify-email?sent=true");
}

export async function loginAction(prevState: any, formData: FormData) {
  const rawData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const validationResult = authSchema.safeParse(rawData);
  if (!validationResult.success) {
    return { error: validationResult.error.issues[0].message };
  }

  const { email, password } = validationResult.data;

  let agency;
  try {
    agency = await prisma.agency.findUnique({ where: { email } });
  } catch (error) {
    console.error("Login DB error:", error);
    return { error: "Impossible de se connecter à la base de données. Vérifiez vos identifiants Supabase." };
  }

  if (!agency) {
    return { error: "Email ou mot de passe incorrect." };
  }

  if (!agency.emailVerified) {
    return { error: "Veuillez vérifier votre email avant de vous connecter." };
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
