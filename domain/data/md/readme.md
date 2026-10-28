# Domain component workspace

The `domain` domain of the `sandbox` module (`modules/sandbox/domain`) is the component workspace of the umbrella app. `component/page/domain-playground` is the root shell used by the app route: it owns the screen state and keeps the domain menu, viewport controls and settings panel above the current screen.

The domain workspace makes the component library readable before it becomes gigantic. It compresses the architecture into a navigable shape: modules describe repository ownership, domains describe subject areas, clusters describe language-level entity types, joints describe logical roles, and families keep related implementation files together.

## Screens

`DOMAIN_SCREEN` (`const/object/domain-screen`) defines four screens; `domain-playground/state.svelte.ts` switches between them. Everything except the landing is loaded lazily.

- **landing** — `page/domain-landing`, the front door to the system's structure. It is not a marketing wrapper around demos.
- **components** — `page/stylist-preview`, the full-page component catalog opened by **Show components** and **Explore Components**.
- **domain** — `organism/domain-explorer`, the interactive component browser.
- **how-it-works** — `page/domain-how-it-works`, a long-form guide to the methodology. It always opens scrolled to the top.

The app maps `/` to landing, `/components` to the catalog, `/playground` to the explorer and `/about` to the guide. A selected catalog card opens `/playground?component=<logical-family-address>`. The host supplies `route` and `onNavigate` to the shell, using SvelteKit navigation and browser history; standalone stories retain local navigation. Back/Forward restore screens, and the retained catalog preserves search, filters and rendered cards so browser scroll restoration returns to the same position.

The settings panel (`organism/domain-settings`) remains an overlay, addressed by `/settings`; closing it returns to the preceding screen, or landing for a direct visit. In dev, the menu also shows **Reload manifest**, which reloads the page after manifests have been regenerated.

```text
component/page/domain-playground          - root shell and screen switcher
├─ molecule/domain-menu                   - landing, components, playground, how it works, reload manifest, settings, theme mode
├─ molecule/device-viewport               - device/width/fullscreen control, shown on the domain screen
├─ molecule/workspace-hints               - immediate hover/focus hints for workspace controls
├─ component/page/domain-landing          - landing screen
│  └─ page/stylist-landing                - landing composition
│     ├─ molecule/stylist-hero            - hero with domain and story counts
│     ├─ molecule/cta-buttons             - components and playground entry points
│     ├─ molecule/feature-grid            - "Why Stylist?"
│     ├─ organism/samo-methodology        - SAMO chapters: overview, SOLID, assembly, nested methods, morphological box, governance, practice
│     └─ molecule/stylist-mission         - "Our Mission"
├─ component/page/domain-how-it-works     - guide screen
│  ├─ molecule/samo-guide-hero
│  ├─ molecule/samo-change-flow
│  ├─ molecule/samo-extension-walkthrough
│  ├─ molecule/samo-umbrella-map
│  ├─ molecule/samo-local-dev
│  ├─ molecule/samo-platform-stack
│  ├─ molecule/samo-risk-board
│  ├─ molecule/samo-adoption-roadmap
│  └─ molecule/stylist-mission            - "Next step" call to action
├─ organism/domain-explorer               - component browser for modules, domains, clusters, joints and families
│  ├─ organism/domain-sidebar             - taxonomy navigation
│  │  ├─ module rail                      - modules.json selector with data/icon/module SVGs
│  │  ├─ molecule/domain-toolbar          - domain selector
│  │  ├─ molecule/cluster-toolbar         - cluster selector
│  │  ├─ molecule/joint-toolbar           - joint selector
│  │  └─ molecule/domain-list             - entity list
│  ├─ molecule/taxonomy-breadcrumbs       - selected path display
│  ├─ molecule/domain-search              - global entity search
│  ├─ molecule/joint-tab-buttons          - markdown/story/json-tree/dependency tabs plus one tab per file
│  └─ organism/domain-file-preview        - file, markdown, story, JSON-tree and dependency preview
│     ├─ organism/markdown-renderer
│     ├─ molecule/json-tree-viewer
│     ├─ molecule/story-controls          - controls, presets and the HTML markup tab
│     └─ molecule/preview-settings        - shared preview appearance for HTML stories
└─ organism/domain-settings               - theme settings and panel icon sizes
```

Other families of this domain are not wired into the shell: `molecule/story-canvas` is the story surface of the `/preview` route, `organism/device-frame` is a standalone device mock-up, and `organism/domain-ai-agent` is a standalone component with its own story. Diagnostics are stories too (see [Diagnostics and manifests](#diagnostics-and-manifests)).

`page/stylist-preview` is the component catalog formerly owned by `table/component/organism/component`. Its recipe, story types, view/sort tokens and localized messages live in this domain alongside it. The catalog uses the current manifest for its entries, shows category filters directly and exposes all available domain filters. Its colors follow the active site theme. Cards tile the full available width and show the logical entity address. The compact toolbar puts the filtered Found count beside search. During icon review, cards show the same family icon as the file tabs, print its registry key and open the live story on selection. Unmatched families are marked explicitly.

## Navigation

The taxonomy starts with **module → domain → cluster → joint → family**. Module ownership comes from the app's `modules.json`, not from a duplicated domain map. The sidebar shows only modules/domains present in the supplied tree; selecting a module selects its first available domain. Search is global, and selecting a result updates the active module automatically. Module SVGs live in `data/icon/module/` and are loaded directly, without depending on generated SVG barrels.

Cluster buttons come from the selected domain's tree, and joint buttons come from the selected cluster's tree. The built-in catalogs provide standalone story defaults, not navigation allowlists. For example, SVG icons are families under `svg/data/icon`, where `data` is the cluster and `icon` is the joint. Tests are browsable under the `test` cluster with `unit` and `render` joints when present in the manifest.

Joints without entities are hidden. Clusters without joints, including clusters whose joints are all empty, are hidden too. Navigation and automatic selection use this filtered tree.

Within `interface`, joints follow `behavior → slot → recipe`, then the remaining joints (including `contract`).

Selecting a domain, cluster, joint or family opens the component browser. Family selection from the sidebar and from search uses the same policy: keep Markdown when it is already selected and the destination has documentation; otherwise prefer a story, then documentation, then source. Documentation prefers `readme.md`, with `index.md` as a legacy fallback. Source preserves the previous filename when available, otherwise prefers `index.svelte`, then `index.ts`. Late content responses cannot overwrite another selection.

The domain screen stays within the browser window; the explorer and preview scroll inside their own panels. Landing and guide keep normal page scrolling.

The explorer's viewer chrome sits above the preview and allows visible overflow, so search results can extend over the canvas without being clipped by the toolbar row.

## Stories and preview

A story is described by `index.story.ts` (a `ContractStory` from `$stylist/html/interface/contract/story`): its controls, presets and description live in the workspace panel, and the iframe only renders the component with the current args. A sibling `index.story.svelte` next to `index.story.ts` is that story's custom render, not a separate story. A standalone `index.story.svelte` remains a legacy story that renders its own surface.

Stories are discovered with three globs, shared by the explorer, the story runner and the preview route:

- `/src/lib/**/component/**/index.story.{svelte,ts}`
- `/modules/*/*/component/**/index.story.{svelte,ts}` — grouped domain roots
- `/modules/*/component/**/index.story.{svelte,ts}` — standalone module roots

Physical paths map to logical `/src/lib/<domain>/…` paths in the explorer, preview and story runner.

The umbrella app provides `/preview?story=<logical story path>` for isolated previews; that route must ship together with the sandbox and theme implementations. `domain-file-preview` talks to the iframe through same-origin messages: `stylist:story-args`, `stylist:viewport` and `stylist:preview-environment` go to the frame; `stylist:preview-ready`, `stylist:story-ready` and `stylist:exit-fullscreen` come back. The frame is shown only after the theme is mirrored and the story has settled, so the unthemed first paint never flashes. Updates never remount the story, so control values survive width and fullscreen changes.

The story panel shows the title, logical location (`html / atom / a`) and description, plus:

- **Story controls** with a Default/preset switch and, when markup is available, an **HTML** tab with copy-to-clipboard.
- **Preview appearance** (`preview-settings`, `ContractPreviewEnvironment`) for visual HTML stories (`resolvePreviewSkin`): skin, light/dark mode, font family, font size, line height and density. Empty values inherit the current theme; appearance is shared between stories, while args are reset per story.
- **Save component screenshot** — saves only the painted component (not the whole frame) as `<family>.png`.

## Catalog icon review

The current catalog shows the family icon chosen by `resolveFamilyIcon` and `isIconName`, exactly as `joint-tab-buttons` does. Each tile prints the selected SVG registry name so it can be reviewed. Families with no matching icon explicitly show the generic `component` glyph and a not-assigned label. The same generic glyph also appears next to the library label as a reference. The catalog header measures the title, filter controls and host-provided menu. When their natural widths fit, they share one row with the filter centered between title and menu. Otherwise the filter moves to its own centered row below both; mobile stacks the title, menu and filter in that order. The header remains available while scrolling. Category filters follow Atoms, Molecules, Organisms, Templates, Pages. Separators belong to cards instead of the grid background, so empty grid tracks retain the page surface when search leaves a single result. Screenshot display and loading are suspended for this review stage; the capture utility and saved assets remain available for the later preview stage.

## Catalog screenshots

`yarn previews:capture --base http://127.0.0.1:5174` reads the tracked public manifest and captures each component story through the existing `captureElementImage` and `resolveContentArea` functions. It uses a local Chromium browser without adding a browser automation dependency. Large diagnostic surfaces and canvas/video/iframe content use a browser screenshot of the visible surface to avoid slow DOM cloning or empty media captures. A timeout recreates only the capture tab before continuing. The public manifest determines the publication boundary; private development-only stories are not captured into public assets.

PNG files live in `static/component-previews/<domain>/component/<joint>/<family>.png`. The generated `index.json` maps entity IDs to image URLs with content hashes. The saved-image pipeline uses lazy-loaded images without mounting story iframes for every tile; index loading and PNG display are suspended during icon review. The catalog initially renders 60 cards, appending more near the viewport or through the Show more button; Found always counts every matching entry, including cards not yet mounted.

Existing images are skipped. Pass an entity or domain prefix to capture a subset, `--limit N` for a first batch, or `--force` to refresh matching images after component changes. `--list` prints the selected stories without starting a browser. `--chrome` selects a Chromium executable; `--debug-port` can reuse an explicitly selected local debugging browser in a separate tab, leaving its other tabs open. Screenshots are staged in `.tmp/component-previews-staging` and published after capture, preventing Vite image updates from reloading stories during the batch. A rerun reuses completed staged images after an interruption. Failed stories are reported and retain the icon fallback.

## Viewport

`device-viewport` has three device presets with several widths each: **mobile** 320–430px (default 375), **tablet** 600–1024px (default 768), **desktop** 1280–2560px (default 1440). Each device remembers its last width. The iframe receives the exact selected width, so CSS media queries, viewport units, fixed positioning and `window.innerWidth` use it; wide viewports scale visually to fit the canvas while keeping their actual CSS width.

Fullscreen is a separate toggle and preserves the selected width. It hides the taxonomy rail, breadcrumbs/search/file tabs and the story panel, which becomes a drawer behind a tab on the right edge (kept mounted, so control values survive). The persistent menu and viewport buttons stay available. Escape exits fullscreen, including when focus is inside the preview frame.

## Hints and icons

`molecule/workspace-hints` supplies immediate hover and keyboard-focus hints throughout the workspace and in the preview route. It converts native `title` attributes into styled hints and also consumes `data-hint` and button `aria-label` text. Hints stay within the viewport, render above menu layers, and close on click, Escape, scrolling or blur. File tabs provide descriptive hints and source paths. The domain rail has a full-height divider matching the module rail.

SVG `title` elements inside controls and decorative icons are suppressed, including icons loaded asynchronously, so they cannot add a second native tooltip over the styled hint. Standalone accessible illustrations retain their titles. The `design-token` domain uses its own geometric token icon from the SVG registry.

Settings includes independent module, domain, cluster, joint and search icon sizes (12–32px, default 16px), applied immediately to the taxonomy sidebar and the search row. The search row (breadcrumbs, search, copy path) has the height and bottom divider of the cluster toolbar next to it, so the two rows meet flush; it grows to the larger of the cluster and search sizes. Likewise the file-tab row matches the joint toolbar (joint icon size); its tabs stay on one line and scroll horizontally. Rail widths and button sizes grow with their icons. On desktop, the sidebar's right boundary follows the combined rail widths and the wider cluster/joint row, without horizontal scrolling inside those rows. Entity names do not affect the sidebar width. On narrow screens, cluster and joint buttons wrap within the available width. Values persist in browser storage (`stylist-domain-icon-sizes`); Reset icon sizes restores all five defaults.

## Diagnostics and manifests

There is no diagnostics screen; each check is a story opened in the explorer.

- `organism/story-runner` — imports and mounts every `*.story.{svelte,ts}` except its own to catch runtime errors, with import/mount timings.
- `data/json/domain-files/index.json` — file/component counts and cluster balance per domain, consumed by the stories of `organism/domain-cluster-balance`, `organism/domain-file-domain-grid` and of the `chart` organisms `legend-bar-diagram` (files per domain) and `legend-band-diagram` (component composition per domain).
- `data/json/domain-component-import-diagnostics/index.json` — components whose `index.svelte` does not import their `Recipe<Name>`, consumed by the story of `organism/domain-component-import-diagnostics`.

`data/json/domain-page-manifest/index.json` is the page manifest consumed by the app route. Each manifest also has an `index.full.json` variant. These manifests are generated data; global regeneration is human-only (`yarn stylist:manifest` from the site root).

The page manifest contains only the tree, with dictionaries at every level: domain/cluster/joint/family maps directly to a PRESET_FILE string key, and canonical `index.svg` entries are encoded as `"INDEX_SVG"` from `const/preset/file`. Every family stores one preset string covering its complete file composition. ARRAY_FILE is the filename catalog, parsed together with PRESET_FILE by a single Python parser. The explorer reconstructs all paths and files through `normalizeDomainTree`, `resolveTreeFamilies`, `resolveFilePreset` and `expandComponentTree`. `resolveComponentDescriptor` derives the API projection on demand, checking actual entries in the tree; no descriptors section is serialized. `countDomainStories` computes the landing statistic from presets. See [file catalog and compact manifest](../../../../../../.docs/stylist-svelte/component-manifest-presets.md) for the encoding contract and measurements.

## Landing copy

- **Hero** (`stylist-hero`): presents Stylist Svelte as a domain-shaped workspace and shows the domain and story counts.
- **CTA buttons**: both Explore Components and Interactive Playground open the component browser.
- **Why Stylist?**: Atomic Design architecture, Readable navigation, Story-first review, Domain diagnostics.
- **Inside the methodology** (`samo-methodology`): SAMO chapters, with a link to the How it works guide.
- **Our Mission**: make the component library readable before it becomes gigantic; Open Domain Workspace and Browse Components open the component browser.

## Notes

- Component stories live next to their component source as `index.story.ts` (plus an optional `index.story.svelte` render).
- Generated barrel `index.ts` files are maintained by the indexation workflow.
- Previously archived sources live with their physical module owners: the node-editor demo in architecture/workspace, domain-builder and its layout in sandbox/token, domain-backlog in management/portfolio, domain-ai-agent in sandbox/domain, transcriber in information/audio, AI components in customer/ai, development tools in sandbox/development, and API managers in sandbox/server. Archived screens and API handlers are not automatically wired into this app.

## Compact component inventory

`data/json/domain-component-manifest/index.json` lists all public component families as
`{ tree: { domain: { component: { joint: [family] } } } }`. The adjacent ignored
`index.full.json` also includes private modules. Both are generated by
`DomainManifestBuilder` / `ManifestStore` in `stylist-svelte-tools`, alongside
`domain-page-manifest`. Domains and names are sorted, joints follow atomic design,
and empty branches are omitted. This smaller projection omits file presets and
non-component clusters; source discovery continues to use `domain-page-manifest`.
The public/full Vite selection and source-mirror filtering also cover this inventory.
