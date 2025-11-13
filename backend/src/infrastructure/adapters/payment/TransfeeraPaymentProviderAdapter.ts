/**
 * Adapter para integração com Transfeera
 * Implementa PaymentProviderPort seguindo arquitetura hexagonal
 * 
 * @security Autenticação OAuth2 gerenciada pelo TransfeeraClient
 * @performance Cache de token de acesso automático
 * @maintainability Isolamento completo da implementação Transfeera
 */

import {
  PaymentProviderPort,
  PixIssueInput,
  PixIssueOutput,
  BoletoIssueInput,
  BoletoIssueOutput,
} from "../../../ports/PaymentProviderPort";
import { TransfeeraClient } from "./TransfeeraClient";
import { logger } from "../../logger";
import { env } from "../../../config/env";

export class TransfeeraPaymentProviderAdapter implements PaymentProviderPort {
  private client: TransfeeraClient;
  private pixKey: string;

  constructor() {
    if (!env.TRANSFEERA_ENABLED) {
      throw new Error("Transfeera is not enabled. Set TRANSFEERA_ENABLED=true");
    }

    if (!env.TRANSFEERA_CLIENT_ID || !env.TRANSFEERA_CLIENT_SECRET) {
      throw new Error(
        "Transfeera credentials not configured. Set TRANSFEERA_CLIENT_ID and TRANSFEERA_CLIENT_SECRET"
      );
    }

    if (!env.TRANSFEERA_PIX_KEY) {
      logger.warn("TRANSFEERA_PIX_KEY not configured. Pix charges may fail.");
    }

    this.client = new TransfeeraClient();
    this.pixKey = env.TRANSFEERA_PIX_KEY || "";
  }

  /**
   * Emite uma cobrança Pix usando Transfeera
   */
  async issuePixCharge(input: PixIssueInput): Promise<PixIssueOutput> {
    try {
      if (!this.pixKey) {
        throw new Error("Pix key not configured. Set TRANSFEERA_PIX_KEY environment variable");
      }

      const amount = input.amountCents / 100; // Converter centavos para reais

      // Gerar txid único se não fornecido
      const txid = this.generateTxId(input.merchantId);

      // Calcular expiração em segundos
      const expirationSeconds = input.expiresAt
        ? Math.floor((input.expiresAt.getTime() - Date.now()) / 1000)
        : 86400; // Padrão 24 horas

      // Criar cobrança imediata (QR Code dinâmico)
      const response = await this.client.createImmediateCharge({
        pixKey: this.pixKey,
        originalValue: amount,
        txid,
        integrationId: input.merchantId,
        expiration: expirationSeconds,
        payerQuestion: input.description,
        additionalInfo: input.description
          ? [{ key: "Descrição", value: input.description }]
          : undefined,
      });

      logger.info(
        {
          txid: response.txid,
          amount,
          pixKey: this.pixKey,
          merchantId: input.merchantId,
        },
        "Pix charge created via Transfeera"
      );

      return {
        qrCode: response.image_base64,
        copyPaste: response.emv_payload,
        expiresAt: input.expiresAt || new Date(Date.now() + expirationSeconds * 1000),
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      logger.error(
        {
          error: errorMessage,
          input,
        },
        "Failed to issue Pix charge via Transfeera"
      );
      throw new Error(`Failed to issue Pix charge: ${errorMessage}`);
    }
  }

  /**
   * Emite uma cobrança Boleto usando Transfeera
   * Nota: Transfeera usa cobrança com vencimento para boletos
   */
  async issueBoletoCharge(input: BoletoIssueInput): Promise<BoletoIssueOutput> {
    try {
      if (!this.pixKey) {
        throw new Error("Pix key not configured. Set TRANSFEERA_PIX_KEY environment variable");
      }

      const amount = input.amountCents / 100; // Converter centavos para reais
      const dueDate = input.expiresAt || new Date(Date.now() + 3 * 24 * 60 * 60 * 1000); // Padrão 3 dias

      // Gerar txid único
      const txid = this.generateTxId(input.merchantId);

      // Criar cobrança com vencimento (equivalente a boleto)
      const response = await this.client.createDueDateCharge({
        pixKey: this.pixKey,
        dueDate: dueDate.toISOString().split("T")[0], // Formato YYYY-MM-DD
        originalValue: amount,
        txid,
        integrationId: input.merchantId,
        expirationAfterDueDate: 0, // Não expira após vencimento
        payer: {
          name: "Pagador", // Será preenchido quando o pagamento for feito
          document: "00000000000",
        },
        payerQuestion: input.description,
        additionalInfo: input.description
          ? [{ key: "Descrição", value: input.description }]
          : undefined,
      });

      logger.info(
        {
          txid: response.txid,
          amount,
          dueDate: dueDate.toISOString(),
          merchantId: input.merchantId,
        },
        "Boleto charge created via Transfeera"
      );

      // Para boletos, retornamos o QR Code Pix como alternativa
      // Em produção, você pode querer usar o endpoint de boletos específico da Transfeera
      return {
        boletoUrl: `https://app.transfeera.com/pay/${response.txid}`, // URL alternativa
        expiresAt: dueDate,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      logger.error(
        {
          error: errorMessage,
          input,
        },
        "Failed to issue Boleto charge via Transfeera"
      );
      throw new Error(`Failed to issue Boleto charge: ${errorMessage}`);
    }
  }

  /**
   * Consulta saldo disponível na Transfeera
   */
  async getBalance(): Promise<{ available: number; waiting: number }> {
    try {
      const balance = await this.client.getBalance();
      return {
        available: balance.value * 100, // Converter para centavos
        waiting: balance.waiting_value * 100,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      logger.error({ error: errorMessage }, "Failed to get balance from Transfeera");
      throw new Error(`Failed to get balance: ${errorMessage}`);
    }
  }

  /**
   * Consulta Pix recebidos
   */
  async getReceivedPix(params?: {
    startDate?: Date;
    endDate?: Date;
    txid?: string;
  }): Promise<
    Array<{
      id: string;
      value: number;
      end2endId: string;
      txid?: string;
      pixKey: string;
      payer: {
        name: string;
        document: string;
      };
      createdAt: Date;
    }>
  > {
    try {
      const cashInList = await this.client.getCashIn({
        initialDate: params?.startDate?.toISOString(),
        endDate: params?.endDate?.toISOString(),
        txid: params?.txid,
        type: "DEPOSIT", // Apenas depósitos, não devoluções
      });

      return cashInList.entries.map((entry) => ({
        id: entry.id,
        value: Math.round(entry.value * 100), // Converter para centavos
        end2endId: entry.end2end_id,
        txid: entry.txid,
        pixKey: entry.pix_key,
        payer: {
          name: entry.payer.name,
          document: entry.payer.document,
        },
        createdAt: new Date(), // A API não retorna created_at diretamente
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      logger.error({ error: errorMessage, params }, "Failed to get received Pix from Transfeera");
      throw new Error(`Failed to get received Pix: ${errorMessage}`);
    }
  }

  /**
   * Gera um txid único no formato exigido pela Transfeera (26-35 caracteres alfanuméricos)
   */
  private generateTxId(merchantId: string): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 15);
    const merchantPrefix = merchantId.substring(0, 8).replace(/-/g, "");
    const txid = `${merchantPrefix}${timestamp}${random}`.substring(0, 35).toUpperCase();
    
    // Garantir mínimo de 26 caracteres
    if (txid.length < 26) {
      const padding = "0".repeat(26 - txid.length);
      return `${txid}${padding}`;
    }
    
    return txid;
  }
}

