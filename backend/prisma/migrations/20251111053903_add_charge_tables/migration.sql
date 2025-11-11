-- CreateEnum
CREATE TYPE "ChargeStatus" AS ENUM ('PENDING', 'PAID', 'EXPIRED', 'CANCELED');

-- CreateTable
CREATE TABLE "UserToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "replacedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuthAttempt" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "windowStart" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lockedUntil" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuthAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Charge" (
    "id" TEXT NOT NULL,
    "merchantId" TEXT NOT NULL,
    "amountCents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'BRL',
    "description" TEXT,
    "status" "ChargeStatus" NOT NULL DEFAULT 'PENDING',
    "method" TEXT,
    "expiresAt" TIMESTAMP(3),
    "idempotencyKey" TEXT NOT NULL,
    "externalRef" TEXT,
    "metadata" JSONB,
    "pixQrCode" TEXT,
    "pixCopyPaste" TEXT,
    "boletoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Charge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChargeSplit" (
    "id" TEXT NOT NULL,
    "chargeId" TEXT NOT NULL,
    "merchantId" TEXT NOT NULL,
    "amountCents" INTEGER NOT NULL,
    "percentage" DECIMAL(65,30),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChargeSplit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fee" (
    "id" TEXT NOT NULL,
    "chargeId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "amountCents" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Fee_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserToken_tokenHash_key" ON "UserToken"("tokenHash");

-- CreateIndex
CREATE INDEX "UserToken_userId_idx" ON "UserToken"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "AuthAttempt_email_ip_key" ON "AuthAttempt"("email", "ip");

-- CreateIndex
CREATE UNIQUE INDEX "Charge_idempotencyKey_key" ON "Charge"("idempotencyKey");

-- CreateIndex
CREATE UNIQUE INDEX "Charge_externalRef_key" ON "Charge"("externalRef");

-- CreateIndex
CREATE INDEX "Charge_merchantId_idx" ON "Charge"("merchantId");

-- CreateIndex
CREATE INDEX "ChargeSplit_chargeId_idx" ON "ChargeSplit"("chargeId");

-- CreateIndex
CREATE INDEX "ChargeSplit_merchantId_idx" ON "ChargeSplit"("merchantId");

-- CreateIndex
CREATE INDEX "Fee_chargeId_idx" ON "Fee"("chargeId");

-- AddForeignKey
ALTER TABLE "UserToken" ADD CONSTRAINT "UserToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Charge" ADD CONSTRAINT "Charge_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChargeSplit" ADD CONSTRAINT "ChargeSplit_chargeId_fkey" FOREIGN KEY ("chargeId") REFERENCES "Charge"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChargeSplit" ADD CONSTRAINT "ChargeSplit_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fee" ADD CONSTRAINT "Fee_chargeId_fkey" FOREIGN KEY ("chargeId") REFERENCES "Charge"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
