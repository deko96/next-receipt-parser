import DragAndDropUploader from "../components/FullScreenDragAndDropUploader/FullScreenDragAndDropUploader";
import { useRouter } from "next/router";
import api from "@/services/api";
import { useState } from "react";
import { isAxiosError } from "axios";

export default function Home() {
  const router = useRouter();

  const handleFileDrop = async (file) => {
    const { data } = await api.postForm("/receipts/process", {
      file,
    });

    return router.push(`/receipts/${data.receipt.id}`);
  };

  return <DragAndDropUploader onFileDrop={handleFileDrop} />;
}
