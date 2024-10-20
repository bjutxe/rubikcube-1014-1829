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
FROM rust:1.81

# 必要なライブラリをインストール
RUN apt-get update && apt-get install -y \
    ca-certificates \
    python3 \
    python3-pip \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Rustツールチェーンをインストール（既にrust:1.81には含まれているが、念のため）
RUN curl https://sh.rustup.rs -sSf | sh -s -- -y && \
    rustup default stable

# `cargo-watch`をインストール
RUN cargo install cargo-watch

# SymPyをインストール（--break-system-packages フラグを追加）
RUN pip3 install sympy --break-system-packages

# Pythonへのシンボリックリンクを作成（必要に応じて）
RUN ln -s /usr/bin/python3 /usr/bin/python

WORKDIR /usr/src/app

# ビルド成果物をコピー
COPY --from=builder /usr/src/app/target/release/backend ./backend
COPY --from=builder /usr/src/app/target/release/experiment ./experiment

# 実行権限を付与
RUN chmod +x backend experiment

# 環境変数の設定
ENV PYTHONPATH=/usr/src/app

# ボリュームマウント用（docker-compose.ymlで設定）
VOLUME ["/usr/src/app"]

# 開発時にはcargo-watchでバイナリを実行
CMD ["cargo-watch", "-x", "run --bin experiment"]
