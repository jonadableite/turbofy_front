import { Payment } from "../../domain/entities/Payment";

export interface PaymentRepository {
  save(payment: Payment): Promise<Payment>;
  findById(id: string): Promise<Payment | null>;
  findByMerchantId(
    merchantId: string,
    options?: {
      limit?: number;
      offset?: number;
      status?: string;
    }
  ): Promise<Payment[]>;
  update(payment: Payment): Promise<Payment>;
  countByMerchantId(
    merchantId: string,
    options?: { status?: string }
  ): Promise<number>;
}
