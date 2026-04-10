export type GenerateOtpResponse = {
  status?: string;
  message: string;
};

export type VerifyOtpResponse = {
  status?: string;
  message: string;
  time_check?: string;
};
