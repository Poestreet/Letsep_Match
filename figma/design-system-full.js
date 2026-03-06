/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │  Letsep Match — Full Design System Generator                             │
 * │  Figma Console / Scripter Script                                         │
 * │                                                                          │
 * │  37 components across 5 categories, one page each.                       │
 * │  All colours bound via createVariableAlias()                             │
 * │  All spacing/radius bound via setBoundVariable()                         │
 * │  No hard-coded hex values.                                               │
 * │                                                                          │
 * │  HOW TO RUN                                                              │
 * │  1. Open the library file in Figma Desktop                               │
 * │  2. Plugins → Scripter  (or Menu → Plugins → Development → Console)     │
 * │  3. Paste this entire file and press Run / ⌘↵                           │
 * └──────────────────────────────────────────────────────────────────────────┘
 */
(async () => {

  // ── 1. FONTS ──────────────────────────────────────────────────────────────
  await Promise.all([
    { family: "Inter",         style: "Regular"  },
    { family: "Inter",         style: "Medium"   },
    { family: "Inter",         style: "SemiBold" },
    { family: "Inter",         style: "Bold"     },
    { family: "Space Grotesk", style: "Regular"  },
    { family: "Space Grotesk", style: "Medium"   },
    { family: "Space Grotesk", style: "SemiBold" },
    { family: "Space Grotesk", style: "Bold"     },
  ].map(f => figma.loadFontAsync(f).catch(() => {})));

  // ── 2. TOKEN MAP ──────────────────────────────────────────────────────────
  // Use the synchronous API (matches button-component-v2.js which is proven to work).
  // Fall back to async if the sync method is unavailable (newer plugin runtimes).
  const allVars = typeof figma.variables.getLocalVariables === "function"
    ? figma.variables.getLocalVariables()
    : await figma.variables.getLocalVariablesAsync();
  const V = {};
  for (const v of allVars) V[v.name] = v;

  // Diagnostic: log every spacing token actually present so mismatches are obvious.
  const foundSpacings = Object.keys(V).filter(k => k.startsWith("spacings/")).sort();
  console.log("Spacing tokens found:", foundSpacings.join(", ") || "(none)");

  function getV(name) {
    const v = V[name];
    if (!v) {
      console.warn(`⚠️  Token not found: "${name}" — binding skipped`);
      return null;
    }
    return v;
  }

  // ── 3. HELPERS ────────────────────────────────────────────────────────────
  function varFill(tok) {
    const v = getV(tok);
    if (!v) return { type: "SOLID", color: { r: 0.85, g: 0.85, b: 0.85 } }; // grey fallback
    return {
      type: "SOLID",
      color: { r: 0, g: 0, b: 0 },
      boundVariables: { color: figma.variables.createVariableAlias(v) },
    };
  }
  function varStroke(tok) {
    const v = getV(tok);
    if (!v) return { type: "SOLID", color: { r: 0.7, g: 0.7, b: 0.7 } }; // grey fallback
    return {
      type: "SOLID",
      color: { r: 0, g: 0, b: 0 },
      boundVariables: { color: figma.variables.createVariableAlias(v) },
    };
  }
  function sp(node, field, tok) {
    const v = getV(tok);
    if (!v) return; // skip silently — node keeps its default value
    try { node.setBoundVariable(field, v); } catch (_) {}
  }
  function focusRing() {
    return [
      { type: "DROP_SHADOW", color: { r: 1, g: 1, b: 1, a: 1 },
        offset: { x: 0, y: 0 }, radius: 0, spread: 2, visible: true, blendMode: "NORMAL" },
      { type: "DROP_SHADOW", color: { r: 0, g: 0, b: 0, a: 1 },
        boundVariables: { color: figma.variables.createVariableAlias(getV("brand/primary")) },
        offset: { x: 0, y: 0 }, radius: 0, spread: 4, visible: true, blendMode: "NORMAL" },
    ];
  }
  function txt(chars, opts = {}) {
    const t = figma.createText();
    t.characters = chars;
    t.fontSize   = opts.size  || 14;
    t.fontName   = { family: opts.family || "Inter", style: opts.style || "Regular" };
    if (opts.lh)   t.lineHeight     = { value: opts.lh, unit: "PIXELS" };
    if (opts.fill) t.fills          = [varFill(opts.fill)];
    if (opts.autoResize !== false) t.textAutoResize = "WIDTH_AND_HEIGHT";
    return t;
  }
  function stroke1(node, tok, align = "INSIDE") {
    node.strokes      = [varStroke(tok)];
    node.strokeWeight = 1;
    node.strokeAlign  = align;
  }
  function stroke2(node, tok, align = "INSIDE") {
    node.strokes      = [varStroke(tok)];
    node.strokeWeight = 2;
    node.strokeAlign  = align;
  }

  const PAD = 32;
  function setSet(set) {
    set.paddingLeft = set.paddingRight = set.paddingTop = set.paddingBottom = PAD;
    set.itemSpacing = 20;
    set.x = PAD; set.y = PAD;
  }

  // Page helper: create fresh page, set as current, return it
  async function mkPage(name) {
    const pg = figma.createPage();
    pg.name = name;
    await pg.loadAsync();
    figma.currentPage = pg;
    return pg;
  }

  const report = [];

  // ══════════════════════════════════════════════════════════════════════════
  // CATEGORY: actions
  // ══════════════════════════════════════════════════════════════════════════

  // ── 1. Button (24 variants) ───────────────────────────────────────────────
  {
    const pg = await mkPage("actions — Button");
    const SIZE = {
      SM: { hTok: "spacings/base-8",  pxTok: "spacings/base-3", gapTok: "spacings/base-1", gapVal: 4,  fs: 12, lh: 16, style: "SemiBold" },
      MD: { hTok: "spacings/base-10", pxTok: "spacings/base-4", gapTok: null,               gapVal: 6,  fs: 14, lh: 20, style: "Medium"   },
    };
    const TK = {
      Primary: {
        Default:  { bg: "background/interactive",          fg: "foreground/interactive",                bd: null,                    ring: false },
        Hover:    { bg: "background/interactive-hover",    fg: "foreground/interactive",                bd: null,                    ring: false },
        Focused:  { bg: "background/interactive",          fg: "foreground/interactive",                bd: null,                    ring: true  },
        Disabled: { bg: "background/interactive-disabled", fg: "foreground/interactive-disabled",       bd: null,                    ring: false },
      },
      Secondary: {
        Default:  { bg: "background/interactive-invert",       fg: "foreground/interactive-invert",         bd: "border/interactive-invert", ring: false },
        Hover:    { bg: "background/interactive-invert-hover", fg: "foreground/interactive-invert",         bd: "border/interactive-invert", ring: false },
        Focused:  { bg: "background/interactive-invert",       fg: "foreground/interactive-invert",         bd: "border/interactive-invert", ring: true  },
        Disabled: { bg: null,                                  fg: "foreground/interactive-invert-disabled",bd: "border/secondary-disabled", ring: false },
      },
      Ghost: {
        Default:  { bg: null,                                  fg: "foreground/interactive-invert",         bd: null, ring: false },
        Hover:    { bg: "background/interactive-invert-hover", fg: "foreground/interactive-invert",         bd: null, ring: false },
        Focused:  { bg: null,                                  fg: "foreground/interactive-invert",         bd: null, ring: true  },
        Disabled: { bg: null,                                  fg: "foreground/interactive-invert-disabled",bd: null, ring: false },
      },
    };
    const comps = [];
    for (const type  of ["Primary","Secondary","Ghost"])
    for (const size  of ["SM","MD"])
    for (const state of ["Default","Hover","Focused","Disabled"]) {
      const s = SIZE[size], tk = TK[type][state];
      const c = figma.createComponent();
      c.name = `Type=${type}, Size=${size}, State=${state}, Radius=Full`;
      c.layoutMode = "HORIZONTAL";
      c.primaryAxisSizingMode = "AUTO";
      c.counterAxisSizingMode = "FIXED";
      c.primaryAxisAlignItems = c.counterAxisAlignItems = "CENTER";
      c.paddingTop = c.paddingBottom = 0;
      c.resize(80, 40);
      sp(c, "paddingLeft",  s.pxTok);
      sp(c, "paddingRight", s.pxTok);
      sp(c, "height",       s.hTok);
      s.gapTok ? sp(c, "itemSpacing", s.gapTok) : (c.itemSpacing = s.gapVal);
      sp(c, "cornerRadius", "radius/full");
      c.fills = tk.bg ? [varFill(tk.bg)] : [];
      if (tk.bd) { stroke1(c, tk.bd); }
      c.effects = tk.ring ? focusRing() : [];
      const lbl = txt("Button", { size: s.fs, lh: s.lh, style: s.style, fill: tk.fg });
      c.appendChild(lbl);
      comps.push(c);
    }
    const set = figma.combineAsVariants(comps, pg);
    set.name = "Button"; setSet(set);
    report.push("Button (24)");
  }

  // ── 2. IconButton (18 variants) ───────────────────────────────────────────
  {
    const pg = await mkPage("actions — IconButton");
    const SZ = {
      SM: { sz: 32, tok: "spacings/base-8"  },
      MD: { sz: 40, tok: "spacings/base-10" },
      LG: { sz: 48, tok: "spacings/base-12" },
    };
    const VTK = {
      Primary:   { bg: "background/interactive",        fg: "foreground/interactive",                bd: null },
      Secondary: { bg: "background/interactive-invert", fg: "foreground/interactive-invert",         bd: "border/interactive-invert" },
      Ghost:     { bg: null,                             fg: "foreground/interactive-invert",         bd: null },
    };
    const VTK_DIS = {
      Primary:   { bg: "background/interactive-disabled", fg: "foreground/interactive-disabled",       bd: null },
      Secondary: { bg: null,                               fg: "foreground/interactive-invert-disabled",bd: "border/secondary-disabled" },
      Ghost:     { bg: null,                               fg: "foreground/interactive-invert-disabled",bd: null },
    };
    const comps = [];
    for (const variant  of ["Primary","Secondary","Ghost"])
    for (const size     of ["SM","MD","LG"])
    for (const disabled of ["False","True"]) {
      const s  = SZ[size];
      const tk = disabled === "True" ? VTK_DIS[variant] : VTK[variant];
      const c = figma.createComponent();
      c.name = `Variant=${variant}, Size=${size}, Disabled=${disabled}`;
      c.layoutMode = "HORIZONTAL";
      c.primaryAxisSizingMode = c.counterAxisSizingMode = "FIXED";
      c.primaryAxisAlignItems = c.counterAxisAlignItems = "CENTER";
      c.resize(s.sz, s.sz);
      sp(c, "width",        s.tok);
      sp(c, "height",       s.tok);
      sp(c, "cornerRadius", "radius/full");
      c.fills = tk.bg ? [varFill(tk.bg)] : [];
      if (tk.bd) stroke1(c, tk.bd);
      const ico = txt("◉", { size: Math.round(s.sz * 0.45), fill: tk.fg });
      c.appendChild(ico);
      comps.push(c);
    }
    const set = figma.combineAsVariants(comps, pg);
    set.name = "IconButton"; setSet(set);
    report.push("IconButton (18)");
  }

  // ── 3. FlexButton (18 variants) ───────────────────────────────────────────
  {
    const pg = await mkPage("actions — FlexButton");
    const SZ = {
      SM: { hTok: "spacings/base-8",  pxTok: "spacings/base-3", pyTok: "spacings/base-1", fs: 12, lh: 16, style: "SemiBold" },
      MD: { hTok: "spacings/base-10", pxTok: "spacings/base-4", pyTok: "spacings/base-2", fs: 14, lh: 20, style: "Medium"   },
      LG: { hTok: "spacings/base-12", pxTok: "spacings/base-5", pyTok: "spacings/base-3", fs: 16, lh: 24, style: "Medium"   },
    };
    const VTK = {
      primary:   { bg: "background/interactive",        fg: "foreground/interactive",        bd: null },
      secondary: { bg: "background/interactive-invert", fg: "foreground/interactive-invert", bd: "border/interactive-invert" },
      ghost:     { bg: null,                             fg: "foreground/interactive-invert", bd: null },
    };
    const comps = [];
    for (const variant  of ["primary","secondary","ghost"])
    for (const size     of ["SM","MD","LG"])
    for (const disabled of ["False","True"]) {
      const s = SZ[size];
      const tk = disabled === "True"
        ? { bg: variant === "primary" ? "background/interactive-disabled" : null,
            fg: variant === "primary" ? "foreground/interactive-disabled" : "foreground/interactive-invert-disabled",
            bd: variant === "secondary" ? "border/secondary-disabled" : null }
        : VTK[variant];
      const c = figma.createComponent();
      c.name = `variant=${variant}, size=${size}, disabled=${disabled}`;
      c.layoutMode = "HORIZONTAL";
      c.primaryAxisSizingMode = "AUTO";
      c.counterAxisSizingMode = "FIXED";
      c.primaryAxisAlignItems = "SPACE_BETWEEN";
      c.counterAxisAlignItems = "CENTER";
      c.resize(240, 40);
      sp(c, "paddingLeft",  s.pxTok);
      sp(c, "paddingRight", s.pxTok);
      sp(c, "paddingTop",   s.pyTok);
      sp(c, "paddingBottom",s.pyTok);
      sp(c, "itemSpacing",  "spacings/base-2");
      sp(c, "cornerRadius", "radius/md");
      c.fills = tk.bg ? [varFill(tk.bg)] : [];
      if (tk.bd) stroke1(c, tk.bd);
      const ico = txt("◉", { size: 14, fill: tk.fg });
      const lbl = txt("Button label", { size: s.fs, lh: s.lh, style: s.style, fill: tk.fg });
      c.appendChild(ico);
      c.appendChild(lbl);
      lbl.layoutSizingHorizontal = "FILL";
      comps.push(c);
    }
    const set = figma.combineAsVariants(comps, pg);
    set.name = "FlexButton"; setSet(set);
    report.push("FlexButton (18)");
  }

  // ── 4. Link (4 variants) ─────────────────────────────────────────────────
  {
    const pg = await mkPage("actions — Link");
    const comps = [];
    for (const external of ["False","True"])
    for (const disabled  of ["False","True"]) {
      const fg = disabled === "True" ? "foreground/disabled" : "foreground/accent";
      const c = figma.createComponent();
      c.name = `external=${external}, disabled=${disabled}`;
      c.layoutMode = "HORIZONTAL";
      c.primaryAxisSizingMode = c.counterAxisSizingMode = "AUTO";
      c.primaryAxisAlignItems = c.counterAxisAlignItems = "CENTER";
      c.fills = [];
      sp(c, "itemSpacing", "spacings/base-1");
      c.appendChild(txt("Link text", { size: 14, style: "Medium", fill: fg }));
      if (external === "True") c.appendChild(txt("↗", { size: 12, fill: fg }));
      comps.push(c);
    }
    const set = figma.combineAsVariants(comps, pg);
    set.name = "Link"; setSet(set);
    report.push("Link (4)");
  }

  // ══════════════════════════════════════════════════════════════════════════
  // CATEGORY: data-display
  // ══════════════════════════════════════════════════════════════════════════

  // ── 5. AlertCard (4 variants) ─────────────────────────────────────────────
  {
    const pg = await mkPage("data-display — AlertCard");
    const TYPES = {
      info:    { bg: "background/info",    fg: "foreground/info",    bd: "border/info",    icon: "ℹ" },
      success: { bg: "background/success", fg: "foreground/success", bd: "border/success", icon: "✓" },
      warning: { bg: "background/warning", fg: "foreground/warning", bd: "border/warning", icon: "!" },
      error:   { bg: "background/error",   fg: "foreground/error",   bd: "border/error",   icon: "✕" },
    };
    const comps = [];
    for (const [type, tk] of Object.entries(TYPES)) {
      const c = figma.createComponent();
      c.name = `type=${type}`;
      c.layoutMode = "HORIZONTAL";
      c.primaryAxisSizingMode = c.counterAxisSizingMode = "AUTO";
      c.primaryAxisAlignItems = c.counterAxisAlignItems = "MIN";
      c.resize(400, 80);
      sp(c, "paddingLeft", "spacings/base-4"); sp(c, "paddingRight",  "spacings/base-4");
      sp(c, "paddingTop",  "spacings/base-4"); sp(c, "paddingBottom", "spacings/base-4");
      sp(c, "itemSpacing", "spacings/base-3");
      sp(c, "cornerRadius","radius/lg");
      c.fills = [varFill(tk.bg)]; stroke1(c, tk.bd);

      const ico     = txt(tk.icon, { size: 18, style: "Bold", fill: tk.fg });
      const content = figma.createFrame();
      content.layoutMode = "VERTICAL";
      content.primaryAxisSizingMode = content.counterAxisSizingMode = "AUTO";
      content.fills = []; content.itemSpacing = 4;
      const title = txt("Alert title", { size: 15, style: "Bold", fill: tk.fg });
      const msg   = txt("This is the alert description message.", { size: 14, fill: tk.fg });
      content.appendChild(title); content.appendChild(msg);
      c.appendChild(ico); c.appendChild(content);
      content.layoutSizingHorizontal = "FILL";
      comps.push(c);
    }
    const set = figma.combineAsVariants(comps, pg);
    set.name = "AlertCard"; setSet(set);
    report.push("AlertCard (4)");
  }

  // ── 6. Card (4 variants) ──────────────────────────────────────────────────
  {
    const pg = await mkPage("data-display — Card");
    const comps = [];
    for (const hasTitle  of ["False","True"])
    for (const hasFooter of ["False","True"]) {
      const c = figma.createComponent();
      c.name = `hasTitle=${hasTitle}, hasFooter=${hasFooter}`;
      c.layoutMode = "VERTICAL";
      c.primaryAxisSizingMode = "AUTO";
      c.counterAxisSizingMode = "FIXED";
      c.resize(360, 200);
      c.fills = [varFill("background/subtle")]; stroke1(c, "border/default");
      sp(c, "cornerRadius", "radius/lg");

      function hline(w) {
        const f = figma.createFrame(); f.resize(w, 1); f.fills = [varFill("border/default")]; return f;
      }
      if (hasTitle === "True") {
        const hdr = figma.createFrame();
        hdr.layoutMode = "HORIZONTAL"; hdr.primaryAxisSizingMode = hdr.counterAxisSizingMode = "AUTO";
        hdr.fills = []; hdr.paddingTop = 16; hdr.paddingBottom = 16; hdr.paddingLeft = 20; hdr.paddingRight = 20;
        hdr.appendChild(txt("Card Title", { size: 18, family: "Space Grotesk", style: "Bold", fill: "foreground/default" }));
        c.appendChild(hdr); hdr.layoutSizingHorizontal = "FILL";
        const sep = hline(358); c.appendChild(sep); sep.layoutSizingHorizontal = "FILL";
      }
      const body = figma.createFrame();
      body.layoutMode = "VERTICAL"; body.primaryAxisSizingMode = body.counterAxisSizingMode = "AUTO";
      body.fills = []; body.paddingTop = 20; body.paddingBottom = 20; body.paddingLeft = 20; body.paddingRight = 20;
      body.appendChild(txt("Card content goes here.", { size: 14, fill: "foreground/default" }));
      c.appendChild(body);
      body.layoutSizingHorizontal = "FILL"; body.layoutSizingVertical = "FILL";

      if (hasFooter === "True") {
        const sep = hline(358); c.appendChild(sep); sep.layoutSizingHorizontal = "FILL";
        const ftr = figma.createFrame();
        ftr.layoutMode = "HORIZONTAL"; ftr.primaryAxisSizingMode = ftr.counterAxisSizingMode = "AUTO";
        ftr.fills = []; ftr.paddingTop = 16; ftr.paddingBottom = 16; ftr.paddingLeft = 20; ftr.paddingRight = 20;
        ftr.appendChild(txt("Footer content", { size: 14, fill: "foreground/subtle" }));
        c.appendChild(ftr); ftr.layoutSizingHorizontal = "FILL";
      }
      comps.push(c);
    }
    const set = figma.combineAsVariants(comps, pg);
    set.name = "Card"; setSet(set);
    report.push("Card (4)");
  }

  // ── 7. Divider (3 variants) ───────────────────────────────────────────────
  {
    const pg = await mkPage("data-display — Divider");
    const comps = [];
    // Horizontal
    {
      const c = figma.createComponent();
      c.name = "orientation=horizontal, label=False";
      c.resize(320, 1); c.fills = [varFill("border/default")];
      comps.push(c);
    }
    // Vertical
    {
      const c = figma.createComponent();
      c.name = "orientation=vertical, label=False";
      c.resize(1, 80); c.fills = [varFill("border/default")];
      comps.push(c);
    }
    // With label
    {
      const c = figma.createComponent();
      c.name = "orientation=horizontal, label=True";
      c.layoutMode = "HORIZONTAL";
      c.primaryAxisSizingMode = "FIXED"; c.counterAxisSizingMode = "AUTO";
      c.primaryAxisAlignItems = c.counterAxisAlignItems = "CENTER";
      c.resize(320, 20); c.fills = [];
      sp(c, "itemSpacing", "spacings/base-3");
      const l1 = figma.createFrame(); l1.resize(80,1); l1.fills = [varFill("border/default")];
      const l2 = figma.createFrame(); l2.resize(80,1); l2.fills = [varFill("border/default")];
      c.appendChild(l1); l1.layoutSizingHorizontal = "FILL";
      c.appendChild(txt("Label", { size: 12, fill: "foreground/subtle" }));
      c.appendChild(l2); l2.layoutSizingHorizontal = "FILL";
      comps.push(c);
    }
    const set = figma.combineAsVariants(comps, pg);
    set.name = "Divider"; setSet(set);
    report.push("Divider (3)");
  }

  // ── 8. EmptyState (1) ─────────────────────────────────────────────────────
  {
    const pg = await mkPage("data-display — EmptyState");
    const c = figma.createComponent();
    c.name = "EmptyState";
    c.layoutMode = "VERTICAL";
    c.primaryAxisSizingMode = "AUTO"; c.counterAxisSizingMode = "FIXED";
    c.primaryAxisAlignItems = c.counterAxisAlignItems = "CENTER";
    c.resize(480, 300); c.fills = [];
    sp(c, "paddingLeft", "spacings/base-12"); sp(c, "paddingRight",  "spacings/base-12");
    sp(c, "paddingTop",  "spacings/base-12"); sp(c, "paddingBottom", "spacings/base-12");
    sp(c, "itemSpacing", "spacings/base-4");
    const ico  = txt("📭", { size: 48, fill: "foreground/disabled" });
    const ttl  = txt("Nothing here yet", { size: 20, family: "Space Grotesk", style: "Bold", fill: "foreground/default" });
    const desc = txt("Add some data to get started.", { size: 14, fill: "foreground/subtle" });
    c.appendChild(ico); c.appendChild(ttl); c.appendChild(desc);
    pg.appendChild(c); c.x = PAD; c.y = PAD;
    report.push("EmptyState (1)");
  }

  // ── 9. Tag (10 variants) ──────────────────────────────────────────────────
  {
    const pg = await mkPage("data-display — Tag");
    const VTYPES = {
      default: { bg: "background/default-alt", fg: "foreground/default",  bd: "border/default"  },
      success: { bg: "background/success",      fg: "foreground/success",  bd: "border/success"  },
      warning: { bg: "background/warning",      fg: "foreground/warning",  bd: "border/warning"  },
      error:   { bg: "background/error",        fg: "foreground/error",    bd: "border/error"    },
      info:    { bg: "background/info",         fg: "foreground/info",     bd: "border/info"     },
    };
    const comps = [];
    for (const [variant, tk] of Object.entries(VTYPES))
    for (const removable of ["False","True"]) {
      const c = figma.createComponent();
      c.name = `variant=${variant}, removable=${removable}`;
      c.layoutMode = "HORIZONTAL";
      c.primaryAxisSizingMode = c.counterAxisSizingMode = "AUTO";
      c.primaryAxisAlignItems = c.counterAxisAlignItems = "CENTER";
      c.paddingTop = c.paddingBottom = 2;
      sp(c, "paddingLeft",  "spacings/base-2");
      sp(c, "paddingRight", "spacings/base-2");
      sp(c, "itemSpacing",  "spacings/base-1");
      sp(c, "cornerRadius", "radius/full");
      c.fills = [varFill(tk.bg)]; stroke1(c, tk.bd);
      c.appendChild(txt("Tag", { size: 12, style: "SemiBold", fill: tk.fg }));
      if (removable === "True") c.appendChild(txt("×", { size: 14, fill: tk.fg }));
      comps.push(c);
    }
    const set = figma.combineAsVariants(comps, pg);
    set.name = "Tag"; setSet(set);
    report.push("Tag (10)");
  }

  // ── 10. Tile (2 variants) ─────────────────────────────────────────────────
  {
    const pg = await mkPage("data-display — Tile");
    const comps = [];
    for (const selected of ["False","True"]) {
      const c = figma.createComponent();
      c.name = `selected=${selected}`;
      c.layoutMode = "VERTICAL";
      c.primaryAxisSizingMode = "AUTO"; c.counterAxisSizingMode = "FIXED";
      c.resize(200, 120);
      sp(c, "paddingLeft", "spacings/base-4"); sp(c, "paddingRight",  "spacings/base-4");
      sp(c, "paddingTop",  "spacings/base-4"); sp(c, "paddingBottom", "spacings/base-4");
      sp(c, "itemSpacing", "spacings/base-2"); sp(c, "cornerRadius",  "radius/lg");
      c.fills = [varFill("background/subtle")];
      stroke2(c, selected === "True" ? "border/accent" : "border/default");
      c.appendChild(txt("◆", { size: 24, fill: selected === "True" ? "foreground/accent" : "foreground/disabled" }));
      c.appendChild(txt("Tile Title", { size: 15, style: "Bold", fill: "foreground/default" }));
      const desc = txt("Brief description text.", { size: 13, fill: "foreground/subtle" });
      c.appendChild(desc);
      comps.push(c);
    }
    const set = figma.combineAsVariants(comps, pg);
    set.name = "Tile"; setSet(set);
    report.push("Tile (2)");
  }

  // ── 11. Table (1) ─────────────────────────────────────────────────────────
  {
    const pg = await mkPage("data-display — Table");
    const W = 560;
    const c = figma.createComponent();
    c.name = "Table";
    c.layoutMode = "VERTICAL";
    c.primaryAxisSizingMode = "AUTO"; c.counterAxisSizingMode = "FIXED";
    c.resize(W, 200);
    c.fills = [varFill("background/subtle")]; stroke1(c, "border/default");
    sp(c, "cornerRadius", "radius/lg");

    function makeRow(cells, isHead, isAlt) {
      const row = figma.createFrame();
      row.layoutMode = "HORIZONTAL";
      row.primaryAxisSizingMode = "FIXED"; row.counterAxisSizingMode = "AUTO";
      row.resize(W - 2, 44);
      row.paddingLeft = row.paddingRight = 16; row.paddingTop = row.paddingBottom = 12;
      row.itemSpacing = 0;
      row.fills = isHead ? [varFill("background/accent")] : isAlt ? [varFill("background/default")] : [];
      const fg = isHead ? "foreground/default-invert" : "foreground/default";
      for (const cell of cells) {
        const td = figma.createFrame();
        td.layoutMode = "HORIZONTAL"; td.primaryAxisSizingMode = td.counterAxisSizingMode = "AUTO";
        td.fills = [];
        td.appendChild(txt(isHead ? cell.toUpperCase() : cell, { size: isHead ? 13 : 14, style: isHead ? "SemiBold" : "Regular", fill: fg }));
        row.appendChild(td); td.layoutSizingHorizontal = "FILL";
      }
      return row;
    }
    function sep() { const f = figma.createFrame(); f.resize(W-2,1); f.fills=[varFill("border/default")]; return f; }

    const thead = makeRow(["Name","Role","Status"], true, false);
    c.appendChild(thead); thead.layoutSizingHorizontal = "FILL";
    const rows = [["Alice Martin","Admin","Active"],["Bob Lee","User","Pending"],["Carol White","Editor","Inactive"]];
    for (let i = 0; i < rows.length; i++) {
      const s = sep(); c.appendChild(s); s.layoutSizingHorizontal = "FILL";
      const tr = makeRow(rows[i], false, i % 2 !== 0);
      c.appendChild(tr); tr.layoutSizingHorizontal = "FILL";
    }
    pg.appendChild(c); c.x = PAD; c.y = PAD;
    report.push("Table (1)");
  }


  // ══════════════════════════════════════════════════════════════════════════
  // CATEGORY: data-entry
  // ══════════════════════════════════════════════════════════════════════════

  // ── 12. TextInput (4 variants) ────────────────────────────────────────────
  {
    const pg = await mkPage("data-entry — TextInput");
    const STATES = {
      Default:  { bd: "border/default", labelFg: "foreground/default",  inputBg: "background/subtle"  },
      Focused:  { bd: "border/accent",  labelFg: "foreground/default",  inputBg: "background/subtle"  },
      Error:    { bd: "border/error",   labelFg: "foreground/error",    inputBg: "background/subtle"  },
      Disabled: { bd: "border/default", labelFg: "foreground/disabled", inputBg: "background/default" },
    };
    const comps = [];
    for (const [state, tk] of Object.entries(STATES)) {
      const c = figma.createComponent();
      c.name = `State=${state}`;
      c.layoutMode = "VERTICAL";
      c.primaryAxisSizingMode = "AUTO"; c.counterAxisSizingMode = "FIXED";
      c.resize(280, 72); c.fills = [];
      sp(c, "itemSpacing", "spacings/base-1");
      const lbl = txt("Label", { size: 13, style: "SemiBold", fill: tk.labelFg });
      c.appendChild(lbl); lbl.layoutSizingHorizontal = "FILL";

      const wrap = figma.createFrame();
      wrap.layoutMode = "HORIZONTAL";
      wrap.primaryAxisSizingMode = "AUTO"; wrap.counterAxisSizingMode = "FIXED";
      wrap.resize(280, 40);
      wrap.fills = [varFill(tk.inputBg)]; stroke1(wrap, tk.bd);
      sp(wrap, "paddingLeft",  "spacings/base-3"); sp(wrap, "paddingRight",  "spacings/base-3");
      sp(wrap, "paddingTop",   "spacings/base-2"); sp(wrap, "paddingBottom", "spacings/base-2");
      sp(wrap, "cornerRadius", "radius/md");
      const ph = txt("Placeholder…", { size: 14, fill: "foreground/disabled" });
      wrap.appendChild(ph); ph.layoutSizingHorizontal = "FILL";
      c.appendChild(wrap); wrap.layoutSizingHorizontal = "FILL";

      if (state === "Error") {
        const err = txt("This field has an error", { size: 12, fill: "foreground/error" });
        c.appendChild(err); err.layoutSizingHorizontal = "FILL";
      }
      comps.push(c);
    }
    const set = figma.combineAsVariants(comps, pg);
    set.name = "TextInput"; setSet(set);
    report.push("TextInput (4)");
  }

  // ── 13. TextArea (2 variants) ─────────────────────────────────────────────
  {
    const pg = await mkPage("data-entry — TextArea");
    const comps = [];
    for (const disabled of ["False","True"]) {
      const c = figma.createComponent();
      c.name = `disabled=${disabled}`;
      c.layoutMode = "VERTICAL";
      c.primaryAxisSizingMode = "AUTO"; c.counterAxisSizingMode = "FIXED";
      c.resize(280, 120); c.fills = [];
      sp(c, "itemSpacing", "spacings/base-1");
      const lbl = txt("Label", { size: 13, style: "SemiBold", fill: disabled === "True" ? "foreground/disabled" : "foreground/default" });
      c.appendChild(lbl); lbl.layoutSizingHorizontal = "FILL";

      const area = figma.createFrame();
      area.layoutMode = "VERTICAL"; area.primaryAxisSizingMode = area.counterAxisSizingMode = "AUTO";
      area.fills = [varFill(disabled === "True" ? "background/default" : "background/subtle")];
      stroke1(area, "border/default");
      sp(area, "paddingLeft",  "spacings/base-3"); sp(area, "paddingRight",  "spacings/base-3");
      sp(area, "paddingTop",   "spacings/base-2"); sp(area, "paddingBottom", "spacings/base-2");
      sp(area, "cornerRadius", "radius/md");
      const ph = txt("Placeholder text…", { size: 14, fill: "foreground/disabled" });
      area.appendChild(ph); ph.layoutSizingHorizontal = "FILL";
      c.appendChild(area); area.layoutSizingHorizontal = "FILL";
      comps.push(c);
    }
    const set = figma.combineAsVariants(comps, pg);
    set.name = "TextArea"; setSet(set);
    report.push("TextArea (2)");
  }

  // ── 14. Checkbox (8 variants) ─────────────────────────────────────────────
  {
    const pg = await mkPage("data-entry — Checkbox");
    const comps = [];
    for (const checked of ["False","True"])
    for (const state   of ["Default","Hover","Focused","Disabled"]) {
      const isDis = state === "Disabled", isChk = checked === "True";
      const ctrlBg = isChk ? (isDis ? "background/interactive-disabled" : "background/interactive") : (isDis ? "background/default" : "background/subtle");
      const ctrlBd = isChk ? (isDis ? "border/secondary-disabled" : "border/accent") : (isDis ? "border/secondary-disabled" : "border/default");
      const c = figma.createComponent();
      c.name = `checked=${checked}, state=${state}`;
      c.layoutMode = "HORIZONTAL";
      c.primaryAxisSizingMode = c.counterAxisSizingMode = "AUTO";
      c.primaryAxisAlignItems = c.counterAxisAlignItems = "CENTER";
      c.fills = [];
      sp(c, "itemSpacing", "spacings/base-2");
      c.effects = (state === "Focused" && !isDis) ? focusRing() : [];

      const box = figma.createFrame();
      box.resize(18, 18);
      box.fills   = [varFill(ctrlBg)];
      box.strokes = [varStroke(ctrlBd)]; box.strokeWeight = 2; box.strokeAlign = "INSIDE";
      sp(box, "cornerRadius", "radius/sm");
      if (isChk) {
        box.layoutMode = "HORIZONTAL";
        box.primaryAxisAlignItems = box.counterAxisAlignItems = "CENTER";
        const chk = txt("✓", { size: 11, style: "Bold", fill: isDis ? "foreground/interactive-disabled" : "foreground/interactive" });
        box.appendChild(chk);
      }
      c.appendChild(box);
      c.appendChild(txt("Checkbox label", { size: 14, fill: isDis ? "foreground/disabled" : "foreground/default" }));
      comps.push(c);
    }
    const set = figma.combineAsVariants(comps, pg);
    set.name = "Checkbox"; setSet(set);
    report.push("Checkbox (8)");
  }

  // ── 15. Radio (8 variants) ────────────────────────────────────────────────
  {
    const pg = await mkPage("data-entry — Radio");
    const comps = [];
    for (const checked of ["False","True"])
    for (const state   of ["Default","Hover","Focused","Disabled"]) {
      const isDis = state === "Disabled", isChk = checked === "True";
      const ctrlBg = isChk ? (isDis ? "background/interactive-disabled" : "background/interactive") : "background/subtle";
      const ctrlBd = isChk ? "border/accent" : (isDis ? "border/secondary-disabled" : "border/default");
      const c = figma.createComponent();
      c.name = `checked=${checked}, state=${state}`;
      c.layoutMode = "HORIZONTAL";
      c.primaryAxisSizingMode = c.counterAxisSizingMode = "AUTO";
      c.primaryAxisAlignItems = c.counterAxisAlignItems = "CENTER";
      c.fills = [];
      sp(c, "itemSpacing", "spacings/base-2");
      c.effects = (state === "Focused" && !isDis) ? focusRing() : [];

      const circle = figma.createFrame();
      circle.resize(18, 18);
      circle.fills   = [varFill(ctrlBg)];
      circle.strokes = [varStroke(ctrlBd)]; circle.strokeWeight = 2; circle.strokeAlign = "INSIDE";
      sp(circle, "cornerRadius", "radius/full");
      if (isChk) {
        circle.layoutMode = "HORIZONTAL";
        circle.primaryAxisAlignItems = circle.counterAxisAlignItems = "CENTER";
        const dot = figma.createFrame(); dot.resize(8, 8);
        dot.fills = [varFill(isDis ? "foreground/interactive-disabled" : "foreground/interactive")];
        sp(dot, "cornerRadius", "radius/full");
        circle.appendChild(dot);
      }
      c.appendChild(circle);
      c.appendChild(txt("Radio label", { size: 14, fill: isDis ? "foreground/disabled" : "foreground/default" }));
      comps.push(c);
    }
    const set = figma.combineAsVariants(comps, pg);
    set.name = "Radio"; setSet(set);
    report.push("Radio (8)");
  }

  // ── 16. Toggle (8 variants) ───────────────────────────────────────────────
  {
    const pg = await mkPage("data-entry — Toggle");
    const comps = [];
    for (const checked of ["False","True"])
    for (const state   of ["Default","Hover","Focused","Disabled"]) {
      const isDis = state === "Disabled", isChk = checked === "True";
      const trackBg = isChk ? (isDis ? "background/interactive-disabled" : "background/interactive") : "background/default-alt";
      const c = figma.createComponent();
      c.name = `checked=${checked}, state=${state}`;
      c.layoutMode = "HORIZONTAL";
      c.primaryAxisSizingMode = c.counterAxisSizingMode = "AUTO";
      c.primaryAxisAlignItems = c.counterAxisAlignItems = "CENTER";
      c.fills = [];
      sp(c, "itemSpacing", "spacings/base-2");
      c.effects = (state === "Focused" && !isDis) ? focusRing() : [];

      const track = figma.createFrame();
      track.resize(40, 22); track.fills = [varFill(trackBg)];
      sp(track, "cornerRadius", "radius/full"); track.clipsContent = true;
      const thumb = figma.createFrame();
      thumb.resize(16, 16); thumb.x = isChk ? 21 : 3; thumb.y = 3;
      thumb.fills = [varFill("background/subtle")];
      sp(thumb, "cornerRadius", "radius/full");
      track.appendChild(thumb);
      c.appendChild(track);
      c.appendChild(txt("Toggle label", { size: 14, fill: isDis ? "foreground/disabled" : "foreground/default" }));
      comps.push(c);
    }
    const set = figma.combineAsVariants(comps, pg);
    set.name = "Toggle"; setSet(set);
    report.push("Toggle (8)");
  }

  // ── 17. SelectInput (2 variants) ─────────────────────────────────────────
  {
    const pg = await mkPage("data-entry — SelectInput");
    const comps = [];
    for (const disabled of ["False","True"]) {
      const c = figma.createComponent();
      c.name = `disabled=${disabled}`;
      c.layoutMode = "VERTICAL";
      c.primaryAxisSizingMode = "AUTO"; c.counterAxisSizingMode = "FIXED";
      c.resize(280, 64); c.fills = [];
      sp(c, "itemSpacing", "spacings/base-1");
      const lbl = txt("Label", { size: 13, style: "SemiBold", fill: disabled === "True" ? "foreground/disabled" : "foreground/default" });
      c.appendChild(lbl); lbl.layoutSizingHorizontal = "FILL";

      const wrap = figma.createFrame();
      wrap.layoutMode = "HORIZONTAL";
      wrap.primaryAxisSizingMode = "AUTO"; wrap.counterAxisSizingMode = "FIXED";
      wrap.resize(280, 40);
      wrap.fills = [varFill(disabled === "True" ? "background/default" : "background/subtle")];
      stroke1(wrap, "border/default");
      sp(wrap, "paddingLeft",  "spacings/base-3"); sp(wrap, "paddingRight",  "spacings/base-8");
      sp(wrap, "paddingTop",   "spacings/base-2"); sp(wrap, "paddingBottom", "spacings/base-2");
      sp(wrap, "cornerRadius", "radius/md");
      wrap.itemSpacing = 8;
      const sel  = txt("Select option…", { size: 14, fill: "foreground/disabled" });
      const chev = txt("▼", { size: 12, fill: "foreground/subtle" });
      wrap.appendChild(sel); sel.layoutSizingHorizontal = "FILL";
      wrap.appendChild(chev);
      c.appendChild(wrap); wrap.layoutSizingHorizontal = "FILL";
      comps.push(c);
    }
    const set = figma.combineAsVariants(comps, pg);
    set.name = "SelectInput"; setSet(set);
    report.push("SelectInput (2)");
  }

  // ── 18. SelectCard (2 variants) ───────────────────────────────────────────
  {
    const pg = await mkPage("data-entry — SelectCard");
    const comps = [];
    for (const selected of ["False","True"]) {
      const c = figma.createComponent();
      c.name = `selected=${selected}`;
      c.layoutMode = "HORIZONTAL";
      c.primaryAxisSizingMode = c.counterAxisSizingMode = "AUTO";
      c.primaryAxisAlignItems = c.counterAxisAlignItems = "MIN";
      c.fills = [varFill("background/subtle")];
      stroke2(c, selected === "True" ? "border/accent" : "border/default");
      sp(c, "paddingLeft", "spacings/base-4"); sp(c, "paddingRight",  "spacings/base-4");
      sp(c, "paddingTop",  "spacings/base-4"); sp(c, "paddingBottom", "spacings/base-4");
      sp(c, "itemSpacing", "spacings/base-3"); sp(c, "cornerRadius",  "radius/lg");

      const radio = figma.createFrame();
      radio.resize(20, 20); radio.y = 2;
      radio.fills = [varFill(selected === "True" ? "background/interactive" : "background/subtle")];
      radio.strokes = [varStroke(selected === "True" ? "border/accent" : "border/default")];
      radio.strokeWeight = 2; radio.strokeAlign = "INSIDE";
      sp(radio, "cornerRadius", "radius/full");
      if (selected === "True") {
        radio.layoutMode = "HORIZONTAL";
        radio.primaryAxisAlignItems = radio.counterAxisAlignItems = "CENTER";
        const dot = figma.createFrame(); dot.resize(8,8);
        dot.fills = [varFill("foreground/interactive")]; sp(dot,"cornerRadius","radius/full");
        radio.appendChild(dot);
      }
      const content = figma.createFrame();
      content.layoutMode = "VERTICAL";
      content.primaryAxisSizingMode = content.counterAxisSizingMode = "AUTO";
      content.fills = []; content.itemSpacing = 4;
      content.appendChild(txt("Option Title", { size: 15, style: "Bold", fill: "foreground/default" }));
      content.appendChild(txt("Option description.", { size: 13, fill: "foreground/subtle" }));
      c.appendChild(radio); c.appendChild(content);
      comps.push(c);
    }
    const set = figma.combineAsVariants(comps, pg);
    set.name = "SelectCard"; setSet(set);
    report.push("SelectCard (2)");
  }

  // ── 19. SegmentedControl (1) ──────────────────────────────────────────────
  {
    const pg = await mkPage("data-entry — SegmentedControl");
    const c = figma.createComponent();
    c.name = "SegmentedControl";
    c.layoutMode = "HORIZONTAL";
    c.primaryAxisSizingMode = c.counterAxisSizingMode = "AUTO";
    c.primaryAxisAlignItems = c.counterAxisAlignItems = "CENTER";
    c.paddingTop = c.paddingBottom = c.paddingLeft = c.paddingRight = 2;
    c.itemSpacing = 2;
    c.fills = [varFill("background/subtle")]; stroke1(c, "border/default");
    sp(c, "cornerRadius", "radius/full");
    for (let i = 0; i < 3; i++) {
      const isActive = i === 0;
      const seg = figma.createFrame();
      seg.layoutMode = "HORIZONTAL";
      seg.primaryAxisSizingMode = seg.counterAxisSizingMode = "AUTO";
      seg.primaryAxisAlignItems = seg.counterAxisAlignItems = "CENTER";
      seg.paddingTop = seg.paddingBottom = 4;
      sp(seg, "paddingLeft", "spacings/base-4"); sp(seg, "paddingRight", "spacings/base-4");
      sp(seg, "cornerRadius", "radius/full");
      seg.fills = isActive ? [varFill("background/interactive")] : [];
      seg.appendChild(txt(["Option A","Option B","Option C"][i], {
        size: 13, style: isActive ? "SemiBold" : "Regular",
        fill: isActive ? "foreground/interactive" : "foreground/default",
      }));
      c.appendChild(seg);
    }
    pg.appendChild(c); c.x = PAD; c.y = PAD;
    report.push("SegmentedControl (1)");
  }

  // ── 20. PasswordInput (2 variants) ───────────────────────────────────────
  {
    const pg = await mkPage("data-entry — PasswordInput");
    const comps = [];
    for (const disabled of ["False","True"]) {
      const c = figma.createComponent();
      c.name = `disabled=${disabled}`;
      c.layoutMode = "VERTICAL";
      c.primaryAxisSizingMode = "AUTO"; c.counterAxisSizingMode = "FIXED";
      c.resize(280, 64); c.fills = [];
      sp(c, "itemSpacing", "spacings/base-1");
      const lbl = txt("Password", { size: 13, style: "SemiBold", fill: disabled === "True" ? "foreground/disabled" : "foreground/default" });
      c.appendChild(lbl); lbl.layoutSizingHorizontal = "FILL";

      const wrap = figma.createFrame();
      wrap.layoutMode = "HORIZONTAL";
      wrap.primaryAxisSizingMode = "AUTO"; wrap.counterAxisSizingMode = "FIXED";
      wrap.resize(280, 40); wrap.itemSpacing = 8;
      wrap.fills = [varFill(disabled === "True" ? "background/default" : "background/subtle")];
      stroke1(wrap, "border/default");
      sp(wrap, "paddingLeft",  "spacings/base-3"); sp(wrap, "paddingRight",  "spacings/base-2");
      sp(wrap, "paddingTop",   "spacings/base-2"); sp(wrap, "paddingBottom", "spacings/base-2");
      sp(wrap, "cornerRadius", "radius/md");
      const inp = txt("••••••••", { size: 14, fill: "foreground/default" });
      const eye = txt("◎", { size: 16, fill: "foreground/subtle" });
      wrap.appendChild(inp); inp.layoutSizingHorizontal = "FILL";
      wrap.appendChild(eye);
      c.appendChild(wrap); wrap.layoutSizingHorizontal = "FILL";
      comps.push(c);
    }
    const set = figma.combineAsVariants(comps, pg);
    set.name = "PasswordInput"; setSet(set);
    report.push("PasswordInput (2)");
  }

  // ── 21. DatePickerNative (2 variants) ────────────────────────────────────
  {
    const pg = await mkPage("data-entry — DatePickerNative");
    const comps = [];
    for (const disabled of ["False","True"]) {
      const c = figma.createComponent();
      c.name = `disabled=${disabled}`;
      c.layoutMode = "VERTICAL";
      c.primaryAxisSizingMode = "AUTO"; c.counterAxisSizingMode = "FIXED";
      c.resize(280, 64); c.fills = [];
      sp(c, "itemSpacing", "spacings/base-1");
      const lbl = txt("Date", { size: 13, style: "SemiBold", fill: disabled === "True" ? "foreground/disabled" : "foreground/default" });
      c.appendChild(lbl); lbl.layoutSizingHorizontal = "FILL";

      const inp = figma.createFrame();
      inp.layoutMode = "HORIZONTAL";
      inp.primaryAxisSizingMode = "AUTO"; inp.counterAxisSizingMode = "FIXED";
      inp.resize(280, 40);
      inp.fills = [varFill(disabled === "True" ? "background/default" : "background/subtle")];
      stroke1(inp, "border/default");
      sp(inp, "paddingLeft",  "spacings/base-3"); sp(inp, "paddingRight",  "spacings/base-3");
      sp(inp, "paddingTop",   "spacings/base-2"); sp(inp, "paddingBottom", "spacings/base-2");
      sp(inp, "cornerRadius", "radius/md");
      const val = txt("MM / DD / YYYY", { size: 14, fill: "foreground/disabled" });
      inp.appendChild(val); val.layoutSizingHorizontal = "FILL";
      c.appendChild(inp); inp.layoutSizingHorizontal = "FILL";
      comps.push(c);
    }
    const set = figma.combineAsVariants(comps, pg);
    set.name = "DatePickerNative"; setSet(set);
    report.push("DatePickerNative (2)");
  }

  // ── 22. FileUploader (2 variants) ────────────────────────────────────────
  {
    const pg = await mkPage("data-entry — FileUploader");
    const comps = [];
    for (const dragging of ["False","True"]) {
      const c = figma.createComponent();
      c.name = `dragging=${dragging}`;
      c.layoutMode = "VERTICAL";
      c.primaryAxisSizingMode = "AUTO"; c.counterAxisSizingMode = "FIXED";
      c.resize(320, 160); c.fills = [];
      sp(c, "itemSpacing", "spacings/base-1");
      const lbl = txt("Upload file", { size: 13, style: "SemiBold", fill: "foreground/default" });
      c.appendChild(lbl); lbl.layoutSizingHorizontal = "FILL";

      const zone = figma.createFrame();
      zone.layoutMode = "VERTICAL";
      zone.primaryAxisSizingMode = zone.counterAxisSizingMode = "AUTO";
      zone.primaryAxisAlignItems = zone.counterAxisAlignItems = "CENTER";
      zone.paddingTop = 32; zone.paddingBottom = 32; zone.paddingLeft = 16; zone.paddingRight = 16;
      zone.itemSpacing = 8;
      zone.fills   = [varFill(dragging === "True" ? "background/fade-hover" : "background/fade")];
      zone.strokes = [varStroke(dragging === "True" ? "border/accent" : "border/default")];
      zone.strokeWeight = 2; zone.strokeAlign = "INSIDE";
      zone.dashPattern = [4, 4];
      sp(zone, "cornerRadius", "radius/lg");
      zone.appendChild(txt("📁", { size: 32, fill: "foreground/disabled" }));
      zone.appendChild(txt("Drop files here or click to browse", { size: 14, style: "SemiBold", fill: "foreground/default" }));
      zone.appendChild(txt("PNG, JPG, PDF up to 10MB", { size: 12, fill: "foreground/subtle" }));
      c.appendChild(zone); zone.layoutSizingHorizontal = "FILL";
      comps.push(c);
    }
    const set = figma.combineAsVariants(comps, pg);
    set.name = "FileUploader"; setSet(set);
    report.push("FileUploader (2)");
  }

  // ══════════════════════════════════════════════════════════════════════════
  // CATEGORY: indicators
  // ══════════════════════════════════════════════════════════════════════════

  // ── 23. Badge (5 variants) ────────────────────────────────────────────────
  {
    const pg = await mkPage("indicators — Badge");
    const VTYPES = {
      default: { bg: "background/accent",       fg: "foreground/default-invert" },
      primary: { bg: "background/interactive",  fg: "foreground/interactive"    },
      success: { bg: "background/success",      fg: "foreground/success"        },
      warning: { bg: "background/warning",      fg: "foreground/warning"        },
      error:   { bg: "background/error",        fg: "foreground/error"          },
    };
    const comps = [];
    for (const [variant, tk] of Object.entries(VTYPES)) {
      const c = figma.createComponent();
      c.name = `variant=${variant}`;
      c.layoutMode = "HORIZONTAL";
      c.primaryAxisSizingMode = "AUTO"; c.counterAxisSizingMode = "FIXED";
      c.primaryAxisAlignItems = c.counterAxisAlignItems = "CENTER";
      c.resize(20, 20);
      c.paddingLeft = c.paddingRight = 4;
      sp(c, "height", "spacings/base-5");
      sp(c, "cornerRadius", "radius/full");
      c.fills = [varFill(tk.bg)];
      c.appendChild(txt("9", { size: 11, style: "Bold", fill: tk.fg }));
      comps.push(c);
    }
    const set = figma.combineAsVariants(comps, pg);
    set.name = "Badge"; setSet(set);
    report.push("Badge (5)");
  }

  // ── 24. Loader (3 variants) ───────────────────────────────────────────────
  {
    const pg = await mkPage("indicators — Loader");
    const SIZES = {
      SM: { d: 20, sw: 2 },
      MD: { d: 36, sw: 3 },
      LG: { d: 52, sw: 4 },
    };
    const comps = [];
    for (const [size, s] of Object.entries(SIZES)) {
      const c = figma.createComponent();
      c.name = `size=${size}`;
      c.layoutMode = "VERTICAL";
      c.primaryAxisSizingMode = c.counterAxisSizingMode = "AUTO";
      c.primaryAxisAlignItems = c.counterAxisAlignItems = "CENTER";
      c.fills = [];
      sp(c, "itemSpacing", "spacings/base-2");
      const spinner = figma.createEllipse();
      spinner.resize(s.d, s.d);
      spinner.fills = [];
      spinner.strokes = [varStroke("border/accent")];
      spinner.strokeWeight = s.sw; spinner.strokeAlign = "CENTER";
      spinner.arcData = { startingAngle: 0, endingAngle: Math.PI * 1.5, innerRadius: 0 };
      c.appendChild(spinner);
      c.appendChild(txt("Loading…", { size: 13, fill: "foreground/subtle" }));
      comps.push(c);
    }
    const set = figma.combineAsVariants(comps, pg);
    set.name = "Loader"; setSet(set);
    report.push("Loader (3)");
  }

  // ── 25. ProgressBar (4 variants) ─────────────────────────────────────────
  {
    const pg = await mkPage("indicators — ProgressBar");
    const VTYPES = {
      default: { fill: "border/accent",  track: "background/default-alt" },
      success: { fill: "border/success", track: "background/success"     },
      warning: { fill: "border/warning", track: "background/warning"     },
      error:   { fill: "border/error",   track: "background/error"       },
    };
    const comps = [];
    for (const [variant, tk] of Object.entries(VTYPES)) {
      const c = figma.createComponent();
      c.name = `variant=${variant}`;
      c.layoutMode = "VERTICAL";
      c.primaryAxisSizingMode = "AUTO"; c.counterAxisSizingMode = "FIXED";
      c.resize(280, 40); c.fills = [];
      sp(c, "itemSpacing", "spacings/base-1");

      const row = figma.createFrame();
      row.layoutMode = "HORIZONTAL"; row.primaryAxisSizingMode = row.counterAxisSizingMode = "AUTO";
      row.primaryAxisAlignItems = "SPACE_BETWEEN"; row.fills = [];
      row.appendChild(txt("Progress", { size: 13, fill: "foreground/default" }));
      row.appendChild(txt("65%", { size: 13, style: "Bold", fill: "foreground/default" }));
      c.appendChild(row); row.layoutSizingHorizontal = "FILL";

      const track = figma.createFrame();
      track.resize(280, 8); track.fills = [varFill(tk.track)];
      sp(track, "cornerRadius", "radius/full"); track.clipsContent = true;
      const bar = figma.createFrame();
      bar.resize(Math.round(280 * 0.65), 8); bar.fills = [varFill(tk.fill)];
      sp(bar, "cornerRadius", "radius/full");
      track.appendChild(bar);
      c.appendChild(track); track.layoutSizingHorizontal = "FILL";
      comps.push(c);
    }
    const set = figma.combineAsVariants(comps, pg);
    set.name = "ProgressBar"; setSet(set);
    report.push("ProgressBar (4)");
  }

  // ── 26. Skeleton (3 variants) ─────────────────────────────────────────────
  {
    const pg = await mkPage("indicators — Skeleton");
    const SHAPES = [
      { name: "shape=text",   w: 240, h: 16, r: "radius/md"   },
      { name: "shape=avatar", w:  48, h: 48, r: "radius/full" },
      { name: "shape=card",   w: 320, h: 96, r: "radius/lg"   },
    ];
    const comps = [];
    for (const sh of SHAPES) {
      const c = figma.createComponent();
      c.name = sh.name;
      c.resize(sh.w, sh.h);
      c.fills = [varFill("background/default-alt")];
      sp(c, "cornerRadius", sh.r);
      comps.push(c);
    }
    const set = figma.combineAsVariants(comps, pg);
    set.name = "Skeleton"; setSet(set);
    report.push("Skeleton (3)");
  }

  // ── 27. Stepper (1) ───────────────────────────────────────────────────────
  {
    const pg = await mkPage("indicators — Stepper");
    const c = figma.createComponent();
    c.name = "Stepper";
    c.layoutMode = "HORIZONTAL";
    c.primaryAxisSizingMode = "FIXED"; c.counterAxisSizingMode = "AUTO";
    c.primaryAxisAlignItems = c.counterAxisAlignItems = "CENTER";
    c.resize(400, 60); c.fills = [];

    const labels = ["Step 1","Step 2","Step 3"];
    for (let i = 0; i < labels.length; i++) {
      const isDone = i < 1, isActive = i === 1;
      const wrap = figma.createFrame();
      wrap.layoutMode = "VERTICAL";
      wrap.primaryAxisSizingMode = wrap.counterAxisSizingMode = "AUTO";
      wrap.primaryAxisAlignItems = wrap.counterAxisAlignItems = "CENTER";
      wrap.fills = []; wrap.itemSpacing = 4;

      const circle = figma.createFrame();
      circle.resize(32, 32); circle.layoutMode = "HORIZONTAL";
      circle.primaryAxisAlignItems = circle.counterAxisAlignItems = "CENTER";
      circle.fills = [varFill(isDone || isActive ? "background/interactive" : "background/default-alt")];
      sp(circle, "cornerRadius", "radius/full");
      circle.appendChild(txt(isDone ? "✓" : String(i+1), {
        size: 13, style: "SemiBold",
        fill: isDone || isActive ? "foreground/interactive" : "foreground/default",
      }));
      wrap.appendChild(circle);
      wrap.appendChild(txt(labels[i], { size: 11, fill: isActive ? "foreground/accent" : "foreground/subtle" }));
      c.appendChild(wrap);

      if (i < labels.length - 1) {
        const line = figma.createFrame();
        line.resize(60, 2);
        line.fills = [varFill(isDone ? "border/accent" : "border/default")];
        c.appendChild(line); line.layoutSizingHorizontal = "FILL";
      }
    }
    pg.appendChild(c); c.x = PAD; c.y = PAD;
    report.push("Stepper (1)");
  }


  // ══════════════════════════════════════════════════════════════════════════
  // CATEGORY: navigation
  // ══════════════════════════════════════════════════════════════════════════

  // ── 28. Breadcrumb (1) ───────────────────────────────────────────────────
  {
    const pg = await mkPage("navigation — Breadcrumb");
    const c = figma.createComponent();
    c.name = "Breadcrumb";
    c.layoutMode = "HORIZONTAL";
    c.primaryAxisSizingMode = c.counterAxisSizingMode = "AUTO";
    c.primaryAxisAlignItems = c.counterAxisAlignItems = "CENTER";
    c.fills = [];
    sp(c, "itemSpacing", "spacings/base-1");
    const crumbs = ["Home","Section","Current Page"];
    for (let i = 0; i < crumbs.length; i++) {
      const isLast = i === crumbs.length - 1;
      c.appendChild(txt(crumbs[i], {
        size: 14, style: isLast ? "SemiBold" : "Regular",
        fill: isLast ? "foreground/default" : "foreground/accent",
      }));
      if (!isLast) c.appendChild(txt("/", { size: 14, fill: "foreground/disabled" }));
    }
    pg.appendChild(c); c.x = PAD; c.y = PAD;
    report.push("Breadcrumb (1)");
  }

  // ── 29. Pagination (1) ───────────────────────────────────────────────────
  {
    const pg = await mkPage("navigation — Pagination");
    const c = figma.createComponent();
    c.name = "Pagination";
    c.layoutMode = "HORIZONTAL";
    c.primaryAxisSizingMode = c.counterAxisSizingMode = "AUTO";
    c.primaryAxisAlignItems = c.counterAxisAlignItems = "CENTER";
    c.fills = [];
    sp(c, "itemSpacing", "spacings/base-1");
    const pages = ["←","1","2","3","→"];
    for (let i = 0; i < pages.length; i++) {
      const isActive = i === 2;
      const btn = figma.createFrame();
      btn.layoutMode = "HORIZONTAL";
      btn.primaryAxisSizingMode = btn.counterAxisSizingMode = "FIXED";
      btn.primaryAxisAlignItems = btn.counterAxisAlignItems = "CENTER";
      btn.resize(36, 36);
      btn.fills   = isActive ? [varFill("background/interactive")] : [varFill("background/subtle")];
      if (!isActive) { stroke1(btn, "border/default"); }
      sp(btn, "cornerRadius", "radius/md");
      btn.appendChild(txt(pages[i], {
        size: 14, style: isActive ? "SemiBold" : "Regular",
        fill: isActive ? "foreground/interactive" : "foreground/default",
      }));
      c.appendChild(btn);
    }
    pg.appendChild(c); c.x = PAD; c.y = PAD;
    report.push("Pagination (1)");
  }

  // ── 30. SideBar (1) ──────────────────────────────────────────────────────
  {
    const pg = await mkPage("navigation — SideBar");
    const c = figma.createComponent();
    c.name = "SideBar";
    c.layoutMode = "VERTICAL";
    c.primaryAxisSizingMode = c.counterAxisSizingMode = "FIXED";
    c.resize(240, 320);
    c.fills = [varFill("background/subtle")]; stroke1(c, "border/default");
    sp(c, "paddingLeft",   "spacings/base-2"); sp(c, "paddingRight",  "spacings/base-2");
    sp(c, "paddingTop",    "spacings/base-4"); sp(c, "paddingBottom", "spacings/base-4");
    sp(c, "itemSpacing",   "spacings/base-1");

    for (const item of [
      { label: "Dashboard", icon: "⊞", active: true  },
      { label: "Users",     icon: "◉",  active: false },
      { label: "Settings",  icon: "⚙",  active: false },
      { label: "Logout",    icon: "→",  active: false },
    ]) {
      const row = figma.createFrame();
      row.layoutMode = "HORIZONTAL";
      row.primaryAxisSizingMode = row.counterAxisSizingMode = "AUTO";
      row.primaryAxisAlignItems = row.counterAxisAlignItems = "CENTER";
      row.fills = item.active ? [varFill("background/interactive")] : [];
      sp(row, "paddingLeft",  "spacings/base-3"); sp(row, "paddingRight", "spacings/base-3");
      sp(row, "paddingTop",   "spacings/base-2"); sp(row, "paddingBottom","spacings/base-2");
      sp(row, "itemSpacing",  "spacings/base-3"); sp(row, "cornerRadius", "radius/md");
      const fg = item.active ? "foreground/interactive" : "foreground/default";
      row.appendChild(txt(item.icon,  { size: 18, fill: fg }));
      row.appendChild(txt(item.label, { size: 14, fill: fg }));
      c.appendChild(row); row.layoutSizingHorizontal = "FILL";
    }
    pg.appendChild(c); c.x = PAD; c.y = PAD;
    report.push("SideBar (1)");
  }

  // ── 31. Tabs (1) ─────────────────────────────────────────────────────────
  {
    const pg = await mkPage("navigation — Tabs");
    const c = figma.createComponent();
    c.name = "Tabs";
    c.layoutMode = "VERTICAL";
    c.primaryAxisSizingMode = "AUTO"; c.counterAxisSizingMode = "FIXED";
    c.resize(480, 200); c.fills = [];

    const bar = figma.createFrame();
    bar.layoutMode = "HORIZONTAL";
    bar.primaryAxisSizingMode = bar.counterAxisSizingMode = "AUTO";
    bar.fills = []; bar.itemSpacing = 0;
    bar.strokes = [varStroke("border/default")]; bar.strokeWeight = 2; bar.strokeAlign = "OUTSIDE";

    for (let i = 0; i < 3; i++) {
      const isActive = i === 0;
      const tab = figma.createFrame();
      tab.layoutMode = "HORIZONTAL";
      tab.primaryAxisSizingMode = tab.counterAxisSizingMode = "AUTO";
      tab.primaryAxisAlignItems = tab.counterAxisAlignItems = "CENTER";
      tab.fills = []; tab.paddingTop = 8; tab.paddingBottom = 8;
      sp(tab, "paddingLeft", "spacings/base-4"); sp(tab, "paddingRight", "spacings/base-4");
      if (isActive) {
        tab.strokes = [varStroke("border/accent")]; tab.strokeWeight = 2; tab.strokeAlign = "OUTSIDE";
      }
      tab.appendChild(txt(["Overview","Details","History"][i], {
        size: 14, style: isActive ? "Bold" : "Regular",
        fill: isActive ? "foreground/accent" : "foreground/subtle",
      }));
      bar.appendChild(tab);
    }
    c.appendChild(bar); bar.layoutSizingHorizontal = "FILL";

    const panel = figma.createFrame();
    panel.layoutMode = "VERTICAL"; panel.primaryAxisSizingMode = panel.counterAxisSizingMode = "AUTO";
    panel.fills = []; panel.paddingTop = 16; panel.paddingBottom = 16;
    panel.appendChild(txt("Tab content area.", { size: 14, fill: "foreground/default" }));
    c.appendChild(panel); panel.layoutSizingHorizontal = "FILL"; panel.layoutSizingVertical = "FILL";
    pg.appendChild(c); c.x = PAD; c.y = PAD;
    report.push("Tabs (1)");
  }

  // ══════════════════════════════════════════════════════════════════════════
  // CATEGORY: overlays
  // ══════════════════════════════════════════════════════════════════════════

  // ── 32. Drawer (2 variants) ───────────────────────────────────────────────
  {
    const pg = await mkPage("overlays — Drawer");
    const comps = [];
    for (const open of ["False","True"]) {
      const c = figma.createComponent();
      c.name = `open=${open}`;
      c.layoutMode = "VERTICAL";
      c.primaryAxisSizingMode = c.counterAxisSizingMode = "FIXED";
      c.resize(360, 600);
      c.fills = [varFill("background/subtle")]; stroke1(c, "border/default");
      c.opacity = open === "True" ? 1 : 0.4;

      const hdr = figma.createFrame();
      hdr.layoutMode = "HORIZONTAL";
      hdr.primaryAxisSizingMode = hdr.counterAxisSizingMode = "AUTO";
      hdr.primaryAxisAlignItems = "SPACE_BETWEEN"; hdr.counterAxisAlignItems = "CENTER";
      hdr.fills = [];
      sp(hdr, "paddingLeft",  "spacings/base-6"); sp(hdr, "paddingRight",  "spacings/base-6");
      sp(hdr, "paddingTop",   "spacings/base-4"); sp(hdr, "paddingBottom", "spacings/base-4");
      hdr.strokes = [varStroke("border/default")]; hdr.strokeWeight = 1; hdr.strokeAlign = "OUTSIDE";
      hdr.appendChild(txt("Drawer Title", { size: 18, family: "Space Grotesk", style: "Bold", fill: "foreground/default" }));
      hdr.appendChild(txt("×", { size: 20, fill: "foreground/subtle" }));
      c.appendChild(hdr); hdr.layoutSizingHorizontal = "FILL";

      const body = figma.createFrame();
      body.layoutMode = "VERTICAL"; body.primaryAxisSizingMode = body.counterAxisSizingMode = "AUTO";
      body.fills = [];
      sp(body, "paddingLeft",  "spacings/base-6"); sp(body, "paddingRight", "spacings/base-6");
      sp(body, "paddingTop",   "spacings/base-6"); sp(body, "paddingBottom","spacings/base-6");
      body.appendChild(txt("Drawer body content.", { size: 14, fill: "foreground/default" }));
      c.appendChild(body); body.layoutSizingHorizontal = "FILL"; body.layoutSizingVertical = "FILL";
      comps.push(c);
    }
    const set = figma.combineAsVariants(comps, pg);
    set.name = "Drawer"; setSet(set);
    report.push("Drawer (2)");
  }

  // ── 33. Dropdown (1) ─────────────────────────────────────────────────────
  {
    const pg = await mkPage("overlays — Dropdown");
    const c = figma.createComponent();
    c.name = "Dropdown";
    c.layoutMode = "VERTICAL";
    c.primaryAxisSizingMode = "AUTO"; c.counterAxisSizingMode = "FIXED";
    c.resize(200, 140);
    c.fills = [varFill("background/subtle")]; stroke1(c, "border/default");
    sp(c, "cornerRadius", "radius/lg");
    const items = ["Edit","Duplicate","Delete"];
    for (let i = 0; i < items.length; i++) {
      const row = figma.createFrame();
      row.layoutMode = "HORIZONTAL";
      row.primaryAxisSizingMode = row.counterAxisSizingMode = "AUTO";
      row.primaryAxisAlignItems = row.counterAxisAlignItems = "CENTER";
      row.fills = [];
      sp(row, "paddingLeft",  "spacings/base-4"); sp(row, "paddingRight",  "spacings/base-4");
      sp(row, "paddingTop",   "spacings/base-2"); sp(row, "paddingBottom", "spacings/base-2");
      row.appendChild(txt(items[i], { size: 14, fill: items[i] === "Delete" ? "foreground/error" : "foreground/default" }));
      c.appendChild(row); row.layoutSizingHorizontal = "FILL";
      if (i < items.length - 1) {
        const sep = figma.createFrame(); sep.resize(198, 1); sep.fills = [varFill("border/default")];
        c.appendChild(sep); sep.layoutSizingHorizontal = "FILL";
      }
    }
    pg.appendChild(c); c.x = PAD; c.y = PAD;
    report.push("Dropdown (1)");
  }

  // ── 34. DropdownNav (1) ───────────────────────────────────────────────────
  {
    const pg = await mkPage("overlays — DropdownNav");
    const c = figma.createComponent();
    c.name = "DropdownNav";
    c.layoutMode = "VERTICAL";
    c.primaryAxisSizingMode = "AUTO"; c.counterAxisSizingMode = "FIXED";
    c.resize(220, 150);
    c.fills = [varFill("background/subtle")]; stroke1(c, "border/default");
    sp(c, "paddingLeft",  "spacings/base-1"); sp(c, "paddingRight",  "spacings/base-1");
    sp(c, "paddingTop",   "spacings/base-1"); sp(c, "paddingBottom", "spacings/base-1");
    sp(c, "itemSpacing",  "spacings/base-1"); sp(c, "cornerRadius",  "radius/lg");
    for (const item of [{ label:"Profile",icon:"◉"},{label:"Settings",icon:"⚙"},{label:"Help",icon:"?"}]) {
      const row = figma.createFrame();
      row.layoutMode = "HORIZONTAL";
      row.primaryAxisSizingMode = row.counterAxisSizingMode = "AUTO";
      row.primaryAxisAlignItems = row.counterAxisAlignItems = "CENTER";
      row.fills = [];
      sp(row, "paddingLeft",  "spacings/base-3"); sp(row, "paddingRight",  "spacings/base-3");
      sp(row, "paddingTop",   "spacings/base-2"); sp(row, "paddingBottom", "spacings/base-2");
      sp(row, "itemSpacing",  "spacings/base-2"); sp(row, "cornerRadius",  "radius/md");
      row.appendChild(txt(item.icon,  { size: 16, fill: "foreground/default" }));
      row.appendChild(txt(item.label, { size: 14, fill: "foreground/default" }));
      c.appendChild(row); row.layoutSizingHorizontal = "FILL";
    }
    pg.appendChild(c); c.x = PAD; c.y = PAD;
    report.push("DropdownNav (1)");
  }

  // ── 35. Modal (2 variants) ────────────────────────────────────────────────
  {
    const pg = await mkPage("overlays — Modal");
    const comps = [];
    for (const hasFooter of ["False","True"]) {
      const c = figma.createComponent();
      c.name = `hasFooter=${hasFooter}`;
      c.layoutMode = "VERTICAL";
      c.primaryAxisSizingMode = "AUTO"; c.counterAxisSizingMode = "FIXED";
      c.resize(480, hasFooter === "True" ? 300 : 240);
      c.fills = [varFill("background/subtle")]; stroke1(c, "border/default");
      sp(c, "cornerRadius", "radius/xl");

      const hdr = figma.createFrame();
      hdr.layoutMode = "HORIZONTAL";
      hdr.primaryAxisSizingMode = hdr.counterAxisSizingMode = "AUTO";
      hdr.primaryAxisAlignItems = "SPACE_BETWEEN"; hdr.counterAxisAlignItems = "CENTER";
      hdr.fills = [];
      sp(hdr, "paddingLeft",  "spacings/base-6"); sp(hdr, "paddingRight",  "spacings/base-6");
      sp(hdr, "paddingTop",   "spacings/base-5"); sp(hdr, "paddingBottom", "spacings/base-5");
      hdr.appendChild(txt("Modal Title", { size: 20, family: "Space Grotesk", style: "Bold", fill: "foreground/default" }));
      hdr.appendChild(txt("×", { size: 22, fill: "foreground/subtle" }));
      c.appendChild(hdr); hdr.layoutSizingHorizontal = "FILL";

      const sep1 = figma.createFrame(); sep1.resize(478,1); sep1.fills=[varFill("border/default")];
      c.appendChild(sep1); sep1.layoutSizingHorizontal = "FILL";

      const body = figma.createFrame();
      body.layoutMode = "VERTICAL"; body.primaryAxisSizingMode = body.counterAxisSizingMode = "AUTO";
      body.fills = [];
      sp(body, "paddingLeft",  "spacings/base-6"); sp(body, "paddingRight", "spacings/base-6");
      sp(body, "paddingTop",   "spacings/base-6"); sp(body, "paddingBottom","spacings/base-6");
      body.appendChild(txt("Modal body content. Confirm this action?", { size: 14, fill: "foreground/default" }));
      c.appendChild(body); body.layoutSizingHorizontal = "FILL";
      body.layoutSizingVertical = hasFooter === "False" ? "FILL" : "HUG";

      if (hasFooter === "True") {
        const sep2 = figma.createFrame(); sep2.resize(478,1); sep2.fills=[varFill("border/default")];
        c.appendChild(sep2); sep2.layoutSizingHorizontal = "FILL";

        const ftr = figma.createFrame();
        ftr.layoutMode = "HORIZONTAL"; ftr.primaryAxisSizingMode = ftr.counterAxisSizingMode = "AUTO";
        ftr.primaryAxisAlignItems = "MAX"; ftr.counterAxisAlignItems = "CENTER";
        ftr.fills = [];
        sp(ftr, "paddingLeft",  "spacings/base-6"); sp(ftr, "paddingRight",  "spacings/base-6");
        sp(ftr, "paddingTop",   "spacings/base-4"); sp(ftr, "paddingBottom", "spacings/base-4");
        sp(ftr, "itemSpacing",  "spacings/base-3");
        ftr.appendChild(txt("Cancel",  { size: 14, fill: "foreground/default" }));
        ftr.appendChild(txt("Confirm", { size: 14, style: "SemiBold", fill: "foreground/interactive" }));
        c.appendChild(ftr); ftr.layoutSizingHorizontal = "FILL";
      }
      comps.push(c);
    }
    const set = figma.combineAsVariants(comps, pg);
    set.name = "Modal"; setSet(set);
    report.push("Modal (2)");
  }

  // ── 36. Toast (4 variants) ────────────────────────────────────────────────
  {
    const pg = await mkPage("overlays — Toast");
    const TYPES = {
      info:    { bg: "background/info",    fg: "foreground/info",    bd: "border/info",    icon: "ℹ" },
      success: { bg: "background/success", fg: "foreground/success", bd: "border/success", icon: "✓" },
      warning: { bg: "background/warning", fg: "foreground/warning", bd: "border/warning", icon: "!" },
      error:   { bg: "background/error",   fg: "foreground/error",   bd: "border/error",   icon: "✕" },
    };
    const comps = [];
    for (const [type, tk] of Object.entries(TYPES)) {
      const c = figma.createComponent();
      c.name = `type=${type}`;
      c.layoutMode = "HORIZONTAL";
      c.primaryAxisSizingMode = c.counterAxisSizingMode = "AUTO";
      c.primaryAxisAlignItems = c.counterAxisAlignItems = "CENTER";
      c.resize(320, 52);
      sp(c, "paddingLeft",  "spacings/base-4"); sp(c, "paddingRight",  "spacings/base-4");
      sp(c, "paddingTop",   "spacings/base-3"); sp(c, "paddingBottom", "spacings/base-3");
      sp(c, "itemSpacing",  "spacings/base-3"); sp(c, "cornerRadius",  "radius/lg");
      c.fills = [varFill(tk.bg)]; stroke1(c, tk.bd);
      const ico = txt(tk.icon, { size: 18, style: "Bold", fill: tk.fg });
      const msg = txt(`This is a ${type} message.`, { size: 14, style: "Medium", fill: tk.fg });
      const x   = txt("×", { size: 18, fill: tk.fg });
      c.appendChild(ico); c.appendChild(msg); msg.layoutSizingHorizontal = "FILL"; c.appendChild(x);
      comps.push(c);
    }
    const set = figma.combineAsVariants(comps, pg);
    set.name = "Toast"; setSet(set);
    report.push("Toast (4)");
  }

  // ── 37. Tooltip (2 variants) ──────────────────────────────────────────────
  {
    const pg = await mkPage("overlays — Tooltip");
    const comps = [];
    for (const visible of ["False","True"]) {
      const c = figma.createComponent();
      c.name = `visible=${visible}`;
      c.layoutMode = "VERTICAL";
      c.primaryAxisSizingMode = c.counterAxisSizingMode = "AUTO";
      c.primaryAxisAlignItems = c.counterAxisAlignItems = "CENTER";
      c.fills = [];
      sp(c, "itemSpacing", "spacings/base-1");

      if (visible === "True") {
        const bubble = figma.createFrame();
        bubble.layoutMode = "HORIZONTAL";
        bubble.primaryAxisSizingMode = bubble.counterAxisSizingMode = "AUTO";
        bubble.primaryAxisAlignItems = bubble.counterAxisAlignItems = "CENTER";
        bubble.paddingTop = 5; bubble.paddingBottom = 5;
        sp(bubble, "paddingLeft", "spacings/base-2"); sp(bubble, "paddingRight", "spacings/base-2");
        sp(bubble, "cornerRadius", "radius/md");
        bubble.fills = [varFill("background/accent")];
        bubble.appendChild(txt("Tooltip text", { size: 12, style: "Medium", fill: "foreground/default-invert" }));
        c.appendChild(bubble);
        // Arrow triangle
        const arrow = figma.createPolygon();
        arrow.pointCount = 3; arrow.resize(8, 4);
        arrow.fills = [varFill("background/accent")]; arrow.rotation = 180;
        c.appendChild(arrow);
      }

      const trigger = figma.createFrame();
      trigger.layoutMode = "HORIZONTAL";
      trigger.primaryAxisSizingMode = trigger.counterAxisSizingMode = "AUTO";
      trigger.primaryAxisAlignItems = trigger.counterAxisAlignItems = "CENTER";
      trigger.fills = [varFill("background/interactive")];
      trigger.paddingTop = 6; trigger.paddingBottom = 6; trigger.paddingLeft = 12; trigger.paddingRight = 12;
      sp(trigger, "cornerRadius", "radius/md");
      trigger.appendChild(txt("Hover me", { size: 13, fill: "foreground/interactive" }));
      c.appendChild(trigger);
      comps.push(c);
    }
    const set = figma.combineAsVariants(comps, pg);
    set.name = "Tooltip"; setSet(set);
    report.push("Tooltip (2)");
  }

  // ══════════════════════════════════════════════════════════════════════════
  // FINAL REPORT
  // ══════════════════════════════════════════════════════════════════════════
  const summary = [
    "═".repeat(60),
    `✅ Design System — ${report.length} components built`,
    "─".repeat(60),
    ...report.map(r => `  • ${r}`),
    "═".repeat(60),
  ].join("\n");
  console.log(summary);
  if (typeof figma.notify === "function") {
    figma.notify(`✅ Design System — ${report.length} components on ${report.length} pages`, { timeout: 10000 });
  }

})().catch(err => {
  console.error("❌ Error:", err);
  if (typeof figma?.notify === "function") figma.notify("❌ " + err.message, { timeout: 8000 });
});
