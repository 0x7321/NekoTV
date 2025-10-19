/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * gz360 API AES-CBC 加解密工具
 * 遵循 KISS 原则 - 简单的加解密实现
 */

import crypto from 'crypto';

const KEY = Buffer.from('181cc88340ae5b2b', 'utf-8');
const IV = Buffer.from('4423d1e2773476ce', 'utf-8');
const ALGORITHM = 'aes-128-cbc';

/**
 * 加密 JSON 数据
 */
export function encrypt(payload: Record<string, any>): string {
  const jsonStr = JSON.stringify(payload);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, IV);

  let encrypted = cipher.update(jsonStr, 'utf-8', 'hex');
  encrypted += cipher.final('hex');

  return encrypted;
}

/**
 * 解密十六进制字符串
 */
export function decrypt(hexStr: string): Record<string, any> {
  const decipher = crypto.createDecipheriv(ALGORITHM, KEY, IV);

  let decrypted = decipher.update(hexStr, 'hex', 'utf-8');
  decrypted += decipher.final('utf-8');

  return JSON.parse(decrypted);
}
