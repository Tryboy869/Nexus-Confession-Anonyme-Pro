import { useState } from "react";
import MessageForm from "@/components/MessageForm";
import TemplateSelector from "@/components/TemplateSelector";

export default function Home() {
  const [prefill, setPrefill] = useState("");

  return (
    <div className="max-w-xl mx-auto p-4 mt-10">
      <h1 className="text-2xl font-bold mb-4">Envoyer un message anonyme</h1>
      <TemplateSelector onSelect={(text) => setPrefill(text)} />
      <div className="mt-6">
        <MessageForm prefill={prefill} />
      </div>
    </div>
  );
}
