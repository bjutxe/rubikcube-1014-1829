# Rubik Cube

![localhost](https://github.com/user-attachments/assets/0bbd1407-6403-45e9-9faa-9a12dc06cc25)

This project is a monorepo that includes both a backend and a frontend, utilizing Rust and TypeScript respectively.  
The frontend displays a Rubik's Cube using Three.js.

## Directory Structure

- `backend/` - API server written in Rust
- `frontend/` - Web server written in TypeScript
- `docker-compose.yml` - Container orchestration configuration
- `LICENSE.md` - License information
- `README.md` - Project overview

## Setup

### Prerequisites

- Docker and Docker Compose installed
- Node.js and npm installed (for local development)
- Tilt configured and set up for use during local development

### Starting with Docker

```bash
tilt up
```

### Verification

The backend can be accessed at [http://localhost:8080], and the frontend can be accessed at [http://localhost:3000].

## License

Released under the Apache-2.0 License  
Free to use without permission  
You can use it under MIT or GPL as well  
Most of the source code in this repository was generated by ChatGPT or based on Qiita articles, ensuring no copyright issues  
You can consider it almost a clean room implementation

# Rubik Cube

このプロジェクトは、RustとTypeScriptを使用したバックエンドとフロントエンドを含むMonorepoです。  
フロントエンドはThree.jsでルービックキューブを表示しています。

## ディレクトリ構造

- `backend/` - Rustで記述されたAPIサーバー
- `frontend/` - TypeScriptで記述されたWebサーバー
- `docker-compose.yml` - コンテナオーケストレーションの設定
- `LICENSE.md` - ライセンス情報
- `README.md` - プロジェクトの概要

## セットアップ

### 前提条件

- DockerとDocker Composeがインストールされていること
- Node.jsとnpmがインストールされていること（ローカル開発の場合）
- Tiltが使用できるように設定しているのでローカル開発の際にお使いください

### Dockerを使用して起動

```bash
tilt up
```

### 動作確認

バックエンドは[http://localhost:8080]で、フロントエンドは[http://localhost:3000]でアクセスできます。

## ライセンス

Apache-2.0ライセンスの下でリリースされています。  
許可なく自由に使用できます。  
MITおよびGPLライセンスとも互換性があります。  
このリポジトリのソースコードのほとんどはChatGPTによって生成されたもの、またはQiitaの記事を参考にしているため、著作権上の問題はありません。  
ほぼクリーンルーム実装と考えてください。
