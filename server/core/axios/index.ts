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
        baseURL: config.baseURL,
        data:
          config.data instanceof URLSearchParams
            ? config.data.toString()
            : config.data,
        method: config.method,
        url: config.url,
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
            data: err.config.data,
            method: err.config.method,
            url: err.config.url,
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
        data: res.data,
        success: true,
      };
    } catch (err) {
      console.error("[HTTP Client] Error:", err);

      if (axios.isAxiosError<ApiResponse<T>>(err)) {
        const apiError = err.response?.data?.error;

        return {
          error: apiError,
          message: apiError?.error_user_msg ?? apiError?.message ?? err.message,
          success: false,
        };
      }

      return {
        message: err instanceof Error ? err.message : "Unknown error",
        success: false,
      };
    }
  }

  async get<T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    return this.request<T>({
      ...config,
      method: "GET",
      url,
    });
  }

  async post<T, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    return this.request<T>({
      ...config,
      data,
      method: "POST",
      url,
    });
  }

  async put<T, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    return this.request<T>({
      ...config,
      data,
      method: "PUT",
      url,
    });
  }

  async patch<T, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    return this.request<T>({
      ...config,
      data,
      method: "PATCH",
      url,
    });
  }

  async delete<T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    return this.request<T>({
      ...config,
      method: "DELETE",
      url,
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
