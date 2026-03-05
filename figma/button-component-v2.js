/**
 * Button Component Generator v2 — Figma Console Script
 *
 * ── How to run ────────────────────────────────────────────────────────────────
 * 1. Open Figma desktop
 * 2. Install the "Scripter" plugin (or any plugin that exposes the console)
 * 3. Paste this entire file and press Run
 *
 * ── What it creates ───────────────────────────────────────────────────────────
 * A "Button" ComponentSet with 48 variants (3 × 2 × 4 × 2):
 *
 *   Type   │ Primary · Secondary · Ghost
 *   Size   │ SM · MD
 *   State  │ Default · Hover · Focused · Disabled
 *   Radius │ Full
 *
 * ── Token sources ─────────────────────────────────────────────────────────────
 * Colors  → Semantic.json  (background/*, foreground/*, border/*)
 *           Bound via figma.variables.createVariableAlias()
 * Spacing → Semantic.json  (spacings/base-*, radius/full)
 *           Bound via setBoundVariable()
 * Fonts   → Text styles (Tailwind export):
 *           SM → Inter SemiBold 12px / 16px  [font-caption-2]
 *           MD → Inter Medium   14px / 20px  [font-caption-1]
 * ─────────────────────────────────────────────────────────────────────────────
 */

(async () => {

  // ── 1. Load fonts ────────────────────────────────────────────────────────
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });
  await figma.loadFontAsync({ family: "Inter", style: "Medium" });
  await figma.loadFontAsync({ family: "Inter", style: "SemiBold" });


  // ── 2. Variable lookup — build a map { name → Variable } ─────────────────
  const allVars = figma.variables.getLocalVariables();
  const V = {};
  for (const v of allVars) V[v.name] = v;

  function getVar(name) {
    const v = V[name];
    if (!v) throw new Error(`Design token not found: "${name}"`);
    return v;
  }


  // ── 3. Fill / stroke helpers ──────────────────────────────────────────────
  function varFill(tokenName) {
    return {
      type: "SOLID",
      color: { r: 0, g: 0, b: 0 },
      boundVariables: { color: figma.variables.createVariableAlias(getVar(tokenName)) },
    };
  }

  function varStroke(tokenName) {
    return {
      type: "SOLID",
      color: { r: 0, g: 0, b: 0 },
      boundVariables: { color: figma.variables.createVariableAlias(getVar(tokenName)) },
    };
  }


  // ── 4. Size scale ─────────────────────────────────────────────────────────
  //  hToken  : spacing token that sets the fixed height
  //  px      : horizontal padding token
  //  gap     : itemSpacing token name (null = raw gapVal)
  //  gapVal  : raw gap in px when no token exists
  //  fs      : font size in px
  //  lh      : line height in px
  //  style   : Inter font style name
  const SIZE = {
    SM: {
      h: 32, hToken: "spacings/base-8",
      px: "spacings/base-3",
      gap: "spacings/base-1", gapVal: 4,
      fs: 12, lh: 16, style: "SemiBold",
    },
    MD: {
      h: 40, hToken: "spacings/base-10",
      px: "spacings/base-4",
      gap: null, gapVal: 6,
      fs: 14, lh: 20, style: "Medium",
    },
  };


  // ── 5. Visual token map per Type × State ─────────────────────────────────
  //  bg / fg / bd : Semantic token names (null = no fill / no stroke)
  //  ring         : attach two-layer focus-ring drop-shadow effect
  const TOKENS = {

    Primary: {
      Default:  { bg: "background/interactive",          fg: "foreground/interactive",                 bd: null,                     ring: false },
      Hover:    { bg: "background/interactive-hover",    fg: "foreground/interactive",                 bd: null,                     ring: false },
      Focused:  { bg: "background/interactive",          fg: "foreground/interactive",                 bd: null,                     ring: true  },
      Disabled: { bg: "background/interactive-disabled", fg: "foreground/interactive-disabled",        bd: null,                     ring: false },
    },

    Secondary: {
      Default:  { bg: "background/interactive-invert",       fg: "foreground/interactive-invert",          bd: "border/interactive-invert",  ring: false },
      Hover:    { bg: "background/interactive-invert-hover", fg: "foreground/interactive-invert",          bd: "border/interactive-invert",  ring: false },
      Focused:  { bg: "background/interactive-invert",       fg: "foreground/interactive-invert",          bd: "border/interactive-invert",  ring: true  },
      Disabled: { bg: null,                                  fg: "foreground/interactive-invert-disabled", bd: "border/secondary-disabled",  ring: false },
    },

    Ghost: {
      Default:  { bg: null,                                  fg: "foreground/interactive-invert",          bd: null, ring: false },
      Hover:    { bg: "background/interactive-invert-hover", fg: "foreground/interactive-invert",          bd: null, ring: false },
      Focused:  { bg: null,                                  fg: "foreground/interactive-invert",          bd: null, ring: true  },
      Disabled: { bg: null,                                  fg: "foreground/interactive-invert-disabled", bd: null, ring: false },
    },

  };


  // ── 6. Focus ring ─────────────────────────────────────────────────────────
  //  Two stacked DROP_SHADOW effects simulate:
  //    outline: 2px solid brand/primary; outline-offset: 2px
  //
  //  Shadow 1 — white gap ring   (spread: 2px)
  //  Shadow 2 — brand/primary ring (spread: 4px cumulative)
  const FOCUS_RING = [
    {
      type: "DROP_SHADOW",
      color: { r: 1, g: 1, b: 1, a: 1 },
      offset: { x: 0, y: 0 },
      radius: 0, spread: 2,
      visible: true, blendMode: "NORMAL",
    },
    {
      type: "DROP_SHADOW",
      color: { r: 0, g: 0, b: 0, a: 1 },
      boundVariables: { color: figma.variables.createVariableAlias(getVar("brand/primary")) },
      offset: { x: 0, y: 0 },
      radius: 0, spread: 4,
      visible: true, blendMode: "NORMAL",
    },
  ];


  // ── 7. Build variants ────────────────────────────────────────────────────
  const components = [];

  for (const type  of ["Primary", "Secondary", "Ghost"]) {
  for (const size  of ["SM", "MD"]) {
  for (const state of ["Default", "Hover", "Focused", "Disabled"]) {

    const s  = SIZE[size];
    const tk = TOKENS[type][state];

    // ── Component frame ───────────────────────────────────────────────────
    const comp = figma.createComponent();
    comp.name  = `Type=${type}, Size=${size}, State=${state}, Radius=Full`;

    // Auto-layout — horizontal, center-center
    comp.layoutMode            = "HORIZONTAL";
    comp.primaryAxisSizingMode = "AUTO";   // width  = hug content
    comp.counterAxisSizingMode = "FIXED";  // height = token-locked
    comp.primaryAxisAlignItems = "CENTER";
    comp.counterAxisAlignItems = "CENTER";
    comp.paddingTop    = 0;
    comp.paddingBottom = 0;
    comp.resize(80, s.h);                  // initial size; height overridden by token

    // ── Bind spacing tokens ───────────────────────────────────────────────
    comp.setBoundVariable("paddingLeft",  getVar(s.px));
    comp.setBoundVariable("paddingRight", getVar(s.px));
    comp.setBoundVariable("height",       getVar(s.hToken));

    if (s.gap) {
      comp.setBoundVariable("itemSpacing", getVar(s.gap));
    } else {
      comp.itemSpacing = s.gapVal;          // MD gap = 6px — no matching token
    }

    // ── Bind radius token (always Full) ──────────────────────────────────
    comp.setBoundVariable("cornerRadius", getVar("radius/full"));

    // ── Background fill ───────────────────────────────────────────────────
    comp.fills = tk.bg ? [varFill(tk.bg)] : [];

    // ── Stroke (Secondary only) ───────────────────────────────────────────
    if (tk.bd) {
      comp.strokes      = [varStroke(tk.bd)];
      comp.strokeWeight = 1;
      comp.strokeAlign  = "INSIDE";
    } else {
      comp.strokes = [];
    }

    // ── Focus ring ────────────────────────────────────────────────────────
    comp.effects = tk.ring ? FOCUS_RING : [];

    // ── Label ─────────────────────────────────────────────────────────────
    const lbl = figma.createText();
    lbl.characters     = "Button";
    lbl.fontSize       = s.fs;
    lbl.fontName       = { family: "Inter", style: s.style };
    lbl.lineHeight     = { value: s.lh, unit: "PIXELS" };
    lbl.textAutoResize = "WIDTH_AND_HEIGHT";
    lbl.fills          = [varFill(tk.fg)];

    comp.appendChild(lbl);
    components.push(comp);

  }}}   // end loops


  // ── 8. Merge into a ComponentSet ─────────────────────────────────────────
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
