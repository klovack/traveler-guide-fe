import { AppError } from "./base.errors";

export type OnboardingErrorCode = "already_completed" | "draft_unknown" | "api";

export class OnboardingError extends AppError {
  constructor(public detail: string, public code: OnboardingErrorCode) {
    super(detail);
    this.name = "OnboardingError";
  }
}
