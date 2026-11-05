const MAX_EDGE_PX = 960;
const JPEG_QUALITY = 0.7;

/**
 * 휴대폰 사진은 수 MB라 브라우저 저장소에 그대로 넣으면 금방 가득 찬다.
 * 긴 변을 MAX_EDGE_PX로 줄인 JPEG data URL로 바꾼다.
 */
export async function resizeImage(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('사진 파일만 올릴 수 있어요.');
  }
  const bitmap = await createImageBitmap(file).catch(() => {
    throw new Error('사진을 읽지 못했어요. 다시 찍어 주세요.');
  });
  const scale = Math.min(1, MAX_EDGE_PX / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const context = canvas.getContext('2d');
  if (!context) {
    bitmap.close();
    throw new Error('이 브라우저에서는 사진을 처리할 수 없어요.');
  }
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return canvas.toDataURL('image/jpeg', JPEG_QUALITY);
}

