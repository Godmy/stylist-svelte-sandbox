# Domain component workspace

`domain/component/page/domain-playground` is the root shell used by the app route. It owns the screen state and keeps the domain menu, viewport controls and settings panel above the current workspace surface.

`domain/component/page/domain-landing` is the landing surface for this domain. It explains why the workspace exists and routes people into the component playground instead of treating the library as a flat component dump.

## Screen Structure

The taxonomy starts with **module → domain → cluster → joint → family**. Module ownership comes from the app's `modules.json`, not from a duplicated domain map. The sidebar shows only modules/domains present in the supplied tree; selecting a module selects its first available domain. Search remains global and selecting a result updates the active module automatically. Module SVGs live in `data/icon/module/` and are loaded directly, without depending on generated SVG barrels.

`device-viewport` has three independent device presets: **mobile · 375px**, **tablet · 768px**, **desktop · 1440px**. Fullscreen is a separate toggle and preserves the preset. It hides the taxonomy rail, breadcrumbs/search/file tabs, and Story metadata/controls/variants; the persistent menu and viewport buttons stay available. Escape exits fullscreen, including when focus is inside the preview frame.

The app provides `/preview?story=<logical story path>` for isolated previews. `domain-file-preview` gives its iframe an exact width, so CSS media queries, viewport units, fixed positioning and `window.innerWidth` use the selected device viewport. Wider previews scroll horizontally instead of silently shrinking. Width/fullscreen updates use same-origin messages without remounting the story, preserving control values. The iframe also mirrors the applied theme. Stories used outside this app retain their inline preview fallback and optional viewport context.

New standalone module roots are discovered with `/modules/*/component/**/index.story.svelte`, while grouped domain roots use `/modules/*/*/component/**/index.story.svelte`. Both map to logical `/src/lib/<domain>/…` paths in explorer, preview and diagnostics.

`molecule/workspace-hints` supplies immediate hover and keyboard-focus hints throughout the workspace. It converts native `title` attributes into styled hints and also consumes `data-hint` and button `aria-label` text. Hints stay within the viewport, render above menu layers, and close on click, Escape, scrolling or blur. File tabs provide descriptive hints and source paths. The domain rail has a full-height divider matching the module rail.

SVG `title` elements inside controls and decorative icons are suppressed, including icons loaded asynchronously, so they cannot add a second native tooltip over the styled hint. Standalone accessible illustrations retain their titles. The `design-token` domain uses its own geometric token icon from the SVG registry.

Settings includes independent module, domain, cluster and joint icon sizes (12–32px, default 16px), applied immediately to the taxonomy sidebar. Rail widths and button sizes grow with their icons. On desktop, the sidebar's right boundary follows the combined rail widths and the wider cluster/joint row, without horizontal scrolling inside those rows. Entity names do not affect the sidebar width. On narrow screens, cluster and joint buttons wrap within the available width. Values persist in browser storage; Reset icon sizes restores all four defaults.

```text
component/page/domain-playground          - root shell and screen switcher
├─ component/page/domain-landing          - landing page for the domain workspace
├─ molecule/domain-menu                   - persistent menu for landing, components, diagnostics and settings
├─ molecule/device-viewport               - story viewport control for component preview
├─ molecule/workspace-hints               - immediate hover/focus hints for workspace controls
├─ organism/domain-explorer               - component browser for domains, clusters, joints and families
│  ├─ organism/domain-sidebar             - taxonomy navigation
│  │  ├─ module rail                     - modules.json selector with data/icon/module SVGs
│  │  ├─ molecule/domain-toolbar          - domain selector
│  │  ├─ molecule/cluster-toolbar         - cluster selector
│  │  ├─ molecule/joint-toolbar           - joint selector
│  │  └─ molecule/domain-list             - entity list
│  ├─ molecule/taxonomy-breadcrumbs       - selected path display
│  ├─ molecule/domain-search              - quick entity search
│  ├─ molecule/joint-tab-buttons          - file/story/json/markdown/dependency tabs
│  └─ organism/domain-file-preview        - file, markdown, story, JSON-tree and dependency-graph preview
├─ organism/domain-diagnostics            - story runner + manifest-driven file diagnostics
│  └─ organism/domain-file-diagnostics    - manifest dashboard, always rendered above the story runner
│     ├─ organism/domain-file-overview           - file/component totals from the domain-files manifest
│     ├─ organism/domain-cluster-balance         - per-domain cluster balance from the domain-files manifest
│     ├─ organism/domain-component-import-diagnostics - import-health rows/summary from the import-diagnostics manifest
│     └─ organism/domain-file-domain-grid        - per-domain file grid from the domain-files manifest
└─ organism/domain-settings               - theme settings panel
```

`domain-diagnostics` combines two independent checks: the story runner (imports and mounts every `*.story.svelte` to catch runtime errors) and `domain-file-diagnostics`, a static dashboard fed by generated manifests rather than by running code:

- `data/json/domain-files/index.json` — file/component counts and cluster balance per domain
- `data/json/domain-component-intervals/index.json` — component size/interval stats, consumed by `domain-file-overview`
- `data/json/domain-component-import-diagnostics/index.json` — import-health rows and summary, consumed by `domain-component-import-diagnostics`

These manifests are generated data (see the sibling stylist tooling); global regeneration is human-only. The page manifest contains only tree, with dictionaries at every level: domain/cluster/joint/family maps directly to a PRESET_FILE string key. ARRAY_FILE is the filename catalog, parsed together with PRESET_FILE by a single Python parser. Explorer reconstructs all paths/files through normalizeDomainTree, resolveTreeFamilies, resolveFilePreset and expandComponentTree. resolveComponentDescriptor derives API projection on demand, checking actual entries in the tree; no descriptors section is serialized. countDomainStories computes the landing statistic from presets. See [file catalog and compact manifest](../../../../../docs/component-manifest-presets.md) for the encoding contract and measurements.

Previously archived sources have returned to their physical module owners: the node-editor demo to architecture/workspace, domain-builder and its layout to observer/token, domain-backlog to management/portfolio and domain-ai-agent to observer/domain, transcriber to information/audio, AI components to customer/ai, development tools to observer/development, and API managers to observer/server. The archived screens and API handlers are not automatically wired into this app.

## Purpose

The page manifest encodes canonical `index.svg` entries as `"INDEX_SVG"` from `const/preset/file`. Every family stores one preset string covering its complete file composition. Explorer restores filenames and paths when consuming the tree.

The domain workspace makes the component library readable before it becomes gigantic. It compresses the architecture into a navigable shape: domains describe subject areas, clusters describe language-level entity types, joints describe logical roles, and families keep related implementation files together.

The landing page should introduce that model and point users toward the interactive component browser. It is not a marketing wrapper around demos; it is the front door to the system's structure.

## Landing Copy

- **Hero**: presents Stylist Svelte as a domain-shaped workspace for reading, reviewing and growing the component system.
- **CTA buttons**: both Browse Components and Interactive Playground open the component playground.
- **Why Stylist?**: explains the practical value of the workspace.
- **Atomic Design architecture**: states how atom, molecule, organism and template composition remains visible inside domain context.
- **Readable navigation**: explains why the library is navigated by domain, cluster, joint and family.
- **Story-first review**: connects stories with implementation files, markdown and JSON context.
- **Domain diagnostics**: keeps diagnostics and manifests part of the maintenance loop.
- **Our Mission**: make the component library readable before it becomes gigantic.

## Notes

- Selecting a domain, cluster, joint or family opens the component playground when a story preview exists.
- Component stories live next to their component source as `index.story.svelte`.
- Generated barrel `index.ts` files are maintained by the indexation workflow.

## Story sizing and selection

Story previews use Viewport sizing: the isolated iframe receives an actual
selected-width window, so CSS media queries use the selected width. Mobile, tablet
and desktop each offer multiple width presets and remember their last selection.
Large viewports scale visually to fit the canvas while retaining their actual CSS
width. Switching width preserves the mounted story and its controls. Fullscreen
keeps the selected width; content scrolling stays inside the viewport.
The domain screen stays within the browser window; the explorer and preview scroll
inside their own panels. Landing and diagnostics retain normal page scrolling.

Family selection from the sidebar and global search uses the same policy: keep Markdown
when it is already selected and the destination has documentation; otherwise prefer a
story, then documentation, then source. Documentation prefers `readme.md`, with `index.md`
as a legacy fallback. Source preserves the previous filename when available, otherwise
prefers `index.svelte`, then `index.ts`. Late content responses cannot overwrite another
selection. The standalone `/preview?story=...` route is owned by the umbrella application
and must ship together with the observer and theme implementations.
