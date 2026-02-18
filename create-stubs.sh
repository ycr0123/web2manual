#!/bin/bash
# Script to create stub MDX files for remaining tracks

BASE_DIR="C:/Users/ycr01/Dropbox/workspaces/web2manual/src/content/learn"

# Core Features Track stubs
declare -A CORE_LESSONS
CORE_LESSONS["01-cli-reference"]="CLI 명령어 완벽 가이드|core-features|cli-reference|50|CLI, 명령어, 터미널"
CORE_LESSONS["02-memory-system"]="메모리 시스템 이해|core-features|memory-system|40|메모리, CLAUDE.md, 컨텍스트"
CORE_LESSONS["03-checkpointing"]="체크포인팅과 세션 관리|core-features|checkpointing|40|체크포인팅, 세션, 복원"
CORE_LESSONS["04-output-styles"]="출력 스타일과 Fast 모드|core-features|output-styles|30|출력스타일, Fast모드, 성능"
CORE_LESSONS["05-terminal-config"]="터미널 설정 최적화|core-features|terminal-config|40|터미널, 환경설정, 최적화"
CORE_LESSONS["06-ide-integration"]="IDE 통합|core-features|ide-integration|50|JetBrains, IDE, 통합"
CORE_LESSONS["07-web-chrome-slack"]="웹, Chrome, Slack 연동|core-features|web-chrome-slack|50|웹, Chrome, Slack"

echo "Stubs will be created programmatically via the main script"
