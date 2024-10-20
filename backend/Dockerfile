# ビルドステージ
FROM rust:1.81 as builder

WORKDIR /usr/src/app

# Python開発ライブラリをインストール
RUN apt-get update && apt-get install -y \
    python3.11-dev \
    && rm -rf /var/lib/apt/lists/*

# 依存関係ファイルを先にコピーしてキャッシュを利用
COPY Cargo.toml Cargo.lock ./
RUN cargo fetch

# ソースコード全体をコピー
COPY . .

# リリースビルド
RUN cargo build --release

# ランタイムステージ
FROM debian:bookworm-slim

# 必要なライブラリをインストール
RUN apt-get update && apt-get install -y \
    ca-certificates \
    python3 \
    python3-pip \
    && rm -rf /var/lib/apt/lists/*

# SymPyをインストール（--break-system-packages フラグを追加）
RUN pip3 install sympy --break-system-packages

# Pythonへのシンボリックリンクを作成（必要に応じて）
RUN ln -s /usr/bin/python3 /usr/bin/python

WORKDIR /usr/local/bin

# ビルド成果物をコピー
COPY --from=builder /usr/src/app/target/release/backend .
COPY --from=builder /usr/src/app/target/release/experiment .

# 実行権限を付与
RUN chmod +x backend experiment

# 実行コマンド（デフォルトはbackend）
CMD ["./backend"]
