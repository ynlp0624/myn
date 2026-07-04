
---
Task ID: ADMIN-1 (fix)
Agent: 小雫（主对话直接修复）
Task: 修复前端不显示 + 完成 admin 后台 WebSocket 实时命令链路

Work Log:
- 排查"页面不显示"根因：端口 3000 被僵尸进程占用（EADDRINUSE），清理后用保活方式重启 dev server
- 发现 WebSocket mini-service 的 path 配置错误（原 path:'/'），改为 socket.io 默认 '/socket.io/'
- 发现 Caddy 的 XTransformPort 转发对"同源 3000 浏览器请求 /socket.io/"无效（因为浏览器在 3000，相对路径 fetch 不经过 Caddy 81）
- 修复 use-admin-socket.ts：浏览器在 3000 时手动指向 Caddy 81 端口，其他端口同源
- 发现 ws 服务广播 bug：io.sockets.sockets 是 Map，用 Object.keys() 拿不到 key，改为 Array.from(values())
- 修复 use-admin-socket.ts 的 lint 错误：handleCommand/replyToCommand 提前用 useCallback 定义；ctxRef 用 useEffect 更新
- 用 agent-browser 双会话验证：admin 下发 DELETE_LINK → client 实时收到 toast"后端别睡了，我们该上班了"→ 执行本地删除 → 回复"小雫已经帮 admin 做好啦"→ admin 后台显示回复

Stage Summary:
- 主服务 http://localhost:3000/ 返回 200，页面正常渲染
- WebSocket 服务 http://localhost:3003 返回 200，命令中心已连接
- admin 账号 myn/xiaona 登录正常，role=ADMIN
- admin 后台 6 个 tab 全部工作：概览/用户/短链/背景/广播/API文档
- 实时命令闭环验证通过：BROADCAST_MESSAGE + DELETE_LINK 都能下发+执行+回复
- lint 0 error 0 warning
- 关键文件改动：
  - mini-services/admin-commands/index.ts（path 修复 + Map 迭代修复 + 调试日志）
  - src/hooks/use-admin-socket.ts（连接 origin 智能选择 + useCallback 重构 + ref 更新修复）
