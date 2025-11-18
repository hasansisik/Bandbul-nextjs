export const categorySlugMap: Record<string, string> = {
      'grup-ariyorum': 'Grup Arıyorum',
      'muzisyen-ariyorum': 'Müzisyen Arıyorum',
      'ders-almak-istiyorum': 'Ders Almak İstiyorum',
      'profesyonel-ders-veriyorum': 'Profesyonel Ders Veriyorum',
      'enstruman-satiyorum': 'Enstrüman Satıyorum',
      'studyo-kiraliyorum': 'Stüdyo Kiralıyorum'
    };

export const searchCategoryMap: Record<string, {categories: string[]}> = {
  'Grup': { categories: ['Müzisyen Arıyorum'] },
  'Müzisyen': {categories: ['Grup Arıyorum']},
  'Ders ': { categories: ['Profesyonel Ders Veriyorum', 'Ders Almak İstiyorum'] }
};