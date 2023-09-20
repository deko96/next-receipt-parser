import DragAndDropUploader from "../components/FullScreenDragAndDropUploader/FullScreenDragAndDropUploader";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  const handleFileDrop = async (file) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const receiptId = "demo-receipt";
    console.log("this is file", file);
    router.push(`/receipts/${receiptId}`);
  };

  return <DragAndDropUploader onFileDrop={handleFileDrop} />;
}
