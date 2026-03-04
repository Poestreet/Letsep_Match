/**
 * Button Component Generator — Figma Console Script
 *
 * ── How to run ────────────────────────────────────────────────────────────────
 * 1. Open Figma desktop
 * 2. Install the "Scripter" plugin  (or any plugin that exposes the console)
 * 3. Paste this entire file and press Run
 *
 * ── What it creates ───────────────────────────────────────────────────────────
 * A "Button" ComponentSet with 72 variants (3 × 3 × 4 × 2):
 *
 *   Type   │ Primary · Secondary · Ghost
 *   Size   │ SM · MD · LG
 *   State  │ Default · Hover · Focused · Disabled
 *   Radius │ Default · Full
 *
 * ── Token sources ─────────────────────────────────────────────────────────────
 * Colors  → Semantic.json  (background/*, foreground/*, border/*)
 * Spacing → tokens.css     (spacings/base-*, radius/*)
 * Fonts   → _Core.json     (Fonts/Font2 → "Inter")
 * ─────────────────────────────────────────────────────────────────────────────
 */

(async () => {

  // ── 1. Load fonts ────────────────────────────────────────────────────────
  await figma.loadFontAsync({ family: "Inter", style: "Medium" });


  // ── 2. Color palette (RGBA 0-1, from _Core.json resolved values) ─────────
  const C = {
    //  Black Ocean ─ brand / interactive
    bo20: { r: 0,      g: 0.6667, b: 1,      a: 1 },   // #00aaff  background/interactive
    bo40: { r: 0,      g: 0.4118, b: 0.6863, a: 1 },   // #0069af  background/interactive-hover
    bo50: { r: 0,      g: 0.3216, b: 0.5490, a: 1 },   // #00528c  background/interactive-active

    //  Carbon Fiber ─ neutrals
    cf10: { r: 0.9725, g: 0.9725, b: 0.9725, a: 1    }, // #f8f8f8  foreground/interactive
    cf20: { r: 0.8824, g: 0.8824, b: 0.8824, a: 1    }, // #e1e1e1  border/default · foreground/disabled
    cf30: { r: 0.7922, g: 0.7922, b: 0.7922, a: 1    }, // #cacaca  background/interactive-invert-active
    cf40: { r: 0.5255, g: 0.5255, b: 0.5255, a: 1    }, // #868686  background/interactive-disabled
    cf80: { r: 0.149,  g: 0.149,  b: 0.149,  a: 1    }, // #262626  foreground/interactive-invert · border/interactive-invert

    //  Transparent fills
    inv:  { r: 0.9725, g: 0.9725, b: 0.9725, a: 0.04 }, // background/interactive-invert (nearly-clear)
    none: { r: 0,      g: 0,      b: 0,      a: 0    }, // fully transparent

    //  Focus ring
    ring: { r: 0, g: 0.6667, b: 1, a: 1 },              // brand/primary  #00aaff
  };


  // ── 3. Size scale (spacing tokens) ───────────────────────────────────────
  //  h  = height           (px)
  //  px = horizontal pad   (spacings/base-3=12 · base-4=16 · base-5=20)
  //  gap= item spacing     (spacings/base-1=4  · base-1=4  · base-2=8 )
  //  fs = font size        (px)
  //  r  = default radius   (radius/md=4 · radius/md=4 · radius/lg=8)
  const SIZE = {
    SM: { h: 32, px: 12, gap: 4, fs: 13, r: 4 },
    MD: { h: 40, px: 16, gap: 6, fs: 14, r: 4 },
    LG: { h: 48, px: 20, gap: 8, fs: 16, r: 8 },
  };


  // ── 4. Visual token map per type × state ─────────────────────────────────
  //  bg   → background fill (null = no fill)
  //  fg   → label fill
  //  bd   → stroke color    (null = no stroke)
  //  ring → focus ring
  const TOKENS = {

    Primary: {
      //  Filled blue button  ─────────────────────────────────────────────────
      Default:  { bg: C.bo20, fg: C.cf10, bd: null,  ring: false },
      Hover:    { bg: C.bo40, fg: C.cf10, bd: null,  ring: false },
      Focused:  { bg: C.bo20, fg: C.cf10, bd: null,  ring: true  },
      Disabled: { bg: C.cf40, fg: C.cf20, bd: null,  ring: false },
    },

    Secondary: {
      //  Outlined button  ────────────────────────────────────────────────────
      Default:  { bg: C.inv,  fg: C.cf80, bd: C.cf80, ring: false },
      Hover:    { bg: C.cf20, fg: C.cf80, bd: C.cf80, ring: false },
      Focused:  { bg: C.inv,  fg: C.cf80, bd: C.cf80, ring: true  },
      Disabled: { bg: C.none, fg: C.cf40, bd: C.cf40, ring: false },
    },

    Ghost: {
      //  Borderless button  ──────────────────────────────────────────────────
      Default:  { bg: C.none, fg: C.cf80, bd: null, ring: false },
      Hover:    { bg: C.cf20, fg: C.cf80, bd: null, ring: false },
      Focused:  { bg: C.none, fg: C.cf80, bd: null, ring: true  },
      Disabled: { bg: C.none, fg: C.cf40, bd: null, ring: false },
    },

  };


  // ── 5. Helpers ───────────────────────────────────────────────────────────
  function toFill(c) {
    return {
      type: "SOLID",
      color: { r: c.r, g: c.g, b: c.b },
      opacity: c.a,
    };
  }

  function toStroke(c) {
    return {
      type: "SOLID",
      color: { r: c.r, g: c.g, b: c.b },
      opacity: c.a,
    };
  }

  // Focus ring: two stacked drop-shadows simulate  outline: 2px solid #00aaff; outline-offset: 2px
  const FOCUS_RING = [
    {
      // white gap  (2 px inside)
      type: "DROP_SHADOW",
      color: { r: 1, g: 1, b: 1, a: 1 },
      offset: { x: 0, y: 0 },
      radius: 0, spread: 2,
      visible: true, blendMode: "NORMAL",
    },
    {
      // brand-primary ring  (2 px outside the gap)
      type: "DROP_SHADOW",
      color: { r: C.ring.r, g: C.ring.g, b: C.ring.b, a: 1 },
      offset: { x: 0, y: 0 },
      radius: 0, spread: 4,
      visible: true, blendMode: "NORMAL",
    },
  ];


  // ── 6. Build variants ────────────────────────────────────────────────────
  const components = [];

  for (const type   of ["Primary", "Secondary", "Ghost"]) {
  for (const size   of ["SM", "MD", "LG"]) {
  for (const state  of ["Default", "Hover", "Focused", "Disabled"]) {
  for (const radius of ["Default", "Full"]) {

    const s  = SIZE[size];
    const tk = TOKENS[type][state];
    const cr = radius === "Full" ? 9999 : s.r;

    // ── Component frame ──────────────────────────────────────────────────
    const comp = figma.createComponent();
    comp.name  = `Type=${type}, Size=${size}, State=${state}, Radius=${radius}`;

    // Auto-layout  ─  horizontal, center-center
    comp.layoutMode          = "HORIZONTAL";
    comp.primaryAxisSizingMode   = "AUTO";   // width  = hug content
    comp.counterAxisSizingMode   = "FIXED";  // height = locked
    comp.primaryAxisAlignItems   = "CENTER";
    comp.counterAxisAlignItems   = "CENTER";
    comp.paddingLeft  = s.px;
    comp.paddingRight = s.px;
    comp.paddingTop   = 0;
    comp.paddingBottom = 0;
    comp.itemSpacing  = s.gap;
    comp.resize(80, s.h);                    // fixes height; width auto-expands

    // Appearance
    comp.cornerRadius = cr;
    comp.fills        = tk.bg.a === 0 ? [] : [toFill(tk.bg)];

    if (tk.bd) {
      comp.strokes     = [toStroke(tk.bd)];
      comp.strokeWeight = 1;
      comp.strokeAlign  = "INSIDE";
    } else {
      comp.strokes = [];
    }

    comp.effects = tk.ring ? FOCUS_RING : [];

    // ── Label ────────────────────────────────────────────────────────────
    const lbl = figma.createText();
    lbl.characters    = "Button";
    lbl.fontSize      = s.fs;
    lbl.fontName      = { family: "Inter", style: "Medium" };
    lbl.textAutoResize = "WIDTH_AND_HEIGHT";
    lbl.fills         = [toFill(tk.fg)];

    comp.appendChild(lbl);
    components.push(comp);

  }}}}   // end loops


  // ── 7. Merge into a ComponentSet ─────────────────────────────────────────
  const set = figma.combineAsVariants(components, figma.currentPage);
  set.name          = "Button";
  set.paddingLeft   = 32;
  set.paddingRight  = 32;
  set.paddingTop    = 32;
  set.paddingBottom = 32;
  set.itemSpacing   = 20;

  figma.currentPage.selection = [set];
  figma.viewport.scrollAndZoomIntoView([set]);

  const msg = `✅ Button ComponentSet — ${components.length} variants créés`;
  if (typeof figma.notify === "function") figma.notify(msg);
  console.log(msg);

})().catch(err => console.error("❌ Erreur :", err));
