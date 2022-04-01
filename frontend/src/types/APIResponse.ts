export interface APIResponse<T> {
  success: boolean,
  message: string,
  field?: string,
  data: T
}
