/** Content copied verbatim from app_server/views/imprint.pug (legal/Impressum text) — do not paraphrase. */
export function Imprint() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Impressum</h1>

      <div className="space-y-1">
        <p>Dipl.-Inform. Jörn Dinkla (Freiberufler, Freelancer)</p>
        <p>Dorotheenstraße 133</p>
        <p>22299 Hamburg, Germany</p>
        <p>Mobil: +49 (0) 179 70 10 60 5</p>
        <p>Email: joern@dinkla.com</p>
        <p>Internet: www.dinkla.com</p>
        <p>Umsatzsteuer-ID gemäß § 27 a Umsatzsteuergesetz: DE256513755</p>
        <p>Inhaltlich Verantwortlicher gemäß § 55 Abs. 2 RStV: Jörn Dinkla (Anschrift wie oben)</p>
      </div>

      <div>
        <h2 className="text-xl font-semibold">Haftungshinweis</h2>
        <div className="space-y-1">
          <p>Trotz sorgfältiger inhaltlicher Kontrolle übernehme ich keine Haftung für die Inhalte externer Links.</p>
          <p>Für den Inhalt der verlinkten Seiten sind ausschließlich deren Betreiber verantwortlich.</p>
          <p>Alle auf dieser Website enthaltenen Marken- und Produktnamen sind Eigentum des jeweiligen Besitzers.</p>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold">Urheberschutz</h2>
        <p>
          Diese Web-Applikation wurde unter der{' '}
          <a className="text-blue-600 hover:underline" href="http://choosealicense.com/licenses/gpl-3.0">
            GNU General Public License v3.0
          </a>
          -Lizenz veröffentlicht.
        </p>
      </div>
    </div>
  );
}
