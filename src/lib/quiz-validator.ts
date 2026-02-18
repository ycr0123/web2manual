/**
 * 퀴즈 답안 검증 유틸리티
 *
 * Web Crypto API (SHA-256)를 사용하여 퀴즈 정답을 해시로 비교합니다.
 *
 * MVP 보안 참고: SHA-256 해싱은 제한된 옵션 ID(a/b/c/d)에 대해
 * 레인보우 테이블 공격에 취약합니다. 교육용 퀴즈 컨텍스트에서는
 * 허용 가능한 수준이며, SPEC-WEB2MANUAL-004에서 서버 사이드
 * 검증으로 업그레이드할 예정입니다.
 */

/**
 * 문자열을 SHA-256 해시로 변환합니다.
 * @param answerId - 해시할 답안 옵션 ID
 * @returns 16진수 문자열로 인코딩된 SHA-256 해시
 */
export async function hashAnswer(answerId: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(answerId);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

/**
 * 사용자 답안을 저장된 해시와 비교하여 검증합니다.
 * @param userAnswerId - 사용자가 선택한 답안 옵션 ID
 * @param correctHash - 정답의 SHA-256 해시값
 * @returns 답안이 정답인지 여부
 */
export async function validateAnswer(
  userAnswerId: string,
  correctHash: string
): Promise<boolean> {
  const userHash = await hashAnswer(userAnswerId);
  return userHash === correctHash;
}

/**
 * 답안 옵션 ID의 해시를 생성합니다.
 * 퀴즈 데이터에 정답 해시를 저장할 때 사용합니다.
 * @param answerId - 해시를 생성할 답안 옵션 ID
 * @returns 16진수 문자열로 인코딩된 SHA-256 해시
 */
export async function getAnswerHash(answerId: string): Promise<string> {
  return hashAnswer(answerId);
}
