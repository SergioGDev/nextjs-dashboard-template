#!/usr/bin/env node
/**
 * check-doc-paths.mjs
 *
 * Extracts every `src/...`, `docs/...` and `scripts/...` path cited in the
 * project's "living" documentation and verifies it exists on disk. Fails
 * (non-zero exit) if any cited path is missing.
 *
 * Written in Node, not bash — the CI runner is Linux, and a bash version of
 * this check (B11.6's ad-hoc script) relied on `sed -i ''` (macOS/BSD-only
 * syntax), which breaks on GNU sed. See docs/CHANGELOG.md B12.2 and B11.6.
 *
 * Scope note: this only validates that cited paths *exist*. It does not
 * check that the file's contents match what the prose claims — that's a
 * much harder problem (semantic drift) and out of scope here.
 */

import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// ── Which files count as "living" documentation ────────────────────────────
//
// Historical/immutable records are excluded on purpose: they legitimately
// cite paths that no longer exist (that's the point of a changelog / audit
// snapshot), and are never edited to "fix" that. See .claude/rules/testing.md
// convention note below for the other kind of exclusion (deliberate
// counter-examples).
const HISTORICAL_DOCS = new Set(['CHANGELOG.md', 'B6-audit.md', 'B9-audit.md']);

function listMarkdownFiles(dir) {
  return readdirSync(join(ROOT, dir), { withFileTypes: true })
    .filter((e) => e.isFile() && e.name.endsWith('.md'))
    .map((e) => join(dir, e.name));
}

const docFiles = [
  'CLAUDE.md',
  'README.md',
  ...listMarkdownFiles('docs').filter((p) => !HISTORICAL_DOCS.has(p.split('/').pop())),
  ...listMarkdownFiles('.claude/rules'),
];

// ── Path extraction ─────────────────────────────────────────────────────────
//
// Matches any `src/...`, `docs/...` or `scripts/...` token anywhere in the
// file — inside inline code spans (`like this`), fenced code blocks, plain
// prose, markdown link targets, and YAML frontmatter `paths:` lists alike.
// A path is a path regardless of how it's typeset; scanning the raw text is
// simpler and strictly more thorough than special-casing backticks vs. code
// fences.
//
// A path is built from `/`-separated segments, where a segment is either a
// plain token or a *fully bracketed* one: `(dashboard)` (Next.js route
// group), `[locale]` / `[id]` (dynamic route segment), or `{feature}`
// (tutorial placeholder syntax). Requiring the bracket/paren/brace to open
// AND close within the same segment is what keeps this from also swallowing
// markdown link syntax `[docs/foo.md](docs/foo.md)` — the closing `]` there
// isn't preceded by a matching `[` within that segment, so it simply isn't
// part of the pattern and the match stops cleanly before it.
const SEGMENT = String.raw`(?:[A-Za-z0-9_.-]+|\([A-Za-z0-9_.-]+\)|\[[A-Za-z0-9_.-]+\]|\{[A-Za-z0-9_.-]+\})`;
const PATH_RE = new RegExp(String.raw`(?<![\w./-])(?:src|docs|scripts)(?:/${SEGMENT})+`, 'g');

// Sentence/markdown punctuation that can trail a path but is never part of
// one (no real filename ends in a period, comma, colon, quote, backtick).
// Safe to strip unconditionally — segment brackets are already balanced by
// construction above, so this never eats a real trailing `)`/`]`/`}`.
const TRAILING_PUNCTUATION = /[,.:;'"`]+$/;

function stripTrailing(candidate) {
  return candidate.replace(TRAILING_PUNCTUATION, '');
}

// ── Placeholder detection ───────────────────────────────────────────────────
//
// `{name}`-style and `*`-glob paths are illustrative patterns, not literal
// files (e.g. `src/features/{feature}/i18n/en.json`, `src/**/*.test.ts` in a
// rule's frontmatter `paths:` list). They can never "exist" on disk and
// aren't supposed to.
function isPlaceholder(path) {
  return path.includes('{') || path.includes('}') || path.includes('*');
}

// ── Deliberate counter-example convention ───────────────────────────────────
//
// `.claude/rules/testing.md` documents a path that must NEVER exist
// (`src/lib/__tests__/route-info.test.ts   ✗ never`) as a negative example of
// the colocation rule. The repo convention (see i18n.md's `✗ incorrecto`
// usage) is: a `✗` anywhere on the line marks it as showing WRONG code/paths,
// not real ones. This script honors that convention — any path found on a
// line containing `✗` is skipped. Documented in .claude/rules/testing.md so
// whoever writes a new counter-example knows how to mark it.
function lineIsCounterExample(line) {
  return line.includes('✗');
}

// ── Run ──────────────────────────────────────────────────────────────────

const failures = [];
let checkedCount = 0;
const seen = new Set();

for (const relFile of docFiles) {
  const absFile = join(ROOT, relFile);
  const content = readFileSync(absFile, 'utf8');
  const lines = content.split('\n');

  lines.forEach((line, idx) => {
    if (lineIsCounterExample(line)) return;

    const matches = line.match(PATH_RE);
    if (!matches) return;

    for (const raw of matches) {
      const path = stripTrailing(raw);
      if (!path) continue;
      if (isPlaceholder(path)) continue;

      const dedupeKey = `${relFile}:${path}`;
      if (seen.has(dedupeKey)) continue;
      seen.add(dedupeKey);

      checkedCount += 1;
      if (!existsSync(join(ROOT, path))) {
        failures.push({ file: relFile, line: idx + 1, path });
      }
    }
  });
}

if (failures.length > 0) {
  console.error(`✗ check:docs — ${failures.length} broken path(s) cited in documentation:\n`);
  for (const { file, line, path } of failures) {
    console.error(`  ${file}:${line}  →  ${path}`);
  }
  console.error(`\n${checkedCount} path(s) checked, ${failures.length} broken.`);
  process.exit(1);
}

console.log(`✓ check:docs — ${checkedCount} path(s) checked across ${docFiles.length} file(s), all exist.`);
