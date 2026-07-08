import type { HomeCopy } from "../landingContent";
import type { WebLanguage } from "../supportModel";
import { whatsappSupportUrl } from "../supportModel";

type LandingFooterProps = {
  home: HomeCopy;
  language: WebLanguage;
};

export function LandingFooter({ home, language }: LandingFooterProps) {
  return (
    <footer className="footer">
      <div><b>Arrivio</b><p>Land. Choose. Go.</p></div>
      <a href={whatsappSupportUrl(language)}>{home.common.support}</a>
    </footer>
  );
}
