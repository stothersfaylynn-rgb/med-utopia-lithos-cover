import test from 'node:test';
import assert from 'node:assert/strict';

import {
  generateCss,
  validateTokenDocument,
} from './validate-design-tokens.mjs';

function token(value, type = 'color') {
  return { $value: value, $type: type };
}

function validFixture() {
  const primitive = {
    color: { ink: { 900: token('#17211F') } },
    fontFamily: { sans: token('system-ui', 'fontFamily') },
    fontSize: { base: token('1rem', 'dimension') },
    lineHeight: { normal: token('1.5', 'number') },
    spacing: { 4: token('1rem', 'dimension') },
    radius: { sm: token('0.25rem', 'dimension') },
    borderWidth: { default: token('1px', 'dimension') },
    shadow: { none: token('none', 'shadow') },
    duration: { fast: token('150ms', 'duration') },
    easing: { standard: token('cubic-bezier(0.2, 0, 0, 1)', 'cubicBezier') },
  };

  const semantic = {
    color: { foreground: token('{primitive.color.ink.900}') },
    typography: { body: token('{primitive.fontSize.base}', 'dimension') },
    spacing: {
      component: token('{primitive.spacing.4}', 'dimension'),
      pageXCompact: token('{primitive.spacing.4}', 'dimension'),
    },
    radius: { control: token('{primitive.radius.sm}', 'dimension') },
    border: { default: token('{primitive.borderWidth.default}', 'dimension') },
    shadow: { surface: token('{primitive.shadow.none}', 'shadow') },
    motion: {
      duration: token('{primitive.duration.fast}', 'duration'),
      easing: token('{primitive.easing.standard}', 'cubicBezier'),
    },
  };

  const componentNames = [
    'navigation',
    'button',
    'caseCard',
    'riskTag',
    'expertPanel',
    'decisionTimeline',
    'filter',
    'form',
  ];
  const component = Object.fromEntries(
    componentNames.map((name) => [
      name,
      { foreground: token('{semantic.color.foreground}') },
    ]),
  );

  return {
    primitive,
    semantic,
    component,
    dark: { semantic: { color: { foreground: token('{primitive.color.ink.900}') } } },
    reduced: {
      semantic: {
        motion: {
          duration: token('{primitive.duration.fast}', 'duration'),
        },
      },
    },
  };
}

test('accepts a complete three-layer token document and preserves references in CSS', () => {
  const tokens = validFixture();
  assert.deepEqual(validateTokenDocument(tokens), []);

  const css = generateCss(tokens);
  assert.match(css, /--button-foreground: var\(--color-foreground\);/);
  assert.match(css, /--case-card-foreground: var\(--color-foreground\);/);
  assert.match(css, /--spacing-page-x-compact: var\(--primitive-spacing-4\);/);
  assert.match(css, /\[data-theme="dark"\]/);
  assert.match(css, /prefers-reduced-motion: reduce/);
});

test('rejects a missing token reference', () => {
  const tokens = validFixture();
  tokens.semantic.color.foreground.$value = '{primitive.color.ink.404}';

  assert.match(validateTokenDocument(tokens).join('\n'), /Missing reference/);
});

test('rejects raw values in the component layer', () => {
  const tokens = validFixture();
  tokens.component.button.foreground.$value = '#FFFFFF';

  assert.match(validateTokenDocument(tokens).join('\n'), /Component tokens must reference/);
});
