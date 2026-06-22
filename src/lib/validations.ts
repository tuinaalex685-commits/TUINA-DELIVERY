import { z } from "zod";

export const orderSchema = z.object({
  agencyId: z.string().optional().nullable(),
  senderName: z.string().min(2, "Le nom de l'expéditeur doit faire au moins 2 caractères"),
  senderPhone: z.string().min(8, "Le numéro de téléphone de l'expéditeur est invalide"),
  senderAddress: z.string().min(5, "L'adresse de l'expéditeur est trop courte"),
  receiverName: z.string().min(2, "Le nom du destinataire doit faire au moins 2 caractères"),
  receiverPhone: z.string().min(8, "Le numéro de téléphone du destinataire est invalide"),
  receiverAddress: z.string().min(5, "L'adresse du destinataire est trop courte"),
  packageDesc: z.string().min(2, "La description du colis est requise"),
  packageValue: z.string().optional().nullable(),
  paymentMethod: z.string().min(1, "La méthode de paiement est requise"),
});

export const driverSchema = z.object({
  name: z.string().min(2, "Le nom du livreur doit faire au moins 2 caractères"),
  phone: z.string().min(8, "Le numéro de téléphone est invalide"),
  agencyId: z.string().min(1, "L'identifiant de l'agence est requis"),
});

export const authSchema = z.object({
  email: z.string().email("Format d'email invalide"),
  password: z.string().min(6, "Le mot de passe doit faire au moins 6 caractères"),
});
