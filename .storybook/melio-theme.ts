import { create } from 'storybook/theming/create';

export default create({
  base: 'light',

  // Brand
  brandTitle: 'Melio Brand Design Guidelines',
  brandUrl: '/',
  brandImage: '/melio-logo-purple.png',
  brandTarget: '_self',

  // Colors — sampled from the Melio product UI
  colorPrimary: '#7849FF',   // Melio Purple (exact, from logo)
  colorSecondary: '#7849FF', // Used for selection / active states

  // Surfaces — clean white, matching the product
  appBg: '#FFFFFF',
  appContentBg: '#FFFFFF',
  appPreviewBg: '#FFFFFF',
  appBorderColor: '#ECECF1',
  appBorderRadius: 10,

  // Text — near-black headings, gray secondary (like the product nav)
  textColor: '#1A1A1A',
  textInverseColor: '#FFFFFF',
  textMutedColor: '#6B7280',

  // Toolbar / sidebar
  barTextColor: '#6B7280',
  barHoverColor: '#7849FF',
  barSelectedColor: '#7849FF',
  barBg: '#FFFFFF',

  // Inputs
  inputBg: '#FFFFFF',
  inputBorder: '#E5E5EA',
  inputTextColor: '#1A1A1A',
  inputBorderRadius: 8,

  // Fonts — Poppins is a PLACEHOLDER approximation of the Melio product font.
  // Swap for the real Melio typeface when the Typography section is ported.
  fontBase: '"Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  fontCode: '"Fira Code", ui-monospace, monospace',
});
