import fs from "node:fs/promises";
import path from "node:path";

const OUT_DIR = "C:/Users/pawar/Desktop/Project/grindhaus/pitch_deck/grindhaus_ai_ciiit_pitch/output";
const PREVIEW_DIR = `${OUT_DIR}/previews`;

const W = 1920;
const H = 1080;

const C = {
  bg: "#050506",
  bg2: "#09090B",
  red: "#E50914",
  redHot: "#FF2E3A",
  redDark: "#55070B",
  ink: "#F8F5EF",
  soft: "#C8C2B8",
  muted: "#8D8990",
  glass: "#111217",
  glass2: "#17191F",
  line: "#2B2B31",
  cyan: "#54E4FF",
  green: "#8BFFB8",
  amber: "#FFCE73",
};

const titleFont = "Bahnschrift";
const bodyFont = "Aptos";

function cleanName(name) {
  return String(name).replace(/[^a-zA-Z0-9_-]+/g, "-").toLowerCase();
}

function s(module) {
  const {
    Presentation,
    PresentationFile,
    row,
    column,
    grid,
    layers,
    panel,
    text,
    shape,
    chart,
    rule,
    fill,
    hug,
    fixed,
    wrap,
    grow,
    fr,
    auto,
  } = module;
  return {
    Presentation,
    PresentationFile,
    row,
    column,
    grid,
    layers,
    panel,
    text,
    shape,
    chart,
    rule,
    fill,
    hug,
    fixed,
    wrap,
    grow,
    fr,
    auto,
  };
}

function t(textValue, opts = {}) {
  const { text, fill, hug, wrap } = globalThis.__deckTools;
  return text(textValue, {
    name: opts.name || cleanName(textValue).slice(0, 45),
    width: opts.width ?? fill,
    height: opts.height ?? hug,
    columnSpan: opts.columnSpan,
    rowSpan: opts.rowSpan,
    style: {
      fontFamily: opts.fontFamily || (opts.title ? titleFont : bodyFont),
      fontSize: opts.size ?? 28,
      bold: opts.bold ?? false,
      color: opts.color || C.ink,
      italic: opts.italic || false,
      align: opts.align,
      lineSpacingMultiple: opts.lineSpacingMultiple,
    },
  });
}

function chip(label, accent = C.red) {
  const { panel, text, hug, fixed } = globalThis.__deckTools;
  const width = Math.min(560, Math.max(170, label.length * 14 + 58));
  return panel(
    {
      name: `chip-${cleanName(label)}`,
      fill: "#14151A",
      borderRadius: "rounded-full",
      padding: { x: 22, y: 10 },
      height: hug,
      width: fixed(width),
    },
    text(label, {
      width: fixed(width - 44),
      height: hug,
      style: {
        fontFamily: bodyFont,
        fontSize: 18,
        bold: true,
        color: accent,
      },
    })
  );
}

function glassCard(name, child, opts = {}) {
  const { panel, fill, hug } = globalThis.__deckTools;
  return panel(
    {
      name,
      fill: opts.fill || C.glass,
      borderRadius: "rounded-xl",
      padding: opts.padding || { x: 30, y: 26 },
      width: opts.width ?? fill,
      height: opts.height ?? hug,
    },
    child
  );
}

function titleBlock(kicker, title, subtitle, columnSpan = 1) {
  const { column, row, fill, hug, wrap, rule, fixed } = globalThis.__deckTools;
  return column(
    { name: "title-block", width: fill, height: hug, gap: 16, columnSpan },
    [
      row(
        { name: "kicker-row", width: fill, height: hug, align: "center", gap: 14 },
        [
          rule({ name: "kicker-rule", width: fixed(70), stroke: C.red, weight: 5 }),
          t(kicker.toUpperCase(), {
            name: "kicker",
            size: 18,
            bold: true,
            color: C.redHot,
            width: wrap(900),
          }),
        ]
      ),
      t(title, {
        name: "slide-title",
        title: true,
        size: 58,
        bold: true,
        color: C.ink,
        width: wrap(1380),
      }),
      subtitle
        ? t(subtitle, {
            name: "slide-subtitle",
            size: 25,
            color: C.soft,
            width: wrap(1280),
            lineSpacingMultiple: 1.05,
          })
        : null,
    ].filter(Boolean)
  );
}

function bulletList(items, accent = C.redHot) {
  const { column, row, fill, hug, fixed, shape } = globalThis.__deckTools;
  return column(
    { name: "bullet-list", width: fill, height: hug, gap: 18 },
    items.map((item, i) =>
      row(
        { name: `bullet-row-${i}`, width: fill, height: hug, gap: 16, align: "center" },
        [
          shape({
            name: `bullet-dot-${i}`,
            geometry: "ellipse",
            width: fixed(12),
            height: fixed(12),
            fill: accent,
          }),
          t(item, {
            name: `bullet-${i}`,
            size: 25,
            color: C.soft,
          }),
        ]
      )
    )
  );
}

function slideRoot(slide, content, notes) {
  const { layers, shape, fill } = globalThis.__deckTools;
  slide.compose(
    layers(
      { name: "slide-layers", width: fill, height: fill },
      [
        shape({ name: "bg", width: fill, height: fill, fill: C.bg }),
        shape({ name: "top-glow", width: fill, height: 54, fill: C.redDark }),
        shape({ name: "bottom-line", width: fill, height: 6, fill: C.red }),
        content,
      ]
    ),
    {
      frame: { left: 0, top: 0, width: W, height: H },
      baseUnit: 8,
    }
  );
  if (notes) slide.speakerNotes.setText(notes);
}

function metric(label, value, note, accent = C.redHot) {
  const { column, fill, hug, fixed } = globalThis.__deckTools;
  return column(
    { name: `metric-${cleanName(label)}`, width: fill, height: hug, gap: 8 },
    [
      t(value, { title: true, size: 54, bold: true, color: accent, width: fill, height: fixed(64) }),
      t(label, { size: 21, bold: true, color: C.ink, width: fill, height: fixed(30) }),
      t(note, { size: 16, color: C.muted, width: fill }),
    ]
  );
}

function miniArchitecture(nodes, nodeWidth = 250, arrowWidth = 50, fontSize = 24) {
  const { row, column, panel, text, fill, hug, fixed, shape } = globalThis.__deckTools;
  const children = [];
  nodes.forEach((node, i) => {
    children.push(
      panel(
        {
          name: `node-${i}-${cleanName(node)}`,
          fill: i === nodes.length - 1 ? C.red : C.glass2,
          borderRadius: "rounded-xl",
          padding: { x: 22, y: 20 },
          width: fixed(nodeWidth),
          height: fixed(105),
        },
        text(node, {
          width: fill,
          height: hug,
          style: {
            fontFamily: bodyFont,
            fontSize,
            bold: true,
            color: C.ink,
            align: "center",
          },
        })
      )
    );
    if (i < nodes.length - 1) {
      children.push(
        column(
          { name: `arrow-${i}`, width: fixed(arrowWidth), height: fixed(105), justify: "center", align: "center" },
          [
            shape({
              name: `arrow-line-${i}`,
              width: fixed(Math.max(16, arrowWidth - 8)),
              height: fixed(4),
              fill: C.redHot,
            }),
          ]
        )
      );
    }
  });
  return row({ name: "architecture-flow", width: fill, height: hug, align: "center", justify: "center", gap: 6 }, children);
}

function addSlide(presentation, spec, build) {
  const slide = presentation.slides.add();
  build(slide);
  return slide;
}

export async function buildDeck(module) {
  globalThis.__deckTools = s(module);
  const {
    Presentation,
    PresentationFile,
    row,
    column,
    grid,
    panel,
    text,
    shape,
    chart,
    rule,
    fill,
    hug,
    fixed,
    wrap,
    grow,
    fr,
    auto,
  } = globalThis.__deckTools;

  await fs.mkdir(OUT_DIR, { recursive: true });
  await fs.mkdir(PREVIEW_DIR, { recursive: true });

  const presentation = Presentation.create({
    slideSize: { width: W, height: H },
  });

  addSlide(presentation, {}, (slide) => {
    slideRoot(
      slide,
      grid(
        {
          name: "cover-root",
          width: fill,
          height: fill,
          columns: [fr(1.05), fr(0.95)],
          rows: [fr(1)],
          padding: { x: 92, y: 78 },
          columnGap: 42,
        },
        [
          column(
            { name: "cover-copy", width: fill, height: fill, justify: "center", gap: 28 },
            [
              chip("Prepared for CIIIT | GCOE Chandrapur", C.redHot),
              t("GRINDHAUS AI", {
                name: "cover-title",
                title: true,
                size: 112,
                bold: true,
                color: C.ink,
                width: wrap(900),
              }),
              t("The Future of AI-Powered Human Performance", {
                name: "cover-subtitle",
                title: true,
                size: 38,
                bold: true,
                color: C.redHot,
                width: wrap(760),
              }),
              t("An intelligent fitness ecosystem combining AI coaching, behavioral memory, nutrition intelligence, community accountability, and future custom LLM research.", {
                name: "cover-context",
                size: 25,
                color: C.soft,
                width: wrap(850),
              }),
              t("Founder: GrindHaus AI Team | Government College of Engineering, Chandrapur", {
                name: "cover-founder",
                size: 21,
                color: C.muted,
                width: wrap(760),
              }),
            ]
          ),
          column(
            { name: "cover-visual", width: fill, height: fill, justify: "center", align: "center", gap: 18 },
            [
              panel(
                {
                  name: "ai-core",
                  fill: C.glass,
                  borderRadius: "rounded-full",
                  width: fixed(470),
                  height: fixed(470),
                  padding: { x: 40, y: 40 },
                },
                column(
                  { name: "ai-core-inner", width: fill, height: fill, justify: "center", align: "center", gap: 18 },
                  [
                    t("AI", { title: true, size: 118, bold: true, color: C.redHot, align: "center", width: fill }),
                    t("Performance Brain", { size: 28, bold: true, color: C.ink, align: "center", width: fill }),
                    t("Memory + Coaching + Behavior", { size: 20, color: C.soft, align: "center", width: fill }),
                  ]
                )
              ),
              row(
                { name: "cover-signals", width: fill, height: hug, justify: "center", gap: 14 },
                [chip("Fitness", C.ink), chip("Nutrition", C.ink), chip("Companion AI", C.ink)]
              ),
            ]
          ),
        ]
      ),
      "Open with confidence: this is not just a fitness app. Position GrindHaus AI as a human-performance AI ecosystem built from Chandrapur for global users."
    );
  });

  addSlide(presentation, {}, (slide) => {
    slideRoot(
      slide,
      grid(
        { name: "problem-root", width: fill, height: fill, columns: [fr(1), fr(0.95)], rows: [auto, fr(1)], padding: { x: 86, y: 70 }, columnGap: 58, rowGap: 50 },
        [
          titleBlock("The Problem", "Fitness failure is usually not an information problem.", "It is a consistency, personalization, and accountability problem.", 2),
          column(
            { name: "problem-left", width: fill, height: fill, gap: 24 },
            [
              glassCard("stat-1", metric("global adults physically inactive", "31%", "WHO estimates 1.8B adults are not active enough.", C.redHot), { height: fixed(210) }),
              glassCard("stat-2", metric("adolescents below activity guidelines", "80%", "The next generation is already forming low-activity habits.", C.amber), { height: fixed(210) }),
              glassCard("stat-3", metric("core drop-off driver", "Behavior", "Generic plans fail when life, stress, fatigue, and routine change.", C.cyan), { height: fixed(210) }),
            ]
          ),
          glassCard(
            "problem-copy",
            column(
              { name: "problem-copy-stack", width: fill, height: fill, justify: "center", gap: 22 },
              [
                t("Current fitness products are built like libraries.", { title: true, size: 48, bold: true, color: C.ink, width: wrap(720) }),
                bulletList([
                  "They show workouts but do not understand behavior.",
                  "They track data but rarely create emotional accountability.",
                  "They monetize guidance aggressively instead of improving access.",
                  "They do not adapt deeply to missed days, goals, fatigue, or motivation.",
                ]),
              ]
            ),
            { height: fill, padding: { x: 42, y: 42 } }
          ),
        ]
      ),
      "Use this slide to frame the pain: people know what to do, but they fail because systems are not adaptive enough. Mention WHO numbers as market/context proof."
    );
  });

  addSlide(presentation, {}, (slide) => {
    slideRoot(
      slide,
      column(
        { name: "vision-root", width: fill, height: fill, padding: { x: 100, y: 86 }, justify: "center", gap: 38 },
        [
          chip("Vision", C.redHot),
          t("Not a fitness app.", { title: true, size: 76, bold: true, color: C.ink, width: wrap(1350), height: fixed(94) }),
          t("An intelligent companion that evolves with the user.", { title: true, size: 46, bold: true, color: C.redHot, width: wrap(1300), height: fixed(72) }),
          t("The long-term platform becomes a performance layer around daily life: training, food, recovery, motivation, community, wearables, and AI-generated coaching experiences.", {
            size: 30,
            color: C.soft,
            width: wrap(1320),
          }),
          row(
            { name: "vision-pill-row", width: fill, height: hug, gap: 16 },
            [chip("Personal memory", C.ink), chip("Adaptive recommendations", C.ink), chip("Accessible guidance", C.ink), chip("Indian AI product", C.ink)]
          ),
        ]
      ),
      "Make the audience feel the ambition: GrindHaus is a performance operating system. The key phrase to repeat is: an intelligent companion that evolves with the user."
    );
  });

  addSlide(presentation, {}, (slide) => {
    slideRoot(
      slide,
      grid(
        { name: "overview-root", width: fill, height: fill, columns: [fr(1)], rows: [auto, fr(1)], padding: { x: 82, y: 70 }, rowGap: 46 },
        [
          titleBlock("Product Overview", "Five modules. One adaptive ecosystem.", "A unified user journey from discovery to coaching, tracking, community, and long-term personalization."),
          grid(
            { name: "module-grid", width: fill, height: fill, columns: [fr(1), fr(1), fr(1), fr(1), fr(1)], columnGap: 22 },
            [
              glassCard("module-workouts", column({ width: fill, height: fill, gap: 16 }, [t("Workout Library", { size: 32, bold: true, color: C.ink }), t("Structured exercise discovery, plans, muscle groups, and progression logic.", { size: 23, color: C.soft })]), { height: fill }),
              glassCard("module-technique", column({ width: fill, height: fill, gap: 16 }, [t("Technique Intelligence", { size: 32, bold: true, color: C.ink }), t("Exercise form education, targeted muscles, and future video guidance.", { size: 23, color: C.soft })]), { height: fill }),
              glassCard("module-nutrition", column({ width: fill, height: fill, gap: 16 }, [t("Nutrition System", { size: 32, bold: true, color: C.ink }), t("Macros, hydration, diet suggestions, and behavior-aware reminders.", { size: 23, color: C.soft })]), { height: fill }),
              glassCard("module-community", column({ width: fill, height: fill, gap: 16 }, [t("Community System", { size: 32, bold: true, color: C.ink }), t("Accountability, progress sharing, social motivation, and creator pathways.", { size: 23, color: C.soft })]), { height: fill }),
              glassCard("module-ai", column({ width: fill, height: fill, gap: 16 }, [t("AI Companion", { size: 32, bold: true, color: C.redHot }), t("Memory-driven coaching that adapts across expert and companion modes.", { size: 23, color: C.soft })]), { height: fill, fill: "#180B0D" }),
            ]
          ),
        ]
      ),
      "Explain the product as an ecosystem. Each module has standalone value, but the AI companion connects them into a personalized loop."
    );
  });

  addSlide(presentation, {}, (slide) => {
    slideRoot(
      slide,
      grid(
        { name: "ai-root", width: fill, height: fill, columns: [fr(1)], rows: [auto, fr(1), auto], padding: { x: 82, y: 70 }, rowGap: 42 },
        [
          titleBlock("AI Companion", "A coach that remembers context, not just a chatbot.", "Dual-mode intelligence separates factual fitness guidance from warm companion support."),
          miniArchitecture(["User Signal", "Memory Layer", "AI Router", "Response Engine", "Adaptive Action"]),
          grid(
            { name: "ai-cards", width: fill, height: fill, columns: [fr(1), fr(1), fr(1), fr(1)], columnGap: 22 },
            [
              glassCard("ai-emotion", column({ width: fill, height: fill, gap: 14 }, [t("Companion Mode", { size: 31, bold: true }), t("Warm, natural, motivational support for stress, inconsistency, and personal topics.", { size: 22, color: C.soft })]), { height: fill }),
              glassCard("ai-expert", column({ width: fill, height: fill, gap: 14 }, [t("Expert Mode", { size: 31, bold: true }), t("Direct fitness, nutrition, macros, training, and recovery guidance.", { size: 22, color: C.soft })]), { height: fill }),
              glassCard("ai-memory", column({ width: fill, height: fill, gap: 14 }, [t("Persistent Memory", { size: 31, bold: true }), t("Goals, habits, history, missed workouts, hydration, protein, and preferences.", { size: 22, color: C.soft })]), { height: fill }),
              glassCard("ai-llm", column({ width: fill, height: fill, gap: 14 }, [t("Future Local LLM", { size: 31, bold: true, color: C.redHot }), t("Custom transformer research for proprietary fitness + companion intelligence.", { size: 22, color: C.soft })]), { height: fill }),
            ]
          ),
        ]
      ),
      "This is the technical heart of the pitch. Stress the separation between expert mode and companion mode. That avoids unsafe tone mixing and creates a better user experience."
    );
  });

  addSlide(presentation, {}, (slide) => {
    slideRoot(
      slide,
      grid(
        { name: "workout-root", width: fill, height: fill, columns: [fr(0.95), fr(1.05)], rows: [auto, fr(1)], padding: { x: 82, y: 70 }, columnGap: 54, rowGap: 42 },
        [
          titleBlock("Workout Intelligence", "From static exercises to adaptive progression.", "GrindHaus can evolve from workout discovery into a behavior-aware training engine.", 2),
          glassCard(
            "muscle-map",
            column(
              { width: fill, height: fill, justify: "center", align: "center", gap: 22 },
              [
                t("TARGETED MUSCLE GRAPH", { size: 30, bold: true, color: C.redHot, align: "center" }),
                grid(
                  { name: "muscle-grid", width: fill, height: hug, columns: [fr(1), fr(1)], columnGap: 18, rowGap: 18 },
                  ["Chest", "Back", "Shoulders", "Legs", "Arms", "Core"].map((m, i) =>
                    panel({ name: `muscle-${i}`, fill: i % 2 ? C.glass2 : "#1A1113", borderRadius: "rounded-full", padding: { x: 24, y: 16 } }, t(m, { size: 26, bold: true, align: "center" }))
                  )
                ),
                t("Exercise selection → muscle targeting → volume tracking → progressive overload", { size: 24, color: C.soft, align: "center", width: wrap(760) }),
              ]
            ),
            { height: fill, padding: { x: 40, y: 40 } }
          ),
          column(
            { name: "workout-right", width: fill, height: fill, gap: 18 },
            [
              glassCard("workout-feature-1", bulletList(["Targeted muscle selection", "Exercise recommendations by goal", "Beginner-to-advanced plan logic"]), { height: fixed(188) }),
              glassCard("workout-feature-2", bulletList(["Progressive overload recommendations", "Missed-session recovery planning", "Future form correction with video AI"]), { height: fixed(188) }),
              glassCard("workout-feature-3", t("Future direction: AI-generated weekly programs adapt to adherence, sleep, soreness, equipment, and body-composition goals.", { size: 25, bold: true, color: C.ink }), { height: fixed(160), fill: "#160B0D" }),
            ]
          ),
        ]
      ),
      "Show that workout intelligence is not only a list of exercises. The real value is adaptive planning and progressive overload based on user behavior."
    );
  });

  addSlide(presentation, {}, (slide) => {
    slideRoot(
      slide,
      grid(
        { name: "nutrition-root", width: fill, height: fill, columns: [fr(1.05), fr(0.95)], rows: [auto, fr(1)], padding: { x: 82, y: 70 }, columnGap: 56, rowGap: 42 },
        [
          titleBlock("Nutrition Intelligence", "Food guidance that adapts to goals and habits.", "The system turns daily nutrition signals into small, actionable coaching moments.", 2),
          column(
            { name: "nutrition-left", width: fill, height: fill, gap: 18 },
            [
              glassCard("nutrition-macros", grid({ width: fill, height: fill, columns: [fr(1), fr(1), fr(1)], columnGap: 20 }, [
                metric("protein target", "120g", "Example muscle-gain target", C.green),
                metric("water target", "3L", "Hydration habit loop", C.cyan),
                metric("meal timing", "4x", "Practical daily structure", C.amber),
              ]), { height: fixed(210) }),
              glassCard("nutrition-bullets", bulletList(["Goal-specific diet generation", "Macro and hydration tracking", "Protein gap reminders", "Context-aware meal suggestions"]), { height: fixed(245) }),
              glassCard("nutrition-note", t("The AI converts health data into one next best action.", { size: 30, bold: true, color: C.ink }), { height: fixed(126), fill: "#151018" }),
            ]
          ),
          glassCard(
            "nutrition-flow",
            column(
              { width: fill, height: fill, justify: "center", gap: 28 },
              [
                t("Input signals", { size: 28, bold: true, color: C.redHot }),
                bulletList(["Goal: muscle gain", "Weight: 82kg", "Protein today: 60g", "Water today: 1.2L"], C.cyan),
                rule({ width: fill, stroke: C.line, weight: 2 }),
                t("AI output", { size: 28, bold: true, color: C.redHot }),
                t("You are behind on protein and hydration today. Add one high-protein meal and 800ml water before dinner.", { size: 30, bold: true, color: C.ink }),
              ]
            ),
            { height: fill, padding: { x: 42, y: 42 } }
          ),
        ]
      ),
      "Make nutrition sound practical, not medical. We are building behavior support, not replacing doctors or dieticians."
    );
  });

  addSlide(presentation, {}, (slide) => {
    slideRoot(
      slide,
      grid(
        { name: "community-root", width: fill, height: fill, columns: [fr(1), fr(1)], rows: [auto, fr(1)], padding: { x: 82, y: 70 }, columnGap: 56, rowGap: 42 },
        [
          titleBlock("Community + Social", "Accountability is a product feature.", "People continue when they feel seen, challenged, and supported.", 2),
          glassCard("community-left", column({ width: fill, height: fill, justify: "center", gap: 28 }, [
            t("Community Loop", { title: true, size: 52, bold: true, color: C.ink }),
            miniArchitecture(["Post", "Reaction", "Challenge", "Progress", "Retention"], 122, 24, 17),
            t("Future creator layer: trainers, students, athletes, and local gyms can publish challenges, plans, and transformation journeys.", { size: 27, color: C.soft }),
          ]), { height: fill }),
          column({ name: "community-right", width: fill, height: fill, gap: 24 }, [
            glassCard("community-1", bulletList(["Progress sharing", "Live accountability posts", "AI-assisted encouragement", "Group challenges"]), { height: fixed(240) }),
            glassCard("community-2", bulletList(["College fitness clubs", "Gym partnerships", "Creator-led programs", "Regional health communities"]), { height: fixed(240) }),
            glassCard("community-3", t("Social proof can become the growth engine: users invite friends because consistency is easier together.", { size: 31, bold: true }), { height: fixed(185), fill: "#160B0D" }),
          ]),
        ]
      ),
      "Connect community to retention. Investors and incubators care about usage loops. Community creates accountability and organic growth."
    );
  });

  addSlide(presentation, {}, (slide) => {
    slideRoot(
      slide,
      grid(
        { name: "tech-root", width: fill, height: fill, columns: [fr(1)], rows: [auto, fr(1)], padding: { x: 82, y: 70 }, rowGap: 42 },
        [
          titleBlock("Tech Stack", "Built like a scalable SaaS, evolving into an AI research platform.", "The current architecture separates product, backend services, AI memory, and future model development."),
          grid(
            { name: "tech-grid", width: fill, height: fill, columns: [fr(1), fr(1), fr(1), fr(1)], columnGap: 22 },
            [
              glassCard("tech-front", column({ width: fill, height: fill, gap: 20 }, [t("Frontend", { size: 40, bold: true, color: C.redHot }), bulletList(["React", "Framer Motion", "Styled Components", "Lenis smooth scroll"])]), { height: fill }),
              glassCard("tech-back", column({ width: fill, height: fill, gap: 20 }, [t("Backend", { size: 40, bold: true, color: C.redHot }), bulletList(["Node.js", "Express", "JWT auth", "API v1 routes"])]), { height: fill }),
              glassCard("tech-ai", column({ width: fill, height: fill, gap: 20 }, [t("AI Layer", { size: 40, bold: true, color: C.redHot }), bulletList(["Memory service", "Routing engine", "Notification triggers", "Custom transformer research"])]), { height: fill }),
              glassCard("tech-future", column({ width: fill, height: fill, gap: 20 }, [t("Future", { size: 40, bold: true, color: C.redHot }), bulletList(["C++ inference", "Wearables", "AI video generation", "Institutional GPU training"])]), { height: fill }),
            ]
          ),
        ]
      ),
      "This slide proves execution maturity. The app is not a static landing page. It has frontend, backend, auth, API structure, AI memory, and a future research path."
    );
  });

  addSlide(presentation, {}, (slide) => {
    slideRoot(
      slide,
      grid(
        { name: "market-root", width: fill, height: fill, columns: [fr(0.95), fr(1.05)], rows: [auto, fr(1)], padding: { x: 82, y: 70 }, columnGap: 54, rowGap: 34 },
        [
          titleBlock("Market Opportunity", "AI + digital health + fitness is converging now.", "GrindHaus sits at the intersection of personalized AI, wellness apps, digital health, and youth fitness behavior.", 2),
          column({ name: "market-left", width: fill, height: fill, gap: 16 }, [
            glassCard("market-m1", metric("India digital health market by 2033", "$106.97B", "Grand View Research projection", C.green), { height: fixed(192) }),
            glassCard("market-m2", metric("fitness mHealth apps CAGR", "14.1%", "Global 2024-2030 estimate", C.cyan), { height: fixed(192) }),
            glassCard("market-m3", metric("IndiaAI Mission outlay", "₹10,300Cr+", "National push for AI compute and startups", C.redHot), { height: fixed(192) }),
          ]),
          glassCard(
            "market-chart-panel",
            column(
              { width: fill, height: fill, gap: 16 },
              [
                t("Market expansion signals", { size: 34, bold: true, color: C.ink }),
                chart({
                  name: "market-chart-main",
                  chartType: "bar",
                  width: fill,
                  height: fill,
                  config: {
                    title: "",
                    categories: ["Global fitness apps 2024", "Global wellness apps 2030", "India digital health 2024", "India digital health 2033"],
                    series: [{ name: "USD Bn", values: [10.6, 26.2, 14.5, 107.0] }],
                  },
                }),
                t("Sources: WHO, Grand View Research, PIB IndiaAI Mission.", { size: 15, color: C.muted }),
              ]
            ),
            { height: fill, padding: { x: 34, y: 30 } }
          ),
        ]
      ),
      "Keep this grounded. We are not claiming to capture the whole market. The point is that the timing is strong: AI infrastructure, digital health, wellness behavior, and fitness apps are all growing."
    );
  });

  addSlide(presentation, {}, (slide) => {
    slideRoot(
      slide,
      grid(
        { name: "why-now-root", width: fill, height: fill, columns: [fr(1)], rows: [auto, fr(1)], padding: { x: 82, y: 70 }, rowGap: 46 },
        [
          titleBlock("Why Now", "The infrastructure finally exists for personal AI wellness.", "The next generation of health products will not be passive trackers. They will be active companions."),
          grid(
            { name: "why-grid", width: fill, height: fill, columns: [fr(1), fr(1), fr(1), fr(1)], columnGap: 22 },
            [
              glassCard("why-ai", column({ width: fill, height: fill, gap: 16 }, [t("AI adoption", { size: 38, bold: true, color: C.redHot }), t("Users now understand AI assistants and expect personalization.", { size: 25, color: C.soft })]), { height: fill }),
              glassCard("why-health", column({ width: fill, height: fill, gap: 16 }, [t("Health urgency", { size: 38, bold: true, color: C.redHot }), t("Physical inactivity and lifestyle diseases create public health pressure.", { size: 25, color: C.soft })]), { height: fill }),
              glassCard("why-wearables", column({ width: fill, height: fill, gap: 16 }, [t("Wearable data", { size: 38, bold: true, color: C.redHot }), t("More users generate signals that can power adaptive recommendations.", { size: 25, color: C.soft })]), { height: fill }),
              glassCard("why-india", column({ width: fill, height: fill, gap: 16 }, [t("India AI mission", { size: 38, bold: true, color: C.redHot }), t("Government compute, datasets, skilling, and startup financing align with this build.", { size: 25, color: C.soft })]), { height: fill }),
            ]
          ),
        ]
      ),
      "This is where you connect GrindHaus to India's AI future. Say: if India can build AI for commerce and productivity, it can also build AI for human improvement."
    );
  });

  addSlide(presentation, {}, (slide) => {
    const competitors = [
      ["Capability", "Fitness Apps", "ChatGPT", "Generic AI", "GrindHaus AI"],
      ["Fitness specialization", "Medium", "Low", "Low", "High"],
      ["Persistent fitness memory", "Low", "Low", "Medium", "High"],
      ["Emotional accountability", "Low", "Medium", "Medium", "High"],
      ["Community loop", "Medium", "None", "Low", "High"],
      ["Custom AI roadmap", "Low", "None", "Medium", "High"],
    ];
    slideRoot(
      slide,
      grid(
        { name: "compare-root", width: fill, height: fill, columns: [fr(1)], rows: [auto, fr(1)], padding: { x: 82, y: 70 }, rowGap: 38 },
        [
          titleBlock("Competitor Comparison", "The gap is not content. The gap is adaptive intelligence.", "GrindHaus combines specialization, memory, behavior, and ecosystem design."),
          glassCard(
            "comparison-table",
            grid(
              { name: "table-grid", width: fill, height: fill, columns: [fr(1.5), fr(1), fr(1), fr(1), fr(1.05)], rowGap: 12, columnGap: 12 },
              competitors.flatMap((rowData, r) =>
                rowData.map((cell, c) =>
                  panel(
                    {
                      name: `cell-${r}-${c}`,
                      fill: r === 0 ? C.red : c === 4 ? "#1B0D10" : "#101116",
                      borderRadius: "rounded-lg",
                      padding: { x: 16, y: 13 },
                      height: fixed(r === 0 ? 62 : 74),
                    },
                    t(cell, {
                      size: r === 0 ? 21 : 20,
                      bold: r === 0 || c === 0 || c === 4,
                      color: c === 4 && r > 0 ? C.green : C.ink,
                      align: "center",
                    })
                  )
                )
              )
            ),
            { height: fill, padding: { x: 28, y: 28 } }
          ),
        ]
      ),
      "Do not attack competitors. Say each solves part of the problem, but GrindHaus combines the missing pieces into one adaptive system."
    );
  });

  addSlide(presentation, {}, (slide) => {
    slideRoot(
      slide,
      grid(
        { name: "business-root", width: fill, height: fill, columns: [fr(1)], rows: [auto, fr(1)], padding: { x: 82, y: 70 }, rowGap: 42 },
        [
          titleBlock("Business Model", "Accessible core guidance. Scalable ecosystem revenue.", "The model avoids aggressive paywalls while still creating durable revenue through premium, partner, and institutional layers."),
          grid(
            { name: "business-grid", width: fill, height: fill, columns: [fr(1), fr(1), fr(1), fr(1)], columnGap: 22 },
            [
              glassCard("biz-free", column({ width: fill, height: fill, gap: 18 }, [t("Free Core", { size: 36, bold: true, color: C.green }), t("Basic workouts, health guidance, community access, and lightweight AI support.", { size: 24, color: C.soft })]), { height: fill }),
              glassCard("biz-premium", column({ width: fill, height: fill, gap: 18 }, [t("Premium AI", { size: 36, bold: true, color: C.redHot }), t("Advanced coaching, personalization, plan generation, habit analytics, and deeper memory.", { size: 24, color: C.soft })]), { height: fill }),
              glassCard("biz-b2b", column({ width: fill, height: fill, gap: 18 }, [t("B2B / Gyms", { size: 36, bold: true, color: C.cyan }), t("Gym dashboards, trainer tools, student fitness programs, and institutional wellness.", { size: 24, color: C.soft })]), { height: fill }),
              glassCard("biz-ecosystem", column({ width: fill, height: fill, gap: 18 }, [t("AI Ecosystem", { size: 36, bold: true, color: C.amber }), t("Creator programs, wearable integrations, AI-generated content, and technical licensing.", { size: 24, color: C.soft })]), { height: fill }),
            ]
          ),
        ]
      ),
      "The key point: accessible does not mean non-commercial. The business scales through layers and partnerships, not by locking basic health guidance away from users."
    );
  });

  addSlide(presentation, {}, (slide) => {
    slideRoot(
      slide,
      column(
        { name: "accessible-root", width: fill, height: fill, padding: { x: 96, y: 72 }, gap: 26 },
        [
          chip("Dedicated Philosophy", C.redHot),
          t("Accessible AI Philosophy", { title: true, size: 66, bold: true, color: C.ink, width: wrap(1350), height: fixed(150) }),
          t("AI for human improvement. Not AI for exploitation.", { title: true, size: 38, bold: true, color: C.redHot, width: wrap(1360), height: fixed(102) }),
          grid(
            { name: "accessible-grid", width: fill, height: hug, columns: [fr(1), fr(1), fr(1)], columnGap: 26 },
            [
              glassCard("access-1", t("Core health guidance should remain accessible.", { size: 27, bold: true, color: C.ink }), { height: fixed(152) }),
              glassCard("access-2", t("AI wellness systems should not be hidden behind aggressive subscriptions.", { size: 27, bold: true, color: C.ink }), { height: fixed(152) }),
              glassCard("access-3", t("Scale should come from partnerships, innovation, infrastructure, and institutions.", { size: 27, bold: true, color: C.ink }), { height: fixed(152) }),
            ]
          ),
          t("GrindHaus AI aims to grow through ecosystem partnerships, technical infrastructure, institutional collaboration, and responsible innovation.", {
            size: 28,
            color: C.soft,
            width: wrap(1500),
          }),
        ]
      ),
      "This slide is important for CIIIT and government alignment. It shows values: inclusive technology, responsible AI, and ecosystem-led scaling."
    );
  });

  addSlide(presentation, {}, (slide) => {
    const phases = [
      ["Phase 1", "Frontend Platform", "Landing, routes, workout/nutrition/community UI, auth-ready product."],
      ["Phase 2", "AI Companion", "Memory, chat, habit tracking, reminders, dashboard personalization."],
      ["Phase 3", "Custom Model Research", "Dataset generation, dual-mode routing, transformer training experiments."],
      ["Phase 4", "Video AI + Wearables", "Form analysis, generated coaching content, wearable notification loops."],
      ["Phase 5", "Global Ecosystem", "Creator marketplace, gym partnerships, multilingual AI, Indian AI export."],
    ];
    slideRoot(
      slide,
      grid(
        { name: "roadmap-root", width: fill, height: fill, columns: [fr(1)], rows: [auto, fr(1)], padding: { x: 82, y: 70 }, rowGap: 42 },
        [
          titleBlock("Roadmap", "A realistic path from MVP to AI ecosystem.", "Each phase increases technical depth, user value, and institutional research potential."),
          column(
            { name: "phase-stack", width: fill, height: fill, gap: 14, justify: "center" },
            phases.map((p, i) =>
              row(
                { name: `phase-row-${i}`, width: fill, height: fixed(108), align: "center", gap: 18 },
                [
                  panel({ name: `phase-chip-${i}`, fill: i < 2 ? C.red : C.glass2, borderRadius: "rounded-full", padding: { x: 22, y: 18 }, width: fixed(150), height: fixed(78) }, t(p[0], { size: 24, bold: true, align: "center" })),
                  glassCard(
                    `phase-card-${i}`,
                    row(
                      { width: fill, height: fill, align: "center", gap: 28 },
                      [
                        t(p[1], { size: 34, bold: true, color: C.ink, width: fixed(430) }),
                        t(p[2], { size: 24, color: C.soft, width: wrap(1000) }),
                      ]
                    ),
                    { height: fixed(92), padding: { x: 24, y: 16 }, fill: i < 2 ? "#160B0D" : C.glass }
                  ),
                ]
              )
            )
          ),
        ]
      ),
      "Be clear on execution: Phase 1 and 2 are product/MVP. Later phases need support, compute, mentorship, and research infrastructure."
    );
  });

  addSlide(presentation, {}, (slide) => {
    slideRoot(
      slide,
      grid(
        { name: "ciiit-root", width: fill, height: fill, columns: [fr(1), fr(1)], rows: [auto, fr(1)], padding: { x: 82, y: 70 }, columnGap: 54, rowGap: 42 },
        [
          titleBlock("Why CIIIT Should Support This", "A national-level AI product can start from Chandrapur.", "GrindHaus AI aligns with innovation, incubation, skill development, applied AI, and emerging technology infrastructure.", 2),
          glassCard("ciiit-left", column({ width: fill, height: fill, justify: "center", gap: 28 }, [
            t("Institutional Fit", { title: true, size: 50, bold: true }),
            bulletList(["Student-led innovation with startup potential", "AI research and model development pathway", "Hands-on full-stack engineering project", "Public-private innovation alignment", "Potential for internships, training, and student participation"]),
          ]), { height: fill }),
          glassCard("ciiit-right", column({ width: fill, height: fill, justify: "center", gap: 28 }, [
            t("CIIIT Value Creation", { title: true, size: 50, bold: true, color: C.redHot }),
            bulletList(["Showcase AI incubation from GCOE Chandrapur", "Create a local technical talent pipeline", "Use GPU/infrastructure for applied AI research", "Build a product that can represent regional innovation nationally", "Connect academia, government, and startup execution"]),
          ]), { height: fill, fill: "#160B0D" }),
        ]
      ),
      "This is the government-funding alignment slide. Make it about institutional impact, not only your startup needs."
    );
  });

  addSlide(presentation, {}, (slide) => {
    slideRoot(
      slide,
      grid(
        { name: "need-root", width: fill, height: fill, columns: [fr(1)], rows: [auto, fr(1)], padding: { x: 82, y: 70 }, rowGap: 42 },
        [
          titleBlock("What We Need", "Support that converts a strong MVP into a scalable AI venture.", "The ask is practical: infrastructure, mentorship, incubation, and technical guidance."),
          grid(
            { name: "need-grid", width: fill, height: fill, columns: [fr(1), fr(1), fr(1)], columnGap: 24, rowGap: 24 },
            [
              glassCard("need-gpu", column({ width: fill, height: fill, gap: 15 }, [t("GPU Systems", { size: 36, bold: true, color: C.redHot }), t("High-end GPU access for model training, local inference tests, and AI video experiments.", { size: 25, color: C.soft })]), { height: fixed(245) }),
              glassCard("need-incubation", column({ width: fill, height: fill, gap: 15 }, [t("Incubation", { size: 36, bold: true, color: C.redHot }), t("Workspace, structure, founder guidance, product reviews, and investor readiness.", { size: 25, color: C.soft })]), { height: fixed(245) }),
              glassCard("need-mentors", column({ width: fill, height: fill, gap: 15 }, [t("Mentorship", { size: 36, bold: true, color: C.redHot }), t("AI, healthcare, fitness, startup, legal, and business model mentorship.", { size: 25, color: C.soft })]), { height: fixed(245) }),
              glassCard("need-research", column({ width: fill, height: fill, gap: 15 }, [t("Research Ecosystem", { size: 36, bold: true, color: C.redHot }), t("Faculty guidance, student research groups, dataset work, and responsible AI validation.", { size: 25, color: C.soft })]), { height: fixed(245) }),
              glassCard("need-cloud", column({ width: fill, height: fill, gap: 15 }, [t("Infrastructure", { size: 36, bold: true, color: C.redHot }), t("Deployment support, testing, monitoring, databases, security, and scaling architecture.", { size: 25, color: C.soft })]), { height: fixed(245) }),
              glassCard("need-network", column({ width: fill, height: fill, gap: 15 }, [t("Partnerships", { size: 36, bold: true, color: C.redHot }), t("Gyms, colleges, sports clubs, health programs, and early user pilots.", { size: 25, color: C.soft })]), { height: fixed(245) }),
            ]
          ),
        ]
      ),
      "Be specific. You are not just asking for money; you are asking for an environment where technical innovation can mature."
    );
  });

  addSlide(presentation, {}, (slide) => {
    slideRoot(
      slide,
      grid(
        { name: "impact-root", width: fill, height: fill, columns: [fr(1)], rows: [auto, fr(1)], padding: { x: 82, y: 70 }, rowGap: 42 },
        [
          titleBlock("Long-Term Impact", "A platform that improves people and builds AI capability.", "The impact extends beyond users into students, institutions, local innovation, and India's AI product ecosystem."),
          grid(
            { name: "impact-grid", width: fill, height: fill, columns: [fr(1), fr(1), fr(1), fr(1)], columnGap: 22 },
            [
              glassCard("impact-health", column({ width: fill, height: fill, gap: 16 }, [t("Health Transformation", { size: 34, bold: true, color: C.redHot }), t("Better consistency, habits, strength, nutrition, and self-belief.", { size: 25, color: C.soft })]), { height: fill }),
              glassCard("impact-ai", column({ width: fill, height: fill, gap: 16 }, [t("AI Research", { size: 34, bold: true, color: C.redHot }), t("Applied model training, routing, memory systems, and local inference research.", { size: 25, color: C.soft })]), { height: fill }),
              glassCard("impact-students", column({ width: fill, height: fill, gap: 16 }, [t("Student Opportunities", { size: 34, bold: true, color: C.redHot }), t("Internships, open projects, startup learning, and technical upskilling.", { size: 25, color: C.soft })]), { height: fill }),
              glassCard("impact-india", column({ width: fill, height: fill, gap: 16 }, [t("Indian AI Product", { size: 34, bold: true, color: C.redHot }), t("A global product narrative built from a regional innovation ecosystem.", { size: 25, color: C.soft })]), { height: fill }),
            ]
          ),
        ]
      ),
      "End the institutional argument here: GrindHaus can become both a business and a local AI capability builder."
    );
  });

  addSlide(presentation, {}, (slide) => {
    slideRoot(
      slide,
      column(
        { name: "closing-root", width: fill, height: fill, padding: { x: 100, y: 86 }, justify: "center", gap: 28 },
        [
          t("GRINDHAUS AI", { name: "closing-brand", title: true, size: 82, bold: true, color: C.ink, align: "center", width: wrap(1500) }),
          t("The Future of AI-Powered Human Performance", { name: "closing-sub", title: true, size: 40, bold: true, color: C.redHot, align: "center", width: wrap(1500) }),
          t("We are building AI that helps people become stronger, healthier, more consistent, and more capable.", {
            name: "closing-copy",
            size: 29,
            color: C.soft,
            align: "center",
            width: wrap(1150),
          }),
          panel(
            { name: "closing-statement", fill: "#160B0D", borderRadius: "rounded-full", padding: { x: 42, y: 22 }, width: fixed(1040) },
            t("Built in Chandrapur. Designed for the world.", { size: 36, bold: true, color: C.ink, align: "center", width: fixed(950) })
          ),
        ]
      ),
      "Close with conviction. Pause before the final line. This is the line they should remember: Built in Chandrapur. Designed for the world."
    );
  });

  const pptxPath = `${OUT_DIR}/GRINDHAUS_AI_CIIIT_Pitch_Deck_v5.pptx`;
  const pptxBlob = await PresentationFile.exportPptx(presentation);
  await pptxBlob.save(pptxPath);

  for (let i = 0; i < presentation.slides.items.length; i += 1) {
    const slide = presentation.slides.items[i];
    const png = await slide.export({ format: "png" });
    await fs.writeFile(
      `${PREVIEW_DIR}/slide-${String(i + 1).padStart(2, "0")}.png`,
      Buffer.from(await png.arrayBuffer())
    );
  }

  return {
    pptxPath,
    previewDir: PREVIEW_DIR,
    slideCount: presentation.slides.items.length,
  };
}
