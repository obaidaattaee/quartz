export type Locale = 'en' | 'ar';
export type Direction = 'ltr' | 'rtl';

export type LocaleProps = {
    locale: Locale;
    direction: Direction;
    translations: Record<string, string>;
};
