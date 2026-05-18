---
version: alpha
name: TrucoPro · Mesa
description: >
  Sistema de diseño para TrucoPro — contador de truco, ranking y
  historial de un grupo de jugadores. Fondo oscuro tipo mesa, con
  paneles de papel cálido donde se dibujan los palitos a mano. Acentos
  morado (Nosotros) y esmeralda (Ellos). Voz rioplatense, sutil.

colors:
  # ── Surfaces (dark "mesa")
  background: "#0D100E"        # casi-negro con verde mínimo, el felt apagado
  surface: "#161B18"           # cards, paneles, inputs
  surface-elevated: "#1D2420"  # botones secundarios, hover sutil
  border: "#2A3128"            # 1px divisorios

  # ── Surfaces (warm "paper")
  paper: "#F4ECDB"             # hoja de cuaderno, donde se dibujan los palitos
  paper-shade: "#E8DFC7"       # gradiente bajo del papel
  paper-ink: "#1A1410"         # tinta negra sobre papel (números de carta)
  paper-line: "#C2A878"        # renglones del cuaderno

  # ── Text
  text: "#F0EDE4"              # texto principal sobre dark
  text-dim: "#8F8A7F"          # secundario, captions
  text-mute: "#5D584F"         # labels, metadatos

  # ── Brand accents
  us: "#8B5CF6"                # Nosotros — morado vibrante
  us-deep: "#6D28D9"           # estados activos, sombras
  them: "#34D399"              # Ellos — esmeralda
  them-deep: "#047857"         # estados activos, sombras

  # ── Semantic
  danger: "#EF4444"            # perdidas, salir, errores
  warning: "#E0A83A"           # racha, alertas
  success: "{colors.them}"     # alias — un ganador es un Ellos en verde

  # ── On-color (texto sobre fills)
  on-us: "#FFFFFF"
  on-them: "#FFFFFF"
  on-paper: "{colors.paper-ink}"
  on-danger: "#FFFFFF"

typography:
  # ── Display — números grandes, marcador
  display-xl:
    fontFamily: Space Grotesk
    fontSize: 40px
    fontWeight: 900
    lineHeight: 1
    letterSpacing: "-0.04em"
  display-lg:
    fontFamily: Space Grotesk
    fontSize: 30px
    fontWeight: 900
    lineHeight: 1
    letterSpacing: "-0.04em"
  display-md:
    fontFamily: Space Grotesk
    fontSize: 22px
    fontWeight: 900
    lineHeight: 1
    letterSpacing: "-0.04em"

  # ── Serif — voz de "mesa", títulos y nombres
  heading-lg:
    fontFamily: Crimson Pro
    fontSize: 30px
    fontWeight: 700
    lineHeight: 1.1
  heading-md:
    fontFamily: Crimson Pro
    fontSize: 22px
    fontWeight: 700
    lineHeight: 1.1
  heading-sm:
    fontFamily: Crimson Pro
    fontSize: 17px
    fontWeight: 700
    fontStyle: italic
  caption-italic:
    fontFamily: Crimson Pro
    fontSize: 13px
    fontWeight: 400
    fontStyle: italic
    lineHeight: 1.4

  # ── Sans — UI / cuerpo
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.4
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.4
  body-strong:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 700
    lineHeight: 1.4
  label-xs:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: 600
    letterSpacing: "0.08em"
  label-overline:
    fontFamily: Inter
    fontSize: 10px
    fontWeight: 600
    letterSpacing: "0.12em"

spacing:
  xs: 4px
  sm: 6px
  md: 10px
  lg: 14px
  xl: 20px
  2xl: 28px
  3xl: 56px        # safe area top en frame iOS

rounded:
  xs: 5px          # cartas pequeñas, badges
  sm: 9px          # chips, inputs internos
  md: 12px         # inputs, botones pequeños
  lg: 14px         # botones primarios, cards de partida
  xl: 16px         # paneles principales
  2xl: 22px        # hero cards
  full: 9999px     # avatares, pills

elevation:
  none: "none"
  card: "0 6px 14px -8px rgba(0,0,0,0.4)"
  paper: "inset 0 2px 8px rgba(0,0,0,0.15), 0 6px 14px -8px rgba(0,0,0,0.4)"
  raised: "0 8px 16px -8px rgba(0,0,0,0.5)"
  hero: "0 12px 24px -10px rgba(0,0,0,0.5)"
  primary-glow: "0 8px 20px -10px {colors.us}"

components:
  # ── Botones
  button-primary:
    backgroundColor: "{colors.us}"
    textColor: "{colors.on-us}"
    typography: "{typography.body-strong}"
    rounded: "{rounded.lg}"
    padding: "16px 20px"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    typography: "{typography.body-strong}"
    rounded: "{rounded.lg}"
    padding: "14px 18px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.text}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: "12px 14px"
  button-danger:
    backgroundColor: "transparent"
    textColor: "{colors.danger}"
    typography: "{typography.caption-italic}"
    rounded: "{rounded.md}"
    padding: "12px 14px"

  # ── Counter — el contador del partido
  counter-step-plus-us:
    backgroundColor: "{colors.us}"
    textColor: "{colors.on-us}"
    rounded: "{rounded.md}"
    size: 42px
  counter-step-plus-them:
    backgroundColor: "{colors.them}"
    textColor: "{colors.on-them}"
    rounded: "{rounded.md}"
    size: 42px
  counter-step-minus-us:
    backgroundColor: "transparent"
    textColor: "{colors.us}"
    rounded: "{rounded.md}"
    size: 42px
  counter-step-minus-them:
    backgroundColor: "transparent"
    textColor: "{colors.them}"
    rounded: "{rounded.md}"
    size: 42px
  counter-exit:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-dim}"
    rounded: "{rounded.full}"
    size: 44px

  # ── Paneles
  panel:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.xl}"
    padding: 14px
  panel-paper:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.paper-ink}"
    rounded: "{rounded.lg}"
    padding: "12px 8px"
  panel-hero:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.paper-ink}"
    rounded: "{rounded.2xl}"
    padding: "18px"

  # ── Inputs
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: "12px 16px"
  input-focus:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.md}"
    padding: "12px 16px"

  # ── Chips de jugador
  chip-us:
    backgroundColor: "{colors.us}"
    textColor: "{colors.on-us}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.sm}"
    padding: "6px 10px"
  chip-them:
    backgroundColor: "{colors.them}"
    textColor: "{colors.on-them}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.sm}"
    padding: "6px 10px"
  chip-neutral:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.sm}"
    padding: "6px 11px"

  # ── Tabla / leaderboard row
  table-row:
    backgroundColor: "transparent"
    textColor: "{colors.text}"
    typography: "{typography.body-md}"
    padding: "11px 14px"
  table-header:
    backgroundColor: "transparent"
    textColor: "{colors.text-mute}"
    typography: "{typography.caption-italic}"
    padding: "10px 14px"

  # ── Match-card en historial
  match-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.lg}"
    padding: "12px 14px"
  match-card-icon-won:
    backgroundColor: "{colors.paper-ink}"
    textColor: "{colors.them}"
    rounded: "{rounded.xs}"
    size: 32px
  match-card-icon-lost:
    backgroundColor: "{colors.paper-ink}"
    textColor: "{colors.danger}"
    rounded: "{rounded.xs}"
    size: 32px
---

## Overview

**TrucoPro · Mesa** es el sistema de diseño para una app que cuenta partidas de
truco uruguayo entre un grupo cerrado. La metáfora central es la **mesa**: una
superficie oscura tipo "felt" donde aparecen **hojas de papel cuaderno** sobre
las que se dibujan los palitos a mano alzada. La voz es rioplatense, charlada,
casi de café — pero la información dura (números, ratings) se renderiza con
tipografía técnica y precisa.

**Tres mundos visuales conviven**, y la regla es cuándo usar cada uno:

| Mundo | Cuándo | Tipografía | Fondo |
| --- | --- | --- | --- |
| **Mesa** (dark) | Toda la app, default | Inter + Crimson Pro | `background` / `surface` |
| **Papel** (cream) | Donde haya palitos o un "ítem destacado" (carta del jugador #1, perfil hero) | Crimson Pro + Space Grotesk para números | `paper` |
| **Datos** (mono-ish display) | Números grandes: marcador, rating, scores de partidas | Space Grotesk display | sobre cualquiera |

**No hay modo claro.** La app es siempre oscura. El papel es un *componente*
dentro de la oscuridad, no un tema alternativo.

---

## Colors

La paleta combina **dark surfaces** (la mesa), **warm cream surfaces** (el
papel) y **dos acentos vibrantes** que identifican a los dos equipos.

### Surfaces — dark

- **`background` (#0D100E):** El felt de la mesa. Casi-negro con un toque
  verde imperceptible. Nunca usar negro puro (#000) porque se ve plástico.
- **`surface` (#161B18):** Cards, paneles, inputs. Es el "papel
  microclima" sobre la mesa — se distingue del fondo pero no compite.
- **`surface-elevated` (#1D2420):** Hover de botones secundarios, fondos
  internos de paneles anidados. Un escalón arriba de `surface`.
- **`border` (#2A3128):** Único color de borde sobre dark. 1px, nunca
  más grueso.

### Surfaces — paper

- **`paper` (#F4ECDB):** Cuaderno cálido. Es donde van los palitos y la
  carta del jugador #1. No usar para superficies grandes — el papel es un
  *recorte*, no un fondo.
- **`paper-shade` (#E8DFC7):** Solo como segundo stop de un gradiente
  vertical sobre `paper` (simula sombra del cuaderno doblado).
- **`paper-ink` (#1A1410):** La tinta negra de las cartas. Texto sobre
  `paper`, contrastes WCAG AA largos.
- **`paper-line` (#C2A878):** Renglones del cuaderno. Renderizar como
  `linear-gradient(0deg, paper-line@22% 1px, transparent 1px)` a `18px`
  de separación. Muy sutil — no debe distraer.

### Text — sobre dark

- **`text` (#F0EDE4):** Default. Tiene un calor mínimo (no es blanco
  azulado) para combinar con el papel.
- **`text-dim` (#8F8A7F):** Captions, subtítulos, "vs ellos".
- **`text-mute` (#5D584F):** Labels, metadatos, números de tabla
  inactivos. No usar para nada accionable.

### Brand accents

- **`us` (#8B5CF6) — Nosotros (Morado):** El equipo del usuario. Se usa
  para CTAs primarios, links, el resaltado de la fila propia en tablas.
- **`us-deep` (#6D28D9):** Sombras 3D de botones tipo "tarjeta apilada",
  estados active/pressed.
- **`them` (#34D399) — Ellos (Esmeralda):** El equipo rival. Mismo peso
  visual que `us`, nunca subordinado — son adversarios, no jerarquías.
- **`them-deep` (#047857):** Equivalente a `us-deep`.

> **Regla central:** Nunca usar `us` y `them` decorativamente. Son
> *identidad de equipo*. Si necesitás un acento neutro, usá `warning` o
> `text`.

### Semantic

- **`danger` (#EF4444):** Solo para acciones destructivas (salir,
  borrar) y partidas perdidas. Rojo cálido — no naranja, no carmesí.
- **`warning` (#E0A83A):** Rachas (`🔥 4`), avisos suaves. Cuidado:
  contrasta poco con `paper`; no usar sobre `paper` sin overlay.
- **`success`:** Alias de `them`. Una victoria es un evento "verde" y
  coincide con el color del equipo Ellos. Esto es intencional — refuerza
  la asociación verde = ganar.

---

## Typography

Tres familias con roles bien separados:

### Inter — UI / cuerpo

Sistema operativo de la interfaz. Botones, labels, párrafos cortos,
metadatos. **Pesos**: 500 (body), 600 (label), 700 (énfasis), 800/900
(no usar — para eso está Space Grotesk).

### Crimson Pro — voz "mesa"

Serif con itálica expresiva. Solo para textos que evoquen *charla*:
títulos de sección con voz coloquial ("armar mesa", "se juega a", "el
de arriba"), nombre del jugador en la carta del perfil, headers de
día en el historial. **No usar para datos** — su itálica es estética,
no informativa.

- Headings principales (perfil, "el jugador"): `heading-lg` 30px.
- Headers de pantalla: `heading-md` 22px.
- Section labels coloquiales: `heading-sm` 17px italic.
- Captions decorativas ("vs ellos", "se juega a"): `caption-italic` 13px italic.

### Space Grotesk — datos

Display tight, casi geométrico. Reservado para **números grandes**:
marcador del contador, rating del perfil, scores en el historial,
posiciones del ranking. Siempre `fontWeight: 900` y
`letterSpacing: -0.04em` para que se "compacte" como un display digital.

- Marcador del contador (por equipo): `display-xl` 40px.
- Rating principal en perfil card: `display-lg` 30px (o 40px si es hero).
- Scores en historial: `display-md` 22px.

### Reglas de mezcla

- Nunca mezclar Crimson Pro y Space Grotesk **en la misma línea** salvo
  excepción: la carta-perfil tiene "el jugador" (Crimson italic) arriba
  del nombre (Crimson bold) arriba del rating (Space Grotesk). Eso
  funciona porque están en tres líneas distintas y la jerarquía es
  evidente.
- Inter es el "pegamento". Cualquier label, botón o texto pequeño usa
  Inter por default.

---

## Layout

Mobile-first, ancho objetivo **390px** (frame iOS). Toda la app vive
dentro de un viewport de teléfono.

### Spacing scale

| Token | Valor | Uso |
| --- | --- | --- |
| `xs` | 4px | Gaps internos en chips, entre icono y label |
| `sm` | 6px | Gap entre chips, padding interno de botones de step |
| `md` | 10px | Gap entre cards en una lista, padding lateral mínimo |
| `lg` | 14px | Padding default de paneles, gap entre secciones |
| `xl` | 20px | Padding horizontal de pantalla |
| `2xl` | 28px | Padding inferior del frame (home indicator), separación de secciones grandes |
| `3xl` | 56px | Padding superior del frame (safe area + notch) |

### Estructura típica de pantalla

```
PhoneFrame
└── padding-top: 56px (safe area)
    ├── Header (logo izq, título centro, menú der)  → padding 56px 20px 12px
    └── Main content                                → padding 0 20px 18px
        ├── gap entre paneles: 12-14px
        └── padding interno de panel: 14px
```

### Counter screen — excepción

El contador del partido reduce padding lateral (14px → 10px → 8px)
porque los paneles de palitos deben ser lo más grandes posible. Es la
única pantalla donde el margin horizontal se sacrifica.

---

## Elevation & Depth

Cuatro niveles, no más.

- **`none`** — Fondo, elementos flat. Default.
- **`card`** — `0 6px 14px -8px rgba(0,0,0,0.4)`. Cards de partida en
  historial, paneles secundarios. Sombra suave, dirección suave.
- **`paper`** — `inset 0 2px 8px rgba(0,0,0,0.15), 0 6px 14px -8px rgba(0,0,0,0.4)`.
  Exclusiva del componente Paper Panel. La sombra **inset** simula el
  cuaderno hundido en la mesa; la sombra externa simula su elevación.
- **`raised`** — `0 8px 16px -8px rgba(0,0,0,0.5)`. Tarjetas-card del
  jugador (con renderizado de carta española). Drawer sidebar.
- **`hero`** — `0 12px 24px -10px rgba(0,0,0,0.5)`. Carta-perfil del
  jugador, solo una vez por pantalla.

**Regla:** Si tenés que decidir entre dos niveles, elegí el menor.
La app no es brillante; las sombras son acentos, no protagonistas.

---

## Shapes

Las esquinas siguen una escala progresiva. Decisión por **tamaño del
elemento**, no por "importancia".

| Token | Valor | Uso |
| --- | --- | --- |
| `xs` | 5px | Cartas pequeñas (32×40), badges sobre paper, dividers redondeados |
| `sm` | 9px | Chips de jugador, inputs internos, items de pool |
| `md` | 12px | Inputs de form, botones secundarios pequeños, badges grandes |
| `lg` | 14px | Botones primarios, paneles de paper, match-cards |
| `xl` | 16px | Paneles principales (equipos, ranking, setup) |
| `2xl` | 22px | Hero cards — perfil-card, paneles destacados |
| `full` | 9999px | Avatares (FAB-style), pills, botón close redondo |

### Cartas españolas decorativas

La baraja del truco es **española** — cuatro palos: **espadas, bastos, oros,
copas**. Nunca usar palos ingleses (♠ ♥ ♦ ♣) — visualmente y semánticamente
es incorrecto.

Cuando se renderiza la metáfora de carta (login, sidebar avatar,
profile hero, top-1 del ranking), las proporciones son:

- Aspect ratio aproximado: **3:4** (38×50px chico, 50×64 medio).
- Border-radius: `xs` (5px) — siempre las esquinas mismo radio.
- Padding interno: 4px en chicas, 14px en grandes.
- Composición: número arriba-izq + **pinta española** centro + número rotado abajo-der.

#### Mapeo de palos a identidad

| Palo | Glifo | Uso |
| --- | --- | --- |
| **Espada** | Espada recta con guarda y pomo | Nosotros (`us`), el jugador propio, el #1 del ranking. Es la pinta más alta del truco (el "ancho de espada") — se asocia con el equipo del usuario. |
| **Basto** | Maza/cachiporra de madera | Ellos (`them`), el oponente. Pinta secundaria fuerte en truco (segundo del rango). |
| **Oro** | Moneda circular con centro hueco | Acentos decorativos (login flotante, modal de ganador). Nunca como identidad de equipo. |
| **Copa** | Cáliz con base y tapa | Acentos decorativos (login flotante, separadores ornamentales). Nunca como identidad de equipo. |

#### Reglas de render

- **Tamaños válidos**: 10, 12, 14, 20, 22, 50px. Por debajo de 10px no se
  leen; por encima de 50px conviene usar una ilustración más detallada.
- **Color**: hereda del contexto. Sobre `paper`, usar `paper-ink`. Sobre
  dark, usar el color del equipo (`us` / `them`) o `text`.
- **Trazo único, fill sólido**. No usar outlines + fill — pierde
  legibilidad. La pinta es una silueta, no una ilustración detallada.
- **Nunca usar emoji** (🗡️ 🏆 etc) — no existe para algunas pintas y
  rompe la consistencia de color/peso.

#### Cartas iconográficas comunes

- **1 de espada** ("ancho de espada"): número `1` arriba, espada
  vertical centrada, número `1` rotado 180° abajo. Es **la carta más
  alta del truco** — apropiada para el #1 del ranking y la
  carta-perfil del usuario.
- **7 de oro** ("siete bravo"): número `7` arriba, siete monedas
  distribuidas, `7` rotado abajo. Es la cuarta más alta — apropiada
  como ornamento de Login o estados de "racha activa".
- **1 de basto**: número `1`, basto vertical, `1` rotado. La segunda
  más alta — apropiada para el oponente destacado o el "top 2".

---

## Components

### Paper Panel (`panel-paper`) — el componente firma

Es **el** componente que define el sistema. Un rectángulo `paper` con
renglones, sombra `paper`, y palitos dibujados a mano dentro.

```
background: linear-gradient(180deg, #F4ECDB 0%, #E8DFC7 100%)
border-radius: 14px
padding: 12px 8px
box-shadow: inset 0 2px 8px rgba(0,0,0,0.15), 0 6px 14px -8px rgba(0,0,0,0.4)
position: relative
overflow: hidden

// Líneas del cuaderno
background-image: linear-gradient(0deg, rgba(194,168,120,0.13) 1px, transparent 1px)
background-size: 100% 18px
```

### Palito (Tally Mark) — el átomo del contador

Cada palito representa **un punto**. Cinco palitos forman una **casita
cuadrada** (cuatro lados + diagonal del 5to), no cinco rayas paralelas.
Esta es la forma tradicional uruguaya y es **no negociable**.

- **SVG `viewBox` 100×100**, render entre 40px y 60px.
- **`stroke`**: el color del equipo (`us` o `them`).
- **`stroke-width`**: 7.
- **`stroke-linecap`**: round.
- **`stroke-linejoin`**: round.
- **`opacity`**: 0.92 (para que se sienta "marcador", no vector).
- **Trazos**: usar `<path>` con curva Bezier sutil (`C` con desplazamientos
  ±2px) en vez de `<line>` recta — da el wobble a mano alzada.

Orden de dibujo (un palito acumula puntos 1→5):

```
1 → lado izquierdo  (vertical)
2 → lado superior   (horizontal)
3 → lado derecho    (vertical)
4 → lado inferior   (horizontal)
5 → diagonal de esquina inferior-izquierda a superior-derecha
```

Layout dentro del Paper Panel:

- Stack vertical, gap 6px entre palitos.
- Si la pantalla es "se juega a 40", el panel se parte por la mitad
  visualmente: arriba van los palitos de **malas** (primeros 20), abajo
  los de **buenas** (segundos 20). Una línea horizontal sutil
  (`paper-line` al 50% de opacidad) los separa solo si ya hay puntos en
  buenas.

### Counter Controls (paneles inferiores del contador)

Dos paneles simétricos abajo de la pantalla, separados por un botón
**exit** redondo (44×44, `rounded.full`, `surface`).

Cada panel tiene 3 hijos:

```
[ − ]  [ score num ]  [ + ]
```

- **`−`** (button-step-minus-{equipo}): 42×42, `surface` transparent,
  borde 1px del color del equipo @40%, ícono color del equipo.
- **score num**: 22px Space Grotesk 900, color del equipo, centrado.
- **`+`** (button-step-plus-{equipo}): 42×42, fill del color del equipo,
  ícono blanco. Sin sombra extra — el color es suficiente.

Hit-target mínimo de cada botón: **42px**. No bajar de ahí. El panel
contenedor agrega 5px de padding, dando 52px de área tappeable total.

### Player Chips

- **`chip-us` / `chip-them`**: 8px padding vertical, color de equipo
  como fill, texto blanco, capitalize.
- **`chip-neutral`**: pool de jugadores disponibles. Fondo `surface`,
  borde `border`, texto `text`.
- **Add-chip** (dashed): `1px dashed {color}60`, color del equipo
  fundido al 60%, fondo transparente, texto italic ("+ sumar"). Marca
  que es una acción, no un jugador.

### Match Card (historial)

```
┌──────────────────────────────────────┐
│  [G]   Bauer · Fede · Gasti      35  │
│  ♠️     vs Pepe · Goncho · Oti    —28 │
│                                a 40  │
└──────────────────────────────────────┘
```

- Ícono izquierdo (32×40): mini-carta con letra G/P (ganaron/perdieron)
  arriba y pinta abajo. Fondo `paper-ink`, color del estado (`them` o
  `danger`).
- Centro: nombres del equipo propio en `body-strong`, oponente en
  `caption-italic` con prefijo "vs".
- Derecha: marcador en Space Grotesk 16px, color del ganador
  (`them`/`danger`), guardia neutral (`text-dim`/`text-mute`) para el
  perdedor. Abajo, "a {max}" en `caption-italic` 9px.

### Leaderboard Row

Grid columns: `28px 1fr 32px 32px 60px`.

```
#   Jugador     W    L    Rating
```

- **#**: `text-mute` weight 700 Crimson Pro.
- **Jugador**: `text` body, capitalize.
- **W**: `them` 700 Space Grotesk.
- **L**: `danger` 700 Space Grotesk.
- **Rating**: `text` 800 Space Grotesk, alineado derecha.

Fila del usuario actual: añadir `background: {colors.us}0D` (5%
opacidad). No bold extra — la sutil tinta morada basta.

### Top-1 Spotlight (ranking)

El #1 del ranking se renderiza como una **carta española real**
estirada horizontalmente — específicamente, un **1 de espada**:

```
┌─────────────────────────────────────┐
│ ┌────┐                              │
│ │ 1  │  el de arriba                │
│ │ ♠️ │  Bauer            1670       │
│ │  1 │  16W · 8L         GLICKO     │
│ └────┘                              │
└─────────────────────────────────────┘
```

- Fondo: gradiente `paper → paper-shade` 135°.
- Mini-carta interna: 50×64, fondo `paper-ink`, pinta y número
  `paper`.
- Texto sobre paper: italic Crimson Pro para "el de arriba".
- Rating: Space Grotesk 30px 900, color `paper-ink`.

Esta tratamiento se reserva para **el primero del ranking solamente** y
para el **header del perfil propio**. Si aparece tres veces en una
pantalla, perdió su impacto.

### Sidebar Drawer

- Ancho: **290px**.
- Slide desde la derecha (`right: 0`).
- Backdrop: `rgba(13,16,14,0.7)` + `backdrop-filter: blur(8px)`.
- Padding interno: 60px top (safe area) · 20px lados · 28px bottom.
- Item activo: `background: {us}22` + borde `{us}40` + texto `us` 700.
- Item inactivo: transparente + texto `text` 500.
- Botón "levantarse de la mesa" (logout): borde `danger@30`, italic
  Crimson Pro, color `danger`, **siempre al fondo**.

### Form Inputs

- Estado default: `surface` bg, `border` 1px.
- Estado focus: borde `{us}80` (50% opacity), bg `surface`.
- Label flotante arriba en `caption-italic` 11px.
- Password: letter-spacing 3px cuando contiene `•`.
- Altura mínima: 48px.

---

## Do's and Don'ts

### Do

- **Usá el papel como recorte, no como tema.** Una hoja sobre la mesa,
  no un fondo claro.
- **Tratá `us` y `them` como identidades, no jerarquía.** Si el morado
  aparece más, es porque hay más Nosotros visible — nunca porque sea
  "el color principal".
- **Confiá en Inter para el 80% del texto.** Crimson Pro y Space Grotesk
  son acentos.
- **Dibujá los palitos como casita cuadrada.** Cuatro lados + diagonal.
  Siempre.
- **Wobble en los trazos.** Bezier sutiles, no líneas rectas. La app es
  digital pero el palito es analógico.
- **Voz rioplatense en headers y CTAs.** "Armar mesa", "levantarse",
  "el de arriba", "se juega a". Mantenelo en lugares puntuales — no en
  el cuerpo.

### Don't

- **No uses negro puro (#000).** Siempre `background` (#0D100E) o
  `paper-ink` (#1A1410).
- **No pongas palitos como rayas paralelas.** Es un error técnico — el
  truco uruguayo se cuenta en casitas.
- **No mezcles `us` con `them` en un gradiente.** Son adversarios. Un
  gradiente los une, y eso rompe la metáfora.
- **No metas emoji en la UI.** Las pintas españolas son SVG. Los iconos
  son SVG. Emoji rompe la consistencia de peso y color.
- **No uses palos ingleses (♠ ♥ ♦ ♣).** Es un juego de baraja española.
  Espada/basto/oro/copa, siempre. Confundirlos rompe la metáfora central
  del sistema.
- **No agregues íconos para "decorar".** Si un ícono no comunica una
  acción o un estado, fuera.
- **No uses Crimson Pro para datos.** Su itálica le quita precisión a
  los números. Para números, Space Grotesk siempre.
- **No alivianes las sombras a 0.** Siempre al menos `card`. El sistema
  necesita profundidad para que el papel se sienta encima.
- **No bajés de 42px en hit-targets**, especialmente en el contador. Se
  juega con la mano sucia de pancho.
