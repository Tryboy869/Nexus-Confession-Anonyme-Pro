import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendAnonymousMessage = async (
  recipientEmail: string,
  subject: string,
  content: string,
  messageId: string
): Promise<boolean> => {
  try {
    const responseUrl = `${process.env.NEXTAUTH_URL}/respond/${messageId}`;
    
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Message Anonyme</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
          .message-box { background: white; padding: 25px; border-radius: 8px; border-left: 4px solid #667eea; margin: 20px 0; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .cta-button { display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🕊️ Message Anonyme</h1>
            <p>Quelqu'un vous a envoyé un message confidentiel</p>
          </div>
          
          <div class="content">
            <div class="message-box">
              <h3>💌 ${subject}</h3>
              <p>${content.replace(/\n/g, '<br>')}</p>
            </div>
            
            <div style="text-align: center;">
              <a href="${responseUrl}" class="cta-button">
                📝 Répondre Anonymement
              </a>
              <p><small>Cliquez sur le bouton pour répondre de manière anonyme</small></p>
            </div>
            
            <div style="background: #e3f2fd; padding: 15px; border-radius: 5px; margin-top: 20px;">
              <p><strong>🔒 Confidentialité garantie :</strong></p>
              <ul>
                <li>L'expéditeur reste complètement anonyme</li>
                <li>Vous pouvez répondre sans révéler votre identité</li>
                <li>Aucune information personnelle n'est partagée</li>
              </ul>
            </div>
          </div>
          
          <div class="footer">
            <p>Ce message vous a été envoyé via Confession Anonyme Pro</p>
            <p>Un service sécurisé pour les communications confidentielles</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const emailText = `
      Message Anonyme - ${subject}
      
      ${content}
      
      Pour répondre anonymement, visitez : ${responseUrl}
      
      Ce message vous a été envoyé via Confession Anonyme Pro - Service sécurisé pour les communications confidentielles.
    `;

    const result = await resend.emails.send({
      from: process.env.SENDER_EMAIL || 'confession.anonyme.pro@gmail.com',
      to: recipientEmail,
      subject: `💌 ${subject}`,
      html: emailHtml,
      text: emailText,
    });

    return !!result.data;
  } catch (error) {
    console.error('Erreur envoi email:', error);
    return false;
  }
};

export const sendResponseNotification = async (
  originalSenderEmail: string,
  responseContent: string,
  originalSubject: string
): Promise<boolean> => {
  try {
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Réponse à votre message</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
          .message-box { background: white; padding: 25px; border-radius: 8px; border-left: 4px solid #4caf50; margin: 20px 0; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Réponse Reçue</h1>
            <p>Votre message anonyme a reçu une réponse</p>
          </div>
          
          <div class="content">
            <p><strong>Votre message original :</strong> "${originalSubject}"</p>
            
            <div class="message-box">
              <h3>💬 Réponse reçue :</h3>
              <p>${responseContent.replace(/\n/g, '<br>')}</p>
            </div>
            
            <div style="background: #e8f5e8; padding: 15px; border-radius: 5px; margin-top: 20px;">
              <p><strong>🎉 Mission accomplie !</strong></p>
              <p>Votre message a touché son destinataire et a généré une réponse constructive.</p>
            </div>
          </div>
          
          <div class="footer">
            <p>Merci d'utiliser Confession Anonyme Pro</p>
            <p>Pour envoyer d'autres messages anonymes, visitez notre plateforme</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const result = await resend.emails.send({
      from: process.env.SENDER_EMAIL || 'confession.anonyme.pro@gmail.com',
      to: originalSenderEmail,
      subject: `✅ Réponse à votre message: ${originalSubject}`,
      html: emailHtml,
    });

    return !!result.data;
  } catch (error) {
    console.error('Erreur envoi notification:', error);
    return false;
  }
};
