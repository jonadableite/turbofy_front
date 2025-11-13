/**
 * Factory para criar instâncias de PaymentProviderPort
 * Escolhe entre StubPaymentProviderAdapter (dev) e TransfeeraPaymentProviderAdapter (prod)
 * 
 * @maintainability Centraliza a lógica de escolha do provider
 * @testability Facilita mock em testes
 */

import { PaymentProviderPort } from "../../../ports/PaymentProviderPort";
import { StubPaymentProviderAdapter } from "./StubPaymentProviderAdapter";
import { TransfeeraPaymentProviderAdapter } from "./TransfeeraPaymentProviderAdapter";
import { env } from "../../../config/env";
import { logger } from "../../logger";

export class PaymentProviderFactory {
  /**
   * Cria uma instância do PaymentProviderPort baseado na configuração
   */
  static create(): PaymentProviderPort {
    if (env.TRANSFEERA_ENABLED) {
      try {
        logger.info("Using TransfeeraPaymentProviderAdapter");
        return new TransfeeraPaymentProviderAdapter();
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        logger.warn(
          { error: errorMessage },
          "Failed to create TransfeeraPaymentProviderAdapter, falling back to StubPaymentProviderAdapter"
        );
        return new StubPaymentProviderAdapter();
      }
    }

    logger.info("Using StubPaymentProviderAdapter (development mode)");
    return new StubPaymentProviderAdapter();
  }
}

