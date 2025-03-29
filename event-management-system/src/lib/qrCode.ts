import QRCode from 'qrcode';
import crypto from 'crypto';

interface QRData {
  userId: string;
  eventId: string;
  type: 'entry' | 'exit';
  timestamp: number;
}

export async function generateQRCode(data: QRData): Promise<string> {
  // Add a secret key to prevent tampering
  const secretKey = process.env.QR_SECRET_KEY || 'your-secret-key';
  
  // Create a hash of the data with the secret key
  const hash = crypto
    .createHmac('sha256', secretKey)
    .update(JSON.stringify(data))
    .digest('hex');

  // Combine data with hash
  const qrData = {
    ...data,
    hash,
  };

  try {
    // Generate QR code as data URL
    const qrCodeDataUrl = await QRCode.toDataURL(JSON.stringify(qrData), {
      type: 'image/png',
      margin: 1,
      width: 300,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    });

    return qrCodeDataUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
}

export function verifyQRCode(qrData: string): QRData | null {
  try {
    const data = JSON.parse(qrData);
    const { hash, ...payload } = data;

    // Verify hash
    const secretKey = process.env.QR_SECRET_KEY || 'your-secret-key';
    const expectedHash = crypto
      .createHmac('sha256', secretKey)
      .update(JSON.stringify(payload))
      .digest('hex');

    if (hash !== expectedHash) {
      console.error('Invalid QR code hash');
      return null;
    }

    // Check if QR code is expired (24 hours)
    const now = Date.now();
    if (now - payload.timestamp > 24 * 60 * 60 * 1000) {
      console.error('QR code has expired');
      return null;
    }

    return payload;
  } catch (error) {
    console.error('Error verifying QR code:', error);
    return null;
  }
}

export async function generateEntryQR(userId: string, eventId: string): Promise<string> {
  return generateQRCode({
    userId,
    eventId,
    type: 'entry',
    timestamp: Date.now(),
  });
}

export async function generateExitQR(userId: string, eventId: string): Promise<string> {
  return generateQRCode({
    userId,
    eventId,
    type: 'exit',
    timestamp: Date.now(),
  });
}

export function isValidQRCode(qrData: string): boolean {
  const data = verifyQRCode(qrData);
  return data !== null;
}

export function isEntryQR(qrData: string): boolean {
  const data = verifyQRCode(qrData);
  return data?.type === 'entry';
}

export function isExitQR(qrData: string): boolean {
  const data = verifyQRCode(qrData);
  return data?.type === 'exit';
} 