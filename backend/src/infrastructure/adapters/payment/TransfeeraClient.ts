/**
 * Cliente HTTP para integração com a API Transfeera
 * 
 * @security Autenticação OAuth2 com client credentials
 * @performance Cache de token de acesso (30 minutos de validade)
 * @maintainability Cliente isolado e reutilizável
 */

import axios, { AxiosInstance, AxiosError } from "axios";
import { logger } from "../../logger";
import { env } from "../../../config/env";

interface TransfeeraTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface TransfeeraPixKey {
  id: string;
  key_type: "EMAIL" | "TELEFONE" | "CNPJ" | "CPF" | "CHAVE_ALEATORIA";
  key: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface TransfeeraQrCodeResponse {
  id: string;
  qrcode_type: "ESTATICO" | "COBRANCA_IMEDIATA" | "COBRANCA_COM_VENCIMENTO";
  status: string;
  txid: string;
  integration_id?: string;
  pix_key: TransfeeraPixKey;
  emv_payload: string;
  image_base64: string;
  created_at: string;
  updated_at: string;
  original_value?: number;
  expiration?: number;
}

interface TransfeeraBalanceResponse {
  value: number;
  waiting_value: number;
}

interface TransfeeraCashInResponse {
  id: string;
  value: number;
  type: "DEPOSIT" | "DEPOSIT_REFUND";
  end2end_id: string;
  txid?: string;
  integration_id?: string;
  pix_key: string;
  pix_description?: string;
  payer: {
    name: string;
    document: string;
    account_type: string;
    account: string;
    account_digit: string;
    agency: string;
    bank: {
      name: string;
      code: string;
      ispb: string;
    };
  };
  receiver: {
    name: string;
    document: string;
  };
}

export class TransfeeraClient {
  private axiosInstance: AxiosInstance;
  private accessToken: string | null = null;
  private tokenExpiresAt: number = 0;
  private readonly userAgent: string;

  constructor() {
    this.userAgent = `Turbofy Gateway (contato@turbofy.com)`;
    
    this.axiosInstance = axios.create({
      baseURL: env.TRANSFEERA_API_URL,
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "User-Agent": this.userAgent,
      },
      timeout: 30000, // 30 segundos
    });

    // Interceptor para adicionar token de acesso
    this.axiosInstance.interceptors.request.use(
      async (config) => {
        if (!this.accessToken || Date.now() >= this.tokenExpiresAt) {
          await this.authenticate();
        }
        
        if (this.accessToken) {
          config.headers.Authorization = `Bearer ${this.accessToken}`;
        }
        
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Interceptor para tratamento de erros
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError<{ error?: string; message?: string }>) => {
        if (error.response?.status === 401) {
          // Token expirado, tentar renovar
          logger.warn({ error: "Transfeera token expired, renewing..." });
          await this.authenticate();
          
          // Retry da requisição original
          if (error.config && this.accessToken) {
            error.config.headers.Authorization = `Bearer ${this.accessToken}`;
            return this.axiosInstance.request(error.config);
          }
        }
        
        logger.error(
          {
            error: error.message,
            status: error.response?.status,
            data: error.response?.data,
            url: error.config?.url,
          },
          "Transfeera API error"
        );
        
        return Promise.reject(error);
      }
    );
  }

  /**
   * Autentica na API Transfeera usando OAuth2 client credentials
   */
  private async authenticate(): Promise<void> {
    if (!env.TRANSFEERA_CLIENT_ID || !env.TRANSFEERA_CLIENT_SECRET) {
      throw new Error("Transfeera credentials not configured");
    }

    try {
      const response = await axios.post<TransfeeraTokenResponse>(
        `${env.TRANSFEERA_LOGIN_URL}/authorization`,
        {
          grant_type: "client_credentials",
          client_id: env.TRANSFEERA_CLIENT_ID,
          client_secret: env.TRANSFEERA_CLIENT_SECRET,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "User-Agent": this.userAgent,
          },
        }
      );

      this.accessToken = response.data.access_token;
      // Token expira em 30 minutos, renovar 2 minutos antes
      this.tokenExpiresAt = Date.now() + (response.data.expires_in - 120) * 1000;

      logger.info({ expiresIn: response.data.expires_in }, "Transfeera authentication successful");
    } catch (error) {
      const axiosError = error as AxiosError;
      logger.error(
        {
          error: axiosError.message,
          status: axiosError.response?.status,
          data: axiosError.response?.data,
        },
        "Failed to authenticate with Transfeera"
      );
      throw new Error(`Transfeera authentication failed: ${axiosError.message}`);
    }
  }

  /**
   * Cria uma chave Pix na Transfeera
   */
  async createPixKey(key: string): Promise<TransfeeraPixKey> {
    const response = await this.axiosInstance.post<TransfeeraPixKey>("/pix/key", {
      key,
    });

    return response.data;
  }

  /**
   * Consulta todas as chaves Pix registradas
   */
  async listPixKeys(): Promise<TransfeeraPixKey[]> {
    const response = await this.axiosInstance.get<TransfeeraPixKey[]>("/pix/key");
    return response.data;
  }

  /**
   * Consulta uma chave Pix por ID
   */
  async getPixKeyById(keyId: string): Promise<TransfeeraPixKey> {
    const response = await this.axiosInstance.get<TransfeeraPixKey>(`/pix/key/${keyId}`);
    return response.data;
  }

  /**
   * Cria um QR Code estático
   */
  async createStaticQrCode(params: {
    pixKey: string;
    value?: number;
    txid?: string;
    integrationId?: string;
    additionalInfo?: string;
  }): Promise<TransfeeraQrCodeResponse> {
    const response = await this.axiosInstance.post<TransfeeraQrCodeResponse>(
      "/pix/qrcode/static",
      {
        pix_key: params.pixKey,
        value: params.value,
        txid: params.txid,
        integration_id: params.integrationId,
        additional_info: params.additionalInfo,
      }
    );

    return response.data;
  }

  /**
   * Cria uma cobrança imediata (QR Code dinâmico)
   */
  async createImmediateCharge(params: {
    pixKey: string;
    originalValue: number;
    txid?: string;
    integrationId?: string;
    expiration?: number; // segundos
    payerQuestion?: string;
    additionalInfo?: Array<{ key: string; value: string }>;
    payer?: {
      name: string;
      document: string;
    };
  }): Promise<TransfeeraQrCodeResponse> {
    const response = await this.axiosInstance.post<TransfeeraQrCodeResponse>(
      "/pix/qrcode/collection/immediate",
      {
        pix_key: params.pixKey,
        original_value: params.originalValue,
        txid: params.txid,
        integration_id: params.integrationId,
        expiration: params.expiration ?? 86400, // Padrão 24 horas
        payer_question: params.payerQuestion,
        additional_info: params.additionalInfo,
        payer: params.payer,
      }
    );

    return response.data;
  }

  /**
   * Cria uma cobrança com vencimento (boleto)
   */
  async createDueDateCharge(params: {
    pixKey: string;
    dueDate: string; // ISO date string
    originalValue: number;
    txid?: string;
    integrationId?: string;
    expirationAfterDueDate?: number;
    payer: {
      name: string;
      document: string;
      email?: string;
      postalCode?: string;
      city?: string;
      state?: string;
      address?: string;
    };
    payerQuestion?: string;
    additionalInfo?: Array<{ key: string; value: string }>;
  }): Promise<TransfeeraQrCodeResponse> {
    const response = await this.axiosInstance.post<TransfeeraQrCodeResponse>(
      "/pix/qrcode/collection/dueDate",
      {
        pix_key: params.pixKey,
        due_date: params.dueDate,
        original_value: params.originalValue,
        txid: params.txid,
        integration_id: params.integrationId,
        expiration_after_due_date: params.expirationAfterDueDate ?? 0,
        payer: params.payer,
        payer_question: params.payerQuestion,
        additional_info: params.additionalInfo,
      }
    );

    return response.data;
  }

  /**
   * Consulta saldo disponível
   */
  async getBalance(): Promise<TransfeeraBalanceResponse> {
    const response = await this.axiosInstance.get<TransfeeraBalanceResponse>("/statement/balance");
    return response.data;
  }

  /**
   * Consulta Pix recebidos
   */
  async getCashIn(params?: {
    page?: string;
    pageSize?: string;
    type?: "DEPOSIT" | "DEPOSIT_REFUND" | "PENDING_DEPOSIT_REFUND" | "CANCELLED_DEPOSIT_REFUND";
    initialDate?: string;
    endDate?: string;
    pixKey?: string;
    txid?: string;
    integrationId?: string;
    value?: string;
    payerDocument?: string;
  }): Promise<{ entries: TransfeeraCashInResponse[]; pagination: unknown }> {
    const response = await this.axiosInstance.get<{
      entries: TransfeeraCashInResponse[];
      pagination: unknown;
    }>("/pix/cashin", {
      params,
    });

    return response.data;
  }

  /**
   * Consulta um Pix recebido por end2end_id
   */
  async getCashInByEnd2EndId(end2endId: string): Promise<TransfeeraCashInResponse> {
    const response = await this.axiosInstance.get<TransfeeraCashInResponse>(
      `/pix/cashin/${end2endId}`
    );
    return response.data;
  }
}

