import fs from 'fs';
import path from 'path';
import { getAllDocs, buildSearchIndex } from '../src/lib/content';

async function main() {
  console.log('검색 인덱스 빌드 시작...');

  try {
    // 모든 문서 로드
    const docs = getAllDocs();
    console.log(`${docs.length}개 문서 로드 완료`);

    // 검색 인덱스 생성
    const searchIndex = buildSearchIndex(docs);
    console.log(`검색 인덱스 생성 완료: ${searchIndex.length}개 항목`);

    // 출력 디렉토리 생성
    const outputDir = path.join(process.cwd(), 'public', 'data');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // JSON 파일 저장
    const outputPath = path.join(outputDir, 'reference-index.json');
    fs.writeFileSync(outputPath, JSON.stringify(searchIndex, null, 2), 'utf-8');

    console.log(`검색 인덱스 저장 완료: ${outputPath}`);
    console.log('빌드 완료!');
  } catch (error) {
    console.error('검색 인덱스 빌드 실패:', error);
    process.exit(1);
  }
}

main();
