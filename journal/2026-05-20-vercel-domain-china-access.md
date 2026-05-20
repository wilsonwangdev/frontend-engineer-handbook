---
date: 2026-05-20
tags: [deploy, vercel, networking, china-access]
---

## What happened

Vercel 默认分配的 `*.vercel.app` 子域名在中国大陆网络环境下被拦截，
导致面向中文读者的站点直接打开经常失败（不稳定地连接超时 /
SSL 握手中断）。这不是 Vercel 服务本身的问题，而是 `vercel.app`
整个根域在某些 ISP 路径上被污染或限速。

## Root cause

`*.vercel.app` 是公共后缀（PSL），被作为整域级别拦截目标。
即便 Vercel 的源站可达，DNS / SNI 层的拦截让 `vercel.app`
子域无法稳定连通。这是部署目标受众包含中国大陆时绕不开的现实约束，
Vercel 官方文档不会明示。

## Fix

在阿里云购买自定义域名（国内注册商，备案与否取决于是否要走
国内 CDN——纯走 Vercel CDN 不需要备案），把该域名 CNAME 到
Vercel 提供的 `cname.vercel-dns.com`，在 Vercel 项目设置里
绑定自定义域名并启用自动 HTTPS（Let's Encrypt 证书 Vercel 自管）。

绑定后用户访问走的是自定义域名 → Vercel 边缘节点，
`vercel.app` 不再出现在用户请求路径上，拦截规避。

## Lesson for next time

**面向中文读者的 Vercel 站点必须绑定自定义域名**——`*.vercel.app`
在国内不可靠，不是性能问题，是可达性问题。注册商选国内（阿里云 /
腾讯云 / 华为云）即可，DNS 走 CNAME 到 Vercel，证书 Vercel 自动续。
不需要备案除非要叠加国内 CDN。

未来素材升级路径：第 10 章「动手实践」部署环节，或附录 D「实战避坑录」。
