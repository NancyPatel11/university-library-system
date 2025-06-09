export const navigationLinks = [
  {
    href: "/library",
    label: "Library",
  },

  {
    img: "/icons/user.svg",
    selectedImg: "/icons/user-fill.svg",
    href: "/my-profile",
    label: "My Profile",
  },
];

export const adminSideBarLinks = [
  {
    img: "/icons/admin/home.svg",
    route: "/admin",
    text: "Home",
  },
  {
    img: "/icons/admin/users.svg",
    route: "/admin/users",
    text: "All Users",
  },
  {
    img: "/icons/admin/book.svg",
    route: "/admin/books",
    text: "All Books",
  },
  {
    img: "/icons/admin/bookmark.svg",
    route: "/admin/book-requests",
    text: "Borrow Requests",
  },
  {
    img: "/icons/admin/user.svg",
    route: "/admin/account-requests",
    text: "Account Requests",
  },
];

export const FIELD_NAMES = {
  fullName: "Full name",
  email: "Email",
  universityId: "University ID Number",
  password: "Password",
  universityCard: "Upload University ID Card",
};

export const FIELD_TYPES = {
  fullName: "text",
  email: "email",
  universityId: "number",
  password: "password",
};

export const sampleBooks = [
  {
    id: 1,
    title: "The Midnight Library",
    author: "Matt Haig",
    genre: "Fantasy / Fiction",
    rating: 4.6,
    total_copies: 20,
    available_copies: 10,
    description:
      "A dazzling novel about all the choices that go into a life well lived, The Midnight Library tells the story of Nora Seed as she finds herself between life and death.",
    color: "#1c1f40",
    cover: "https://m.media-amazon.com/images/I/81J6APjwxlL.jpg",
    video: "/sample-video.mp4?updatedAt=1722593504152",
    summary:
      "A dazzling novel about all the choices that go into a life well lived, The Midnight Library tells the story of Nora Seed as she finds herself between life and death. A dazzling novel about all the choices that go into a life well lived, The Midnight Library tells the story of Nora Seed as she finds herself between life and death.",
  },
  {
    id: 2,
    title: "Atomic Habits",
    author: "James Clear",
    genre: "Self-Help / Productivity",
    rating: 4.9,
    total_copies: 99,
    available_copies: 50,
    description:
      "A revolutionary guide to making good habits, breaking bad ones, and getting 1% better every day.",
    color: "#fffdf6",
    cover: "https://m.media-amazon.com/images/I/81F90H7hnML.jpg",
    video: "/sample-video.mp4?updatedAt=1722593504152",
    summary:
      "A revolutionary guide to making good habits, breaking bad ones, and getting 1% better every day.",
  },
  {
    id: 3,
    title: "You Don't Know JS: Scope & Closures",
    author: "Kyle Simpson",
    genre: "Computer Science / JavaScript",
    rating: 4.7,
    total_copies: 9,
    available_copies: 5,
    description:
      "An essential guide to understanding the core mechanisms of JavaScript, focusing on scope and closures.",
    color: "#f8e036",
    cover:
      "https://m.media-amazon.com/images/I/7186YfjgHHL._AC_UF1000,1000_QL80_.jpg",
    video: "/sample-video.mp4?updatedAt=1722593504152",
    summary:
      "An essential guide to understanding the core mechanisms of JavaScript, focusing on scope and closures.",
  },
  {
    id: 4,
    title: "The Alchemist",
    author: "Paulo Coelho",
    genre: "Philosophy / Adventure",
    rating: 4.5,
    total_copies: 78,
    available_copies: 50,
    description:
      "A magical tale of Santiago, an Andalusian shepherd boy, who embarks on a journey to find a worldly treasure.",
    color: "#ed6322",
    cover:
      "https://m.media-amazon.com/images/I/61HAE8zahLL._AC_UF1000,1000_QL80_.jpg",
    video: "/sample-video.mp4?updatedAt=1722593504152",
    summary:
      "A magical tale of Santiago, an Andalusian shepherd boy, who embarks on a journey to find a worldly treasure.",
  },
  {
    id: 5,
    title: "Deep Work",
    author: "Cal Newport",
    genre: "Self-Help / Productivity",
    rating: 4.7,
    total_copies: 23,
    available_copies: 23,
    description:
      "Rules for focused success in a distracted world, teaching how to cultivate deep focus to achieve peak productivity.",
    color: "#ffffff",
    cover: "https://m.media-amazon.com/images/I/81JJ7fyyKyS.jpg",
    video: "/sample-video.mp4?updatedAt=1722593504152",
    summary:
      "Rules for focused success in a distracted world, teaching how to cultivate deep focus to achieve peak productivity.",
  },
  {
    id: 6,
    title: "Clean Code",
    author: "Robert C. Martin",
    genre: "Computer Science / Programming",
    rating: 4.8,
    total_copies: 56,
    available_copies: 56,
    description:
      "A handbook of agile software craftsmanship, offering best practices and principles for writing clean and maintainable code.",
    color: "#080c0d",
    cover:
      "https://m.media-amazon.com/images/I/71T7aD3EOTL._UF1000,1000_QL80_.jpg",
    video: "/sample-video.mp4?updatedAt=1722593504152",
    summary:
      "A handbook of agile software craftsmanship, offering best practices and principles for writing clean and maintainable code.",
  },
  {
    id: 7,
    title: "The Pragmatic Programmer",
    author: "Andrew Hunt, David Thomas",
    genre: "Computer Science / Programming",
    rating: 4.8,
    total_copies: 25,
    available_copies: 3,
    description:
      "A timeless guide for developers to hone their skills and improve their programming practices.",
    color: "#100f15",
    cover:
      "https://m.media-amazon.com/images/I/71VStSjZmpL._AC_UF1000,1000_QL80_.jpg",
    video: "/sample-video.mp4?updatedAt=1722593504152",
    summary:
      "A timeless guide for developers to hone their skills and improve their programming practices.",
  },
  {
    id: 8,
    title: "The Psychology of Money",
    author: "Morgan Housel",
    genre: "Finance / Self-Help",
    rating: 4.8,
    total_copies: 10,
    available_copies: 5,
    description:
      "Morgan Housel explores the unique behaviors and mindsets that shape financial success and decision-making.",
    color: "#ffffff",
    cover:
      "https://m.media-amazon.com/images/I/81Dky+tD+pL._AC_UF1000,1000_QL80_.jpg",
    video: "/sample-video.mp4?updatedAt=1722593504152",
    summary:
      "Morgan Housel explores the unique behaviors and mindsets that shape financial success and decision-making.",
  },
  {
    id: 9,
    title: "Educated",
    author: "Tara Westover",
    genre: "Memoir / Biography",
    rating: 4.7,
    total_copies: 40,
    available_copies: 22,
    description:
      "A powerful memoir about a woman who grows up in a strict and abusive household in rural Idaho but eventually escapes to learn about the wider world through education.",
    color: "#f0e4d7",
    cover: "https://m.media-amazon.com/images/I/81WojUxbbFL.jpg",
    video: "/sample-video.mp4?updatedAt=1722593504152",
    summary:
      "A powerful memoir of overcoming adversity through education, chronicling Tara Westover’s journey from survivalist upbringing to earning a PhD from Cambridge University.",
  },
  {
    id: 10,
    title: "The Silent Patient",
    author: "Alex Michaelides",
    genre: "Psychological Thriller / Mystery",
    rating: 4.4,
    total_copies: 68,
    available_copies: 22,
    description:
      "A woman shoots her husband—and then stops speaking. A psychotherapist must uncover the truth.",
    color: "#f1faee",
    cover: "https://m.media-amazon.com/images/I/81JJPDNlxSL._SL1500_.jpg",
    video: "/sample-video.mp4?updatedAt=1722593504152",
    summary:
      "A chilling, twist-filled thriller about silence, trauma, and obsession.",
  },
  {
    id: 11,
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    genre: "History / Anthropology",
    rating: 4.6,
    total_copies: 47,
    available_copies: 19,
    description:
      "An exploration of humanity's creation and evolution—from the Stone Age to the modern age of technology.",
    color: "#f3f2ef",
    cover: "https://m.media-amazon.com/images/I/713jIoMO3UL.jpg",
    video: "/sample-video.mp4?updatedAt=1722593504152",
    summary:
      "A compelling narrative that traces the journey of humankind from early hunter-gatherers to the age of capitalism and science.",
  },
  {
    id: 12,
    title: "The Subtle Art of Not Giving a F*ck",
    author: "Mark Manson",
    genre: "Self-Help / Philosophy",
    rating: 4.4,
    total_copies: 70,
    available_copies: 35,
    description:
      "A no-nonsense guide to living a better life by caring less about more things and more about what truly matters.",
    color: "#f45b00",
    cover: "https://m.media-amazon.com/images/I/71QKQ9mwV7L.jpg",
    video: "/sample-video.mp4?updatedAt=1722593504152",
    summary:
      "A blunt but humorous take on living a more fulfilling life by choosing what to care about wisely.",
  },
  {
    id: 13,
    title: "1984",
    author: "George Orwell",
    genre: "Dystopian / Political Fiction",
    rating: 4.6,
    total_copies: 90,
    available_copies: 40,
    description:
      "A chilling depiction of a totalitarian regime and the control of truth, language, and thought.",
    color: "#c3221c",
    cover: "https://m.media-amazon.com/images/I/71kxa1-0mfL.jpg",
    video: "/sample-video.mp4?updatedAt=1722593504152",
    summary:
      "A prophetic dystopian novel that explores the dangers of oppressive government and mind control.",
  },
  {
    id: 14,
    title: "The Design of Everyday Things",
    author: "Don Norman",
    genre: "Design / UX",
    rating: 4.5,
    total_copies: 32,
    available_copies: 17,
    description:
      "An essential guide to human-centered design, explaining why some products satisfy users while others frustrate them.",
    color: "#e0dada",
    cover: "https://m.media-amazon.com/images/I/71HMyqG6MRL.jpg",
    video: "/sample-video.mp4?updatedAt=1722593504152",
    summary:
      "Don Norman’s classic reveals the psychology behind effective design and usability in everyday life.",
  },
  {
    id: 15,
    title: "Rich Dad Poor Dad",
    author: "Robert T. Kiyosaki",
    genre: "Finance / Personal Development",
    rating: 4.6,
    total_copies: 100,
    available_copies: 55,
    description:
      "A personal finance classic that challenges the traditional notions of money and investing, based on the author’s two 'dads' — one rich, one poor.",
    color: "#7b4691",
    cover: "https://m.media-amazon.com/images/I/81bsw6fnUiL.jpg",
    video: "/sample-video.mp4?updatedAt=1722593504152",
    summary:
      "An insightful and motivational book that teaches financial independence through real estate, investing, and entrepreneurship.",
  },
  {
    id: 16,
    title: "Ikigai: The Japanese Secret to a Long and Happy Life",
    author: "Héctor García & Francesc Miralles",
    genre: "Self-Help / Philosophy",
    rating: 4.5,
    total_copies: 66,
    available_copies: 34,
    description:
      "Discover the Japanese philosophy of ikigai — a reason for being — that can help you live a longer, more fulfilling life.",
    color: "#c8ebf3",
    cover: "https://m.media-amazon.com/images/I/81l3rZK4lnL.jpg",
    video: "/sample-video.mp4?updatedAt=1722593504152",
    summary:
      "This international bestseller explores habits, diets, and cultural wisdom from Okinawa, the world’s longest-living people.",
  },
  {
    id: 17,
    title: "Blink",
    author: "Malcolm Gladwell",
    genre: "Psychology / Popular Science",
    rating: 4.2,
    total_copies: 35,
    available_copies: 14,
    description:
      "An exploration of the power of thinking without thinking — rapid cognition and snap judgments.",
    color: "#f4f4f4",
    cover: "https://m.media-amazon.com/images/I/71UypkUjStL.jpg",
    video: "/sample-video.mp4?updatedAt=1722593504152",
    summary:
      "Gladwell reveals how our unconscious mind influences our decisions and perceptions.",
  },
  {
    id: 18,
    title: "Project Hail Mary",
    author: "Andy Weir",
    genre: "Science Fiction / Thriller",
    rating: 4.8,
    total_copies: 38,
    available_copies: 14,
    description:
      "A lone astronaut must save humanity in this gripping tale from the author of *The Martian*.",
    color: "#1b263b",
    cover: "https://m.media-amazon.com/images/I/81zD9kaVW9L.jpg",
    video: "/sample-video.mp4?updatedAt=1722593504152",
    summary:
      "A clever and heartfelt sci-fi epic filled with problem-solving, humor, and high stakes.",
  },
  {
    id: 19,
    title: "The Power of Now",
    author: "Eckhart Tolle",
    genre: "Spirituality / Mindfulness",
    rating: 4.7,
    total_copies: 90,
    available_copies: 70,
    description:
      "Discover how to live fully in the present moment and free yourself from pain and anxiety.",
    color: "#cdf0ea",
    cover: "https://m.media-amazon.com/images/I/71-zqlETKcL._SL1500_.jpg",
    video: "/sample-video.mp4?updatedAt=1722593504152",
    summary:
      "A transformative guide to spiritual awakening and presence.",
  },
  {
    id: 20,
    title: "The Book Thief",
    author: "Markus Zusak",
    genre: "Historical Fiction / Young Adult",
    rating: 4.7,
    total_copies: 65,
    available_copies: 23,
    description:
      "Narrated by Death, this haunting story follows a girl growing up in Nazi Germany who steals books to survive.",
    color: "#c1121f",
    cover: "https://m.media-amazon.com/images/I/91JGwQlnu7L._SL1500_.jpg",
    video: "/sample-video.mp4?updatedAt=1722593504152",
    summary:
      "A heartbreaking and uplifting story of words, war, and resilience during WWII.",
  },
];