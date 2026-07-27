import { describe, expect, it } from 'vitest';
import { useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import { screen, renderWithProviders } from './render';

function Probe() {
  const t = useTranslations('smoke');
  const { data, isSuccess } = useQuery({
    queryKey: ['smoke'],
    queryFn: async () => 'query-ready',
  });

  return (
    <div>
      <p>{t('greeting')}</p>
      <p>{isSuccess ? data : 'loading'}</p>
    </div>
  );
}

describe('renderWithProviders', () => {
  it('exercises both the i18n and query providers', async () => {
    renderWithProviders(<Probe />, {
      messages: { smoke: { greeting: 'Hello from next-intl' } },
    });

    expect(screen.getByText('Hello from next-intl')).toBeInTheDocument();
    expect(await screen.findByText('query-ready')).toBeInTheDocument();
  });
});
