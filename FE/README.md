# ReviewCompany Frontend

React frontend application cho ReviewCompany project.

## Công nghệ sử dụng

- **React 19** - UI library
- **Vite** - Build tool và dev server
- **React Router DOM** - Routing
- **Axios** - HTTP client
- **CSS3** - Styling

## Cài đặt

```bash
# Cài đặt dependencies
npm install

# Chạy development server
npm run dev

# Build cho production
npm run build

# Preview production build
npm run preview
```

## Cấu trúc project

```
src/
├── components/          # Reusable components
│   ├── Navbar.jsx
│   ├── ProtectedRoute.jsx
│   ├── ReviewList.jsx
│   ├── ReviewItem.jsx
│   ├── CreateReviewForm.jsx
│   ├── ReplyList.jsx
│   ├── ReplyItem.jsx
│   └── CreateReplyForm.jsx
├── pages/              # Page components
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   └── CompanyDetail.jsx
├── services/           # API services
│   ├── api.js
│   ├── authService.js
│   ├── companyService.js
│   ├── reviewService.js
│   ├── replyService.js
│   └── userService.js
├── contexts/           # React contexts
│   └── AuthContext.jsx
├── config/             # Configuration
│   └── api.js
├── App.jsx             # Main app component
└── main.jsx            # Entry point
```

## Environment Variables

Tạo file `.env` từ `.env.example`:

```bash
cp .env.example .env
```

Cấu hình:

```
VITE_API_BASE_URL=http://localhost:3000/api/v1
VITE_DEFAULT_TENANT=asia
```

## Features

### Authentication
- Đăng ký tài khoản
- Đăng nhập/Đăng xuất
- JWT token management
- Protected routes

### Company
- Xem danh sách công ty
- Xem chi tiết công ty
- Tạo/Cập nhật/Xóa công ty (Admin/Owner)

### Review
- Xem danh sách reviews
- Tạo review mới
- Cập nhật/Xóa review
- Like/Dislike review

### Reply
- Xem replies của review
- Tạo reply mới
- Cập nhật/Xóa reply

## API Integration

Frontend sử dụng API từ backend Rails. Xem [API Documentation](../docs/API_DOCUMENTATION.md) để biết chi tiết.

### Base URL

Mặc định: `http://localhost:3000/api/v1`

Có thể thay đổi qua environment variable `VITE_API_BASE_URL`.

### Authentication

Token được lưu trong `localStorage` với key `access_token` và tự động được thêm vào headers của mỗi request.

### Multi-tenant

Tenant được lưu trong `localStorage` với key `tenant` và tự động được thêm vào header `X-API-TENANT`.

## Development

```bash
# Start dev server (port 5173)
npm run dev

# Lint code
npm run lint
```

## Production Build

```bash
# Build
npm run build

# Output sẽ ở trong folder dist/
```

## Troubleshooting

### CORS Issues

Nếu gặp CORS errors, đảm bảo backend đã cấu hình CORS đúng. Xem `config/initializers/cors.rb` trong backend.

### API Connection

Kiểm tra:
1. Backend đang chạy trên port 3000
2. `VITE_API_BASE_URL` đúng trong `.env`
3. Network tab trong browser DevTools

### Authentication

Nếu không đăng nhập được:
1. Kiểm tra API response trong Network tab
2. Kiểm tra token có được lưu trong localStorage
3. Kiểm tra headers trong requests

## License

[Thêm license nếu có]
