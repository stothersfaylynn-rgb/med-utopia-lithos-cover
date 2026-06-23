import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REQUIRED_PRIMITIVES = [
  'color',
  'fontFamily',
  'fontSize',
  'lineHeight',
  'spacing',
  'radius',
  'borderWidth',
  'shadow',
  'duration',
  'easing',
];

const REQUIRED_COMPONENTS = [
  'navigation',
  'button',
  'caseCard',
  'riskTag',
  'expertPanel',
  'decisionTimeline',
  'filter',
  'form',
];

function isToken(value) {
  return Boolean(value && typeof value === 'object' && '$value' in value);
}

function collectTokens(node, prefix = [], result = new Map()) {
  if (!node || typeof node !== 'object') return result;

  for (const [key, value] of Object.entries(node)) {
    const tokenPath = [...prefix, key];
    if (isToken(value)) {
      result.set(tokenPath.join('.'), value);
    } else {
      collectTokens(value, tokenPath, result);
    }
  }

  return result;
}

function referencePath(value) {
  if (typeof value !== 'string') return null;
  const match = value.match(/^\{([^}]+)\}$/);
  return match?.[1] ?? null;
}

function cssName(tokenPath) {
  const parts = tokenPath
    .split('.')
    .map((part) =>
      part
        .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .replaceAll('_', '-')
        .toLowerCase(),
    );
  if (parts[0] === 'primitive') {
    return `--primitive-${parts.slice(1).join('-')}`;
  }
  if (parts[0] === 'semantic') {
    return `--${parts.slice(1).join('-')}`;
  }
  if (parts[0] === 'component') {
    return `--${parts.slice(1).join('-')}`;
  }
  throw new Error(`Unsupported token path: ${tokenPath}`);
}

function cssValue(value) {
  const reference = referencePath(value);
  return reference ? `var(${cssName(reference)})` : value;
}

function renderBlock(selector, tokens, pathPrefix) {
  const entries = [...collectTokens(tokens, pathPrefix).entries()];
  return `${selector} {\n${entries
    .map(([tokenPath, token]) => `  ${cssName(tokenPath)}: ${cssValue(token.$value)};`)
    .join('\n')}\n}`;
}

export function validateTokenDocument(tokens) {
  const errors = [];

  for (const layer of ['primitive', 'semantic', 'component', 'dark', 'reduced']) {
    if (!tokens?.[layer]) errors.push(`Missing root layer: ${layer}`);
  }

  for (const group of REQUIRED_PRIMITIVES) {
    if (!tokens?.primitive?.[group]) errors.push(`Missing primitive group: ${group}`);
  }

  for (const component of REQUIRED_COMPONENTS) {
    if (!tokens?.component?.[component]) errors.push(`Missing component group: ${component}`);
  }

  if (!tokens?.dark?.semantic) errors.push('Dark theme must override semantic tokens');
  if (!tokens?.reduced?.semantic?.motion) {
    errors.push('Reduced motion must override semantic motion tokens');
  }

  const allTokens = new Map([
    ...collectTokens(tokens?.primitive, ['primitive']),
    ...collectTokens(tokens?.semantic, ['semantic']),
    ...collectTokens(tokens?.component, ['component']),
  ]);

  for (const [tokenPath, token] of allTokens) {
    const reference = referencePath(token.$value);
    if (tokenPath.startsWith('component.') && !reference) {
      errors.push(`Component tokens must reference another token: ${tokenPath}`);
    }
    if (reference && !allTokens.has(reference)) {
      errors.push(`Missing reference ${reference} used by ${tokenPath}`);
    }
  }

  for (const [themeName, theme] of [
    ['dark', tokens?.dark],
    ['reduced', tokens?.reduced],
  ]) {
    for (const [tokenPath, token] of collectTokens(theme?.semantic, ['semantic'])) {
      const reference = referencePath(token.$value);
      if (!reference) {
        errors.push(`${themeName} semantic tokens must reference primitives: ${tokenPath}`);
      } else if (!allTokens.has(reference)) {
        errors.push(`Missing reference ${reference} used by ${themeName}.${tokenPath}`);
      }
    }
  }

  return errors;
}

export function generateCss(tokens) {
  const sections = [
    '/* Med-Utopia Design Tokens — generated from assets/design-tokens.json */',
    '/* Primitive values are the only raw values. Semantic and component layers use references. */',
    '',
    '/* === PRIMITIVE === */',
    renderBlock(':root', tokens.primitive, ['primitive']),
    '',
    '/* === SEMANTIC: LIGHT DEFAULT === */',
    renderBlock(':root', tokens.semantic, ['semantic']),
    '',
    '/* === COMPONENT === */',
    renderBlock(':root', tokens.component, ['component']),
    '',
    '/* === SEMANTIC: DARK === */',
    renderBlock('[data-theme="dark"], .dark', tokens.dark.semantic, ['semantic']),
    '',
    '/* === REDUCED MOTION === */',
    '@media (prefers-reduced-motion: reduce) {',
    renderBlock('  :root', tokens.reduced.semantic, ['semantic'])
      .split('\n')
      .map((line, index) => (index === 0 ? line : `  ${line}`))
      .join('\n'),
    '}',
    '',
  ];

  return sections.join('\n');
}

function main() {
  const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const jsonPath = path.join(projectRoot, 'assets/design-tokens.json');
  const cssPath = path.join(projectRoot, 'assets/design-tokens.css');
  const write = process.argv.includes('--write');

  const tokens = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const errors = validateTokenDocument(tokens);
  if (errors.length) {
    console.error(errors.join('\n'));
    process.exit(1);
  }

  const generatedCss = generateCss(tokens);
  if (write) {
    fs.writeFileSync(cssPath, generatedCss);
  } else if (!fs.existsSync(cssPath) || fs.readFileSync(cssPath, 'utf8') !== generatedCss) {
    console.error('assets/design-tokens.css is not synchronized with design-tokens.json');
    process.exit(1);
  }

  console.log('Design tokens valid: references resolved, component values tokenized, CSS synchronized.');
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main();
}
