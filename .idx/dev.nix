{ pkgs, ... }: {
  channel = "stable-24.11";
  packages = [
    pkgs.nodejs_latest    # 强制使用 Nixpkgs 中最新的 Node.js 版本（通常是 v23+ 或最新的 v22 LTS）
    pkgs.chromium 
    pkgs.fontconfig
    pkgs.noto-fonts
  ];
  idx = {
    extensions = [
      "vue.volar"
      "google.gemini-cli-vscode-ide-companion"
    ];
    workspace = {
      onCreate = {
        # 使用 install 避免缺少 lock 文件导致的报错
        npm-install = "npm install --no-audit --prefer-offline";
      };
    };
    previews = {
      enable = true;
      previews = {
        web = {
          command = ["npm" "run" "dev" "--" "--port" "$PORT" "--host" "0.0.0.0"];
          manager = "web";
        };
      };
    };
  };
}