/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │  LETSEP — Button · Radio · Checkbox                                      │
 * │  Figma Console / Scripter · IIFE async                                   │
 * │                                                                          │
 * │  48 Button variants   (Type×4 · Size×3 · State×4)                       │
 * │   8 Radio variants    (checked×2 · State×4)                             │
 * │  12 Checkbox variants (checked×3 · State×4)                             │
 * │                                                                          │
 * │  Étape 1 tokens  — LETSEP Foundations                                   │
 * │    background/* · foreground/* · border/*                               │
 * │    spacings/base-N · radius/full|md|sm                                  │
 * │                                                                          │
 * │  Étape 2 structure — calquée sur Material 3                             │
 * │    Button  : Filled · Tonal · Outlined · Text                           │
 * │    Radio   : checked=False|True · state                                 │
 * │    Checkbox: checked=False|True|Indeterminate · state                   │
 * │                                                                          │
 * │  HOW TO RUN                                                              │
 * │  1. Open LETSEP Foundations file in Figma                                │
 * │  2. Plugins → Scripter (or Development Console)                         │
 * │  3. Paste & Run / ⌘↵                                                   │
 * └──────────────────────────────────────────────────────────────────────────┘
 */
(async () => {

  // ── 1. FONTS ──────────────────────────────────────────────────────────────
  await Promise.all([
    { family: "Inter", style: "Regular"  },
    { family: "Inter", style: "Medium"   },
    { family: "Inter", style: "SemiBold" },
    { family: "Inter", style: "Bold"     },
  ].map(f => figma.loadFontAsync(f).catch(() => {})));

  // ── 2. TOKEN MAP ──────────────────────────────────────────────────────────
  // Source de vérité : variables locales du fichier LETSEP Foundations
  const allVars = typeof figma.variables.getLocalVariables === "function"
    ? figma.variables.getLocalVariables()
    : await figma.variables.getLocalVariablesAsync();
  const V = {};
  for (const v of allVars) V[v.name] = v;

  // Diagnostic — liste les tokens spacings trouvés pour détecter tout mismatch
  const foundSpacings = Object.keys(V).filter(k => k.startsWith("spacings/")).sort();
  console.log("Spacing tokens found:", foundSpacings.join(", ") || "(none)");

  function getV(name) {
    const v = V[name];
    if (!v) { console.warn(`⚠️  Token not found: "${name}" — binding skipped`); return null; }
    return v;
  }

  // ── 3. HELPERS ─────────────────────────────────────────────────────────────

  /** Solid fill entièrement bound à un token couleur LETSEP */
  function varFill(tok) {
    const v = getV(tok);
    if (!v) return { type: "SOLID", color: { r: 0.85, g: 0.85, b: 0.85 } };
    return {
      type: "SOLID",
      color: { r: 0, g: 0, b: 0 },
      boundVariables: { color: figma.variables.createVariableAlias(v) },
    };
  }

  /** Solid stroke bound à un token couleur LETSEP */
  function varStroke(tok) {
    const v = getV(tok);
    if (!v) return { type: "SOLID", color: { r: 0.7, g: 0.7, b: 0.7 } };
    return {
      type: "SOLID",
      color: { r: 0, g: 0, b: 0 },
      boundVariables: { color: figma.variables.createVariableAlias(v) },
    };
  }

  /** setBoundVariable avec guard null */
  function sp(node, field, tok) {
    const v = getV(tok);
    if (!v) return;
    try { node.setBoundVariable(field, v); } catch (_) {}
  }

  /** strokeWeight=1, INSIDE */
  function stroke1(node, tok) {
    node.strokes      = [varStroke(tok)];
    node.strokeWeight = 1;
    node.strokeAlign  = "INSIDE";
  }

  /** strokeWeight=2, INSIDE */
  function stroke2(node, tok) {
    node.strokes      = [varStroke(tok)];
    node.strokeWeight = 2;
    node.strokeAlign  = "INSIDE";
  }

  /** Crée un TextNode avec fill token et auto-resize */
  function txt(chars, opts = {}) {
    const t = figma.createText();
    t.characters     = chars;
    t.fontSize       = opts.size  || 14;
    t.fontName       = { family: opts.family || "Inter", style: opts.style || "Regular" };
    if (opts.lh) t.lineHeight = { value: opts.lh, unit: "PIXELS" };
    if (opts.fill) t.fills = [varFill(opts.fill)];
    t.textAutoResize = "WIDTH_AND_HEIGHT";
    return t;
  }

  /**
   * Focus ring : deux DROP_SHADOW simulant
   *   outline: 2px solid brand/primary; outline-offset: 2px
   * Shadow 1 — gap blanc   (spread: 2px)
   * Shadow 2 — brand ring  (spread: 4px cumulatif)
   */
  function focusRing() {
    const brand = getV("brand/primary");
    const outerShadow = brand
      ? { type: "DROP_SHADOW", color: { r: 0, g: 0.67, b: 1, a: 1 },
          boundVariables: { color: figma.variables.createVariableAlias(brand) },
          offset: { x: 0, y: 0 }, radius: 0, spread: 4, visible: true, blendMode: "NORMAL" }
      : { type: "DROP_SHADOW", color: { r: 0, g: 0.67, b: 1, a: 1 },
          offset: { x: 0, y: 0 }, radius: 0, spread: 4, visible: true, blendMode: "NORMAL" };
    return [
      { type: "DROP_SHADOW", color: { r: 1, g: 1, b: 1, a: 1 },
        offset: { x: 0, y: 0 }, radius: 0, spread: 2, visible: true, blendMode: "NORMAL" },
      outerShadow,
    ];
  }

  /** Padding + gap standard du ComponentSet wrapper */
  const PAD = 32;
  function setSet(set) {
    set.paddingLeft = set.paddingRight = set.paddingTop = set.paddingBottom = PAD;
    set.itemSpacing = 20;
    set.x = PAD;
    set.y = PAD;
  }

  /** Crée une page neuve, attend son chargement, la définit comme currentPage */
  async function mkPage(name) {
    const pg = figma.createPage();
    pg.name = name;
    await pg.loadAsync();
    figma.currentPage = pg;
    return pg;
  }

  // ── 4. allSets (accumulateur) ──────────────────────────────────────────────
  const allSets = [];

  // ── 5. buildInstanceTable — Propstar natif ─────────────────────────────────
  /**
   * Génère un tableau d'instances sous le ComponentSet.
   * Axe vertical  = première propriété (ex. Type pour Button).
   * Axe horizontal = toutes les autres propriétés (Size × State).
   *
   * @param {ComponentSetNode} set   Le ComponentSet source
   * @param {PageNode}         pg    La page cible
   * @returns {FrameNode}            Le frame racine de la table
   */
  function buildInstanceTable(set, pg) {
    const children = [...set.children];
    if (!children.length) return null;

    // Parse "Prop1=Val1, Prop2=Val2, ..." → { Prop1: Val1, Prop2: Val2 }
    function parseName(name) {
      const obj = {};
      for (const part of name.split(",")) {
        const idx = part.indexOf("=");
        if (idx !== -1) obj[part.slice(0, idx).trim()] = part.slice(idx + 1).trim();
      }
      return obj;
    }

    const parsed    = children.map(c => ({ node: c, props: parseName(c.name) }));
    const propNames = Object.keys(parsed[0]?.props ?? {});

    // Premier prop = axe des lignes
    const rowProp = propNames[0] ?? null;

    // Grouper par rowProp
    const groups = {};
    for (const item of parsed) {
      const key = rowProp ? (item.props[rowProp] ?? "_") : "_";
      (groups[key] = groups[key] ?? []).push(item);
    }

    // Outer frame — container VERTICAL
    const outerFrame = figma.createFrame();
    outerFrame.name                 = `${set.name} / instance table`;
    outerFrame.layoutMode           = "VERTICAL";
    outerFrame.primaryAxisSizingMode = "AUTO";
    outerFrame.counterAxisSizingMode = "AUTO";
    outerFrame.itemSpacing           = 16;
    outerFrame.paddingTop    = outerFrame.paddingBottom = 24;
    outerFrame.paddingLeft   = outerFrame.paddingRight  = 24;
    outerFrame.cornerRadius  = 8;
    outerFrame.fills         = [{ type: "SOLID", color: { r: 0.97, g: 0.97, b: 0.97 } }];
    outerFrame.x = set.x;
    outerFrame.y = set.y + set.height + 80;

    // Titre
    const titleNode = figma.createText();
    titleNode.characters     = `${set.name}  ·  ${children.length} variants`;
    titleNode.fontSize       = 13;
    titleNode.fontName       = { family: "Inter", style: "SemiBold" };
    titleNode.fills          = [{ type: "SOLID", color: { r: 0.1, g: 0.1, b: 0.1 } }];
    titleNode.textAutoResize = "WIDTH_AND_HEIGHT";
    outerFrame.appendChild(titleNode);

    // Une ligne par groupe (valeur du rowProp)
    for (const [groupKey, items] of Object.entries(groups)) {
      // Label de ligne
      if (rowProp) {
        const rowLabel = figma.createText();
        rowLabel.characters     = `${rowProp} = ${groupKey}`;
        rowLabel.fontSize       = 10;
        rowLabel.fontName       = { family: "Inter", style: "Regular" };
        rowLabel.fills          = [{ type: "SOLID", color: { r: 0.45, g: 0.45, b: 0.45 } }];
        rowLabel.textAutoResize = "WIDTH_AND_HEIGHT";
        outerFrame.appendChild(rowLabel);
      }

      // Frame horizontal pour cette ligne
      const row = figma.createFrame();
      row.layoutMode           = "HORIZONTAL";
      row.layoutWrap           = "WRAP";
      row.primaryAxisSizingMode = "FIXED";
      row.counterAxisSizingMode = "AUTO";
      row.resize(Math.max(240, items.length * 120 + 24), 60);
      row.itemSpacing          = 12;
      try { row.counterAxisSpacing = 12; } catch (_) {}
      row.paddingTop = row.paddingBottom = row.paddingLeft = row.paddingRight = 0;
      row.fills      = [];

      for (const item of items) {
        try {
          const inst = item.node.createInstance();
          row.appendChild(inst);
        } catch (e) { console.warn("⚠️ createInstance:", e.message); }
      }

      outerFrame.appendChild(row);
    }

    pg.appendChild(outerFrame);
    return outerFrame;
  }

  // ── RAPPORT ───────────────────────────────────────────────────────────────
  const report = [];

  // ══════════════════════════════════════════════════════════════════════════
  //  BUTTON — 48 variants  (Type=4 × Size=3 × State=4)
  //
  //  Structure M3 → mapping LETSEP
  //  ──────────────────────────────────────────────────────────────────────────
  //  Type     M3           LETSEP bg                     LETSEP fg
  //  Filled   Filled btn   background/interactive         foreground/interactive
  //  Tonal    Tonal btn    background/subtle              foreground/interactive-invert
  //  Outlined Outlined btn background/interactive-invert  foreground/interactive-invert
  //  Text     Text btn     (transparent)                  foreground/interactive-invert
  // ══════════════════════════════════════════════════════════════════════════
  {
    const pg = await mkPage("Button");

    // Échelle de taille — M3 : SM≈32dp · MD≈40dp · LG≈48dp
    const SIZE = {
      SM: { hTok: "spacings/base-8",  pxTok: "spacings/base-3", gapTok: "spacings/base-1", gapVal: 4,  fs: 12, lh: 16, style: "SemiBold" },
      MD: { hTok: "spacings/base-10", pxTok: "spacings/base-4", gapTok: null,               gapVal: 6,  fs: 14, lh: 20, style: "Medium"   },
      LG: { hTok: "spacings/base-12", pxTok: "spacings/base-5", gapTok: "spacings/base-2",  gapVal: 8,  fs: 16, lh: 24, style: "Medium"   },
    };

    // Token matrix : Type × State → { bg, fg, bd, ring }
    // Toutes les valeurs sont des noms de tokens LETSEP — aucune valeur hex.
    const TK = {
      Filled: {
        Default:  { bg: "background/interactive",              fg: "foreground/interactive",                bd: null,                     ring: false },
        Hover:    { bg: "background/interactive-hover",        fg: "foreground/interactive",                bd: null,                     ring: false },
        Focused:  { bg: "background/interactive",              fg: "foreground/interactive",                bd: null,                     ring: true  },
        Disabled: { bg: "background/interactive-disabled",     fg: "foreground/interactive-disabled",       bd: null,                     ring: false },
      },
      Tonal: {
        Default:  { bg: "background/subtle",                   fg: "foreground/interactive-invert",         bd: null,                     ring: false },
        Hover:    { bg: "background/interactive-invert-hover", fg: "foreground/interactive-invert",         bd: null,                     ring: false },
        Focused:  { bg: "background/subtle",                   fg: "foreground/interactive-invert",         bd: null,                     ring: true  },
        Disabled: { bg: "background/interactive-disabled",     fg: "foreground/interactive-disabled",       bd: null,                     ring: false },
      },
      Outlined: {
        Default:  { bg: "background/interactive-invert",       fg: "foreground/interactive-invert",         bd: "border/interactive-invert",  ring: false },
        Hover:    { bg: "background/interactive-invert-hover", fg: "foreground/interactive-invert",         bd: "border/interactive-invert",  ring: false },
        Focused:  { bg: "background/interactive-invert",       fg: "foreground/interactive-invert",         bd: "border/interactive-invert",  ring: true  },
        Disabled: { bg: null,                                  fg: "foreground/interactive-invert-disabled", bd: "border/secondary-disabled", ring: false },
      },
      Text: {
        Default:  { bg: null,                                  fg: "foreground/interactive-invert",         bd: null, ring: false },
        Hover:    { bg: "background/interactive-invert-hover", fg: "foreground/interactive-invert",         bd: null, ring: false },
        Focused:  { bg: null,                                  fg: "foreground/interactive-invert",         bd: null, ring: true  },
        Disabled: { bg: null,                                  fg: "foreground/interactive-invert-disabled", bd: null, ring: false },
      },
    };

    const comps = [];
    for (const type  of ["Filled", "Tonal", "Outlined", "Text"])
    for (const size  of ["SM", "MD", "LG"])
    for (const state of ["Default", "Hover", "Focused", "Disabled"]) {
      const s  = SIZE[size];
      const tk = TK[type][state];

      const c = figma.createComponent();
      c.name = `Type=${type}, Size=${size}, State=${state}`;

      // Auto-layout horizontal — centre-centre
      c.layoutMode             = "HORIZONTAL";
      c.primaryAxisSizingMode  = "AUTO";   // largeur = hug
      c.counterAxisSizingMode  = "FIXED";  // hauteur = token-locked
      c.primaryAxisAlignItems  = "CENTER";
      c.counterAxisAlignItems  = "CENTER";
      c.paddingTop = c.paddingBottom = 0;
      c.resize(80, 40);

      // Binding spacing tokens
      sp(c, "paddingLeft",  s.pxTok);
      sp(c, "paddingRight", s.pxTok);
      sp(c, "height",       s.hTok);
      s.gapTok ? sp(c, "itemSpacing", s.gapTok) : (c.itemSpacing = s.gapVal);

      // Radius pleine → pills M3
      sp(c, "cornerRadius", "radius/full");

      // Fill, stroke, focus ring
      c.fills   = tk.bg ? [varFill(tk.bg)] : [];
      if (tk.bd) stroke1(c, tk.bd);
      c.effects = tk.ring ? focusRing() : [];

      // Label
      c.appendChild(txt("Button", { size: s.fs, lh: s.lh, style: s.style, fill: tk.fg }));

      pg.appendChild(c);
      comps.push(c);
    }

    const set = figma.combineAsVariants(comps, pg);
    set.name = "Button";
    setSet(set);
    allSets.push({ set, page: pg });
    buildInstanceTable(set, pg);
    report.push(`Button (${comps.length})`);
  }

  // ══════════════════════════════════════════════════════════════════════════
  //  RADIO — 8 variants  (checked=2 × State=4)
  //
  //  Structure M3
  //  ──────────────────────────────────────────────────────────────────────────
  //  • Contrôle circulaire 20×20, strokeWeight=2
  //  • Checked=True  → cercle rempli + dot intérieur 8×8
  //  • State=Focused → focus ring DROP_SHADOW
  //  • Label Inter Regular 14px à droite du contrôle
  // ══════════════════════════════════════════════════════════════════════════
  {
    const pg = await mkPage("Radio");
    const comps = [];

    for (const checked of ["False", "True"])
    for (const state   of ["Default", "Hover", "Focused", "Disabled"]) {
      const isDis = state   === "Disabled";
      const isChk = checked === "True";

      // Tokens contrôle
      const ctrlBg = isChk
        ? (isDis ? "background/interactive-disabled" : "background/interactive")
        : "background/subtle";
      const ctrlBd = isChk
        ? (isDis ? "border/secondary-disabled" : "border/accent")
        : (isDis ? "border/secondary-disabled" : "border/default");

      const c = figma.createComponent();
      c.name = `checked=${checked}, state=${state}`;
      c.layoutMode             = "HORIZONTAL";
      c.primaryAxisSizingMode  = "AUTO";
      c.counterAxisSizingMode  = "AUTO";
      c.primaryAxisAlignItems  = "CENTER";
      c.counterAxisAlignItems  = "CENTER";
      c.fills   = [];
      sp(c, "itemSpacing", "spacings/base-2");
      c.effects = (state === "Focused" && !isDis) ? focusRing() : [];

      // Contrôle circulaire 20×20
      const ctrl = figma.createFrame();
      ctrl.resize(20, 20);
      ctrl.fills = [varFill(ctrlBg)];
      stroke2(ctrl, ctrlBd);
      sp(ctrl, "cornerRadius", "radius/full");

      if (isChk) {
        // Dot intérieur 8×8 centré
        ctrl.layoutMode            = "HORIZONTAL";
        ctrl.primaryAxisAlignItems = "CENTER";
        ctrl.counterAxisAlignItems = "CENTER";
        const dot = figma.createFrame();
        dot.resize(8, 8);
        dot.fills = [varFill(isDis ? "foreground/interactive-disabled" : "foreground/interactive")];
        sp(dot, "cornerRadius", "radius/full");
        ctrl.appendChild(dot);
      }

      c.appendChild(ctrl);
      c.appendChild(txt("Radio label", { size: 14, style: "Regular",
        fill: isDis ? "foreground/disabled" : "foreground/default" }));

      pg.appendChild(c);
      comps.push(c);
    }

    const set = figma.combineAsVariants(comps, pg);
    set.name = "Radio";
    setSet(set);
    allSets.push({ set, page: pg });
    buildInstanceTable(set, pg);
    report.push(`Radio (${comps.length})`);
  }

  // ══════════════════════════════════════════════════════════════════════════
  //  CHECKBOX — 12 variants  (checked=3 × State=4)
  //
  //  Structure M3
  //  ──────────────────────────────────────────────────────────────────────────
  //  checked values : False | True | Indeterminate
  //  • Contrôle carré 18×18, radius/sm, strokeWeight=2
  //  • False        → fond subtle + border/default
  //  • True         → fond interactive + ✓ checkmark
  //  • Indeterminate→ fond interactive + – dash
  //  • State=Focused→ focus ring DROP_SHADOW
  //  • Label Inter Regular 14px à droite du contrôle
  // ══════════════════════════════════════════════════════════════════════════
  {
    const pg = await mkPage("Checkbox");
    const comps = [];

    for (const checked of ["False", "True", "Indeterminate"])
    for (const state   of ["Default", "Hover", "Focused", "Disabled"]) {
      const isDis  = state   === "Disabled";
      const isChk  = checked === "True";
      const isIndt = checked === "Indeterminate";
      const filled = isChk || isIndt;

      // Tokens contrôle
      const ctrlBg = filled
        ? (isDis ? "background/interactive-disabled" : "background/interactive")
        : (isDis ? "background/default"              : "background/subtle");
      const ctrlBd = filled
        ? (isDis ? "border/secondary-disabled" : "border/accent")
        : (isDis ? "border/secondary-disabled" : "border/default");
      const iconFg  = isDis ? "foreground/interactive-disabled" : "foreground/interactive";
      const labelFg = isDis ? "foreground/disabled"            : "foreground/default";

      const c = figma.createComponent();
      c.name = `checked=${checked}, state=${state}`;
      c.layoutMode             = "HORIZONTAL";
      c.primaryAxisSizingMode  = "AUTO";
      c.counterAxisSizingMode  = "AUTO";
      c.primaryAxisAlignItems  = "CENTER";
      c.counterAxisAlignItems  = "CENTER";
      c.fills   = [];
      sp(c, "itemSpacing", "spacings/base-2");
      c.effects = (state === "Focused" && !isDis) ? focusRing() : [];

      // Contrôle carré 18×18 — radius/sm (M3 : 2dp corner)
      const box = figma.createFrame();
      box.resize(18, 18);
      box.fills = [varFill(ctrlBg)];
      stroke2(box, ctrlBd);
      sp(box, "cornerRadius", "radius/sm");

      if (filled) {
        // ✓  ou  –  centré dans la box
        box.layoutMode             = "HORIZONTAL";
        box.primaryAxisAlignItems  = "CENTER";
        box.counterAxisAlignItems  = "CENTER";
        const icon = txt(isIndt ? "–" : "✓", { size: 11, style: "Bold", fill: iconFg });
        box.appendChild(icon);
      }

      c.appendChild(box);
      c.appendChild(txt("Checkbox label", { size: 14, style: "Regular", fill: labelFg }));

      pg.appendChild(c);
      comps.push(c);
    }

    const set = figma.combineAsVariants(comps, pg);
    set.name = "Checkbox";
    setSet(set);
    allSets.push({ set, page: pg });
    buildInstanceTable(set, pg);
    report.push(`Checkbox (${comps.length})`);
  }

  // ── RAPPORT FINAL ─────────────────────────────────────────────────────────
  const total = report.reduce((sum, r) => {
    const m = r.match(/\((\d+)\)/);
    return sum + (m ? +m[1] : 0);
  }, 0);

  const summary = [
    "═".repeat(64),
    `✅  LETSEP — Button · Radio · Checkbox`,
    `    ${total} variants · ${allSets.length} ComponentSets · ${allSets.length} pages`,
    "─".repeat(64),
    ...report.map(r => `  • ${r}`),
    "─".repeat(64),
    "  allSets exposés → window.letsepBRC",
    "═".repeat(64),
  ].join("\n");
  console.log(summary);

  // Expose allSets pour inspection depuis la Console
  try { window.letsepBRC = allSets; } catch (_) {}

  if (typeof figma.notify === "function") {
    figma.notify(
      `✅ LETSEP — ${total} variants créés sur ${allSets.length} pages`,
      { timeout: 8000 }
    );
  }

})().catch(err => {
  console.error("❌ Error:", err);
  if (typeof figma?.notify === "function") figma.notify("❌ " + err.message, { timeout: 8000 });
});
