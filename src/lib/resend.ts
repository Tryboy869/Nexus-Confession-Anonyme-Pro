
import { Resend } from 'resend';
import { ApiResponse } from '@/types/ApiResponse';

const resend = new Resend(process.env.RESEND_API_KEY);
const domain = process.env.DOMAIN;

export async function sendFeedbackLinkEmail(
  email: string,
  username: string,
  messageId: string
): Promise<ApiResponse> {
  try {
    const responseLink = `${domain}/respond/${messageId}`;

    await resend.emails.send({
      from: 'Confession Anonyme Pro <onboarding@resend.dev>',
      to: email,
      subject: 'Quelqu\'un vous a laissé un message anonyme',
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2>Bonjour ${username},</h2>
          <p>Vous avez reçu un nouveau message anonyme sur la plateforme Confession Anonyme Pro.</p>
          <a href="${responseLink}" style="background-color: #4CAF50; color: white; padding: 14px 25px; text-align: center; text-decoration: none; display: inline-block; border-radius: 8px;">Voir le message</a>
          <p>L'équipe de Confession Anonyme Pro</p>
        </div>
      `,
    });

    return { success: true, message: 'Email de feedback envoyé avec succès.' };
  } catch (emailError) {
    console.error("Erreur lors de l'envoi de l'email de feedback", emailError);
    return { success: false, message: "Échec de l'envoi de l'email de feedback." };
  }
}
