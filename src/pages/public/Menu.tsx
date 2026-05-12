import { useMemo, useState, useEffect } from "react";
import { ChevronLeft, Search, X, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useLanguage } from "@/hooks/use-language";
import { useImageCache } from "@/utils/imageCache";
import CachedImage from "@/components/CachedImage";
import { debugImageSystem, testImageUrl } from "@/utils/imageDebug";
import { getLocalizedText, getCategoryName } from "@/utils/languageFallback";

import heroBurger from "@/assets/hero-burger.jpg";
import burgerSingle from "@/assets/burger-single.jpg";
import sideFries from "@/assets/side-fries.jpg";
import drinkCola from "@/assets/drink-cola.jpg";
import burgerSpicy from "@/assets/burger-spicy.jpg";
import sideRings from "@/assets/side-rings.jpg";

import {
  CategoryKey,
  CATEGORY_MAP,
  FILTER_KEYS,
  PRICE_FILTERS,
  Item,
} from "@/types/menu";

// Helper to get category keys
const CATEGORY_KEYS: CategoryKey[] = ['all', 'burgers', 'sides', 'drinks', 'chicken', 'desserts', 'breakfast'];

// Category images mapping for filters
const CATEGORY_IMAGES = {
  all: heroBurger,
  burgers: burgerSingle,
  sides: sideFries,
  drinks: drinkCola,
  chicken: burgerSpicy,
  desserts: sideRings,
  breakfast: burgerSingle,
};
import { getMenuItems } from "@/services/menuService";

function ItemDetail({
  item,
  onClose,
  t,
  lang,
}: {
  item: Item;
  onClose: () => void;
  t: (path: string) => string;
  lang: "en" | "am" | "om";
}) {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-60 overflow-y-auto bg-black/40 backdrop-blur-sm">
      <div className="mx-auto min-h-screen max-w-lg bg-white">
        {/* IMAGE */}
        <div className="relative h-80 overflow-hidden">
          {item.img ? (
            <CachedImage 
              src={item.img} 
              alt={item.name[lang]} 
              className="h-full w-full object-cover"
              preload={true}
            />
          ) : (
            <div className="h-full w-full bg-gray-200 flex items-center justify-center">
              <svg className="h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
          )}

          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent" />

          <button
            onClick={onClose}
            className="absolute left-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/90 backdrop-blur"
          >
            <ChevronLeft className="h-5 w-5 text-foreground" />
          </button>

          <div className="absolute bottom-5 left-5 right-5">
            <p className="text-xs uppercase tracking-[0.2em] text-white/80">
              {getCategoryName(item.category, lang, CATEGORY_MAP)}
            </p>

            <h2 className="mt-2 text-3xl font-bold text-white">{getLocalizedText(item.name, lang)}</h2>
          </div>
        </div>

        {/* CONTENT */}
        <div className="px-5 pb-10 pt-5">
          {/* PRICE + WEIGHT */}
          <div className="flex items-center justify-between">
            <div className="rounded-full bg-secondary px-4 py-2 text-sm font-semibold text-foreground">
              {item.price} ETB
            </div>

            {item.weight && (
              <div className="rounded-full border border-border px-4 py-2 text-xs font-medium text-muted-foreground">
                {item.weight}
              </div>
            )}
          </div>

          {/* TAGS */}
          <div className="mt-4 flex gap-2">
            {item.isPopular && (
              <span className="rounded-full bg-orange-100 px-3 py-1 text-[11px] font-medium text-orange-700">
                {t("menu.filters.popular")}
              </span>
            )}

            {item.isNew && (
              <span className="rounded-full bg-green-100 px-3 py-1 text-[11px] font-medium text-green-700">
                {t("menu.filters.new")}
              </span>
            )}

            {item.isSpicy && (
              <span className="rounded-full bg-red-100 px-3 py-1 text-[11px] font-medium text-red-700">
                {t("menu.filters.spicy")}
              </span>
            )}
          </div>

          {/* DESCRIPTION */}
          <p className="mt-5 text-sm leading-7 text-muted-foreground">{getLocalizedText(item.description, lang)}</p>

          {/* INGREDIENTS */}
          {item.ingredients && (
            <div className="mt-8">
              <h3 className="text-sm font-semibold text-foreground">Detailed Ingredients</h3>

              <div className="mt-4 space-y-3">
                {item.ingredients.map((ingredient) => (
                  <div
                    key={`${ingredient.name.en}-${ingredient.amount}`}
                    className="flex items-center justify-between rounded-2xl bg-secondary/40 px-4 py-4"
                  >
                    <span className="text-sm font-medium text-foreground">
                      {getLocalizedText(ingredient.name, lang)}
                    </span>

                    <span className="text-xs font-semibold text-muted-foreground">
                      {ingredient.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ADDONS */}
          {item.addOns && (
            <div className="mt-8">
              <h3 className="text-sm font-semibold text-foreground">Add Ons</h3>

              <div className="mt-4 space-y-3">
                {item.addOns?.map((addon) => (
                  <div
                    key={addon.name.en}
                    className="flex items-center justify-between rounded-2xl border border-border px-4 py-4"
                  >
                    <span className="text-sm font-medium text-foreground">{getLocalizedText(addon.name, lang)}</span>

                    <span className="text-xs font-semibold text-primary">+ {addon.price} ETB</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FEEDBACK BUTTON */}
          <button
            onClick={() => navigate("/feedback")}
            className="mt-10 flex w-full items-center justify-center rounded-2xl bg-primary py-4 text-sm font-semibold tracking-wide text-white shadow-sm transition hover:opacity-95 active:scale-[0.98]"
          >
            Give Us Feedback
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Menu() {
  const { lang, setLang, t } = useLanguage();
  const { preloadImages } = useImageCache();

  const [category, setCategory] = useState<(typeof CATEGORY_KEYS)[number]>("all");
  const [filter, setFilter] = useState<(typeof FILTER_KEYS)[number]>("all");
  const [priceFilter, setPriceFilter] = useState<(typeof PRICE_FILTERS)[number]>("all");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Item | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  // Preload critical images
  useEffect(() => {
    const criticalImages = [
      heroBurger,
      burgerSingle,
      sideFries,
      drinkCola,
      burgerSpicy,
      sideRings
    ];
    preloadImages(criticalImages);
  }, [preloadImages]);

  // Load menu items from Supabase
  useEffect(() => {
    const loadMenuItems = async () => {
      try {
        const menuItems = await getMenuItems();
        setItems(menuItems);
      } catch (error) {
        console.error('Error loading menu items:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMenuItems();
  }, []);

  const filtered = useMemo(() => {
    let filteredItems = category === "all" ? items : items.filter((i: Item) => i.category === category);

    // FILTERS
    if (filter === "popular") {
      filteredItems = filteredItems.filter((i: Item) => i.isPopular);
    }

    if (filter === "spicy") {
      filteredItems = filteredItems.filter((i: Item) => i.isSpicy);
    }

    if (filter === "veg") {
      filteredItems = filteredItems.filter((i: Item) => i.isVeg);
    }

    if (filter === "new") {
      filteredItems = filteredItems.filter((i: Item) => i.isNew);
    }

    // PRICE
    if (priceFilter === "standard") {
      filteredItems = filteredItems.filter((i: Item) => i.price <= 500);
    }

    if (priceFilter === "premium") {
      filteredItems = filteredItems.filter((i: Item) => i.price > 500 && i.price <= 900);
    }

    if (priceFilter === "luxury") {
      filteredItems = filteredItems.filter((i: Item) => i.price > 900);
    }

    // SEARCH
    if (query) {
      const q = query.toLowerCase();

      filteredItems = filteredItems.filter(
        (i: Item) => {
          const name = getLocalizedText(i.name, lang);
          const description = getLocalizedText(i.description, lang);
          return name.toLowerCase().includes(q) || description.toLowerCase().includes(q);
        },
      );
    }

    return filteredItems;
  }, [category, filter, priceFilter, query, lang, items]);

  return (
    <div className="mx-auto min-h-screen max-w-lg bg-background">
      {/* HEADER */}
      <div className="sticky top-0 z-40 border-b border-border/60 bg-white/95 backdrop-blur">
        <div className="px-5 pb-4 pt-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-foreground">SMASH&CO</h1>

              <p className="mt-1 text-xs text-muted-foreground">
                Bole, Addis Ababa · {t("menu.deliveryInfo")}
              </p>
            </div>

            {/* LANGUAGE */}
            <div className="flex overflow-hidden rounded-lg border border-border bg-secondary/50">
              {(["en", "am", "om"] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-3 py-1.5 text-[11px] font-semibold uppercase transition ${
                    lang === l
                      ? "bg-primary text-white"
                      : "text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* HERO */}
      <div className="relative h-[260px] overflow-hidden">
        <CachedImage
          src={heroBurger}
          alt="SMASH&CO"
          className="h-full w-full object-cover brightness-[0.88]"
          preload={true}
        />

        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent" />

        <div className="absolute bottom-5 left-5">
          <p className="text-xs uppercase tracking-[0.2em] text-white/80">Premium Burgers</p>

          <h2 className="mt-1 text-3xl font-bold text-white">Freshly Smashed Daily</h2>
        </div>
      </div>

      {/* CONTENT */}
      <div className="px-4 pb-24 py-5">
        {/* SEARCH */}
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-white px-4 py-3.5 shadow-sm">
          <Search className="h-4 w-4 text-muted-foreground" />

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("menu.searchPlaceholder")}
            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />

          {query && (
            <button onClick={() => setQuery("")}>
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>

        {/* FILTERS */}
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {FILTER_KEYS.map((f) => {
            const active = filter === f;

            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`shrink-0 rounded-full px-4 py-2 text-xs font-medium transition ${
                  active
                    ? "bg-primary text-white"
                    : "border border-border bg-white text-muted-foreground"
                }`}
              >
                {t(`menu.filters.${f}`)}
              </button>
            );
          })}
        </div>

        {/* CATEGORIES */}
        <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
          {CATEGORY_KEYS.map((cat: CategoryKey) => {
            const active = category === cat;

            return (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`group relative overflow-hidden rounded-2xl border-2 transition-all duration-300 hover:scale-105 shrink-0 ${
                  active
                    ? "border-primary bg-primary shadow-lg"
                    : "border-border bg-white hover:border-primary/50"
                }`}
                style={{ width: '120px', height: '80px' }}
              >
                <div className="relative h-full w-full">
                  <CachedImage 
                    src={CATEGORY_IMAGES[cat]} 
                    alt={CATEGORY_MAP[cat][lang]}
                    className={`h-full w-full object-cover transition-transform duration-300 group-hover:scale-110 ${
                      active ? "opacity-90" : "opacity-70"
                    }`}
                  />
                  <div className={`absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 ${
                    active ? "opacity-70" : "opacity-0 group-hover:opacity-50"
                  }`} />
                  <div className="absolute bottom-2 left-2 right-2">
                    <p className={`text-xs font-bold text-center transition-colors duration-300 ${
                      active ? "text-white" : "text-white group-hover:text-white"
                    }`}>
                      {CATEGORY_MAP[cat][lang]}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* PRICE FILTERS */}
        <div className="mt-5">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Price Range
            </h3>

            {priceFilter !== "all" && (
              <button
                onClick={() => setPriceFilter("all")}
                className="text-[11px] font-medium text-primary"
              >
                Reset
              </button>
            )}
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {PRICE_FILTERS.map((price) => {
              const active = priceFilter === price;

              const labels = {
                all: "All Prices",
                standard: "Under 500 ETB",
                premium: "500 - 900 ETB",
                luxury: "Luxury 900+ ETB",
              };

              return (
                <button
                  key={price}
                  onClick={() => setPriceFilter(price)}
                  className={`shrink-0 rounded-full px-4 py-2 text-xs font-medium transition ${
                    active
                      ? "bg-primary text-white"
                      : "border border-border bg-white text-muted-foreground"
                  }`}
                >
                  {labels[price]}
                </button>
              );
            })}
          </div>
        </div>

        {/* COUNT */}
        <div className="mb-3 mt-6 flex items-center justify-between">
          <p className="text-sm font-semibold text-foreground">Menu Items</p>

          <p className="text-xs text-muted-foreground">{filtered.length} items</p>
        </div>

        {/* ITEMS */}
        <div className="space-y-3.5">
          {filtered.map((item: Item) => (
            <button
              key={item.name.en}
              onClick={() => setSelected(item)}
              className="group flex w-full gap-4 rounded-3xl border border-border/80 bg-white p-3 text-left shadow-sm transition duration-200 hover:-translate-y-px hover:shadow-md active:scale-[0.995]"
            >
              <div className="h-24 w-24 rounded-2xl overflow-hidden bg-gray-100 flex items-center justify-center">
                {item.img ? (
                  <CachedImage
                    src={item.img}
                    alt={item.name[lang]}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                    <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                )}
              </div>

              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{getLocalizedText(item.name, lang)}</h3>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {getCategoryName(item.category, lang, CATEGORY_MAP)}
                    </p>

                    <div className="mt-2 flex gap-1">
                      {item.isPopular && (
                        <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-medium text-orange-700">
                          {t("menu.filters.popular")}
                        </span>
                      )}

                      {item.isNew && (
                        <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-medium text-green-700">
                          {t("menu.filters.new")}
                        </span>
                      )}
                    </div>
                  </div>

                  <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-foreground">
                    {item.price} ETB
                  </span>
                </div>

                <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                  {getLocalizedText(item.description, lang)}
                </p>

                <div className="mt-auto pt-3">
                  <span className="text-xs font-medium text-primary">View Details</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* MODAL */}
      {selected && (
        <ItemDetail item={selected} onClose={() => setSelected(null)} t={t} lang={lang} />
      )}
    </div>
  );
}
