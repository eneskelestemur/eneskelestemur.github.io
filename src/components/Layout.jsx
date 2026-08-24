import React from 'react';
import { Outlet } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';

/**
 * Shared chrome for every route. The theme toggle lives here and only here,
 * so pages never render their own copy.
 */
export function Layout() {
  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <ThemeToggle />
      <Outlet />
    </div>
  );
}
