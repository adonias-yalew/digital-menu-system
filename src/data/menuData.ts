// menuData.ts

export type LangText = {
  en: string;
  am: string;
  om: string;
};

export type AddOn = {
  name: LangText;
  price: number;
};

export type Ingredient = {
  name: LangText;
  amount: string;
};

export type Item = {
  name: LangText;
  price: number;
  img: string;
  description: LangText;

  category:
    | "burgers"
    | "sides"
    | "drinks"
    | "chicken"
    | "desserts"
    | "breakfast";

  ingredients?: Ingredient[];
  addOns?: AddOn[];
  weight?: string;

  isPopular: boolean;
  isSpicy: boolean;
  isVeg: boolean;
  isNew: boolean;
};

import burgerDouble from "@/assets/burger-double.jpg";
import burgerSingle from "@/assets/burger-single.jpg";
import burgerSpicy from "@/assets/burger-spicy.jpg";
import burgerBacon from "@/assets/burger-bacon.jpg";

import sideRings from "@/assets/side-rings.jpg";
import sideLoaded from "@/assets/side-loaded.jpg";

import drinkShake from "@/assets/drink-shake.jpg";
import drinkCola from "@/assets/drink-cola.jpg";

export const ITEMS: Item[] = [
  {
    name: {
      en: "Rin Ann Spicy burger",
      am: "ሪን አን ቅመም የበሬ በርገር",
      om: "Rin Ann Burgarii Mi’aawaa",
    },

    description: {
      en: "Rich spicy slow-cooked beef stew made with premium Ethiopian spices.",
      am: "በኢትዮጵያ ቅመሞች የተሰራ በቀስታ የበሰለ ቅመም የበሬ ወጥ።",
      om: "Foon loowwii suuta bilchaate kan mi’eessituu Itoophiyaa waliin qophaa’e.",
    },

    price: 950,
    img: burgerDouble,

    category: "burgers",

    weight: "200g",

    ingredients: [
      {
        name: {
          en: "Onions",
          am: "ሽንኩርት",
          om: "Shunkurtii",
        },
        amount: "150g",
      },

      {
        name: {
          en: "Slow-Cooked Beef",
          am: "በቀስታ የበሰለ ስጋ",
          om: "Foon Suuta Bilchaate",
        },
        amount: "200g",
      },
    ],

    addOns: [
      {
        name: {
          en: "Extra Protein",
          am: "ተጨማሪ ፕሮቲን",
          om: "Pirootiinii Dabalataa",
        },
        price: 350,
      },

      {
        name: {
          en: "Extra Mixed Nuts",
          am: "ተጨማሪ ፍሬዎች",
          om: "Fuduraa Makamaa Dabalataa",
        },
        price: 250,
      },
    ],

    isPopular: true,
    isSpicy: true,
    isVeg: false,
    isNew: true,
  },

  {
    name: {
      en: "Classic Smash",
      am: "ክላሲክ ስማሽ",
      om: "Classic Smash",
    },

    description: {
      en: "Juicy smashed beef patty with fresh vegetables and signature sauce.",
      am: "ለስላሳ የተጨበጠ የበሬ ፓቲ ከአትክልት እና ልዩ ሶስ ጋር።",
      om: "Paatii loonii mi’aawaa kuduraa haaraa fi soosii addaa waliin.",
    },

    price: 780,
    img: burgerSingle,

    category: "burgers",

    ingredients: [
      {
        name: {
          en: "Beef Patty",
          am: "የበሬ ፓቲ",
          om: "Paatii Loonii",
        },
        amount: "180g",
      },

      {
        name: {
          en: "Cheddar Cheese",
          am: "ቼዳር ቺዝ",
          om: "Chiizii Cheddar",
        },
        amount: "60g",
      },
    ],

    addOns: [
      {
        name: {
          en: "Extra Cheese",
          am: "ተጨማሪ ቺዝ",
          om: "Chiizii Dabalataa",
        },
        price: 180,
      },

      {
        name: {
          en: "Extra Patty",
          am: "ተጨማሪ ፓቲ",
          om: "Paatii Dabalataa",
        },
        price: 320,
      },
    ],

    isPopular: true,
    isSpicy: false,
    isVeg: false,
    isNew: false,
  },

  {
    name: {
      en: "Double Smash",
      am: "ድብል ስማሽ",
      om: "Double Smash",
    },

    description: {
      en: "Two smashed patties with melted cheese and premium house sauce.",
      am: "ሁለት የተጨበጡ ፓቲዎች ከቀለጠ ቺዝ እና ልዩ ሶስ ጋር።",
      om: "Paatii lama chiizii baqee fi soosii addaa waliin.",
    },

    price: 980,
    img: burgerDouble,

    category: "burgers",

    isPopular: true,
    isSpicy: false,
    isVeg: false,
    isNew: false,
  },

  {
    name: {
      en: "Bacon Stack",
      am: "ቤከን ስታክ",
      om: "Bacon Stack",
    },

    description: {
      en: "Double beef burger stacked with crispy bacon and cheddar cheese.",
      am: "ድብል የበሬ በርገር ከቤከን እና ቼዳር ቺዝ ጋር።",
      om: "Burgarii loonii lama baaqelaa fi chiizii cheddar waliin.",
    },

    price: 1150,
    img: burgerBacon,

    category: "burgers",

    isPopular: true,
    isSpicy: false,
    isVeg: false,
    isNew: false,
  },

  {
    name: {
      en: "Jalapeno Heat",
      am: "ጃላፔኖ ሂት",
      om: "Jalapeno Heat",
    },

    description: {
      en: "Spicy burger loaded with jalapenos and smoky chipotle sauce.",
      am: "በጃላፔኖ እና ቺፖትሌ ሶስ የተሞላ ቅመም በርገር።",
      om: "Burgarii mi’aawaa jalapeno fi soosii chipotle waliin.",
    },

    price: 920,
    img: burgerSpicy,

    category: "burgers",

    isPopular: false,
    isSpicy: true,
    isVeg: false,
    isNew: false,
  },

  {
    name: {
      en: "Loaded Fries",
      am: "ሎድድ ፍራይስ",
      om: "Fries Guutame",
    },

    description: {
      en: "Golden fries topped with cheese, bacon, and signature sauce.",
      am: "በቺዝ፣ ቤከን እና ልዩ ሶስ የተሸፈነ ፍራይስ።",
      om: "Fries chiizii fi bacon waliin.",
    },

    price: 480,
    img: sideLoaded,

    category: "sides",

    isPopular: true,
    isSpicy: false,
    isVeg: false,
    isNew: true,
  },

  {
    name: {
      en: "Onion Rings",
      am: "የሽንኩርት ሪንጎች",
      om: "Ringii Shunkurtii",
    },

    description: {
      en: "Crispy onion rings with smoky dipping sauce.",
      am: "ጥሩ የሽንኩርት ሪንጎች ከሶስ ጋር።",
      om: "Ringii shunkurtii crispy soosii waliin.",
    },

    price: 420,
    img: sideRings,

    category: "sides",

    isPopular: false,
    isSpicy: false,
    isVeg: true,
    isNew: false,
  },

  {
    name: {
      en: "Craft Cola",
      am: "ክራፍት ኮላ",
      om: "Craft Cola",
    },

    description: {
      en: "Refreshing premium cola served ice cold.",
      am: "ቀዝቃዛ ፕሪሚየም ኮላ።",
      om: "Cola qorraa premium.",
    },

    price: 220,
    img: drinkCola,

    category: "drinks",

    isPopular: false,
    isSpicy: false,
    isVeg: true,
    isNew: false,
  },

  {
    name: {
      en: "Vanilla Shake",
      am: "ቫኒላ ሼክ",
      om: "Vanilla Shake",
    },

    description: {
      en: "Creamy vanilla milkshake blended fresh daily.",
      am: "በየቀኑ የሚዘጋጅ ክሬሚ ቫኒላ ሚልክሼክ።",
      om: "Milkshake vanilla guyyaa guyyaan qophaa’u.",
    },

    price: 380,
    img: drinkShake,

    category: "drinks",

    isPopular: true,
    isSpicy: false,
    isVeg: true,
    isNew: false,
  },
];

export const CATEGORY_MAP = {
  all: {
    en: "All",
    am: "ሁሉም",
    om: "Hunda",
  },

  burgers: {
    en: "Burgers",
    am: "በርገሮች",
    om: "Burgaarota",
  },

  sides: {
    en: "Sides",
    am: "ጎን ምግቦች",
    om: "Cinaa",
  },

  drinks: {
    en: "Drinks",
    am: "መጠጦች",
    om: "Dhugaatii",
  },
};

export const CATEGORY_KEYS = Object.keys(
  CATEGORY_MAP
) as (keyof typeof CATEGORY_MAP)[];

export const FILTER_KEYS = [
  "all",
  "popular",
  "spicy",
  "veg",
  "new",
] as const;

export const PRICE_FILTERS = [
  "all",
  "standard",
  "premium",
  "luxury",
] as const;