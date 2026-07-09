import type { HomeCopy, TabKey } from "../landingContent";
import type { WebLanguage } from "../supportModel";
import { languageHref, whatsappSupportUrl } from "../supportModel";

type LandingNavProps = {
  home: HomeCopy;
  language: WebLanguage;
  chooseTab: (tab: TabKey) => void;
};

export function LandingNav({ home, language, chooseTab }: LandingNavProps) {
  return (
    <>
      <div className="topStrip">{home.top}</div>
      <header className="navbar">
        <div className="brand"><div className="logoMark">A</div><span>Arrivio</span></div>
        <nav className="desktopNav">
          <button onClick={() => chooseTab("transfer")}>{home.nav.transfer}</button>
          <button onClick={() => chooseTab("rental")}>{home.nav.rental}</button>
          <button onClick={() => chooseTab("hotel")}>{home.nav.hotels}</button>
          <button onClick={() => chooseTab("ticket")}>{home.nav.flights}</button>
          <a href={whatsappSupportUrl(language)}>{home.nav.support}</a>
        </nav>
        <div className="rightNav">
          <a href={languageHref("/", "tr")}>TR</a>
          <span>|</span>
          <a href={languageHref("/", "en")}>EN</a>
          <a className="partnerLoginLink" href={`/partner-login?lang=${language}`}>{home.nav.partnerLogin}</a>
          <button onClick={() => chooseTab("transfer")}>{home.nav.cta}</button>
        </div>
      </header>
    </>
  );
}
