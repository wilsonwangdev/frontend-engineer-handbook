/**
 * Inline theme script to prevent FOUC.
 * Runs synchronously before React hydrates, reading the saved theme
 * from localStorage and applying it to <html data-theme="...">.
 */
export function ThemeScript() {
  const script = `
(function() {
  try {
    var t = localStorage.getItem('theme');
    var s = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    var theme = t === 'light' || t === 'dark' ? t : s;
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {}
})();
`;
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
