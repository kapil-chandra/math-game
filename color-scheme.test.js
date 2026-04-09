#!/usr/bin/env node

const assert = require('assert');

// Test utilities
let testsRun = 0;
let testsPassed = 0;
let testsFailed = 0;

function test(description, fn) {
  testsRun++;
  try {
    fn();
    testsPassed++;
    console.log(`✓ ${description}`);
  } catch (error) {
    testsFailed++;
    console.error(`✗ ${description}`);
    console.error(`  ${error.message}`);
  }
}

// Export the module functions for testing
const { hslToHex, wrapHue, generateScheme, colorNameToHue } = require('./color-scheme.js');

// ============================================================================
// Test Suite: HSL to Hex Conversions
// ============================================================================

console.log('\n=== HSL to Hex Conversions ===');

test('converts pure red HSL(0°, 100%, 50%) to hex', () => {
  const result = hslToHex(0, 100, 50);
  assert.strictEqual(result, '#ff0000', `Expected #ff0000 but got ${result}`);
});

test('converts pure green HSL(120°, 100%, 50%) to hex', () => {
  const result = hslToHex(120, 100, 50);
  assert.strictEqual(result, '#00ff00', `Expected #00ff00 but got ${result}`);
});

test('converts pure blue HSL(240°, 100%, 50%) to hex', () => {
  const result = hslToHex(240, 100, 50);
  assert.strictEqual(result, '#0000ff', `Expected #0000ff but got ${result}`);
});

test('converts white HSL(0°, 0%, 100%) to hex', () => {
  const result = hslToHex(0, 0, 100);
  assert.strictEqual(result, '#ffffff', `Expected #ffffff but got ${result}`);
});

test('converts black HSL(0°, 0%, 0%) to hex', () => {
  const result = hslToHex(0, 0, 0);
  assert.strictEqual(result, '#000000', `Expected #000000 but got ${result}`);
});

test('converts gray HSL(0°, 0%, 50%) to hex', () => {
  const result = hslToHex(0, 0, 50);
  assert.strictEqual(result, '#7f7f7f', `Expected #7f7f7f but got ${result}`);
});

test('converts orange HSL(30°, 100%, 50%) to hex', () => {
  const result = hslToHex(30, 100, 50);
  assert.strictEqual(result, '#ff7f00', `Expected #ff7f00 but got ${result}`);
});

test('converts cyan HSL(180°, 100%, 50%) to hex', () => {
  const result = hslToHex(180, 100, 50);
  assert.strictEqual(result, '#00ffff', `Expected #00ffff but got ${result}`);
});

test('converts magenta HSL(300°, 100%, 50%) to hex', () => {
  const result = hslToHex(300, 100, 50);
  assert.strictEqual(result, '#ff00ff', `Expected #ff00ff but got ${result}`);
});

test('handles hex formatting with proper zero-padding', () => {
  const result = hslToHex(0, 100, 20);
  assert.match(result, /^#[0-9a-f]{6}$/i, `Hex format should be #RRGGBB but got ${result}`);
  assert.strictEqual(result.length, 7, `Hex color should be 7 chars (# + 6 digits) but got ${result.length}`);
});

// ============================================================================
// Test Suite: Hue Wrapping
// ============================================================================

console.log('\n=== Hue Wrapping ===');

test('wraps hue 0° correctly', () => {
  const result = wrapHue(0);
  assert.strictEqual(result, 0, `Expected 0 but got ${result}`);
});

test('wraps hue 180° correctly', () => {
  const result = wrapHue(180);
  assert.strictEqual(result, 180, `Expected 180 but got ${result}`);
});

test('wraps hue 359° correctly', () => {
  const result = wrapHue(359);
  assert.strictEqual(result, 359, `Expected 359 but got ${result}`);
});

test('wraps hue 360° to 0°', () => {
  const result = wrapHue(360);
  assert.strictEqual(result, 0, `Expected 0 but got ${result}`);
});

test('wraps negative hue -30° correctly', () => {
  const result = wrapHue(-30);
  assert(result >= 0 && result < 360, `Hue should be in [0, 360) but got ${result}`);
});

test('wraps large hue 450° correctly', () => {
  const result = wrapHue(450);
  assert(result >= 0 && result < 360, `Hue should be in [0, 360) but got ${result}`);
});

test('wraps large negative hue -450° correctly', () => {
  const result = wrapHue(-450);
  assert(result >= 0 && result < 360, `Hue should be in [0, 360) but got ${result}`);
});

// ============================================================================
// Test Suite: Color Scheme Generation
// ============================================================================

console.log('\n=== Color Scheme Generation ===');

test('generates scheme with 3 colors', () => {
  const scheme = generateScheme(0);
  assert.strictEqual(scheme.length, 3, `Expected 3 colors in scheme but got ${scheme.length}`);
});

test('generates scheme with correct property names', () => {
  const scheme = generateScheme(0);
  const color = scheme[0];
  assert(color.name !== undefined, 'Color should have a name property');
  assert(color.hue !== undefined, 'Color should have a hue property');
  assert(color.hex !== undefined, 'Color should have a hex property');
});

test('generates valid hex colors in scheme', () => {
  const scheme = generateScheme(0);
  scheme.forEach((color, index) => {
    assert.match(color.hex, /^#[0-9a-f]{6}$/i,
      `Color ${index} hex should be valid #RRGGBB format but got ${color.hex}`);
  });
});

test('generates hues in valid range [0, 360)', () => {
  const scheme = generateScheme(90);
  scheme.forEach((color, index) => {
    assert(color.hue >= 0 && color.hue < 360,
      `Color ${index} hue should be in [0, 360) but got ${color.hue}`);
  });
});

test('complementary color is 180° from base', () => {
  const scheme = generateScheme(0);
  const complementary = scheme[0]; // First color is complementary
  assert.strictEqual(complementary.hue, 180,
    `Complementary of 0° should be 180° but got ${complementary.hue}°`);
});

test('complementary wraps correctly for hues > 180°', () => {
  const scheme = generateScheme(200);
  const complementary = scheme[0];
  // 200 + 180 = 380, should wrap to 20
  assert.strictEqual(complementary.hue, 20,
    `Complementary of 200° should be 20° but got ${complementary.hue}°`);
});

test('analogous colors are ±30° from base', () => {
  const scheme = generateScheme(100);
  const analogous1 = scheme[1]; // +30°
  const analogous2 = scheme[2]; // -30°
  assert.strictEqual(analogous1.hue, 130,
    `Analogous (+30°) of 100° should be 130° but got ${analogous1.hue}°`);
  assert.strictEqual(analogous2.hue, 70,
    `Analogous (-30°) of 100° should be 70° but got ${analogous2.hue}°`);
});

// ============================================================================
// Test Suite: Color Names
// ============================================================================

console.log('\n=== Color Names ===');

test('has standard color names defined', () => {
  const standardColors = ['red', 'green', 'blue', 'yellow', 'cyan', 'magenta'];
  standardColors.forEach(color => {
    assert(colorNameToHue[color] !== undefined,
      `Color name "${color}" should be defined in colorNameToHue`);
  });
});

test('color hues are in valid range [0, 360)', () => {
  Object.entries(colorNameToHue).forEach(([name, hue]) => {
    assert(hue >= 0 && hue < 360,
      `Color "${name}" has invalid hue ${hue}° (should be in [0, 360))`);
  });
});

test('has at least 12 named colors', () => {
  const colorCount = Object.keys(colorNameToHue).length;
  assert(colorCount >= 12,
    `Expected at least 12 named colors but found ${colorCount}`);
});

// ============================================================================
// Test Suite: Edge Cases
// ============================================================================

console.log('\n=== Edge Cases ===');

test('handles hue 0° with full saturation and lightness', () => {
  const result = hslToHex(0, 100, 50);
  assert.strictEqual(result, '#ff0000');
});

test('handles achromatic colors (saturation = 0)', () => {
  const result = hslToHex(45, 0, 50); // Hue should be ignored when S=0
  assert.strictEqual(result, '#7f7f7f'); // Should produce gray
});

test('handles lightness at boundaries: lightness = 0', () => {
  const result = hslToHex(45, 100, 0);
  assert.strictEqual(result, '#000000');
});

test('handles lightness at boundaries: lightness = 100', () => {
  const result = hslToHex(45, 100, 100);
  assert.strictEqual(result, '#ffffff');
});

test('handles very low saturation (1%)', () => {
  const result = hslToHex(0, 1, 50);
  assert.match(result, /^#[0-9a-f]{6}$/i, `Should produce valid hex color`);
});

test('handles very low lightness (1%)', () => {
  const result = hslToHex(0, 100, 1);
  assert.match(result, /^#[0-9a-f]{6}$/i, `Should produce valid hex color`);
});

test('handles colors near hue boundaries', () => {
  // Test hues at 60°, 120°, 180°, 240°, 300°, 360°
  [60, 120, 180, 240, 300, 360].forEach(hue => {
    const result = hslToHex(hue, 100, 50);
    assert.match(result, /^#[0-9a-f]{6}$/i, `Hue ${hue}° should produce valid hex`);
  });
});

// ============================================================================
// Test Results Summary
// ============================================================================

console.log('\n' + '='.repeat(50));
console.log(`Test Results: ${testsPassed}/${testsRun} passed`);
if (testsFailed > 0) {
  console.log(`⚠️  ${testsFailed} test(s) failed`);
  process.exit(1);
} else {
  console.log('✅ All tests passed!');
  process.exit(0);
}
