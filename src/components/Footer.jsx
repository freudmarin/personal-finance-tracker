import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-10 border-t border-gray-200 dark:border-gray-800 pt-6 text-sm text-gray-500 dark:text-gray-400">
      <div className="flex items-center justify-center">
        <p className="text-center">
          &copy; {year} {t('app.name')}. {t('footer.rights')}
        </p>
      </div>
    </footer>
  );
}
