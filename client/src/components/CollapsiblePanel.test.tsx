import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CollapsiblePanel } from './CollapsiblePanel.js';

describe('CollapsiblePanel', () => {
  it('is collapsed by default and does not render its children', () => {
    render(<CollapsiblePanel title="Graph">content</CollapsiblePanel>);
    expect(screen.queryByText('content')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Graph/ })).toHaveAttribute('aria-expanded', 'false');
  });

  it('respects defaultOpen', () => {
    render(
      <CollapsiblePanel title="Graph" defaultOpen>
        content
      </CollapsiblePanel>
    );
    expect(screen.getByText('content')).toBeInTheDocument();
  });

  it('toggles open and closed on click', async () => {
    const user = userEvent.setup();
    render(<CollapsiblePanel title="Graph">content</CollapsiblePanel>);

    const toggle = screen.getByRole('button', { name: /Graph/ });
    await user.click(toggle);
    expect(screen.getByText('content')).toBeInTheDocument();
    expect(toggle).toHaveAttribute('aria-expanded', 'true');

    await user.click(toggle);
    expect(screen.queryByText('content')).not.toBeInTheDocument();
  });

  it('only renders the actions row when actions are provided and the panel is open', () => {
    const { rerender } = render(
      <CollapsiblePanel title="Graph" defaultOpen>
        content
      </CollapsiblePanel>
    );
    expect(screen.queryByText('Aktualisieren')).not.toBeInTheDocument();

    rerender(
      <CollapsiblePanel title="Graph" defaultOpen actions={<button>Aktualisieren</button>}>
        content
      </CollapsiblePanel>
    );
    expect(screen.getByText('Aktualisieren')).toBeInTheDocument();
  });
});
