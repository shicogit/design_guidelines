# Deep links — every route, tab & sub-tab

Tabs and sub-tabs are now URL-addressable. Open any link to land directly on that section + sub-tab.

- **Page** → `?path=/docs/<id>--docs`
- **Section tab** (Illustrations only) → `&sec=<Mel|Product|Marketing|Devs>`
- **Sub-tab** → `&sub=<guidelines|resources>`

Base host below is the local server (`http://localhost:6006`). For the published Storybook, swap the host — the paths are identical.

## Top level
- Overview — `http://localhost:6006/?path=/docs/overview--docs`
- Brand Elements (overview) — `http://localhost:6006/?path=/docs/brand-elements-overview--docs`
- Visual Assets (overview) — `http://localhost:6006/?path=/docs/brand-elements-visual-assets-overview--docs`

## Logo  (`brand-elements-logo--docs`)
- Guidelines — `…/?path=/docs/brand-elements-logo--docs&sub=guidelines`
- Resources — `…/?path=/docs/brand-elements-logo--docs&sub=resources`

## Color  (`brand-elements-color--docs`)  · _Resources = placeholder_
- Guidelines — `…/?path=/docs/brand-elements-color--docs&sub=guidelines`
- Resources — `…/?path=/docs/brand-elements-color--docs&sub=resources`

## Typography  (`brand-elements-typography--docs`)  · _Resources = placeholder_
- Guidelines — `…/?path=/docs/brand-elements-typography--docs&sub=guidelines`
- Resources — `…/?path=/docs/brand-elements-typography--docs&sub=resources`

## Illustrations  (`brand-elements-visual-assets-illustrations--docs`)
- **Mel** — `…/?path=/docs/brand-elements-visual-assets-illustrations--docs&sec=Mel`
- **Product → Guidelines** (kits + library) — `…&sec=Product&sub=guidelines`
- **Product → Resources** (downloads) — `…&sec=Product&sub=resources`
- **Marketing** — `…&sec=Marketing`
- **Devs** — `…&sec=Devs`

Full Product links:
- `http://localhost:6006/?path=/docs/brand-elements-visual-assets-illustrations--docs&sec=Product&sub=guidelines`
- `http://localhost:6006/?path=/docs/brand-elements-visual-assets-illustrations--docs&sec=Product&sub=resources`

## Icons  (`brand-elements-visual-assets-icons--docs`)  · _Resources = placeholder_
- Guidelines (gallery + downloads) — `…/?path=/docs/brand-elements-visual-assets-icons--docs&sub=guidelines`
- Resources — `…/?path=/docs/brand-elements-visual-assets-icons--docs&sub=resources`

## Simplified UI  (`brand-elements-visual-assets-simplified-ui--docs`)  · _placeholder_
- Guidelines — `…/?path=/docs/brand-elements-visual-assets-simplified-ui--docs&sub=guidelines`
- Resources — `…/?path=/docs/brand-elements-visual-assets-simplified-ui--docs&sub=resources`

## Imagery  (`brand-elements-visual-assets-imagery--docs`)  · _Resources = placeholder_
- Guidelines — `…/?path=/docs/brand-elements-visual-assets-imagery--docs&sub=guidelines`
- Resources — `…/?path=/docs/brand-elements-visual-assets-imagery--docs&sub=resources`

## Agent Mel  (`brand-elements-visual-assets-agent-mel--docs`)  · _placeholder_
- Guidelines — `…/?path=/docs/brand-elements-visual-assets-agent-mel--docs&sub=guidelines`
- Resources — `…/?path=/docs/brand-elements-visual-assets-agent-mel--docs&sub=resources`
