import { encode, decode } from "@deps";

export class Auth {
  private static AES_CBC_128: AesKeyGenParams = {
    name: "AES-CBC",
    length: 128,
  };

  private static AES_CBC_16: AesCbcParams = {
    name: "AES-CBC",
    iv: crypto.getRandomValues(new Uint8Array(16)),
  };

  private static usages: KeyUsage[] = [
    "decrypt",
    "encrypt",
  ];

  private static textEncoder(str: string) {
    return new TextEncoder().encode(str);
  }

  private static textDecoder(data: Uint8Array) {
    return new TextDecoder().decode(data);
  }

  private static async key() {
    return await crypto.subtle.generateKey(
      Auth.AES_CBC_128,
      true,
      Auth.usages
    );
  }

  private static async rawKey(key: CryptoKey) {
    return new Int8Array(await crypto.subtle.exportKey(
      "raw",
      key,
    ))
  }

  public static async encryptPassword(password: string) {
    const key = await Auth.key();
    const encrypted = await crypto.subtle.encrypt(
      Auth.AES_CBC_16,
      key,
      new TextEncoder().encode(password.trim()),
    )

    const data = new Uint8Array(encrypted)
    const hash = Auth.textDecoder(encode(data));

    return { hash, key };
  }

  public static async decryptPassword(
    data: string,
    key: CryptoKey
  ) {
    const decrypted = await crypto.subtle.decrypt(
      Auth.AES_CBC_16,
      key,
      decode(Auth.textEncoder(data))
    );

    const decryptedBytes = new Uint8Array(decrypted);
    return Auth.textDecoder(decryptedBytes);
  }

  public static isPasswordCorrect(
    givenPassword: string,
    passwordStored: string
  ) {
    return givenPassword === passwordStored;
  }

}