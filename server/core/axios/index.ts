import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: InstagramApiError;
}

interface InstagramApiError {
  message: string;
  type: string;
  code: number;
  error_subcode?: number;
  error_user_title?: string;
  error_user_msg?: string;
  fbtrace_id?: string;
}

class HttpClient {
  private readonly client: AxiosInstance;

  private static shared: HttpClient | null = null;

  private static getShared(): HttpClient {
    if (!this.shared) {
      this.shared = new HttpClient();
    }
    return this.shared;
  }

  private setupInterceptors(instance: AxiosInstance) {
    instance.interceptors.request.use((config) => {
      console.log("\n🚀 REQUEST:", {
        method: config.method,
        url: config.url,
        baseURL: config.baseURL,
        data:
          config.data instanceof URLSearchParams
            ? config.data.toString()
            : config.data,
      });

      return config;
    });

    instance.interceptors.response.use(
      (res) => {
        console.log("\n✅ RESPONSE:", res.status);
        return res;
      },
      (err) => {
        console.log("\n❌ ERROR RESPONSE");
        console.log("STATUS:", err.response?.status);
        console.log("DATA:", err.response?.data);

        if (err.config) {
          console.log("\n🔥 FAILED REQUEST:", {
            method: err.config.method,
            url: err.config.url,
            data: err.config.data,
          });
        }

        return Promise.reject(err);
      },
    );
  }

  constructor(baseURL?: string) {
    this.client = axios.create({
      baseURL,
      timeout: 30000,
    });

    this.setupInterceptors(this.client);
  }

  static create(baseURL: string): HttpClient {
    return new HttpClient(baseURL);
  }

  private async request<T>(
    config: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    try {
      const res = await this.client.request<T>(config);

      return {
        success: true,
        data: res.data,
      };
    } catch (err) {
      console.error("[HTTP Client] Error:", err);

      if (axios.isAxiosError<ApiResponse<T>>(err)) {
        const apiError = err.response?.data?.error;

        return {
          success: false,
          message: apiError?.error_user_msg ?? apiError?.message ?? err.message,
          error: apiError,
        };
      }

      return {
        success: false,
        message: err instanceof Error ? err.message : "Unknown error",
      };
    }
  }

  async get<T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    return this.request<T>({
      ...config,
      url,
      method: "GET",
    });
  }

  async post<T, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    return this.request<T>({
      ...config,
      url,
      method: "POST",
      data,
    });
  }

  async put<T, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    return this.request<T>({
      ...config,
      url,
      method: "PUT",
      data,
    });
  }

  async patch<T, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    return this.request<T>({
      ...config,
      url,
      method: "PATCH",
      data,
    });
  }

  async delete<T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    return this.request<T>({
      ...config,
      url,
      method: "DELETE",
    });
  }

  static async get<T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    return this.getShared().get<T>(url, config);
  }

  static async post<T, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    return this.getShared().post<T, D>(url, data, config);
  }

  static async put<T, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    return this.getShared().put<T, D>(url, data, config);
  }

  static async patch<T, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    return this.getShared().patch<T, D>(url, data, config);
  }

  static async delete<T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    return this.getShared().delete<T>(url, config);
  }
}

export default HttpClient;
export { AxiosInstance };
