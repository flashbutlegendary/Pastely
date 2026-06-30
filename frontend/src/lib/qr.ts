import QRCode from 'qrcode';

/**
 * Generates a data URL for a QR Code representation of the given text.
 * Styled to fit a premium dark theme by default (customized colors).
 */
export async function generateQrCode(
  text: string,
  isDarkTheme: boolean = true
): Promise<string> {
  const options: QRCode.QRCodeToDataURLOptions = {
    width: 256,
    margin: 2,
    errorCorrectionLevel: 'M',
    color: {
      // Dark mode: white/light QR on transparent or dark background.
      // Light mode: dark blue/black QR on white/transparent background.
      dark: isDarkTheme ? '#f0f1f5' : '#0a0b0f',
      light: isDarkTheme ? '#16181f' : '#ffffff',
    },
  };

  try {
    return await QRCode.toDataURL(text, options);
  } catch (err) {
    console.error('Failed to generate QR Code', err);
    throw err;
  }
}
