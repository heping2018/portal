# 未实现的公开 API 接口文档

## 概述

本文档梳理了 `api.md` 中已定义但尚未在前端 `src/services` 目录中实现的 **公开 (public)** API 接口。这些接口是门户网站面向公众的功能所必需的，后续开发可以参考此列表进行实现。

此外，在分析过程中发现一个需要修正的问题。

---

## 未实现的公开 API 列表

以下是根据 `api.md` 整理的、尚未在前端服务层实现的公开接口。

### 产品模块 (Product)
- `GET /app-api/categories/by-level`: 按层级获取产品类别。

### 产品规格模块 (Product Specs)
- `GET /app-api/products/{productId}/specs`: 获取产品规格列表。
- `GET /app-api/products/{productId}/specs/type/{specType}`: 按类型获取规格。
- `GET /app-api/products/{productId}/specs/required/{specType}`: 获取必填规格。

### 产品下载资源模块 (Product Downloads)
- `GET /app-api/products/{productId}/downloads`: 获取产品下载列表。
- `GET /app-api/products/{productId}/downloads/language/{language}`: 按语言获取下载资源。
- `GET /app-api/products/{productId}/downloads/file-type/{fileType}`: 按文件类型获取下载资源。
- `GET /app-api/products/{productId}/downloads/resource-type/{resourceType}`: 按资源类型获取下载资源。
- `GET /app-api/products/{productId}/downloads/file/{downloadId}`: 下载文件。

### 证书模块 (Certificate)
- `GET /app-api/public/certificate/category/{categoryId}`: 根据类别获取证书列表。
- `GET /app-api/public/certificate/{id}`: 获取证书详情。
- `GET /app-api/public/certificate/valid`: 获取所有未过期的证书。
- `GET /app-api/certificates/{id}/download`: 下载证书文件。
- `GET /app-api/certificates/categories`: 获取证书类别列表。
- `GET /app-api/certificates/categories/{id}`: 获取证书类别详情。

### 新闻模块 (News)
- `GET /app-api/public/news/category/{categoryId}`: 根据类别获取新闻列表。
- `GET /app-api/public/news/featured`: 获取特色新闻。
- `GET /app-api/public/news/pinned`: 获取置顶新闻。
- `GET /app-api/public/news/recent`: 获取最新新闻。
- `GET /app-api/public/news/search`: 搜索新闻。
- `GET /app-api/news/categories`: 获取新闻类别列表。
- `GET /app-api/news/categories/{id}`: 获取新闻类别详情。

### 生产基地模块 (Production Base)
- `GET /app-api/public/production/bases`: 获取生产基地列表。
- `GET /app-api/public/production/bases/{id}`: 获取生产基地详情。

### 质量体系模块 (Quality System)
- `GET /app-api/public/quality/system`: 获取质量体系信息。
- `GET /app-api/public/quality/systems`: 获取质量体系列表。

### 国际化模块 (i18n)
- `GET /public/i18n/current`: 获取当前语言。
- `POST /public/i18n/switch`: 切换语言。
- `GET /public/i18n/supported`: 获取支持的语言列表。
