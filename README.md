# DK v3 Prototype

Static prototype bundle for the DK v3 home/map flow and the connected general pages.

## Included app areas

- `dk-v3`: Home and map prototype
- `dk-etc-pages`: General pages and shared design-system page

## Local entry points

- Root redirect: `./index.html`
- Home screen: `./dk-v3/index.html?entry=landed`
- Map screen: `./dk-v3/map.html`

## Vercel deployment

Deploy from the repository root. The root `index.html` redirects to the home prototype, and the general pages remain reachable through their existing relative links.
