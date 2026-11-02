# 追踪矩阵

| 验收标准 | 实现位置 | 验证方式 | 结果 |
| --- | --- | --- | --- |
| AC-001 | src/services/text-match.ts, src/services/qa-service.ts | 真实索引资料运行「Hermes自构建是怎么做的」「什么是AI学习导师」，各 2 条引用，confidence 0.85 | PASS |
| AC-002 | src/main/main.ts, src/services/qa-service.ts | qa-history.json 原文与 QaService.ask 入口码点一致；控制台乱码由 Windows chcp 65001 修复 | PASS |
| AC-003 | src/services/text-match.ts | 同资料英文问题 How does Hermes self-build work? / What is an AI learning tutor? 各 2 条引用 | PASS |
| AC-004 | src/services/qa-service.ts | 「量子引力怎么计算」「How do I cook pasta?」均 0 引用、confidence 0.3 | PASS |
| AC-005 | requirements/REQ-0007/verification.md | harness verify：check/test/build 全部 PASS | PASS |
