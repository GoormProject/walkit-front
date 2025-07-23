import type { Preview } from '@storybook/react-vite'
import '../src/index.css' // Tailwind CSS import
import '../src/styles/tokens.css' // 디자인 토큰 CSS import

const preview: Preview = {
  parameters: {
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
