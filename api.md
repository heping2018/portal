# Maxunitech Portal API 接口文档

## 目录

- [概述](#概述)
- [通用规范](#通用规范)
  - [基础 URL](#基础-url)
  - [请求头](#请求头)
  - [统一响应格式](#统一响应格式)
  - [错误码](#错误码)
- [认证模块](#认证模块)
- [用户管理](#用户管理)
- [产品模块](#产品模块)
- [产品规格管理](#产品规格管理)
- [产品下载资源管理](#产品下载资源管理)
- [证书管理](#证书管理)
- [证书类别管理](#证书类别管理)
- [新闻管理](#新闻管理)
- [新闻类别管理](#新闻类别管理)
- [部门管理](#部门管理)
- [角色管理](#角色管理)
- [菜单管理](#菜单管理)
- [字典管理](#字典管理)
- [文件管理](#文件管理)
- [国际化](#国际化)

---

## 概述

Maxunitech Portal（合力科技企业门户）是一套支持多语言（中文、英语、葡萄牙语、西班牙语）的企业门户网站 API。

### 技术栈

- **框架**: Spring Boot 2.7.18
- **Java 版本**: JDK 17
- **数据访问**: MyBatis / MyBatis-Plus
- **数据库**: MySQL 8.0+
- **缓存**: Redis
- **认证授权**: Spring Security + JWT (RBAC)

---

## 通用规范

### 基础 URL

| 环境 | 基础 URL |
|------|----------|
| 开发环境 | `http://localhost:8080/api` |
| 生产环境 | `https://api.maxunitech.com/api` |

### 请求头

| Header 名称 | 必填 | 说明 | 示例值 |
|-------------|------|------|--------|
| `Authorization` | 是* | JWT 访问令牌（管理后台 API 需要） | `Bearer eyJhbGciOiJIUzUxMiJ9...` |
| `Accept-Language` | 否 | 国际化语言 | `zh-CN`, `en`, `pt`, `es` |
| `Content-Type` | 是* | 请求内容类型 | `application/json` |
| `Tenant-Id` | 条件必填 | 租户 ID（多租户场景） | `1` |

*注：公开 API 不需要 `Authorization` 和 `Content-Type`（GET 请求）

### 统一响应格式

所有 API 响应都遵循以下格式：

```typescript
interface CommonResult<T> {
  code: number;      // 状态码，0 表示成功
  msg: string;       // 响应消息
  data: T;           // 响应数据
}
```

#### 分页响应格式

```typescript
interface PageResult<T> {
  total: number;     // 总记录数
  list: T[];         // 数据列表
}
```

### 错误码

| 错误码 | 说明 |
|--------|------|
| 0 | 成功 |
| 400 | 请求参数不正确 |
| 401 | 账号未登录 |
| 403 | 没有该操作权限 |
| 404 | 请求未找到 |
| 405 | 请求方法不正确 |
| 423 | 请求失败，请稍后重试（并发） |
| 429 | 请求过于频繁，请稍后重试 |
| 500 | 系统异常 |
| 501 | 功能未实现或未开启 |
| 502 | 错误的配置项 |
| 900 | 重复请求，请稍后重试 |
| 901 | 演示模式，禁止写操作 |
| 999 | 未知错误 |

---

## 认证模块

### 账号密码登录

**Endpoint**: `POST /admin-api/system/auth/login`

**认证要求**: Public

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Body | username | string | 是 | 登录账号（字母数字） |
| Body | password | string | 是 | 密码 |
| Body | socialType | integer | 否 | 社交平台类型（社交登录时） |
| Body | socialCode | string | 否 | 社交授权码 |
| Body | socialState | string | 否 | 社交授权状态 |

#### 请求体示例

```json
{
  "username": "admin",
  "password": "admin123"
}
```

#### 响应数据

```typescript
interface AuthLoginRespVO {
  userId: number;           // 用户编号
  accessToken: string;      // 访问令牌
  refreshToken: string;     // 刷新令牌
  expiresTime: string;      // 过期时间（ISO 8601）
}
```

#### 响应示例

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "userId": 1,
    "accessToken": "eyJhbGciOiJIUzUxMiJ9...",
    "refreshToken": "refresh_token_here",
    "expiresTime": "2024-12-31T23:59:59"
  }
}
```

---

### 登出系统

**Endpoint**: `POST /admin-api/system/auth/logout`

**认证要求**: Public

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Header | Authorization | string | 是 | JWT 令牌 |

#### 响应数据

```typescript
boolean  // true 表示登出成功
```

---

### 刷新令牌

**Endpoint**: `POST /admin-api/system/auth/refresh-token`

**认证要求**: Public

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | refreshToken | string | 是 | 刷新令牌 |

#### 响应数据

同【账号密码登录】的 `AuthLoginRespVO`

---

### 获取用户权限信息

**Endpoint**: `GET /admin-api/system/auth/get-permission-info`

**认证要求**: JWT

#### 响应数据

```typescript
interface AuthPermissionInfoRespVO {
  user: {
    id: number;
    username: string;
    nickname: string;
    deptId: number;
    postIds: number[];
    email: string;
    mobile: string;
    sex: number;
    avatar: string;
  };
  roles: Array<{
    id: number;
    name: string;
    code: string;
  }>;
  permissions: string[];      // 权限标识列表
  menus: MenuVO[];            // 菜单树
}
```

---

### 用户注册

**Endpoint**: `POST /admin-api/system/auth/register`

**认证要求**: Public

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Body | username | string | 是 | 用户名 |
| Body | password | string | 是 | 密码 |
| Body | nickname | string | 是 | 昵称 |
| Body | email | string | 否 | 邮箱 |
| Body | mobile | string | 否 | 手机号 |

#### 响应数据

同【账号密码登录】的 `AuthLoginRespVO`

---

### 短信验证码登录

**Endpoint**: `POST /admin-api/system/auth/sms-login`

**认证要求**: Public

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Body | mobile | string | 是 | 手机号 |
| Body | code | string | 是 | 短信验证码 |

#### 响应数据

同【账号密码登录】的 `AuthLoginRespVO`

---

### 发送短信验证码

**Endpoint**: `POST /admin-api/system/auth/send-sms-code`

**认证要求**: Public

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Body | mobile | string | 是 | 手机号 |
| Body | scene | integer | 否 | 发送场景 |

#### 响应数据

```typescript
boolean  // true 表示发送成功
```

---

### 重置密码

**Endpoint**: `POST /admin-api/system/auth/reset-password`

**认证要求**: Public

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Body | mobile | string | 是 | 手机号 |
| Body | code | string | 是 | 短信验证码 |
| Body | password | string | 是 | 新密码 |

#### 响应数据

```typescript
boolean  // true 表示重置成功
```

---

### 社交登录授权跳转

**Endpoint**: `GET /admin-api/system/auth/social-auth-redirect`

**认证要求**: Public

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | type | integer | 是 | 社交类型 |
| Query | redirectUri | string | 否 | 回调路径 |

#### 响应数据

```typescript
string  // 授权 URL
```

---

### 社交快捷登录

**Endpoint**: `POST /admin-api/system/auth/social-login`

**认证要求**: Public

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Body | type | integer | 是 | 社交类型 |
| Body | code | string | 是 | 授权码 |
| Body | state | string | 是 | 授权状态 |

#### 响应数据

同【账号密码登录】的 `AuthLoginRespVO`

---


---

## 认证配置管理

### 获取认证配置

**Endpoint**: `GET /admin-api/system/auth-config/get`

**认证要求**: JWT (`system:auth-config:query`)

#### 响应数据

```typescript
interface AuthConfigRespVO {
  authType: string;              // 认证类型: JWT | OAUTH2
  singleDeviceLogin: boolean;    // 是否启用单点登录
  sessionTimeout: number;        // 会话超时时间（秒）
  jwtSecret: string;             // JWT 密钥
  jwtExpiration: number;         // JWT 过期时间（毫秒）
  oauth2Provider: string;        // OAuth2 提供商
  oauth2ClientId: string;        // OAuth2 客户端 ID
  oauth2RedirectUri: string;     // OAuth2 回调地址
}
```

---

### 更新认证配置

**Endpoint**: `PUT /admin-api/system/auth-config/update`

**认证要求**: JWT (`system:auth-config:update`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Body | authType | string | 是 | 认证类型（JWT 或 OAUTH2） |
| Body | singleDeviceLogin | boolean | 是 | 是否启用单点登录 |
| Body | sessionTimeout | number | 是 | 会话超时时间（秒） |
| Body | jwtSecret | string | 否 | JWT 密钥 |
| Body | jwtExpiration | number | 否 | JWT 过期时间（毫秒） |
| Body | oauth2Provider | string | 否 | OAuth2 提供商 |
| Body | oauth2ClientId | string | 否 | OAuth2 客户端 ID |
| Body | oauth2ClientSecret | string | 否 | OAuth2 客户端密钥 |
| Body | oauth2RedirectUri | string | 否 | OAuth2 回调地址 |

#### 响应数据

```typescript
boolean  // true 表示更新成功
```

---

### 切换认证方式

**Endpoint**: `POST /admin-api/system/auth-config/switch-auth-type`

**认证要求**: JWT (`system:auth-config:switch`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | authType | string | 是 | 认证类型（JWT 或 OAUTH2） |

#### 响应数据

```typescript
boolean  // true 表示切换成功
```

---

### 启用/禁用单点登录

**Endpoint**: `POST /admin-api/system/auth-config/toggle-sso`

**认证要求**: JWT (`system:auth-config:sso`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | enabled | boolean | 是 | 是否启用单点登录 |

#### 响应数据

```typescript
boolean  // true 表示设置成功
```


## 用户管理

### 创建用户

**Endpoint**: `POST /admin-api/system/user/create`

**认证要求**: JWT (`system:user:create`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Body | username | string | 是 | 用户账号（字母数字） |
| Body | password | string | 是 | 密码 |
| Body | nickname | string | 否 | 用户昵称 |
| Body | deptId | number | 否 | 部门编号 |
| Body | postIds | number[] | 否 | 岗位编号数组 |
| Body | roleIds | number[] | 否 | 角色编号数组 |
| Body | email | string | 否 | 邮箱 |
| Body | mobile | string | 否 | 手机号 |
| Body | sex | number | 否 | 性别（1-男 2-女） |
| Body | avatar | string | 否 | 头像 URL |
| Body | remark | string | 否 | 备注 |

#### 响应数据

```typescript
number  // 新创建的用户 ID
```

---

### 修改用户

**Endpoint**: `PUT /admin-api/system/user/update`

**认证要求**: JWT (`system:user:update`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Body | id | number | 是 | 用户编号 |
| Body | username | string | 否 | 用户账号 |
| Body | nickname | string | 否 | 用户昵称 |
| Body | deptId | number | 否 | 部门编号 |
| Body | postIds | number[] | 否 | 岗位编号数组 |
| Body | roleIds | number[] | 否 | 角色编号数组 |
| Body | email | string | 否 | 邮箱 |
| Body | mobile | string | 否 | 手机号 |
| Body | sex | number | 否 | 性别 |
| Body | avatar | string | 否 | 头像 URL |
| Body | remark | string | 否 | 备注 |

#### 响应数据

```typescript
boolean  // true 表示修改成功
```

---

### 删除用户

**Endpoint**: `DELETE /admin-api/system/user/delete`

**认证要求**: JWT (`system:user:delete`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | id | number | 是 | 用户编号 |

#### 响应数据

```typescript
boolean  // true 表示删除成功
```

---

### 批量删除用户

**Endpoint**: `DELETE /admin-api/system/user/delete-list`

**认证要求**: JWT (`system:user:delete`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | ids | number[] | 是 | 用户编号列表 |

#### 响应数据

```typescript
boolean  // true 表示删除成功
```

---

### 获取用户分页列表

**Endpoint**: `GET /admin-api/system/user/page`

**认证要求**: JWT (`system:user:query`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | username | string | 否 | 用户账号（模糊匹配） |
| Query | mobile | string | 否 | 手机号（模糊匹配） |
| Query | status | number | 否 | 状态（0-禁用 1-启用） |
| Query | deptId | number | 否 | 部门编号（包含子部门） |
| Query | roleId | number | 否 | 角色编号 |
| Query | createTime | string[] | 否 | 创建时间范围 |
| Query | pageNo | number | 是 | 页码（从 1 开始） |
| Query | pageSize | number | 是 | 每页数量 |

#### 响应数据

```typescript
interface PageResult<UserRespVO> {
  total: number;
  list: UserRespVO[];
}

interface UserRespVO {
  id: number;
  username: string;
  nickname: string;
  remark: string;
  deptId: number;
  deptName: string;
  postIds: number[];
  roleIds: number[];
  posts: PostSimpleRespVO[];
  roles: RoleSimpleRespVO[];
  email: string;
  mobile: string;
  sex: number;
  avatar: string;
  status: number;
  loginIp: string;
  loginDate: string;
  createTime: string;
}
```

---

### 获取用户详情

**Endpoint**: `GET /admin-api/system/user/get`

**认证要求**: JWT (`system:user:query`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | id | number | 是 | 用户编号 |

#### 响应数据

同 `UserRespVO`

---

### 获取用户精简列表

**Endpoint**: `GET /admin-api/system/user/list-all-simple`

**认证要求**: JWT

#### 响应数据

```typescript
interface UserSimpleRespVO {
  id: number;
  username: string;
  nickname: string;
  deptId: number;
  deptName: string;
  postIds: number[];
  postNames: string[];
  status: number;
}
```

---

### 修改用户密码

**Endpoint**: `PUT /admin-api/system/user/update-password`

**认证要求**: JWT (`system:user:update-password`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Body | id | number | 是 | 用户编号 |
| Body | password | string | 是 | 新密码 |

#### 响应数据

```typescript
boolean  // true 表示修改成功
```

---

### 修改用户状态

**Endpoint**: `PUT /admin-api/system/user/update-status`

**认证要求**: JWT (`system:user:update`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Body | id | number | 是 | 用户编号 |
| Body | status | number | 是 | 状态（0-禁用 1-启用） |

#### 响应数据

```typescript
boolean  // true 表示修改成功
```

---

### 导出用户 Excel

**Endpoint**: `GET /admin-api/system/user/export-excel`

**认证要求**: JWT (`system:user:export`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | username | string | 否 | 用户账号 |
| Query | mobile | string | 否 | 手机号 |
| Query | status | number | 否 | 状态 |
| Query | deptId | number | 否 | 部门编号 |
| Query | roleId | number | 否 | 角色编号 |

#### 响应数据

直接下载 Excel 文件

---

### 获取导入模板

**Endpoint**: `GET /admin-api/system/user/get-import-template`

**认证要求**: JWT

#### 响应数据

直接下载 Excel 模板文件

---

### 导入用户

**Endpoint**: `POST /admin-api/system/user/import`

**认证要求**: JWT (`system:user:import`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| FormData | file | File | 是 | Excel 文件 |
| FormData | updateSupport | boolean | 否 | 是否支持更新 |

#### 响应数据

```typescript
interface UserImportRespVO {
  successCount: number;     // 成功数量
  failureCount: number;     // 失败数量
  failureList: string[];    // 失败原因列表
}
```

---

## 产品模块

### 获取产品列表

**Endpoint**: `GET /products`

**认证要求**: Public

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | keyword | string | 否 | 搜索关键词 |

#### 响应数据

```typescript
interface ProductVO {
  id: number;
  code: string;              // 产品编码
  category: string;          // 产品分类
  titleZh: string;           // 产品名称（中文）
  titleEn: string;           // 产品名称（英文）
  titlePt: string;           // 产品名称（葡萄牙语）
  titleEs: string;           // 产品名称（西班牙语）
  descriptionZh: string;     // 产品描述（中文）
  descriptionEn: string;     // 产品描述（英文）
  descriptionPt: string;     // 产品描述（葡萄牙语）
  descriptionEs: string;     // 产品描述（西班牙语）
  imageUrl: string;          // 图片 URL
  active: boolean;           // 是否启用
  specIds: string;           // 规格 ID 列表（逗号分隔）
  downloadIds: string;       // 下载资源 ID 列表（逗号分隔）
  createTime: string;        // 创建时间
  updateTime: string;        // 更新时间
}
```

#### 响应示例

```json
{
  "code": 0,
  "msg": "",
  "data": [
    {
      "id": 1,
      "code": "PROD001",
      "category": "electronics",
      "title": "智能控制器",
      "description": "高性能工业级智能控制器",
      "imageUrl": "https://cdn.example.com/product1.jpg",
      "active": true
    }
  ]
}
```

---

### 获取产品详情

**Endpoint**: `GET /products/{id}`

**认证要求**: Public

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Path | id | number | 是 | 产品 ID |

#### 响应数据

同 `ProductVO`

---

### 获取产品分页列表

**Endpoint**: GET /products/page

**认证要求**: Public

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | pageNo | number | 是 | 页码（从 1 开始，默认 1） |
| Query | pageSize | number | 是 | 每页数量（默认 20） |
| Query | category | string | 否 | 产品类别 |
| Query | keyword | string | 否 | 搜索关键词 |
| Query | specKey | string | 否 | 规格键（用于过滤） |
| Query | specValue | string | 否 | 规格值（用于过滤） |

#### 响应数据

interface PageResult<ProductVO> {
  total: number;
  list: ProductVO[];
}

---

### 获取产品完整详情

**Endpoint**: GET /products/{id}/detail

**认证要求**: Public

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Path | id | number | 是 | 产品 ID |

#### 响应数据

interface ProductDetailVO {
  id: number;
  code: string;
  category: string;
  titleZh: string;
  titleEn: string;
  titlePt: string;
  titleEs: string;
  descriptionZh: string;
  descriptionEn: string;
  descriptionPt: string;
  descriptionEs: string;
  imageUrl: string;
  active: boolean;
  specs: ProductSpecVO[];
  downloads: ProductDownloadVO[];
  createTime: string;
  updateTime: string;
}

interface ProductSpecVO {
  id: number;
  productId: number;
  specKey: string;
  specValue: string;
  specUnit: string;
  specType: string;
  required: boolean;
  sortOrder: number;
}

interface ProductDownloadVO {
  id: number;
  productId: number;
  title: string;
  fileType: string;
  resourceType: string;
  fileSize: number;
  downloadUrl: string;
  language: string;
  downloadCount: number;
  active: boolean;
  sortOrder: number;
}

---


### 按规格筛选产品

**Endpoint**: `GET /products/filter`

**认证要求**: Public

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | category | string | 否 | 产品分类 |
| Query | specKey | string | 否 | 规格键 |
| Query | specValue | string | 否 | 规格值 |

#### 响应数据

`ProductVO[]`

---

### 获取类别树

**Endpoint**: `GET /categories`

**认证要求**: Public

#### 响应数据

```typescript
interface ProductCategoryDO {
  id: number;
  code: string;
  nameZh: string;
  nameEn: string;
  namePt: string;
  nameEs: string;
  parentId: number;
  level: number;
  sortOrder: number;
  active: boolean;
  children?: ProductCategoryDO[];
}
```

---

### 按层级获取类别

**Endpoint**: `GET /categories/by-level`

**认证要求**: Public

#### 响应数据

```typescript
{
  [level: number]: ProductCategoryDO[]
}
```

---

## 产品规格管理

### 获取产品规格列表

**Endpoint**: `GET /products/{productId}/specs`

**认证要求**: Public

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Path | productId | number | 是 | 产品 ID |

#### 响应数据

```typescript
interface ProductSpecDO {
  id: number;
  productId: number;
  specKey: string;      // 规格参数名称（如：电压、电流、尺寸）
  specValue: string;    // 规格参数值（如：220V, 5A, 100mm）
  specUnit: string;     // 规格单位（如：V, A, mm）
  specType: string;     // 规格类型（如：electrical, mechanical, environmental）
  required: boolean;    // 是否为必填规格
  sortOrder: number;    // 显示顺序
  createTime: string;
  updateTime: string;
}
```

---

### 按类型获取规格

**Endpoint**: `GET /products/{productId}/specs/type/{specType}`

**认证要求**: Public

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Path | productId | number | 是 | 产品 ID |
| Path | specType | string | 是 | 规格类型 |

#### 响应数据

`ProductSpecDO[]`

---

### 获取必填规格

**Endpoint**: `GET /products/{productId}/specs/required/{specType}`

**认证要求**: Public

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Path | productId | number | 是 | 产品 ID |
| Path | specType | string | 是 | 规格类型 |

#### 响应数据

`ProductSpecDO[]`

---

## 产品下载资源管理

### 获取产品下载列表

**Endpoint**: `GET /products/{productId}/downloads`

**认证要求**: Public

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Path | productId | number | 是 | 产品 ID |

#### 响应数据

```typescript
interface ProductDownloadDO {
  id: number;
  productId: number;
  title: string;           // 资源标题
  fileType: string;        // 文件类型（pdf, docx, xlsx, jpg 等）
  resourceType: string;    // 资源类型（datasheet, manual, certificate, image）
  fileSize: number;        // 文件大小（字节）
  filePath: string;        // 文件存储路径
  downloadUrl: string;     // 文件下载 URL
  language: string;        // 语言（zh, en, pt, es）
  downloadCount: number;   // 下载次数统计
  active: boolean;         // 是否启用
  sortOrder: number;       // 显示顺序
  createTime: string;
  updateTime: string;
}
```

---

### 按语言获取下载资源

**Endpoint**: `GET /products/{productId}/downloads/language/{language}`

**认证要求**: Public

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Path | productId | number | 是 | 产品 ID |
| Path | language | string | 是 | 语言代码（zh, en, pt, es） |

#### 响应数据

`ProductDownloadDO[]`

---

### 按文件类型获取下载资源

**Endpoint**: `GET /products/{productId}/downloads/file-type/{fileType}`

**认证要求**: Public

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Path | productId | number | 是 | 产品 ID |
| Path | fileType | string | 是 | 文件类型（pdf, docx, xlsx 等） |

#### 响应数据

`ProductDownloadDO[]`

---

### 按资源类型获取下载资源

**Endpoint**: `GET /products/{productId}/downloads/resource-type/{resourceType}`

**认证要求**: Public

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Path | productId | number | 是 | 产品 ID |
| Path | resourceType | string | 是 | 资源类型（datasheet, manual, certificate, image） |

#### 响应数据

`ProductDownloadDO[]`

---

### 下载文件

**Endpoint**: `GET /products/{productId}/downloads/file/{downloadId}`

**认证要求**: Public

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Path | productId | number | 是 | 产品 ID |
| Path | downloadId | number | 是 | 下载资源 ID |

#### 响应数据

直接下载文件或返回 302 重定向到外部 URL

---

## 证书管理

### 获取证书列表

**Endpoint**: `GET /certificates`

**认证要求**: Public

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | categoryId | number | 否 | 类别 ID |

#### 响应数据

```typescript
interface CertificateVO {
  id: number;
  code: string;
  nameZh: string;
  nameEn: string;
  namePt: string;
  nameEs: string;
  issuingAuthority: string;    // 发证机构
  certificateNumber: string;   // 证书编号
  issueDate: string;           // 发证日期
  expiryDate: string;          // 过期日期
  categoryId: number;
  imageUrl: string;
  hasFile: boolean;
  fileId: string;           // 证书文件 ID（用于下载）
  sortOrder: number;
  active: boolean;
  descriptionZh: string;    // 证书描述（中文）
  descriptionEn: string;    // 证书描述（英文）
  descriptionPt: string;    // 证书描述（葡萄牙语）
  descriptionEs: string;    // 证书描述（西班牙语）
          // 过期状态
  createTime: string;
  updateTime: string;
}
```

---

### 获取有效证书列表

**Endpoint**: `GET /certificates/valid`

**认证要求**: Public

#### 响应数据

`CertificateVO[]`

---

### 获取即将到期证书

**Endpoint**: `GET /certificates/expiring`

**认证要求**: Public

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | days | number | 否 | 天数（默认 30） |

#### 响应数据

`CertificateVO[]`

---

### 获取证书详情

**Endpoint**: `GET /certificates/{id}`

**认证要求**: Public

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Path | id | number | 是 | 证书 ID |

#### 响应数据

`CertificateVO`

---



---

### 下载证书文件

**Endpoint**: GET /certificates/{id}/download

**认证要求**: Public

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Path | id | number | 是 | 证书 ID |

#### 响应数据

直接下载文件流

---
## 证书类别管理

### 获取证书类别列表

**Endpoint**: `GET /certificates/categories`

**认证要求**: Public

#### 响应数据

```typescript
interface CertificateCategoryVO {
  id: number;
  code: string;
  nameZh: string;
  nameEn: string;
  namePt: string;
  nameEs: string;
  descriptionZh: string;
  descriptionEn: string;
  descriptionPt: string;
  descriptionEs: string;
  sortOrder: number;
  active: boolean;
  iconUrl: string;
  createTime: string;
  updateTime: string;
}
```

---

## 新闻管理

### 获取新闻列表

**Endpoint**: `GET /news`

**认证要求**: Public

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | categoryId | number | 否 | 类别 ID |

#### 响应数据

```typescript
interface NewsVO {
  id: number;
  code: string;
  titleZh: string;
  titleEn: string;
  titlePt: string;
  titleEs: string;
  summaryZh: string;
  summaryEn: string;
  summaryPt: string;
  summaryEs: string;
  source: string;
  author: string;
  publishDate: string;
  categoryId: number;
  categoryName: string;
  thumbnailUrl: string;
  featured: boolean;
  pinned: boolean;
  viewCount: number;
  externalUrl: string;
  sortOrder: number;
  active: boolean;
  createTime: string;
  updateTime: string;
}
```

---

### 获取特色新闻

**Endpoint**: `GET /news/featured`

**认证要求**: Public

#### 响应数据

`NewsVO[]`

---

### 获取置顶新闻

**Endpoint**: `GET /news/pinned`

**认证要求**: Public

#### 响应数据

`NewsVO[]`

---

### 获取最近新闻

**Endpoint**: `GET /news/recent`

**认证要求**: Public

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | limit | number | 否 | 限制数量（默认 10） |

#### 响应数据

`NewsVO[]`

---

### 获取新闻详情

**Endpoint**: `GET /news/{id}`

**认证要求**: Public

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Path | id | number | 是 | 新闻 ID |

#### 响应数据

```typescript
interface NewsDetailVO extends NewsVO {
  contentZh: string;
  contentEn: string;
  contentPt: string;
  contentEs: string;
  category: NewsCategoryVO;
}
```

---

## 新闻类别管理

### 获取新闻类别列表

**Endpoint**: `GET /news/categories`

**认证要求**: Public

#### 响应数据

```typescript
interface NewsCategoryVO {
  id: number;
  code: string;
  nameZh: string;
  nameEn: string;
  namePt: string;
  nameEs: string;
  descriptionZh: string;
  descriptionEn: string;
  descriptionPt: string;
  descriptionEs: string;
  sortOrder: number;
  active: boolean;
  iconUrl: string;
  createTime: string;
  updateTime: string;
}
```

---

### 获取新闻类别详情

**Endpoint**: `GET /news/categories/{id}`

**认证要求**: Public

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Path | id | number | 是 | 类别 ID |

#### 响应数据

`NewsCategoryVO`

---

## 部门管理

### 创建部门

**Endpoint**: `POST /admin-api/system/dept/create`

**认证要求**: JWT (`system:dept:create`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Body | parentId | number | 否 | 父部门编号 |
| Body | name | string | 是 | 部门名称 |
| Body | code | string | 否 | 部门编码 |
| Body | sort | number | 否 | 排序 |
| Body | leaderUserId | number | 否 | 负责人用户 ID |
| Body | phone | string | 否 | 联系电话 |
| Body | email | string | 否 | 邮箱 |
| Body | status | number | 否 | 状态 |

#### 响应数据

```typescript
number  // 新创建的部门 ID
```

---

### 更新部门

**Endpoint**: `PUT /admin-api/system/dept/update`

**认证要求**: JWT (`system:dept:update`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Body | id | number | 是 | 部门编号 |
| Body | parentId | number | 否 | 父部门编号 |
| Body | name | string | 否 | 部门名称 |
| Body | code | string | 否 | 部门编码 |
| Body | sort | number | 否 | 排序 |
| Body | leaderUserId | number | 否 | 负责人用户 ID |
| Body | phone | string | 否 | 联系电话 |
| Body | email | string | 否 | 邮箱 |
| Body | status | number | 否 | 状态 |

#### 响应数据

```typescript
boolean  // true 表示更新成功
```

---

### 删除部门

**Endpoint**: `DELETE /admin-api/system/dept/delete`

**认证要求**: JWT (`system:dept:delete`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | id | number | 是 | 部门编号 |

#### 响应数据

```typescript
boolean  // true 表示删除成功
```

---

### 获取部门列表

**Endpoint**: `GET /admin-api/system/dept/list`

**认证要求**: JWT (`system:dept:query`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | name | string | 否 | 部门名称（模糊匹配） |
| Query | status | number | 否 | 状态 |

#### 响应数据

```typescript
interface DeptRespVO {
  id: number;
  name: string;
  code: string;
  parentId: number;
  sort: number;
  leaderUserId: number;
  leaderUserName: string;
  phone: string;
  email: string;
  status: number;
  createTime: string;
  children?: DeptRespVO[];
}
```

---

### 获取部门精简列表

**Endpoint**: `GET /admin-api/system/dept/list-all-simple`

**认证要求**: JWT

#### 响应数据

```typescript
interface DeptSimpleRespVO {
  id: number;
  name: string;
  parentId: number;
}
```

---

### 获取部门详情

**Endpoint**: `GET /admin-api/system/dept/get`

**认证要求**: JWT (`system:dept:query`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | id | number | 是 | 部门编号 |

#### 响应数据

`DeptRespVO`

---

## 角色管理

### 创建角色

**Endpoint**: `POST /admin-api/system/role/create`

**认证要求**: JWT (`system:role:create`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Body | name | string | 是 | 角色名称 |
| Body | code | string | 是 | 角色编码 |
| Body | sort | number | 否 | 排序 |
| Body | dataScope | number | 否 | 数据范围 |
| Body | dataScopeDeptIds | number[] | 否 | 数据范围部门 ID 列表 |
| Body | status | number | 否 | 状态 |
| Body | remark | string | 否 | 备注 |

#### 响应数据

```typescript
number  // 新创建的角色 ID
```

---

### 更新角色

**Endpoint**: `PUT /admin-api/system/role/update`

**认证要求**: JWT (`system:role:update`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Body | id | number | 是 | 角色编号 |
| Body | name | string | 否 | 角色名称 |
| Body | code | string | 否 | 角色编码 |
| Body | sort | number | 否 | 排序 |
| Body | dataScope | number | 否 | 数据范围 |
| Body | dataScopeDeptIds | number[] | 否 | 数据范围部门 ID 列表 |
| Body | status | number | 否 | 状态 |
| Body | remark | string | 否 | 备注 |

#### 响应数据

```typescript
boolean  // true 表示更新成功
```

---

### 删除角色

**Endpoint**: `DELETE /admin-api/system/role/delete`

**认证要求**: JWT (`system:role:delete`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | id | number | 是 | 角色编号 |

#### 响应数据

```typescript
boolean  // true 表示删除成功
```

---

### 获取角色分页

**Endpoint**: `GET /admin-api/system/role/page`

**认证要求**: JWT (`system:role:query`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | name | string | 否 | 角色名称（模糊匹配） |
| Query | code | string | 否 | 角色编码（模糊匹配） |
| Query | status | number | 否 | 状态 |
| Query | createTime | string[] | 否 | 创建时间范围 |
| Query | pageNo | number | 是 | 页码 |
| Query | pageSize | number | 是 | 每页数量 |

#### 响应数据

```typescript
interface PageResult<RoleRespVO> {
  total: number;
  list: RoleRespVO[];
}

interface RoleRespVO {
  id: number;
  name: string;
  code: string;
  sort: number;
  dataScope: number;
  dataScopeDeptIds: number[];
  status: number;
  type: number;
  remark: string;
  createTime: string;
}
```

---

### 获取角色精简列表

**Endpoint**: `GET /admin-api/system/role/list-all-simple`

**认证要求**: JWT

#### 响应数据

`RoleRespVO[]`

---

### 获取角色详情

**Endpoint**: `GET /admin-api/system/role/get`

**认证要求**: JWT (`system:role:query`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | id | number | 是 | 角色编号 |

#### 响应数据

`RoleRespVO`

---

## 菜单管理

### 创建菜单

**Endpoint**: `POST /admin-api/system/menu/create`

**认证要求**: JWT (`system:menu:create`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Body | parentId | number | 否 | 父菜单编号 |
| Body | name | string | 是 | 菜单名称 |
| Body | permission | string | 否 | 权限标识 |
| Body | type | number | 是 | 菜单类型（1-目录 2-菜单 3-按钮） |
| Body | sort | number | 否 | 排序 |
| Body | icon | string | 否 | 菜单图标 |
| Body | component | string | 否 | 组件路径 |
| Body | componentName | string | 否 | 组件名称 |
| Body | path | string | 否 | 路由地址 |
| Body | visible | boolean | 否 | 是否可见 |
| Body | status | number | 否 | 状态 |

#### 响应数据

```typescript
number  // 新创建的菜单 ID
```

---

### 更新菜单

**Endpoint**: `PUT /admin-api/system/menu/update`

**认证要求**: JWT (`system:menu:update`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Body | id | number | 是 | 菜单编号 |
| Body | parentId | number | 否 | 父菜单编号 |
| Body | name | string | 否 | 菜单名称 |
| Body | permission | string | 否 | 权限标识 |
| Body | type | number | 否 | 菜单类型 |
| Body | sort | number | 否 | 排序 |
| Body | icon | string | 否 | 菜单图标 |
| Body | component | string | 否 | 组件路径 |
| Body | componentName | string | 否 | 组件名称 |
| Body | path | string | 否 | 路由地址 |
| Body | visible | boolean | 否 | 是否可见 |
| Body | status | number | 否 | 状态 |

#### 响应数据

```typescript
boolean  // true 表示更新成功
```

---

### 删除菜单

**Endpoint**: `DELETE /admin-api/system/menu/delete`

**认证要求**: JWT (`system:menu:delete`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | id | number | 是 | 菜单编号 |

#### 响应数据

```typescript
boolean  // true 表示删除成功
```

---

### 获取菜单列表

**Endpoint**: `GET /admin-api/system/menu/list`

**认证要求**: JWT (`system:menu:query`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | name | string | 否 | 菜单名称（模糊匹配） |
| Query | status | number | 否 | 状态 |

#### 响应数据

```typescript
interface MenuRespVO {
  id: number;
  name: string;
  permission: string;
  type: number;
  sort: number;
  parentId: number;
  icon: string;
  component: string;
  componentName: string;
  path: string;
  visible: boolean;
  status: number;
  createTime: string;
  children?: MenuRespVO[];
}
```

---

### 获取菜单精简列表

**Endpoint**: `GET /admin-api/system/menu/list-all-simple`

**认证要求**: JWT

#### 响应数据

```typescript
interface MenuSimpleRespVO {
  id: number;
  name: string;
  permission: string;
  type: number;
  parentId: number;
}
```

---

### 获取菜单详情

**Endpoint**: `GET /admin-api/system/menu/get`

**认证要求**: JWT (`system:menu:query`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | id | number | 是 | 菜单编号 |

#### 响应数据

`MenuRespVO`

---

## 字典管理

### 创建字典数据

**Endpoint**: `POST /admin-api/system/dict-data/create`

**认证要求**: JWT (`system:dict:create`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Body | dictTypeId | number | 是 | 字典类型编号 |
| Body | label | string | 是 | 字典标签 |
| Body | value | string | 是 | 字典值 |
| Body | sort | number | 否 | 排序 |
| Body | colorType | string | 否 | 颜色类型 |
| Body | cssClass | string | 否 | CSS 类名 |
| Body | remark | string | 否 | 备注 |
| Body | status | number | 否 | 状态 |

#### 响应数据

```typescript
number  // 新创建的字典数据 ID
```

---

### 更新字典数据

**Endpoint**: `PUT /admin-api/system/dict-data/update`

**认证要求**: JWT (`system:dict:update`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Body | id | number | 是 | 字典数据编号 |
| Body | label | string | 否 | 字典标签 |
| Body | value | string | 否 | 字典值 |
| Body | sort | number | 否 | 排序 |
| Body | colorType | string | 否 | 颜色类型 |
| Body | cssClass | string | 否 | CSS 类名 |
| Body | remark | string | 否 | 备注 |
| Body | status | number | 否 | 状态 |

#### 响应数据

```typescript
boolean  // true 表示更新成功
```

---

### 删除字典数据

**Endpoint**: `DELETE /admin-api/system/dict-data/delete`

**认证要求**: JWT (`system:dict:delete`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | id | number | 是 | 字典数据编号 |

#### 响应数据

```typescript
boolean  // true 表示删除成功
```

---

### 获取字典数据分页

**Endpoint**: `GET /admin-api/system/dict-data/page`

**认证要求**: JWT (`system:dict:query`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | dictTypeId | number | 否 | 字典类型编号 |
| Query | label | string | 否 | 字典标签（模糊匹配） |
| Query | status | number | 否 | 状态 |
| Query | pageNo | number | 是 | 页码 |
| Query | pageSize | number | 是 | 每页数量 |

#### 响应数据

```typescript
interface PageResult<DictDataRespVO> {
  total: number;
  list: DictDataRespVO[];
}

interface DictDataRespVO {
  id: number;
  dictTypeId: number;
  label: string;
  value: string;
  sort: number;
  colorType: string;
  cssClass: string;
  remark: string;
  status: number;
  createTime: string;
}
```

---

### 获取全部字典数据列表

**Endpoint**: `GET /admin-api/system/dict-data/list-all-simple`

**认证要求**: JWT

#### 响应数据

```typescript
interface DictDataSimpleRespVO {
  id: number;
  label: string;
  value: string;
  colorType: string;
  cssClass: string;
}
```

---

### 获取字典数据详情

**Endpoint**: `GET /admin-api/system/dict-data/get`

**认证要求**: JWT (`system:dict:query`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | id | number | 是 | 字典数据编号 |

#### 响应数据

`DictDataRespVO`

---

## 文件管理

### 上传文件（返回路径）

**Endpoint**: `POST /admin-api/infra/file/upload`

**认证要求**: JWT

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| FormData | file | File | 是 | 文件 |
| FormData | directory | string | 否 | 文件目录 |

#### 响应数据

```typescript
string  // 文件访问路径 URL
```

---

### 上传文件（返回 ID）

**Endpoint**: `POST /admin-api/infra/file/upload-id`

**认证要求**: JWT

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| FormData | file | File | 是 | 文件 |
| FormData | directory | string | 否 | 文件目录 |

#### 响应数据

```typescript
interface FileRespVO {
  id: number;
  name: string;
  url: string;
  size: number;
  createTime: string;
}
```

---

### 获取上传预签名地址

**Endpoint**: `GET /admin-api/infra/file/presigned-url`

**认证要求**: JWT

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | name | string | 是 | 文件名称 |
| Query | directory | string | 否 | 文件目录 |

#### 响应数据

```typescript
interface FilePresignedUrlRespVO {
  uploadUrl: string;        // 上传地址
  url: string;              // 文件访问地址
  key: string;              // 文件标识
}
```

---

### 获取读取预签名地址

**Endpoint**: `GET /admin-api/infra/file/presigned-url/get`

**认证要求**: JWT

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | id | number | 是 | 文件 ID |
| Query | expirationSeconds | number | 否 | 访问有效期（秒），默认 600 |

#### 响应数据

```typescript
string  // 预签名读取地址
```

---

### 批量获取读取预签名地址

**Endpoint**: `GET /admin-api/infra/file/presigned-url/get-batch`

**认证要求**: JWT

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | ids | number[] | 是 | 文件 ID 列表 |
| Query | expirationSeconds | number | 否 | 访问有效期（秒） |

#### 响应数据

```typescript
{
  [fileId: number]: string  // 文件 ID -> 预签名地址
}
```

---

### 删除文件

**Endpoint**: `DELETE /admin-api/infra/file/delete`

**认证要求**: JWT (`infra:file:delete`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | id | number | 是 | 文件编号 |

#### 响应数据

```typescript
boolean  // true 表示删除成功
```

---

### 获取文件分页

**Endpoint**: `GET /admin-api/infra/file/page`

**认证要求**: JWT (`infra:file:query`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | name | string | 否 | 文件名（模糊匹配） |
| Query | path | string | 否 | 文件路径 |
| Query | pageNo | number | 是 | 页码 |
| Query | pageSize | number | 是 | 每页数量 |

#### 响应数据

`PageResult<FileRespVO>`

---

## 国际化

### 获取当前语言

**Endpoint**: `GET /public/i18n/current`

**认证要求**: Public

#### 响应数据

```typescript
{
  locale: string;           // 当前语言代码
  supportedLocales: string[]; // 支持的语言列表
}
```

#### 响应示例

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "locale": "zh-CN",
    "supportedLocales": ["zh-CN", "en", "pt", "es"]
  }
}
```

---

### 切换语言

**Endpoint**: `POST /public/i18n/switch`

**认证要求**: Public

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Body | locale | string | 是 | 语言代码 |

#### 请求体示例

```json
{
  "locale": "en"
}
```

#### 响应数据

```typescript
interface LocaleSwitchResponse {
  locale: string;           // 新语言代码
  message: string;          // 提示消息
}
```

---

### 获取支持的语言列表

**Endpoint**: `GET /public/i18n/supported`

**认证要求**: Public

#### 响应数据

```typescript
string[]  // 支持的语言代码列表
```

#### 响应示例

```json
{
  "code": 0,
  "msg": "",
  "data": ["zh-CN", "en", "pt", "es"]
}
```

---

## TypeScript 类型定义

```typescript
// ========== 通用类型 ==========

interface CommonResult<T> {
  code: number;
  msg: string;
  data: T;
}

interface PageResult<T> {
  total: number;
  list: T[];
}

// ========== 认证模块 ==========

interface AuthLoginReqVO {
  username: string;
  password: string;
  socialType?: number;
  socialCode?: string;
  socialState?: string;
}

interface AuthLoginRespVO {
  userId: number;
  accessToken: string;
  refreshToken: string;
  expiresTime: string;
}

interface AuthPermissionInfoRespVO {
  user: {
    id: number;
    username: string;
    nickname: string;
    deptId: number;
    postIds: number[];
    email: string;
    mobile: string;
    sex: number;
    avatar: string;
  };
  roles: Array<{
    id: number;
    name: string;
    code: string;
  }>;
  permissions: string[];
  menus: MenuVO[];
}

// ========== 用户管理 ==========

interface UserSaveReqVO {
  id?: number;
  username: string;
  password?: string;
  nickname?: string;
  deptId?: number;
  postIds?: number[];
  roleIds?: number[];
  email?: string;
  mobile?: string;
  sex?: number;
  avatar?: string;
  remark?: string;
}

interface UserRespVO {
  id: number;
  username: string;
  nickname: string;
  remark: string;
  deptId: number;
  deptName: string;
  postIds: number[];
  roleIds: number[];
  posts: PostSimpleRespVO[];
  roles: RoleSimpleRespVO[];
  email: string;
  mobile: string;
  sex: number;
  avatar: string;
  status: number;
  loginIp: string;
  loginDate: string;
  createTime: string;
}

interface UserSimpleRespVO {
  id: number;
  username: string;
  nickname: string;
  deptId: number;
  deptName: string;
  postIds: number[];
  postNames: string[];
  status: number;
}

interface UserPageReqVO {
  username?: string;
  mobile?: string;
  status?: number;
  deptId?: number;
  roleId?: number;
  createTime?: string[];
  pageNo: number;
  pageSize: number;
}

interface PostSimpleRespVO {
  id: number;
  name: string;
  code: string;
}

interface RoleSimpleRespVO {
  id: number;
  name: string;
  code: string;
}

// ========== 产品模块 ==========

interface ProductVO {
  id: number;
  code: string;
  category: string;
  title: string;
  description: string;
  imageUrl: string;
  active: boolean;
}

interface ProductCategoryDO {
  id: number;
  code: string;
  nameZh: string;
  nameEn: string;
  namePt: string;
  nameEs: string;
  parentId: number;
  level: number;
  sortOrder: number;
  active: boolean;
  children?: ProductCategoryDO[];
}

// ========== 产品规格管理 ==========

interface ProductSpecDO {
  id: number;
  productId: number;
  specKey: string;
  specValue: string;
  specUnit: string;
  specType: string;
  required: boolean;
  sortOrder: number;
  createTime: string;
  updateTime: string;
}

// ========== 产品下载资源管理 ==========

interface ProductDownloadDO {
  id: number;
  productId: number;
  title: string;
  fileType: string;
  resourceType: string;
  fileSize: number;
  filePath: string;
  downloadUrl: string;
  language: string;
  downloadCount: number;
  active: boolean;
  sortOrder: number;
  createTime: string;
  updateTime: string;
}

// ========== 证书管理 ==========

interface CertificateVO {
  id: number;
  code: string;
  nameZh: string;
  nameEn: string;
  namePt: string;
  nameEs: string;
  issuingAuthority: string;
  certificateNumber: string;
  issueDate: string;
  expiryDate: string;
  categoryId: number;
  imageUrl: string;
  hasFile: boolean;
  fileId: string;           // 证书文件 ID（用于下载）
  sortOrder: number;
  active: boolean;
  descriptionZh: string;    // 证书描述（中文）
  descriptionEn: string;    // 证书描述（英文）
  descriptionPt: string;    // 证书描述（葡萄牙语）
  descriptionEs: string;    // 证书描述（西班牙语）
  
  createTime: string;
  updateTime: string;
}

// ========== 新闻管理 ==========

interface NewsVO {
  id: number;
  code: string;
  titleZh: string;
  titleEn: string;
  titlePt: string;
  titleEs: string;
  summaryZh: string;
  summaryEn: string;
  summaryPt: string;
  summaryEs: string;
  source: string;
  author: string;
  publishDate: string;
  categoryId: number;
  categoryName: string;
  thumbnailUrl: string;
  featured: boolean;
  pinned: boolean;
  viewCount: number;
  externalUrl: string;
  sortOrder: number;
  active: boolean;
  createTime: string;
  updateTime: string;
}

interface NewsDetailVO extends NewsVO {
  contentZh: string;
  contentEn: string;
  contentPt: string;
  contentEs: string;
  category: NewsCategoryVO;
}

interface NewsCategoryVO {
  id: number;
  code: string;
  nameZh: string;
  nameEn: string;
  namePt: string;
  nameEs: string;
  descriptionZh: string;
  descriptionEn: string;
  descriptionPt: string;
  descriptionEs: string;
  sortOrder: number;
  active: boolean;
  iconUrl: string;
  createTime: string;
  updateTime: string;
}

// ========== 证书类别管理 ==========

interface CertificateCategoryVO {
  id: number;
  code: string;
  nameZh: string;
  nameEn: string;
  namePt: string;
  nameEs: string;
  descriptionZh: string;
  descriptionEn: string;
  descriptionPt: string;
  descriptionEs: string;
  sortOrder: number;
  active: boolean;
  iconUrl: string;
  createTime: string;
  updateTime: string;
}

// ========== 部门管理 ==========

interface DeptSaveReqVO {
  id?: number;
  parentId?: number;
  name: string;
  code?: string;
  sort?: number;
  leaderUserId?: number;
  phone?: string;
  email?: string;
  status?: number;
}

interface DeptRespVO {
  id: number;
  name: string;
  code: string;
  parentId: number;
  sort: number;
  leaderUserId: number;
  leaderUserName: string;
  phone: string;
  email: string;
  status: number;
  createTime: string;
  children?: DeptRespVO[];
}

interface DeptSimpleRespVO {
  id: number;
  name: string;
  parentId: number;
}

// ========== 角色管理 ==========

interface RoleSaveReqVO {
  id?: number;
  name: string;
  code: string;
  sort?: number;
  dataScope?: number;
  dataScopeDeptIds?: number[];
  status?: number;
  remark?: string;
}

interface RoleRespVO {
  id: number;
  name: string;
  code: string;
  sort: number;
  dataScope: number;
  dataScopeDeptIds: number[];
  status: number;
  type: number;
  remark: string;
  createTime: string;
}

interface RolePageReqVO {
  name?: string;
  code?: string;
  status?: number;
  createTime?: string[];
  pageNo: number;
  pageSize: number;
}

// ========== 菜单管理 ==========

interface MenuSaveVO {
  id?: number;
  parentId?: number;
  name: string;
  permission?: string;
  type: number;
  sort?: number;
  icon?: string;
  component?: string;
  componentName?: string;
  path?: string;
  visible?: boolean;
  status?: number;
}

interface MenuRespVO {
  id: number;
  name: string;
  permission: string;
  type: number;
  sort: number;
  parentId: number;
  icon: string;
  component: string;
  componentName: string;
  path: string;
  visible: boolean;
  status: number;
  createTime: string;
  children?: MenuRespVO[];
}

interface MenuSimpleRespVO {
  id: number;
  name: string;
  permission: string;
  type: number;
  parentId: number;
}

interface MenuListReqVO {
  name?: string;
  status?: number;
}

// ========== 字典管理 ==========

interface DictDataSaveReqVO {
  id?: number;
  dictTypeId: number;
  label: string;
  value: string;
  sort?: number;
  colorType?: string;
  cssClass?: string;
  remark?: string;
  status?: number;
}

interface DictDataRespVO {
  id: number;
  dictTypeId: number;
  label: string;
  value: string;
  sort: number;
  colorType: string;
  cssClass: string;
  remark: string;
  status: number;
  createTime: string;
}

interface DictDataSimpleRespVO {
  id: number;
  label: string;
  value: string;
  colorType: string;
  cssClass: string;
}

interface DictDataPageReqVO {
  dictTypeId?: number;
  label?: string;
  status?: number;
  pageNo: number;
  pageSize: number;
}

// ========== 文件管理 ==========

interface FileUploadReqVO {
  file: File;
  directory?: string;
}

interface FileRespVO {
  id: number;
  name: string;
  url: string;
  size: number;
  createTime: string;
}

interface FileCreateReqVO {
  name: string;
  path: string;
  size: number;
  configId?: number;
}

interface FilePresignedUrlRespVO {
  uploadUrl: string;
  url: string;
  key: string;
}

interface FilePresignedRespVO extends FileRespVO {
  presignedUrl: string;
}

interface FilePageReqVO {
  name?: string;
  path?: string;
  pageNo: number;
  pageSize: number;
}

// ========== 国际化 ==========

interface LocaleSwitchRequest {
  locale: string;
}

interface LocaleSwitchResponse {
  locale: string;
  message: string;
}
```

---

## 变更记录

| 版本 | 日期 | 说明 |
|------|------|------|
| 1.0.0 | 2026-02-26 | 初始版本，基于静态代码分析生成 |
