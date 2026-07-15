import type { Preview } from '@storybook/react-vite'
import melioTheme from './melio-theme';

const preview: Preview = {
  parameters: {
    options: {
      storySort: {
        order: [
          'Overview',
          'Identity',
          [
            'Logo',
            'Color',
            'Typography',
            'Visual Assets',
            ['Overview', 'Illustrations', 'Icons', 'Motion', 'Simplified UI', 'Imagery', 'Agent Mel'],
          ],
          'Visuals',
          ['Overview'],
          'Writing',
          ['Brand Narrative', 'Voice & Tone'],
          'Standards',
          ['Spacing & Layout', 'Accessibility', 'Data Visualization'],
          'Marketing',
        ],
      },
    },
    docs: {
      theme: melioTheme,
    },
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    }
  },
};

export default preview;