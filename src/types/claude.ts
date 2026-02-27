import type { GardenDesign, WizardData } from "./garden";

export interface ClaudeGenerateRequest {
  wizardData: WizardData;
}

export interface ClaudeGenerateResponse {
  success: true;
  design: GardenDesign;
}

export interface ClaudeGenerateError {
  success: false;
  error: string;
}

export type ClaudeResponse = ClaudeGenerateResponse | ClaudeGenerateError;
