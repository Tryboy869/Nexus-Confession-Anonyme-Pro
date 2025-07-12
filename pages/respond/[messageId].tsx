import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ResponseForm from "@/components/ResponseForm";

export default function RespondPage() {
  const router = useRouter();
  const { messageId } = router.query;
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!messageId) return;
    fetch(`/api/messages?id=${messageId}`)
      .then((res) => res.json())
      .then((data) => setMessage(data.message));
  }, [messageId]);

  return (
    <div className="max-w-xl mx-auto mt-10 p-4">
      <h1 className="text-xl font-bold mb-4">Vous avez reçu un message anonyme</h1>
      {message ? (
        <>
          <p className="bg-gray-100 p-4 rounded mb-4">{message}</p>
          <ResponseForm messageId={messageId as string} />
        </>
      ) : (
        <p>Chargement...</p>
      )}
    </div>
  );
      }
