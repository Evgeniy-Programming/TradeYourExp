export const categoriesView = [
  'Все категории',
  'Языки и коммуникация',
  'Технологии и IT',
  'Творчество и дизайн',
  'Наука, бизнес и саморазвитие',
  'Хобби, здоровье и образ жизни',
] as const;

export const categories = [
  'Языки и коммуникация',
  'Технологии и IT',
  'Творчество и дизайн',
  'Наука, бизнес и саморазвитие',
  'Хобби, здоровье и образ жизни',
] as const;

// Коды категорий на бэкенде (backend/pkg/repo/categoryList.go)
export const categoryCodes: Record<(typeof categories)[number], string> = {
  'Языки и коммуникация': 'communicate',
  'Технологии и IT': 'it',
  'Творчество и дизайн': 'art',
  'Наука, бизнес и саморазвитие': 'knowledge',
  'Хобби, здоровье и образ жизни': 'hobby',
};
