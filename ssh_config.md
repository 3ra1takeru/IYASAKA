# VPS SSH接続設定

## サーバー情報
- **ホスト名**: os3-318-48990.vs.sakura.ne.jp
- **ユーザー名**: ubuntu
- **ポート**: 22
- **認証方式**: SSH鍵認証
- **秘密鍵**: ~/.ssh/id_ed25519_new

## 接続方法

### 方法1: SSH configを使用
```bash
ssh sakura-vps
```

### 方法2: 直接接続
```bash
ssh -i ~/.ssh/id_ed25519_new ubuntu@os3-318-48990.vs.sakura.ne.jp
```

### 方法3: 詳細オプション付き
```bash
ssh -i ~/.ssh/id_ed25519_new -p 22 ubuntu@os3-318-48990.vs.sakura.ne.jp
```

## 注意事項
- このサーバーはSSH鍵認証を使用しています
- パスワード認証は設定されていない可能性があります
- 秘密鍵ファイル `id_ed25519_new` が必要です