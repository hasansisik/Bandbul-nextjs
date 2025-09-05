import { Suspense } from "react";
import { MessagesPage } from "../../../components/MessagesPage";

export default function Messages() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MessagesPage />
    </Suspense>
  );
}
