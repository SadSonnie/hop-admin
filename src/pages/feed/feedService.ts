import type { FeedItem, Place, Collection } from '../types';

const feedItems: FeedItem[] = [
  {
    id: 1,
    type: 'place',
    order: 0,
    data: {
      id: 1,
      name: "Fire",
      mainTag: "Ресторан",
      description: "Шеф-повара готовят все на огне прямо перед вами",
      rating: 4.8,
      distance: "2 км от вас",
      imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=60",
      isPremium: true,
      tags: ["Стейки", "Вино"],
      address: "ул. Пушкина, 15",
      priceLevel: 3,
      phone: "+7 (999) 123-45-67",
      images: [
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1544148103-0773bf10d330?w=800&auto=format&fit=crop&q=60"
      ],
      reviews: [
        {
          id: 1,
          authorName: "Марина Молдована",
          authorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&auto=format&fit=crop&q=60",
          date: "3 дня назад",
          rating: 5,
          title: "Место вау",
          text: "Место вау, была здесь с парнем 3 дня назад, праздновали нашу годовщину знакомства.",
          photos: [
            "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=60",
            "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&auto=format&fit=crop&q=60",
            "https://images.unsplash.com/photo-1544148103-0773bf10d330?w=800&auto=format&fit=crop&q=60"
          ]
        },
        {
          id: 2,
          authorName: "Михаил",
          authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=60",
          date: "неделю назад",
          rating: 4,
          title: "Отличное место",
          text: "Хорошее место, но цены немного высоковаты.",
          photos: [
            "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=60",
            "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&auto=format&fit=crop&q=60",
            "https://images.unsplash.com/photo-1544148103-0773bf10d330?w=800&auto=format&fit=crop&q=60"
          ]
        },
        {
          id: 3,
          authorName: "Анна",
          authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&auto=format&fit=crop&q=60",
          date: "2 недели назад",
          rating: 5,
          title: "Превосходно!",
          text: "Потрясающая атмосфера и обслуживание. Обязательно вернусь сюда снова."
        },
        {
          id: 4,
          authorName: "Дмитрий",
          authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=60",
          date: "месяц назад",
          rating: 3,
          title: "Неплохо, но есть куда расти",
          text: "Еда вкусная, но обслуживание могло бы быть лучше. Долго ждали официанта."
        },
        {
          id: 5,
          authorName: "Екатерина",
          authorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&auto=format&fit=crop&q=60",
          date: "месяц назад",
          rating: 5,
          title: "Идеальное место для свидания",
          text: "Романтическая атмосфера, внимательный персонал. Все было идеально!",
          photos: [
            "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=60"
          ]
        },
        {
          id: 6,
          authorName: "Алексей",
          authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=60",
          date: "2 месяца назад",
          rating: 4,
          title: "Хорошее место",
          text: "Вкусная кухня, приятная атмосфера. Немного шумно по выходным."
        }
      ]
    }
  },
  {
    id: 2,
    type: 'place',
    order: 1,
    data: {
      id: 2,
      name: "Sunrise",
      mainTag: "Кафе",
      description: "Уютное место для завтрака",
      rating: 4.5,
      distance: "1.5 км от вас",
      imageUrl: "https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=800&auto=format&fit=crop&q=60",
      isPremium: false,
      tags: ["Завтраки", "Кофе"],
      address: "ул. Лермонтова, 10",
      priceLevel: 2,
      images: [
        "https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=800&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1463797221720-6b07e6426c24?w=800&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop&q=60"
      ],
      reviews: [
        {
          id: 1,
          authorName: "Марина Молдована",
          authorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&auto=format&fit=crop&q=60",
          date: "3 дня назад",
          rating: 5,
          title: "Место вау",
          text: "Место вау, была здесь с парнем 3 дня назад, праздновали нашу годовщину знакомства.",
          photos: [
            "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=60",
            "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&auto=format&fit=crop&q=60",
            "https://images.unsplash.com/photo-1544148103-0773bf10d330?w=800&auto=format&fit=crop&q=60"
          ]
        },
        {
          id: 2,
          authorName: "Михаил",
          authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=60",
          date: "неделю назад",
          rating: 4,
          title: "Отличное место",
          text: "Хорошее место, но цены немного высоковаты.",
          photos: [
            "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=60",
            "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&auto=format&fit=crop&q=60",
            "https://images.unsplash.com/photo-1544148103-0773bf10d330?w=800&auto=format&fit=crop&q=60"
          ]
        },
        {
          id: 3,
          authorName: "Анна",
          authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&auto=format&fit=crop&q=60",
          date: "2 недели назад",
          rating: 5,
          title: "Превосходно!",
          text: "Потрясающая атмосфера и обслуживание. Обязательно вернусь сюда снова."
        },
        {
          id: 4,
          authorName: "Дмитрий",
          authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=60",
          date: "месяц назад",
          rating: 3,
          title: "Неплохо, но есть куда расти",
          text: "Еда вкусная, но обслуживание могло бы быть лучше. Долго ждали официанта."
        },
        {
          id: 5,
          authorName: "Екатерина",
          authorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&auto=format&fit=crop&q=60",
          date: "месяц назад",
          rating: 5,
          title: "Идеальное место для свидания",
          text: "Романтическая атмосфера, внимательный персонал. Все было идеально!",
          photos: [
            "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=60"
          ]
        },
        {
          id: 6,
          authorName: "Алексей",
          authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=60",
          date: "2 месяца назад",
          rating: 4,
          title: "Хорошее место",
          text: "Вкусная кухня, приятная атмосфера. Немного шумно по выходным."
        }
      ]
    }
  },
  {
    id: 3,
    type: 'place',
    order: 2,
    data: {
      id: 3,
      name: "High",
      mainTag: "Бар",
      description: "Панорамный бар на крыше",
      rating: 4.9,
      distance: "3 км от вас",
      imageUrl: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&auto=format&fit=crop&q=60",
      isPremium: true,
      tags: ["Коктейли", "Вид на город"],
      address: "пр. Ленина, 25",
      priceLevel: 3,
      phone: "+7 (999) 765-43-21",
      images: [
        "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=800&auto=format&fit=crop&q=60"
      ],
      reviews: [
        {
          id: 1,
          authorName: "Марина Молдована",
          authorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&auto=format&fit=crop&q=60",
          date: "3 дня назад",
          rating: 5,
          title: "Место вау",
          text: "Место вау, была здесь с парнем 3 дня назад, праздновали нашу годовщину знакомства.",
          photos: [
            "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=60",
            "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&auto=format&fit=crop&q=60",
            "https://images.unsplash.com/photo-1544148103-0773bf10d330?w=800&auto=format&fit=crop&q=60"
          ]
        },
        {
          id: 2,
          authorName: "Михаил",
          authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=60",
          date: "неделю назад",
          rating: 4,
          title: "Отличное место",
          text: "Хорошее место, но цены немного высоковаты.",
          photos: [
            "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=60",
            "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&auto=format&fit=crop&q=60",
            "https://images.unsplash.com/photo-1544148103-0773bf10d330?w=800&auto=format&fit=crop&q=60"
          ]
        },
        {
          id: 3,
          authorName: "Анна",
          authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&auto=format&fit=crop&q=60",
          date: "2 недели назад",
          rating: 5,
          title: "Превосходно!",
          text: "Потрясающая атмосфера и обслуживание. Обязательно вернусь сюда снова."
        },
        {
          id: 4,
          authorName: "Дмитрий",
          authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=60",
          date: "месяц назад",
          rating: 3,
          title: "Неплохо, но есть куда расти",
          text: "Еда вкусная, но обслуживание могло бы быть лучше. Долго ждали официанта."
        },
        {
          id: 5,
          authorName: "Екатерина",
          authorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&auto=format&fit=crop&q=60",
          date: "месяц назад",
          rating: 5,
          title: "Идеальное место для свидания",
          text: "Романтическая атмосфера, внимательный персонал. Все было идеально!",
          photos: [
            "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=60"
          ]
        },
        {
          id: 6,
          authorName: "Алексей",
          authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=60",
          date: "2 месяца назад",
          rating: 4,
          title: "Хорошее место",
          text: "Вкусная кухня, приятная атмосфера. Немного шумно по выходным."
        }
      ]
    }
  },
  {
    id: 4,
    type: 'collection',
    order: 3,
    data: {
      id: 1,
      title: 'Любимые места этого месяца',
      description: 'Популярные места с высоким рейтингом в декабре',
      imageUrl: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&auto=format&fit=crop&q=60',
      places: [
        {
          id: 4,
          name: 'Высота',
          mainTag: 'Ресторан',
          description: 'Панорамный ресторан на 25 этаже',
          rating: 4.9,
          distance: '3.5 км от вас',
          imageUrl: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=800&auto=format&fit=crop&q=60',
          images: [
            'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=800&auto=format&fit=crop&q=60',
            'https://images.unsplash.com/photo-1484659619207-9165d119dafe?w=800&auto=format&fit=crop&q=60',
            'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?w=800&auto=format&fit=crop&q=60'
          ],
          isPremium: true,
          priceLevel: 3,
          tags: ['Панорамный вид', 'Высокая кухня'],
          address: 'пр. Ленина, 50',
          phone: '+7 (999) 111-22-33',
          reviews: [
            {
              id: 1,
              authorName: "Марина Молдована",
              authorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&auto=format&fit=crop&q=60",
              date: "3 дня назад",
              rating: 5,
              title: "Место вау",
              text: "Место вау, была здесь с парнем 3 дня назад, праздновали нашу годовщину знакомства.",
              photos: [
                "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=60",
                "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&auto=format&fit=crop&q=60",
                "https://images.unsplash.com/photo-1544148103-0773bf10d330?w=800&auto=format&fit=crop&q=60"
              ]
            },
            {
              id: 2,
              authorName: "Михаил",
              authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=60",
              date: "неделю назад",
              rating: 4,
              title: "Отличное место",
              text: "Хорошее место, но цены немного высоковаты.",
              photos: [
                "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=60",
                "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&auto=format&fit=crop&q=60",
                "https://images.unsplash.com/photo-1544148103-0773bf10d330?w=800&auto=format&fit=crop&q=60"
              ]
            },
            {
              id: 3,
              authorName: "Анна",
              authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&auto=format&fit=crop&q=60",
              date: "2 недели назад",
              rating: 5,
              title: "Превосходно!",
              text: "Потрясающая атмосфера и обслуживание. Обязательно вернусь сюда снова."
            },
            {
              id: 4,
              authorName: "Дмитрий",
              authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=60",
              date: "месяц назад",
              rating: 3,
              title: "Неплохо, но есть куда расти",
              text: "Еда вкусная, но обслуживание могло бы быть лучше. Долго ждали официанта."
            },
            {
              id: 5,
              authorName: "Екатерина",
              authorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&auto=format&fit=crop&q=60",
              date: "месяц назад",
              rating: 5,
              title: "Идеальное место для свидания",
              text: "Романтическая атмосфера, внимательный персонал. Все было идеально!",
              photos: [
                "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=60"
              ]
            },
            {
              id: 6,
              authorName: "Алексей",
              authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=60",
              date: "2 месяца назад",
              rating: 4,
              title: "Хорошее место",
              text: "Вкусная кухня, приятная атмосфера. Немного шумно по выходным."
            }
          ]
        },
        {
          id: 5,
          name: 'Утро',
          mainTag: 'Кафе',
          description: 'Лучшие завтраки в городе',
          rating: 4.7,
          distance: '1.2 км от вас',
          imageUrl: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=800&auto=format&fit=crop&q=60',
          images: [
            'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=800&auto=format&fit=crop&q=60',
            'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop&q=60',
            'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop&q=60'
          ],
          isPremium: false,
          priceLevel: 2,
          tags: ['Завтраки', 'Кофе'],
          address: 'ул. Солнечная, 12',
          reviews: [
            {
              id: 1,
              authorName: "Марина Молдована",
              authorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&auto=format&fit=crop&q=60",
              date: "3 дня назад",
              rating: 5,
              title: "Место вау",
              text: "Место вау, была здесь с парнем 3 дня назад, праздновали нашу годовщину знакомства.",
              photos: [
                "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=60",
                "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&auto=format&fit=crop&q=60",
                "https://images.unsplash.com/photo-1544148103-0773bf10d330?w=800&auto=format&fit=crop&q=60"
              ]
            },
            {
              id: 2,
              authorName: "Михаил",
              authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=60",
              date: "неделю назад",
              rating: 4,
              title: "Отличное место",
              text: "Хорошее место, но цены немного высоковаты.",
              photos: [
                "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=60",
                "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&auto=format&fit=crop&q=60",
                "https://images.unsplash.com/photo-1544148103-0773bf10d330?w=800&auto=format&fit=crop&q=60"
              ]
            },
            {
              id: 3,
              authorName: "Анна",
              authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&auto=format&fit=crop&q=60",
              date: "2 недели назад",
              rating: 5,
              title: "Превосходно!",
              text: "Потрясающая атмосфера и обслуживание. Обязательно вернусь сюда снова."
            },
            {
              id: 4,
              authorName: "Дмитрий",
              authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=60",
              date: "месяц назад",
              rating: 3,
              title: "Неплохо, но есть куда расти",
              text: "Еда вкусная, но обслуживание могло бы быть лучше. Долго ждали официанта."
            },
            {
              id: 5,
              authorName: "Екатерина",
              authorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&auto=format&fit=crop&q=60",
              date: "месяц назад",
              rating: 5,
              title: "Идеальное место для свидания",
              text: "Романтическая атмосфера, внимательный персонал. Все было идеально!",
              photos: [
                "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=60"
              ]
            },
            {
              id: 6,
              authorName: "Алексей",
              authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=60",
              date: "2 месяца назад",
              rating: 4,
              title: "Хорошее место",
              text: "Вкусная кухня, приятная атмосфера. Немного шумно по выходным."
            }
          ]
        }
      ]
    }
  },
  {
    id: 5,
    type: 'place',
    order: 4,
    data: {
      id: 6,
      name: 'Модерн',
      mainTag: 'Галерея',
      description: 'Современные художественные выставки в историческом здании',
      rating: 4.6,
      distance: '3.5 км',
      imageUrl: 'https://images.unsplash.com/photo-1577720580479-7d839d829c73?auto=format&fit=crop&q=80&w=800',
      images: [
        'https://images.unsplash.com/photo-1577720580479-7d839d829c73?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1561633835-597754ba1b67?auto=format&fit=crop&q=80&w=800',
      ],
      isPremium: true,
      tags: ['Искусство', 'Культура'],
      priceLevel: 2,
      address: 'ул. Галерейная, 456',
      phone: '+7 (999) 555-44-33',
      reviews: [
        {
          id: 1,
          authorName: "Марина Молдована",
          authorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&auto=format&fit=crop&q=60",
          date: "3 дня назад",
          rating: 5,
          title: "Место вау",
          text: "Место вау, была здесь с парнем 3 дня назад, праздновали нашу годовщину знакомства.",
          photos: [
            "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=60",
            "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&auto=format&fit=crop&q=60",
            "https://images.unsplash.com/photo-1544148103-0773bf10d330?w=800&auto=format&fit=crop&q=60"
          ]
        },
        {
          id: 2,
          authorName: "Михаил",
          authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=60",
          date: "неделю назад",
          rating: 4,
          title: "Отличное место",
          text: "Хорошее место, но цены немного высоковаты.",
          photos: [
            "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=60",
            "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&auto=format&fit=crop&q=60",
            "https://images.unsplash.com/photo-1544148103-0773bf10d330?w=800&auto=format&fit=crop&q=60"
          ]
        },
        {
          id: 3,
          authorName: "Анна",
          authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&auto=format&fit=crop&q=60",
          date: "2 недели назад",
          rating: 5,
          title: "Превосходно!",
          text: "Потрясающая атмосфера и обслуживание. Обязательно вернусь сюда снова."
        },
        {
          id: 4,
          authorName: "Дмитрий",
          authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=60",
          date: "месяц назад",
          rating: 3,
          title: "Неплохо, но есть куда расти",
          text: "Еда вкусная, но обслуживание могло бы быть лучше. Долго ждали официанта."
        },
        {
          id: 5,
          authorName: "Екатерина",
          authorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&auto=format&fit=crop&q=60",
          date: "месяц назад",
          rating: 5,
          title: "Идеальное место для свидания",
          text: "Романтическая атмосфера, внимательный персонал. Все было идеально!",
          photos: [
            "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=60"
          ]
        },
        {
          id: 6,
          authorName: "Алексей",
          authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=60",
          date: "2 месяца назад",
          rating: 4,
          title: "Хорошее место",
          text: "Вкусная кухня, приятная атмосфера. Немного шумно по выходным."
        }
      ]
    }
  }
];

export const fetchFeedItems = async (): Promise<FeedItem[]> => {
  return feedItems;
};

export const fetchPlaceById = async (id: number): Promise<Place> => {
  const place = feedItems
    .find(item => item.type === 'place' && (item.data as Place).id === id)
    ?.data as Place;

  if (!place) {
    throw new Error('Place not found');
  }

  return place;
};