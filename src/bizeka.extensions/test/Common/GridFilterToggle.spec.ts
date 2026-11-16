import { describe, it, expect } from 'vitest';
import { addGridFilterToggle } from '../../Modules/Common/GridFilterToggle';

describe('addGridFilterToggle', () => {
    // A plain button looked and sized differently from the grid's other toolbar buttons.
    it('adds a Serenity tool button to the toolbar group that shows the filter bar', () => {
        const grid = document.createElement('div');
        grid.innerHTML = '<div class="grid-toolbar"><div class="tool-group"></div></div><div class="quick-filters-bar"></div>';

        const toggle = addGridFilterToggle(grid)!;

        expect(toggle.parentElement?.className).toBe('tool-group');
        expect(toggle.classList.contains('tool-button')).toBe(true);
        expect(toggle.querySelector('.button-inner > i.fa-filter')).not.toBeNull();
        expect(grid.classList.contains('bzk-filters-collapsed')).toBe(true);

        toggle.click();
        expect(grid.classList.contains('bzk-filters-collapsed')).toBe(false);
        expect(toggle.getAttribute('aria-expanded')).toBe('true');
    });
});
