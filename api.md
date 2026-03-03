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
- [管理后台 - 证书管理](#管理后台---证书管理)
- [管理后台 - 证书类别管理](#管理后台---证书类别管理)
- [新闻管理](#新闻管理)
- [新闻类别管理](#新闻类别管理)
- [业务解决方案](#业务解决方案)
- [案例研究](#案例研究)
- [部门管理](#部门管理)
- [角色管理](#角色管理)
- [菜单管理](#菜单管理)
- [字典管理](#字典管理)
- [文件管理](#文件管理)
- [国际化](#国际化)
- [公司信息](#公司信息)
- [研发中心](#研发中心)
- [生产基地](#生产基地)
- [质量体系](#质量体系)

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

## 岗位管理

### 创建岗位

**Endpoint**: `POST /admin-api/system/post/create`

**认证要求**: JWT (`system:post:create`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Body | code | string | 是 | 岗位编码 |
| Body | name | string | 是 | 岗位名称 |
| Body | sort | number | 否 | 显示顺序 |
| Body | status | number | 否 | 状态（0-正常 1-停用） |
| Body | remark | string | 否 | 备注 |

#### 响应数据

```typescript
number  // 新创建的岗位 ID
```

---

### 修改岗位

**Endpoint**: `PUT /admin-api/system/post/update`

**认证要求**: JWT (`system:post:update`)

#### 请求参数

同【创建岗位】

#### 响应数据

```typescript
boolean  // true 表示更新成功
```

---

### 删除岗位

**Endpoint**: `DELETE /admin-api/system/post/delete`

**认证要求**: JWT (`system:post:delete`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | id | number | 是 | 岗位编号 |

#### 响应数据

```typescript
boolean  // true 表示删除成功
```

---

### 获取岗位详情

**Endpoint**: `GET /admin-api/system/post/get`

**认证要求**: JWT (`system:post:query`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | id | number | 是 | 岗位编号 |

#### 响应数据

```typescript
interface PostRespVO {
  id: number;
  code: string;
  name: string;
  sort: number;
  status: number;
  remark: string;
  createTime: string;
}
```

---

### 获取岗位精简列表

**Endpoint**: `GET /admin-api/system/post/list-all-simple`

**认证要求**: Public

#### 响应数据

```typescript
interface PostSimpleRespVO {
  id: number;
  name: string;
  code: string;
}
```

---

### 获取岗位分页列表

**Endpoint**: `GET /admin-api/system/post/page`

**认证要求**: JWT (`system:post:query`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | code | string | 否 | 岗位编码（模糊匹配） |
| Query | name | string | 否 | 岗位名称（模糊匹配） |
| Query | status | number | 否 | 状态 |
| Query | pageNo | number | 是 | 页码 |
| Query | pageSize | number | 是 | 每页数量 |

#### 响应数据

```typescript
interface PageResult<PostRespVO> {
  total: number;
  list: PostRespVO[];
}
```

---

## 字典类型管理

### 创建字典类型

**Endpoint**: `POST /admin-api/system/dict-type/create`

**认证要求**: JWT (`system:dict:create`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Body | type | string | 是 | 字典类型 |
| Body | name | string | 是 | 字典名称 |
| Body | sort | number | 否 | 排序 |
| Body | status | number | 否 | 状态 |
| Body | remark | string | 否 | 备注 |

#### 响应数据

```typescript
number  // 新创建的字典类型 ID
```

---

### 修改字典类型

**Endpoint**: `PUT /admin-api/system/dict-type/update`

**认证要求**: JWT (`system:dict:update`)

#### 请求参数

同【创建字典类型】

#### 响应数据

```typescript
boolean  // true 表示更新成功
```

---

### 删除字典类型

**Endpoint**: `DELETE /admin-api/system/dict-type/delete`

**认证要求**: JWT (`system:dict:delete`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | id | number | 是 | 字典类型编号 |

#### 响应数据

```typescript
boolean  // true 表示删除成功
```

---

### 批量删除字典类型

**Endpoint**: `DELETE /admin-api/system/dict-type/delete-list`

**认证要求**: JWT (`system:dict:delete`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | ids | number[] | 是 | 字典类型编号列表 |

#### 响应数据

```typescript
boolean  // true 表示删除成功
```

---

### 获取字典类型详情

**Endpoint**: `GET /admin-api/system/dict-type/get`

**认证要求**: JWT (`system:dict:query`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | id | number | 是 | 字典类型编号 |

#### 响应数据

```typescript
interface DictTypeRespVO {
  id: number;
  type: string;
  name: string;
  sort: number;
  status: number;
  remark: string;
  createTime: string;
}
```

---

### 获取字典类型分页列表

**Endpoint**: `GET /admin-api/system/dict-type/page`

**认证要求**: JWT (`system:dict:query`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | name | string | 否 | 字典名称（模糊匹配） |
| Query | type | string | 否 | 字典类型 |
| Query | status | number | 否 | 状态 |
| Query | pageNo | number | 是 | 页码 |
| Query | pageSize | number | 是 | 每页数量 |

#### 响应数据

```typescript
interface PageResult<DictTypeRespVO> {
  total: number;
  list: DictTypeRespVO[];
}
```

---

### 获取字典类型精简列表

**Endpoint**: `GET /admin-api/system/dict-type/list-all-simple`

**认证要求**: Public

#### 响应数据

```typescript
interface DictTypeSimpleRespVO {
  id: number;
  name: string;
  type: string;
}
```

---

## 邮件账号管理

### 创建邮件账号

**Endpoint**: `POST /admin-api/system/mail-account/create`

**认证要求**: JWT (`system:mail-account:create`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Body | mail | string | 是 | SMTP 邮件 |
| Body | username | string | 是 | 用户名 |
| Body | password | string | 是 | 密码 |
| Body | host | string | 是 | SMTP 服务器地址 |
| Body | port | number | 是 | SMTP 服务器端口 |
| Body | sslEnable | boolean | 否 | 是否开启 SSL |
| Body | starttlsEnable | boolean | 否 | 是否开启 STARTTLS |

#### 响应数据

```typescript
number  // 新创建的邮件账号 ID
```

---

### 修改邮件账号

**Endpoint**: `PUT /admin-api/system/mail-account/update`

**认证要求**: JWT (`system:mail-account:update`)

#### 请求参数

同【创建邮件账号】

#### 响应数据

```typescript
boolean  // true 表示更新成功
```

---

### 删除邮件账号

**Endpoint**: `DELETE /admin-api/system/mail-account/delete`

**认证要求**: JWT (`system:mail-account:delete`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | id | number | 是 | 邮件账号编号 |

#### 响应数据

```typescript
boolean  // true 表示删除成功
```

---

### 批量删除邮件账号

**Endpoint**: `DELETE /admin-api/system/mail-account/delete-list`

**认证要求**: JWT (`system:mail-account:delete`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | ids | number[] | 是 | 邮件账号编号列表 |

#### 响应数据

```typescript
boolean  // true 表示删除成功
```

---

### 获取邮件账号详情

**Endpoint**: `GET /admin-api/system/mail-account/get`

**认证要求**: JWT (`system:mail-account:query`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | id | number | 是 | 邮件账号编号 |

#### 响应数据

```typescript
interface MailAccountRespVO {
  id: number;
  mail: string;
  username: string;
  host: string;
  port: number;
  sslEnable: boolean;
  starttlsEnable: boolean;
  createTime: string;
}
```

---

### 获取邮件账号分页

**Endpoint**: `GET /admin-api/system/mail-account/page`

**认证要求**: JWT (`system:mail-account:query`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | mail | string | 否 | 邮箱（模糊匹配） |
| Query | username | string | 否 | 用户名（模糊匹配） |
| Query | pageNo | number | 是 | 页码 |
| Query | pageSize | number | 是 | 每页数量 |

#### 响应数据

```typescript
interface PageResult<MailAccountRespVO> {
  total: number;
  list: MailAccountRespVO[];
}
```

---

### 获取邮件账号精简列表

**Endpoint**: `GET /admin-api/system/mail-account/list-all-simple`

**认证要求**: Public

#### 响应数据

```typescript
interface MailAccountSimpleRespVO {
  id: number;
  mail: string;
  username: string;
}
```

---

## 邮件日志管理

### 获取邮件日志分页

**Endpoint**: `GET /admin-api/system/mail-log/page`

**认证要求**: JWT (`system:mail-log:query`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | status | number | 否 | 发送状态 |
| Query | toMail | string | 否 | 收件邮箱（模糊匹配） |
| Query | templateCode | string | 否 | 模板编码 |
| Query | pageNo | number | 是 | 页码 |
| Query | pageSize | number | 是 | 每页数量 |

#### 响应数据

```typescript
interface PageResult<MailLogRespVO> {
  total: number;
  list: MailLogRespVO[];
}

interface MailLogRespVO {
  id: number;
  toMail: string;
  templateCode: string;
  templateParams: string;
  status: number;
  sendTime: string;
  createTime: string;
}
```

---

### 获取邮件日志详情

**Endpoint**: `GET /admin-api/system/mail-log/get`

**认证要求**: JWT (`system:mail-log:query`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | id | number | 是 | 邮件日志编号 |

#### 响应数据

`MailLogRespVO`

---

## 邮件模板管理

### 创建邮件模板

**Endpoint**: `POST /admin-api/system/mail-template/create`

**认证要求**: JWT (`system:mail-template:create`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Body | name | string | 是 | 模板名称 |
| Body | code | string | 是 | 模板编码 |
| Body | accountId | number | 是 | 发送的邮箱账号编号 |
| Body | title | string | 是 | 邮件标题 |
| Body | content | string | 是 | 邮件内容 |
| Body | params | string | 否 | 参数数组 |
| Body | status | number | 否 | 状态 |
| Body | remark | string | 否 | 备注 |

#### 响应数据

```typescript
number  // 新创建的邮件模板 ID
```

---

### 修改邮件模板

**Endpoint**: `PUT /admin-api/system/mail-template/update`

**认证要求**: JWT (`system:mail-template:update`)

#### 请求参数

同【创建邮件模板】

#### 响应数据

```typescript
boolean  // true 表示更新成功
```

---

### 删除邮件模板

**Endpoint**: `DELETE /admin-api/system/mail-template/delete`

**认证要求**: JWT (`system:mail-template:delete`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | id | number | 是 | 邮件模板编号 |

#### 响应数据

```typescript
boolean  // true 表示删除成功
```

---

### 批量删除邮件模板

**Endpoint**: `DELETE /admin-api/system/mail-template/delete-list`

**认证要求**: JWT (`system:mail-template:delete`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | ids | number[] | 是 | 邮件模板编号列表 |

#### 响应数据

```typescript
boolean  // true 表示删除成功
```

---

### 获取邮件模板详情

**Endpoint**: `GET /admin-api/system/mail-template/get`

**认证要求**: JWT (`system:mail-template:query`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | id | number | 是 | 邮件模板编号 |

#### 响应数据

```typescript
interface MailTemplateRespVO {
  id: number;
  name: string;
  code: string;
  accountId: number;
  title: string;
  content: string;
  params: string;
  status: number;
  remark: string;
  createTime: string;
}
```

---

### 获取邮件模板分页

**Endpoint**: `GET /admin-api/system/mail-template/page`

**认证要求**: JWT (`system:mail-template:query`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | name | string | 否 | 模板名称（模糊匹配） |
| Query | code | string | 否 | 模板编码 |
| Query | accountId | number | 否 | 邮箱账号编号 |
| Query | status | number | 否 | 状态 |
| Query | pageNo | number | 是 | 页码 |
| Query | pageSize | number | 是 | 每页数量 |

#### 响应数据

```typescript
interface PageResult<MailTemplateRespVO> {
  total: number;
  list: MailTemplateRespVO[];
}
```

---

### 获取邮件模板精简列表

**Endpoint**: `GET /admin-api/system/mail-template/list-all-simple`

**认证要求**: Public

#### 响应数据

```typescript
interface MailTemplateSimpleRespVO {
  id: number;
  name: string;
  code: string;
}
```

---

### 发送邮件

**Endpoint**: `POST /admin-api/system/mail-template/send-mail`

**认证要求**: JWT (`system:mail-template:send-mail`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Body | toMails | string[] | 是 | 收件邮箱列表 |
| Body | ccMails | string[] | 否 | 抄送邮箱列表 |
| Body | bccMails | string[] | 否 | 密送邮箱列表 |
| Body | templateCode | string | 是 | 模板编码 |
| Body | templateParams | object | 是 | 模板参数 |

#### 响应数据

```typescript
number  // 邮件日志编号
```

---

## 通知消息管理

### 获取通知消息详情

**Endpoint**: `GET /admin-api/system/notify-message/get`

**认证要求**: JWT (`system:notify-message:query`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | id | number | 是 | 通知消息编号 |

#### 响应数据

```typescript
interface NotifyMessageRespVO {
  id: number;
  userId: number;
  userType: number;
  templateId: number;
  templateCode: string;
  templateNickname: string;
  templateContent: string;
  templateParams: string;
  readStatus: boolean;
  readTime: string;
  createTime: string;
}
```

---

### 获取通知消息分页

**Endpoint**: `GET /admin-api/system/notify-message/page`

**认证要求**: JWT (`system:notify-message:query`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | userId | number | 否 | 用户编号 |
| Query | userType | number | 否 | 用户类型 |
| Query | templateCode | string | 否 | 模板编码 |
| Query | readStatus | boolean | 否 | 是否已读 |
| Query | pageNo | number | 是 | 页码 |
| Query | pageSize | number | 是 | 每页数量 |

#### 响应数据

```typescript
interface PageResult<NotifyMessageRespVO> {
  total: number;
  list: NotifyMessageRespVO[];
}
```

---

### 获取我的通知消息分页

**Endpoint**: `GET /admin-api/system/notify-message/my-page`

**认证要求**: JWT

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | readStatus | boolean | 否 | 是否已读 |
| Query | pageNo | number | 是 | 页码 |
| Query | pageSize | number | 是 | 每页数量 |

#### 响应数据

```typescript
interface PageResult<NotifyMessageRespVO> {
  total: number;
  list: NotifyMessageRespVO[];
}
```

---

### 标记通知消息为已读

**Endpoint**: `PUT /admin-api/system/notify-message/update-read`

**认证要求**: JWT

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | ids | number[] | 是 | 通知消息编号列表 |

#### 响应数据

```typescript
boolean  // true 表示标记成功
```

---

### 标记所有通知消息为已读

**Endpoint**: `PUT /admin-api/system/notify-message/update-all-read`

**认证要求**: JWT

#### 响应数据

```typescript
boolean  // true 表示标记成功
```

---

### 获取未读通知消息列表

**Endpoint**: `GET /admin-api/system/notify-message/get-unread-list`

**认证要求**: JWT

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | size | number | 否 | 数量，默认 10 |

#### 响应数据

`NotifyMessageRespVO[]`

---

### 获取未读通知消息数量

**Endpoint**: `GET /admin-api/system/notify-message/get-unread-count`

**认证要求**: JWT

#### 响应数据

```typescript
number  // 未读消息数量
```

---

## 通知模板管理

### 创建通知模板

**Endpoint**: `POST /admin-api/system/notify-template/create`

**认证要求**: JWT (`system:notify-template:create`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Body | name | string | 是 | 模板名称 |
| Body | code | string | 是 | 模板编码 |
| Body | nickname | string | 是 | 发送人名称 |
| Body | content | string | 是 | 模板内容 |
| Body | params | string | 否 | 参数数组 |
| Body | status | number | 否 | 状态 |
| Body | remark | string | 否 | 备注 |

#### 响应数据

```typescript
number  // 新创建的通知模板 ID
```

---

### 更新通知模板

**Endpoint**: `PUT /admin-api/system/notify-template/update`

**认证要求**: JWT (`system:notify-template:update`)

#### 请求参数

同【创建通知模板】

#### 响应数据

```typescript
boolean  // true 表示更新成功
```

---

### 删除通知模板

**Endpoint**: `DELETE /admin-api/system/notify-template/delete`

**认证要求**: JWT (`system:notify-template:delete`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | id | number | 是 | 通知模板编号 |

#### 响应数据

```typescript
boolean  // true 表示删除成功
```

---

### 批量删除通知模板

**Endpoint**: `DELETE /admin-api/system/notify-template/delete-list`

**认证要求**: JWT (`system:notify-template:delete`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | ids | number[] | 是 | 通知模板编号列表 |

#### 响应数据

```typescript
boolean  // true 表示删除成功
```

---

### 获取通知模板详情

**Endpoint**: `GET /admin-api/system/notify-template/get`

**认证要求**: JWT (`system:notify-template:query`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | id | number | 是 | 通知模板编号 |

#### 响应数据

```typescript
interface NotifyTemplateRespVO {
  id: number;
  name: string;
  code: string;
  nickname: string;
  content: string;
  params: string;
  status: number;
  remark: string;
  createTime: string;
}
```

---

### 获取通知模板分页

**Endpoint**: `GET /admin-api/system/notify-template/page`

**认证要求**: JWT (`system:notify-template:query`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | name | string | 否 | 模板名称（模糊匹配） |
| Query | code | string | 否 | 模板编码 |
| Query | status | number | 否 | 状态 |
| Query | pageNo | number | 是 | 页码 |
| Query | pageSize | number | 是 | 每页数量 |

#### 响应数据

```typescript
interface PageResult<NotifyTemplateRespVO> {
  total: number;
  list: NotifyTemplateRespVO[];
}
```

---

### 发送站内信

**Endpoint**: `POST /admin-api/system/notify-template/send-notify`

**认证要求**: JWT (`system:notify-template:send-notify`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Body | userId | number | 是 | 用户编号 |
| Body | userType | number | 是 | 用户类型 |
| Body | templateCode | string | 是 | 模板编码 |
| Body | templateParams | object | 是 | 模板参数 |

#### 响应数据

```typescript
number  // 通知消息编号
```

---

## OAuth2 令牌管理

### 获取访问令牌分页

**Endpoint**: `GET /admin-api/system/oauth2-token/page`

**认证要求**: JWT (`system:oauth2-token:page`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | userId | number | 否 | 用户编号 |
| Query | userType | number | 否 | 用户类型 |
| Query | clientId | string | 否 | 客户端编号 |
| Query | pageNo | number | 是 | 页码 |
| Query | pageSize | number | 是 | 每页数量 |

#### 响应数据

```typescript
interface PageResult<OAuth2AccessTokenRespVO> {
  total: number;
  list: OAuth2AccessTokenRespVO[];
}

interface OAuth2AccessTokenRespVO {
  id: number;
  userId: number;
  userType: number;
  accessToken: string;
  refreshToken: string;
  clientId: string;
  expiresTime: string;
  createTime: string;
}
```

---

### 删除访问令牌

**Endpoint**: `DELETE /admin-api/system/oauth2-token/delete`

**认证要求**: JWT (`system:oauth2-token:delete`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | accessToken | string | 是 | 访问令牌 |

#### 响应数据

```typescript
boolean  // true 表示删除成功
```

---

### 批量删除访问令牌

**Endpoint**: `DELETE /admin-api/system/oauth2-token/delete-list`

**认证要求**: JWT (`system:oauth2-token:delete`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | accessTokens | string[] | 是 | 访问令牌数组 |

#### 响应数据

```typescript
boolean  // true 表示删除成功
```

---

## OAuth2 用户管理

### 获取用户基本信息

**Endpoint**: `GET /admin-api/system/oauth2/user/get`

**认证要求**: OAuth2 (`scope=user.read`)

#### 响应数据

```typescript
interface OAuth2UserInfoRespVO {
  id: number;
  username: string;
  nickname: string;
  email: string;
  mobile: string;
  avatar: string;
  dept: {
    id: number;
    name: string;
  };
  posts: Array<{
    id: number;
    name: string;
  }>;
}
```

---

### 更新用户基本信息

**Endpoint**: `PUT /admin-api/system/oauth2/user/update`

**认证要求**: OAuth2 (`scope=user.write`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Body | nickname | string | 否 | 用户昵称 |
| Body | email | string | 否 | 邮箱 |
| Body | mobile | string | 否 | 手机号 |
| Body | sex | number | 否 | 性别 |
| Body | avatar | string | 否 | 头像 URL |

#### 响应数据

```typescript
boolean  // true 表示更新成功
```

---

## 短信渠道管理

### 创建短信渠道

**Endpoint**: `POST /admin-api/system/sms-channel/create`

**认证要求**: JWT (`system:sms-channel:create`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Body | signature | string | 是 | 短信签名 |
| Body | code | string | 是 | 渠道编码 |
| Body | status | number | 否 | 开启状态 |
| Body | remark | string | 否 | 备注 |
| Body | apiKey | string | 否 | API Key |
| Body | apiSecret | string | 否 | API Secret |
| Body | callbackUrl | string | 否 | 回调 URL |

#### 响应数据

```typescript
number  // 新创建的短信渠道 ID
```

---

### 更新短信渠道

**Endpoint**: `PUT /admin-api/system/sms-channel/update`

**认证要求**: JWT (`system:sms-channel:update`)

#### 请求参数

同【创建短信渠道】

#### 响应数据

```typescript
boolean  // true 表示更新成功
```

---

### 删除短信渠道

**Endpoint**: `DELETE /admin-api/system/sms-channel/delete`

**认证要求**: JWT (`system:sms-channel:delete`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | id | number | 是 | 短信渠道编号 |

#### 响应数据

```typescript
boolean  // true 表示删除成功
```

---

### 批量删除短信渠道

**Endpoint**: `DELETE /admin-api/system/sms-channel/delete-list`

**认证要求**: JWT (`system:sms-channel:delete`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | ids | number[] | 是 | 短信渠道编号列表 |

#### 响应数据

```typescript
boolean  // true 表示删除成功
```

---

### 获取短信渠道详情

**Endpoint**: `GET /admin-api/system/sms-channel/get`

**认证要求**: JWT (`system:sms-channel:query`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | id | number | 是 | 短信渠道编号 |

#### 响应数据

```typescript
interface SmsChannelRespVO {
  id: number;
  signature: string;
  code: string;
  status: number;
  remark: string;
  apiKey: string;
  apiSecret: string;
  callbackUrl: string;
  createTime: string;
}
```

---

### 获取短信渠道分页

**Endpoint**: `GET /admin-api/system/sms-channel/page`

**认证要求**: JWT (`system:sms-channel:query`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | signature | string | 否 | 短信签名（模糊匹配） |
| Query | code | string | 否 | 渠道编码 |
| Query | status | number | 否 | 开启状态 |
| Query | pageNo | number | 是 | 页码 |
| Query | pageSize | number | 是 | 每页数量 |

#### 响应数据

```typescript
interface PageResult<SmsChannelRespVO> {
  total: number;
  list: SmsChannelRespVO[];
}
```

---

### 获取短信渠道精简列表

**Endpoint**: `GET /admin-api/system/sms-channel/list-all-simple`

**认证要求**: Public

#### 响应数据

```typescript
interface SmsChannelSimpleRespVO {
  id: number;
  signature: string;
  code: string;
}
```

---

## 短信日志管理

### 获取短信日志分页

**Endpoint**: `GET /admin-api/system/sms-log/page`

**认证要求**: JWT (`system:sms-log:query`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | mobile | string | 否 | 手机号（模糊匹配） |
| Query | status | number | 否 | 发送状态 |
| Query | templateCode | string | 否 | 模板编码 |
| Query | pageNo | number | 是 | 页码 |
| Query | pageSize | number | 是 | 每页数量 |

#### 响应数据

```typescript
interface PageResult<SmsLogRespVO> {
  total: number;
  list: SmsLogRespVO[];
}

interface SmsLogRespVO {
  id: number;
  mobile: string;
  templateCode: string;
  templateParams: string;
  status: number;
  sendTime: string;
  createTime: string;
}
```

---

## 短信模板管理

### 创建短信模板

**Endpoint**: `POST /admin-api/system/sms-template/create`

**认证要求**: JWT (`system:sms-template:create`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Body | name | string | 是 | 模板名称 |
| Body | code | string | 是 | 模板编码 |
| Body | content | string | 是 | 模板内容 |
| Body | params | string | 否 | 参数数组 |
| Body | status | number | 否 | 状态 |
| Body | remark | string | 否 | 备注 |

#### 响应数据

```typescript
number  // 新创建的短信模板 ID
```

---

### 更新短信模板

**Endpoint**: `PUT /admin-api/system/sms-template/update`

**认证要求**: JWT (`system:sms-template:update`)

#### 请求参数

同【创建短信模板】

#### 响应数据

```typescript
boolean  // true 表示更新成功
```

---

### 删除短信模板

**Endpoint**: `DELETE /admin-api/system/sms-template/delete`

**认证要求**: JWT (`system:sms-template:delete`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | id | number | 是 | 短信模板编号 |

#### 响应数据

```typescript
boolean  // true 表示删除成功
```

---

### 批量删除短信模板

**Endpoint**: `DELETE /admin-api/system/sms-template/delete-list`

**认证要求**: JWT (`system:sms-template:delete`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | ids | number[] | 是 | 短信模板编号列表 |

#### 响应数据

```typescript
boolean  // true 表示删除成功
```

---

### 获取短信模板详情

**Endpoint**: `GET /admin-api/system/sms-template/get`

**认证要求**: JWT (`system:sms-template:query`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | id | number | 是 | 短信模板编号 |

#### 响应数据

```typescript
interface SmsTemplateRespVO {
  id: number;
  name: string;
  code: string;
  content: string;
  params: string;
  status: number;
  remark: string;
  createTime: string;
}
```

---

### 获取短信模板分页

**Endpoint**: `GET /admin-api/system/sms-template/page`

**认证要求**: JWT (`system:sms-template:query`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | name | string | 否 | 模板名称（模糊匹配） |
| Query | code | string | 否 | 模板编码 |
| Query | status | number | 否 | 状态 |
| Query | pageNo | number | 是 | 页码 |
| Query | pageSize | number | 是 | 每页数量 |

#### 响应数据

```typescript
interface PageResult<SmsTemplateRespVO> {
  total: number;
  list: SmsTemplateRespVO[];
}
```

---

### 发送短信

**Endpoint**: `POST /admin-api/system/sms-template/send-sms`

**认证要求**: JWT (`system:sms-template:send-sms`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Body | mobile | string | 是 | 手机号 |
| Body | templateCode | string | 是 | 模板编码 |
| Body | templateParams | object | 是 | 模板参数 |

#### 响应数据

```typescript
number  // 短信日志编号
```

---

## 租户套餐管理

### 创建租户套餐

**Endpoint**: `POST /admin-api/system/tenant-package/create`

**认证要求**: JWT (`system:tenant-package:create`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Body | name | string | 是 | 套餐名 |
| Body | status | number | 否 | 开启状态 |
| Body | remark | string | 否 | 备注 |
| Body | menuIds | number[] | 否 | 关联的菜单编号 |

#### 响应数据

```typescript
number  // 新创建的租户套餐 ID
```

---

### 更新租户套餐

**Endpoint**: `PUT /admin-api/system/tenant-package/update`

**认证要求**: JWT (`system:tenant-package:update`)

#### 请求参数

同【创建租户套餐】

#### 响应数据

```typescript
boolean  // true 表示更新成功
```

---

### 删除租户套餐

**Endpoint**: `DELETE /admin-api/system/tenant-package/delete`

**认证要求**: JWT (`system:tenant-package:delete`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | id | number | 是 | 租户套餐编号 |

#### 响应数据

```typescript
boolean  // true 表示删除成功
```

---

### 批量删除租户套餐

**Endpoint**: `DELETE /admin-api/system/tenant-package/delete-list`

**认证要求**: JWT (`system:tenant-package:delete`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | ids | number[] | 是 | 租户套餐编号列表 |

#### 响应数据

```typescript
boolean  // true 表示删除成功
```

---

### 获取租户套餐详情

**Endpoint**: `GET /admin-api/system/tenant-package/get`

**认证要求**: JWT (`system:tenant-package:query`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | id | number | 是 | 租户套餐编号 |

#### 响应数据

```typescript
interface TenantPackageRespVO {
  id: number;
  name: string;
  status: number;
  remark: string;
  menuIds: number[];
  createTime: string;
}
```

---

### 获取租户套餐分页

**Endpoint**: `GET /admin-api/system/tenant-package/page`

**认证要求**: JWT (`system:tenant-package:query`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | name | string | 否 | 套餐名（模糊匹配） |
| Query | status | number | 否 | 开启状态 |
| Query | pageNo | number | 是 | 页码 |
| Query | pageSize | number | 是 | 每页数量 |

#### 响应数据

```typescript
interface PageResult<TenantPackageRespVO> {
  total: number;
  list: TenantPackageRespVO[];
}
```

---

### 获取租户套餐精简列表

**Endpoint**: `GET /admin-api/system/tenant-package/get-simple-list`

**认证要求**: Public

#### 响应数据

```typescript
interface TenantPackageSimpleRespVO {
  id: number;
  name: string;
  status: number;
}
```

---

## 区域管理

### 获取地区树

**Endpoint**: `GET /admin-api/system/area/tree`

**认证要求**: Public

#### 响应数据

```typescript
interface AreaNodeRespVO {
  id: number;
  name: string;
  children?: AreaNodeRespVO[];
}
```

---

### 根据 IP 获取地区

**Endpoint**: `GET /admin-api/system/area/get-by-ip`

**认证要求**: Public

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | ip | string | 是 | IP 地址 |

#### 响应数据

```typescript
string  // 地区名称，如 "广东省 深圳市"
```

---

## 文件配置管理

### 创建文件配置

**Endpoint**: `POST /admin-api/infra/file-config/create`

**认证要求**: JWT (`infra:file-config:create`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Body | name | string | 是 | 配置名称 |
| Body | storage | number | 是 | 存储器类型 |
| Body | remark | string | 否 | 备注 |
| Body | master | boolean | 否 | 是否为主配置 |
| Body | config | object | 是 | 配置内容 |

#### 响应数据

```typescript
number  // 新创建的文件配置 ID
```

---

### 更新文件配置

**Endpoint**: `PUT /admin-api/infra/file-config/update`

**认证要求**: JWT (`infra:file-config:update`)

#### 请求参数

同【创建文件配置】

#### 响应数据

```typescript
boolean  // true 表示更新成功
```

---

### 更新文件配置为主配置

**Endpoint**: `PUT /admin-api/infra/file-config/update-master`

**认证要求**: JWT (`infra:file-config:update`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | id | number | 是 | 文件配置编号 |

#### 响应数据

```typescript
boolean  // true 表示更新成功
```

---

### 删除文件配置

**Endpoint**: `DELETE /admin-api/infra/file-config/delete`

**认证要求**: JWT (`infra:file-config:delete`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | id | number | 是 | 文件配置编号 |

#### 响应数据

```typescript
boolean  // true 表示删除成功
```

---

### 批量删除文件配置

**Endpoint**: `DELETE /admin-api/infra/file-config/delete-list`

**认证要求**: JWT (`infra:file-config:delete`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | ids | number[] | 是 | 文件配置编号列表 |

#### 响应数据

```typescript
boolean  // true 表示删除成功
```

---

### 获取文件配置详情

**Endpoint**: `GET /admin-api/infra/file-config/get`

**认证要求**: JWT (`infra:file-config:query`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | id | number | 是 | 文件配置编号 |

#### 响应数据

```typescript
interface FileConfigRespVO {
  id: number;
  name: string;
  storage: number;
  master: boolean;
  remark: string;
  config: object;
  createTime: string;
}
```

---

### 获取文件配置分页

**Endpoint**: `GET /admin-api/infra/file-config/page`

**认证要求**: JWT (`infra:file-config:query`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | name | string | 否 | 配置名称（模糊匹配） |
| Query | storage | number | 否 | 存储器类型 |
| Query | pageNo | number | 是 | 页码 |
| Query | pageSize | number | 是 | 每页数量 |

#### 响应数据

```typescript
interface PageResult<FileConfigRespVO> {
  total: number;
  list: FileConfigRespVO[];
}
```

---

### 测试文件配置

**Endpoint**: `GET /admin-api/infra/file-config/test`

**认证要求**: JWT (`infra:file-config:query`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | id | number | 是 | 文件配置编号 |

#### 响应数据

```typescript
string  // 测试文件 URL
```

---

## 系统配置管理

### 创建参数配置

**Endpoint**: `POST /admin-api/infra/config/create`

**认证要求**: JWT (`infra:config:create`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Body | category | string | 是 | 参数分组 |
| Body | name | string | 是 | 参数名称 |
| Body | key | string | 是 | 参数键名 |
| Body | value | string | 是 | 参数键值 |
| Body | visible | boolean | 否 | 是否可见 |
| Body | remark | string | 否 | 备注 |

#### 响应数据

```typescript
number  // 新创建的参数配置 ID
```

---

### 修改参数配置

**Endpoint**: `PUT /admin-api/infra/config/update`

**认证要求**: JWT (`infra:config:update`)

#### 请求参数

同【创建参数配置】

#### 响应数据

```typescript
boolean  // true 表示更新成功
```

---

### 删除参数配置

**Endpoint**: `DELETE /admin-api/infra/config/delete`

**认证要求**: JWT (`infra:config:delete`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | id | number | 是 | 参数配置编号 |

#### 响应数据

```typescript
boolean  // true 表示删除成功
```

---

### 批量删除参数配置

**Endpoint**: `DELETE /admin-api/infra/config/delete-list`

**认证要求**: JWT (`infra:config:delete`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | ids | number[] | 是 | 参数配置编号列表 |

#### 响应数据

```typescript
boolean  // true 表示删除成功
```

---

### 获取参数配置详情

**Endpoint**: `GET /admin-api/infra/config/get`

**认证要求**: JWT (`infra:config:query`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | id | number | 是 | 参数配置编号 |

#### 响应数据

```typescript
interface ConfigRespVO {
  id: number;
  category: string;
  name: string;
  key: string;
  value: string;
  visible: boolean;
  remark: string;
  createTime: string;
}
```

---

### 根据键名获取参数值

**Endpoint**: `GET /admin-api/infra/config/get-value-by-key`

**认证要求**: Public

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | key | string | 是 | 参数键名 |

#### 响应数据

```typescript
string  // 参数值
```

---

### 获取参数配置分页

**Endpoint**: `GET /admin-api/infra/config/page`

**认证要求**: JWT (`infra:config:query`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | name | string | 否 | 参数名称（模糊匹配） |
| Query | key | string | 否 | 参数键名 |
| Query | category | string | 否 | 参数分组 |
| Query | pageNo | number | 是 | 页码 |
| Query | pageSize | number | 是 | 每页数量 |

#### 响应数据

```typescript
interface PageResult<ConfigRespVO> {
  total: number;
  list: ConfigRespVO[];
}
```

---

## 数据源配置管理

### 创建数据源配置

**Endpoint**: `POST /admin-api/infra/data-source-config/create`

**认证要求**: JWT (`infra:data-source-config:create`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Body | name | string | 是 | 数据源名称 |
| Body | url | string | 是 | 数据源连接 URL |
| Body | username | string | 是 | 用户名 |
| Body | password | string | 是 | 密码 |

#### 响应数据

```typescript
number  // 新创建的数据源配置 ID
```

---

### 更新数据源配置

**Endpoint**: `PUT /admin-api/infra/data-source-config/update`

**认证要求**: JWT (`infra:data-source-config:update`)

#### 请求参数

同【创建数据源配置】

#### 响应数据

```typescript
boolean  // true 表示更新成功
```

---

### 删除数据源配置

**Endpoint**: `DELETE /admin-api/infra/data-source-config/delete`

**认证要求**: JWT (`infra:data-source-config:delete`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | id | number | 是 | 数据源配置编号 |

#### 响应数据

```typescript
boolean  // true 表示删除成功
```

---

### 批量删除数据源配置

**Endpoint**: `DELETE /admin-api/infra/data-source-config/delete-list`

**认证要求**: JWT (`infra:data-source-config:delete`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | ids | number[] | 是 | 数据源配置编号列表 |

#### 响应数据

```typescript
boolean  // true 表示删除成功
```

---

### 获取数据源配置详情

**Endpoint**: `GET /admin-api/infra/data-source-config/get`

**认证要求**: JWT (`infra:data-source-config:query`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | id | number | 是 | 数据源配置编号 |

#### 响应数据

```typescript
interface DataSourceConfigRespVO {
  id: number;
  name: string;
  url: string;
  username: string;
  createTime: string;
}
```

---

### 获取数据源配置列表

**Endpoint**: `GET /admin-api/infra/data-source-config/list`

**认证要求**: JWT (`infra:data-source-config:query`)

#### 响应数据

```typescript
interface DataSourceConfigRespVO {
  id: number;
  name: string;
  url: string;
  username: string;
  createTime: string;
}
```

---

## Redis 监控管理

### 获取 Redis 监控信息

**Endpoint**: `GET /admin-api/infra/redis/get-monitor-info`

**认证要求**: JWT (`infra:redis:get-monitor-info`)

#### 响应数据

```typescript
interface RedisMonitorRespVO {
  info: {
    version: string;
    usedMemory: string;
    maxMemory: string;
    // ... 更多 Redis 信息
  };
  dbSize: number;
  commandStats: Array<{
    name: string;
    calls: number;
    usec: number;
  }>;
}
```

---

## 代码生成管理

### 获取数据库表列表

**Endpoint**: `GET /admin-api/infra/codegen/db/table/list`

**认证要求**: JWT (`infra:codegen:query`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | dataSourceConfigId | number | 是 | 数据源配置编号 |
| Query | name | string | 否 | 表名（模糊匹配） |
| Query | comment | string | 否 | 表描述（模糊匹配） |

#### 响应数据

```typescript
interface DatabaseTableRespVO {
  name: string;
  comment: string;
  engine: string;
  createTime: string;
}
```

---

### 获取代码生成表列表

**Endpoint**: `GET /admin-api/infra/codegen/table/list`

**认证要求**: JWT (`infra:codegen:query`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | dataSourceConfigId | number | 是 | 数据源配置编号 |

#### 响应数据

```typescript
interface CodegenTableRespVO {
  id: number;
  name: string;
  comment: string;
  className: string;
  createTime: string;
}
```

---

### 获取代码生成表分页

**Endpoint**: `GET /admin-api/infra/codegen/table/page`

**认证要求**: JWT (`infra:codegen:query`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | dataSourceConfigId | number | 否 | 数据源配置编号 |
| Query | name | string | 否 | 表名（模糊匹配） |
| Query | comment | string | 否 | 表描述（模糊匹配） |
| Query | pageNo | number | 是 | 页码 |
| Query | pageSize | number | 是 | 每页数量 |

#### 响应数据

```typescript
interface PageResult<CodegenTableRespVO> {
  total: number;
  list: CodegenTableRespVO[];
}
```

---

### 获取代码生成详情

**Endpoint**: `GET /admin-api/infra/codegen/detail`

**认证要求**: JWT (`infra:codegen:query`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | tableId | number | 是 | 表编号 |

#### 响应数据

```typescript
interface CodegenDetailRespVO {
  table: CodegenTableRespVO;
  columns: Array<{
    id: number;
    name: string;
    type: string;
    comment: string;
    nullable: boolean;
    primaryKey: boolean;
  }>;
}
```

---

### 创建代码生成配置

**Endpoint**: `POST /admin-api/infra/codegen/create-list`

**认证要求**: JWT (`infra:codegen:create`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Body | dataSourceConfigId | number | 是 | 数据源配置编号 |
| Body | tableNames | string[] | 是 | 表名列表 |

#### 响应数据

```typescript
number[]  // 新创建的代码生成表编号列表
```

---

### 更新代码生成配置

**Endpoint**: `PUT /admin-api/infra/codegen/update`

**认证要求**: JWT (`infra:codegen:update`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Body | table | CodegenTableRespVO | 是 | 表配置 |
| Body | columns | object[] | 是 | 列配置 |

#### 响应数据

```typescript
boolean  // true 表示更新成功
```

---

### 同步数据库表结构

**Endpoint**: `PUT /admin-api/infra/codegen/sync-from-db`

**认证要求**: JWT (`infra:codegen:update`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | tableId | number | 是 | 表编号 |

#### 响应数据

```typescript
boolean  // true 表示同步成功
```

---

### 删除代码生成配置

**Endpoint**: `DELETE /admin-api/infra/codegen/delete`

**认证要求**: JWT (`infra:codegen:delete`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | tableId | number | 是 | 表编号 |

#### 响应数据

```typescript
boolean  // true 表示删除成功
```

---

### 批量删除代码生成配置

**Endpoint**: `DELETE /admin-api/infra/codegen/delete-list`

**认证要求**: JWT (`infra:codegen:delete`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | tableIds | number[] | 是 | 表编号列表 |

#### 响应数据

```typescript
boolean  // true 表示删除成功
```

---

### 预览生成代码

**Endpoint**: `GET /admin-api/infra/codegen/preview`

**认证要求**: JWT (`infra:codegen:preview`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | tableId | number | 是 | 表编号 |

#### 响应数据

```typescript
Array<{
  path: string;    // 文件路径
  content: string;  // 文件内容
}>
```

---

### 下载生成代码

**Endpoint**: `GET /admin-api/infra/codegen/download`

**认证要求**: JWT (`infra:codegen:download`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | tableId | number | 是 | 表编号 |

#### 响应数据

```typescript
file  // ZIP 压缩包
```

---

## 管理后台 - 新闻类别管理

### 创建新闻类别

**Endpoint**: `POST /admin-api/product/news-category/create`

**认证要求**: JWT (`product:news-category:create`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Body | nameZh | string | 是 | 类别名称（中文） |
| Body | nameEn | string | 是 | 类别名称（英文） |
| Body | namePt | string | 否 | 类别名称（葡萄牙语） |
| Body | nameEs | string | 否 | 类别名称（西班牙语） |
| Body | descriptionZh | string | 否 | 描述（中文） |
| Body | descriptionEn | string | 否 | 描述（英文） |
| Body | descriptionPt | string | 否 | 描述（葡萄牙语） |
| Body | descriptionEs | string | 否 | 描述（西班牙语） |
| Body | sort | number | 否 | 排序 |
| Body | active | boolean | 否 | 是否启用 |

#### 响应数据

```typescript
number  // 新创建的新闻类别 ID
```

---

### 修改新闻类别

**Endpoint**: `PUT /admin-api/product/news-category/update`

**认证要求**: JWT (`product:news-category:update`)

#### 请求参数

同【创建新闻类别】

#### 响应数据

```typescript
boolean  // true 表示更新成功
```

---

### 删除新闻类别

**Endpoint**: `DELETE /admin-api/product/news-category/delete`

**认证要求**: JWT (`product:news-category:delete`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | id | number | 是 | 新闻类别编号 |

#### 响应数据

```typescript
boolean  // true 表示删除成功
```

---

### 获取新闻类别详情

**Endpoint**: `GET /admin-api/product/news-category/get`

**认证要求**: JWT (`product:news-category:query`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | id | number | 是 | 新闻类别编号 |

#### 响应数据

```typescript
interface NewsCategoryRespVO {
  id: number;
  nameZh: string;
  nameEn: string;
  namePt: string;
  nameEs: string;
  descriptionZh: string;
  descriptionEn: string;
  descriptionPt: string;
  descriptionEs: string;
  sort: number;
  active: boolean;
  createTime: string;
}
```

---

### 获取新闻类别分页

**Endpoint**: `GET /admin-api/product/news-category/page`

**认证要求**: JWT (`product:news-category:query`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | name | string | 否 | 类别名称（模糊匹配） |
| Query | active | boolean | 否 | 是否启用 |
| Query | pageNo | number | 是 | 页码 |
| Query | pageSize | number | 是 | 每页数量 |

#### 响应数据

```typescript
interface PageResult<NewsCategoryRespVO> {
  total: number;
  list: NewsCategoryRespVO[];
}
```

---

### 获取所有新闻类别

**Endpoint**: `GET /admin-api/product/news-category/list-all`

**认证要求**: Public

#### 响应数据

`NewsCategoryRespVO[]`

---

## 管理后台 - 新闻管理

### 创建新闻

**Endpoint**: `POST /admin-api/product/news/create`

**认证要求**: JWT (`product:news:create`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Body | categoryId | number | 是 | 新闻类别 ID |
| Body | titleZh | string | 是 | 标题（中文） |
| Body | titleEn | string | 是 | 标题（英文） |
| Body | titlePt | string | 否 | 标题（葡萄牙语） |
| Body | titleEs | string | 否 | 标题（西班牙语） |
| Body | summaryZh | string | 否 | 摘要（中文） |
| Body | summaryEn | string | 否 | 摘要（英文） |
| Body | summaryPt | string | 否 | 摘要（葡萄牙语） |
| Body | summaryEs | string | 否 | 摘要（西班牙语） |
| Body | contentZh | string | 是 | 内容（中文，富文本） |
| Body | contentEn | string | 是 | 内容（英文，富文本） |
| Body | contentPt | string | 否 | 内容（葡萄牙语，富文本） |
| Body | contentEs | string | 否 | 内容（西班牙语，富文本） |
| Body | coverImage | string | 否 | 封面图片 URL |
| Body | isFeatured | boolean | 否 | 是否特色新闻 |
| Body | isPinned | boolean | 否 | 是否置顶 |
| Body | publishDate | string | 否 | 发布时间 |
| Body | source | string | 否 | 新闻来源 |
| Body | author | string | 否 | 作者 |
| Body | tags | string | 否 | 标签（逗号分隔） |
| Body | active | boolean | 否 | 是否启用 |

#### 响应数据

```typescript
number  // 新创建的新闻 ID
```

---

### 修改新闻

**Endpoint**: `PUT /admin-api/product/news/update`

**认证要求**: JWT (`product:news:update`)

#### 请求参数

同【创建新闻】（需包含 `id` 字段）

#### 响应数据

```typescript
boolean  // true 表示更新成功
```

---

### 删除新闻

**Endpoint**: `DELETE /admin-api/product/news/delete`

**认证要求**: JWT (`product:news:delete`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | id | number | 是 | 新闻编号 |

#### 响应数据

```typescript
boolean  // true 表示删除成功
```

---

### 获取新闻详情

**Endpoint**: `GET /admin-api/product/news/get`

**认证要求**: JWT (`product:news:query`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | id | number | 是 | 新闻编号 |

#### 响应数据

```typescript
interface NewsRespVO {
  id: number;
  categoryId: number;
  titleZh: string;
  titleEn: string;
  titlePt: string;
  titleEs: string;
  summaryZh: string;
  summaryEn: string;
  summaryPt: string;
  summaryEs: string;
  contentZh: string;
  contentEn: string;
  contentPt: string;
  contentEs: string;
  coverImage: string;
  isFeatured: boolean;
  isPinned: boolean;
  publishDate: string;
  source: string;
  author: string;
  tags: string;
  viewCount: number;
  active: boolean;
  createTime: string;
  updateTime: string;
}
```

---

### 获取新闻分页

**Endpoint**: `GET /admin-api/product/news/page`

**认证要求**: JWT (`product:news:query`)

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | categoryId | number | 否 | 新闻类别 ID |
| Query | title | string | 否 | 标题（模糊匹配） |
| Query | isFeatured | boolean | 否 | 是否特色新闻 |
| Query | isPinned | boolean | 否 | 是否置顶 |
| Query | active | boolean | 否 | 是否启用 |
| Query | pageNo | number | 是 | 页码 |
| Query | pageSize | number | 是 | 每页数量 |

#### 响应数据

```typescript
interface PageResult<NewsRespVO> {
  total: number;
  list: NewsRespVO[];
}
```

---

### 获取新闻列表

**Endpoint**: `GET /admin-api/product/news/list`

**认证要求**: JWT (`product:news:query`)

#### 响应数据

`NewsRespVO[]`

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

产品模块提供产品信息查询功能，支持多语言（中文、英语、葡萄牙语、西班牙语）。

**基础路径**: `/app-api/public/product`

**认证要求**: 公开 API（无需认证）

**特性**:
- 多语言支持：根据 `Accept-Language` 请求头自动返回对应语言内容
- 缓存优化：响应被缓存以提升性能

---

### 获取产品列表

**Endpoint**: `GET /app-api/public/product/list`

#### 响应数据

```typescript
interface ProductVO {
  id: number;
  code: string;              // 产品编码
  category: string;          // 产品分类
  title: string;             // 产品标题（根据请求语言自动返回）
  description: string;       // 产品描述（根据请求语言自动返回）
  imageUrl: string;          // 图片 URL
  specs: ProductSpecVO[];    // 产品规格列表
  downloads: ProductDownloadVO[];  // 下载资源列表
}

interface ProductSpecVO {
  id: number;
  specKey: string;           // 规格键（如 voltage, current）
  specValue: string;         // 规格值（如 220V, 5A）
  specUnit: string;          // 规格单位（如 V, A, mm）
  specType: string;          // 规格类型
  required: boolean;         // 是否必填
  sortOrder: number;         // 排序
}

interface ProductDownloadVO {
  id: number;
  title: string;             // 资源标题
  description: string;       // 资源描述
  fileUrl: string;           // 下载 URL
  fileType: string;          // 文件类型（pdf, doc, xlsx 等）
  fileSize: number;          // 文件大小（字节）
  downloadCount: number;     // 下载次数
  sortOrder: number;         // 排序
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
      "specs": [
        {
          "id": 1,
          "specKey": "voltage",
          "specValue": "220V",
          "specUnit": "V",
          "specType": "electrical",
          "required": true,
          "sortOrder": 1
        }
      ],
      "downloads": []
    }
  ]
}
```

---

### 根据类别获取产品列表

**Endpoint**: `GET /app-api/public/product/category/{category}`

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Path | category | string | 是 | 产品类别（如 electronics） |

#### 响应数据

`ProductVO[]`

---

### 获取产品详情

**Endpoint**: `GET /app-api/public/product/{id}`

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Path | id | number | 是 | 产品 ID |

#### 响应数据

`ProductVO`

---

### 搜索产品

**Endpoint**: `GET /app-api/public/product/search`

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | keyword | string | 是 | 搜索关键词（根据当前语言搜索标题和描述）|

#### 响应数据

`ProductVO[]`

---

### 获取类别树

**Endpoint**: `GET /app-api/categories`

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

**Endpoint**: `GET /app-api/categories/by-level`

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

**Endpoint**: `GET /app-api/products/{productId}/specs`

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

**Endpoint**: `GET /app-api/products/{productId}/specs/type/{specType}`

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

**Endpoint**: `GET /app-api/products/{productId}/specs/required/{specType}`

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

**Endpoint**: `GET /app-api/products/{productId}/downloads`

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

**Endpoint**: `GET /app-api/products/{productId}/downloads/language/{language}`

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

**Endpoint**: `GET /app-api/products/{productId}/downloads/file-type/{fileType}`

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

**Endpoint**: `GET /app-api/products/{productId}/downloads/resource-type/{resourceType}`

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

**Endpoint**: `GET /app-api/products/{productId}/downloads/file/{downloadId}`

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

证书模块提供公司资质和认证信息查询功能，支持多语言。

**基础路径**: `/app-api/public/certificate`

**认证要求**: 公开 API（无需认证）

**特性**:
- 多语言支持：根据 `Accept-Language` 请求头自动返回对应语言内容
- 缓存优化：响应被缓存以提升性能

---

### 获取证书列表

**Endpoint**: `GET /app-api/public/certificate/list`

#### 响应数据

```typescript
interface CertificateVO {
  id: number;
  code: string;                    // 证书代码
  name: string;                    // 证书名称（根据请求语言自动返回）
  description: string;             // 证书描述（根据请求语言自动返回）
  issuingAuthority: string;        // 颁发机构
  certificateNumber: string;       // 证书编号
  issueDate: string;               // 颁发日期（ISO 8601）
  expiryDate: string;              // 到期日期（ISO 8601）
  categoryId: number;              // 证书类别 ID
  categoryName: string;            // 证书类别名称（多语言）
  imageUrl: string;                // 证书图片 URL
  fileUrl: string;                 // 证书文件 URL
  expiryStatus: string;            // 到期状态: VALID/EXPIRING_SOON/EXPIRED
  daysUntilExpiry: number;         // 距到期天数（负数表示已过期）
  sortOrder: number;               // 排序
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
      "code": "CERT001",
      "name": "ISO 9001 质量管理体系认证",
      "description": "国际标准化组织质量管理体系认证",
      "issuingAuthority": "SGS",
      "certificateNumber": "CN-001234",
      "issueDate": "2020-01-15",
      "expiryDate": "2025-01-15",
      "categoryId": 1,
      "categoryName": "质量认证",
      "imageUrl": "https://cdn.example.com/cert1.jpg",
      "fileUrl": "https://cdn.example.com/cert1.pdf",
      "expiryStatus": "VALID",
      "daysUntilExpiry": 350,
      "sortOrder": 1
    }
  ]
}
```

---

### 根据类别获取证书列表

**Endpoint**: `GET /app-api/public/certificate/category/{categoryId}`

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Path | categoryId | number | 是 | 证书类别 ID |

#### 响应数据

`CertificateVO[]`

---

### 获取证书详情

**Endpoint**: `GET /app-api/public/certificate/{id}`

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Path | id | number | 是 | 证书 ID |

#### 响应数据

`CertificateVO`

---

### 获取有效证书列表

**Endpoint**: `GET /app-api/public/certificate/valid`

#### 说明

获取所有未过期的证书（到期日期在今天及之后）。

#### 响应数据

`CertificateVO[]`

---



---

### 下载证书文件

**Endpoint**: GET /app-api/certificates/{id}/download

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

**Endpoint**: `GET /app-api/certificates/categories`

**认证要求**: Public

#### 响应数据

```typescript
interface CertificateCategoryVO {
  id: number;
  code: string;
  name: string;              // 类别名称（多语言）
  description: string;       // 类别描述（多语言）
  sortOrder: number;
  active: boolean;
  iconUrl: string;
  createTime: string;
  updateTime: string;
}
```

---

### 获取证书类别详情

**Endpoint**: `GET /app-api/certificates/categories/{id}`

**认证要求**: Public

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Path | id | number | 是 | 类别 ID |

#### 响应数据

`CertificateCategoryVO`

---

## 新闻管理

新闻模块提供企业新闻资讯查询功能，支持多语言。

**基础路径**: `/app-api/public/news`

**认证要求**: 公开 API（无需认证）

**特性**:
- 多语言支持：根据 `Accept-Language` 请求头自动返回对应语言内容
- 缓存优化：响应被缓存以提升性能

---

### 获取新闻列表

**Endpoint**: `GET /app-api/public/news/list`

#### 响应数据

```typescript
interface NewsVO {
  id: number;
  code: string;
  title: string;             // 新闻标题（根据请求语言自动返回）
  summary: string;           // 新闻摘要（根据请求语言自动返回）
  source: string;            // 新闻来源
  author: string;            // 作者
  publishDate: string;       // 发布日期（ISO 8601）
  categoryId: number;        // 类别 ID
  categoryName: string;      // 类别名称（多语言）
  thumbnailUrl: string;      // 缩略图 URL
  featured: boolean;         // 是否特色
  pinned: boolean;           // 是否置顶
  viewCount: number;         // 浏览次数
  externalUrl: string;       // 外部链接 URL
  sortOrder: number;         // 排序
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
      "code": "NEWS001",
      "title": "合力科技发布新一代智能控制器",
      "summary": "合力科技今日正式发布新一代工业级智能控制器产品...",
      "source": "合力科技官网",
      "author": "市场部",
      "publishDate": "2024-01-15T10:00:00",
      "categoryId": 1,
      "categoryName": "产品发布",
      "thumbnailUrl": "https://cdn.example.com/news1-thumb.jpg",
      "featured": true,
      "pinned": false,
      "viewCount": 1250,
      "externalUrl": null,
      "sortOrder": 1
    }
  ]
}
```

---

### 根据类别获取新闻列表

**Endpoint**: `GET /app-api/public/news/category/{categoryId}`

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Path | categoryId | number | 是 | 新闻类别 ID |

#### 响应数据

`NewsVO[]`

---

### 获取新闻详情

**Endpoint**: `GET /app-api/public/news/{id}`

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Path | id | number | 是 | 新闻 ID |

#### 响应数据

```typescript
interface NewsDetailVO {
  id: number;
  code: string;
  title: string;             // 新闻标题（多语言）
  summary: string;           // 新闻摘要（多语言）
  content: string;           // 新闻内容（多语言，富文本）
  source: string;            // 新闻来源
  author: string;            // 作者
  publishDate: string;       // 发布日期（ISO 8601）
  categoryId: number;        // 类别 ID
  categoryName: string;      // 类别名称（多语言）
  imageUrl: string;          // 图片 URL
  thumbnailUrl: string;      // 缩略图 URL
  featured: boolean;         // 是否特色
  pinned: boolean;           // 是否置顶
  viewCount: number;         // 浏览次数
  externalUrl: string;       // 外部链接 URL
  createTime: string;        // 创建时间
  updateTime: string;        // 更新时间
}
```

#### 响应示例

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "id": 1,
    "code": "NEWS001",
    "title": "合力科技发布新一代智能控制器",
    "summary": "合力科技今日正式发布新一代工业级智能控制器产品...",
    "content": "<p>合力科技今日正式发布新一代工业级智能控制器产品。该产品采用最新技术...</p>",
    "source": "合力科技官网",
    "author": "市场部",
    "publishDate": "2024-01-15T10:00:00",
    "categoryId": 1,
    "categoryName": "产品发布",
    "imageUrl": "https://cdn.example.com/news1.jpg",
    "thumbnailUrl": "https://cdn.example.com/news1-thumb.jpg",
    "featured": true,
    "pinned": false,
    "viewCount": 1251,
    "externalUrl": null,
    "createTime": "2024-01-15T09:30:00",
    "updateTime": "2024-01-15T10:00:00"
  }
}
```

---

### 获取特色新闻

**Endpoint**: `GET /app-api/public/news/featured`

#### 响应数据

`NewsVO[]`

---

### 获取置顶新闻

**Endpoint**: `GET /app-api/public/news/pinned`

#### 响应数据

`NewsVO[]`

---

### 获取最新新闻

**Endpoint**: `GET /app-api/public/news/recent`

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | limit | number | 否 | 限制数量（默认 10） |

#### 响应数据

`NewsVO[]`

---

### 搜索新闻

**Endpoint**: `GET /app-api/public/news/search`

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | keyword | string | 是 | 搜索关键词（根据当前语言搜索标题和摘要）|

#### 响应数据

`NewsVO[]`

---

## 新闻类别管理

### 获取新闻类别列表

**Endpoint**: `GET /app-api/news/categories`

**认证要求**: Public

#### 响应数据

```typescript
interface NewsCategoryVO {
  id: number;
  code: string;
  name: string;              // 类别名称（多语言）
  description: string;       // 类别描述（多语言）
  sortOrder: number;
  active: boolean;
  iconUrl: string;
  createTime: string;
  updateTime: string;
}
```

---

### 获取新闻类别详情

**Endpoint**: `GET /app-api/news/categories/{id}`

**认证要求**: Public

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Path | id | number | 是 | 类别 ID |

#### 响应数据

`NewsCategoryVO`

---

## 业务解决方案

业务解决方案模块提供业务解决方案和案例研究查询功能，支持多语言展示、行业筛选、案例关联等特性。

**基础路径**: `/app-api/public/solutions`

**认证要求**: 公开 API（无需认证）

**特性**:
- 多语言支持：根据 `Accept-Language` 请求头自动返回对应语言内容
- 缓存优化：响应被缓存以提升性能

---

### 获取解决方案列表（卡片视图）

**Endpoint**: `GET /app-api/public/solutions`

#### 响应数据

```typescript
interface SolutionCardVO {
  id: number;
  code: string;                    // 解决方案代码
  title: string;                   // 标题（根据请求语言自动返回）
  summary: string;                 // 摘要（根据请求语言自动返回）
  imageUrl: string;                // 预览图片 URL
  icon: string;                    // 图标名称
  targetIndustry: string;         // 目标行业
  displayOrder: number;            // 显示顺序
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
      "code": "smart-manufacturing",
      "title": "智能制造解决方案",
      "summary": "为制造业客户提供全面的数字化转型服务，包括设备联网、数据采集与分析、智能决策支持等功能",
      "imageUrl": "/images/solutions/manufacturing.jpg",
      "icon": "industry",
      "targetIndustry": "制造业",
      "displayOrder": 1
    },
    {
      "id": 2,
      "code": "energy-optimization",
      "title": "行业能源优化解决方案",
      "summary": "帮助企业降低能耗、提高能源利用效率，实现绿色可持续发展",
      "imageUrl": "/images/solutions/energy.jpg",
      "icon": "lightning",
      "targetIndustry": "能源/化工",
      "displayOrder": 2
    },
    {
      "id": 3,
      "code": "supply-chain",
      "title": "智能供应链管理系统",
      "summary": "提供端到端的供应链可视化和智能化管理，提升运营效率和客户满意度",
      "imageUrl": "/images/solutions/supply-chain.jpg",
      "icon": "box",
      "targetIndustry": "物流/零售",
      "displayOrder": 3
    },
    {
      "id": 4,
      "code": "quality-control",
      "title": "质量检测与追溯系统",
      "summary": "构建全流程质量管控体系，确保产品质量符合国际标准",
      "imageUrl": "/images/solutions/quality.jpg",
      "icon": "check-circle",
      "targetIndustry": "制造/医药",
      "displayOrder": 4
    }
  ]
}
```

---

### 按行业筛选解决方案

**Endpoint**: `GET /app-api/public/solutions/by-industry/{industry}`

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Path | industry | string | 是 | 行业名称 |

#### 响应数据

`SolutionCardVO[]`

---

### 获取所有行业列表

**Endpoint**: `GET /app-api/public/solutions/industries`

#### 响应数据

```typescript
string[]  // 行业名称列表
```

#### 响应示例

```json
{
  "code": 0,
  "msg": "",
  "data": [
    "制造业",
    "能源/化工",
    "物流/零售",
    "制造/医药"
  ]
}
```

---

### 获取解决方案详情

**Endpoint**: `GET /app-api/public/solutions/{id}`

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Path | id | number | 是 | 解决方案 ID |

#### 响应数据

```typescript
interface SolutionDetailVO {
  id: number;
  code: string;                    // 解决方案代码
  title: string;                   // 标题（多语言）
  summary: string;                 // 摘要（多语言）
  content: string;                 // 详细内容（多语言）
  applicationScenario: string;     // 应用场景（多语言）
  imageUrl: string;                // 预览图片 URL
  icon: string;                    // 图标名称
  targetIndustry: string;         // 目标行业
  displayOrder: number;            // 显示顺序
  relatedCases: CaseStudySummaryVO[];  // 关联的案例研究列表
}

interface CaseStudySummaryVO {
  id: number;
  code: string;
  title: string;
  customerName: string;            // 客户名称
  industry: string;                // 所属行业
  imageUrl: string;                // 案例配图 URL
}
```

#### 响应示例

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "id": 1,
    "code": "smart-manufacturing",
    "title": "智能制造解决方案",
    "summary": "为制造业客户提供全面的数字化转型服务，包括设备联网、数据采集与分析、智能决策支持等功能",
    "content": "通过集成传感器、物联网平台和AI算法，实现生产过程的实时监控、预测性维护和质量优化",
    "applicationScenario": "智能工厂建设、生产线自动化升级、工业数据平台搭建",
    "imageUrl": "/images/solutions/manufacturing.jpg",
    "icon": "industry",
    "targetIndustry": "制造业",
    "displayOrder": 1,
    "relatedCases": [
      {
        "id": 1,
        "code": "automotive-2024",
        "title": "某大型汽车制造企业数字化升级",
        "customerName": "某汽车制造集团",
        "industry": "汽车制造",
        "imageUrl": "/images/cases/automotive.jpg"
      }
    ]
  }
}
```

---

### 获取解决方案关联的案例研究

**Endpoint**: `GET /app-api/public/solutions/{id}/cases`

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Path | id | number | 是 | 解决方案 ID |

#### 响应数据

`CaseStudySummaryVO[]`

---

## 案例研究

案例研究模块提供成功案例查询功能，支持多语言展示、行业筛选等功能。

**基础路径**: `/app-api/public/cases`

**认证要求**: 公开 API（无需认证）

**特性**:
- 多语言支持：根据 `Accept-Language` 请求头自动返回对应语言内容
- 缓存优化：响应被缓存以提升性能

---

### 获取案例研究列表

**Endpoint**: `GET /app-api/public/cases`

#### 响应数据

```typescript
interface CaseStudyVO {
  id: number;
  code: string;                    // 案例研究代码
  title: string;                   // 案例标题（根据请求语言自动返回）
  customerName: string;            // 客户名称
  industry: string;                // 所属行业
  challenge: string;               // 面临挑战（根据请求语言自动返回）
  solution: string;                // 解决方案（根据请求语言自动返回）
  result: string;                  // 实施成果（根据请求语言自动返回）
  imageUrl: string;                // 案例配图 URL
  websiteUrl: string;              // 官网链接
  displayOrder: number;            // 显示顺序
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
      "code": "automotive-2024",
      "title": "某大型汽车制造企业数字化升级",
      "customerName": "某汽车制造集团",
      "industry": "汽车制造",
      "challenge": "生产效率低下，数据孤岛严重，无法实现实时监控和质量追溯",
      "solution": "部署工业互联网平台，连接生产设备，实现数据采集和分析",
      "result": "生产效率提升30%，质量追溯率达到100%，年节约成本2000万元",
      "imageUrl": "/images/cases/automotive.jpg",
      "websiteUrl": null,
      "displayOrder": 1
    },
    {
      "id": 2,
      "code": "electronics-2024",
      "title": "电子企业能源优化项目",
      "customerName": "某电子科技公司",
      "industry": "电子",
      "challenge": "能源成本高，设备利用率低，缺乏能耗数据可视化",
      "solution": "实施智能能耗监控系统，优化生产排程，降低待机能耗",
      "result": "能耗降低25%，设备利用率提升15%，年节约成本1200万元",
      "imageUrl": "/images/cases/electronics.jpg",
      "websiteUrl": null,
      "displayOrder": 2
    },
    {
      "id": 3,
      "code": "logistics-2024",
      "title": "零售企业供应链优化",
      "customerName": "某大型零售连锁企业",
      "industry": "零售",
      "challenge": "库存周转慢，供应链响应时间长，客户满意度低",
      "solution": "构建可视化供应链平台，实现智能补货和预测分析",
      "result": "库存周转率提升40%，缺货率降低60%，客户满意度提升20%",
      "imageUrl": "/images/cases/logistics.jpg",
      "websiteUrl": null,
      "displayOrder": 3
    }
  ]
}
```

---

### 按行业筛选案例研究

**Endpoint**: `GET /app-api/public/cases/by-industry/{industry}`

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Path | industry | string | 是 | 行业名称 |

#### 响应数据

`CaseStudyVO[]`

---

### 获取案例研究详情

**Endpoint**: `GET /app-api/public/cases/{id}`

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Path | id | number | 是 | 案例研究 ID |

#### 响应数据

`CaseStudyVO`

---

### 获取案例研究的行业列表

**Endpoint**: `GET /app-api/public/cases/industries`

#### 响应数据

```typescript
string[]  // 行业名称列表
```

#### 响应示例

```json
{
  "code": 0,
  "msg": "",
  "data": [
    "汽车制造",
    "电子",
    "零售"
  ]
}
```

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



## 管理后台 - 证书管理

### 创建证书

**Endpoint**: `POST /admin-api/product/certificate/create`

**认证要求**: JWT + `product:certificate:create` 权限

#### 请求体

```typescript
interface CertificateSaveReqVO {
  id?: number;
  code: string;
  nameZh: string;
  nameEn?: string;
  namePt?: string;
  nameEs?: string;
  descriptionZh?: string;
  descriptionEn?: string;
  descriptionPt?: string;
  descriptionEs?: string;
  issuingAuthority?: string;
  certificateNumber: string;
  issueDate?: string;
  expiryDate?: string;
  categoryId?: number;
  filePath?: string;
  fileUrl?: string;
  imageUrl?: string;
  sortOrder?: number;
  active?: boolean;
}
```

#### 响应数据

```typescript
{
  code: 0;
  msg: "操作成功";
  data: number;
}
```

---

### 修改证书

**Endpoint**: `PUT /admin-api/product/certificate/update`

**认证要求**: JWT + `product:certificate:update` 权限

#### 请求体

同 `CertificateSaveReqVO`（需包含 `id` 字段）

#### 响应数据

```typescript
{
  code: 0;
  msg: "操作成功";
  data: true;
}
```

---

### 删除证书

**Endpoint**: `DELETE /admin-api/product/certificate/delete`

**认证要求**: JWT + `product:certificate:delete` 权限

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | id | number | 是 | 证书 ID |

#### 响应数据

```typescript
{
  code: 0;
  msg: "操作成功";
  data: true;
}
```

---

### 获取证书详情

**Endpoint**: `GET /admin-api/product/certificate/get`

**认证要求**: JWT + `product:certificate:query` 权限

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | id | number | 是 | 证书 ID |

#### 响应数据

```typescript
interface CertificateRespVO {
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
  issuingAuthority: string;
  certificateNumber: string;
  issueDate: string;
  expiryDate: string;
  expiryStatus: string;
  categoryId: number;
  categoryName: string;
  filePath: string;
  fileUrl: string;
  imageUrl: string;
  sortOrder: number;
  active: boolean;
  createTime: string;
  updateTime: string;
}
```

---

### 获取证书分页列表

**Endpoint**: `GET /admin-api/product/certificate/page`

**认证要求**: JWT + `product:certificate:query` 权限

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | pageNo | number | 是 | 页码 |
| Query | pageSize | number | 是 | 每页数量 |
| Query | code | string | 否 | 证书代码 |
| Query | nameZh | string | 否 | 证书名称 |
| Query | categoryId | number | 否 | 类别 ID |
| Query | issuingAuthority | string | 否 | 颁发机构 |
| Query | active | boolean | 否 | 是否启用 |
| Query | expiryDateStart | string | 否 | 到期日期开始 |
| Query | expiryDateEnd | string | 否 | 到期日期结束 |
| Query | expiryStatus | string | 否 | 到期状态 |

#### 响应数据

```typescript
interface PageResult<CertificateRespVO> {
  total: number;
  list: CertificateRespVO[];
}
```

---

### 获取证书列表

**Endpoint**: `GET /admin-api/product/certificate/list`

**认证要求**: JWT + `product:certificate:query` 权限

#### 响应数据

`CertificateRespVO[]`

---

### 获取即将到期的证书

**Endpoint**: `GET /admin-api/product/certificate/expiring`

**认证要求**: JWT + `product:certificate:query` 权限

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | days | number | 否 | 天数（默认 30） |

#### 响应数据

`CertificateRespVO[]`

---

### 获取已过期的证书

**Endpoint**: `GET /admin-api/product/certificate/expired`

**认证要求**: JWT + `product:certificate:query` 权限

#### 响应数据

`CertificateRespVO[]`

---

## 管理后台 - 证书类别管理

### 创建证书类别

**Endpoint**: `POST /admin-api/product/certificate-category/create`

**认证要求**: JWT + `product:certificate-category:create` 权限

#### 请求体

```typescript
interface CertificateCategorySaveReqVO {
  id?: number;
  code: string;
  nameZh: string;
  nameEn?: string;
  namePt?: string;
  nameEs?: string;
  descriptionZh?: string;
  descriptionEn?: string;
  descriptionPt?: string;
  descriptionEs?: string;
  iconUrl?: string;
  sortOrder?: number;
  active?: boolean;
}
```

#### 响应数据

```typescript
{
  code: 0;
  msg: "操作成功";
  data: number;
}
```

---

### 修改证书类别

**Endpoint**: `PUT /admin-api/product/certificate-category/update`

**认证要求**: JWT + `product:certificate-category:update` 权限

#### 请求体

同 `CertificateCategorySaveReqVO`（需包含 `id` 字段）

#### 响应数据

```typescript
{
  code: 0;
  msg: "操作成功";
  data: true;
}
```

---

### 删除证书类别

**Endpoint**: `DELETE /admin-api/product/certificate-category/delete`

**认证要求**: JWT + `product:certificate-category:delete` 权限

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | id | number | 是 | 类别 ID |

#### 响应数据

```typescript
{
  code: 0;
  msg: "操作成功";
  data: true;
}
```

---

### 获取证书类别详情

**Endpoint**: `GET /admin-api/product/certificate-category/get`

**认证要求**: JWT + `product:certificate-category:query` 权限

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | id | number | 是 | 类别 ID |

#### 响应数据

```typescript
interface CertificateCategoryRespVO {
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
  iconUrl: string;
  sortOrder: number;
  active: boolean;
  createTime: string;
  updateTime: string;
}
```

---

### 获取证书类别分页列表

**Endpoint**: `GET /admin-api/product/certificate-category/page`

**认证要求**: JWT + `product:certificate-category:query` 权限

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | pageNo | number | 是 | 页码 |
| Query | pageSize | number | 是 | 每页数量 |
| Query | code | string | 否 | 类别代码 |
| Query | nameZh | string | 否 | 类别名称 |
| Query | active | boolean | 否 | 是否启用 |

#### 响应数据

```typescript
interface PageResult<CertificateCategoryRespVO> {
  total: number;
  list: CertificateCategoryRespVO[];
}
```

---

### 获取证书类别列表

**Endpoint**: `GET /admin-api/product/certificate-category/list`

**认证要求**: JWT + `product:certificate-category:query` 权限

#### 响应数据

`CertificateCategoryRespVO[]`

---

## 公司信息

公司信息模块提供关于 Maxunitech（合力科技）的企业信息，包括公司介绍、企业文化、发展历程和成员公司。

**基础路径**: `/app-api/public/company/about`

**认证要求**: 公开 API（无需认证）

**特性**:
- 多语言支持：中文、英语、葡萄牙语、西班牙语
- 缓存优化：响应被缓存 1 小时

---

### 获取导航菜单

获取"关于"章节的导航菜单项。

**Endpoint**: `GET /app-api/public/company/about/navigation`

#### 响应数据

```typescript
interface NavigationItemVO {
  key: string;        // 导航键（profile/culture/history/members）
  label: string;      // 导航标签（多语言）
  path: string;       // 导航路径
  icon: string;       // 图标名称
}
```

#### 响应示例

```json
{
  "code": 0,
  "msg": "",
  "data": [
    {
      "key": "profile",
      "label": "公司介绍",
      "path": "/about/profile",
      "icon": "company"
    },
    {
      "key": "culture",
      "label": "企业文化",
      "path": "/about/culture",
      "icon": "culture"
    },
    {
      "key": "history",
      "label": "发展历程",
      "path": "/about/history",
      "icon": "history"
    },
    {
      "key": "members",
      "label": "成员企业",
      "path": "/about/members",
      "icon": "team"
    }
  ]
}
```

---

### 获取公司介绍

获取公司简介信息。

**Endpoint**: `GET /app-api/public/company/about/profile`

#### 响应数据

```typescript
interface CompanyPageVO {
  title: string;      // 页面标题（多语言）
  content: string;    // 页面内容（多语言，富文本）
  imageUrl: string;   // 配图 URL
}
```

#### 响应示例

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "title": "合力科技",
    "content": "<p>合力科技是一家致力于为客户提供高品质产品和服务的综合性企业集团。</p>",
    "imageUrl": "/images/company/profile.jpg"
  }
}
```

---

### 获取公司文化

获取企业文化和价值观信息。

**Endpoint**: `GET /app-api/public/company/about/culture`

#### 响应数据

`CompanyPageVO`

#### 响应示例

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "title": "企业文化",
    "content": "<h3>我们的使命</h3><p>以科技创新为驱动，为客户提供卓越的产品和服务。</p>",
    "imageUrl": "/images/company/culture.jpg"
  }
}
```

---

### 获取历史时间线

获取公司发展历程的里程碑列表。

**Endpoint**: `GET /app-api/public/company/about/history`

#### 响应数据

```typescript
interface CompanyHistoryVO {
  milestones: MilestoneVO[];
}

interface MilestoneVO {
  id: number;              // 里程碑 ID
  date: string;            // 里程碑日期（ISO 8601）
  title: string;           // 标题（多语言）
  description: string;     // 描述（多语言）
  imageUrl: string;        // 配图 URL
  sort: number;            // 排序
}
```

#### 响应示例

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "milestones": [
      {
        "id": 1,
        "date": "2010-01-01",
        "title": "公司成立",
        "description": "合力科技正式成立，开启创业征程。",
        "imageUrl": "/images/company/history/2010.jpg",
        "sort": 0
      },
      {
        "id": 2,
        "date": "2015-06-15",
        "title": "新产品线发布",
        "description": "成功发布新一代产品，获得市场广泛认可。",
        "imageUrl": "/images/company/history/2015.jpg",
        "sort": 1
      },
      {
        "id": 3,
        "date": "2020-03-01",
        "title": "国际化战略启动",
        "description": "启动国际化战略，拓展海外市场。",
        "imageUrl": "/images/company/history/2020.jpg",
        "sort": 2
      },
      {
        "id": 4,
        "date": "2024-01-01",
        "title": "成为行业领导者",
        "description": "凭借卓越的产品和服务，成为行业领先企业。",
        "imageUrl": "/images/company/history/2024.jpg",
        "sort": 3
      }
    ]
  }
}
```

---

### 获取成员公司列表

获取成员企业信息列表。

**Endpoint**: `GET /app-api/public/company/about/members`

#### 响应数据

```typescript
interface CompanyMemberVO {
  id: number;              // 成员公司 ID
  memberName: string;      // 成员公司名称（多语言）
  logoUrl: string;         // Logo URL
  description: string;     // 公司描述（多语言）
  websiteUrl: string;      // 官网链接
  sort: number;            // 排序
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
      "memberName": "合力智能制造",
      "logoUrl": "/images/member/manufacturing.jpg",
      "description": "专注于智能制造解决方案，提供先进的生产设备和技术服务。",
      "websiteUrl": "https://manufacturing.maxunitech.com",
      "sort": 0
    },
    {
      "id": 2,
      "memberName": "合力新能源",
      "logoUrl": "/images/member/energy.jpg",
      "description": "致力于新能源技术开发，提供清洁能源解决方案。",
      "websiteUrl": "https://energy.maxunitech.com",
      "sort": 1
    },
    {
      "id": 3,
      "memberName": "合力国际贸易",
      "logoUrl": "/images/member/trade.jpg",
      "description": "专业从事进出口贸易，连接全球市场。",
      "websiteUrl": "https://trade.maxunitech.com",
      "sort": 2
    }
  ]
}
```

---

### 多语言支持

公司信息 API 支持通过以下方式切换语言：

1. **Accept-Language 请求头**:
   ```
   Accept-Language: en
   ```

2. **Cookie（PORTAL_LOCALE）**:
   ```
   PORTAL_LOCALE=en
   ```

3. **查询参数**（通过切换 API 设置）

**支持的语言代码**:

| 代码 | 语言 |
|------|------|
| `zh-CN` 或 `zh` | 中文 |
| `en` | English |
| `pt` | Português |
| `es` | Español |

---

---

## 研发中心

研发中心模块提供研发中心信息和创新成果查询功能，支持多语言（中文、英语、葡萄牙语、西班牙语）。

**基础路径**: `/app-api/public/rd`

**认证要求**: 公开 API（无需认证）

**特性**:
- 多语言支持：根据 `Accept-Language` 请求头自动返回对应语言内容
- 多媒体支持：支持图片和视频展示

---

### 获取研发中心信息

**Endpoint**: `GET /app-api/public/rd/center`

#### 响应数据

```typescript
interface RdCenterInfoVO {
  id: number;                  // ID
  name: string;                // 名称（根据请求语言自动返回）
  introduction: string;        // 介绍（根据请求语言自动返回）
  imageUrl: string;            // 图片 URL
  videoUrl: string;            // 视频 URL
}
```

#### 响应示例

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "id": 1,
    "name": "合力科技研发中心",
    "introduction": "合力科技研发中心致力于技术创新和产品研发，拥有先进的研发设备和专业的研发团队。",
    "imageUrl": "/static/images/rd-center.jpg",
    "videoUrl": "/static/videos/rd-center.mp4"
  }
}
```

---

### 获取创新成果列表

**Endpoint**: `GET /app-api/public/rd/innovations`

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Query | category | string | 否 | 类别筛选（如：专利技术、软件技术） |

#### 响应数据

```typescript
interface InnovationVO {
  id: number;                  // ID
  title: string;               // 标题（根据请求语言自动返回）
  summary: string;             // 摘要（根据请求语言自动返回）
  category: string;            // 类别
  imageUrl: string;            // 图片 URL
  publishDate: string;         // 发布日期（ISO 8601 格式）
  patentNumber: string;        // 专利号
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
      "title": "高效电机控制系统",
      "summary": "创新的高效电机控制系统，显著提升能源效率。",
      "category": "专利技术",
      "imageUrl": "/static/images/innovation-1.jpg",
      "publishDate": "2024-01-15T00:00:00",
      "patentNumber": "CN202310001234.5"
    },
    {
      "id": 2,
      "title": "智能物联网平台",
      "summary": "领先的智能物联网平台，实现设备互联互通。",
      "category": "软件技术",
      "imageUrl": "/static/images/innovation-2.jpg",
      "publishDate": "2024-02-20T00:00:00",
      "patentNumber": "CN202310001235.6"
    }
  ]
}
```

---

### 获取创新成果详情

**Endpoint**: `GET /app-api/public/rd/innovations/{id}`

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Path | id | number | 是 | 创新成果 ID |

#### 响应数据

```typescript
interface InnovationDetailVO {
  id: number;                  // ID
  title: string;               // 标题（根据请求语言自动返回）
  summary: string;             // 摘要（根据请求语言自动返回）
  content: string;             // 详细内容（根据请求语言自动返回）
  category: string;            // 类别
  imageUrl: string;            // 图片 URL
  videoUrl: string;            // 视频 URL
  publishDate: string;         // 发布日期（ISO 8601 格式）
  patentNumber: string;        // 专利号
}
```

#### 响应示例

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "id": 1,
    "title": "高效电机控制系统",
    "summary": "创新的高效电机控制系统，显著提升能源效率。",
    "content": "详细的技术说明...",
    "category": "专利技术",
    "imageUrl": "/static/images/innovation-1.jpg",
    "videoUrl": "/static/videos/innovation-1.mp4",
    "publishDate": "2024-01-15T00:00:00",
    "patentNumber": "CN202310001234.5"
  }
}
```

---

---

## 生产基地

生产基地模块提供生产基地信息查询功能，支持多语言（中文、英语、葡萄牙语、西班牙语）。

**基础路径**: `/app-api/public/production`

**认证要求**: 公开 API（无需认证）

**特性**:
- 多语言支持：根据 `Accept-Language` 请求头自动返回对应语言内容
- 多媒体支持：支持图片和视频展示
- 产能信息展示

---

### 获取生产基地列表

**Endpoint**: `GET /app-api/public/production/bases`

#### 响应数据

```typescript
interface ProductionBaseVO {
  id: number;                  // ID
  name: string;                // 名称（根据请求语言自动返回）
  location: string;            // 位置（根据请求语言自动返回）
  description: string;         // 描述（根据请求语言自动返回）
  areaSize: string;            // 占地面积
  employeeCount: number;       // 员工数量
  capacity: string;            // 产能（根据请求语言自动返回）
  imageUrl: string;            // 图片 URL
  videoUrl: string;            // 视频 URL
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
      "name": "广州生产基地",
      "location": "中国广东省广州市",
      "description": "现代化生产基地，配备先进生产设备和智能化管理系统。",
      "areaSize": "50000平方米",
      "employeeCount": 800,
      "capacity": "年产100万台电机产品",
      "imageUrl": "/static/images/production-base-1.jpg",
      "videoUrl": "/static/videos/production-base-1.mp4"
    }
  ]
}
```

---

### 获取生产基地详情

**Endpoint**: `GET /app-api/public/production/bases/{id}`

#### 请求参数

| 位置 | 字段名 | 类型 | 必填 | 说明 |
|:-----|:-------|:-----|:-----|:-----|
| Path | id | number | 是 | 生产基地 ID |

#### 响应数据

```typescript
interface ProductionBaseDetailVO {
  id: number;                  // ID
  name: string;                // 名称（根据请求语言自动返回）
  location: string;            // 位置（根据请求语言自动返回）
  description: string;         // 描述（根据请求语言自动返回）
  areaSize: string;            // 占地面积
  employeeCount: number;       // 员工数量
  capacity: string;            // 产能（根据请求语言自动返回）
  facilities: string;          // 设施信息（根据请求语言自动返回）
  imageUrl: string;            // 图片 URL
  videoUrl: string;            // 视频 URL
}
```

#### 响应示例

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "id": 1,
    "name": "广州生产基地",
    "location": "中国广东省广州市",
    "description": "现代化生产基地，配备先进生产设备和智能化管理系统。",
    "areaSize": "50000平方米",
    "employeeCount": 800,
    "capacity": "年产100万台电机产品",
    "facilities": "自动化生产线、检测中心、仓储物流中心",
    "imageUrl": "/static/images/production-base-1.jpg",
    "videoUrl": "/static/videos/production-base-1.mp4"
  }
}
```

---

---

## 质量体系

质量体系模块提供质量管理体系信息查询功能，支持多语言（中文、英语、葡萄牙语、西班牙语）。

**基础路径**: `/app-api/public/quality`

**认证要求**: 公开 API（无需认证）

**特性**:
- 多语言支持：根据 `Accept-Language` 请求头自动返回对应语言内容
- 认证证书展示

---

### 获取质量体系信息

**Endpoint**: `GET /app-api/public/quality/system`

#### 响应数据

```typescript
interface QualitySystemVO {
  id: number;                  // ID
  name: string;                // 名称（根据请求语言自动返回）
  description: string;         // 描述（根据请求语言自动返回）
  standard: string;            // 标准（如：ISO 9001:2015）
  certificateNumber: string;   // 证书编号
  imageUrl: string;            // 图片 URL
  documentUrl: string;         // 文档 URL（证书文件）
}
```

#### 响应示例

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "id": 1,
    "name": "ISO 9001质量管理体系",
    "description": "全面的质量管理体系，确保产品质量符合国际标准。",
    "standard": "ISO 9001:2015",
    "certificateNumber": "ISO9001-2023-CN001",
    "imageUrl": "/static/images/quality-iso9001.jpg",
    "documentUrl": "/static/documents/iso9001-certificate.pdf"
  }
}
```

---

### 获取质量体系列表

**Endpoint**: `GET /app-api/public/quality/systems`

#### 响应数据

`QualitySystemVO[]`

#### 响应示例

```json
{
  "code": 0,
  "msg": "",
  "data": [
    {
      "id": 1,
      "name": "ISO 9001质量管理体系",
      "description": "全面的质量管理体系，确保产品质量符合国际标准。",
      "standard": "ISO 9001:2015",
      "certificateNumber": "ISO9001-2023-CN001",
      "imageUrl": "/static/images/quality-iso9001.jpg",
      "documentUrl": "/static/documents/iso9001-certificate.pdf"
    },
    {
      "id": 2,
      "name": "ISO 14001环境管理体系",
      "description": "完善的环境管理体系，致力于绿色生产和可持续发展。",
      "standard": "ISO 14001:2015",
      "certificateNumber": "ISO14001-2023-CN001",
      "imageUrl": "/static/images/quality-iso14001.jpg",
      "documentUrl": "/static/documents/iso14001-certificate.pdf"
    }
  ]
}
```

---

---
