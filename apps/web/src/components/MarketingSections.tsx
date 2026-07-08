import type { HomeCopy, TabKey } from "../landingContent";
import type { WebLanguage } from "../supportModel";

type MarketingSectionsProps = {
  home: HomeCopy;
  language: WebLanguage;
  chooseTab: (tab: TabKey) => void;
};

export function MarketingSections({ home, language, chooseTab }: MarketingSectionsProps) {
  return (
    <>
      <section className="section modules">
        <div className="sectionTitle">
          <span>02</span>
          <h2>{language === "tr" ? "Tüm işler tek akışta" : "All services in one flow"}</h2>
          <p>{language === "tr" ? "Arrivio ana ekranı, yolcuyu farklı sayfalara dağıtmadan hizmet talebini alır." : "Arrivio collects passenger requests without forcing them across separate pages."}</p>
        </div>
        <div className="moduleGrid">
          {home.modules.map((item) => <button key={item.title} onClick={() => chooseTab(item.tab)}><i>{item.icon}</i><b>{item.title}</b><p>{item.text}</p></button>)}
        </div>
      </section>

      <section className="section benefits">
        <div className="sectionTitle"><span>03</span><h2>{language === "tr" ? "Neden daha profesyonel durur?" : "Why it feels professional"}</h2></div>
        <div className="benefitGrid">{home.benefits.map((item) => <div key={item.title}><b>{item.title}</b><p>{item.text}</p></div>)}</div>
      </section>

      <section id="how" className="section process">
        <div className="processText"><span>04</span><h2>{language === "tr" ? "3 adımda operasyon" : "Operation in 3 steps"}</h2><p>{home.social.text}</p></div>
        <div className="stepGrid">{home.steps.map((step, index) => <div key={step.title}><em>{index + 1}</em><b>{step.title}</b><p>{step.text}</p></div>)}</div>
      </section>

      <section className="section revenue">
        <div><span>05</span><h2>{home.revenue.title}</h2><p>{home.revenue.text}</p></div>
        <ul>{home.revenue.items.map((item) => <li key={item}>✓ {item}</li>)}</ul>
      </section>
    </>
  );
}
