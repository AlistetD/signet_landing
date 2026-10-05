/** Official cities with SigNet stores. Oblast centres first, then the rest A–Я. */
export const cities = [
  'Минск',
  'Брест',
  'Витебск',
  'Гомель',
  'Гродно',
  'Могилёв',
  'Барановичи',
  'Бобруйск',
  'Борисов',
  'Жлобин',
  'Жодино',
  'Калинковичи',
  'Лида',
  'Мозырь',
  'Молодечно',
  'Новополоцк',
  'Орша',
  'Пинск',
  'Полоцк',
  'Речица',
  'Светлогорск',
  'Слоним',
  'Слуцк',
  'Солигорск',
] as const

export type City = (typeof cities)[number]
