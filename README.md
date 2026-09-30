# Inline Markdown

<img src="assets/icon.png" align="right" alt="Inline Markdown icon" width="120" height="120">

WYSIWYG-style Markdown editing in VS Code. Syntax markers hide while you write, and reappear where you edit. Your files stay plain Markdown: the extension only uses editor decorations and never rewrites your document.

## Features

- **Inline rendering** of headings, emphasis, links, images, lists, task lists, blockquotes, code, horizontal rules, GFM tables, YAML frontmatter and emoji shortcodes
- **Mermaid diagrams and LaTeX math** (`$...$`, `$$...$$`, `` ```math ``) rendered in the editor
- **Interactive**: click task-list checkboxes, hover links and images for targets and previews
- **Raw diffs**: decorations are off in diff views by default, so you review real Markdown
- **Configurable colors, opacity and behavior**; theme-aware by default

Full per-feature notes are in [`docs/features`](docs/features).

## Syntax shadowing

Marker visibility depends on where your cursor is:

| State        | When                              | What you see                          |
| ------------ | --------------------------------- | ------------------------------------- |
| **Rendered** | Default                           | Markers hidden, formatted text only   |
| **Ghost**    | Cursor on the line                | Markers faint (30% opacity by default) |
| **Raw**      | Cursor or selection in a construct | Markers fully visible for editing     |

Exceptions: blockquotes, lists and checkboxes stay rendered on the active line until you click the marker; headings show raw `#` on their line; ordered-list numbers stay visible; a table switches to raw Markdown entirely while the cursor is inside it.

## Usage

Open a Markdown file (`markdown`, `mdx`, `markdoc`, `mdc`, `juliamarkdown` and `rmarkdown` are also supported). Toggle rendering from the Command Palette (**Toggle Markdown Decorations**, `mdInline.toggleDecorations`) or the eye icon in the editor title bar.

Requires VS Code 1.100 or newer.

## Settings

All keys start with `markdownInlineEditor.`. Search Settings for "Markdown Inline Editor" to see every option and its default. The main ones:

| Setting                                        | Default | Purpose                                          |
| ---------------------------------------------- | ------- | ------------------------------------------------ |
| `decorations.ghostFaintOpacity`                | `0.3`   | Opacity of ghost markers                         |
| `defaultBehaviors.diffView.applyDecorations`   | `false` | Render inline in diff views too                  |
| `links.singleClickOpen`                        | `false` | Open links without Ctrl/Cmd-click                |
| `emojis.enabled`                               | `true`  | Render `:shortcode:` emoji                       |
| `math.enabled`                                 | `true`  | Render LaTeX math                                |
| `tables.cjkWidthRatio`                         | `2.25`  | Table alignment for CJK text                     |
| `colors.*`                                     | unset   | Hex overrides for links, lists, code, emphasis, blockquote, image, rule, checkbox |

```json
{
  "markdownInlineEditor.decorations.ghostFaintOpacity": 0.25,
  "markdownInlineEditor.colors.link": "#61afef"
}
```

## Known limitations

- GFM tables: multi-line cells and nested block content in cells are not supported
- Very large files (over ~1 MB) can parse slowly
- An activity-bar entry exists to host the hidden Mermaid webview; it isn't interactive

See the [FAQ](docs/FAQ.md) for troubleshooting.

## Development

Requires Node 22.12+ (`nvm use` reads `.nvmrc`).

```bash
git clone git@github.com:kyroxen/vscode-inline-md.git
cd vscode-inline-md
npm install
npm test
```

Press `F5` in VS Code to launch an Extension Development Host.

| Command            | Description                                  |
| ------------------ | -------------------------------------------- |
| `npm run compile`  | Compile TypeScript                           |
| `npm test`         | Run the test suite (Vitest)                  |
| `npm run lint`     | Run ESLint                                   |
| `npm run validate` | Docs lint, tests and full build              |
| `npm run package`  | Build `dist/extension.vsix`                  |

Install a local build with `code --install-extension dist/extension.vsix`.

Architecture, module layout and code standards are in [`AGENTS.md`](AGENTS.md). Commits follow [Conventional Commits](https://www.conventionalcommits.org/).

## License

MIT. See [LICENSE.txt](LICENSE.txt).

Forked from [markdown-inline-editor-vscode](https://github.com/SeardnaSchmid/markdown-inline-editor-vscode) by SeardnaSchmid (MIT), which builds on [markdown-inline-preview-vscode](https://github.com/domdomegg/markdown-inline-preview-vscode) by Adam Jones (MIT).
