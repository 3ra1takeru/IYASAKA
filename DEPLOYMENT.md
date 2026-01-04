# IYASAKAプロジェクト デプロイメントガイド

## 🚀 クイックデプロイ

```bash
./deploy.sh
```

## 📋 サーバー情報

- **ホスト名**: sakura-vps (os3-318-48990.vs.sakura.ne.jp)
- **ユーザー**: ubuntu
- **プロジェクトパス**: ~/iyasaka
- **公開URL**: https://os3-318-48990.vs.sakura.ne.jp/iyasaka/

## 🔧 手動デプロイ手順

### 1. コードをサーバーに同期
```bash
rsync -avz --exclude='node_modules' --exclude='dist' --exclude='.git' --exclude='.env.local' --exclude='*.log' ./ sakura-vps:~/iyasaka/
```

### 2. サーバーでビルド
```bash
ssh sakura-vps "cd ~/iyasaka && npm install && npm run build"
```

### 3. パーミッション修正
```bash
ssh sakura-vps "chmod 755 ~/iyasaka && chmod -R 755 ~/iyasaka/dist"
```

## ⚠️ トラブルシューティング

### 404 Not Found エラー
**原因**: Nginxがdistフォルダにアクセスできない
**解決策**:
1. パーミッションを確認: `ssh sakura-vps "ls -la ~/iyasaka/"`
2. distフォルダが存在することを確認: `ssh sakura-vps "ls -la ~/iyasaka/dist/"`
3. パーミッションを修正: `ssh sakura-vps "chmod 755 ~/iyasaka && chmod -R 755 ~/iyasaka/dist"`

### 白い画面（コンソールエラー）
**原因**: JavaScriptファイルのパスが間違っている
**解決策**:
1. `vite.config.ts`に`base: '/iyasaka/'`が設定されていることを確認
2. 再ビルド: `ssh sakura-vps "cd ~/iyasaka && npm run build"`
3. ブラウザの開発者ツールでネットワークタブを確認

### 502 Bad Gateway
**原因**: バックエンドサービスが起動していない、またはプロキシ設定の問題
**解決策**:
1. Nginxエラーログを確認: `ssh sakura-vps "tail -20 /var/log/nginx/marche_error.log"`
2. バックエンドサービスの状態を確認

### Permission Denied エラー
**原因**: Nginxワーカープロセスがファイルにアクセスできない
**解決策**:
```bash
ssh sakura-vps "chmod 755 ~/ && chmod 755 ~/iyasaka && chmod -R 755 ~/iyasaka/dist"
```

## 📝 重要な設定ファイル

### vite.config.ts
```typescript
export default defineConfig({
  base: '/iyasaka/',  // この設定が必須！
  // ...
});
```

### Nginx設定 (/etc/nginx/sites-available/marche)
```nginx
location /iyasaka/ {
    alias /home/ubuntu/iyasaka/dist/;
    try_files $uri $uri/ =404;
}
```

## 🔍 デバッグコマンド

### サーバーの状態確認
```bash
# Nginxの状態
ssh sakura-vps "systemctl status nginx"

# エラーログ確認
ssh sakura-vps "tail -f /var/log/nginx/marche_error.log"

# アクセスログ確認
ssh sakura-vps "tail -f /var/log/nginx/marche_access.log"

# ファイル構造確認
ssh sakura-vps "tree -L 2 ~/iyasaka/"
```

### ローカルテスト
```bash
# 開発サーバー起動
npm run dev

# ビルドテスト
npm run build
```

## 📌 注意事項

1. **vite.config.ts**の`base`設定は`/iyasaka/`である必要があります
2. サーバーのNode.jsバージョンが古い場合、警告が出ますが動作には問題ありません
3. 初回デプロイ時は必ず`npm install`を実行してください
4. `.env.local`ファイルは同期されません（セキュリティのため）