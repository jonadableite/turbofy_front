export interface PixIssueInput {
  amountCents: number;
  merchantId: string;
  description?: string;
  expiresAt?: Date;
}

export interface PixIssueOutput {
  qrCode: string;
  copyPaste: string;
  expiresAt: Date;
}

export interface BoletoIssueInput {
  amountCents: number;
  merchantId: string;
  description?: string;
  expiresAt?: Date;
}

export interface BoletoIssueOutput {
  boletoUrl: string;
  expiresAt: Date;
}

export interface PaymentProviderPort {
  issuePixCharge(input: PixIssueInput): Promise<PixIssueOutput>;
  issueBoletoCharge(input: BoletoIssueInput): Promise<BoletoIssueOutput>;
}