#!/bin/bash

# IYASAKAプロジェクト デプロイスクリプト
# 使用方法: ./deploy.sh

set -e  # エラーが発生したら即座に停止

echo "🚀 IYASAKAプロジェクトのデプロイを開始します..."

# カラー定義
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# サーバー設定
SERVER_HOST="ubuntu@os3-318-48990.vs.sakura.ne.jp"
SERVER_PATH="~/iyasaka"

# 1. ローカルでビルド（オプション）
echo -e "${YELLOW}ローカルビルドをスキップしてサーバーでビルドしますか？ (y/n)${NC}"
read -r SKIP_LOCAL_BUILD

if [[ "$SKIP_LOCAL_BUILD" != "y" ]]; then
    echo "📦 ローカルでビルドを実行中..."
    npm run build
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ ローカルビルド完了${NC}"
    else
        echo -e "${RED}✗ ローカルビルドに失敗しました${NC}"
        exit 1
    fi
fi

# 2. ファイルをサーバーに同期
echo "📤 ファイルをサーバーに同期中..."
rsync -avz --exclude='node_modules' \
           --exclude='dist' \
           --exclude='.git' \
           --exclude='.env.local' \
           --exclude='*.log' \
           --exclude='.DS_Store' \
           --progress \
           -e "ssh -i $HOME/.ssh/id_ed25519_new" \
           ./ ${SERVER_HOST}:${SERVER_PATH}/

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ ファイル同期完了${NC}"
else
    echo -e "${RED}✗ ファイル同期に失敗しました${NC}"
    exit 1
fi

# 3. サーバーでビルド実行
echo "🔨 サーバーでビルドを実行中..."
ssh -i $HOME/.ssh/id_ed25519_new ${SERVER_HOST} "cd ${SERVER_PATH} && npm install && npm run build"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ サーバービルド完了${NC}"
else
    echo -e "${RED}✗ サーバービルドに失敗しました${NC}"
    exit 1
fi

# 4. パーミッション修正
echo "🔧 パーミッションを修正中..."
ssh -i $HOME/.ssh/id_ed25519_new ${SERVER_HOST} "chmod 755 ${SERVER_PATH} && chmod -R 755 ${SERVER_PATH}/dist"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ パーミッション修正完了${NC}"
else
    echo -e "${RED}✗ パーミッション修正に失敗しました${NC}"
    exit 1
fi

# 5. デプロイ確認
echo "🔍 デプロイを確認中..."
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://os3-318-48990.vs.sakura.ne.jp/iyasaka/)

if [ "$HTTP_STATUS" = "200" ]; then
    echo -e "${GREEN}✅ デプロイ成功！${NC}"
    echo -e "${GREEN}🌐 URL: https://os3-318-48990.vs.sakura.ne.jp/iyasaka/${NC}"
else
    echo -e "${RED}⚠️  警告: サイトがHTTPステータス $HTTP_STATUS を返しています${NC}"
    echo "Nginxのエラーログを確認してください:"
    ssh -i $HOME/.ssh/id_ed25519_new ${SERVER_HOST} "tail -5 /var/log/nginx/marche_error.log"
fi

echo ""
echo "📝 トラブルシューティング:"
echo "  - 404エラー: Nginxの設定とdistフォルダのパーミッションを確認"
echo "  - 白い画面: ブラウザのコンソールでJSエラーを確認"
echo "  - 502エラー: バックエンドサービスの状態を確認"