import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { Message } from "@/models/Message";
import { moderateContent } from "@/lib/moderation"; // On importe notre modérateur

export async function POST(request: Request) {
  await dbConnect();

  const { username, content, template } = await request.json();

  try {
    // --- Étape 1: Modération du contenu avant tout ---
    const isContentSafe = await moderateContent(content);
    if (!isContentSafe) {
      return Response.json(
        {
          success: false,
          message: "Le message a été jugé inapproprié et n'a pas été envoyé.",
        },
        { status: 400 }
      );
    }

    // --- Étape 2: Trouver l'utilisateur destinataire ---
    const user = await UserModel.findOne({ username });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "Utilisateur non trouvé.",
        },
        { status: 404 }
      );
    }

    // --- Étape 3: Vérifier si l'utilisateur accepte les messages ---
    if (!user.isAcceptingMessages) {
      return Response.json(
        {
          success: false,
          message: "Cet utilisateur n'accepte pas les messages pour le moment.",
        },
        { status: 403 } // 403 Forbidden: action non autorisée
      );
    }
    
    // --- Étape 4 (Logique Freemium - Optionnelle pour le début mais structurée) ---
    // Note: Pour une vraie logique freemium, il faudrait identifier l'expéditeur.
    // Pour un envoi 100% anonyme sans compte, on ne peut pas décompter.
    // Cette structure est une préparation pour quand un utilisateur connecté envoie un message.

    // --- Étape 5: Créer le nouveau message ---
    const newMessage = { 
        content, 
        template: template || 'libre', // On s'assure d'avoir un template
        createAt: new Date(),
        messageType: 'feedback' // C'est un message de feedback par défaut
    };

    // --- Étape 6: Ajouter le message à la liste des messages de l'utilisateur ---
    user.messages.push(newMessage as Message);
    await user.save();

    return Response.json(
      {
        success: true,
        message: "Message envoyé avec succès.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de l'envoi du message:", error);
    return Response.json(
      {
        success: false,
        message: "Une erreur interne est survenue.",
      },
      { status: 500 }
    );
  }
          }
        
