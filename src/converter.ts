export type WidgetType =
  | 'heading'
  | 'text-editor'
  | 'image'
  | 'button'
  | 'video'
  | 'icon'
  | 'icon-box'
  | 'image-box'
  | 'divider'
  | 'spacer'
  | 'nav-menu'
  | 'image-carousel'
  | 'google_maps'
  | 'form'
  | 'html'
  | 'container'
  | 'counter'
  | 'progress-bar'
  | 'alert'
  | 'tabs'
  | 'accordion'
  | 'toggle'
  | 'star-rating'
  | 'testimonial'
  | 'price-table'
  | 'call-to-action'
  | 'social-icons';

export const WIDGET_LABELS: Record<WidgetType, string> = {
  'heading': 'Heading',
  'text-editor': 'Text Editor',
  'image': 'Image',
  'button': 'Button',
  'video': 'Video',
  'icon': 'Icon',
  'icon-box': 'Icon Box',
  'image-box': 'Image Box',
  'divider': 'Divider',
  'spacer': 'Spacer',
  'nav-menu': 'Nav Menu',
  'image-carousel': 'Image Carousel',
  'google_maps': 'Map',
  'form': 'Form',
  'html': 'HTML',
  'container': 'Container',
  'counter': 'Counter',
  'progress-bar': 'Progress Bar',
  'alert': 'Alert',
  'tabs': 'Tabs',
  'accordion': 'Accordion',
  'toggle': 'Toggle',
  'star-rating': 'Star Rating',
  'testimonial': 'Testimonial',
  'price-table': 'Price Table',
  'call-to-action': 'Call To Action',
  'social-icons': 'Social Icons',
};

export const WIDGET_ICONS: Record<WidgetType, string> = {
  'heading': '🔤',
  'text-editor': '📝',
  'image': '🖼',
  'button': '🔘',
  'video': '▶️',
  'icon': '✨',
  'icon-box': '📦',
  'image-box': '🖼',
  'divider': '➖',
  'spacer': '⬜',
  'nav-menu': '☰',
  'image-carousel': '🎠',
  'google_maps': '🗺',
  'form': '📋',
  'html': '🔲',
  'container': '📦',
  'counter': '🔢',
  'progress-bar': '📊',
  'alert': '⚠️',
  'tabs': '🗂',
  'accordion': '🪗',
  'toggle': '🔀',
  'star-rating': '⭐',
  'testimonial': '💬',
  'price-table': '💰',
  'call-to-action': '📣',
  'social-icons': '🔗',
};

export const COMPATIBLE_WIDGETS: WidgetType[] = [
  'heading', 'text-editor', 'image', 'button', 'video', 'icon', 'icon-box',
  'image-box', 'divider', 'spacer', 'nav-menu', 'image-carousel', 'google_maps',
  'form', 'html', 'container', 'counter', 'progress-bar', 'alert', 'tabs',
  'accordion', 'toggle', 'star-rating', 'testimonial', 'price-table',
  'call-to-action', 'social-icons',
];

export interface ElementNode {
  id: string;
  widgetType: WidgetType;
  badge: string;
  preview: string;
  children: ElementNode[];
  depth: number;
  htmlElement: string;
  settings: Record<string, unknown>;
  layoutDirection: 'row' | 'column';
  columnCount: number;
}

let idCounter = 0;
function nextId(): string {
  return `el_${++idCounter}_${Math.random().toString(36).slice(2, 7)}`;
}

function elementorId(): string {
  return Math.floor(Math.random() * 0xffffffff).toString(16).padStart(8, '0').slice(0, 8);
}

function dim(size: number, unit = 'px'): Record<string, unknown> {
  return { unit, size, sizes: [] };
}

function spacing(top: string, right: string, bottom: string, left: string, unit = 'px', isLinked = false): Record<string, unknown> {
  return { unit, top, right, bottom, left, isLinked };
}

function spacingLinked(val: string, unit = 'px'): Record<string, unknown> {
  return { unit, top: val, right: val, bottom: val, left: val, isLinked: true };
}

function flexGap(size: number, unit = 'px'): Record<string, unknown> {
  return { unit, size, column: String(size), row: String(size), isLinked: true };
}

// ─── Style extraction ────────────────────────────────────────────────────────

interface ParsedStyles {
  color?: string;
  backgroundColor?: string;
  fontSize?: string;
  fontFamily?: string;
  fontWeight?: string;
  fontStyle?: string;
  textAlign?: string;
  textTransform?: string;
  textDecoration?: string;
  lineHeight?: string;
  letterSpacing?: string;
  borderRadius?: string;
  borderColor?: string;
  borderWidth?: string;
  borderStyle?: string;
  padding?: string;
  paddingTop?: string;
  paddingRight?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  margin?: string;
  marginTop?: string;
  marginRight?: string;
  marginBottom?: string;
  marginLeft?: string;
  width?: string;
  maxWidth?: string;
  height?: string;
  minHeight?: string;
  backgroundImage?: string;
  backgroundSize?: string;
  backgroundPosition?: string;
  backgroundRepeat?: string;
  opacity?: string;
  boxShadow?: string;
  textShadow?: string;
  display?: string;
  flexDirection?: string;
  justifyContent?: string;
  alignItems?: string;
  gap?: string;
  gridTemplateColumns?: string;
  transition?: string;
  transform?: string;
  filter?: string;
  animation?: string;
  animationName?: string;
  cursor?: string;
  objectFit?: string;
  zIndex?: string;
  position?: string;
  overflow?: string;
}

// Properties with a direct Elementor mapping — NOT duplicated into custom_css
const MAPPED_CSS_PROPS = new Set([
  'color', 'background-color', 'background-image', 'background-size',
  'background-position', 'background-repeat', 'font-size', 'font-family',
  'font-weight', 'font-style', 'font', 'text-align', 'text-transform',
  'text-decoration', 'line-height', 'letter-spacing', 'border-radius',
  'border-color', 'border-width', 'border-style', 'border',
  'padding', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
  'margin', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
  'width', 'max-width', 'height', 'opacity', 'box-shadow', 'text-shadow',
]);

// Properties that have no Elementor equivalent → always go into custom_css selector{}
const ALWAYS_CUSTOM_CSS_PROPS = new Set([
  'transition', 'transform', 'filter', 'clip-path',
  'animation', 'animation-name', 'animation-duration', 'animation-timing-function',
  'animation-delay', 'animation-iteration-count', 'animation-direction',
  'animation-fill-mode', 'animation-play-state',
  'object-fit', 'object-position',
  'overflow', 'overflow-x', 'overflow-y',
  'cursor', 'pointer-events', 'user-select', 'resize', 'appearance',
  'mix-blend-mode', 'backdrop-filter', 'isolation',
  'flex-wrap', 'flex-grow', 'flex-shrink', 'flex-basis', 'flex',
  'align-content', 'align-self', 'justify-self', 'justify-items',
  'grid-template-rows', 'grid-column', 'grid-row', 'grid-area',
  'column-gap', 'row-gap',
  'list-style', 'list-style-type', 'list-style-position',
  'vertical-align', 'white-space', 'word-break', 'word-wrap', 'overflow-wrap',
  'text-overflow', 'text-indent',
  'outline', 'outline-color', 'outline-width', 'outline-offset',
  'visibility', 'float', 'clear', 'display',
  'top', 'right', 'bottom', 'left', 'position', 'z-index',
  'min-width', 'min-height', 'max-height',
  'box-sizing', 'content', 'will-change', 'column-count',
]);

function parseInlineStyle(raw: string): ParsedStyles {
  const styles: ParsedStyles = {};
  if (!raw) return styles;
  raw.split(';').forEach(decl => {
    const colonIdx = decl.indexOf(':');
    if (colonIdx < 0) return;
    const prop = decl.slice(0, colonIdx).trim().toLowerCase();
    const val = decl.slice(colonIdx + 1).trim();
    if (!prop || !val) return;

    // font shorthand
    if (prop === 'font') {
      const lhMatch = val.match(/(\d[\d.]*(?:px|em|rem|%)?)\/(\d[\d.]*(?:px|em|rem|%)?)/);
      if (lhMatch) { styles.fontSize = lhMatch[1]; styles.lineHeight = lhMatch[2]; }
      const weightMatch = val.match(/\b(bold|bolder|lighter|100|200|300|400|500|600|700|800|900)\b/);
      if (weightMatch) styles.fontWeight = weightMatch[1];
      return;
    }

    // background shorthand: extract color if it's not an image/gradient
    if (prop === 'background') {
      if (!val.includes('url(') && !val.includes('gradient(') && !val.includes('linear-') && !val.includes('radial-')) {
        // Could be a bare color value like "#111" or "rgba(...)" or "white"
        const colorMatch = val.match(/^(#[\da-fA-F]{3,8}|rgba?\([^)]+\)|hsla?\([^)]+\)|\w+)$/);
        if (colorMatch) { styles.backgroundColor = colorMatch[1]; return; }
        // Multi-value: pick the color token
        const tokens = val.trim().split(/\s+/);
        const colorToken = tokens.find(t => /^(#[\da-fA-F]{3,8}|rgba?\(|hsla?\(|transparent|white|black|red|blue|green|grey|gray)/.test(t));
        if (colorToken) styles.backgroundColor = colorToken;
      } else if (val.includes('url(')) {
        styles.backgroundImage = val;
      }
      return;
    }

    // border shorthand: extract color, width, style
    if (prop === 'border') {
      const wM = val.match(/(\d+(?:\.\d+)?(?:px|em|rem))/);
      if (wM) styles.borderWidth = wM[1];
      const styleM = val.match(/\b(solid|dashed|dotted|double|none)\b/);
      if (styleM) styles.borderStyle = styleM[1];
      const colorM = val.match(/(#[\da-fA-F]{3,8}|rgba?\([^)]+\)|hsla?\([^)]+\)|transparent)/);
      if (colorM) styles.borderColor = colorM[1];
      return;
    }

    const camel = prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase()) as keyof ParsedStyles;
    (styles as Record<string, string>)[camel] = val;
  });
  return styles;
}

interface StyleMapResult {
  computedStyles: Map<Element, ParsedStyles>;
  customCssPerElement: Map<Element, string>;
  rawDeclsPerElement: Map<Element, Map<string, string>>;
}

interface CssBlock {
  selector: string;
  body: string;
  isAtRule: boolean;
}

function parseCssBlocks(css: string): CssBlock[] {
  const blocks: CssBlock[] = [];
  let i = 0;
  const len = css.length;
  while (i < len) {
    const commentStart = css.indexOf('/*', i);
    const nextBrace = css.indexOf('{', i);
    if (nextBrace === -1) break;
    if (commentStart !== -1 && commentStart < nextBrace) {
      const commentEnd = css.indexOf('*/', commentStart + 2);
      i = commentEnd === -1 ? len : commentEnd + 2;
      continue;
    }
    const selectorRaw = css.slice(i, nextBrace).trim();
    let depth = 0;
    let j = nextBrace;
    while (j < len) {
      if (css[j] === '{') depth++;
      else if (css[j] === '}') { depth--; if (depth === 0) break; }
      j++;
    }
    const body = css.slice(nextBrace + 1, j).trim();
    blocks.push({ selector: selectorRaw, body, isAtRule: selectorRaw.startsWith('@') });
    i = j + 1;
  }
  return blocks;
}

function selectorMatchesEl(el: Element, sel: string): boolean {
  const trimmed = sel.trim();
  const withoutPseudo = trimmed.replace(/::?[\w-]+(\([^)]*\))?/g, '');
  if (/[\s>+~]/.test(withoutPseudo)) return false;
  try { return el.matches(trimmed); } catch { return false; }
}

function selectorToElementor(sel: string): string {
  const pseudo = sel.trim().match(/(:{1,2}[\w-]+(?:\([^)]*\))?)+$/)?.[0] || '';
  return `selector${pseudo}`;
}

function buildCustomCss(el: Element, blocks: CssBlock[]): string {
  const parts: string[] = [];
  const referencedKeyframes = new Set<string>();
  const elClasses = Array.from(el.classList);
  const elId = el.id;

  for (const block of blocks) {
    if (block.isAtRule) continue;
    for (const sel of block.selector.split(',').map(s => s.trim()).filter(Boolean)) {
      if (!selectorMatchesEl(el, sel)) continue;
      parts.push(`${selectorToElementor(sel)} {\n${block.body}\n}`);
      const animMatch = block.body.match(/animation(?:-name)?\s*:\s*([\w-]+)/);
      if (animMatch) referencedKeyframes.add(animMatch[1]);
    }
  }

  const inlineAnim = (el.getAttribute('style') || '').match(/animation(?:-name)?\s*:\s*([\w-]+)/)?.[1];
  if (inlineAnim) referencedKeyframes.add(inlineAnim);

  for (const block of blocks) {
    if (!block.isAtRule) continue;
    const kfMatch = block.selector.match(/^@keyframes\s+([\w-]+)/);
    if (kfMatch && referencedKeyframes.has(kfMatch[1])) parts.push(`${block.selector} {\n${block.body}\n}`);
  }

  for (const block of blocks) {
    if (!block.isAtRule || !block.selector.startsWith('@media')) continue;
    const innerBlocks = parseCssBlocks(block.body);
    const matched: string[] = [];
    for (const inner of innerBlocks) {
      if (inner.isAtRule) continue;
      for (const sel of inner.selector.split(',').map(s => s.trim()).filter(Boolean)) {
        if (selectorMatchesEl(el, sel)) {
          matched.push(`  ${selectorToElementor(sel)} {\n${inner.body.split('\n').map(l => '    ' + l).join('\n')}\n  }`);
          break;
        }
        const hasClass = elClasses.some(cls => sel.includes(`.${cls}`));
        const hasId = elId && sel.includes(`#${elId}`);
        if (hasClass || hasId) {
          matched.push(`  ${selectorToElementor(sel)} {\n${inner.body.split('\n').map(l => '    ' + l).join('\n')}\n  }`);
          break;
        }
      }
    }
    if (matched.length > 0) parts.push(`${block.selector} {\n${matched.join('\n')}\n}`);
  }

  return parts.join('\n\n');
}

function collectRawDecls(el: Element, blocks: CssBlock[]): Map<string, string> {
  const decls = new Map<string, string>();

  function processBody(body: string) {
    body.split(';').forEach(decl => {
      const colonIdx = decl.indexOf(':');
      if (colonIdx < 0) return;
      const prop = decl.slice(0, colonIdx).trim().toLowerCase();
      const val = decl.slice(colonIdx + 1).trim();
      if (prop && val) decls.set(prop, val);
    });
  }

  for (const block of blocks) {
    if (block.isAtRule) continue;
    for (const sel of block.selector.split(',').map(s => s.trim()).filter(Boolean)) {
      if (selectorMatchesEl(el, sel)) processBody(block.body);
    }
  }
  const inline = el.getAttribute('style') || '';
  if (inline) processBody(inline);
  return decls;
}

function buildStyleMap(doc: Document): StyleMapResult {
  const computedStyles = new Map<Element, ParsedStyles>();
  const customCssPerElement = new Map<Element, string>();
  const rawDeclsPerElement = new Map<Element, Map<string, string>>();

  interface Rule { selector: string; declarations: ParsedStyles }
  const rules: Rule[] = [];
  let allRawCss = '';

  doc.querySelectorAll('style').forEach(styleEl => {
    const text = styleEl.textContent || '';
    allRawCss += text + '\n';
  });

  // Parse all CSS blocks once — reuse for both computed styles and custom_css
  const allBlocks = parseCssBlocks(allRawCss);

  // Build flat rules from non-@-rule blocks for computed style merging
  for (const block of allBlocks) {
    if (block.isAtRule) continue;
    const declarations = parseInlineStyle(block.body);
    block.selector.split(',').map(s => s.trim()).filter(Boolean).forEach(sel => rules.push({ selector: sel, declarations }));
  }

  doc.body.querySelectorAll('*').forEach(el => {
    const merged: ParsedStyles = {};
    for (const rule of rules) {
      try { if (el.matches(rule.selector)) Object.assign(merged, rule.declarations); } catch { /* skip */ }
    }
    const inline = el.getAttribute('style');
    if (inline) Object.assign(merged, parseInlineStyle(inline));
    if (Object.keys(merged).length > 0) computedStyles.set(el, merged);

    const css = buildCustomCss(el, allBlocks);
    if (css) customCssPerElement.set(el, css);

    const rawDecls = collectRawDecls(el, allBlocks);
    if (rawDecls.size > 0) rawDeclsPerElement.set(el, rawDecls);
  });

  return { computedStyles, customCssPerElement, rawDeclsPerElement };
}

function buildUnmappedCss(rawDecls: Map<string, string> | undefined): string {
  if (!rawDecls) return '';
  const lines: string[] = [];
  rawDecls.forEach((val, prop) => {
    if (ALWAYS_CUSTOM_CSS_PROPS.has(prop)) lines.push(`  ${prop}: ${val};`);
  });
  return lines.length > 0 ? `selector {\n${lines.join('\n')}\n}` : '';
}

// ─── Style → Elementor settings ─────────────────────────────────────────────

function parseSize(val: string | undefined): { size: number; unit: string } | null {
  if (!val) return null;
  const trimmed = val.trim();
  if (trimmed === '0') return { size: 0, unit: 'px' };
  const match = trimmed.match(/^(-?[\d.]+)\s*(px|em|rem|%|vw|vh|fr|deg)?$/);
  if (!match) return null;
  return { size: parseFloat(match[1]), unit: match[2] || 'px' };
}

function normalizeColor(val: string | undefined): string | undefined {
  if (!val) return undefined;
  const t = val.trim();
  if (!t || ['transparent', 'inherit', 'initial', 'unset', 'currentcolor'].includes(t.toLowerCase())) return undefined;
  if (t.startsWith('var(')) return undefined;
  return t;
}

function parseLineHeight(val: string | undefined): { size: number; unit: string } | null {
  if (!val) return null;
  const t = val.trim();
  if (t === 'normal') return null;
  if (/^-?[\d.]+$/.test(t)) return { size: parseFloat(t), unit: 'em' };
  return parseSize(t);
}

function extractTypography(styles: ParsedStyles): Record<string, unknown> {
  const typo: Record<string, unknown> = {};
  if (styles.fontFamily) typo.font_family = styles.fontFamily.split(',')[0].replace(/['"]/g, '').trim();
  const fs = parseSize(styles.fontSize);
  if (fs) typo.font_size = { unit: fs.unit, size: fs.size, sizes: [] };
  if (styles.fontWeight) typo.font_weight = String(styles.fontWeight);
  if (styles.fontStyle) typo.font_style = styles.fontStyle;
  if (styles.textTransform) typo.text_transform = styles.textTransform;
  if (styles.textDecoration) typo.text_decoration = styles.textDecoration;
  const lh = parseLineHeight(styles.lineHeight);
  if (lh) typo.line_height = { unit: lh.unit, size: lh.size, sizes: [] };
  const ls = parseSize(styles.letterSpacing);
  if (ls) typo.letter_spacing = { unit: ls.unit, size: ls.size, sizes: [] };
  return typo;
}

function parseSpacingShorthand(val: string): Record<string, unknown> | null {
  const parts = val.trim().split(/\s+/);
  const parsed = parts.map(p => parseSize(p));
  if (parsed.some(p => p === null)) return null;
  const ps = parsed as Array<{ size: number; unit: string }>;

  // Determine the dominant unit (first non-zero, or first overall)
  // If units are mixed (e.g. px + %), use px for the Elementor object —
  // percentage sides will be rounded to their pixel-equivalent value but
  // the raw shorthand is still in custom_css for the browser to use correctly.
  const unit = ps.find(p => p.size !== 0 && p.unit === 'px')?.unit
    || ps.find(p => p.size !== 0)?.unit
    || ps[0]?.unit
    || 'px';

  // Normalize each side: if unit matches keep as-is, otherwise keep size as-is
  // (Elementor treats the number as the value in the chosen unit)
  function side(s: { size: number; unit: string }): string { return String(s.size); }

  if (ps.length === 1) return spacing(side(ps[0]), side(ps[0]), side(ps[0]), side(ps[0]), unit, true);
  if (ps.length === 2) return spacing(side(ps[0]), side(ps[1]), side(ps[0]), side(ps[1]), unit, false);
  if (ps.length === 3) return spacing(side(ps[0]), side(ps[1]), side(ps[2]), side(ps[1]), unit, false);
  if (ps.length === 4) return spacing(side(ps[0]), side(ps[1]), side(ps[2]), side(ps[3]), unit, false);
  return null;
}

function extractSpacing(styles: ParsedStyles, prefix: 'padding' | 'margin'): Record<string, unknown> | null {
  const shorthand = prefix === 'padding' ? styles.padding : styles.margin;
  if (shorthand) return parseSpacingShorthand(shorthand);
  const t = parseSize(prefix === 'padding' ? styles.paddingTop : styles.marginTop);
  const r = parseSize(prefix === 'padding' ? styles.paddingRight : styles.marginRight);
  const b = parseSize(prefix === 'padding' ? styles.paddingBottom : styles.marginBottom);
  const l = parseSize(prefix === 'padding' ? styles.paddingLeft : styles.marginLeft);
  if (t === null && r === null && b === null && l === null) return null;
  const unit = [t, r, b, l].find(v => v && v.size !== 0)?.unit || [t, r, b, l].find(v => v)?.unit || 'px';
  return spacing(String(t?.size ?? 0), String(r?.size ?? 0), String(b?.size ?? 0), String(l?.size ?? 0), unit, false);
}

function extractBorderRadius(styles: ParsedStyles): Record<string, unknown> | null {
  if (!styles.borderRadius) return null;
  const parts = styles.borderRadius.split(/\s+/).map(p => parseSize(p)).filter(Boolean) as Array<{ size: number; unit: string }>;
  if (!parts.length) return null;
  const unit = parts[0].unit;
  if (parts.length === 1) return spacing(String(parts[0].size), String(parts[0].size), String(parts[0].size), String(parts[0].size), unit, true);
  if (parts.length === 4) return spacing(String(parts[0].size), String(parts[1].size), String(parts[2].size), String(parts[3].size), unit, false);
  return spacing(String(parts[0].size), String(parts[0].size), String(parts[0].size), String(parts[0].size), unit, true);
}

function extractBoxShadow(val: string | undefined): Record<string, unknown> | null {
  if (!val || val === 'none') return null;
  const m = val.match(/([-\d.]+)px\s+([-\d.]+)px\s+([\d.]+)px\s*(?:([-\d.]+)px)?\s*(.*)/);
  if (!m) return null;
  return { horizontal: parseFloat(m[1]), vertical: parseFloat(m[2]), blur: parseFloat(m[3]), spread: m[4] ? parseFloat(m[4]) : 0, color: m[5]?.trim() || 'rgba(0,0,0,0.15)', position: 'outset' };
}

function extractTextShadow(val: string | undefined): Record<string, unknown> | null {
  if (!val || val === 'none') return null;
  const m = val.match(/([-\d.]+)px\s+([-\d.]+)px\s*([\d.]+)px\s*(.*)/);
  if (!m) return null;
  return { horizontal: parseFloat(m[1]), vertical: parseFloat(m[2]), blur: parseFloat(m[3]), color: m[4]?.trim() || 'rgba(0,0,0,0.3)' };
}

function extractBackgroundImage(styles: ParsedStyles): { url: string; size?: string; position?: string; repeat?: string } | null {
  if (!styles.backgroundImage || styles.backgroundImage === 'none') return null;
  const urlMatch = styles.backgroundImage.match(/url\(['"]?(.+?)['"]?\)/);
  if (!urlMatch) return null;
  return { url: urlMatch[1], size: styles.backgroundSize, position: styles.backgroundPosition, repeat: styles.backgroundRepeat };
}

function stylesToElementorSettings(styles: ParsedStyles, widgetType: WidgetType): Record<string, unknown> {
  const s: Record<string, unknown> = {};
  const isContainer = widgetType === 'container';
  const isButton = widgetType === 'button';
  const isHeading = widgetType === 'heading';
  const isWidget = !isContainer;

  const color = normalizeColor(styles.color);
  if (color) {
    if (isHeading) s.title_color = color;
    else if (isButton) s.button_text_color = color;
    else s.text_color = color;
  }

  const bgColor = normalizeColor(styles.backgroundColor);
  if (bgColor) {
    s.background_background = 'classic';
    s.background_color = bgColor;
  }

  const bgImg = extractBackgroundImage(styles);
  if (bgImg) {
    s.background_background = 'classic';
    s.background_image = { url: bgImg.url, id: '', size: '' };
    if (bgImg.size) s.background_size = bgImg.size;
    if (bgImg.position) s.background_position = bgImg.position;
    if (bgImg.repeat) s.background_repeat = bgImg.repeat;
  }

  const typo = extractTypography(styles);
  if (Object.keys(typo).length > 0) {
    s.typography_typography = 'custom';
    Object.entries(typo).forEach(([k, v]) => { s[`typography_${k}`] = v; });
  }

  if (styles.textAlign) {
    s.align = styles.textAlign;
  }

  const pad = extractSpacing(styles, 'padding');
  if (pad) {
    if (isButton) s.text_padding = pad;
    else if (isWidget) s._padding = pad;
    else s.padding = pad;
  }

  const mar = extractSpacing(styles, 'margin');
  if (mar) {
    if (isWidget) s._margin = mar;
    else s.margin = mar;
  }

  const radius = extractBorderRadius(styles);
  if (radius) s.border_radius = radius;

  if (styles.borderWidth || styles.borderColor || styles.borderStyle) {
    const bw = parseSize(styles.borderWidth);
    const bStyle = styles.borderStyle || 'solid';
    if (isWidget) {
      s._border_border = bStyle;
      if (bw) s._border_width = spacing(String(bw.size), String(bw.size), String(bw.size), String(bw.size), bw.unit, true);
      const bc = normalizeColor(styles.borderColor);
      if (bc) s._border_color = bc;
    } else {
      s.border_border = bStyle;
      if (bw) s.border_width = spacing(String(bw.size), String(bw.size), String(bw.size), String(bw.size), bw.unit, true);
      const bc = normalizeColor(styles.borderColor);
      if (bc) s.border_color = bc;
    }
  }

  const shadow = extractBoxShadow(styles.boxShadow);
  if (shadow) { s.box_shadow_box_shadow_type = 'yes'; s.box_shadow_box_shadow = shadow; }

  const textShadow = extractTextShadow(styles.textShadow);
  if (textShadow) { s.text_shadow_text_shadow_type = 'yes'; s.text_shadow_text_shadow = textShadow; }

  if (styles.opacity && styles.opacity !== '1') {
    const opVal = parseFloat(styles.opacity);
    if (!isNaN(opVal)) s.opacity = { size: opVal, unit: '' };
  }

  const widthSize = parseSize(styles.width);
  if (widthSize && isContainer) s.width = dim(widthSize.size, widthSize.unit);
  else if (widthSize && !isButton) { s._element_width = 'initial'; s._element_custom_width = dim(widthSize.size, widthSize.unit); }

  const maxWidthSize = parseSize(styles.maxWidth);
  if (maxWidthSize && isContainer) s.max_width = dim(maxWidthSize.size, maxWidthSize.unit);

  const minHeightSize = parseSize(styles.minHeight);
  if (minHeightSize && isContainer) s.min_height = dim(minHeightSize.size, minHeightSize.unit);

  return s;
}

// ─── Detection helpers ───────────────────────────────────────────────────────

function isYoutubeOrVimeo(src: string): boolean {
  return /youtube\.com|youtu\.be|vimeo\.com/.test(src);
}

function isGoogleMaps(src: string): boolean {
  return /maps\.google\.com|google\.com\/maps|maps\.googleapis\.com/.test(src);
}

// Lazy-load src resolution: tries data-src, data-lazy-src etc. before src
const LAZY_ATTRS = ['src', 'data-src', 'data-lazy-src', 'data-lazy', 'data-original', 'data-bg', 'data-image'];
const PLACEHOLDER_RE = [/^data:image\/gif;base64/, /^data:image\/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAE/, /placeholder/i, /blank\.gif/i];

function isPlaceholder(src: string): boolean {
  return !src || PLACEHOLDER_RE.some(r => r.test(src));
}

function resolveImgSrc(el: Element): string {
  for (const attr of LAZY_ATTRS) {
    const val = el.getAttribute(attr) || '';
    if (val && !isPlaceholder(val)) return val;
  }
  return el.getAttribute('src') || '';
}

interface SrcsetEntry { url: string; w: number; density: number }

function parseSrcset(srcset: string): SrcsetEntry[] {
  return srcset.split(',').map(entry => {
    const parts = entry.trim().split(/\s+/);
    const url = parts[0] || '';
    const desc = parts[1] || '';
    const wM = desc.match(/^(\d+)w$/);
    const dM = desc.match(/^([\d.]+)x$/);
    return { url, w: wM ? parseInt(wM[1]) : 0, density: dM ? parseFloat(dM[1]) : 1 };
  }).filter(e => e.url);
}

function pickBestSrcset(srcset: string): string {
  const entries = parseSrcset(srcset);
  if (!entries.length) return '';
  const byW = entries.filter(e => e.w > 0).sort((a, b) => b.w - a.w);
  if (byW.length > 0) return byW[0].url;
  return entries.sort((a, b) => b.density - a.density)[0].url;
}

function resolveBestSrc(el: Element): string {
  // Check srcset on element
  const srcset = el.getAttribute('srcset') || el.getAttribute('data-srcset') || '';
  if (srcset) { const best = pickBestSrcset(srcset); if (best) return best; }

  // <picture>: check source elements
  if (el.tagName.toLowerCase() === 'picture') {
    let bestW = 0; let bestUrl = '';
    el.querySelectorAll('source').forEach(src => {
      const ss = src.getAttribute('srcset') || '';
      parseSrcset(ss).forEach(e => { if (e.w > bestW) { bestW = e.w; bestUrl = e.url; } });
    });
    if (bestUrl) return bestUrl;
    const img = el.querySelector('img');
    if (img) return resolveImgSrc(img);
  }

  return resolveImgSrc(el);
}

// Social network domain → FA icon map
const SOCIAL_DOMAINS: Record<string, string> = {
  'facebook.com': 'fab fa-facebook-f', 'fb.com': 'fab fa-facebook-f',
  'twitter.com': 'fab fa-twitter', 'x.com': 'fab fa-x-twitter',
  'instagram.com': 'fab fa-instagram', 'linkedin.com': 'fab fa-linkedin-in',
  'youtube.com': 'fab fa-youtube', 'pinterest.com': 'fab fa-pinterest-p',
  'tiktok.com': 'fab fa-tiktok', 'snapchat.com': 'fab fa-snapchat-ghost',
  'github.com': 'fab fa-github', 'dribbble.com': 'fab fa-dribbble',
  'behance.net': 'fab fa-behance', 'vimeo.com': 'fab fa-vimeo-v',
  'whatsapp.com': 'fab fa-whatsapp', 'telegram.org': 'fab fa-telegram-plane',
  'discord.com': 'fab fa-discord', 'reddit.com': 'fab fa-reddit-alien',
  'spotify.com': 'fab fa-spotify', 'medium.com': 'fab fa-medium-m',
  'twitch.tv': 'fab fa-twitch',
};

function detectSocialHref(href: string): string | null {
  try {
    const url = new URL(href.startsWith('//') ? 'https:' + href : href.startsWith('/') ? 'https://example.com' + href : href);
    const host = url.hostname.replace(/^www\./, '');
    for (const [domain, icon] of Object.entries(SOCIAL_DOMAINS)) {
      if (host === domain || host.endsWith('.' + domain)) return icon;
    }
  } catch { /* ignore */ }
  return null;
}

interface IconInfo { value: string; library: 'fa-solid' | 'fa-regular' | 'fa-brands' | 'fa-light' | 'eicons' | 'svg' }

// Library specifier tokens that are NOT icon names — skip these when looking for the icon slug
const FA_LIBRARY_TOKENS = new Set(['solid', 'regular', 'light', 'thin', 'duotone', 'brands', 'sharp']);

function extractFaIconName(cls: string): string | null {
  // Find all fa-SLUG tokens, filter out library specifiers (fa-solid, fa-regular, etc.)
  const matches = Array.from(cls.matchAll(/\bfa-([\w-]+)\b/g));
  const iconSlug = matches.map(m => m[1]).find(slug => !FA_LIBRARY_TOKENS.has(slug));
  return iconSlug || null;
}

function extractIconFromEl(el: Element): IconInfo | null {
  const cls = el.getAttribute('class') || '';

  const eiM = cls.match(/\beicon-([\w-]+)\b/);
  if (eiM) return { value: `eicon-${eiM[1]}`, library: 'eicons' };

  // Determine library first, then extract icon name separately
  const iconName = extractFaIconName(cls);
  if (!iconName) return null;

  if (/\bfab\b/.test(cls) || /\bfa-brands\b/.test(cls)) {
    return { value: `fab fa-${iconName}`, library: 'fa-brands' };
  }
  if (/\bfal\b/.test(cls) || /\bfa-light\b/.test(cls)) {
    return { value: `fal fa-${iconName}`, library: 'fa-light' };
  }
  if (/\bfar\b/.test(cls) || /\bfa-regular\b/.test(cls)) {
    return { value: `far fa-${iconName}`, library: 'fa-regular' };
  }
  // Default to solid (fas, fa-solid, or bare fa-ICON)
  return { value: `fas fa-${iconName}`, library: 'fa-solid' };
}

function extractButtonIconAndText(el: Element): { text: string; icon: IconInfo | null; svgHtml: string | null } {
  const clone = el.cloneNode(true) as Element;
  let icon: IconInfo | null = null;
  let svgHtml: string | null = null;

  clone.querySelectorAll('i').forEach(iEl => { if (!icon) icon = extractIconFromEl(iEl); iEl.remove(); });

  const svgEl = clone.querySelector('svg');
  if (svgEl) { svgHtml = svgEl.outerHTML; svgEl.remove(); }

  clone.querySelectorAll('span').forEach(spanEl => {
    if (/\b(fa|fas|far|fab|fal|eicon|glyphicon|icon)\b/.test(spanEl.getAttribute('class') || '')) {
      if (!icon) icon = extractIconFromEl(spanEl);
      spanEl.remove();
    }
  });

  return { text: clone.textContent?.trim() || '', icon, svgHtml };
}

function hasIconClass(el: Element): boolean {
  const cls = el.getAttribute('class') || '';
  // Match Font Awesome v5/v6 (fa-solid, fas, fab, far, fal, fa-ICON, eicons, glyphicons, material-icons)
  return /\b(fa-solid|fa-regular|fa-brands|fa-light|fas|fab|far|fal|fa-\w|eicon-|glyphicon|material-icons?)\b/.test(cls);
}

function isEmptySpacingDiv(el: Element): boolean {
  if (el.children.length > 0 || (el.textContent?.trim() || '').length > 0) return false;
  return /height|min-height|padding-top|padding-bottom/.test(el.getAttribute('style') || '');
}

function isContainerTag(tag: string): boolean {
  return ['div', 'section', 'article', 'main', 'header', 'footer', 'aside', 'figure', 'figcaption'].includes(tag);
}

function hasDirectTextContent(el: Element): boolean {
  for (const node of Array.from(el.childNodes)) {
    if (node.nodeType === 3 && (node.textContent?.trim() || '').length > 0) return true;
  }
  return false;
}

function isSignificantContainer(el: Element, styles: ParsedStyles): boolean {
  if (normalizeColor(styles.backgroundColor)) return true;
  if (extractBackgroundImage(styles)) return true;
  if (styles.borderWidth || styles.borderColor) return true;
  if (styles.padding || styles.paddingTop || styles.paddingBottom) return true;
  if (el.getAttribute('id') || el.getAttribute('data-address') || el.getAttribute('data-lat')) return true;
  return false;
}

function detectLayoutDirection(el: Element, childCount: number, styles: ParsedStyles): { direction: 'row' | 'column'; columns: number } {
  const cls = (el.getAttribute('class') || '').toLowerCase();

  if (styles.display === 'flex' || styles.display === 'inline-flex') {
    return (styles.flexDirection || 'row').startsWith('row')
      ? { direction: 'row', columns: childCount }
      : { direction: 'column', columns: 1 };
  }

  if (styles.display === 'grid' || styles.display === 'inline-grid') {
    const cols = (styles.gridTemplateColumns || '').split(/\s+/).filter(v => v && v !== '/' && v !== 'none').length;
    return { direction: 'row', columns: cols > 0 ? cols : childCount };
  }

  const colMatch = cls.match(/\b(?:grid-cols-|columns-|col-)(\d+)\b/);
  if (colMatch) return { direction: 'row', columns: parseInt(colMatch[1]) };

  if (/\b(row|flex-row|d-flex)\b/.test(cls)) return { direction: 'row', columns: childCount };
  if (/\bgrid\b/.test(cls)) return { direction: 'row', columns: childCount };

  if (childCount >= 2 && childCount <= 6) {
    const children = Array.from(el.children);
    const allDivLike = children.every(c => ['div', 'article', 'section', 'aside'].includes(c.tagName.toLowerCase()));
    if (allDivLike && children.some(c => /\b(col|column|cell|grid-item|card)\b/.test((c.getAttribute('class') || '').toLowerCase()))) {
      return { direction: 'row', columns: childCount };
    }
    if (allDivLike && /\b(features|cards|services|pricing|team|testimonials|benefits|grid|gallery|items|list|columns|row|wrapper)\b/.test(cls)) {
      return { direction: 'row', columns: childCount };
    }
  }

  return { direction: 'column', columns: 1 };
}

function detectRepeaterPattern(children: Element[]): boolean {
  if (children.length < 3) return false;
  function sig(el: Element): string {
    const cls = Array.from(el.classList).filter(c => !/^\d+$/.test(c)).sort().join(' ');
    return `${el.tagName.toLowerCase()}:${cls}`;
  }
  const sigs = children.map(sig);
  const matches = sigs.filter(s => s === sigs[0]).length;
  return matches >= Math.ceil(children.length * 0.6);
}

function detectSocialIcons(el: Element): Array<{ icon: string; url: string }> | null {
  const anchors = Array.from(el.querySelectorAll('a'));
  if (anchors.length < 2) return null;
  const found = anchors.map(a => ({ icon: detectSocialHref(a.getAttribute('href') || ''), url: a.getAttribute('href') || '' })).filter(x => x.icon) as Array<{ icon: string; url: string }>;
  return found.length >= 2 ? found : null;
}

function isCarouselContainer(el: Element): boolean {
  const cls = (el.getAttribute('class') || '').toLowerCase();
  return /\b(swiper|swiper-wrapper|slick-slider|slick-list|owl-carousel|splide|glide|flickity|carousel|slider)\b/.test(cls)
    || !!el.querySelector('.swiper-slide, .slick-slide, .owl-item, .splide__slide, .glide__slide');
}

function collectCarouselImages(el: Element): Array<Record<string, unknown>> {
  return Array.from(el.querySelectorAll('img, [data-src], [data-bg]'))
    .map(img => ({ url: resolveImgSrc(img), id: '', size: '', alt: img.getAttribute('alt') || '', source: 'library' }))
    .filter(i => i.url);
}

// ─── Widget detection ────────────────────────────────────────────────────────

type DetectResult = { widget: WidgetType; badge: string; preview: string; settings: Record<string, unknown> };

function detectWidgetType(el: Element, styles: ParsedStyles): DetectResult {
  const tag = el.tagName.toLowerCase();
  const cls = (el.getAttribute('class') || '').toLowerCase();

  // Headings
  if (/^h[1-6]$/.test(tag)) {
    const ss = stylesToElementorSettings(styles, 'heading');
    return { widget: 'heading', badge: tag.toUpperCase(), preview: `"${(el.textContent?.trim() || '').slice(0, 80)}"`, settings: { title: el.innerHTML, header_size: tag, ...ss } };
  }

  if (tag === 'hr') {
    return { widget: 'divider', badge: 'hr', preview: 'Horizontal rule', settings: { ...stylesToElementorSettings(styles, 'divider') } };
  }

  if (tag === 'form') {
    return { widget: 'form', badge: 'form', preview: 'Form element', settings: { form_html: el.outerHTML } };
  }

  if (tag === 'nav') {
    const links = Array.from(el.querySelectorAll('a')).map(a => ({ text: a.textContent?.trim() || '', url: a.getAttribute('href') || '' }));
    return { widget: 'nav-menu', badge: 'nav', preview: `Navigation — ${links.length} links`, settings: { menu_items: links, ...stylesToElementorSettings(styles, 'nav-menu') } };
  }

  if (tag === 'picture') {
    const url = resolveBestSrc(el);
    const img = el.querySelector('img');
    return { widget: 'image', badge: 'picture', preview: url.split('/').pop() || 'image', settings: { image: { url, id: '', size: '', alt: img?.getAttribute('alt') || '', source: 'library' }, ...stylesToElementorSettings(styles, 'image') } };
  }

  if (tag === 'video') {
    const src = el.getAttribute('src') || el.querySelector('source')?.getAttribute('src') || '';
    return { widget: 'video', badge: 'video', preview: src.split('/').pop() || 'video', settings: { video_type: 'hosted', link: { url: src }, video_poster: { url: el.getAttribute('poster') || '' } } };
  }

  if (tag === 'iframe') {
    const src = el.getAttribute('src') || '';
    if (isYoutubeOrVimeo(src)) return { widget: 'video', badge: 'iframe', preview: src.slice(0, 60), settings: { video_type: /vimeo/.test(src) ? 'vimeo' : 'youtube', link: { url: src } } };
    if (isGoogleMaps(src)) return { widget: 'google_maps', badge: 'iframe', preview: 'Google Maps', settings: { address: src, zoom: dim(14) } };
    return { widget: 'html', badge: 'iframe', preview: `iframe: ${src.slice(0, 50)}`, settings: { html: el.outerHTML } };
  }

  if (tag === 'svg') {
    const label = el.getAttribute('aria-label') || el.querySelector('title')?.textContent || 'SVG icon';
    return { widget: 'html', badge: 'svg', preview: label.slice(0, 60), settings: { html: el.outerHTML } };
  }

  if (tag === 'img') {
    const url = resolveBestSrc(el);
    return { widget: 'image', badge: 'img', preview: url.split('/').pop() || (el as HTMLImageElement).alt || 'image', settings: { image: { url, id: '', size: '', alt: (el as HTMLImageElement).alt || '', source: 'library' }, ...stylesToElementorSettings(styles, 'image') } };
  }

  // Standalone icon (i, span with icon class)
  if (tag !== 'div' && hasIconClass(el)) {
    const text = el.textContent?.trim() || '';
    const iconInfo = extractIconFromEl(el);
    const iconValue = iconInfo?.value || cls.trim();
    const iconLib = iconInfo?.library || 'fa-solid';
    if (text && text.length > 2 && !/^[\ue000-\uf8ff]/.test(text)) {
      return { widget: 'icon-box', badge: tag, preview: `icon + "${text.slice(0, 40)}"`, settings: { title: text, selected_icon: { value: iconValue, library: iconLib } } };
    }
    return { widget: 'icon', badge: tag, preview: iconValue || 'icon', settings: { selected_icon: { value: iconValue, library: iconLib } } };
  }

  // Anchor
  if (tag === 'a') {
    const href = el.getAttribute('href') || '';
    const innerImg = el.querySelector('img');
    const textWithoutImg = (el.textContent?.trim() || '').replace(innerImg?.getAttribute('alt') || '', '').trim();
    if (innerImg && !textWithoutImg) {
      const url = resolveBestSrc(innerImg);
      return { widget: 'image', badge: 'a>img', preview: url.split('/').pop() || 'linked image', settings: { image: { url, id: '', size: '', alt: innerImg.getAttribute('alt') || '', source: 'library' }, link: { url: href }, ...stylesToElementorSettings(styles, 'image') } };
    }
    const { text, icon, svgHtml } = extractButtonIconAndText(el);
    const ss = stylesToElementorSettings(styles, 'button');
    const btnSettings: Record<string, unknown> = { text, button_type: 'default', link: { url: href, is_external: false }, ...ss };
    if (icon) btnSettings.selected_icon = { value: icon.value, library: icon.library };
    else if (svgHtml) btnSettings.icon_svg = svgHtml;
    return { widget: 'button', badge: 'a', preview: `"${text.slice(0, 50)}"${href ? ` → ${href}` : ''}`, settings: btnSettings };
  }

  if (tag === 'button') {
    const { text, icon, svgHtml } = extractButtonIconAndText(el);
    const ss = stylesToElementorSettings(styles, 'button');
    const btnSettings: Record<string, unknown> = { text, button_type: 'default', ...ss };
    if (icon) btnSettings.selected_icon = { value: icon.value, library: icon.library };
    else if (svgHtml) btnSettings.icon_svg = svgHtml;
    return { widget: 'button', badge: 'button', preview: `"${text.slice(0, 50)}"`, settings: btnSettings };
  }

  if (tag === 'p') {
    const ss = stylesToElementorSettings(styles, 'text-editor');
    return { widget: 'text-editor', badge: 'p', preview: `"${(el.textContent?.trim() || '').slice(0, 80)}"`, settings: { editor: `<p>${el.innerHTML}</p>`, ...ss } };
  }

  if (['span', 'label', 'small', 'em', 'strong', 'b'].includes(tag)) {
    const ss = stylesToElementorSettings(styles, 'text-editor');
    return { widget: 'text-editor', badge: tag, preview: `"${(el.textContent?.trim() || '').slice(0, 80)}"`, settings: { editor: el.innerHTML, ...ss } };
  }

  // Blockquote / Testimonial
  if (tag === 'blockquote' || /\b(testimonial|review|client-quote)\b/.test(cls)) {
    const authorEl = el.querySelector('[class*="author"],[class*="name"],cite,footer');
    if (authorEl || tag === 'blockquote') {
      const jobEl = el.querySelector('[class*="role"],[class*="job"],[class*="title"],[class*="position"]');
      const imgEl = el.querySelector('img');
      const ss = stylesToElementorSettings(styles, 'testimonial');
      return {
        widget: 'testimonial',
        badge: tag,
        preview: `"${(el.textContent?.trim() || '').slice(0, 60)}"`,
        settings: {
          testimonial_content: el.innerHTML,
          testimonial_name: authorEl?.textContent?.trim() || '',
          testimonial_job: jobEl?.textContent?.trim() || '',
          ...(imgEl ? { testimonial_image: { url: resolveImgSrc(imgEl), id: '', size: '' } } : {}),
          ...ss,
        },
      };
    }
    const ss = stylesToElementorSettings(styles, 'text-editor');
    return { widget: 'text-editor', badge: 'blockquote', preview: `"${(el.textContent?.trim() || '').slice(0, 60)}"`, settings: { editor: `<blockquote>${el.innerHTML}</blockquote>`, ...ss } };
  }

  // Star rating (can appear as span/div)
  if (/\b(rating|stars?|review-stars?|star-rating)\b/.test(cls) || /[★☆]/.test(el.textContent || '')) {
    const stars = (el.textContent?.match(/★/g) || []).length || 5;
    const rating = parseFloat(el.getAttribute('data-rating') || el.getAttribute('data-score') || String(stars));
    const ss = stylesToElementorSettings(styles, 'star-rating');
    return { widget: 'star-rating', badge: tag, preview: `Rating: ${rating}/5`, settings: { rating_scale: '5', rating: { size: rating, unit: '' }, ...ss } };
  }

  // Alert / Notice
  if (/\b(alert|notice|callout|notification|message)\b/.test(cls)) {
    const titleEl = el.querySelector('[class*="title"],[class*="heading"],strong,h1,h2,h3,h4,h5,h6');
    let alertType = 'info';
    if (/\b(success|green)\b/.test(cls)) alertType = 'success';
    else if (/\b(warning|warn|yellow)\b/.test(cls)) alertType = 'warning';
    else if (/\b(danger|error|red)\b/.test(cls)) alertType = 'danger';
    const ss = stylesToElementorSettings(styles, 'alert');
    return { widget: 'alert', badge: tag, preview: (titleEl?.textContent?.trim() || el.textContent?.trim() || '').slice(0, 60), settings: { alert_type: alertType, alert_title: titleEl?.textContent?.trim() || '', alert_description: el.textContent?.trim() || '', ...ss } };
  }

  // Progress bar
  if (/\b(progress|progress-bar|skill-bar|progressbar)\b/.test(cls) || el.getAttribute('role') === 'progressbar') {
    const inner = el.querySelector('[class*="bar"],[class*="fill"],[class*="progress"]');
    const pctMatch = (inner?.getAttribute('style') || '').match(/width\s*:\s*([\d.]+)%/) || el.getAttribute('data-percent')?.match(/([\d.]+)/);
    const percent = pctMatch ? parseFloat(pctMatch[1]) : 0;
    const title = el.getAttribute('data-label') || el.querySelector('[class*="title"],[class*="label"]')?.textContent?.trim() || '';
    const ss = stylesToElementorSettings(styles, 'progress-bar');
    return { widget: 'progress-bar', badge: tag, preview: title ? `${title}: ${percent}%` : `${percent}%`, settings: { title, percent: { size: percent, unit: '%' }, ...ss } };
  }

  // Details/summary → Accordion item
  if (tag === 'details') {
    const summaryEl = el.querySelector('summary');
    const title = summaryEl?.textContent?.trim() || 'Item';
    const content = summaryEl ? el.innerHTML.replace(summaryEl.outerHTML, '').trim() : el.innerHTML;
    return { widget: 'accordion', badge: 'details', preview: title.slice(0, 60), settings: { tabs: [{ tab_title: title, tab_content: content }] } };
  }

  // Accordion container
  if (/\b(accordion)\b/.test(cls)) {
    const triggers = el.querySelectorAll('[class*="title"],[class*="header"],[class*="trigger"],summary,button[data-toggle]');
    const panels = el.querySelectorAll('[class*="content"],[class*="body"],[class*="panel"]');
    const count = Math.min(triggers.length, panels.length);
    if (count > 0) {
      const items = Array.from({ length: count }, (_, i) => ({ tab_title: triggers[i].textContent?.trim() || `Item ${i + 1}`, tab_content: panels[i].innerHTML }));
      return { widget: 'accordion', badge: tag, preview: `${count} accordion items`, settings: { tabs: items } };
    }
  }

  // Toggle
  if (/\b(toggle)\b/.test(cls)) {
    const triggers = el.querySelectorAll('[class*="title"],[class*="trigger"],button');
    const panels = el.querySelectorAll('[class*="content"],[class*="body"]');
    const count = Math.min(triggers.length, panels.length);
    if (count > 0) {
      const items = Array.from({ length: count }, (_, i) => ({ tab_title: triggers[i].textContent?.trim() || `Item ${i + 1}`, tab_content: panels[i].innerHTML }));
      return { widget: 'toggle', badge: tag, preview: `${count} toggle items`, settings: { tabs: items } };
    }
  }

  // Tabs
  if (/\b(tabs?|tab-container|tabbed)\b/.test(cls)) {
    const titles = el.querySelectorAll('[class*="tab-title"],[class*="tab-label"],[class*="nav-tab"],[role="tab"]');
    const panels = el.querySelectorAll('[class*="tab-content"],[class*="tab-panel"],[class*="tab-pane"],[role="tabpanel"]');
    const count = Math.min(titles.length, panels.length);
    if (count > 0) {
      const items = Array.from({ length: count }, (_, i) => ({ tab_title: titles[i].textContent?.trim() || `Tab ${i + 1}`, tab_content: panels[i].innerHTML }));
      return { widget: 'tabs', badge: tag, preview: `${count} tabs`, settings: { tabs: items } };
    }
  }

  // Lists
  if (tag === 'ul' || tag === 'ol') {
    const items = Array.from(el.querySelectorAll('li'));

    // Carousel: li each with only an image
    if (items.length > 1 && items.every(li => {
      const img = li.querySelector('img');
      return img && !(li.textContent?.trim() || '').replace(img.getAttribute('alt') || '', '').trim();
    })) {
      const images = items.map(li => { const img = li.querySelector('img')!; return { url: resolveBestSrc(img), id: '', size: '', alt: img.getAttribute('alt') || '', source: 'library' }; });
      return { widget: 'image-carousel', badge: tag, preview: `${items.length} images`, settings: { carousel: images } };
    }

    // Nav menu
    if (items.some(li => li.querySelector('a'))) {
      const links = items.map(li => { const a = li.querySelector('a'); return { text: a?.textContent?.trim() || li.textContent?.trim() || '', url: a?.getAttribute('href') || '' }; });
      return { widget: 'nav-menu', badge: tag, preview: `${items.length} nav items`, settings: { menu_items: links } };
    }

    const ss = stylesToElementorSettings(styles, 'text-editor');
    return { widget: 'text-editor', badge: tag, preview: `List — ${items.length} items`, settings: { editor: el.outerHTML, ...ss } };
  }

  if (tag === 'table') {
    return { widget: 'html', badge: 'table', preview: 'Table element', settings: { html: el.outerHTML } };
  }

  // Container tags
  if (isContainerTag(tag)) {
    const childEls = Array.from(el.children).filter(c => !['script', 'style', 'meta', 'link', 'br'].includes(c.tagName.toLowerCase()));
    const textContent = el.textContent?.trim() || '';

    // Collapse empty/whitespace containers
    if (childEls.length === 0 && textContent.length === 0 && !isSignificantContainer(el, styles)) {
      return { widget: 'spacer', badge: tag, preview: 'Empty container', settings: { space: dim(20) } };
    }

    // Google Maps: data-address attribute or contains maps iframe
    const dataAddress = el.getAttribute('data-address') || el.getAttribute('data-location') || '';
    const innerIframe = el.querySelector('iframe');
    if (dataAddress) {
      return { widget: 'google_maps', badge: tag, preview: dataAddress.slice(0, 60), settings: { address: dataAddress, zoom: dim(14) } };
    }
    if (innerIframe && isGoogleMaps(innerIframe.getAttribute('src') || '')) {
      return { widget: 'google_maps', badge: tag, preview: 'Google Maps', settings: { address: innerIframe.getAttribute('src') || '', zoom: dim(14) } };
    }
    if (/\b(map|google-map|gmap|map-container)\b/.test(cls) && innerIframe) {
      return { widget: 'google_maps', badge: tag, preview: 'Google Maps', settings: { address: innerIframe.getAttribute('src') || '', zoom: dim(14) } };
    }

    // Social icons group
    const socialLinks = detectSocialIcons(el);
    if (socialLinks) {
      const iconList = socialLinks.map(l => ({ social_icon: { value: l.icon, library: 'fa-brands' }, link: { url: l.url, is_external: true } }));
      return { widget: 'social-icons', badge: tag, preview: `${socialLinks.length} social icons`, settings: { social_icon_list: iconList } };
    }

    // Slider/carousel container
    if (isCarouselContainer(el)) {
      const images = collectCarouselImages(el);
      if (images.length >= 2) return { widget: 'image-carousel', badge: tag, preview: `${images.length} slides`, settings: { carousel: images, navigation: 'both' } };
    }

    // Spacer div
    if (isEmptySpacingDiv(el)) {
      const h = parseSize(styles.height || styles.minHeight || '');
      return { widget: 'spacer', badge: tag, preview: 'Spacing element', settings: { space: dim(h?.size || 30) } };
    }

    // Image-box
    if (childEls.length <= 4) {
      const directImgs = el.querySelectorAll(':scope > img, :scope > picture > img');
      if (directImgs.length === 1 && textContent.length > 0) {
        const imgSrc = resolveBestSrc(directImgs[0]);
        const titleEl = el.querySelector('h1,h2,h3,h4,h5,h6');
        const descEl = el.querySelector('p');
        const ss = stylesToElementorSettings(styles, 'image-box');
        return { widget: 'image-box', badge: tag, preview: `${imgSrc.split('/').pop()} + "${textContent.slice(0, 30)}"`, settings: { image: { url: imgSrc, id: '', size: '', alt: '', source: 'library' }, title_text: titleEl?.textContent?.trim() || textContent.slice(0, 60), description_text: descEl?.textContent?.trim() || '', ...ss } };
      }
    }

    // Price table
    if (/\b(pricing|price-card|plan|price-table|pricing-table|package)\b/.test(cls)) {
      const titleEl = el.querySelector('h1,h2,h3,h4,h5,h6,[class*="title"],[class*="plan-name"]');
      const priceEl = el.querySelector('[class*="price"],[class*="amount"],[class*="cost"]');
      const featureItems = Array.from(el.querySelectorAll('ul li, ol li')).map(li => ({ item_text: li.textContent?.trim() || '' }));
      const ctaBtn = el.querySelector('a,button');
      const ss = stylesToElementorSettings(styles, 'price-table');
      return { widget: 'price-table', badge: tag, preview: titleEl?.textContent?.trim() || priceEl?.textContent?.trim() || 'Pricing plan', settings: { heading: titleEl?.textContent?.trim() || '', price: priceEl?.textContent?.trim() || '', features_list: featureItems, button_text: ctaBtn?.textContent?.trim() || 'Get Started', button_url: ctaBtn?.getAttribute('href') || '', ...ss } };
    }

    // Call to action: bg-image + heading + button
    const bgImg2 = extractBackgroundImage(styles);
    const innerHeading = el.querySelector('h1,h2,h3,h4,h5,h6');
    const innerBtn = el.querySelector('a[class*="btn"],a[class*="button"],button');
    if (bgImg2 && innerHeading && innerBtn) {
      const ss = stylesToElementorSettings(styles, 'call-to-action');
      return { widget: 'call-to-action', badge: tag, preview: innerHeading.textContent?.trim().slice(0, 60) || 'Call to Action', settings: { title: innerHeading.textContent?.trim() || '', button: innerBtn.textContent?.trim() || 'Learn More', button_url: innerBtn.getAttribute('href') || '', bg_image: { url: bgImg2.url, id: '', size: '' }, ...ss } };
    }

    // Testimonial container
    if (/\b(testimonial|review|quote)\b/.test(cls)) {
      const authorEl = el.querySelector('[class*="author"],[class*="name"],cite');
      const jobEl = el.querySelector('[class*="role"],[class*="job"],[class*="position"]');
      const imgEl = el.querySelector('img');
      const pEl = el.querySelector('p');
      const ss = stylesToElementorSettings(styles, 'testimonial');
      return { widget: 'testimonial', badge: tag, preview: `"${(pEl?.textContent || el.textContent || '').trim().slice(0, 60)}"`, settings: { testimonial_content: pEl?.innerHTML || el.innerHTML, testimonial_name: authorEl?.textContent?.trim() || '', testimonial_job: jobEl?.textContent?.trim() || '', ...(imgEl ? { testimonial_image: { url: resolveImgSrc(imgEl), id: '', size: '' } } : {}), ...ss } };
    }

    // Counter
    if (/\b(counter|count|stat|metric)\b/.test(cls)) {
      const numEl = el.querySelector('[class*="number"],[class*="count"],[class*="stat"]') || el;
      const numText = numEl.textContent?.trim() || '';
      if (/^\s*[\d,]+\s*[k+%KM]?\s*/.test(numText)) {
        const ending = parseInt(numText.replace(/[^0-9]/g, '')) || 0;
        const suffix = numText.replace(/[\d,\s]/g, '').trim();
        const titleEl = el.querySelector('[class*="title"],[class*="label"],[class*="text"]');
        const ss = stylesToElementorSettings(styles, 'counter');
        return { widget: 'counter', badge: tag, preview: numText, settings: { starting_number: 0, ending_number: ending, suffix, title: titleEl?.textContent?.trim() || '', ...ss } };
      }
    }

    // data-bg background image on container
    const dataBg = el.getAttribute('data-bg') || el.getAttribute('data-background') || '';

    // Container fallback
    const { direction, columns } = detectLayoutDirection(el, childEls.length, styles);
    const isRepeater = detectRepeaterPattern(childEls);
    const badge = isRepeater ? 'repeater' : (direction === 'row' ? `${columns}-col` : 'stack');
    const preview = isRepeater ? `Repeating ${columns}-col grid` : tag === 'header' ? 'Header section' : tag === 'footer' ? 'Footer section' : tag === 'section' ? 'Section' : direction === 'row' ? `${columns}-column layout` : 'Container';
    const ss = stylesToElementorSettings(styles, 'container');

    if (dataBg && !ss.background_image) {
      ss.background_background = 'classic';
      ss.background_image = { url: dataBg, id: '', size: '' };
    }

    return { widget: 'container', badge, preview, settings: { ...ss, ...(isRepeater ? { is_repeater: true } : {}) } };
  }

  return { widget: 'html', badge: tag, preview: el.outerHTML?.slice(0, 80) || tag, settings: { html: el.outerHTML } };
}

// ─── Parse tree ──────────────────────────────────────────────────────────────

const SKIP_TAGS = new Set(['script', 'style', 'meta', 'link', 'head', 'title', 'noscript', 'template']);

interface ParseContext {
  computedStyles: Map<Element, ParsedStyles>;
  customCssPerElement: Map<Element, string>;
  rawDeclsPerElement: Map<Element, Map<string, string>>;
}

function parseElement(el: Element, depth: number, ctx: ParseContext): ElementNode | null {
  const tag = el.tagName.toLowerCase();
  if (SKIP_TAGS.has(tag)) return null;

  const styles = ctx.computedStyles.get(el) || {};
  const { widget, badge, preview, settings } = detectWidgetType(el, styles);

  // Merge custom_css from matched stylesheet rules + unmapped inline props
  const cssFromSheets = ctx.customCssPerElement.get(el) || '';
  const unmappedCss = buildUnmappedCss(ctx.rawDeclsPerElement.get(el));
  const combinedCss = [cssFromSheets, unmappedCss].filter(Boolean).join('\n\n');
  if (combinedCss) settings.custom_css = combinedCss;

  const childEls = Array.from(el.children).filter(c => !SKIP_TAGS.has(c.tagName.toLowerCase()));
  const { direction, columns } = widget === 'container'
    ? detectLayoutDirection(el, childEls.length, styles)
    : { direction: 'column' as const, columns: 1 };

  const node: ElementNode = {
    id: nextId(),
    widgetType: widget,
    badge,
    preview,
    children: [],
    depth,
    htmlElement: tag,
    settings,
    layoutDirection: direction,
    columnCount: columns,
  };

  if (widget === 'container') {
    if (hasDirectTextContent(el)) {
      const textParts: string[] = [];
      for (const n of Array.from(el.childNodes)) {
        if (n.nodeType === 3) { const t = n.textContent?.trim(); if (t) textParts.push(t); }
      }
      if (textParts.length > 0) {
        node.children.push({ id: nextId(), widgetType: 'text-editor', badge: 'text', preview: `"${textParts.join(' ').slice(0, 60)}"`, children: [], depth: depth + 1, htmlElement: '#text', settings: { editor: `<p>${textParts.join(' ')}</p>` }, layoutDirection: 'column', columnCount: 1 });
      }
    }
    for (const child of childEls) {
      const childNode = parseElement(child, depth + 1, ctx);
      if (childNode) node.children.push(childNode);
    }
  }

  return node;
}

export function parseHTML(html: string): ElementNode[] {
  idCounter = 0;
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const { computedStyles, customCssPerElement, rawDeclsPerElement } = buildStyleMap(doc);
  const ctx: ParseContext = { computedStyles, customCssPerElement, rawDeclsPerElement };
  return Array.from(doc.body.children).map(child => parseElement(child, 0, ctx)).filter(Boolean) as ElementNode[];
}

// ─── Elementor JSON output ───────────────────────────────────────────────────

function buildWidget(node: ElementNode, isInner: boolean): Record<string, unknown> {
  const hasSettings = Object.keys(node.settings).length > 0;
  return { id: elementorId(), elType: 'widget', widgetType: node.widgetType, isInner, settings: hasSettings ? node.settings : [], elements: [] };
}

function buildContainer(node: ElementNode, isInner: boolean): Record<string, unknown> {
  const isRow = node.layoutDirection === 'row';
  const containerSettings: Record<string, unknown> = {
    ...(isRow ? { flex_direction: 'row' } : {}),
    ...(isRow && node.columnCount > 1 ? { flex_gap: flexGap(20) } : {}),
    content_width: 'full',
    ...node.settings,
  };
  const elements = node.children.map(child => child.widgetType === 'container' ? buildContainer(child, true) : buildWidget(child, true));
  return { id: elementorId(), elType: 'container', isInner, settings: Object.keys(containerSettings).length > 0 ? containerSettings : [], elements };
}

function buildElement(node: ElementNode, isInner: boolean): Record<string, unknown> {
  return node.widgetType === 'container' ? buildContainer(node, isInner) : buildWidget(node, isInner);
}

export function buildElementorJSON(nodes: ElementNode[], filename: string): string {
  return JSON.stringify({ version: '0.4', title: filename.replace(/\.html?$/i, ''), type: 'page', page_settings: [], content: nodes.map(n => buildElement(n, false)) }, null, 2);
}

export function countElements(nodes: ElementNode[]): number {
  let count = 0;
  function walk(ns: ElementNode[]) { for (const n of ns) { count++; walk(n.children); } }
  walk(nodes);
  return count;
}
