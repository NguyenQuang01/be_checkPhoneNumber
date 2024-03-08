# syntax=docker/dockerfile:1
# Sử dụng một ảnh cơ sở đã có Node.js
# FROM node:18-alpine

# # Tạo thư mục app trong container
# WORKDIR /usr/src/app

# # Sao chép package.json và package-lock.json vào thư mục làm việc
# COPY package*.json ./

# # Cài đặt các dependencies của ứng dụng
# RUN npm install

# # Sao chép toàn bộ mã nguồn của ứng dụng vào thư mục làm việc
# COPY . .

# # Expose cổng mà ứng dụng chạy trên
# EXPOSE 3000

# # Khởi chạy ứng dụng
# CMD ["node", "src/index.js"]
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
COPY . .
RUN yarn install --production
CMD ["node", "src/index.js"]
EXPOSE 3000