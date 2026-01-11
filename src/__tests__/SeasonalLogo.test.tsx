import { render, screen } from '@testing-library/react';
import SeasonalLogo from '../components/SeasonalLogo';

describe('SeasonalLogo component', () => {
  test('renders autumn daytime logo', () => {
    render(<SeasonalLogo season="autumn" night={false} />);
    const img = screen.getByRole('img', { name: /coatesville farm logo/i });
    expect(img).toHaveAttribute('src', '/assets/img/logo-autumn.png');
  });

  test('renders summer daytime logo', () => {
    render(<SeasonalLogo season="summer" night={false} />);
    const img = screen.getByRole('img', { name: /coatesville farm logo/i });
    expect(img).toHaveAttribute('src', '/assets/img/logo-summer.png');
  });

  test('renders winter daytime logo', () => {
    render(<SeasonalLogo season="winter" night={false} />);
    const img = screen.getByRole('img', { name: /coatesville farm logo/i });
    expect(img).toHaveAttribute('src', '/assets/img/logo-winter.png');
  });

  test('renders spring night logo', () => {
    render(<SeasonalLogo season="spring" night={true} />);
    const img = screen.getByRole('img', { name: /coatesville farm logo/i });
    expect(img).toHaveAttribute('src', '/assets/img/logo-spring-night.png');
  });
});
