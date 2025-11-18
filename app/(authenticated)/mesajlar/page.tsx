import { Suspense } from "react";
import { MessagesPage } from "@/components/MessagesPage";
import { AuthMiddleware } from "@/components/AuthMiddleware";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Bandbul- Mesajlar", };
}
export default function Messages() {
  return (
    <AuthMiddleware>
      <Suspense fallback={<div>Loading...</div>}>
        <MessagesPage />
      </Suspense>
    </AuthMiddleware>
  );
}
