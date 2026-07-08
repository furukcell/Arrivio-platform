import type { HomeCopy, TabKey } from "../landingContent";

type LandingHeroProps = {
  home: HomeCopy;
  chooseTab: (tab: TabKey) => void;
};

export function LandingHero({ home, chooseTab }: LandingHeroProps) {
  return (
    <section className="hero">
      <div className="heroText">
        <div className="heroBadge">{home.hero.badge}</div>
        <h1>{home.hero.title}</h1>
        <p>{home.hero.description}</p>
        <div className="heroActions">
          <button onClick={() => chooseTab("transfer")}>{home.hero.primary}</button>
          <a href="#how">{home.hero.secondary}</a>
        </div>
        <div className="stats">
          {home.stats.map((item) => <div key={item.label}><b>{item.value}</b><span>{item.label}</span></div>)}
        </div>
      </div>
      <div className="heroMockup">
        <div className="mockTop"><span>BJV</span><b>Airport Desk</b></div>
        <div className="mockCard main"><strong>Transfer request</strong><p>BJV → Bodrum Marina</p><em>Provider matching</em></div>
        <div className="mockGrid"><div>Car</div><div>Hotel</div><div>Ticket</div></div>
        <div className="mockBubble">WhatsApp support active</div>
      </div>
    </section>
  );
}
