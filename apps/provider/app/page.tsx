const providerCards = [
  "New Requests",
  "Active Jobs",
  "Completed Jobs",
  "Commissions",
  "Profile & Documents"
];

export default function ProviderHomePage() {
  return (
    <main className="providerPage">
      <h1>Arrivio Provider</h1>
      <p>Provider dashboard placeholder for MVP.</p>

      <section className="grid">
        {providerCards.map((card) => (
          <article key={card} className="card">
            <h2>{card}</h2>
            <p>Provider only sees requests assigned to its providerId.</p>
          </article>
        ))}
      </section>
    </main>
  );
}
