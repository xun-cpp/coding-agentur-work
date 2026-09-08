export type ServiceSeo = {
  title: string;
  description: string;
  heading: string;
  intro: string;
  faq: readonly { q: string; a: string }[];
};

export const serviceSeo: Record<string, ServiceSeo> = {
  websites: {
    title: 'Website erstellen lassen in Gütersloh | Coding Agentur',
    description:
      'Individuelle Unternehmenswebsites aus Gütersloh: Design, Programmierung, SEO-Grundlagen und Betrieb. Ohne Baukasten, direkt mit den Entwicklern.',
    heading: 'Häufige Fragen zur Website',
    intro: 'Was uns vor einem Website-Projekt am häufigsten gefragt wird.',
    faq: [
      {
        q: 'Was kostet es, eine Website erstellen zu lassen?',
        a: 'Der Preis hängt vom Umfang ab: Seitenanzahl, Funktionen, Inhalte und Anbindungen. Nach einem kostenlosen Erstgespräch bekommen Sie ein konkretes Angebot statt einer Pauschale ins Blaue.',
      },
      {
        q: 'Arbeitet ihr mit einem Baukasten oder fertigen Themes?',
        a: 'Wir bauen individuell. Statt einem gekauften Theme entsteht eine Website, die genau Ihre Inhalte und Abläufe abbildet – schnell, wartbar und ohne Ballast, den niemand braucht.',
      },
      {
        q: 'Kann ich die Inhalte später selbst pflegen?',
        a: 'Ja. Wenn Sie Texte und Bilder selbst ändern wollen, binden wir ein passendes Redaktionssystem an. Wenn Ihnen Pflege durch uns lieber ist, übernehmen wir das im Rahmen von Service und Pflege.',
      },
      {
        q: 'Betreut ihr auch Kunden außerhalb von Gütersloh?',
        a: 'Ja. Wir sitzen in Gütersloh und arbeiten für Unternehmen in ganz Deutschland. Termine gehen vor Ort in Ostwestfalen genauso wie per Video.',
      },
    ],
  },
  'web-apps': {
    title: 'Web-App entwickeln lassen | Individuelle Software Gütersloh',
    description:
      'Kundenportale, Dashboards und interne Systeme im Browser – individuell entwickelt in Gütersloh, angebunden an Ihre bestehenden Daten und Prozesse.',
    heading: 'Häufige Fragen zu Web-Apps',
    intro: 'Wenn Standardsoftware nicht mehr passt, kommen meistens diese Fragen.',
    faq: [
      {
        q: 'Wann lohnt sich eine eigene Web-App?',
        a: 'Sobald Ihr Ablauf in Tabellen, Mails und Zetteln zerfällt oder eine Standardlösung nur zur Hälfte passt. Dann ist eine eigene Anwendung oft günstiger als der Aufwand, den die Lücken jeden Monat kosten.',
      },
      {
        q: 'Lässt sich unsere bestehende Software anbinden?',
        a: 'In der Regel ja. Wenn ein System eine Schnittstelle hat, verbinden wir es. Wo keine vorhanden ist, finden wir einen sauberen Weg über Import, Export oder Automatisierung.',
      },
      {
        q: 'Wem gehört am Ende der Quellcode?',
        a: 'Das klären wir vor dem Start schriftlich. Sie sollen nicht von uns abhängig sein, sondern mit uns arbeiten, weil die Zusammenarbeit läuft.',
      },
    ],
  },
  apps: {
    title: 'App entwickeln lassen – iOS & Android | Coding Agentur',
    description:
      'Mobile Apps für iOS und Android, entwickelt in Gütersloh: für Kunden, Teams und digitale Services – mit Backend, Push und Zahlungsanbindung.',
    heading: 'Häufige Fragen zur App-Entwicklung',
    intro: 'Bevor eine App entsteht, sind fast immer diese Punkte offen.',
    faq: [
      {
        q: 'Braucht es zwei getrennte Apps für iOS und Android?',
        a: 'Nicht zwingend. Häufig reicht eine gemeinsame Basis für beide Plattformen. Wenn eine App tief ins System eingreift oder maximale Performance braucht, entwickeln wir nativ.',
      },
      {
        q: 'Übernehmt ihr die Veröffentlichung im App Store?',
        a: 'Ja. Wir begleiten die Einreichung im Apple App Store und bei Google Play, inklusive Store-Texten, Bildern und den technischen Anforderungen der Plattformen.',
      },
      {
        q: 'Was passiert nach dem Launch?',
        a: 'Apps brauchen Pflege: neue Betriebssystemversionen, Sicherheitsupdates, kleine Verbesserungen. Wir bleiben ansprechbar und halten die App aktuell.',
      },
    ],
  },
  webshops: {
    title: 'Onlineshop programmieren lassen | Webshop aus Gütersloh',
    description:
      'Individuelle Webshops mit Produktkatalog, Warenkorb, Zahlung und Versand – entwickelt in Gütersloh und angebunden an Ihre Abläufe.',
    heading: 'Häufige Fragen zum Webshop',
    intro: 'Die Punkte, die vor einem Shop-Projekt zuerst geklärt gehören.',
    faq: [
      {
        q: 'Welche Zahlungsarten lassen sich einbinden?',
        a: 'Die üblichen Anbieter für Karte, PayPal, Rechnung oder Lastschrift lassen sich anbinden. Welche sinnvoll sind, hängt von Ihren Kunden und Ihrer Marge ab.',
      },
      {
        q: 'Kann der Shop an unsere Warenwirtschaft andocken?',
        a: 'Ja, wenn Ihr System eine Schnittstelle bietet. Bestellungen, Bestände und Artikel laufen dann automatisch zwischen Shop und Warenwirtschaft hin und her.',
      },
      {
        q: 'Was ist mit den rechtlichen Pflichten im Shop?',
        a: 'Wir setzen die technischen Voraussetzungen um – Widerruf, Preisangaben, Einwilligungen. Die rechtlichen Texte selbst gehören in die Hand einer Anwältin oder eines Anwalts.',
      },
    ],
  },
  kassensysteme: {
    title: 'Kassensystem für Gastronomie & Handel | Coding Agentur',
    description:
      'Kassensysteme nach Ihrem Ablauf: Bestellung, Zahlung, Bon, Artikel und Auswertungen. Individuell entwickelt in Gütersloh, deutschlandweit im Einsatz.',
    heading: 'Häufige Fragen zum Kassensystem',
    intro: 'Kassen sind Alltag. Deshalb kommen diese Fragen immer zuerst.',
    faq: [
      {
        q: 'Für welche Betriebe eignet sich ein eigenes Kassensystem?',
        a: 'Für Gastronomie, Handel und Dienstleister, bei denen die Kasse mehr können muss als kassieren: Tische, Varianten, Filialen, Mitarbeiterrechte oder eine Anbindung an Bestellung und Buchhaltung.',
      },
      {
        q: 'Läuft die Kasse auch ohne Internet weiter?',
        a: 'Das planen wir bewusst ein. Kassen müssen im Zweifel auch dann bedienbar bleiben, wenn die Leitung ausfällt – und synchronisieren, sobald sie wieder da ist.',
      },
      {
        q: 'Wie sieht es mit den gesetzlichen Anforderungen aus?',
        a: 'Kassen in Deutschland unterliegen Aufzeichnungs- und Sicherungspflichten, etwa TSE und Belegausgabe. Wir setzen die technischen Anforderungen gemeinsam mit Ihrem Steuerbüro und einem zertifizierten TSE-Anbieter um.',
      },
      {
        q: 'Kann die Kasse an Website oder App andocken?',
        a: 'Ja. Genau da wird es interessant: Onlinebestellung, Reservierung oder Kundenkarte greifen dann auf dieselben Artikel und Preise zu wie die Kasse im Laden.',
      },
    ],
  },
  integrationen: {
    title: 'API & Schnittstellen programmieren | Coding Agentur',
    description:
      'Systeme verbinden statt doppelt tippen: REST-APIs, Webhooks und Automatisierungen zwischen Shop, CRM, ERP und Buchhaltung – entwickelt in Gütersloh.',
    heading: 'Häufige Fragen zu Schnittstellen',
    intro: 'Wenn Daten zwischen Systemen hängen bleiben, sind es meistens diese Fragen.',
    faq: [
      {
        q: 'Was bringt eine Schnittstelle konkret?',
        a: 'Sie tippen Daten nur noch einmal ein. Bestellungen, Kunden, Rechnungen oder Termine wandern automatisch dorthin, wo sie gebraucht werden – ohne Copy-and-paste und ohne Übertragungsfehler.',
      },
      {
        q: 'Was, wenn ein System keine offene Schnittstelle hat?',
        a: 'Dann suchen wir den nächstbesten Weg: geplante Exporte, Dateiübergaben oder Automatisierung an der Oberfläche. Wir sagen vorher ehrlich, was zuverlässig geht und was nicht.',
      },
      {
        q: 'Wie merken wir, wenn eine Übertragung fehlschlägt?',
        a: 'Wir bauen Protokollierung und Benachrichtigungen ein. Ein Fehler soll auffallen, solange er noch klein ist – nicht erst beim Monatsabschluss.',
      },
    ],
  },
};
