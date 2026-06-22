import { Resend } from 'resend';

// Initialize Resend with the API key from environment variables
// If it's missing, we still initialize it but catch errors later
const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key');

export async function sendVerificationEmail(email: string, token: string) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const confirmLink = `${appUrl}/api/verify-email?token=${token}`;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #1e3a8a;">Bienvenue sur Tuina Delivery !</h1>
      <p>Merci de vous être inscrit. Pour des raisons de sécurité, nous devons vérifier votre adresse email.</p>
      <p>Veuillez cliquer sur le bouton ci-dessous pour activer votre compte :</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${confirmLink}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
          Vérifier mon email
        </a>
      </div>
      <p style="color: #64748b; font-size: 14px;">Si le bouton ne fonctionne pas, copiez-collez ce lien dans votre navigateur :<br/> ${confirmLink}</p>
    </div>
  `;

  // If there is no API key, log the link to the console for development/simulation
  if (!process.env.RESEND_API_KEY) {
    console.log('----------------------------------------------------');
    console.log(' SIMULATION EMAIL DE VERIFICATION (Pas de clé API Resend)');
    console.log(` A: ${email}`);
    console.log(` LIEN: ${confirmLink}`);
    console.log('----------------------------------------------------');
    return { success: true, simulated: true };
  }

  try {
    const data = await resend.emails.send({
      from: 'Tuina Delivery <onboarding@resend.dev>', // Change to your verified domain later
      to: email,
      subject: 'Vérifiez votre adresse email - Tuina Delivery',
      html: htmlContent,
    });

    return { success: true, data };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}
