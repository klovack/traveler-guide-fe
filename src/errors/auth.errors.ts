import { AppAuthErrorHttpResponse } from "tg-sdk";

import { AppError } from "@/errors/base.errors";

type ErrorCode = AppAuthErrorHttpResponse["code"];

export class AppAuthError extends AppError {
  code: ErrorCode;

  constructor(
    public detail: string,
    code: ErrorCode
  ) {
    super(detail);
    this.code = code;
    this.name = "AppAuthError";
  }
}
