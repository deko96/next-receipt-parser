import DragAndDropUploader from "../components/DragAndDropUploader";
import { useRouter } from "next/router";
import api from "../services/api";

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
