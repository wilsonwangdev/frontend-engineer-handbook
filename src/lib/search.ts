export interface IndexEntry {
  title: string;
  description: string;
  url: string;
  type: "chapter" | "section" | "term" | "playground";
  text: string;
}

/** CJK-aware tokenizer: bigrams for Chinese, word-level for ASCII */
export function tokenize(s: string): string[] {
  const tokens: string[] = [];
  let i = 0;
  while (i < s.length) {
    const ch = s[i]!;
    if (/[一-鿿㐀-䶿]/.test(ch)) {
      tokens.push(ch);
      if (i + 1 < s.length && /[一-鿿㐀-䶿]/.test(s[i + 1]!)) {
        tokens.push(ch + s[i + 1]!);
      }
      i++;
    } else if (/[a-zA-Z0-9]/.test(ch)) {
      let word = "";
      while (i < s.length && /[a-zA-Z0-9]/.test(s[i]!)) {
        word += s[i]!.toLowerCase();
        i++;
      }
      tokens.push(word);
    } else {
      i++;
    }
  }
  return tokens;
}

export function search(query: string, entries: IndexEntry[]): IndexEntry[] {
  if (!query.trim()) return [];
  const qTokens = tokenize(query.trim());
  if (qTokens.length === 0) return [];

  const results: { entry: IndexEntry; score: number }[] = [];

  for (const entry of entries) {
    const titleLower = entry.title.toLowerCase();
    const titleTokens = tokenize(entry.title);
    const descTokens = tokenize(entry.description);
    const textTokens = tokenize(entry.text);

    let score = 0;

    if (titleLower === query.trim().toLowerCase()) score += 100;
    if (titleLower.includes(query.trim().toLowerCase())) score += 50;

    for (const qt of qTokens) {
      score += titleTokens.filter((t) => t.includes(qt)).length * 10;
      score += descTokens.filter((t) => t.includes(qt)).length * 3;
      score += textTokens.filter((t) => t.includes(qt)).length;
    }

    if (score > 0) results.push({ entry, score });
  }

  return results.toSorted((a, b) => b.score - a.score).map((r) => r.entry);
}
