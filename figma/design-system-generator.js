/**
 * Design System Generator — Figma Console Script
 *
 * ── How to run ────────────────────────────────────────────────────────────────
 * 1. Open Figma desktop
 * 2. Install the "Scripter" plugin (or any plugin that exposes the Figma Plugin API)
 * 3. Paste this entire file and press Run
 *
 * ── What it creates ───────────────────────────────────────────────────────────
 * 37 pages, one per component, each containing a ComponentSet:
 *
 *   Actions        │ Button · Flex Button · Icon Button · Link
 *   Data Display   │ Alert Card · Card · Divider · Empty State · Table · Tag · Tile
 *   Data Entry     │ Checkbox · Date Picker Native · File Uploader · Password Input
 *                  │ Radio · Segmented Control · Select Card · Select Input
 *                  │ Text Area · Text Input · Toggle
 *   Indicators     │ Badge · Progress Bar · Loader · Skeleton · Stepper
 *   Navigation     │ Breadcrumb · Pagination · Side Bar · Tabs
 *   Overlays       │ Drawer · Dropdown · Dropdown Nav · Modal · Toast · Tooltip
 *
 * ── Token sources ─────────────────────────────────────────────────────────────
 * Colors  → Semantic.json  (background/*, foreground/*, border/*, brand/*)
 *           Bound via figma.variables.createVariableAlias()
 * Spacing → Semantic.json  (spacings/base-*, radius/*)
 *           Bound via setBoundVariable()
 * Fonts   → Inter · Space Grotesk · Fragment Mono
 * ─────────────────────────────────────────────────────────────────────────────
 */

(async () => {

  // ═══════════════════════════════════════════════════════════════════════════
  // 1. FONTS
  // ═══════════════════════════════════════════════════════════════════════════
  await figma.loadFontAsync({ family: "Inter",          style: "Regular"  });
  await figma.loadFontAsync({ family: "Inter",          style: "Medium"   });
  await figma.loadFontAsync({ family: "Inter",          style: "SemiBold" });
  await figma.loadFontAsync({ family: "Space Grotesk",  style: "Medium"   });
  await figma.loadFontAsync({ family: "Space Grotesk",  style: "Bold"     });
  await figma.loadFontAsync({ family: "Fragment Mono",  style: "Regular"  });

  // ═══════════════════════════════════════════════════════════════════════════
  // 2. VARIABLE MAP
  // ═══════════════════════════════════════════════════════════════════════════
  const allVars = figma.variables.getLocalVariables();
  const V = {};
  for (const v of allVars) V[v.name] = v;

  function getVar(name) {
    const v = V[name];
    if (!v) throw new Error(`Token not found: "${name}"`);
    return v;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 3. HELPERS
  // ═══════════════════════════════════════════════════════════════════════════

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

  function makeFocusRing() {
    return [
      { type: "DROP_SHADOW", color: { r: 1, g: 1, b: 1, a: 1 },
        offset: { x: 0, y: 0 }, radius: 0, spread: 2, visible: true, blendMode: "NORMAL" },
      { type: "DROP_SHADOW", color: { r: 0, g: 0, b: 0, a: 1 },
        boundVariables: { color: figma.variables.createVariableAlias(getVar("brand/primary")) },
        offset: { x: 0, y: 0 }, radius: 0, spread: 4, visible: true, blendMode: "NORMAL" },
    ];
  }

  function bindVar(node, prop, tokenName) {
    try { node.setBoundVariable(prop, getVar(tokenName)); } catch (_) {}
  }

  const TYPO = {
    "heading-1": { family: "Space Grotesk", style: "Medium",   fs: 60, lh: 68 },
    "heading-2": { family: "Space Grotesk", style: "Medium",   fs: 48, lh: 56 },
    "heading-3": { family: "Space Grotesk", style: "Medium",   fs: 36, lh: 44 },
    "heading-4": { family: "Space Grotesk", style: "Bold",     fs: 30, lh: 40 },
    "heading-5": { family: "Space Grotesk", style: "Bold",     fs: 24, lh: 32 },
    "heading-6": { family: "Space Grotesk", style: "Bold",     fs: 20, lh: 28 },
    "subtitle":  { family: "Inter",         style: "Medium",   fs: 20, lh: 28 },
    "body-1":    { family: "Inter",         style: "Regular",  fs: 18, lh: 28 },
    "body-2":    { family: "Inter",         style: "Regular",  fs: 16, lh: 24 },
    "caption-1": { family: "Inter",         style: "Medium",   fs: 14, lh: 20 },
    "caption-2": { family: "Inter",         style: "SemiBold", fs: 12, lh: 16 },
    "code":      { family: "Fragment Mono", style: "Regular",  fs: 16, lh: 24 },
  };

  function makeLabel(text, typoKey, fgToken) {
    const t = TYPO[typoKey] || TYPO["caption-1"];
    const lbl = figma.createText();
    lbl.characters     = text;
    lbl.fontSize       = t.fs;
    lbl.fontName       = { family: t.family, style: t.style };
    lbl.lineHeight     = { value: t.lh, unit: "PIXELS" };
    lbl.textAutoResize = "WIDTH_AND_HEIGHT";
    lbl.fills          = fgToken
      ? [varFill(fgToken)]
      : [{ type: "SOLID", color: { r: 0.15, g: 0.15, b: 0.15 } }];
    return lbl;
  }

  function finaliseSet(components, setName) {
    const set = figma.combineAsVariants(components, figma.currentPage);
    set.name          = setName;
    set.paddingLeft   = 32; set.paddingRight  = 32;
    set.paddingTop    = 32; set.paddingBottom = 32;
    set.itemSpacing   = 20;
    figma.currentPage.selection = [set];
    figma.viewport.scrollAndZoomIntoView([set]);
    return set;
  }

  async function createPage(name) {
    const page = figma.createPage();
    page.name = name;
    await figma.setCurrentPageAsync(page);
    return page;
  }

  /**
   * Generic ComponentSet builder.
   * variants: Array<{
   *   name        : string   — "Prop=Val, Prop=Val, …"
   *   bg          : string|null  — background token
   *   fg          : string|null  — foreground token
   *   bd          : string|null  — border token
   *   ring        : boolean  — focus ring
   *   w           : number   — fixed width  (default 240, use 0 = AUTO)
   *   h           : number   — fixed height (default 40,  use 0 = AUTO)
   *   hToken      : string   — setBoundVariable height token
   *   paddingH    : number   — raw horizontal padding
   *   paddingHToken: string  — token for paddingLeft/Right
   *   paddingV    : number   — raw vertical padding
   *   gap         : number   — raw itemSpacing
   *   gapToken    : string   — token for itemSpacing
   *   radius      : string   — corner radius token  (default "radius/md")
   *   labelText   : string   — label characters
   *   typo        : string   — TYPO key
   * }>
   */
  function buildSet(setName, variants) {
    const comps = [];
    for (const v of variants) {
      const comp = figma.createComponent();
      comp.name = v.name;
      comp.layoutMode            = "HORIZONTAL";
      comp.primaryAxisAlignItems = "CENTER";
      comp.counterAxisAlignItems = "CENTER";
      comp.primaryAxisSizingMode = (!v.w || v.w === 0) ? "AUTO"  : "FIXED";
      comp.counterAxisSizingMode = (!v.h || v.h === 0) ? "AUTO"  : "FIXED";

      const rw = v.w || 240;
      const rh = v.h || 40;
      if (v.w || v.h) comp.resize(rw, rh);

      // padding
      if (v.paddingHToken) {
        bindVar(comp, "paddingLeft",  v.paddingHToken);
        bindVar(comp, "paddingRight", v.paddingHToken);
      } else if (v.paddingH !== undefined) {
        comp.paddingLeft = comp.paddingRight = v.paddingH;
      }
      const pv = v.paddingV !== undefined ? v.paddingV : 0;
      comp.paddingTop = comp.paddingBottom = pv;

      // gap
      if (v.gapToken) { bindVar(comp, "itemSpacing", v.gapToken); }
      else if (v.gap !== undefined) { comp.itemSpacing = v.gap; }
      else { comp.itemSpacing = 8; }

      // height token
      if (v.hToken) bindVar(comp, "height", v.hToken);

      // corner radius
      const rtoken = v.radius !== undefined ? v.radius : "radius/md";
      if (rtoken) bindVar(comp, "cornerRadius", rtoken);

      // visuals
      comp.fills   = v.bg ? [varFill(v.bg)] : [];
      if (v.bd) {
        comp.strokes      = [varStroke(v.bd)];
        comp.strokeWeight = 1;
        comp.strokeAlign  = "INSIDE";
      } else {
        comp.strokes = [];
      }
      comp.effects = v.ring ? makeFocusRing() : [];

      // label
      const lbl = makeLabel(v.labelText || setName, v.typo || "caption-1", v.fg || null);
      comp.appendChild(lbl);
      comps.push(comp);
    }
    return finaliseSet(comps, setName);
  }

  // ── Reusable token configs ──────────────────────────────────────────────────

  const INPUT_STATES = [
    { state: "Default",  bg: "background/default", fg: "foreground/default",  bd: "border/default", ring: false },
    { state: "Focused",  bg: "background/default", fg: "foreground/default",  bd: "border/accent",  ring: true  },
    { state: "Filled",   bg: "background/default", fg: "foreground/default",  bd: "border/default", ring: false },
    { state: "Error",    bg: "background/error",   fg: "foreground/error",    bd: "border/error",   ring: false },
    { state: "Disabled", bg: "background/default", fg: "foreground/disabled", bd: "border/subtle",  ring: false },
  ];

  const SEMANTIC_TYPES = [
    { type: "Default", bg: "background/default",  fg: "foreground/default",  bd: "border/default"  },
    { type: "Info",    bg: "background/info",     fg: "foreground/info",     bd: "border/info"     },
    { type: "Success", bg: "background/success",  fg: "foreground/success",  bd: "border/success"  },
    { type: "Warning", bg: "background/warning",  fg: "foreground/warning",  bd: "border/warning"  },
    { type: "Error",   bg: "background/error",    fg: "foreground/error",    bd: "border/error"    },
  ];

  const NAV_STATES = [
    { state: "Default",  bg: null,                              fg: "foreground/default",             bd: null, ring: false },
    { state: "Active",   bg: "background/interactive",          fg: "foreground/interactive",         bd: null, ring: false },
    { state: "Hover",    bg: "background/interactive-invert-hover", fg: "foreground/default",         bd: null, ring: false },
    { state: "Disabled", bg: null,                              fg: "foreground/disabled",            bd: null, ring: false },
  ];

  // ═══════════════════════════════════════════════════════════════════════════
  // 4. COMPONENT BUILDERS
  // ═══════════════════════════════════════════════════════════════════════════

  // ── 4.01  Actions / Button ──────────────────────────────────────────────────
  // 24 variants (3 × 2 × 4): Type × Size × State, Radius=Full
  async function buildButton() {
    await createPage("Actions / Button");

    const SIZE = {
      SM: { h: 32, hToken: "spacings/base-8",  pxToken: "spacings/base-3", gapToken: "spacings/base-1", gapVal: 4,  fs: 12, lh: 16, style: "SemiBold" },
      MD: { h: 40, hToken: "spacings/base-10", pxToken: "spacings/base-4", gapToken: null,              gapVal: 6,  fs: 14, lh: 20, style: "Medium"   },
    };
    const TOKENS = {
      Primary: {
        Default:  { bg: "background/interactive",          fg: "foreground/interactive",                 bd: null,                    ring: false },
        Hover:    { bg: "background/interactive-hover",    fg: "foreground/interactive",                 bd: null,                    ring: false },
        Focused:  { bg: "background/interactive",          fg: "foreground/interactive",                 bd: null,                    ring: true  },
        Disabled: { bg: "background/interactive-disabled", fg: "foreground/interactive-disabled",        bd: null,                    ring: false },
      },
      Secondary: {
        Default:  { bg: "background/interactive-invert",       fg: "foreground/interactive-invert",          bd: "border/interactive-invert", ring: false },
        Hover:    { bg: "background/interactive-invert-hover", fg: "foreground/interactive-invert",          bd: "border/interactive-invert", ring: false },
        Focused:  { bg: "background/interactive-invert",       fg: "foreground/interactive-invert",          bd: "border/interactive-invert", ring: true  },
        Disabled: { bg: null,                                  fg: "foreground/interactive-invert-disabled", bd: "border/secondary-disabled", ring: false },
      },
      Ghost: {
        Default:  { bg: null,                                  fg: "foreground/interactive-invert",          bd: null, ring: false },
        Hover:    { bg: "background/interactive-invert-hover", fg: "foreground/interactive-invert",          bd: null, ring: false },
        Focused:  { bg: null,                                  fg: "foreground/interactive-invert",          bd: null, ring: true  },
        Disabled: { bg: null,                                  fg: "foreground/interactive-invert-disabled", bd: null, ring: false },
      },
    };

    const comps = [];
    for (const type  of ["Primary", "Secondary", "Ghost"]) {
    for (const size  of ["SM", "MD"]) {
    for (const state of ["Default", "Hover", "Focused", "Disabled"]) {
      const s  = SIZE[size];
      const tk = TOKENS[type][state];
      const comp = figma.createComponent();
      comp.name  = `Type=${type}, Size=${size}, State=${state}, Radius=Full`;
      comp.layoutMode            = "HORIZONTAL";
      comp.primaryAxisSizingMode = "AUTO";
      comp.counterAxisSizingMode = "FIXED";
      comp.primaryAxisAlignItems = "CENTER";
      comp.counterAxisAlignItems = "CENTER";
      comp.paddingTop    = 0;
      comp.paddingBottom = 0;
      comp.resize(80, s.h);
      bindVar(comp, "paddingLeft",  s.pxToken);
      bindVar(comp, "paddingRight", s.pxToken);
      bindVar(comp, "height",       s.hToken);
      if (s.gapToken) { bindVar(comp, "itemSpacing", s.gapToken); }
      else            { comp.itemSpacing = s.gapVal; }
      bindVar(comp, "cornerRadius", "radius/full");
      comp.fills   = tk.bg ? [varFill(tk.bg)] : [];
      if (tk.bd) { comp.strokes = [varStroke(tk.bd)]; comp.strokeWeight = 1; comp.strokeAlign = "INSIDE"; }
      else       { comp.strokes = []; }
      comp.effects = tk.ring ? makeFocusRing() : [];
      const lbl = figma.createText();
      lbl.characters     = "Button";
      lbl.fontSize       = s.fs;
      lbl.fontName       = { family: "Inter", style: s.style };
      lbl.lineHeight     = { value: s.lh, unit: "PIXELS" };
      lbl.textAutoResize = "WIDTH_AND_HEIGHT";
      lbl.fills          = [varFill(tk.fg)];
      comp.appendChild(lbl);
      comps.push(comp);
    }}}
    finaliseSet(comps, "Button");
  }

  // ── 4.02  Actions / Flex Button ─────────────────────────────────────────────
  // 24 variants: Type × Size × State — horizontal layout with icon slot + label
  async function buildFlexButton() {
    await createPage("Actions / Flex Button");

    const SIZES = {
      SM: { h: 32, hToken: "spacings/base-8",  pxToken: "spacings/base-3", gapToken: "spacings/base-1", fs: 12, lh: 16, style: "SemiBold" },
      MD: { h: 40, hToken: "spacings/base-10", pxToken: "spacings/base-4", gapVal: 6,                   fs: 14, lh: 20, style: "Medium"   },
    };
    const TOKEN_MAP = {
      Primary:   {
        Default:  { bg: "background/interactive",          fg: "foreground/interactive",                 bd: null,                    ring: false },
        Hover:    { bg: "background/interactive-hover",    fg: "foreground/interactive",                 bd: null,                    ring: false },
        Focused:  { bg: "background/interactive",          fg: "foreground/interactive",                 bd: null,                    ring: true  },
        Disabled: { bg: "background/interactive-disabled", fg: "foreground/interactive-disabled",        bd: null,                    ring: false },
      },
      Secondary: {
        Default:  { bg: "background/interactive-invert",       fg: "foreground/interactive-invert",          bd: "border/interactive-invert", ring: false },
        Hover:    { bg: "background/interactive-invert-hover", fg: "foreground/interactive-invert",          bd: "border/interactive-invert", ring: false },
        Focused:  { bg: "background/interactive-invert",       fg: "foreground/interactive-invert",          bd: "border/interactive-invert", ring: true  },
        Disabled: { bg: null,                                  fg: "foreground/interactive-invert-disabled", bd: "border/secondary-disabled", ring: false },
      },
      Ghost: {
        Default:  { bg: null,                                  fg: "foreground/interactive-invert",          bd: null, ring: false },
        Hover:    { bg: "background/interactive-invert-hover", fg: "foreground/interactive-invert",          bd: null, ring: false },
        Focused:  { bg: null,                                  fg: "foreground/interactive-invert",          bd: null, ring: true  },
        Disabled: { bg: null,                                  fg: "foreground/interactive-invert-disabled", bd: null, ring: false },
      },
    };

    const comps = [];
    for (const type  of ["Primary", "Secondary", "Ghost"]) {
    for (const size  of ["SM", "MD"]) {
    for (const state of ["Default", "Hover", "Focused", "Disabled"]) {
      const s  = SIZES[size];
      const tk = TOKEN_MAP[type][state];
      const comp = figma.createComponent();
      comp.name  = `Type=${type}, Size=${size}, State=${state}`;
      comp.layoutMode            = "HORIZONTAL";
      comp.primaryAxisSizingMode = "AUTO";
      comp.counterAxisSizingMode = "FIXED";
      comp.primaryAxisAlignItems = "CENTER";
      comp.counterAxisAlignItems = "CENTER";
      comp.paddingTop = 0; comp.paddingBottom = 0;
      comp.resize(80, s.h);
      bindVar(comp, "paddingLeft",  s.pxToken);
      bindVar(comp, "paddingRight", s.pxToken);
      bindVar(comp, "height",       s.hToken);
      if (s.gapToken) { bindVar(comp, "itemSpacing", s.gapToken); }
      else            { comp.itemSpacing = s.gapVal || 6; }
      bindVar(comp, "cornerRadius", "radius/full");
      comp.fills   = tk.bg ? [varFill(tk.bg)] : [];
      if (tk.bd) { comp.strokes = [varStroke(tk.bd)]; comp.strokeWeight = 1; comp.strokeAlign = "INSIDE"; }
      else       { comp.strokes = []; }
      comp.effects = tk.ring ? makeFocusRing() : [];

      // Icon placeholder (16×16 rect)
      const icon = figma.createRectangle();
      icon.resize(size === "SM" ? 12 : 16, size === "SM" ? 12 : 16);
      icon.fills = [varFill(tk.fg)];
      icon.cornerRadius = 2;
      comp.appendChild(icon);

      const lbl = figma.createText();
      lbl.characters     = "Flex Button";
      lbl.fontSize       = s.fs;
      lbl.fontName       = { family: "Inter", style: s.style };
      lbl.lineHeight     = { value: s.lh, unit: "PIXELS" };
      lbl.textAutoResize = "WIDTH_AND_HEIGHT";
      lbl.fills          = [varFill(tk.fg)];
      comp.appendChild(lbl);
      comps.push(comp);
    }}}
    finaliseSet(comps, "Flex Button");
  }

  // ── 4.03  Actions / Icon Button ─────────────────────────────────────────────
  // 24 variants: Type × Size × State — square button, icon only
  async function buildIconButton() {
    await createPage("Actions / Icon Button");

    const SIZES = {
      SM: { sz: 32, hToken: "spacings/base-8"  },
      MD: { sz: 40, hToken: "spacings/base-10" },
    };
    const TOKEN_MAP = {
      Primary:   {
        Default:  { bg: "background/interactive",          fg: "foreground/interactive",                 bd: null,                    ring: false },
        Hover:    { bg: "background/interactive-hover",    fg: "foreground/interactive",                 bd: null,                    ring: false },
        Focused:  { bg: "background/interactive",          fg: "foreground/interactive",                 bd: null,                    ring: true  },
        Disabled: { bg: "background/interactive-disabled", fg: "foreground/interactive-disabled",        bd: null,                    ring: false },
      },
      Secondary: {
        Default:  { bg: "background/interactive-invert",       fg: "foreground/interactive-invert",          bd: "border/interactive-invert", ring: false },
        Hover:    { bg: "background/interactive-invert-hover", fg: "foreground/interactive-invert",          bd: "border/interactive-invert", ring: false },
        Focused:  { bg: "background/interactive-invert",       fg: "foreground/interactive-invert",          bd: "border/interactive-invert", ring: true  },
        Disabled: { bg: null,                                  fg: "foreground/interactive-invert-disabled", bd: "border/secondary-disabled", ring: false },
      },
      Ghost: {
        Default:  { bg: null,                                  fg: "foreground/interactive-invert",          bd: null, ring: false },
        Hover:    { bg: "background/interactive-invert-hover", fg: "foreground/interactive-invert",          bd: null, ring: false },
        Focused:  { bg: null,                                  fg: "foreground/interactive-invert",          bd: null, ring: true  },
        Disabled: { bg: null,                                  fg: "foreground/interactive-invert-disabled", bd: null, ring: false },
      },
    };

    const comps = [];
    for (const type  of ["Primary", "Secondary", "Ghost"]) {
    for (const size  of ["SM", "MD"]) {
    for (const state of ["Default", "Hover", "Focused", "Disabled"]) {
      const s  = SIZES[size];
      const tk = TOKEN_MAP[type][state];
      const comp = figma.createComponent();
      comp.name  = `Type=${type}, Size=${size}, State=${state}`;
      comp.layoutMode            = "HORIZONTAL";
      comp.primaryAxisSizingMode = "FIXED";
      comp.counterAxisSizingMode = "FIXED";
      comp.primaryAxisAlignItems = "CENTER";
      comp.counterAxisAlignItems = "CENTER";
      comp.resize(s.sz, s.sz);
      bindVar(comp, "width",        s.hToken);
      bindVar(comp, "height",       s.hToken);
      bindVar(comp, "cornerRadius", "radius/full");
      comp.fills   = tk.bg ? [varFill(tk.bg)] : [];
      if (tk.bd) { comp.strokes = [varStroke(tk.bd)]; comp.strokeWeight = 1; comp.strokeAlign = "INSIDE"; }
      else       { comp.strokes = []; }
      comp.effects = tk.ring ? makeFocusRing() : [];
      const iconSz = size === "SM" ? 14 : 18;
      const icon   = figma.createRectangle();
      icon.resize(iconSz, iconSz);
      icon.fills        = [varFill(tk.fg)];
      icon.cornerRadius = 2;
      comp.appendChild(icon);
      comps.push(comp);
    }}}
    finaliseSet(comps, "Icon Button");
  }

  // ── 4.04  Actions / Link ────────────────────────────────────────────────────
  // 15 variants: Size × State
  async function buildLink() {
    await createPage("Actions / Link");
    const SIZES  = ["SM", "MD", "LG"];
    const STATES = ["Default", "Hover", "Focused", "Disabled", "Visited"];
    const TYPO_MAP = { SM: "caption-2", MD: "caption-1", LG: "body-2" };
    const STATE_FG = {
      Default:  "foreground/accent",
      Hover:    "foreground/accent",
      Focused:  "foreground/accent",
      Disabled: "foreground/disabled",
      Visited:  "foreground/default",
    };
    const variants = [];
    for (const size  of SIZES) {
    for (const state of STATES) {
      variants.push({
        name:      `Size=${size}, State=${state}`,
        bg:        null,
        fg:        STATE_FG[state],
        bd:        null,
        ring:      state === "Focused",
        w:         0,
        h:         0,
        paddingH:  4,
        paddingV:  2,
        typo:      TYPO_MAP[size],
        labelText: "Link Text",
        radius:    "radius/sm",
      });
    }}
    buildSet("Link", variants);
  }

  // ── 4.05  Data Display / Alert Card ─────────────────────────────────────────
  // 12 variants: Type × Variant
  async function buildAlertCard() {
    await createPage("Data Display / Alert Card");
    const types    = ["Info", "Success", "Warning", "Error"];
    const variants = ["Default", "Outlined", "Filled"];
    const TMAP = {
      Info:    { bg: "background/info",    fg: "foreground/info",    bd: "border/info"    },
      Success: { bg: "background/success", fg: "foreground/success", bd: "border/success" },
      Warning: { bg: "background/warning", fg: "foreground/warning", bd: "border/warning" },
      Error:   { bg: "background/error",   fg: "foreground/error",   bd: "border/error"   },
    };
    const VMAP = {
      Default:  (tk) => ({ bg: tk.bg,   bd: null,  }),
      Outlined: (tk) => ({ bg: null,    bd: tk.bd  }),
      Filled:   (tk) => ({ bg: tk.bg,   bd: tk.bd  }),
    };
    const vs = [];
    for (const type of types) {
    for (const vari of variants) {
      const tk  = TMAP[type];
      const vis = VMAP[vari](tk);
      vs.push({
        name:      `Type=${type}, Variant=${vari}`,
        bg:        vis.bg,
        fg:        tk.fg,
        bd:        vis.bd,
        ring:      false,
        w:         320,
        h:         0,
        paddingH:  16,
        paddingV:  16,
        gap:       8,
        typo:      "body-2",
        labelText: `${type} Alert`,
        radius:    "radius/lg",
      });
    }}
    buildSet("Alert Card", vs);
  }

  // ── 4.06  Data Display / Card ───────────────────────────────────────────────
  // 6 variants: Variant × State
  async function buildCard() {
    await createPage("Data Display / Card");
    const vs = [];
    const VMAP = [
      { variant: "Default",  bg: "background/default",  bd: "border/default" },
      { variant: "Outlined", bg: null,                  bd: "border/default" },
      { variant: "Filled",   bg: "background/default-alt", bd: null          },
    ];
    for (const { variant, bg, bd } of VMAP) {
    for (const state of ["Default", "Hover"]) {
      vs.push({
        name:      `Variant=${variant}, State=${state}`,
        bg:        state === "Hover" ? "background/interactive-invert-hover" : bg,
        fg:        "foreground/default",
        bd:        bd,
        ring:      false,
        w:         320,
        h:         200,
        paddingH:  24,
        paddingV:  24,
        gap:       12,
        typo:      "body-2",
        labelText: "Card Content",
        radius:    "radius/xl",
      });
    }}
    buildSet("Card", vs);
  }

  // ── 4.07  Data Display / Divider ────────────────────────────────────────────
  // 6 variants: Orientation × Variant
  async function buildDivider() {
    await createPage("Data Display / Divider");
    const BD_MAP = { Default: "border/default", Subtle: "border/subtle", Accent: "border/accent" };
    const vs = [];
    for (const vari of ["Default", "Subtle", "Accent"]) {
      // Horizontal
      vs.push({
        name:      `Orientation=Horizontal, Variant=${vari}`,
        bg:        BD_MAP[vari],
        fg:        null,
        bd:        null,
        ring:      false,
        w:         280,
        h:         1,
        paddingH:  0,
        paddingV:  0,
        gap:       0,
        typo:      "caption-2",
        labelText: "",
        radius:    null,
      });
      // Vertical
      vs.push({
        name:      `Orientation=Vertical, Variant=${vari}`,
        bg:        BD_MAP[vari],
        fg:        null,
        bd:        null,
        ring:      false,
        w:         1,
        h:         80,
        paddingH:  0,
        paddingV:  0,
        gap:       0,
        typo:      "caption-2",
        labelText: "",
        radius:    null,
      });
    }
    buildSet("Divider", vs);
  }

  // ── 4.08  Data Display / Empty State ────────────────────────────────────────
  // 3 variants: Type
  async function buildEmptyState() {
    await createPage("Data Display / Empty State");
    const vs = [
      { name: "Type=Default",   bg: "background/default", fg: "foreground/default",  bd: "border/default",        labelText: "No items yet"          },
      { name: "Type=NoResults", bg: "background/default", fg: "foreground/default",  bd: "border/default",        labelText: "No results found"      },
      { name: "Type=Error",     bg: "background/error",   fg: "foreground/error",    bd: "border/error",          labelText: "Something went wrong"  },
    ].map(v => ({
      ...v, ring: false, w: 320, h: 240, paddingH: 32, paddingV: 32, gap: 12,
      typo: "body-2", radius: "radius/xl",
    }));
    buildSet("Empty State", vs);
  }

  // ── 4.09  Data Display / Table ──────────────────────────────────────────────
  // 4 variants: State
  async function buildTable() {
    await createPage("Data Display / Table");
    const vs = [
      { name: "State=Header",   bg: "background/accent",                   fg: "foreground/default-invert", bd: "border/default", labelText: "Column Header" },
      { name: "State=Default",  bg: "background/default",                  fg: "foreground/default",        bd: "border/subtle",  labelText: "Cell Value"    },
      { name: "State=Hover",    bg: "background/interactive-invert-hover", fg: "foreground/default",        bd: "border/subtle",  labelText: "Cell Value"    },
      { name: "State=Selected", bg: "background/info",                     fg: "foreground/info",           bd: "border/info",    labelText: "Cell Value"    },
    ].map(v => ({
      ...v, ring: false, w: 200, h: 48, paddingH: 16, paddingV: 0,
      hToken: "spacings/base-12", gap: 8, typo: "caption-1", radius: null,
    }));
    buildSet("Table", vs);
  }

  // ── 4.10  Data Display / Tag ────────────────────────────────────────────────
  // 10 variants: Type × Size
  async function buildTag() {
    await createPage("Data Display / Tag");
    const vs = [];
    const TMAP = {
      Default: { bg: "background/default",  fg: "foreground/default",  bd: "border/default"  },
      Info:    { bg: "background/info",     fg: "foreground/info",     bd: "border/info"     },
      Success: { bg: "background/success",  fg: "foreground/success",  bd: "border/success"  },
      Warning: { bg: "background/warning",  fg: "foreground/warning",  bd: "border/warning"  },
      Error:   { bg: "background/error",    fg: "foreground/error",    bd: "border/error"    },
    };
    const SMAP = {
      SM: { h: 20, hToken: "spacings/base-5", pxToken: "spacings/base-2", typo: "caption-2" },
      MD: { h: 24, hToken: "spacings/base-6", pxToken: "spacings/base-3", typo: "caption-1" },
    };
    for (const [type, tk] of Object.entries(TMAP)) {
    for (const [size, sk] of Object.entries(SMAP)) {
      vs.push({
        name:         `Type=${type}, Size=${size}`,
        bg:           tk.bg,
        fg:           tk.fg,
        bd:           tk.bd,
        ring:         false,
        w:            0,
        h:            sk.h,
        hToken:       sk.hToken,
        paddingHToken: sk.pxToken,
        paddingV:     0,
        gap:          4,
        typo:         sk.typo,
        labelText:    type,
        radius:       "radius/full",
      });
    }}
    buildSet("Tag", vs);
  }

  // ── 4.11  Data Display / Tile ───────────────────────────────────────────────
  // 8 variants: Variant × State
  async function buildTile() {
    await createPage("Data Display / Tile");
    const vs = [];
    for (const variant of ["Default", "Outlined"]) {
    for (const state of ["Default", "Hover", "Selected", "Disabled"]) {
      vs.push({
        name:      `Variant=${variant}, State=${state}`,
        bg:        state === "Hover"     ? "background/interactive-invert-hover"
                 : state === "Selected" ? "background/interactive"
                 : state === "Disabled" ? "background/default"
                 : variant === "Outlined" ? null : "background/default",
        fg:        state === "Disabled"  ? "foreground/disabled"
                 : state === "Selected" ? "foreground/interactive"
                 : "foreground/default",
        bd:        variant === "Outlined" || state === "Selected" ? "border/interactive-invert" : "border/default",
        ring:      false,
        w:         160,
        h:         160,
        paddingH:  16,
        paddingV:  16,
        gap:       8,
        typo:      "caption-1",
        labelText: "Tile",
        radius:    "radius/xl",
      });
    }}
    buildSet("Tile", vs);
  }

  // ── 4.12  Data Entry / Checkbox ─────────────────────────────────────────────
  // 5 variants: State
  async function buildCheckbox() {
    await createPage("Data Entry / Checkbox");
    const vs = [
      { name: "State=Default",         bg: null,                     fg: "foreground/default",         bd: "border/interactive-invert", ring: false, labelText: "Checkbox" },
      { name: "State=Checked",         bg: "background/interactive", fg: "foreground/interactive",     bd: null,                        ring: false, labelText: "Checkbox" },
      { name: "State=Indeterminate",   bg: "background/interactive", fg: "foreground/interactive",     bd: null,                        ring: false, labelText: "Checkbox" },
      { name: "State=Disabled",        bg: "background/default",     fg: "foreground/disabled",        bd: "border/subtle",             ring: false, labelText: "Checkbox" },
      { name: "State=Checked-Disabled",bg: "background/interactive-disabled", fg: "foreground/interactive-disabled", bd: null,         ring: false, labelText: "Checkbox" },
    ].map(v => ({ ...v, w: 20, h: 20, paddingH: 0, paddingV: 0, gap: 0, typo: "caption-2", radius: "radius/sm" }));
    buildSet("Checkbox", vs);
  }

  // ── 4.13  Data Entry / Date Picker Native ───────────────────────────────────
  // 5 variants: State
  async function buildDatePickerNative() {
    await createPage("Data Entry / Date Picker Native");
    const vs = INPUT_STATES.map(s => ({
      name:      `State=${s.state}`,
      bg:        s.bg,
      fg:        s.fg,
      bd:        s.bd,
      ring:      s.ring,
      w:         280,
      h:         40,
      hToken:    "spacings/base-10",
      paddingH:  16,
      paddingV:  0,
      gap:       8,
      typo:      "caption-1",
      labelText: "dd/mm/yyyy",
      radius:    "radius/lg",
    }));
    buildSet("Date Picker Native", vs);
  }

  // ── 4.14  Data Entry / File Uploader ────────────────────────────────────────
  // 5 variants: State
  async function buildFileUploader() {
    await createPage("Data Entry / File Uploader");
    const STATE_MAP = [
      { state: "Default", bg: "background/default",  fg: "foreground/default",  bd: "border/default", ring: false },
      { state: "Hover",   bg: "background/interactive-invert-hover", fg: "foreground/default", bd: "border/accent", ring: false },
      { state: "Active",  bg: "background/info",     fg: "foreground/info",     bd: "border/info",    ring: false },
      { state: "Error",   bg: "background/error",    fg: "foreground/error",    bd: "border/error",   ring: false },
      { state: "Disabled",bg: "background/default",  fg: "foreground/disabled", bd: "border/subtle",  ring: false },
    ];
    const vs = STATE_MAP.map(s => ({
      name:      `State=${s.state}`,
      bg:        s.bg,
      fg:        s.fg,
      bd:        s.bd,
      ring:      s.ring,
      w:         320,
      h:         120,
      paddingH:  24,
      paddingV:  24,
      gap:       8,
      typo:      "body-2",
      labelText: "Drop files here or browse",
      radius:    "radius/xl",
    }));
    buildSet("File Uploader", vs);
  }

  // ── 4.15  Data Entry / Password Input ───────────────────────────────────────
  // 5 variants: State
  async function buildPasswordInput() {
    await createPage("Data Entry / Password Input");
    const vs = INPUT_STATES.map(s => ({
      name:      `State=${s.state}`,
      bg:        s.bg,
      fg:        s.fg,
      bd:        s.bd,
      ring:      s.ring,
      w:         280,
      h:         40,
      hToken:    "spacings/base-10",
      paddingH:  16,
      paddingV:  0,
      gap:       8,
      typo:      "caption-1",
      labelText: "••••••••",
      radius:    "radius/lg",
    }));
    buildSet("Password Input", vs);
  }

  // ── 4.16  Data Entry / Radio ────────────────────────────────────────────────
  // 4 variants: State
  async function buildRadio() {
    await createPage("Data Entry / Radio");
    const vs = [
      { name: "State=Default",         bg: null,                              fg: "foreground/default",                  bd: "border/interactive-invert", ring: false },
      { name: "State=Checked",         bg: "background/interactive",          fg: "foreground/interactive",              bd: null,                        ring: false },
      { name: "State=Disabled",        bg: "background/default",              fg: "foreground/disabled",                 bd: "border/subtle",             ring: false },
      { name: "State=Checked-Disabled",bg: "background/interactive-disabled", fg: "foreground/interactive-disabled",    bd: null,                        ring: false },
    ].map(v => ({ ...v, w: 20, h: 20, paddingH: 0, paddingV: 0, gap: 0, typo: "caption-2", radius: "radius/full" }));
    buildSet("Radio", vs);
  }

  // ── 4.17  Data Entry / Segmented Control ────────────────────────────────────
  // 6 variants: Size × Item-State
  async function buildSegmentedControl() {
    await createPage("Data Entry / Segmented Control");
    const SMAP = { SM: { h: 32, typo: "caption-2" }, MD: { h: 40, typo: "caption-1" } };
    const vs = [];
    for (const [size, sk] of Object.entries(SMAP)) {
    for (const istate of ["Default", "Active", "Disabled"]) {
      vs.push({
        name:      `Size=${size}, Item-State=${istate}`,
        bg:        istate === "Active"   ? "background/interactive"
                 : istate === "Disabled" ? "background/default"
                 : "background/default",
        fg:        istate === "Active"   ? "foreground/interactive"
                 : istate === "Disabled" ? "foreground/disabled"
                 : "foreground/default",
        bd:        "border/default",
        ring:      false,
        w:         0,
        h:         sk.h,
        paddingH:  16,
        paddingV:  0,
        gap:       8,
        typo:      sk.typo,
        labelText: "Segment",
        radius:    "radius/lg",
      });
    }}
    buildSet("Segmented Control", vs);
  }

  // ── 4.18  Data Entry / Select Card ──────────────────────────────────────────
  // 4 variants: State
  async function buildSelectCard() {
    await createPage("Data Entry / Select Card");
    const vs = [
      { name: "State=Default",  bg: null,                              fg: "foreground/default",         bd: "border/default",           ring: false },
      { name: "State=Hover",    bg: "background/interactive-invert-hover", fg: "foreground/default",    bd: "border/interactive-invert", ring: false },
      { name: "State=Selected", bg: "background/interactive",          fg: "foreground/interactive",     bd: "border/accent",            ring: false },
      { name: "State=Disabled", bg: "background/default",              fg: "foreground/disabled",        bd: "border/subtle",            ring: false },
    ].map(v => ({ ...v, w: 160, h: 120, paddingH: 16, paddingV: 16, gap: 8, typo: "caption-1", labelText: "Select Card", radius: "radius/xl" }));
    buildSet("Select Card", vs);
  }

  // ── 4.19  Data Entry / Select Input ─────────────────────────────────────────
  // 5 variants: State
  async function buildSelectInput() {
    await createPage("Data Entry / Select Input");
    const vs = INPUT_STATES.map(s => ({
      name:      `State=${s.state}`,
      bg:        s.bg,
      fg:        s.fg,
      bd:        s.bd,
      ring:      s.ring,
      w:         280,
      h:         40,
      hToken:    "spacings/base-10",
      paddingH:  16,
      paddingV:  0,
      gap:       8,
      typo:      "caption-1",
      labelText: s.state === "Filled" ? "Selected option" : "Select…",
      radius:    "radius/lg",
    }));
    buildSet("Select Input", vs);
  }

  // ── 4.20  Data Entry / Text Area ────────────────────────────────────────────
  // 5 variants: State
  async function buildTextArea() {
    await createPage("Data Entry / Text Area");
    const vs = INPUT_STATES.map(s => ({
      name:      `State=${s.state}`,
      bg:        s.bg,
      fg:        s.fg,
      bd:        s.bd,
      ring:      s.ring,
      w:         280,
      h:         100,
      paddingH:  16,
      paddingV:  12,
      gap:       8,
      typo:      "body-2",
      labelText: s.state === "Filled" ? "Some longer text…" : "Placeholder…",
      radius:    "radius/lg",
    }));
    buildSet("Text Area", vs);
  }

  // ── 4.21  Data Entry / Text Input ───────────────────────────────────────────
  // 5 variants: State
  async function buildTextInput() {
    await createPage("Data Entry / Text Input");
    const vs = INPUT_STATES.map(s => ({
      name:      `State=${s.state}`,
      bg:        s.bg,
      fg:        s.fg,
      bd:        s.bd,
      ring:      s.ring,
      w:         280,
      h:         40,
      hToken:    "spacings/base-10",
      paddingH:  16,
      paddingV:  0,
      gap:       8,
      typo:      "caption-1",
      labelText: s.state === "Filled" ? "User input value" : "Placeholder…",
      radius:    "radius/lg",
    }));
    buildSet("Text Input", vs);
  }

  // ── 4.22  Data Entry / Toggle ───────────────────────────────────────────────
  // 4 variants: State
  async function buildToggle() {
    await createPage("Data Entry / Toggle");
    const vs = [
      { name: "State=Off",          bg: "background/default-alt",           fg: "foreground/subtle",               bd: "border/default", ring: false },
      { name: "State=On",           bg: "background/interactive",            fg: "foreground/interactive",          bd: null,             ring: false },
      { name: "State=Disabled-Off", bg: "background/default",                fg: "foreground/disabled",             bd: "border/subtle",  ring: false },
      { name: "State=Disabled-On",  bg: "background/interactive-disabled",   fg: "foreground/interactive-disabled", bd: null,             ring: false },
    ].map(v => ({ ...v, w: 44, h: 24, paddingH: 4, paddingV: 4, gap: 0, typo: "caption-2", labelText: "", radius: "radius/full" }));
    buildSet("Toggle", vs);
  }

  // ── 4.23  Indicators / Badge ────────────────────────────────────────────────
  // 10 variants: Type × Size
  async function buildBadge() {
    await createPage("Indicators / Badge");
    const vs = [];
    for (const { type, bg, fg, bd } of SEMANTIC_TYPES) {
    for (const size of ["SM", "MD"]) {
      vs.push({
        name:         `Type=${type}, Size=${size}`,
        bg:           bg,
        fg:           fg,
        bd:           bd,
        ring:         false,
        w:            0,
        h:            size === "SM" ? 16 : 20,
        paddingH:     size === "SM" ? 4  : 6,
        paddingV:     0,
        gap:          4,
        typo:         size === "SM" ? "caption-2" : "caption-1",
        labelText:    type === "Default" ? "0" : "99",
        radius:       "radius/full",
      });
    }}
    buildSet("Badge", vs);
  }

  // ── 4.24  Indicators / Progress Bar ────────────────────────────────────────
  // 5 variants: Type
  async function buildProgressBar() {
    await createPage("Indicators / Progress Bar");
    const vs = SEMANTIC_TYPES.map(({ type, bg, fg, bd }) => ({
      name:      `Type=${type}`,
      bg:        bg,
      fg:        fg,
      bd:        null,
      ring:      false,
      w:         280,
      h:         8,
      paddingH:  0,
      paddingV:  0,
      gap:       0,
      typo:      "caption-2",
      labelText: "",
      radius:    "radius/full",
    }));
    buildSet("Progress Bar", vs);
  }

  // ── 4.25  Indicators / Loader ───────────────────────────────────────────────
  // 3 variants: Size
  async function buildLoader() {
    await createPage("Indicators / Loader");
    const vs = [
      { name: "Size=SM", sz: 24 },
      { name: "Size=MD", sz: 32 },
      { name: "Size=LG", sz: 48 },
    ].map(({ name, sz }) => ({
      name,
      bg:        null,
      fg:        "foreground/accent",
      bd:        "border/accent",
      ring:      false,
      w:         sz,
      h:         sz,
      paddingH:  0,
      paddingV:  0,
      gap:       0,
      typo:      "caption-2",
      labelText: "",
      radius:    "radius/full",
    }));
    buildSet("Loader", vs);
  }

  // ── 4.26  Indicators / Skeleton ─────────────────────────────────────────────
  // 3 variants: Type
  async function buildSkeleton() {
    await createPage("Indicators / Skeleton");
    const vs = [
      { name: "Type=Line",      w: 280, h: 16, radius: "radius/sm"   },
      { name: "Type=Circle",    w: 40,  h: 40, radius: "radius/full" },
      { name: "Type=Rectangle", w: 280, h: 80, radius: "radius/lg"   },
    ].map(({ name, w, h, radius }) => ({
      name,
      bg:        "background/default-alt",
      fg:        "foreground/disabled",
      bd:        null,
      ring:      false,
      w,
      h,
      paddingH:  0,
      paddingV:  0,
      gap:       0,
      typo:      "caption-2",
      labelText: "",
      radius,
    }));
    buildSet("Skeleton", vs);
  }

  // ── 4.27  Indicators / Stepper ──────────────────────────────────────────────
  // 5 variants: State
  async function buildStepper() {
    await createPage("Indicators / Stepper");
    const vs = [
      { name: "State=Default",   bg: null,                       fg: "foreground/default",     bd: "border/default", ring: false, labelText: "1" },
      { name: "State=Active",    bg: "background/interactive",   fg: "foreground/interactive", bd: null,             ring: true,  labelText: "2" },
      { name: "State=Completed", bg: "background/success",       fg: "foreground/success",     bd: null,             ring: false, labelText: "✓" },
      { name: "State=Error",     bg: "background/error",         fg: "foreground/error",       bd: "border/error",   ring: false, labelText: "!" },
      { name: "State=Disabled",  bg: "background/default",       fg: "foreground/disabled",    bd: "border/subtle",  ring: false, labelText: "4" },
    ].map(v => ({ ...v, w: 32, h: 32, paddingH: 0, paddingV: 0, gap: 0, typo: "caption-1", radius: "radius/full" }));
    buildSet("Stepper", vs);
  }

  // ── 4.28  Navigation / Breadcrumb ───────────────────────────────────────────
  // 3 variants: State
  async function buildBreadcrumb() {
    await createPage("Navigation / Breadcrumb");
    const vs = [
      { state: "Default",  fg: "foreground/default",  ring: false },
      { state: "Active",   fg: "foreground/accent",   ring: false },
      { state: "Disabled", fg: "foreground/disabled", ring: false },
    ].map(({ state, fg, ring }) => ({
      name:      `State=${state}`,
      bg:        null,
      fg,
      bd:        null,
      ring,
      w:         0,
      h:         0,
      paddingH:  4,
      paddingV:  4,
      gap:       4,
      typo:      "caption-1",
      labelText: "Home / Section / Page",
      radius:    "radius/sm",
    }));
    buildSet("Breadcrumb", vs);
  }

  // ── 4.29  Navigation / Pagination ───────────────────────────────────────────
  // 3 variants: State
  async function buildPagination() {
    await createPage("Navigation / Pagination");
    const vs = [
      { name: "State=Default",  bg: null,                          fg: "foreground/default",     bd: "border/default", ring: false },
      { name: "State=Active",   bg: "background/interactive",      fg: "foreground/interactive", bd: null,             ring: false },
      { name: "State=Disabled", bg: "background/default",          fg: "foreground/disabled",    bd: "border/subtle",  ring: false },
    ].map(v => ({ ...v, w: 0, h: 40, hToken: "spacings/base-10", paddingH: 16, paddingV: 0, gap: 4, typo: "caption-1", labelText: "1", radius: "radius/lg" }));
    buildSet("Pagination", vs);
  }

  // ── 4.30  Navigation / Side Bar ─────────────────────────────────────────────
  // 4 variants: State
  async function buildSideBar() {
    await createPage("Navigation / Side Bar");
    const vs = NAV_STATES.map(({ state, bg, fg, bd, ring }) => ({
      name:      `State=${state}`,
      bg,
      fg,
      bd:        null,
      ring,
      w:         240,
      h:         48,
      paddingH:  16,
      paddingV:  0,
      gap:       12,
      typo:      "caption-1",
      labelText: "Nav Item",
      radius:    "radius/lg",
    }));
    buildSet("Side Bar", vs);
  }

  // ── 4.31  Navigation / Tabs ─────────────────────────────────────────────────
  // 4 variants: State
  async function buildTabs() {
    await createPage("Navigation / Tabs");
    const vs = NAV_STATES.map(({ state, bg, fg, bd, ring }) => ({
      name:      `State=${state}`,
      bg,
      fg,
      bd:        state === "Active" ? null : "border/subtle",
      ring,
      w:         0,
      h:         40,
      hToken:    "spacings/base-10",
      paddingH:  16,
      paddingV:  0,
      gap:       8,
      typo:      "caption-1",
      labelText: "Tab Label",
      radius:    null,
    }));
    buildSet("Tabs", vs);
  }

  // ── 4.32  Overlays / Drawer ─────────────────────────────────────────────────
  // 5 variants: Type
  async function buildDrawer() {
    await createPage("Overlays / Drawer");
    const vs = SEMANTIC_TYPES.map(({ type, bg, fg, bd }) => ({
      name:      `Type=${type}`,
      bg:        bg,
      fg:        fg,
      bd:        bd,
      ring:      false,
      w:         360,
      h:         480,
      paddingH:  24,
      paddingV:  24,
      gap:       16,
      typo:      "body-2",
      labelText: `${type} Drawer`,
      radius:    "radius/xl",
    }));
    buildSet("Drawer", vs);
  }

  // ── 4.33  Overlays / Dropdown ───────────────────────────────────────────────
  // 3 variants: State
  async function buildDropdown() {
    await createPage("Overlays / Dropdown");
    const vs = [
      { name: "State=Default",  bg: "background/default", fg: "foreground/default",  bd: "border/default", ring: false, labelText: "Select option" },
      { name: "State=Open",     bg: "background/default", fg: "foreground/default",  bd: "border/accent",  ring: true,  labelText: "Select option" },
      { name: "State=Disabled", bg: "background/default", fg: "foreground/disabled", bd: "border/subtle",  ring: false, labelText: "Select option" },
    ].map(v => ({ ...v, w: 240, h: 40, hToken: "spacings/base-10", paddingH: 16, paddingV: 0, gap: 8, typo: "caption-1", radius: "radius/lg" }));
    buildSet("Dropdown", vs);
  }

  // ── 4.34  Overlays / Dropdown Nav ───────────────────────────────────────────
  // 3 variants: State
  async function buildDropdownNav() {
    await createPage("Overlays / Dropdown Nav");
    const vs = [
      { name: "State=Default", bg: "background/default",                 fg: "foreground/default", bd: "border/default", ring: false, labelText: "Nav Dropdown" },
      { name: "State=Open",    bg: "background/default",                 fg: "foreground/default", bd: "border/accent",  ring: false, labelText: "Nav Dropdown" },
      { name: "State=Hover",   bg: "background/interactive-invert-hover",fg: "foreground/default", bd: "border/default", ring: false, labelText: "Nav Dropdown" },
    ].map(v => ({ ...v, w: 200, h: 40, hToken: "spacings/base-10", paddingH: 16, paddingV: 0, gap: 8, typo: "caption-1", radius: "radius/lg" }));
    buildSet("Dropdown Nav", vs);
  }

  // ── 4.35  Overlays / Modal ──────────────────────────────────────────────────
  // 5 variants: Type
  async function buildModal() {
    await createPage("Overlays / Modal");
    const vs = SEMANTIC_TYPES.map(({ type, bg, fg, bd }) => ({
      name:      `Type=${type}`,
      bg:        bg,
      fg:        fg,
      bd:        bd,
      ring:      false,
      w:         480,
      h:         320,
      paddingH:  32,
      paddingV:  32,
      gap:       16,
      typo:      "body-2",
      labelText: `${type} Modal`,
      radius:    "radius/xl",
    }));
    buildSet("Modal", vs);
  }

  // ── 4.36  Overlays / Toast ──────────────────────────────────────────────────
  // 5 variants: Type
  async function buildToast() {
    await createPage("Overlays / Toast");
    const vs = SEMANTIC_TYPES.map(({ type, bg, fg, bd }) => ({
      name:      `Type=${type}`,
      bg:        bg,
      fg:        fg,
      bd:        bd,
      ring:      false,
      w:         320,
      h:         0,
      paddingH:  16,
      paddingV:  12,
      gap:       8,
      typo:      "caption-1",
      labelText: `${type} notification message`,
      radius:    "radius/xl",
    }));
    buildSet("Toast", vs);
  }

  // ── 4.37  Overlays / Tooltip ────────────────────────────────────────────────
  // 5 variants: Type
  async function buildTooltip() {
    await createPage("Overlays / Tooltip");
    const vs = SEMANTIC_TYPES.map(({ type, bg, fg, bd }) => ({
      name:      `Type=${type}`,
      bg:        type === "Default" ? "background/accent" : bg,
      fg:        type === "Default" ? "foreground/default-invert" : fg,
      bd:        null,
      ring:      false,
      w:         0,
      h:         0,
      paddingH:  12,
      paddingV:  8,
      gap:       4,
      typo:      "caption-2",
      labelText: `${type} tooltip`,
      radius:    "radius/lg",
    }));
    buildSet("Tooltip", vs);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 5. MAIN — run all builders in page order
  // ═══════════════════════════════════════════════════════════════════════════

  await buildButton();
  await buildFlexButton();
  await buildIconButton();
  await buildLink();

  await buildAlertCard();
  await buildCard();
  await buildDivider();
  await buildEmptyState();
  await buildTable();
  await buildTag();
  await buildTile();

  await buildCheckbox();
  await buildDatePickerNative();
  await buildFileUploader();
  await buildPasswordInput();
  await buildRadio();
  await buildSegmentedControl();
  await buildSelectCard();
  await buildSelectInput();
  await buildTextArea();
  await buildTextInput();
  await buildToggle();

  await buildBadge();
  await buildProgressBar();
  await buildLoader();
  await buildSkeleton();
  await buildStepper();

  await buildBreadcrumb();
  await buildPagination();
  await buildSideBar();
  await buildTabs();

  await buildDrawer();
  await buildDropdown();
  await buildDropdownNav();
  await buildModal();
  await buildToast();
  await buildTooltip();

  // Return to first page
  await figma.setCurrentPageAsync(figma.root.children[0]);

  const msg = "✅ Design System — 37 composants générés sur 37 pages";
  if (typeof figma.notify === "function") figma.notify(msg);
  console.log(msg);

})().catch(err => console.error("❌ Erreur :", err));
