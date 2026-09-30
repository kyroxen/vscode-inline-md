import {
  ColorThemeKind,
  ConfigurationTarget,
  window,
  workspace,
  getMockConfigValue,
  resetMockConfigStore,
} from '../test/__mocks__/vscode';
import { syncHeadingTokenColor } from '../heading-token-color-sync';

const HEADING_SCOPES = [
  'markup.heading',
  'entity.name.section.markdown',
  'heading.1.markdown',
  'heading.2.markdown',
  'heading.3.markdown',
  'heading.4.markdown',
  'heading.5.markdown',
  'heading.6.markdown',
];

describe('syncHeadingTokenColor', () => {
  beforeEach(() => {
    resetMockConfigStore();
    (window as any).activeColorTheme = { kind: ColorThemeKind.Dark };
  });

  it('adds a heading textMateRule when none exists', () => {
    syncHeadingTokenColor();
    const value = getMockConfigValue('', 'editor.tokenColorCustomizations') as {
      textMateRules: Array<{ scope: string[]; settings: { foreground: string } }>;
    };
    expect(value.textMateRules).toHaveLength(1);
    expect(value.textMateRules[0].scope.sort()).toEqual([...HEADING_SCOPES].sort());
  });

  it('uses a light foreground for dark themes', () => {
    (window as any).activeColorTheme = { kind: ColorThemeKind.Dark };
    syncHeadingTokenColor();
    const value = getMockConfigValue('', 'editor.tokenColorCustomizations') as {
      textMateRules: Array<{ settings: { foreground: string } }>;
    };
    expect(value.textMateRules[0].settings.foreground).toBe('#cccccc');
  });

  it('uses a dark foreground for light themes', () => {
    (window as any).activeColorTheme = { kind: ColorThemeKind.Light };
    syncHeadingTokenColor();
    const value = getMockConfigValue('', 'editor.tokenColorCustomizations') as {
      textMateRules: Array<{ settings: { foreground: string } }>;
    };
    expect(value.textMateRules[0].settings.foreground).toBe('#1a1a1a');
  });

  it('preserves other existing textMateRules', () => {
    const other = { scope: 'comment', settings: { foreground: '#00ff00' } };
    workspace
      .getConfiguration()
      .update('editor.tokenColorCustomizations', { textMateRules: [other] }, ConfigurationTarget.Global);

    syncHeadingTokenColor();
    const value = getMockConfigValue('', 'editor.tokenColorCustomizations') as {
      textMateRules: Array<{ scope: unknown }>;
    };
    expect(value.textMateRules).toHaveLength(2);
    expect(value.textMateRules).toContainEqual(other);
  });

  it('does not duplicate the rule when one matching our scopes already exists', () => {
    syncHeadingTokenColor();
    syncHeadingTokenColor();
    const value = getMockConfigValue('', 'editor.tokenColorCustomizations') as {
      textMateRules: unknown[];
    };
    expect(value.textMateRules).toHaveLength(1);
  });

  it('does not overwrite a user-customized foreground on an existing matching rule', () => {
    workspace.getConfiguration().update(
      'editor.tokenColorCustomizations',
      { textMateRules: [{ scope: [...HEADING_SCOPES], settings: { foreground: '#ff0000' } }] },
      ConfigurationTarget.Global,
    );

    syncHeadingTokenColor();
    const value = getMockConfigValue('', 'editor.tokenColorCustomizations') as {
      textMateRules: Array<{ settings: { foreground: string } }>;
    };
    expect(value.textMateRules[0].settings.foreground).toBe('#ff0000');
  });
});
