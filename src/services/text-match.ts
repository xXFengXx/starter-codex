/**
 * Language-agnostic text matching helpers shared by the retrieval pipeline.
 *
 * The original implementation split questions on whitespace, which treats an
 * entire Chinese sentence as a single token and therefore never matches any
 * chunk. This module tokenises Latin words and CJK character bigrams so that
 * Chinese questions produce meaningful overlap scores.
 */

const CJK_RUN = /[\u3400-\u9FFF\uF900-\uFAFF]+/g;
const LATIN_WORD = /[a-z0-9]+/g;

const STOP_TOKENS = new Set([
  'the', 'and', 'with', 'what', 'how', 'why', 'when', 'where', 'who',
  'is', 'are', 'was', 'were', 'of', 'to', 'in', 'on', 'for', 'a', 'an',
  'do', 'does', 'did', 'i', 'you', 'me', 'my', 'it', 'its', 'this', 'that', 'be', 'by', 'or', 'as', 'at',
  '什么', '怎么', '如何', '为什', '么是', '哪些', '可以', '是否', '一个',
  '这个', '那个', '我们', '他们', '以及', '的话', '的是', '了吗', '请问',
  '一下', '介绍', '说明',
]);

/** Tokenise text into searchable terms (Latin words plus CJK bigrams). */
export function tokenize(text: string): string[] {
  if (!text) return [];
  const normalized = text.normalize('NFKC').toLowerCase();
  const tokens = new Set<string>();

  for (const word of normalized.match(LATIN_WORD) ?? []) {
    if (word.length > 1 && !STOP_TOKENS.has(word)) tokens.add(word);
  }

  for (const run of normalized.match(CJK_RUN) ?? []) {
    if (run.length === 1) {
      if (!STOP_TOKENS.has(run)) tokens.add(run);
      continue;
    }
    for (let i = 0; i < run.length - 1; i += 1) {
      const bigram = run.slice(i, i + 2);
      if (!STOP_TOKENS.has(bigram)) tokens.add(bigram);
    }
  }

  return [...tokens];
}

/**
 * Score how many query tokens appear in a chunk. Multi-character tokens weigh
 * more than single characters, which keeps bigram matches ahead of noise.
 */
export function scoreText(tokens: string[], content: string): number {
  if (!tokens.length || !content) return 0;
  const haystack = content.normalize('NFKC').toLowerCase();
  let score = 0;
  for (const token of tokens) {
    if (haystack.includes(token)) score += token.length > 1 ? 2 : 1;
  }
  return score;
}
