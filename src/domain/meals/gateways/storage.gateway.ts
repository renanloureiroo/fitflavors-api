/**
 * Gateway para operações de armazenamento de arquivos
 * Abstrai a implementação específica do provedor de storage (S3, Local, etc.)
 */
export interface StorageGateway {
  uploadFile(key: string): Promise<string>;
  getFile(key: string): Promise<Buffer>;
  getImageUrl(key: string): Promise<string>;
}
