import { createBrowserRouter } from 'react-router';
import { AppLayout } from './components/layout/AppLayout';
import { DashboardPage } from './pages/DashboardPage';
import { ColorsPage } from './pages/ColorsPage';
import { TypographyPage } from './pages/TypographyPage';
import { SpacingPage } from './pages/SpacingPage';
import { IconsPage } from './pages/IconsPage';
import { ComponentsPage } from './pages/ComponentsPage';
import { MotionPage } from './pages/MotionPage';
import { InteractionsPage } from './pages/InteractionsPage';
import { AccessibilityPage } from './pages/AccessibilityPage';
import { TokensPage } from './pages/TokensPage';
import { ScreensPage } from './pages/ScreensPage';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: AppLayout,
    children: [
      { index: true, Component: DashboardPage },
      { path: 'colors', Component: ColorsPage },
      { path: 'typography', Component: TypographyPage },
      { path: 'spacing', Component: SpacingPage },
      { path: 'icons', Component: IconsPage },
      { path: 'components', Component: ComponentsPage },
      { path: 'motion', Component: MotionPage },
      { path: 'interactions', Component: InteractionsPage },
      { path: 'accessibility', Component: AccessibilityPage },
      { path: 'tokens', Component: TokensPage },
      { path: 'screens', Component: ScreensPage },
    ],
  },
]);
