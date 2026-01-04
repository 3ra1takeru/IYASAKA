#!/bin/bash

# GitHubから最新コードを取得してサーバーへデプロイするスクリプト
# 使用方法: ./deploy-from-github.sh

set -e  # エラーが発生したら即座に停止

# カラー定義
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}🚀 IYASAKA - GitHub to Server Deployment${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# 1. 現在の変更を確認
echo -e "${YELLOW}📋 現在のローカル変更を確認中...${NC}"
if [[ -n $(git status --porcelain) ]]; then
    echo -e "${YELLOW}ローカルに未コミットの変更があります:${NC}"
    git status --short
    echo ""
    echo -e "${YELLOW}これらの変更をスタッシュしますか？ (y/n)${NC}"
    read -r STASH_CHANGES
    if [[ "$STASH_CHANGES" == "y" ]]; then
        git stash push -m "Auto-stash before GitHub deployment $(date +%Y%m%d_%H%M%S)"
        echo -e "${GREEN}✓ 変更をスタッシュしました${NC}"
    else
        echo -e "${RED}デプロイを中止します${NC}"
        exit 1
    fi
fi

# 2. GitHubから最新を取得
echo -e "${YELLOW}📥 GitHubから最新コードを取得中...${NC}"
git fetch origin main
BEHIND=$(git rev-list --count HEAD..origin/main)
if [ "$BEHIND" -gt 0 ]; then
    echo -e "${BLUE}$BEHIND 個の新しいコミットがあります${NC}"
    git log HEAD..origin/main --oneline
    echo ""
fi

git pull origin main
echo -e "${GREEN}✓ 最新コードを取得しました${NC}"
echo ""

# 3. vite.config.tsのbase設定を確認・修正
echo -e "${YELLOW}⚙️  設定ファイルを確認中...${NC}"
if ! grep -q "base: '/iyasaka/'" vite.config.ts; then
    echo -e "${YELLOW}vite.config.tsにbase設定を追加します${NC}"
    # base設定を追加
    sed -i.bak "s/return {/return {\n      base: '\/iyasaka\/',/" vite.config.ts
    rm vite.config.ts.bak
    echo -e "${GREEN}✓ base設定を追加しました${NC}"
else
    echo -e "${GREEN}✓ base設定は既に設定済みです${NC}"
fi
echo ""

# 4. サーバーへデプロイ
echo -e "${YELLOW}🚀 サーバーへデプロイ中...${NC}"
echo ""

# サーバー設定
SERVER_HOST="sakura-vps"
SERVER_PATH="~/iyasaka"

# ファイル同期
echo "📤 ファイルを同期中..."
rsync -avz --exclude='node_modules' \
           --exclude='dist' \
           --exclude='.git' \
           --exclude='.env.local' \
           --exclude='*.log' \
           --exclude='.DS_Store' \
           --progress \
           ./ ${SERVER_HOST}:${SERVER_PATH}/ | grep -E "sent|total size" || true

echo -e "${GREEN}✓ ファイル同期完了${NC}"
echo ""

# サーバーでビルド
echo "🔨 サーバーでビルド実行中..."
ssh ${SERVER_HOST} "cd ${SERVER_PATH} && npm install --silent && npm run build" 2>&1 | grep -E "built in|✓" || true
echo -e "${GREEN}✓ ビルド完了${NC}"
echo ""

# パーミッション修正
echo "🔧 パーミッション修正中..."
ssh ${SERVER_HOST} "chmod 755 ${SERVER_PATH} && chmod -R 755 ${SERVER_PATH}/dist"
echo -e "${GREEN}✓ パーミッション修正完了${NC}"
echo ""

# 5. デプロイ確認
echo -e "${YELLOW}🔍 デプロイを確認中...${NC}"
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://os3-318-48990.vs.sakura.ne.jp/iyasaka/)

if [ "$HTTP_STATUS" = "200" ]; then
    echo ""
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}✅ デプロイ成功！${NC}"
    echo -e "${GREEN}🌐 URL: https://os3-318-48990.vs.sakura.ne.jp/iyasaka/${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
else
    echo -e "${RED}⚠️  HTTPステータス: $HTTP_STATUS${NC}"
    echo -e "${RED}サイトが正常に応答していません${NC}"
    echo ""
    echo "最新のエラーログ:"
    ssh ${SERVER_HOST} "tail -3 /var/log/nginx/marche_error.log" 2>/dev/null || echo "エラーログを取得できませんでした"
fi

# 6. スタッシュした変更を戻すか確認
if [[ "$STASH_CHANGES" == "y" ]]; then
    echo ""
    echo -e "${YELLOW}スタッシュした変更を復元しますか？ (y/n)${NC}"
    read -r RESTORE_STASH
    if [[ "$RESTORE_STASH" == "y" ]]; then
        git stash pop
        echo -e "${GREEN}✓ 変更を復元しました${NC}"
    fi
fi

echo ""
echo "💡 ヒント: このスクリプトは以下を自動で実行します:"
echo "  1. GitHubから最新コード取得"
echo "  2. vite.config.tsのbase設定確認"
echo "  3. サーバーへファイル同期"
echo "  4. サーバーでビルド実行"
echo "  5. パーミッション修正"