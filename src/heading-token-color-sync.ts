import * as vscode from 'vscode';

/**
 * TextMate scopes VS Code's bundled markdown grammar assigns to headings:
 * `entity.name.section.markdown` covers ATX (`#`) heading text, `heading.N.markdown`
 * covers the whole heading line, and `markup.heading` covers setext (`===`/`---`)
 * headings. Most color themes assign a hue (often blue) to one of these scopes.
 */
const HEADING_SCOPES = [
  'markup.heading',
  'entity.name.section.markdown',
  'heading.1.markdown',
  'heading.2.markdown',
  'heading.3.markdown',
  'heading.4.markdown',
  'heading.5.markdown',
  'heading.6.markdown',
] as const;

function foregroundForThemeKind(kind: vscode.ColorThemeKind): string {
  switch (kind) {
    case vscode.ColorThemeKind.Light:
      return '#1a1a1a';
    case vscode.ColorThemeKind.HighContrastLight:
      return '#000000';
    case vscode.ColorThemeKind.HighContrast:
      return '#ffffff';
    case vscode.ColorThemeKind.Dark:
    default:
      return '#cccccc';
  }
}

function scopesMatchHeadingRule(scope: unknown): boolean {
  const scopes = Array.isArray(scope) ? scope : typeof scope === 'string' ? [scope] : null;
  if (!scopes || scopes.length !== HEADING_SCOPES.length) {
    return false;
  }
  const sorted = [...scopes].sort();
  const expected = [...HEADING_SCOPES].sort();
  return sorted.every((value, index) => value === expected[index]);
}

/**
 * Ensures headings render in plain foreground text instead of whatever hue the
 * active color theme assigns them, by merging a `textMateRules` entry into the
 * user's global `editor.tokenColorCustomizations` — unless a matching rule is
 * already present (so a user who edits or removes it isn't overridden every run).
 */
export function syncHeadingTokenColor(): void {
  const config = vscode.workspace.getConfiguration();
  const current = config.get<{ textMateRules?: unknown[] }>('editor.tokenColorCustomizations') ?? {};
  const rules = Array.isArray(current.textMateRules) ? current.textMateRules : [];

  const alreadyPresent = rules.some((rule) => scopesMatchHeadingRule((rule as { scope?: unknown })?.scope));
  if (alreadyPresent) {
    return;
  }

  const foreground = foregroundForThemeKind(vscode.window.activeColorTheme.kind);
  const updated = {
    ...current,
    textMateRules: [
      ...rules,
      { scope: [...HEADING_SCOPES], settings: { foreground } },
    ],
  };

  void config.update('editor.tokenColorCustomizations', updated, vscode.ConfigurationTarget.Global);
}
