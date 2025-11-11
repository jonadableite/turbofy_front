-- CreateTable
CREATE TABLE "Merchant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "document" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "balance" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "fee" DECIMAL(65,30) NOT NULL DEFAULT 0,

    CONSTRAINT "Merchant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "description" TEXT NOT NULL,
    "merchantId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerDocument" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "metadata" JSONB,
    "transactionId" TEXT,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PixKey" (
    "id" TEXT NOT NULL,
    "merchantId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "PixKey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BankAccount" (
    "id" TEXT NOT NULL,
    "merchantId" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "bankCode" TEXT NOT NULL,
    "accountType" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "accountDigit" TEXT NOT NULL,
    "branchNumber" TEXT NOT NULL,
    "branchDigit" TEXT,
    "document" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BankAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SplitRule" (
    "id" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,
    "merchantId" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "percentage" DECIMAL(65,30),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SplitRule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Merchant_email_key" ON "Merchant"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Merchant_document_key" ON "Merchant"("document");

-- CreateIndex
CREATE UNIQUE INDEX "PixKey_key_key" ON "PixKey"("key");

-- CreateIndex
CREATE UNIQUE INDEX "BankAccount_merchantId_key" ON "BankAccount"("merchantId");

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PixKey" ADD CONSTRAINT "PixKey_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankAccount" ADD CONSTRAINT "BankAccount_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SplitRule" ADD CONSTRAINT "SplitRule_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
