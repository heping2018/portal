---
name: Vue Spec-Driven Builder
description: 根据需求文档和 API 契约，自动生成 Vue 3 业务代码。
allowed-tools: Read, Grep, Glob, Shell
---

# 执行步骤 (Execution Steps)
1. **需求解构**: 识别 `spec.md` 中对应的 FR (功能需求) 编号。
2. **契约对齐**: 引用 API 文档生成 TypeScript 类型定义。
3. **架构编写**: 
   - 编写 `useXXX` Composition API 逻辑。
   - 编写符合多语言要求的 Vue SFC 组件。
4. **规范自检**: 确保分页大小默认为 20 条。