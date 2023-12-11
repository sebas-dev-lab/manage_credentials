import { exceptions } from './set_exceptions.utis';

class ErrorCustom extends Error {
  public error: boolean;
  public statusCode: number;
  public message: any;
  public exp: any;
  constructor(error: boolean, status: number, message: any) {
    super(message);
    this.statusCode = status;
    this.message = message;
    this.error = error;
  }
}

export interface ResponseService {
  error: boolean;
  message: string;
  data: any;
  code: any;
}

export default class CommonResponse {
  public error: boolean;
  public data: any;
  public message: string;
  public code: number;
  constructor() {
    this.error = false;
    this.data = null;
    this.message = '';
    this.code = null;
    this.setSend = this.setSend.bind(this);
    this.setError = this.setError.bind(this);
    this.setSuccess = this.setSuccess.bind(this);
    this.throwExcept = this.throwExcept.bind(this);
  }

  setError(code: number, message?: string) {
    this.code = code || 409;
    this.error = true;
    this.message = message || 'failed';
    this.data = null;
    this.throwExcept();
  }

  throwExcept(code?: number) {
    this.error = true;
    if (!this.code) {
      this.code = code;
    }
    const Exp = exceptions.getException(this.code);
    throw new Exp(this.message);
  }

  setSuccess(code: number, message: string, data?: any): void {
    this.error = false;
    this.code = code;
    this.message = message || 'ok';
    this.data = data;
  }

  setSend() {
    return {
      error: this.error,
      code: this.code,
      message: this.message,
      data: this.data,
    };
  }

  async returnResponse(callback: any, data?: any): Promise<ResponseService> {
    try {
      await callback(data);
    } catch (e: any) {
      this.throwExcept();
    }
    return this.setSend();
  }
}
