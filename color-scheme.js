#!/usr/bin/env node

const readline = require('readline');

// Basic color name to approximate HSL hue mapping
const colorNameToHue = {
  red: 0,
  orange: 30,
  yellow: 60,
  chartreuse: 90,
  green: 120,
  springgreen: 150,
  cyan: 180,
  azure: 210,
  blue: 240,
  violet: 270,
  magenta: 300,
  rose: 330,
  pink: 350,
  purple: 280,
  teal: 170,
  lime: 75,
  coral: 16,
  salmon: 6,
  gold: 51,
  indigo: 265,
  turquoise: 174,
  brown: 25,
  crimson: 348,
  navy: 240,
  olive: 60,
  maroon: 0,
};

function hslToHex(h, s, l) {
  s /= 100;
  l /= 100;

  const k = n => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));

  const r = Math.floor(255 * f(0));
  const g = Math.floor(255 * f(8));
  const b = Math.floor(255 * f(4));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

function wrapHue(hue) {
  return ((hue % 360) + 360) % 360;
}

function generateScheme(baseHue) {
  const saturation = 70;
  const lightness = 50;

  const complementary = wrapHue(baseHue + 180);
  const analogous1 = wrapHue(baseHue + 30);
  const analogous2 = wrapHue(baseHue - 30);

  return [
    { name: 'Complementary', hue: complementary, hex: hslToHex(complementary, saturation, lightness) },
    { name: 'Analogous (+30°)', hue: analogous1, hex: hslToHex(analogous1, saturation, lightness) },
    { name: 'Analogous (-30°)', hue: analogous2, hex: hslToHex(analogous2, saturation, lightness) },
  ];
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('Enter a color name: ', (input) => {
  const colorName = input.trim().toLowerCase();
  const baseHue = colorNameToHue[colorName];

  if (baseHue === undefined) {
    console.log(`Unknown color: "${colorName}"`);
    console.log('Supported colors:', Object.keys(colorNameToHue).join(', '));
    rl.close();
    return;
  }

  console.log(`\nBase color: ${colorName} (hue: ${baseHue}°)`);
  console.log('Suggested color scheme:\n');

  const scheme = generateScheme(baseHue);
  scheme.forEach(color => {
    console.log(`  ${color.name}: hue=${color.hue}°  hex=${color.hex}`);
  });

  rl.close();
});

// Export functions for testing
module.exports = {
  hslToHex,
  wrapHue,
  generateScheme,
  colorNameToHue,
};
