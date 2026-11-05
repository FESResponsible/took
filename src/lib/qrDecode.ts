import jsQR from 'jsqr';

export function decodeQr(data: Uint8ClampedArray, width: number, height: number): string | null {
  const result = jsQR(data, width, height);
  return result ? result.data : null;
}

/** 찍어 둔 사진에서 QR을 읽는다. 카메라를 바로 켤 수 없는 환경을 위한 방법. */
export async function decodeQrFromFile(file: File): Promise<string | null> {
  const bitmap = await createImageBitmap(file).catch(() => {
    throw new Error('사진을 읽지 못했어요. 다시 찍어 주세요.');
  });
  const canvas = document.createElement('canvas');
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const context = canvas.getContext('2d');
  if (!context) {
    bitmap.close();
    throw new Error('이 브라우저에서는 사진을 처리할 수 없어요.');
  }
  context.drawImage(bitmap, 0, 0);
  bitmap.close();
  const image = context.getImageData(0, 0, canvas.width, canvas.height);
  return decodeQr(image.data, image.width, image.height);
}

