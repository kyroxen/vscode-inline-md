---
status: DONE
updateDate: 2026-03-21
priority: Enhancement
---

# Customizable Syntax Colors

## Overview

Optional hex color overrides for inline Markdown syntax. When a setting is unset or invalid, the extension falls back to theme-appropriate behavior: other categories use workbench theme colors where documented (e.g. `textLink.foreground` for links). Headings get a fixed, non-configurable hierarchical font size (H1 largest down to H6 smallest) but no color or weight override — the editor's default markdown syntax highlighting still applies for color.

## Implementation

- **Configuration**: 9 optional color properties under `markdownInlineEditor.colors` in `package.json`; config getters in `src/config.ts` with hex validation; decoration factories in `src/decorations.ts` accept optional `color`; `src/decorator/decoration-type-registry.ts` wires config to decoration creation; config and theme change trigger `recreateColorDependentTypes()`.
- **Settings**: Keys `link`, `listMarker`, `inlineCode`, `inlineCodeBackground`, `emphasis`, `blockquote`, `image`, `horizontalRule`, `checkbox` (9 total). Headings have no color/style setting.
- **Format**: Hex `#RGB`, `#RRGGBB`, `#RGBA`, `#RRGGBBAA`; invalid/malformed values are ignored and theme default is used (no crash).
- **Behavior**: Changing a color setting or active theme updates open Markdown editors without reload; user-configured hex is preserved when switching themes.

## Acceptance Criteria

```gherkin
Feature: Customizable syntax colors

  Scenario: Headings scale by level with no color or weight override
    When I open a markdown file with "# H1" and "###### H6"
    Then "# H1" renders larger than "###### H6"
    And neither heading has a custom color or font weight applied

  Scenario: Invalid hex falls back to theme
    When I set "markdownInlineEditor.colors.link" to "not-a-color"
    Then links use textLink.foreground from the theme
    And the extension does not crash

  Scenario: Set inline code background color
    When I set "markdownInlineEditor.colors.inlineCodeBackground" to "#f0f0f0"
    And I open a markdown file with "`code`"
    Then the inline code background uses the configured color

  Scenario: Inline code background uses default when unset
    When "markdownInlineEditor.colors.inlineCodeBackground" is unset
    Then inline code background uses theme-aware default (white for dark, black for light)
```

## Notes

- Delivers US3 (discoverable settings) via schema and descriptions in Settings UI.
- Invalid hex is validated in config getters (regex); decorations receive `undefined`, and factories use the documented `ThemeColor` fallbacks where applicable.
- All 9 options are optional; theme-derived defaults per data-model.md.
- `inlineCodeBackground` uses a semi-transparent overlay that composites over the editor background; when unset, uses theme-aware default (white overlay for dark themes, black overlay for light themes).
- Headings intentionally have no color or weight customization — they are excluded from this feature's settings. Font size still scales hierarchically by level (fixed, not user-configurable) so document structure stays visually clear.

## Examples

```json
{
  "markdownInlineEditor.colors.link": "#61afef",
  "markdownInlineEditor.colors.inlineCode": "#98c379",
  "markdownInlineEditor.colors.inlineCodeBackground": "#f0f0f0bb",
  "markdownInlineEditor.colors.image": "#61afef",
  "markdownInlineEditor.colors.horizontalRule": "#5c6370",
  "markdownInlineEditor.colors.checkbox": "#98c379"
}
```

