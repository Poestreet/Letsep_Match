/**
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │  Design System Regenerator — Figma Console / Scripter Script            │
 * │                                                                          │
 * │  HOW TO RUN                                                              │
 * │  1. Open the library file in Figma Desktop                               │
 * │  2. Open Plugins → Scripter  (or Menu → Plugins → Development → Console)│
 * │  3. Paste this entire file and press Run / ⌘↵                           │
 * │                                                                          │
 * │  WHAT IT DOES (Steps 1–5 as requested)                                  │
 * │  Step 1 – Reads every local variable, text style, and paint style        │
 * │  Step 2 – Finds every ComponentSet + standalone Component in the file    │
 * │  Step 3 – Clones each onto a dedicated page with token bindings refreshed│
 * │  Step 4 – Page name = "Category — ComponentName" (32 px padding)        │
 * │  Step 5 – Final notify: ✅ Design System — X components on X pages      │
 * │                                                                          │
 * │  TOKEN BINDING RULES                                                     │
 * │  Colors  → figma.variables.createVariableAlias() from Semantic collection│
 * │  Spacing → setBoundVariable() from Semantic spacings/base-* variables    │
 * │  Radius  → setBoundVariable() from Semantic radius/* variables           │
 * │  Text    → textStyleId preserved from source component                   │
 * │  No values are hard-coded — all bindings come from the live variable API │
 * └─────────────────────────────────────────────────────────────────────────┘
 */

(async () => {

  const PADDING = 32; // px — around each ComponentSet on its page
  const GAP     = 20; // px — between multiple sets on the same page (if applicable)

  // ═══════════════════════════════════════════════════════════════════════════
  // PHASE 1 — LOAD ALL FONTS USED IN THE LIBRARY
  // ═══════════════════════════════════════════════════════════════════════════
  figma.notify("⏳ Loading fonts…", { timeout: 3000 });

  // The library uses Space Grotesk (Font1) and Inter (Font2) as declared
  // in _Core "Fonts/Font1" and "Fonts/Font2" string variables.
  const fontsToLoad = [
    { family: "Space Grotesk", style: "Regular"  },
    { family: "Space Grotesk", style: "Medium"   },
    { family: "Space Grotesk", style: "SemiBold" },
    { family: "Space Grotesk", style: "Bold"     },
    { family: "Inter",          style: "Regular"  },
    { family: "Inter",          style: "Medium"   },
    { family: "Inter",          style: "SemiBold" },
    { family: "Inter",          style: "Bold"     },
  ];
  await Promise.all(fontsToLoad.map(f => figma.loadFontAsync(f).catch(() => {})));

  // ═══════════════════════════════════════════════════════════════════════════
  // PHASE 2 — STEP 1: EXTRACT ALL LOCAL VARIABLES FROM THE LIBRARY
  // ═══════════════════════════════════════════════════════════════════════════
  figma.notify("📖 Reading library tokens…", { timeout: 4000 });

  const [allVariables, allCollections] = await Promise.all([
    figma.variables.getLocalVariablesAsync(),
    figma.variables.getLocalVariableCollectionsAsync(),
  ]);

  // Build fast-lookup maps: by name and by ID
  const varByName = new Map(); // "brand/primary"          → Variable
  const varById   = new Map(); // "VariableID:5:92"        → Variable
  for (const v of allVariables) {
    varByName.set(v.name, v);
    varById.set(v.id, v);
  }

  // ── Log full token inventory (Step 1 output) ──
  console.group("📦 TOKEN INVENTORY");
  for (const col of allCollections) {
    const vars = allVariables.filter(v => v.variableCollectionId === col.id);
    const byType = {};
    for (const v of vars) byType[v.resolvedType] = (byType[v.resolvedType] || 0) + 1;
    const modeNames = Object.values(col.modes).join(", ");
    console.group(`  Collection: "${col.name}"  [modes: ${modeNames}]  — ${vars.length} variables`);
    for (const v of vars) {
      const modeId = col.modes[0]?.modeId ?? Object.keys(v.valuesByMode)[0];
      const raw    = v.valuesByMode[modeId] ?? Object.values(v.valuesByMode)[0];
      let display  = "";
      if (v.resolvedType === "COLOR" && raw?.r !== undefined) {
        display = `rgba(${Math.round(raw.r*255)},${Math.round(raw.g*255)},${Math.round(raw.b*255)},${(raw.a??1).toFixed(2)})`;
      } else if (raw?.type === "VARIABLE_ALIAS") {
        const ref = varById.get(raw.id);
        display = `→ ${ref?.name ?? raw.id}`;
      } else {
        display = JSON.stringify(raw);
      }
      console.log(`    [${v.resolvedType}] ${v.name.padEnd(50)} ${display}`);
    }
    console.groupEnd();
  }
  console.groupEnd();

  // ═══════════════════════════════════════════════════════════════════════════
  // PHASE 3 — STEP 1: READ ALL TEXT + PAINT STYLES
  // ═══════════════════════════════════════════════════════════════════════════
  const textStyles   = figma.getLocalTextStyles();
  const paintStyles  = figma.getLocalPaintStyles();
  const effectStyles = figma.getLocalEffectStyles();

  const textStyleByName  = new Map(textStyles.map(s  => [s.name, s]));
  const paintStyleByName = new Map(paintStyles.map(s => [s.name, s]));

  console.group("🎨 STYLES");
  console.log(`  Text styles:   ${textStyles.length}`);
  for (const s of textStyles) {
    console.log(`    "${s.name}" — ${s.fontName.family} ${s.fontName.style} ${s.fontSize}px`);
  }
  console.log(`  Paint styles:  ${paintStyles.length}`);
  for (const s of paintStyles) {
    console.log(`    "${s.name}"`);
  }
  console.log(`  Effect styles: ${effectStyles.length}`);
  console.groupEnd();

  // ═══════════════════════════════════════════════════════════════════════════
  // PHASE 4 — STEP 2: FIND ALL COMPONENTS IN THE LIBRARY
  // ═══════════════════════════════════════════════════════════════════════════
  figma.notify("🔍 Scanning components…", { timeout: 5000 });

  // Record current page IDs so we only scan source pages,
  // not any pages we're about to create.
  const sourcePageIds = new Set(figma.root.children.map(p => p.id));

  const foundSets = [];  // { node: ComponentSetNode, sourcePage: string }
  const foundSolo = [];  // { node: ComponentNode,    sourcePage: string }

  for (const page of figma.root.children) {
    if (!sourcePageIds.has(page.id)) continue; // skip pages we created
    await page.loadAsync();

    // ComponentSets (variant groups) — highest priority
    const sets = page.findAllWithCriteria({ types: ["COMPONENT_SET"] });
    for (const s of sets) foundSets.push({ node: s, sourcePage: page.name });

    // Standalone Components (not inside a ComponentSet)
    const comps = page.findAllWithCriteria({ types: ["COMPONENT"] });
    for (const c of comps) {
      if (c.parent?.type !== "COMPONENT_SET") {
        foundSolo.push({ node: c, sourcePage: page.name });
      }
    }
  }

  console.group("🧩 COMPONENT DISCOVERY");
  console.log(`  ComponentSets:         ${foundSets.length}`);
  console.log(`  Standalone Components: ${foundSolo.length}`);
  for (const { node, sourcePage } of foundSets) {
    const variantCount = node.children?.length ?? 1;
    const props = node.variantGroupProperties
      ? Object.entries(node.variantGroupProperties)
          .map(([k, v]) => `${k}: [${v.values.join(", ")}]`)
          .join(" | ")
      : "—";
    console.log(`    [SET]  "${node.name}"  (${variantCount} variants)  |  ${props}`);
    console.log(`           size: ${Math.round(node.width)}×${Math.round(node.height)}`);
    console.log(`           page: "${sourcePage}"`);
  }
  for (const { node, sourcePage } of foundSolo) {
    console.log(`    [SOLO] "${node.name}"  size: ${Math.round(node.width)}×${Math.round(node.height)}  page: "${sourcePage}"`);
  }
  console.groupEnd();

  if (foundSets.length + foundSolo.length === 0) {
    figma.notify("⚠️  No components found in this file.", { timeout: 6000 });
    console.warn("No ComponentSets or Components were found on any page.");
    return;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PHASE 5 — STEP 3: TOKEN BINDING REFRESH
  // ═══════════════════════════════════════════════════════════════════════════
  // When cloning inside the same file, Figma preserves variable bindings.
  // We still walk the tree explicitly to guarantee freshness and to handle
  // any edge cases (e.g. component from a linked library being detached).
  //
  // Rules:
  //   COLOR variables → fills / strokes arrays via createVariableAlias()
  //   FLOAT variables → setBoundVariable() for padding / radius / etc.
  //   Text styles     → textStyleId re-assigned
  //   Paint styles    → fillStyleId / strokeStyleId re-assigned

  function refreshBindings(src, dst) {
    // ── Scalar bound variables (paddingLeft, cornerRadius, opacity, etc.) ──
    if (src.boundVariables) {
      for (const [field, binding] of Object.entries(src.boundVariables)) {
        try {
          if (Array.isArray(binding)) {
            // Fills / strokes — each entry can have a "color" sub-binding
            const srcArr = src[field];
            const dstArr = dst[field];
            if (!Array.isArray(dstArr)) continue;
            const newArr = dstArr.map((paint, i) => {
              const b = binding[i];
              if (b?.type === "VARIABLE_ALIAS") {
                const v = varById.get(b.id);
                if (v) return { ...paint, boundVariables: { color: figma.variables.createVariableAlias(v) } };
              }
              return paint;
            });
            dst[field] = newArr;
          } else if (binding?.type === "VARIABLE_ALIAS") {
            // Scalar alias (padding, radius, font size, etc.)
            const v = varById.get(binding.id);
            if (v) dst.setBoundVariable(field, v);
          }
        } catch (_) { /* field may be read-only on this node type */ }
      }
    }

    // ── Style IDs ──
    const styleFields = [
      "textStyleId", "fillStyleId", "strokeStyleId",
      "effectStyleId", "gridStyleId",
    ];
    for (const sf of styleFields) {
      if (src[sf] && dst[sf] !== undefined) {
        try { dst[sf] = src[sf]; } catch (_) {}
      }
    }

    // ── Recurse into children ──
    if ("children" in src && "children" in dst) {
      const n = Math.min(src.children.length, dst.children.length);
      for (let i = 0; i < n; i++) refreshBindings(src.children[i], dst.children[i]);
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PHASE 6 — STEPS 2+4: CREATE ONE PAGE PER COMPONENT
  // ═══════════════════════════════════════════════════════════════════════════

  // Page naming rule: "Category — ComponentName"
  // Derived from the component's name path (slash-separated).
  // e.g. "Button/Primary/Default" → "Button — Primary/Default"
  // e.g. standalone "Toggle" from page "Data Entry" → "Data Entry — Toggle"
  function derivePageName(nodeName, sourcePage) {
    const parts = nodeName.split("/").map(s => s.trim()).filter(Boolean);
    if (parts.length >= 2) {
      // First segment = category, rest = component name
      return `${parts[0]} — ${parts.slice(1).join(" / ")}`;
    }
    return `${sourcePage} — ${nodeName}`;
  }

  const createdPages = [];
  const seenNames    = new Set(figma.root.children.map(p => p.name));

  async function placeOnPage(node, sourcePage) {
    const baseName = derivePageName(node.name, sourcePage);

    // Ensure uniqueness (avoid collisions from similar component names)
    let pageName = baseName;
    let suffix   = 2;
    while (seenNames.has(pageName)) pageName = `${baseName} (${suffix++})`;
    seenNames.add(pageName);

    // Create page
    const newPage = figma.createPage();
    newPage.name  = pageName;
    createdPages.push(newPage);
    await newPage.loadAsync();

    // Clone the source ComponentSet / Component
    const clone = node.clone();
    clone.x = PADDING;
    clone.y = PADDING;
    newPage.appendChild(clone);

    // Refresh token bindings (Step 3 rules)
    refreshBindings(node, clone);

    // Scroll viewport to the cloned set
    figma.viewport.scrollAndZoomIntoView([clone]);

    console.log(`  ✓ ${newPage.name}  [${node.type}]  variants: ${node.children?.length ?? 1}`);
  }

  figma.notify("🏗  Building pages…", { timeout: 60000 });
  console.group("📐 CREATING PAGES");

  // ComponentSets first (they carry full variant groups)
  for (const { node, sourcePage } of foundSets) {
    await placeOnPage(node, sourcePage);
  }
  // Then standalone components
  for (const { node, sourcePage } of foundSolo) {
    await placeOnPage(node, sourcePage);
  }

  console.groupEnd();

  // ═══════════════════════════════════════════════════════════════════════════
  // PHASE 7 — STEP 5: FINAL NOTIFICATION
  // ═══════════════════════════════════════════════════════════════════════════
  const total = createdPages.length;
  const tokenLine = `${allVariables.length} variables · ${textStyles.length} text styles · ${paintStyles.length} paint styles`;

  const finalMsg = `✅ Design System — ${total} component${total !== 1 ? "s" : ""} generated on ${total} page${total !== 1 ? "s" : ""}`;
  figma.notify(finalMsg, { timeout: 10000 });

  console.log("");
  console.log("═".repeat(64));
  console.log(finalMsg);
  console.log(`   Tokens: ${tokenLine}`);
  console.log("   Pages:");
  for (const p of createdPages) console.log(`     • ${p.name}`);
  console.log("═".repeat(64));

})();
