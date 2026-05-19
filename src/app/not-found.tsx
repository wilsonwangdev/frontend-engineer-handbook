export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-6 py-24">
      <p className="text-sm font-medium tracking-widest text-fg-muted uppercase">404</p>
      <h1 className="mt-2 text-3xl font-bold">页面未找到</h1>
      <p className="mt-4 text-fg-muted">你可能点了一个失效的链接，或者这页内容还没写。</p>
      <a
        href="/"
        className="mt-8 inline-flex w-fit items-center gap-2 rounded-lg border border-[var(--color-border)] px-4 py-2 font-medium transition-colors hover:bg-[var(--color-bg-elevated)]"
      >
        ← 返回首页
      </a>
    </main>
  );
}
