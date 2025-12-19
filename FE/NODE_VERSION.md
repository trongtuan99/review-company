# Node.js Version Requirements

## Current Setup

Project hiện tại đã được downgrade để tương thích với **Node.js 18.20.4**.

## Recommended: Upgrade Node.js

Để sử dụng các tính năng mới nhất và tốt hơn, khuyến nghị nâng cấp Node.js lên **20.19+** hoặc **22.12+**.

### Cách nâng cấp Node.js

#### Option 1: Sử dụng nvm (Node Version Manager) - Recommended

```bash
# Cài đặt nvm (nếu chưa có)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Reload shell
source ~/.zshrc  # hoặc source ~/.bashrc

# Cài đặt Node.js 20 LTS
nvm install 20

# Sử dụng Node.js 20
nvm use 20

# Set làm default
nvm alias default 20

# Verify
node --version  # Should show v20.x.x
```

#### Option 2: Sử dụng Homebrew (macOS)

```bash
# Cài đặt Node.js 20
brew install node@20

# Link
brew link node@20

# Verify
node --version
```

#### Option 3: Download từ nodejs.org

Tải và cài đặt từ: https://nodejs.org/

## Sau khi nâng cấp Node.js

Nếu đã nâng cấp Node.js lên 20+, bạn có thể upgrade lại dependencies:

```bash
# Upgrade Vite và React
npm install vite@latest @vitejs/plugin-react@latest react@latest react-dom@latest react-router-dom@latest

# Hoặc chỉnh sửa package.json và chạy npm install
```

## Kiểm tra version

```bash
node --version
npm --version
```

