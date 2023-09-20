-- CreateTable
CREATE TABLE "Upload" (
    "id" SERIAL NOT NULL,
    "filename" TEXT NOT NULL,

    CONSTRAINT "Upload_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Receipt" (
    "id" SERIAL NOT NULL,
    "merchant" TEXT,
    "total" INTEGER NOT NULL,
    "date" TIMESTAMP(3),
    "upload_id" INTEGER NOT NULL,

    CONSTRAINT "Receipt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "product_code" TEXT,
    "price" DECIMAL(65,30) NOT NULL,
    "receipt_id" INTEGER NOT NULL,
    "category_id" INTEGER,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Upload_filename_key" ON "Upload"("filename");

-- CreateIndex
CREATE UNIQUE INDEX "Receipt_upload_id_key" ON "Receipt"("upload_id");

-- AddForeignKey
ALTER TABLE "Receipt" ADD CONSTRAINT "Receipt_upload_id_fkey" FOREIGN KEY ("upload_id") REFERENCES "Upload"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_receipt_id_fkey" FOREIGN KEY ("receipt_id") REFERENCES "Receipt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
