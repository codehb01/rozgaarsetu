import React from "react";
import { TranslatedText } from "@/components/translation/auto-translate";

export default function WorkerProfilePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6"><TranslatedText context="worker-profile">Worker Profile</TranslatedText></h1>
      <p className="text-gray-600"><TranslatedText context="worker-profile">Profile page coming soon...</TranslatedText></p>
    </div>
  );
}
