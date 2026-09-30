import { readFileSync } from 'fs';
import { join } from 'path';
import { SUPPORTED_MARKDOWN_LANGUAGE_IDS } from '../language-support';

interface PackageJson {
  contributes: { configurationDefaults?: Record<string, Record<string, unknown>> };
}

describe('contributed configurationDefaults', () => {
  const pkg = JSON.parse(
    readFileSync(join(__dirname, '../../package.json'), 'utf8'),
  ) as PackageJson;
  const defaults = pkg.contributes.configurationDefaults ?? {};

  it('sets a monospace editor.fontFamily for markdown files only', () => {
    expect(Object.keys(defaults)).not.toContain('editor.fontFamily');
    const font = defaults['[markdown]']?.['editor.fontFamily'];
    expect(typeof font).toBe('string');
    expect(font as string).toMatch(/monospace\s*$/);
  });

  it('only scopes defaults to supported markdown language ids', () => {
    const supported = SUPPORTED_MARKDOWN_LANGUAGE_IDS as readonly string[];
    for (const key of Object.keys(defaults)) {
      expect(key).toMatch(/^\[.+\]$/);
      expect(supported).toContain(key.slice(1, -1));
    }
  });
});
