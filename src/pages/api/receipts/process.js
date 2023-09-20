import multer from "multer";
import { PrismaClient } from "@prisma/client";
import {
  DocumentAnalysisClient,
  AzureKeyCredential,
} from "@azure/ai-form-recognizer";
import { PrebuiltReceiptModel } from "../../../models/receipt";
import { sleep } from "@/utils/sleep";

const ALLOWED_MIMETYPES = ["image/png", "image/jpg", "image/jpeg"];
const upload = multer({ storage: multer.memoryStorage() });
const prisma = new PrismaClient();

const client = new DocumentAnalysisClient(
  process.env.AZURE_COGNITIVE_SERVICES_ENDPOINT,
  new AzureKeyCredential(process.env.AZURE_COGNITIVE_SERVICES_API_KEY)
);

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({
      message: "Only POST method is allowed for this endpoint",
    });
  }

  upload.single("file")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: "File upload failed" });
    }

    const { file } = req;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    if (!ALLOWED_MIMETYPES.includes(file.mimetype)) {
      return res.status(400).json({
        message:
          "Invalid file type. Allowed types: " + ALLOWED_MIMETYPES.toString(),
      });
    }

    try {
      const existingUploadedReceipt = await prisma.upload.findUnique({
        where: {
          filename: file.originalname,
        },
        include: {
          receipt: true,
        },
      });

      if (existingUploadedReceipt) {
        await sleep();
        return res.status(200).json(existingUploadedReceipt);
      }

      const poller = await client.beginAnalyzeDocument(
        PrebuiltReceiptModel,
        file.buffer,
        {
          onProgress: ({ status }) => {
            console.log(`Document analysis progress`, status);
          },
        }
      );

      const {
        documents: [receiptDocument],
      } = await poller.pollUntilDone();

      if (!receiptDocument.fields) {
        return res.status(400).json({
          message:
            "Could not detect any items in the receipt. Are you sure that you've uploaded the correct document?",
        });
      }

      const txnDate = receiptDocument.fields.transactionDate?.value
        ? new Date(receiptDocument.fields.transactionDate?.value)
        : null;

      const uploadedReceipt = await prisma.upload.create({
        data: {
          filename: file.originalname,
          receipt: {
            create: {
              merchant: receiptDocument.fields.merchantName?.value,
              total: receiptDocument.fields.total?.value || 0,
              date: txnDate,
              items: {
                createMany: {
                  data: receiptDocument.fields.items?.values?.map((item) => ({
                    description: item.properties.description?.value,
                    quantity: item.properties.quantity?.value,
                    product_code: item.properties.productCode?.value,
                    price:
                      item.properties.price?.value ||
                      item.properties.totalPrice?.value,
                  })),
                },
              },
            },
          },
        },
        include: {
          receipt: true,
        },
      });

      return res.json(uploadedReceipt);
    } catch (error) {
      return res
        .status(500)
        .json({ message: error.message || "Unknown error occured" });
    } finally {
      await prisma.$disconnect();
    }
  });
};
