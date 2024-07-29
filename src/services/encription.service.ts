import crypto from 'crypto';

const IV_LENGTH = 16; // For AES, this is always 16

interface EncryptedData {
    combinedData: string;
}

const aesEncrypt = (buffer: Buffer): EncryptedData => {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(
        'aes-256-cbc',
        Buffer.from(process.env.ENCRYPTION_KEY as string),
        iv
    );

    const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);

    // Prepend IV to the encrypted data
    const combinedData = Buffer.concat([iv, encrypted]).toString('hex');

    return { combinedData };
};

const aesDecrypt = (combinedData: string): Buffer => {
    const combinedBuffer = Buffer.from(combinedData, 'hex');
    console.log('combinedBuffer: ', combinedBuffer);

    // Extract IV from the combined data using subarray
    const iv = combinedBuffer.subarray(0, IV_LENGTH);
    const encryptedText = combinedBuffer.subarray(IV_LENGTH);

    const decipher = crypto.createDecipheriv(
        'aes-256-cbc',
        Buffer.from(process.env.ENCRYPTION_KEY as string),
        iv
    );

    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    console.log('decrypted: ', decrypted);

    return decrypted;
};

export { aesEncrypt, aesDecrypt, EncryptedData };
