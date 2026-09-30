import {
  ThemeColor,
  getLastTextEditorDecorationTypeOptions,
  resetTextEditorDecorationTypeOptionsCapture,
} from '../../test/__mocks__/vscode';
import {
  Heading1DecorationType,
  Heading2DecorationType,
  Heading3DecorationType,
  Heading4DecorationType,
  Heading5DecorationType,
  Heading6DecorationType,
  LinkDecorationType,
  BlockquoteDecorationType,
  ListItemDecorationType,
  OrderedListItemDecorationType,
  CodeDecorationType,
  BoldDecorationType,
  ItalicDecorationType,
  BoldItalicDecorationType,
  ImageDecorationType,
  HorizontalRuleDecorationType,
  CheckboxUncheckedDecorationType,
  CheckboxCheckedDecorationType,
} from '../../decorations';

describe('decoration creation with color (hex vs theme)', () => {
  describe('heading levels H1–H6 have hierarchical font sizes but no color/weight', () => {
    beforeEach(() => {
      resetTextEditorDecorationTypeOptionsCapture();
    });

    const headingFactories = [
      Heading1DecorationType,
      Heading2DecorationType,
      Heading3DecorationType,
      Heading4DecorationType,
      Heading5DecorationType,
      Heading6DecorationType,
    ] as const;

    it.each(headingFactories)('applies no color or weight styling', (factory) => {
      factory();
      const opts = getLastTextEditorDecorationTypeOptions() as Record<string, unknown>;
      expect('color' in opts).toBe(false);
      expect('fontWeight' in opts).toBe(false);
    });

    it('scales font size from largest (H1) to smallest (H6)', () => {
      const sizes = headingFactories.map((factory) => {
        factory();
        const opts = getLastTextEditorDecorationTypeOptions() as Record<string, unknown>;
        const match = /font-size:\s*([\d.]+)%/.exec(String(opts.textDecoration));
        return match ? Number(match[1]) : NaN;
      });
      for (let i = 1; i < sizes.length; i++) {
        expect(sizes[i]).toBeLessThanOrEqual(sizes[i - 1]);
      }
      expect(sizes[0]).toBeGreaterThan(sizes[sizes.length - 1]);
    });
  });

  describe('syntax decorations (non-heading)', () => {
    beforeEach(() => {
      resetTextEditorDecorationTypeOptionsCapture();
    });

    it('creates link decoration with hex and without', () => {
      expect(LinkDecorationType('#61afef')).toBeDefined();
      expect(LinkDecorationType()).toBeDefined();
      expect(LinkDecorationType(new ThemeColor('textLink.foreground'))).toBeDefined();
    });

    it('omits chain emoji after link text by default', () => {
      LinkDecorationType('#61afef');
      const opts = getLastTextEditorDecorationTypeOptions() as Record<string, unknown>;
      expect('after' in opts).toBe(false);
    });

    it('adds chain emoji after link text when showEmoji is true', () => {
      LinkDecorationType('#61afef', true);
      const opts = getLastTextEditorDecorationTypeOptions() as Record<string, unknown>;
      expect((opts.after as { contentText?: string }).contentText).toBe(' 🔗');
    });

    it('creates blockquote, list, code, emphasis decorations with hex or theme fallback', () => {
      expect(BlockquoteDecorationType('#98c379')).toBeDefined();
      expect(BlockquoteDecorationType()).toBeDefined();
      expect(ListItemDecorationType('#abb2bf')).toBeDefined();
      expect(ListItemDecorationType()).toBeDefined();
      expect(OrderedListItemDecorationType('#abb2bf')).toBeDefined();
      expect(OrderedListItemDecorationType()).toBeDefined();
      expect(CodeDecorationType('#e5c07b')).toBeDefined();
      expect(CodeDecorationType()).toBeDefined();
      expect(BoldDecorationType('#e06c75')).toBeDefined();
      expect(BoldDecorationType()).toBeDefined();
      expect(ItalicDecorationType('#d19a66')).toBeDefined();
      expect(ItalicDecorationType()).toBeDefined();
      expect(BoldItalicDecorationType('#c678dd')).toBeDefined();
      expect(BoldItalicDecorationType()).toBeDefined();
    });

    it('creates image, horizontal rule, checkbox decorations with hex or theme fallback', () => {
      expect(ImageDecorationType('#61afef')).toBeDefined();
      expect(ImageDecorationType()).toBeDefined();
      expect(ImageDecorationType(new ThemeColor('textLink.foreground'))).toBeDefined();
      expect(HorizontalRuleDecorationType('#5c6370')).toBeDefined();
      expect(HorizontalRuleDecorationType()).toBeDefined();
      expect(HorizontalRuleDecorationType(new ThemeColor('editorWidget.border'))).toBeDefined();
      expect(CheckboxUncheckedDecorationType('#abb2bf')).toBeDefined();
      expect(CheckboxUncheckedDecorationType()).toBeDefined();
      expect(CheckboxCheckedDecorationType('#98c379')).toBeDefined();
      expect(CheckboxCheckedDecorationType()).toBeDefined();
    });

    it('CheckboxCheckedDecorationType has after block with contentText "✔"', () => {
      resetTextEditorDecorationTypeOptionsCapture();
      CheckboxCheckedDecorationType();
      const opts = getLastTextEditorDecorationTypeOptions() as Record<string, unknown>;
      expect(opts.after).toBeDefined();
      expect((opts.after as Record<string, unknown>).contentText).toBe('✔');
    });

    it('CheckboxCheckedDecorationType after block includes display: inline-block in textDecoration', () => {
      resetTextEditorDecorationTypeOptionsCapture();
      CheckboxCheckedDecorationType();
      const opts = getLastTextEditorDecorationTypeOptions() as Record<string, unknown>;
      const after = opts.after as Record<string, unknown>;
      expect(after.textDecoration).toContain('display: inline-block');
    });

    it('CheckboxCheckedDecorationType after block includes cursor: pointer in textDecoration', () => {
      resetTextEditorDecorationTypeOptionsCapture();
      CheckboxCheckedDecorationType();
      const opts = getLastTextEditorDecorationTypeOptions() as Record<string, unknown>;
      const after = opts.after as Record<string, unknown>;
      expect(after.textDecoration).toContain('cursor: pointer');
    });

    it('CheckboxUncheckedDecorationType after block has space contentText', () => {
      resetTextEditorDecorationTypeOptionsCapture();
      CheckboxUncheckedDecorationType();
      const opts = getLastTextEditorDecorationTypeOptions() as Record<string, unknown>;
      expect(opts.after).toBeDefined();
      expect((opts.after as Record<string, unknown>).contentText).toBe(' ');
    });

    it('CheckboxUncheckedDecorationType after block includes cursor: pointer in textDecoration', () => {
      resetTextEditorDecorationTypeOptionsCapture();
      CheckboxUncheckedDecorationType();
      const opts = getLastTextEditorDecorationTypeOptions() as Record<string, unknown>;
      const after = opts.after as Record<string, unknown>;
      expect(after.textDecoration).toContain('cursor: pointer');
    });
  });

  describe('CodeDecorationType backgroundColor parameter', () => {
    it('creates code decoration with color only (uses default background)', () => {
      expect(CodeDecorationType('#e5c07b')).toBeDefined();
    });

    it('creates code decoration with backgroundColor only', () => {
      expect(CodeDecorationType(undefined, '#f0f0f0')).toBeDefined();
    });

    it('creates code decoration with both color and backgroundColor', () => {
      expect(CodeDecorationType('#e5c07b', '#f0f0f0')).toBeDefined();
    });

    it('creates code decoration with undefined backgroundColor (uses default)', () => {
      expect(CodeDecorationType('#e5c07b', undefined)).toBeDefined();
      expect(CodeDecorationType()).toBeDefined();
    });

    it('creates code decoration with ThemeColor background', () => {
      expect(CodeDecorationType('#e5c07b', new ThemeColor('editor.background'))).toBeDefined();
      expect(CodeDecorationType(undefined, new ThemeColor('editor.background'))).toBeDefined();
    });
  });
});
