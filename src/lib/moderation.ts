
interface ModerationResponse {
    label: string;
    score: number;
}

export async function moderateContent(text: string): Promise<boolean> {
  const API_URL = "https://api-inference.huggingface.co/models/unitary/toxic-bert";
  const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;

  if (!HUGGINGFACE_API_KEY) {
    console.warn("⚠️ Clé API Hugging Face non configurée. La modération est désactivée.");
    return true;
  }

  try {
    const response = await fetch(API_URL, {
      headers: {
        Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({ inputs: text }),
    });

    if (!response.ok) {
        console.error("Erreur de l'API de modération:", response.statusText);
        return true;
    }

    const results: ModerationResponse[][] = await response.json();
    const toxicResult = results[0].find(res => res.label.toLowerCase() === 'toxic');

    if (toxicResult && toxicResult.score > 0.8) {
      console.log(`❌ Contenu bloqué pour toxicité. Score: ${toxicResult.score}`);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Erreur lors de l'appel à l'API de modération:", error);
    return true;
  }
}
