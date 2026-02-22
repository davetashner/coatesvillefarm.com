import { render, screen } from '@testing-library/react';
import Picture from '../components/Picture';

describe('Picture component', () => {
  test('renders img with correct src and alt', () => {
    render(<Picture src="/assets/img/hero.png" alt="Hero image" />);
    const img = screen.getByRole('img', { name: 'Hero image' });
    expect(img).toHaveAttribute('src', '/assets/img/hero.png');
  });

  test('includes webp source element', () => {
    const { container } = render(
      <Picture src="/assets/img/hero.png" alt="Hero" />
    );
    const source = container.querySelector('source[type="image/webp"]');
    expect(source).not.toBeNull();
    expect(source?.getAttribute('srcSet')).toBe('/assets/img/hero.webp');
  });

  test('wraps img in picture element', () => {
    const { container } = render(
      <Picture src="/assets/img/hero.png" alt="Hero" />
    );
    const picture = container.querySelector('picture');
    expect(picture).not.toBeNull();
    expect(picture?.querySelector('img')).not.toBeNull();
  });

  test('passes through additional HTML attributes', () => {
    render(
      <Picture
        src="/assets/img/hero.png"
        alt="Hero"
        className="hero-image"
        loading="lazy"
      />
    );
    const img = screen.getByRole('img', { name: 'Hero' });
    expect(img).toHaveClass('hero-image');
    expect(img).toHaveAttribute('loading', 'lazy');
  });

  test('handles non-png src gracefully', () => {
    const { container } = render(
      <Picture src="/assets/img/photo.jpg" alt="Photo" />
    );
    // Should still render but webp source won't match .png replacement
    const source = container.querySelector('source[type="image/webp"]');
    expect(source?.getAttribute('srcSet')).toBe('/assets/img/photo.jpg');
  });
});
