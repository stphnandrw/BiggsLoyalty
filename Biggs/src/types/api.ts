export type ApiSuccessResponse<T> = {
  status?: string;
  message?: string;
  data: T;
};

export type ApiMutationResponse<T = Record<string, unknown>> = {
  status?: string;
  message: string;
  data?: T;
};
