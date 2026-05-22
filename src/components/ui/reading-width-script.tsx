/**
 * Inline reading-width script to prevent FOUC.
 * Runs synchronously before React hydrates, reading the saved width mode
 * from localStorage and applying it to <html data-reading-width="...">.
 */
export function ReadingWidthScript() {
  const script = `
(function() {
  try {
    var w = localStorage.getItem('handbook:reading-width');
    if (w === 'wide' || w === 'focus' || w === 'comfortable') {
      document.documentElement.setAttribute('data-reading-width', w);
    }
  } catch (e) {}
})();
`;
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
