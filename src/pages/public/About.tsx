import {
  MapPin,
  Clock,
  Phone,
  Mail,
  Coffee,
  Star,
  ExternalLink,
} from "lucide-react";

import { useLanguage } from "@/hooks/use-language";
import heroBurger from "@/assets/hero-burger.jpg";

function InfoRow({
  icon: Icon,
  title,
  children,
}: {
  icon: any;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-red-100 bg-white p-4 shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
      <div className="flex items-center gap-2">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-red-50 text-primary">
          <Icon className="h-5 w-5" strokeWidth={1.8} />
        </div>

        <h3 className="text-sm font-semibold text-foreground">
          {title}
        </h3>
      </div>

      <div className="mt-3 pl-12 text-sm leading-relaxed text-muted-foreground">
        {children}
      </div>
    </div>
  );
}

export default function About() {
  const { t, lang } = useLanguage();

  return (
    <div className="mx-auto min-h-screen max-w-lg bg-background pb-24">
      {/* HERO */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={heroBurger}
          alt="SMASH&CO"
          className="h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        <div className="absolute bottom-5 left-5">
          <h1 className="text-3xl font-bold text-white">
            SMASH&CO
          </h1>

          <div className="mt-2 flex items-center gap-1 text-xs text-white/80">
            <Star
              className="h-3.5 w-3.5 text-yellow-300"
              strokeWidth={1.5}
            />

            {lang === "en" &&
              "Premium Burgers • Addis Ababa"}

            {lang === "am" &&
              "ፕሪሚየም በርገሮች • አዲስ አበባ"}

            {lang === "om" &&
              "Burgarii Premium • Finfinnee"}
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="px-4 pt-5">
        {/* DESCRIPTION */}
        <div className="rounded-3xl border border-red-100 bg-white p-5 shadow-sm">
          <p className="text-sm leading-7 text-muted-foreground">
            {t("about.description")}
          </p>
        </div>

        {/* INFO */}
        <div className="mt-5 space-y-3">
          {/* HOURS */}
          <InfoRow
            icon={Clock}
            title={t("about.hours")}
          >
            {t("about.hours1")}
            <br />
            <br />
            {t("about.hours2")}
          </InfoRow>

          {/* LOCATION */}
          <InfoRow
            icon={MapPin}
            title={t("about.location")}
          >
            {lang === "en" &&
              "Bole Around Edna Mall\nAddis Ababa, Ethiopia"}

            {lang === "am" &&
              "ቦሌ ኤድና ሞል አካባቢ\nአዲስ አበባ፣ ኢትዮጵያ"}

            {lang === "om" &&
              "Naannoo Edna Mall Bole\nFinfinnee, Itoophiyaa"}
          </InfoRow>

          {/* CONTACT */}
          <InfoRow
            icon={Phone}
            title={t("about.contact")}
          >
            <div>+251911000000</div>

            <div className="mt-2 flex items-center gap-2">
              <Mail
                className="h-4 w-4 text-muted-foreground"
                strokeWidth={1.5}
              />

              smashburger@gmail.com
            </div>
          </InfoRow>

          {/* SERVICES */}
          <InfoRow
            icon={Coffee}
            title={t("about.services")}
          >
            {lang === "en" && (
              <>
                Premium Burgers
                <br />
                Fast Delivery
                <br />
                Dine-In & Takeaway
                <br />
                Fresh Daily Ingredients
              </>
            )}

            {lang === "am" && (
              <>
                ፕሪሚየም በርገሮች
                <br />
                ፈጣን ዴሊቨሪ
                <br />
                በሱቅ ውስጥ & መውሰድ
                <br />
                በየቀኑ ትኩስ እቃዎች
              </>
            )}

            {lang === "om" && (
              <>
                Burgarii Premium
                <br />
                Geejjiba Ariifataa
                <br />
                Keessa Nyaachuu & Fudhachuu
                <br />
                Qabeenya Haaraa Guyyaa Guyyaa
              </>
            )}
          </InfoRow>
        </div>

        {/* MAP */}
        <div className="mt-5 overflow-hidden rounded-3xl border border-red-100 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-red-100 px-4 py-3">
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                {lang === "en" && "Find Us"}
                {lang === "am" && "ያግኙን"}
                {lang === "om" && "Nu Argadhaa"}
              </h3>

              <p className="text-xs text-muted-foreground">
                Bole Around Edna Mall
              </p>
            </div>

            <a
              href="https://maps.google.com/?q=Edna+Mall+Addis+Ababa"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-white"
            >
              {lang === "en" && "Open Map"}
              {lang === "am" && "ካርታ ክፈት"}
              {lang === "om" && "Kaartaa Bani"}

              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

          <iframe
            title="SMASH&CO Location"
            src="https://maps.google.com/maps?q=Edna%20Mall%20Addis%20Ababa&t=&z=15&ie=UTF8&iwloc=&output=embed"
            className="h-64 w-full border-0"
            loading="lazy"
          />
        </div>

        {/* FOOTER */}
        <div className="mt-6 rounded-3xl border border-red-100 bg-gradient-to-r from-red-50 via-white to-red-50 p-5 text-center shadow-sm">
          <p className="text-sm font-medium text-foreground">
            Made by Mela Solutions
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            {lang === "en" &&
              "Premium digital experiences for modern brands"}

            {lang === "am" &&
              "ለዘመናዊ ብራንዶች ፕሪሚየም ዲጂታል ልምዶች"}

            {lang === "om" &&
              "Muuxannoo dijitaalaa premium brandoota ammayyaaf"}
          </p>

          <div className="mt-3 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Phone className="h-3.5 w-3.5" />

            +251941999983 / +251912361879
          </div>
        </div>
      </div>
    </div>
  );
}