import { Suspense } from "react";
import { MessagesPage } from "@/components/MessagesPage";
import { AuthMiddleware } from "@/components/AuthMiddleware";

export default function Messages() {
  return (
    <AuthMiddleware>
      <Suspense fallback={<div>Loading...</div>}>
        <MessagesPage />
      </Suspense>
    </AuthMiddleware>
  );
}
