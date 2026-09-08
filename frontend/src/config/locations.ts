export type Location = {
  slug: string;
  city: string;
  inCity: string;
  region: string;
  group: 'Kreis Gütersloh' | 'Ostwestfalen-Lippe' | 'Nordrhein-Westfalen' | 'Deutschland';
  travel: string;
  intro: string;
  situation: string;
  focus: readonly string[];
  faq: readonly { q: string; a: string }[];
};

export const locations: readonly Location[] = [
  {
    slug: 'guetersloh',
    city: 'Gütersloh',
    inCity: 'in Gütersloh',
    region: 'Kreis Gütersloh, Nordrhein-Westfalen',
    group: 'Kreis Gütersloh',
    travel: 'Unser Zuhause – wir sind vor Ort.',
    intro:
      'Gütersloh ist unsere Stadt. Hier sitzen wir, hier kennen wir die Betriebe, und hier sind wir innerhalb einer Viertelstunde bei Ihnen im Laden, in der Werkstatt oder im Restaurant.',
    situation:
      'Zwischen Konzernzentralen und alteingesessenem Handwerk gibt es in Gütersloh eine Lücke: Betriebe, die zu groß für den Homepage-Baukasten und zu klein für eine Konzern-Agentur sind. Genau die bauen wir aus. Vom Terminkalender für die Praxis bis zum Kassensystem mit Filialanbindung.',
    focus: ['Handwerk & Bau', 'Gastronomie', 'Einzelhandel', 'Dienstleister'],
    faq: [
      {
        q: 'Kommt ihr für ein Erstgespräch vorbei?',
        a: 'In Gütersloh und Umgebung sehr gerne persönlich – bei Ihnen im Betrieb, weil wir dort am schnellsten verstehen, wie Ihr Ablauf wirklich aussieht. Das Erstgespräch kostet nichts.',
      },
      {
        q: 'Wie lange dauert eine Website für einen Gütersloher Betrieb?',
        a: 'Das hängt am Umfang und daran, wie schnell Inhalte und Bilder da sind. Kleinere Auftritte sind in wenigen Wochen live, größere Projekte mit Anbindungen brauchen länger. Wir sagen Ihnen vorher, womit Sie rechnen müssen.',
      },
      {
        q: 'Betreut ihr die Seite danach weiter?',
        a: 'Ja. Updates, Sicherheit, neue Inhalte, neue Funktionen – Sie haben eine Nummer und schreiben nicht in ein Ticketsystem.',
      },
    ],
  },
  {
    slug: 'bielefeld',
    city: 'Bielefeld',
    inCity: 'in Bielefeld',
    region: 'Ostwestfalen-Lippe',
    group: 'Ostwestfalen-Lippe',
    travel: 'Rund 20 Minuten von Gütersloh.',
    intro:
      'Bielefeld ist die größte Stadt Ostwestfalens – und der Ort, an dem der Wettbewerb um Sichtbarkeit am härtesten ist. Wer hier bei „Webdesign“ oder „Kassensystem“ gefunden werden will, braucht mehr als eine hübsche Startseite.',
    situation:
      'Universitätsstadt, Handel, Industrie, viele Agenturen. Was in Bielefeld den Unterschied macht, ist Technik, die trägt: schnelle Ladezeiten, saubere Struktur, echte lokale Inhalte. Wir bauen Auftritte, die inhaltlich beantworten, wonach Ihre Kunden tatsächlich suchen – und Systeme, die den Betrieb dahinter mittragen.',
    focus: ['Handel & Filialen', 'Praxen & Kanzleien', 'Gastronomie', 'Dienstleister'],
    faq: [
      {
        q: 'Wie werden wir in Bielefeld besser gefunden?',
        a: 'Mit Seiten, die eine konkrete Frage beantworten, statt allgemein über das Unternehmen zu reden – dazu saubere technische Basis, Ladezeit, strukturierte Daten und ein gepflegter Google-Unternehmenseintrag. Das ist Handwerk, kein Trick.',
      },
      {
        q: 'Arbeitet ihr auch mit Bielefelder Agenturen zusammen?',
        a: 'Ja. Wenn Design oder Marketing schon woanders liegen, übernehmen wir die Entwicklung und Anbindung. Uns ist wichtiger, dass es läuft, als dass alles von uns kommt.',
      },
      {
        q: 'Betreut ihr mehrere Standorte?',
        a: 'Ja – Filialen mit eigenen Öffnungszeiten, Teams und Kassen lassen sich in einem System abbilden, ohne dass jede Filiale ihre eigene Insel wird.',
      },
    ],
  },
  {
    slug: 'paderborn',
    city: 'Paderborn',
    inCity: 'in Paderborn',
    region: 'Kreis Paderborn, Ostwestfalen',
    group: 'Ostwestfalen-Lippe',
    travel: 'Rund 45 Minuten von Gütersloh.',
    intro:
      'Paderborn ist ein IT-Standort mit hohen Erwartungen. Software, die hier überzeugen soll, muss technisch sauber sein – und trotzdem für Menschen bedienbar bleiben, die nicht aus der IT kommen.',
    situation:
      'Viele Betriebe in und um Paderborn haben bereits Systeme im Einsatz: Warenwirtschaft, Buchhaltung, Zeiterfassung. Der Schmerz liegt selten bei „wir brauchen etwas Neues“, sondern bei „unsere Systeme reden nicht miteinander“. Genau da setzen wir an – mit Schnittstellen, Automatisierung und Oberflächen, die den doppelten Tippaufwand beenden.',
    focus: ['Produktion & Zulieferer', 'IT-nahe Dienstleister', 'Handel', 'Handwerk'],
    faq: [
      {
        q: 'Könnt ihr bestehende Systeme anbinden?',
        a: 'Wenn eine Schnittstelle existiert, in der Regel ja. Wo keine da ist, finden wir einen belastbaren Weg über Export, Import oder Automatisierung – und sagen vorher, was zuverlässig funktioniert.',
      },
      {
        q: 'Wir haben eine eigene IT. Passt das?',
        a: 'Sehr gut sogar. Dann sprechen wir direkt mit Ihren Leuten über Datenmodell, Rechte und Betrieb, statt alles durch drei Schichten zu übersetzen.',
      },
      {
        q: 'Wem gehört der Code?',
        a: 'Das klären wir vor Projektstart schriftlich. Sie sollen nicht an uns gebunden sein, weil Sie müssen.',
      },
    ],
  },
  {
    slug: 'rheda-wiedenbrueck',
    city: 'Rheda-Wiedenbrück',
    inCity: 'in Rheda-Wiedenbrück',
    region: 'Kreis Gütersloh',
    group: 'Kreis Gütersloh',
    travel: 'Rund 15 Minuten von Gütersloh.',
    intro:
      'Rheda-Wiedenbrück ist Nachbarschaft. Zwei historische Ortskerne, viel produzierendes Gewerbe, viel Gastronomie – und eine ganze Reihe Betriebe, deren Website älter ist als das aktuelle Smartphone ihrer Kunden.',
    situation:
      'Was hier am häufigsten gebraucht wird: eine Seite, die auf dem Handy sofort das Richtige zeigt – Öffnungszeiten, Speisekarte, Kontakt, Termin. Und im Betrieb ein System, das Bestellung, Zahlung und Beleg ohne Zettelwirtschaft zusammenbringt.',
    focus: ['Gastronomie & Hotellerie', 'Produktion', 'Handwerk', 'Einzelhandel'],
    faq: [
      {
        q: 'Lohnt sich eine neue Website für einen kleinen Betrieb?',
        a: 'Wenn Kunden Sie über das Handy suchen: ja. Entscheidend ist nicht die Größe der Seite, sondern ob in fünf Sekunden klar ist, was Sie anbieten und wie man Sie erreicht.',
      },
      {
        q: 'Könnt ihr Speisekarte oder Termine selbst pflegbar machen?',
        a: 'Ja. Wir binden genau die Bereiche an ein Redaktionssystem an, die Sie wirklich ändern – der Rest bleibt fest und damit stabil.',
      },
      {
        q: 'Kommt ihr für die Einrichtung vorbei?',
        a: 'Bei Nachbarschaft wie Rheda-Wiedenbrück selbstverständlich. Kassen richten wir vor Ort ein und schulen Ihr Team direkt am Gerät.',
      },
    ],
  },
  {
    slug: 'verl',
    city: 'Verl',
    inCity: 'in Verl',
    region: 'Kreis Gütersloh',
    group: 'Kreis Gütersloh',
    travel: 'Rund 15 Minuten von Gütersloh.',
    intro:
      'Verl wächst – und mit der Stadt wachsen die Betriebe. Genau in dieser Phase merkt man, dass Excel-Listen und WhatsApp-Gruppen als Betriebssystem nicht mehr reichen.',
    situation:
      'Typischer Verler Fall: Ein Handwerks- oder Dienstleistungsbetrieb hat mehr Aufträge als Struktur. Aufträge, Termine, Fotos und Rechnungen liegen an vier Orten. Wir bauen die eine Oberfläche, in der das zusammenläuft – mit Rechten, damit nicht jeder alles sieht.',
    focus: ['Handwerk & Bau', 'Logistik', 'Dienstleister', 'Handel'],
    faq: [
      {
        q: 'Brauchen wir eine App oder reicht eine Web-App?',
        a: 'Meistens reicht eine Web-App: läuft im Browser, auf jedem Gerät, ohne Installation und ohne App-Store. Eine echte App lohnt sich, wenn Sie Push, Kamera oder Offline-Betrieb wirklich brauchen.',
      },
      {
        q: 'Können Monteure unterwegs damit arbeiten?',
        a: 'Ja – wir bauen die Ansichten so, dass sie mit einer Hand und Handschuhen bedienbar bleiben, nicht nur am Schreibtisch.',
      },
      {
        q: 'Was kostet so ein System?',
        a: 'Das hängt vom Umfang ab. Wir fangen bewusst klein an: erst der Ablauf, der am meisten Zeit frisst, dann der Rest.',
      },
    ],
  },
  {
    slug: 'halle-westfalen',
    city: 'Halle (Westfalen)',
    inCity: 'in Halle (Westf.)',
    region: 'Kreis Gütersloh',
    group: 'Kreis Gütersloh',
    travel: 'Rund 20 Minuten von Gütersloh.',
    intro:
      'Halle in Westfalen ist klein genug, dass Empfehlungen zählen – und groß genug, dass ein schlechter Online-Auftritt auffällt. Beides spricht für eine Seite, die aussieht wie der Betrieb dahinter.',
    situation:
      'Was wir hier oft sehen: gute Betriebe mit einer Website aus einer anderen Zeit. Der schnellste Hebel ist selten „alles neu“, sondern eine klare Startseite, saubere Leistungsseiten und ein Kontaktweg, der auf dem Handy funktioniert.',
    focus: ['Handwerk', 'Praxen', 'Einzelhandel', 'Gastronomie'],
    faq: [
      {
        q: 'Können wir unsere alte Seite retten?',
        a: 'Manchmal ja. Wir sehen sie uns an und sagen ehrlich, ob sich eine Überarbeitung lohnt oder ob ein Neubau am Ende günstiger ist.',
      },
      {
        q: 'Bleiben unsere Google-Bewertungen erhalten?',
        a: 'Ja, die hängen am Google-Unternehmensprofil, nicht an der Website. Wir sorgen dafür, dass Profil und Seite zusammenpassen.',
      },
      {
        q: 'Was passiert mit unserer bestehenden Adresse?',
        a: 'Die Domain bleibt. Alte Adressen leiten wir sauber weiter, damit weder Kunden noch Google ins Leere laufen.',
      },
    ],
  },
  {
    slug: 'harsewinkel',
    city: 'Harsewinkel',
    inCity: 'in Harsewinkel',
    region: 'Kreis Gütersloh',
    group: 'Kreis Gütersloh',
    travel: 'Rund 20 Minuten von Gütersloh.',
    intro:
      'Harsewinkel ist geprägt von Maschinenbau, Landwirtschaft und Handwerk. Betriebe mit sehr konkreten Abläufen – und dementsprechend wenig Geduld für Software, die den Alltag komplizierter macht.',
    situation:
      'Wir setzen hier meistens dort an, wo Papier durch die Firma wandert: Auftragszettel, Stundenzettel, Lieferscheine. Nicht alles auf einmal digitalisieren, sondern den einen Ablauf, der die meiste Zeit kostet – und den dann richtig.',
    focus: ['Maschinenbau & Zulieferer', 'Landwirtschaft', 'Handwerk', 'Logistik'],
    faq: [
      {
        q: 'Müssen wir alles auf einmal umstellen?',
        a: 'Nein. Wir fangen mit einem Ablauf an, der spürbar Zeit frisst. Wenn der läuft und Ihr Team ihn annimmt, kommt der nächste.',
      },
      {
        q: 'Funktioniert das auch in der Halle ohne gutes WLAN?',
        a: 'Das planen wir ein. Erfassung muss auch dann funktionieren, wenn die Verbindung wackelt, und synchronisieren, sobald sie wieder da ist.',
      },
      {
        q: 'Schult ihr unsere Leute?',
        a: 'Ja, direkt am Gerät und in normaler Sprache. Software, die nur der Chef bedienen kann, hilft niemandem.',
      },
    ],
  },
  {
    slug: 'rietberg',
    city: 'Rietberg',
    inCity: 'in Rietberg',
    region: 'Kreis Gütersloh',
    group: 'Kreis Gütersloh',
    travel: 'Rund 20 Minuten von Gütersloh.',
    intro:
      'Rietberg lebt von Gästen, Handwerk und einem Ortsbild, für das Menschen anreisen. Wer davon profitieren will, muss online genauso einladend wirken wie vor Ort.',
    situation:
      'Für Gastgeber, Läden und Dienstleister zählt hier vor allem eins: gefunden werden, bevor der Besuch geplant ist. Also eine Seite, die auf dem Handy schnell lädt, Öffnungszeiten und Anfahrt sofort zeigt und Anfragen ohne Umwege entgegennimmt.',
    focus: ['Tourismus & Gastronomie', 'Einzelhandel', 'Handwerk', 'Dienstleister'],
    faq: [
      {
        q: 'Können Gäste direkt über die Seite reservieren?',
        a: 'Ja. Wir bauen die Reservierung so ein, dass sie zu Ihrem Ablauf passt – mit Bestätigung per Mail und ohne dass Sie ein weiteres Portal bezahlen müssen.',
      },
      {
        q: 'Wie wichtig ist die Ladezeit wirklich?',
        a: 'Sehr. Wer unterwegs sucht, wartet keine fünf Sekunden. Deshalb bauen wir schlank statt mit Effekt-Ballast.',
      },
      {
        q: 'Braucht es Fotos vom Profi?',
        a: 'Gute Bilder sind der größte sichtbare Unterschied. Wir sagen Ihnen, welche Motive Sie wirklich brauchen, damit sich der Aufwand lohnt.',
      },
    ],
  },
  {
    slug: 'steinhagen',
    city: 'Steinhagen',
    inCity: 'in Steinhagen',
    region: 'Kreis Gütersloh',
    group: 'Kreis Gütersloh',
    travel: 'Rund 20 Minuten von Gütersloh.',
    intro:
      'Steinhagen liegt zwischen Gütersloh und Bielefeld – und viele Betriebe hier bedienen genau diesen Korridor. Ihr Online-Auftritt muss deshalb in beiden Städten gefunden werden, nicht nur am eigenen Ort.',
    situation:
      'Wir bauen dafür Seiten mit klarem regionalem Bezug: Leistungen, Einzugsgebiet und Ansprechpartner so beschrieben, dass Suchmaschinen und Menschen dasselbe verstehen. Dazu ein Kontaktweg, der wirklich ankommt – kein Formular, das im Spam landet.',
    focus: ['Handwerk', 'Dienstleister', 'Handel', 'Praxen'],
    faq: [
      {
        q: 'Können wir in mehreren Orten gefunden werden?',
        a: 'Ja, wenn es dafür echte Inhalte gibt. Eine Seite pro Ort mit demselben Text bringt nichts; eine Seite, die den Ort und Ihr Angebot dort wirklich beschreibt, sehr wohl.',
      },
      {
        q: 'Landen Anfragen zuverlässig bei uns?',
        a: 'Wir richten den Versand über einen echten Maildienst ein, mit Spamschutz und Zustellprüfung – nicht über ein Skript, das irgendwo hängen bleibt.',
      },
      {
        q: 'Bekommen wir eine Bestätigung für Kunden?',
        a: 'Ja, automatisch. Der Kunde weiß sofort, dass die Anfrage angekommen ist.',
      },
    ],
  },
  {
    slug: 'versmold',
    city: 'Versmold',
    inCity: 'in Versmold',
    region: 'Kreis Gütersloh',
    group: 'Kreis Gütersloh',
    travel: 'Rund 30 Minuten von Gütersloh.',
    intro:
      'Versmold ist geprägt von Lebensmittelwirtschaft und Handwerk – Branchen mit Schichten, Chargen und Dokumentationspflichten. Software muss dort belastbar sein, nicht schick.',
    situation:
      'Uns geht es hier zuerst um Nachvollziehbarkeit: Wer hat wann was erfasst, wo liegt der Beleg, was passiert bei einem Fehler. Erst wenn das sitzt, reden wir über Oberflächen. Für den öffentlichen Auftritt gilt dasselbe in einfach: verlässliche Informationen, schnell erreichbar.',
    focus: ['Lebensmittel & Produktion', 'Logistik', 'Handwerk', 'Dienstleister'],
    faq: [
      {
        q: 'Können Abläufe protokolliert werden?',
        a: 'Ja. Wir bauen Protokolle so ein, dass sie im Zweifel belegen, was passiert ist – ohne dass Ihr Team dafür extra klicken muss.',
      },
      {
        q: 'Wie sicher sind unsere Daten?',
        a: 'Betrieb auf europäischen Servern, verschlüsselte Übertragung, Rechte pro Rolle. Details klären wir offen, statt mit Siegeln zu werben.',
      },
      {
        q: 'Arbeitet ihr auch für Betriebe im Schichtbetrieb?',
        a: 'Ja. Dann planen wir Wartungsfenster so, dass sie niemanden ausbremsen.',
      },
    ],
  },
  {
    slug: 'herzebrock-clarholz',
    city: 'Herzebrock-Clarholz',
    inCity: 'in Herzebrock-Clarholz',
    region: 'Kreis Gütersloh',
    group: 'Kreis Gütersloh',
    travel: 'Rund 20 Minuten von Gütersloh.',
    intro:
      'Herzebrock-Clarholz ist zwei Ortsteile, viel Mittelstand und kurze Wege. Genau das erwarten Betriebe hier auch von einem Dienstleister: erreichbar, verbindlich, ohne Agenturtheater.',
    situation:
      'Was wir hier am häufigsten bauen, sind Auftritte für Betriebe mit einem klaren Einzugsgebiet – plus kleine interne Werkzeuge, die den Papierkram reduzieren. Kein Großprojekt, sondern das, was messbar Zeit spart.',
    focus: ['Handwerk & Bau', 'Produktion', 'Handel', 'Gastronomie'],
    faq: [
      {
        q: 'Ist das nicht eine Nummer zu groß für uns?',
        a: 'Nein. Wir skalieren den Umfang, nicht die Qualität. Auch eine kleine Seite darf technisch sauber und schnell sein.',
      },
      {
        q: 'Wie läuft die Zusammenarbeit ab?',
        a: 'Erstgespräch, Angebot, Entwurf, Umsetzung, Livegang – mit einem festen Ansprechpartner, der auch entwickelt.',
      },
      {
        q: 'Was, wenn wir später erweitern wollen?',
        a: 'Dafür bauen wir von Anfang an so, dass sich Dinge ergänzen lassen, ohne alles anzufassen.',
      },
    ],
  },
  {
    slug: 'herford',
    city: 'Herford',
    inCity: 'in Herford',
    region: 'Kreis Herford, Ostwestfalen-Lippe',
    group: 'Ostwestfalen-Lippe',
    travel: 'Rund 35 Minuten von Gütersloh.',
    intro:
      'Herford hat eine lebendige Innenstadt und viele inhabergeführte Betriebe. Deren größtes Online-Problem ist selten das Design – es ist die Auffindbarkeit gegenüber Ketten und Portalen.',
    situation:
      'Dagegen hilft Substanz: eigene Seiten für die einzelnen Leistungen, klare Ortsangaben, ein sauberes Unternehmensprofil und Inhalte, die tatsächlich Fragen beantworten. Dazu Technik, die auf dem Handy in unter zwei Sekunden steht.',
    focus: ['Einzelhandel', 'Gastronomie', 'Handwerk', 'Dienstleister'],
    faq: [
      {
        q: 'Wie kommen wir gegen große Portale an?',
        a: 'Nicht über Masse, sondern über Nähe: konkrete Inhalte zu Ihrem Ort und Ihrem Angebot, die ein Portal so nicht hat – plus ein direkter Weg zur Anfrage ohne Provision.',
      },
      {
        q: 'Brauchen wir einen Onlineshop?',
        a: 'Nur wenn Sie wirklich versenden wollen. Oft bringt eine gute Produkt- und Verfügbarkeitsseite mit Reservierung mehr als ein Shop, den niemand pflegt.',
      },
      {
        q: 'Wie messen wir, ob es wirkt?',
        a: 'Über Anfragen und Anrufe, nicht über Klickzahlen. Wir richten die Seite so ein, dass Sie sehen, woher Kontakte kommen.',
      },
    ],
  },
  {
    slug: 'detmold',
    city: 'Detmold',
    inCity: 'in Detmold',
    region: 'Kreis Lippe',
    group: 'Ostwestfalen-Lippe',
    travel: 'Rund 45 Minuten von Gütersloh.',
    intro:
      'Detmold verbindet Hochschule, Tourismus und traditionsreiches Handwerk. Drei Welten mit sehr unterschiedlichen Anforderungen an einen digitalen Auftritt – und genau deshalb selten mit Standardlösungen gut bedient.',
    situation:
      'Für Gastgeber zählt Sichtbarkeit vor der Anreise, für Handwerk die Anfrage aus der Region, für Bildungsnahe Einrichtungen Struktur und Barrierefreiheit. Wir bauen jeweils das, was die Zielgruppe braucht, statt eine Vorlage über alles zu legen.',
    focus: ['Tourismus & Kultur', 'Handwerk', 'Bildung & Verbände', 'Dienstleister'],
    faq: [
      {
        q: 'Achtet ihr auf Barrierefreiheit?',
        a: 'Ja, standardmäßig: Kontraste, Tastaturbedienung, sinnvolle Beschriftungen. Für öffentliche Stellen und größere Anbieter ist das inzwischen auch rechtlich relevant.',
      },
      {
        q: 'Können wir mehrsprachig auftreten?',
        a: 'Ja. Wir planen das von Anfang an ein, damit nicht später alles doppelt gebaut werden muss.',
      },
      {
        q: 'Wie weit fahrt ihr für Termine?',
        a: 'Nach Lippe kommen wir für Projekttermine gerne. Vieles klären wir aber ohnehin schneller per Video.',
      },
    ],
  },
  {
    slug: 'lippstadt',
    city: 'Lippstadt',
    inCity: 'in Lippstadt',
    region: 'Kreis Soest',
    group: 'Ostwestfalen-Lippe',
    travel: 'Rund 40 Minuten von Gütersloh.',
    intro:
      'Lippstadt ist Industriestandort mit starkem Mittelstand. Hier trifft man häufig auf gewachsene IT – viele Insellösungen, die einzeln funktionieren und zusammen Reibung erzeugen.',
    situation:
      'Unsere Arbeit beginnt in solchen Fällen mit Zuhören und Aufzeichnen: Welche Daten entstehen wo, wer braucht sie wann, wo wird abgetippt. Daraus wird eine Schnittstelle oder eine schlanke Anwendung – nicht ein neues System, das alles ersetzen will.',
    focus: ['Industrie & Zulieferer', 'Handwerk', 'Handel', 'Dienstleister'],
    faq: [
      {
        q: 'Ersetzt ihr unsere bestehende Software?',
        a: 'Nur wenn das wirklich der günstigste Weg ist. Häufig ist es besser, vorhandene Systeme zu verbinden, als sie abzulösen.',
      },
      {
        q: 'Wie lange dauert eine Schnittstelle?',
        a: 'Von wenigen Tagen bis zu mehreren Wochen – abhängig davon, wie gut die beteiligten Systeme dokumentiert sind. Wir prüfen das vorher.',
      },
      {
        q: 'Bekommen wir eine Dokumentation?',
        a: 'Ja. Sie sollen im Zweifel auch mit jemand anderem weiterarbeiten können.',
      },
    ],
  },
  {
    slug: 'warendorf',
    city: 'Warendorf',
    inCity: 'in Warendorf',
    region: 'Kreis Warendorf, Münsterland',
    group: 'Nordrhein-Westfalen',
    travel: 'Rund 35 Minuten von Gütersloh.',
    intro:
      'Warendorf ist Münsterland: Handwerk, Pferdesport, Gastronomie und ein Stadtbild, das Gäste anzieht. Digitale Auftritte müssen hier vor allem eines – Vertrauen transportieren.',
    situation:
      'Was das praktisch heißt: echte Bilder statt Stockfotos, klare Preise oder wenigstens klare Rahmen, erreichbare Ansprechpartner. Technisch dazu eine Seite, die auch am Sonntagabend auf dem Handy funktioniert, wenn jemand nach Ihnen sucht.',
    focus: ['Gastronomie & Hotellerie', 'Handwerk', 'Einzelhandel', 'Freizeit'],
    faq: [
      {
        q: 'Können wir Termine oder Tische online vergeben?',
        a: 'Ja. Wir bauen die Vergabe passend zu Ihrem Ablauf – inklusive Sperrzeiten und Bestätigung.',
      },
      {
        q: 'Was kostet die laufende Betreuung?',
        a: 'Das richtet sich nach Umfang und Reaktionszeit. Wir schnüren das so, dass es planbar bleibt.',
      },
      {
        q: 'Können wir klein anfangen?',
        a: 'Ja, und das empfehlen wir sogar. Erst das, was Anfragen bringt – Ausbau kommt, wenn es sich trägt.',
      },
    ],
  },
  {
    slug: 'osnabrueck',
    city: 'Osnabrück',
    inCity: 'in Osnabrück',
    region: 'Niedersachsen, Grenze zu Nordrhein-Westfalen',
    group: 'Deutschland',
    travel: 'Rund 50 Minuten von Gütersloh.',
    intro:
      'Osnabrück liegt für uns knapp hinter der Landesgrenze und trotzdem im Alltag: gute Verbindungen, ähnliche Betriebsstrukturen, viele Kunden, die zwischen beiden Regionen arbeiten.',
    situation:
      'Wir bauen hier vor allem für Betriebe, die über die Grenze hinweg tätig sind – mit Auftritten, die in beiden Regionen gefunden werden, und Systemen, die mehrere Standorte oder Teams sauber abbilden.',
    focus: ['Handel & Logistik', 'Dienstleister', 'Gastronomie', 'Handwerk'],
    faq: [
      {
        q: 'Arbeitet ihr auch außerhalb von NRW?',
        a: 'Ja, deutschlandweit. Der Sitz spielt für die Zusammenarbeit kaum eine Rolle – wichtig ist, dass jemand erreichbar ist, der das Projekt kennt.',
      },
      {
        q: 'Wie oft sehen wir uns?',
        a: 'So oft es nötig ist. In der Regel Videotermine, für Kick-off und Livegang gerne persönlich.',
      },
      {
        q: 'Können wir in zwei Regionen ranken?',
        a: 'Ja, mit eigenen Inhalten je Region. Ein doppelter Text mit getauschtem Ortsnamen funktioniert nicht.',
      },
    ],
  },
  {
    slug: 'muenster',
    city: 'Münster',
    inCity: 'in Münster',
    region: 'Münsterland, Nordrhein-Westfalen',
    group: 'Nordrhein-Westfalen',
    travel: 'Rund 60 Minuten von Gütersloh.',
    intro:
      'Münster ist Universitäts- und Dienstleistungsstadt mit hohem Anspruch an Gestaltung. Gleichzeitig entscheidet auch hier am Ende die Technik darüber, ob eine Seite Anfragen bringt.',
    situation:
      'Für Kanzleien, Praxen und Agenturen bauen wir Auftritte, die ruhig und hochwertig wirken und trotzdem messbar arbeiten: schnelle Ladezeit, klare Wege zur Anfrage, saubere Struktur für Suchmaschinen. Für Betriebe mit Verkauf kommt die Kasse dazu.',
    focus: ['Kanzleien & Praxen', 'Agenturen & Beratung', 'Einzelhandel', 'Gastronomie'],
    faq: [
      {
        q: 'Können wir das Design mitbestimmen?',
        a: 'Selbstverständlich. Wir zeigen Entwürfe früh und ändern lieber am Entwurf als am fertigen Code.',
      },
      {
        q: 'Übernehmt ihr auch nur die Entwicklung?',
        a: 'Ja. Wenn Design oder Text schon stehen, setzen wir das sauber um.',
      },
      {
        q: 'Wie handhabt ihr Datenschutz?',
        a: 'Datensparsam: eigene Schriftarten, kein unnötiges Tracking, Einwilligung nur da, wo sie wirklich nötig ist.',
      },
    ],
  },
  {
    slug: 'dortmund',
    city: 'Dortmund',
    inCity: 'in Dortmund',
    region: 'Ruhrgebiet, Nordrhein-Westfalen',
    group: 'Nordrhein-Westfalen',
    travel: 'Rund 90 Minuten – Termine per Video, Kick-off vor Ort.',
    intro:
      'Dortmund hat den Strukturwandel hinter sich gebracht wie kaum eine zweite Stadt: aus Kohle und Stahl wurde Logistik, Technologie und ein sehr breiter Dienstleistungssektor. Digital ist der Nachholbedarf trotzdem groß – vor allem bei den vielen inhabergeführten Betrieben zwischen den Leuchttürmen.',
    situation:
      'Wir arbeiten hier vor allem für Betriebe, die im Alltag längst digital arbeiten müssten, es aber mit Insellösungen tun. Statt eines Großprojekts bauen wir das, was zuerst wehtut: die Auftragsübersicht, den Terminkalender, die Kasse. Der Rest wächst daran an.',
    focus: ['Logistik & Handel', 'Handwerk & Bau', 'Gastronomie', 'Dienstleister'],
    faq: [
      {
        q: 'Arbeitet ihr auch für Betriebe im Ruhrgebiet?',
        a: 'Ja. Der Sitz spielt für die Zusammenarbeit kaum eine Rolle – entscheidend ist, dass Ihr Ansprechpartner das Projekt kennt und erreichbar ist. Für Kick-off und Livegang kommen wir gerne vorbei.',
      },
      {
        q: 'Wie läuft die Abstimmung über die Entfernung?',
        a: 'Kurze Videotermine statt langer Meetings, dazwischen ein fester Kanal für Rückfragen. Sie sehen früh Entwürfe und Zwischenstände, nicht erst am Ende.',
      },
      {
        q: 'Können wir mehrere Filialen abbilden?',
        a: 'Ja – mit eigenen Öffnungszeiten, Teams, Preisen und Auswertungen pro Standort, aber einem gemeinsamen Datenbestand.',
      },
    ],
  },
  {
    slug: 'koeln',
    city: 'Köln',
    inCity: 'in Köln',
    region: 'Rheinland, Nordrhein-Westfalen',
    group: 'Nordrhein-Westfalen',
    travel: 'Rund 2 Stunden – Zusammenarbeit remote, Termine nach Absprache.',
    intro:
      'Köln ist Medien-, Handels- und Gastronomiestadt in einem. Entsprechend voll ist der Markt: Wer hier bei „Website erstellen lassen“ gefunden werden will, konkurriert mit hunderten Anbietern – und gewinnt nur mit Substanz statt mit Behauptungen.',
    situation:
      'Für Kölner Betriebe zählt am Ende Umsatz, nicht Design-Preise. Wir bauen Auftritte, bei denen der Weg von der Suche zur Anfrage kurz ist, und dahinter Systeme für Bestellung, Reservierung und Zahlung, die auch am Wochenende halten, wenn es voll wird.',
    focus: ['Gastronomie & Events', 'Handel', 'Medien & Kreative', 'Dienstleister'],
    faq: [
      {
        q: 'Wie hebt man sich in einem so vollen Markt ab?',
        a: 'Über Konkretheit: echte Bilder, klare Leistungen, ehrliche Preisrahmen und Seiten, die die Fragen Ihrer Kunden wirklich beantworten. Das schlägt austauschbare Agentursprache.',
      },
      {
        q: 'Haltet ihr auch Lastspitzen aus?',
        a: 'Ja. Statische Auslieferung über ein Content-Netzwerk verkraftet auch einen plötzlichen Ansturm, ohne dass die Seite einbricht.',
      },
      {
        q: 'Könnt ihr Reservierung und Bestellung verbinden?',
        a: 'Genau dafür lohnt sich eigene Software: Tisch, Bestellung, Kasse und Auswertung greifen auf dieselben Daten zu, statt in drei Portalen zu liegen.',
      },
    ],
  },
  {
    slug: 'duesseldorf',
    city: 'Düsseldorf',
    inCity: 'in Düsseldorf',
    region: 'Rheinland, Nordrhein-Westfalen',
    group: 'Nordrhein-Westfalen',
    travel: 'Rund 2 Stunden – Termine per Video, Vor-Ort-Termine planbar.',
    intro:
      'Düsseldorf ist Mode, Beratung, Handel und Landeshauptstadt. Der Anspruch an Gestaltung ist hier hoch – und wird trotzdem oft von Seiten eingelöst, die schön aussehen und langsam laden.',
    situation:
      'Unsere Arbeit setzt genau dazwischen an: ein Auftritt, der hochwertig wirkt und trotzdem in unter zwei Sekunden steht, weil er nicht aus zwölf Fremd-Skripten besteht. Dazu Systeme für Termin, Bestellung oder Kundenbereich, die den gleichen Anspruch erfüllen.',
    focus: ['Handel & Mode', 'Beratung & Kanzleien', 'Gastronomie', 'Gesundheit'],
    faq: [
      {
        q: 'Bekommen wir ein individuelles Design?',
        a: 'Ja. Wir arbeiten nicht mit gekauften Vorlagen. Entwürfe zeigen wir früh, geändert wird am Entwurf – nicht am fertigen Code.',
      },
      {
        q: 'Wie schnell wird die Seite?',
        a: 'Wir bauen statisch und ohne unnötige Fremd-Skripte. Ziel sind Ladezeiten deutlich unter zwei Sekunden, auch mobil.',
      },
      {
        q: 'Ist die Seite datenschutzkonform?',
        a: 'Wir liefern Schriften selbst aus, verzichten auf unnötiges Tracking und holen Einwilligung nur da ein, wo sie rechtlich nötig ist.',
      },
    ],
  },
  {
    slug: 'essen',
    city: 'Essen',
    inCity: 'in Essen',
    region: 'Ruhrgebiet, Nordrhein-Westfalen',
    group: 'Nordrhein-Westfalen',
    travel: 'Rund 105 Minuten – überwiegend remote, Termine nach Absprache.',
    intro:
      'Essen verbindet Konzernzentralen mit einem sehr dichten Mittelstand. Für kleinere Betriebe heißt das: Sie konkurrieren online mit Auftritten, hinter denen ganze Marketingabteilungen stehen.',
    situation:
      'Dagegen hilft kein größeres Budget, sondern eine klarere Seite. Wir bauen Auftritte, die genau eine Sache gut machen – Anfragen erzeugen – und verzichten auf alles, was davon ablenkt. Im Betrieb dahinter dann die Systeme, die den Mehraufwand auffangen.',
    focus: ['Handwerk & Bau', 'Energie & Technik', 'Handel', 'Dienstleister'],
    faq: [
      {
        q: 'Wir sind ein kleiner Betrieb – lohnt sich das?',
        a: 'Gerade dann. Eine klare, schnelle Seite mit den richtigen Inhalten schlägt einen aufgeblasenen Auftritt, den niemand pflegt.',
      },
      {
        q: 'Was, wenn wir keine guten Fotos haben?',
        a: 'Wir sagen Ihnen, welche Motive wirklich gebraucht werden, und bauen das Layout so, dass wenige gute Bilder reichen.',
      },
      {
        q: 'Können wir später erweitern?',
        a: 'Ja, dafür bauen wir von Anfang an so, dass sich Bereiche ergänzen lassen, ohne alles neu zu machen.',
      },
    ],
  },
  {
    slug: 'duisburg',
    city: 'Duisburg',
    inCity: 'in Duisburg',
    region: 'Ruhrgebiet, Nordrhein-Westfalen',
    group: 'Nordrhein-Westfalen',
    travel: 'Rund 2 Stunden – Zusammenarbeit remote.',
    intro:
      'Duisburg lebt von Logistik, Industrie und einem der größten Binnenhäfen Europas. Wo Waren bewegt werden, entstehen Daten – und genau dort steckt der größte ungenutzte Hebel.',
    situation:
      'Für Logistik- und Industriebetriebe bauen wir vor allem Werkzeuge: Auftragsverfolgung, Statusmeldungen, Fahrer- und Lageransichten, Schnittstellen zu bestehenden Systemen. Die Website ist in dem Fall der kleinere Teil – wichtig, aber nicht der Kern.',
    focus: ['Logistik & Hafen', 'Industrie', 'Handwerk', 'Handel'],
    faq: [
      {
        q: 'Könnt ihr Statusmeldungen automatisieren?',
        a: 'Ja. Wenn die Daten irgendwo entstehen, lassen sie sich weitergeben – per Schnittstelle, Webhook oder geplantem Abgleich.',
      },
      {
        q: 'Funktioniert das auch auf dem Hof ohne gutes Netz?',
        a: 'Das planen wir ein. Erfassung muss auch bei wackliger Verbindung funktionieren und später synchronisieren.',
      },
      {
        q: 'Wie sicher sind die Daten?',
        a: 'Betrieb auf europäischen Servern, verschlüsselte Übertragung, Rechte pro Rolle und Protokollierung, wer was geändert hat.',
      },
    ],
  },
  {
    slug: 'bochum',
    city: 'Bochum',
    inCity: 'in Bochum',
    region: 'Ruhrgebiet, Nordrhein-Westfalen',
    group: 'Nordrhein-Westfalen',
    travel: 'Rund 100 Minuten – überwiegend remote.',
    intro:
      'Bochum ist Hochschulstadt mit lebendiger Gründerszene und gleichzeitig sehr bodenständigem Handwerk. Zwei Welten, die selten dieselbe Software brauchen.',
    situation:
      'Für junge Unternehmen bauen wir schlanke erste Versionen, mit denen sich eine Idee testen lässt, ohne dass gleich sechsstellig investiert wird. Für gewachsene Betriebe das Gegenteil: robuste Werkzeuge, die den bestehenden Ablauf abbilden statt ihn umzuwerfen.',
    focus: ['Gründer & Startups', 'Handwerk', 'Handel', 'Gesundheit'],
    faq: [
      {
        q: 'Baut ihr auch eine erste Testversion?',
        a: 'Ja. Erste Version mit den Funktionen, die wirklich getestet werden müssen – sauber genug, dass man darauf aufbauen kann.',
      },
      {
        q: 'Wie schnell kann es losgehen?',
        a: 'Nach dem Erstgespräch bekommen Sie ein Angebot mit Zeitrahmen. Kleinere Projekte starten oft innerhalb weniger Wochen.',
      },
      {
        q: 'Was kostet die laufende Betreuung?',
        a: 'Das richtet sich nach Umfang und Reaktionszeit. Wir machen es planbar statt nach Aufwand ins Blaue.',
      },
    ],
  },
  {
    slug: 'wuppertal',
    city: 'Wuppertal',
    inCity: 'in Wuppertal',
    region: 'Bergisches Land, Nordrhein-Westfalen',
    group: 'Nordrhein-Westfalen',
    travel: 'Rund 2 Stunden – Zusammenarbeit remote.',
    intro:
      'Wuppertal ist bergisch geprägt: viele spezialisierte Familienunternehmen, oft mit Kunden weit über die Stadt hinaus. Ihre Website muss deshalb weniger den Ort verkaufen als die Kompetenz.',
    situation:
      'Wir bauen für solche Betriebe Auftritte, die technische Tiefe zeigen, ohne unverständlich zu werden – Referenzen, Verfahren, Materialien, Ansprechpartner. Dazu Portale, über die Kunden Dokumente, Zeichnungen oder Bestellungen abrufen können.',
    focus: ['Spezialfertigung', 'Handwerk', 'B2B-Dienstleister', 'Handel'],
    faq: [
      {
        q: 'Können Kunden Dokumente abrufen?',
        a: 'Ja, über einen geschützten Bereich mit Login und Rechten – sinnvoller als Anhänge per Mail hin und her zu schicken.',
      },
      {
        q: 'Bringt Englisch etwas?',
        a: 'Wenn Sie über die Region hinaus verkaufen, ja. Wir planen Mehrsprachigkeit von Anfang an ein, damit nichts doppelt gebaut werden muss.',
      },
      {
        q: 'Wie zeigen wir technische Kompetenz online?',
        a: 'Mit konkreten Projektbeispielen statt Adjektiven. Wir helfen dabei, aus Ihrem Alltag zeigbare Inhalte zu machen.',
      },
    ],
  },
  {
    slug: 'bonn',
    city: 'Bonn',
    inCity: 'in Bonn',
    region: 'Rheinland, Nordrhein-Westfalen',
    group: 'Nordrhein-Westfalen',
    travel: 'Rund 2,5 Stunden – Zusammenarbeit remote.',
    intro:
      'Bonn ist geprägt von Bundesbehörden, Verbänden, Wissenschaft und einem sehr serviceorientierten Mittelstand. Dort gelten andere Maßstäbe: Barrierefreiheit, Nachvollziehbarkeit und Datenschutz sind keine Kür.',
    situation:
      'Wir bauen entsprechend: zugängliche Oberflächen, die sich mit der Tastatur bedienen lassen, saubere Dokumentenstrukturen und Formulare, die auch mit Screenreader funktionieren. Technisch datensparsam, damit die Einwilligungsfrage klein bleibt.',
    focus: ['Verbände & Vereine', 'Bildung & Wissenschaft', 'Dienstleister', 'Gesundheit'],
    faq: [
      {
        q: 'Erfüllt ihr Anforderungen an Barrierefreiheit?',
        a: 'Wir bauen standardmäßig zugänglich: Kontraste, Tastaturbedienung, sinnvolle Beschriftungen, Fokus-Reihenfolge. Für gesetzlich verpflichtete Stellen prüfen wir gezielt gegen die Anforderungen.',
      },
      {
        q: 'Können wir Mitgliederbereiche abbilden?',
        a: 'Ja – mit Rollen, Sichtbarkeiten und Dokumenten, die nur bestimmte Gruppen sehen.',
      },
      {
        q: 'Wo liegen die Daten?',
        a: 'Auf Servern in Europa. Welche Dienstleister beteiligt sind, steht offen in der Datenschutzerklärung.',
      },
    ],
  },
  {
    slug: 'aachen',
    city: 'Aachen',
    inCity: 'in Aachen',
    region: 'Städteregion Aachen, Nordrhein-Westfalen',
    group: 'Nordrhein-Westfalen',
    travel: 'Rund 2,5 Stunden – Zusammenarbeit remote.',
    intro:
      'Aachen ist Technikstadt und Grenzstadt zugleich: Hochschulumfeld, viel Ingenieurwesen und Kundschaft, die auch aus Belgien und den Niederlanden kommt.',
    situation:
      'Für Betriebe hier lohnt sich Mehrsprachigkeit oft früher als anderswo, und technische Zielgruppen erwarten Substanz statt Marketing. Wir bauen Auftritte, die beides können – und Anwendungen, die auch von Fachleuten ernst genommen werden.',
    focus: ['Ingenieurwesen', 'Hochschulnahe Unternehmen', 'Handwerk', 'Handel'],
    faq: [
      {
        q: 'Lohnt sich Niederländisch oder Französisch?',
        a: 'Wenn Sie über die Grenze verkaufen, ja. Wir bauen die Struktur so, dass weitere Sprachen später ohne Umbau dazukommen.',
      },
      {
        q: 'Könnt ihr technische Produkte gut darstellen?',
        a: 'Ja – mit Datenblättern, Varianten, Filtern und Vergleichsansichten statt bloßer Bildergalerie.',
      },
      {
        q: 'Arbeitet ihr mit Hochschulausgründungen?',
        a: 'Gerne. Dann bauen wir bewusst klein und erweiterbar, damit das Budget in die Idee fließt und nicht in Ballast.',
      },
    ],
  },
  {
    slug: 'moenchengladbach',
    city: 'Mönchengladbach',
    inCity: 'in Mönchengladbach',
    region: 'Niederrhein, Nordrhein-Westfalen',
    group: 'Nordrhein-Westfalen',
    travel: 'Rund 2 Stunden – Zusammenarbeit remote.',
    intro:
      'Mönchengladbach hat eine lange Textil- und Handelsgeschichte und heute einen breiten Mix aus Logistik, Handel und Dienstleistung. Viele Betriebe verkaufen längst online – nur selten über eigene Kanäle.',
    situation:
      'Genau da lohnt sich der Blick: Wer nur über Marktplätze verkauft, zahlt Provision und kennt seine Kunden nicht. Wir bauen eigene Shops und Bestellstrecken, die neben dem Marktplatz laufen und die Marge im Haus halten.',
    focus: ['Handel & Shops', 'Logistik', 'Textil & Mode', 'Dienstleister'],
    faq: [
      {
        q: 'Lohnt sich ein eigener Shop neben den Marktplätzen?',
        a: 'Fast immer, sobald ein Teil der Kunden wiederkommt. Ohne Provision und mit eigenem Kundenkontakt rechnet sich das schnell.',
      },
      {
        q: 'Könnt ihr Bestände synchron halten?',
        a: 'Ja, per Anbindung an Ihre Warenwirtschaft – damit ein Artikel nicht doppelt verkauft wird.',
      },
      {
        q: 'Wie sieht es mit Versand und Retouren aus?',
        a: 'Beides binden wir an: Label-Erstellung, Statusmails und ein einfacher Retourenweg für den Kunden.',
      },
    ],
  },
  {
    slug: 'hamm',
    city: 'Hamm',
    inCity: 'in Hamm',
    region: 'Nordrhein-Westfalen',
    group: 'Nordrhein-Westfalen',
    travel: 'Rund 60 Minuten von Gütersloh.',
    intro:
      'Hamm liegt für uns noch im gut erreichbaren Umkreis. Logistik, Gesundheitswirtschaft und Handwerk prägen die Stadt – Branchen mit vielen Terminen, Schichten und Nachweisen.',
    situation:
      'Wo viel geplant und dokumentiert wird, sparen kleine Werkzeuge viel Zeit: Terminvergabe ohne Telefonschleife, digitale Nachweise statt Papier, Übersichten, die auch die Vertretung versteht. Genau solche Bausteine bauen wir – und verbinden sie mit dem, was schon da ist.',
    focus: ['Gesundheit & Pflege', 'Logistik', 'Handwerk', 'Handel'],
    faq: [
      {
        q: 'Können Kunden selbst Termine buchen?',
        a: 'Ja, mit Ihren Regeln: Zeitfenster, Vorlaufzeiten, Sperrzeiten und Bestätigung per Mail.',
      },
      {
        q: 'Kommt ihr für Termine nach Hamm?',
        a: 'Ja, das ist eine gut machbare Strecke – gerade für Kick-off und Einführung vor Ort.',
      },
      {
        q: 'Wie steht es um sensible Daten?',
        a: 'Datensparsam bauen, Rechte sauber trennen, verschlüsselt übertragen. Was nicht erhoben wird, kann auch nicht abfließen.',
      },
    ],
  },
  {
    slug: 'siegen',
    city: 'Siegen',
    inCity: 'in Siegen',
    region: 'Südwestfalen, Nordrhein-Westfalen',
    group: 'Nordrhein-Westfalen',
    travel: 'Rund 2 Stunden – Zusammenarbeit remote.',
    intro:
      'Südwestfalen ist eine der stärksten Industrieregionen Deutschlands, mit vielen hoch spezialisierten Familienunternehmen. Nach außen treten die wenigsten so auf, wie sie tatsächlich arbeiten.',
    situation:
      'Wir bauen für solche Betriebe Auftritte, die Fertigungstiefe und Verlässlichkeit sichtbar machen – und intern Anwendungen, die Angebote, Aufträge und Nachweise zusammenführen, statt sie über Ordner zu verteilen.',
    focus: ['Maschinenbau & Metall', 'Zulieferer', 'Handwerk', 'B2B-Dienstleister'],
    faq: [
      {
        q: 'Wir verkaufen B2B – bringt eine Website überhaupt etwas?',
        a: 'Ja, aber anders: Sie überzeugt Einkäufer, die vorher recherchieren, und Bewerber. Beides entscheidet oft mehr als der erste Kontakt.',
      },
      {
        q: 'Könnt ihr auch Karriereseiten bauen?',
        a: 'Ja. In Ihrer Region ist die Fachkräftesuche oft der stärkere Grund für einen guten Auftritt als Neukundengewinnung.',
      },
      {
        q: 'Wie tief geht die Anbindung an unsere Systeme?',
        a: 'So tief, wie es sich rechnet. Wir fangen bei dem Datenfluss an, der am meisten Handarbeit kostet.',
      },
    ],
  },
  {
    slug: 'krefeld',
    city: 'Krefeld',
    inCity: 'in Krefeld',
    region: 'Niederrhein, Nordrhein-Westfalen',
    group: 'Nordrhein-Westfalen',
    travel: 'Rund 2 Stunden – Zusammenarbeit remote.',
    intro:
      'Krefeld hat eine industrielle Tradition und einen bodenständigen Mittelstand. Der Online-Auftritt hinkt dem tatsächlichen Können vieler Betriebe hinterher – das ist die häufigste Diagnose.',
    situation:
      'Der schnellste Hebel ist selten ein Relaunch um des Relaunches willen, sondern Klarheit: Was bieten Sie, für wen, und wie kommt jemand in Kontakt. Darauf bauen wir auf und ergänzen erst danach Funktionen wie Shop, Portal oder Kasse.',
    focus: ['Industrie & Chemie', 'Handel', 'Handwerk', 'Dienstleister'],
    faq: [
      {
        q: 'Was bringt uns ein Relaunch konkret?',
        a: 'Mehr Anfragen, weniger Rückfragen und eine Seite, die auch auf dem Handy funktioniert. Was er nicht bringt: Kunden, die Sie ohnehin nicht suchen.',
      },
      { q: 'Können wir schrittweise vorgehen?', a: 'Ja. Erst die Seiten, die Anfragen bringen, danach der Rest.' },
      {
        q: 'Übernehmt ihr auch Hosting und Wartung?',
        a: 'Auf Wunsch komplett – inklusive Updates, Sicherung und Erreichbarkeitsprüfung.',
      },
    ],
  },
  {
    slug: 'hamburg',
    city: 'Hamburg',
    inCity: 'in Hamburg',
    region: 'Freie und Hansestadt Hamburg',
    group: 'Deutschland',
    travel: 'Rund 3 Stunden – Zusammenarbeit remote, Termine planbar.',
    intro:
      'Hamburg ist Handel, Hafen und Medien – und ein Markt, in dem Agenturpreise deutlich anziehen. Für viele Betriebe ist das der Grund, warum wir überhaupt gefragt werden.',
    situation:
      'Wir liefern das gleiche technische Niveau aus Ostwestfalen, mit einem Team, das man direkt erreicht. Die Zusammenarbeit läuft über Video und einen festen Kanal; für Kick-off und Livegang kommen wir bei Bedarf hoch.',
    focus: ['Handel & E-Commerce', 'Logistik', 'Medien & Agenturen', 'Gastronomie'],
    faq: [
      {
        q: 'Funktioniert Zusammenarbeit über die Entfernung?',
        a: 'Ja, wenn sie strukturiert ist: feste Ansprechpartner, kurze Videotermine, früh sichtbare Zwischenstände. Genau so arbeiten wir ohnehin.',
      },
      {
        q: 'Warum sollten wir nicht lokal beauftragen?',
        a: 'Sollten Sie, wenn es passt. Der Unterschied bei uns ist, dass Sie mit den Entwicklern selbst sprechen – und nicht mit einer Zwischenschicht.',
      },
      {
        q: 'Wie sieht es mit größeren Shops aus?',
        a: 'Machbar. Entscheidend sind Sortimentsgröße, Varianten und Anbindungen – das klären wir vor dem Angebot.',
      },
    ],
  },
  {
    slug: 'berlin',
    city: 'Berlin',
    inCity: 'in Berlin',
    region: 'Berlin',
    group: 'Deutschland',
    travel: 'Rund 4 Stunden – Zusammenarbeit remote.',
    intro:
      'Berlin ist der vielfältigste Markt des Landes: vom Kiezladen bis zum Technologieunternehmen. Genauso vielfältig ist die Qualität dessen, was online steht.',
    situation:
      'Wir bauen hier für beide Enden: schnelle, ehrliche Auftritte für inhabergeführte Betriebe – und robuste Anwendungen für Unternehmen, die aus einer Bastellösung herausgewachsen sind und eine tragfähige Basis brauchen.',
    focus: ['Gastronomie & Handel', 'Startups & Technologie', 'Dienstleister', 'Kultur'],
    faq: [
      {
        q: 'Könnt ihr ein bestehendes Projekt übernehmen?',
        a: 'Oft ja. Wir sehen uns den Stand an und sagen ehrlich, ob Weiterbauen oder Neubau günstiger ist.',
      },
      {
        q: 'Wie schnell reagiert ihr im Betrieb?',
        a: 'Das vereinbaren wir vorher verbindlich, statt es dem Zufall zu überlassen.',
      },
      { q: 'Arbeitet ihr auch mit internen Teams?', a: 'Ja. Wir übernehmen Teile und übergeben sauber dokumentiert.' },
    ],
  },
  {
    slug: 'muenchen',
    city: 'München',
    inCity: 'in München',
    region: 'Bayern',
    group: 'Deutschland',
    travel: 'Rund 6 Stunden – Zusammenarbeit remote.',
    intro:
      'München ist ein anspruchsvoller und teurer Markt. Wer hier eine individuelle Anwendung beauftragt, vergleicht Angebote sehr genau – und stellt fest, dass Qualität nicht an der Postleitzahl hängt.',
    situation:
      'Wir bringen das mit, was in solchen Projekten zählt: saubere Architektur, verständliche Dokumentation und Ansprechpartner, die selbst entwickeln. Was wir nicht mitbringen, sind Overhead-Kosten für Standort und Verwaltung.',
    focus: ['Technologie & Beratung', 'Handel', 'Gastronomie & Hotellerie', 'Gesundheit'],
    faq: [
      {
        q: 'Wie stellt ihr Qualität sicher?',
        a: 'Typprüfung, Tests für die kritischen Abläufe, Review im Vier-Augen-Prinzip und ein Build, der bei Fehlern nicht durchgeht.',
      },
      { q: 'Bekommen wir eine Dokumentation?', a: 'Ja – damit Sie im Zweifel auch mit anderen weiterarbeiten können.' },
      {
        q: 'Wie läuft die Abnahme?',
        a: 'In Schritten, an denen Sie den Fortschritt selbst sehen und testen, nicht als große Überraschung am Ende.',
      },
    ],
  },
  {
    slug: 'frankfurt',
    city: 'Frankfurt am Main',
    inCity: 'in Frankfurt',
    region: 'Hessen',
    group: 'Deutschland',
    travel: 'Rund 3 Stunden – Zusammenarbeit remote.',
    intro:
      'Frankfurt ist Finanz-, Messe- und Logistikstandort. Wo Geld und Daten zusammenkommen, wird zuerst nach Sicherheit und Nachvollziehbarkeit gefragt – und erst danach nach Design.',
    situation:
      'Wir bauen entsprechend defensiv: Rechte serverseitig geprüft, Eingaben validiert, Protokolle für kritische Vorgänge, Datensparsamkeit als Grundhaltung. Das ist unaufgeregt, aber genau das, was in diesem Umfeld gebraucht wird.',
    focus: ['Finanz- & Beratungsdienstleister', 'Logistik', 'Gastronomie', 'Handel'],
    faq: [
      {
        q: 'Wie geht ihr mit sensiblen Daten um?',
        a: 'So wenig wie möglich erheben, verschlüsselt übertragen, Rechte serverseitig prüfen und Zugriffe protokollieren. Sicherheit entsteht in der Architektur, nicht durch ein Siegel.',
      },
      {
        q: 'Könnt ihr Prüfanforderungen erfüllen?',
        a: 'Wir liefern, was für Prüfungen gebraucht wird: Dokumentation, Protokolle und klar geregelte Verantwortlichkeiten. Die fachliche Bewertung bleibt bei der zuständigen Stelle.',
      },
      { q: 'Wer betreibt das System?', a: 'Auf Wunsch wir – oder Ihre IT, dann übergeben wir betriebsfertig.' },
    ],
  },
  {
    slug: 'stuttgart',
    city: 'Stuttgart',
    inCity: 'in Stuttgart',
    region: 'Baden-Württemberg',
    group: 'Deutschland',
    travel: 'Rund 4,5 Stunden – Zusammenarbeit remote.',
    intro:
      'Rund um Stuttgart sitzt eine der dichtesten Zulieferlandschaften Europas. Betriebe dort denken in Prozessen, Toleranzen und Nachweisen – und erwarten dieselbe Präzision von ihrer Software.',
    situation:
      'Wir bauen deshalb erst das Datenmodell und dann die Oberfläche. Wo Stücklisten, Chargen oder Prüfprotokolle im Spiel sind, entscheidet die saubere Struktur darüber, ob das System in zwei Jahren noch trägt.',
    focus: ['Automotive-Zulieferer', 'Maschinenbau', 'Handwerk', 'Dienstleister'],
    faq: [
      {
        q: 'Könnt ihr Prüf- und Chargendaten abbilden?',
        a: 'Ja. Wichtig ist, dass Struktur und Nachvollziehbarkeit von Anfang an stimmen – nachträglich ist das teuer.',
      },
      {
        q: 'Wie geht ihr mit Änderungen im Projekt um?',
        a: 'Transparent: Was Aufwand ändert, sagen wir sofort, bevor wir es bauen.',
      },
      {
        q: 'Arbeitet ihr mit unserem ERP zusammen?',
        a: 'Wenn es eine Schnittstelle gibt, ja. Sonst suchen wir den nächstbesten belastbaren Weg.',
      },
    ],
  },
  {
    slug: 'hannover',
    city: 'Hannover',
    inCity: 'in Hannover',
    region: 'Niedersachsen',
    group: 'Deutschland',
    travel: 'Rund 2 Stunden von Gütersloh.',
    intro:
      'Hannover ist Messe- und Versicherungsstadt mit einem sehr breiten Mittelstand. Und es liegt für uns nah genug, dass Vor-Ort-Termine unkompliziert bleiben.',
    situation:
      'Was wir hier häufig bauen: Auftritte, die zu Messeauftritten passen – also Seiten, auf denen Besucher nach dem Gespräch wirklich das finden, was versprochen wurde. Dazu Systeme für Anfragen, Termine und Nachverfolgung, damit Kontakte nicht in Visitenkartenstapeln enden.',
    focus: ['Messe & Veranstaltung', 'Versicherung & Beratung', 'Handwerk', 'Handel'],
    faq: [
      {
        q: 'Könnt ihr eine Landingpage für eine Messe bauen?',
        a: 'Ja, mit eigenem Ziel und eigener Messung – separat von der Hauptseite, damit man den Erfolg sauber sieht.',
      },
      {
        q: 'Kommt ihr nach Hannover?',
        a: 'Ja, das ist eine gut machbare Strecke. Für Kick-off, Workshops und Livegang gerne persönlich.',
      },
      {
        q: 'Wie messen wir Erfolg?',
        a: 'An Anfragen und Terminen, nicht an Klickzahlen. Wir richten die Seite so ein, dass man die Quelle sieht.',
      },
    ],
  },
  {
    slug: 'bremen',
    city: 'Bremen',
    inCity: 'in Bremen',
    region: 'Freie Hansestadt Bremen',
    group: 'Deutschland',
    travel: 'Rund 2,5 Stunden – Zusammenarbeit remote.',
    intro:
      'Bremen verbindet Hafenwirtschaft, Logistik und Hightech. Zwischen den großen Namen arbeiten viele mittelständische Zulieferer und Dienstleister, die online kaum sichtbar sind.',
    situation:
      'Für die bauen wir Auftritte, die Fachkompetenz belegen statt sie zu behaupten – und dahinter Werkzeuge für Angebote, Aufträge und Statusmeldungen, damit Kunden nicht ständig nachfragen müssen.',
    focus: ['Logistik & Hafen', 'Luft- & Raumfahrtzulieferer', 'Handwerk', 'Dienstleister'],
    faq: [
      {
        q: 'Können Kunden den Auftragsstatus selbst sehen?',
        a: 'Ja, über einen geschützten Bereich. Das spart erfahrungsgemäß mehr Telefonate, als man vorher denkt.',
      },
      {
        q: 'Wie aufwendig ist die Pflege?',
        a: 'So gering wie möglich: Wir machen genau die Bereiche pflegbar, die sich wirklich ändern.',
      },
      {
        q: 'Arbeitet ihr auch mit englischsprachigen Kunden?',
        a: 'Ja, Mehrsprachigkeit planen wir bei Bedarf von Anfang an ein.',
      },
    ],
  },
  {
    slug: 'nuernberg',
    city: 'Nürnberg',
    inCity: 'in Nürnberg',
    region: 'Bayern',
    group: 'Deutschland',
    travel: 'Rund 4 Stunden – Zusammenarbeit remote.',
    intro:
      'Die Metropolregion Nürnberg ist ein starker Handels- und IT-Standort mit vielen mittelständischen Herstellern. Viele verkaufen längst über mehrere Kanäle – und pflegen alles doppelt.',
    situation:
      'Genau da lohnt sich Automatisierung: Produktdaten einmal pflegen, überall ausspielen. Wir bauen die Struktur dafür und verbinden Shop, Marktplatz und Warenwirtschaft, damit Preise und Bestände zusammenpassen.',
    focus: ['Handel & Hersteller', 'IT & Technik', 'Handwerk', 'Gastronomie'],
    faq: [
      {
        q: 'Können Produktdaten zentral gepflegt werden?',
        a: 'Ja. Eine Quelle, mehrere Ziele – das ist meist der größte Zeitgewinn im Onlinehandel.',
      },
      { q: 'Wie geht ihr mit Varianten um?', a: 'Sauber im Datenmodell abgebildet, statt als hundert Einzelartikel.' },
      {
        q: 'Was ist mit bestehenden Marktplatz-Anbindungen?',
        a: 'Die behalten Sie. Wir ergänzen den eigenen Kanal, statt alles umzustellen.',
      },
    ],
  },
  {
    slug: 'leipzig',
    city: 'Leipzig',
    inCity: 'in Leipzig',
    region: 'Sachsen',
    group: 'Deutschland',
    travel: 'Rund 4 Stunden – Zusammenarbeit remote.',
    intro:
      'Leipzig wächst seit Jahren spürbar: neue Betriebe, neue Gastronomie, viel Kreativwirtschaft und starke Logistik. Wer schnell wächst, merkt zuerst an den Abläufen, wo es klemmt.',
    situation:
      'Wir bauen für wachsende Betriebe bewusst erweiterbar: erst das, was jetzt gebraucht wird, aber mit einer Struktur, die den nächsten Standort oder das nächste Team verkraftet, ohne dass alles neu gemacht werden muss.',
    focus: ['Gastronomie & Handel', 'Logistik', 'Kreativwirtschaft', 'Dienstleister'],
    faq: [
      {
        q: 'Wir wachsen schnell – was heißt das für die Software?',
        a: 'Dass die Struktur wichtiger ist als der Funktionsumfang. Wir bauen so, dass Standorte, Rollen und Mengen später dazukommen können.',
      },
      {
        q: 'Können wir mit einer Filiale starten?',
        a: 'Ja, und die zweite später anlegen, ohne das System zu duplizieren.',
      },
      {
        q: 'Wie planbar sind die Kosten?',
        a: 'Wir arbeiten mit klaren Paketen pro Ausbaustufe statt mit offenem Stundenzettel.',
      },
    ],
  },
  {
    slug: 'dresden',
    city: 'Dresden',
    inCity: 'in Dresden',
    region: 'Sachsen',
    group: 'Deutschland',
    travel: 'Rund 5 Stunden – Zusammenarbeit remote.',
    intro:
      'Dresden ist Technologiestandort und Touristenmagnet zugleich. Beides stellt sehr unterschiedliche Anforderungen: hier Präzision und Datenschutz, dort Sichtbarkeit und Buchbarkeit.',
    situation:
      'Für technische Betriebe bauen wir Anwendungen, die strengen Anforderungen standhalten. Für Gastgeber und Händler Auftritte, die vor der Anreise gefunden werden und die Buchung ohne Portalprovision ermöglichen.',
    focus: ['Mikroelektronik & Technik', 'Tourismus & Gastronomie', 'Handel', 'Dienstleister'],
    faq: [
      {
        q: 'Können Gäste ohne Portal buchen?',
        a: 'Ja. Eine eigene Buchungsstrecke spart Provision und gibt Ihnen den Kundenkontakt zurück.',
      },
      {
        q: 'Wie geht ihr mit technischen Anforderungen um?',
        a: 'Wir klären sie vor der ersten Zeile Code und schreiben sie fest, statt sie später zu erraten.',
      },
      {
        q: 'Ist Zusammenarbeit über die Entfernung ein Problem?',
        a: 'Nein, solange sie strukturiert ist. Feste Ansprechpartner und kurze Videotermine reichen völlig.',
      },
    ],
  },
  {
    slug: 'gelsenkirchen',
    city: 'Gelsenkirchen',
    inCity: 'in Gelsenkirchen',
    region: 'Ruhrgebiet, Nordrhein-Westfalen',
    group: 'Nordrhein-Westfalen',
    travel: 'Rund 100 Minuten – Zusammenarbeit remote.',
    intro:
      'Gelsenkirchen ist eine Stadt, in der viele Betriebe hart kalkulieren müssen. Genau deshalb darf eine Website kein Prestigeobjekt sein, sondern muss Anfragen bringen.',
    situation:
      'Wir bauen hier bewusst schlank: wenige, dafür starke Seiten, klare Kontaktwege, keine teuren Spielereien. Wo im Betrieb Zeit verloren geht, kommt ein kleines Werkzeug dazu statt eines Großsystems.',
    focus: ['Handwerk & Bau', 'Handel', 'Gastronomie', 'Dienstleister'],
    faq: [
      {
        q: 'Was ist die günstigste sinnvolle Variante?',
        a: 'Eine kompakte Seite mit Startseite, Leistungen, Referenzen und Kontakt – technisch sauber gebaut, damit sie schnell ist und gefunden wird. Alles weitere kann später dazu.',
      },
      {
        q: 'Bindet ihr uns langfristig?',
        a: 'Nein. Keine Knebelverträge, keine Lizenzfallen. Wenn Sie gehen wollen, bekommen Sie alles mit.',
      },
      {
        q: 'Wie schnell sind wir online?',
        a: 'Sobald Texte und Bilder da sind, meist in wenigen Wochen. Der Flaschenhals sind fast immer die Inhalte, nicht die Technik.',
      },
    ],
  },
  {
    slug: 'augsburg',
    city: 'Augsburg',
    inCity: 'in Augsburg',
    region: 'Bayern',
    group: 'Deutschland',
    travel: 'Rund 5,5 Stunden – Zusammenarbeit remote.',
    intro:
      'Augsburg verbindet alte Handelstradition mit moderner Umwelttechnik und Maschinenbau. Viele Betriebe hier verkaufen an Fachkunden, nicht an Laufkundschaft.',
    situation:
      'Für diese Zielgruppe zählt Nachweisbarkeit: technische Daten, Verfahren, Zertifikate, Ansprechpartner. Wir bauen Auftritte, die das strukturiert zeigen, und Portale, über die Bestandskunden Unterlagen selbst abrufen.',
    focus: ['Maschinenbau', 'Umwelttechnik', 'Handel', 'Dienstleister'],
    faq: [
      {
        q: 'Können wir Datenblätter zum Download anbieten?',
        a: 'Ja, geordnet nach Produkt und Version – optional geschützt, wenn nur Kunden sie sehen sollen.',
      },
      {
        q: 'Lohnt sich ein Kundenportal für uns?',
        a: 'Sobald Sie regelmäßig dieselben Unterlagen per Mail verschicken: ja. Das spart mehr Zeit, als die meisten vorher schätzen.',
      },
      {
        q: 'Wie läuft die Zusammenarbeit über die Distanz?',
        a: 'Feste Ansprechpartner, kurze Videotermine und früh sichtbare Zwischenstände. Das funktioniert seit Jahren zuverlässig.',
      },
    ],
  },
  {
    slug: 'braunschweig',
    city: 'Braunschweig',
    inCity: 'in Braunschweig',
    region: 'Niedersachsen',
    group: 'Deutschland',
    travel: 'Rund 2,5 Stunden – Termine planbar.',
    intro:
      'Braunschweig ist Forschungs- und Ingenieurstandort mit ungewöhnlich hoher Forschungsdichte. Software wird hier von Menschen bewertet, die selbst wissen, wie sie gebaut wird.',
    situation:
      'Das ist uns lieber als das Gegenteil. Wir legen Architektur, Datenmodell und Abhängigkeiten offen, statt eine Blackbox abzuliefern – und dokumentieren so, dass Ihr Team im Zweifel selbst weiterarbeiten kann.',
    focus: ['Forschung & Technik', 'Automotive-Umfeld', 'Handwerk', 'Dienstleister'],
    faq: [
      {
        q: 'Bekommen wir Einblick in den Code?',
        a: 'Ja. Struktur, Abhängigkeiten und Entscheidungen legen wir offen – das ist bei technischen Kunden meist der schnellste Weg zu Vertrauen.',
      },
      {
        q: 'Könnt ihr mit unserem Entwicklungsteam zusammenarbeiten?',
        a: 'Ja, wir übernehmen abgegrenzte Teile und übergeben sauber dokumentiert.',
      },
      {
        q: 'Wie testet ihr?',
        a: 'Automatisierte Tests für die kritischen Abläufe, Typprüfung im Build und manuelle Abnahme der Oberflächen.',
      },
    ],
  },
  {
    slug: 'chemnitz',
    city: 'Chemnitz',
    inCity: 'in Chemnitz',
    region: 'Sachsen',
    group: 'Deutschland',
    travel: 'Rund 5 Stunden – Zusammenarbeit remote.',
    intro:
      'Chemnitz hat eine starke industrielle Basis und einen Mittelstand, der oft leiser auftritt, als er müsste. Online ist das ein echter Nachteil.',
    situation:
      'Wir helfen, Kompetenz sichtbar zu machen: konkrete Projekte statt Floskeln, klare Leistungsseiten, ein Auftritt, der auch Bewerber überzeugt. Dazu Werkzeuge, die Angebote und Aufträge nachvollziehbar machen.',
    focus: ['Maschinenbau & Metall', 'Handwerk', 'Handel', 'Dienstleister'],
    faq: [
      {
        q: 'Hilft eine Website bei der Personalsuche?',
        a: 'Sehr. Bewerber schauen sich fast immer die Seite an, bevor sie sich melden. Ein guter Karrierebereich zahlt sich oft schneller aus als Neukundenwerbung.',
      },
      {
        q: 'Was, wenn wir keine Projektfotos zeigen dürfen?',
        a: 'Dann arbeiten wir mit anonymisierten Beispielen, Zahlen und Verfahren. Das geht, ohne Kundengeheimnisse zu verletzen.',
      },
      {
        q: 'Wie viel Aufwand haben wir selbst?',
        a: 'Ein Kick-off, ein paar Rückfragen, Inhalte liefern und abnehmen. Den Rest machen wir.',
      },
    ],
  },
  {
    slug: 'kiel',
    city: 'Kiel',
    inCity: 'in Kiel',
    region: 'Schleswig-Holstein',
    group: 'Deutschland',
    travel: 'Rund 4 Stunden – Zusammenarbeit remote.',
    intro:
      'Kiel lebt von Schiffbau, Meerestechnik, Hafen und einer starken Universität. Vieles davon ist saisonal geprägt – der Sommer entscheidet mit über das Jahr.',
    situation:
      'Für saisonale Betriebe bauen wir Seiten, die vor der Saison gefunden werden, und Buchungswege, die den Ansturm aushalten. Für technische Betriebe die üblichen Werkzeuge: Aufträge, Nachweise, Kundenzugänge.',
    focus: ['Maritime Wirtschaft', 'Tourismus & Gastronomie', 'Handwerk', 'Handel'],
    faq: [
      {
        q: 'Können wir Saisonzeiten abbilden?',
        a: 'Ja – Öffnungszeiten, Verfügbarkeiten und Preise lassen sich pro Zeitraum steuern, ohne dass Sie jedes Mal jemanden anrufen müssen.',
      },
      {
        q: 'Hält die Seite einen Ansturm aus?',
        a: 'Ja. Wir liefern statisch über ein Content-Netzwerk aus; das verkraftet auch Spitzen problemlos.',
      },
      {
        q: 'Arbeitet ihr auch im Norden?',
        a: 'Ja, deutschlandweit. Für Kick-off und Livegang kommen wir bei Bedarf hoch.',
      },
    ],
  },
  {
    slug: 'halle-saale',
    city: 'Halle (Saale)',
    inCity: 'in Halle (Saale)',
    region: 'Sachsen-Anhalt',
    group: 'Deutschland',
    travel: 'Rund 4 Stunden – Zusammenarbeit remote.',
    intro:
      'Halle an der Saale ist Universitäts- und Kulturstadt mit wachsendem Dienstleistungssektor. Zwischen Leipzig und dem Umland entscheidet Sichtbarkeit darüber, wer den Auftrag bekommt.',
    situation:
      'Wir bauen deshalb Seiten mit klarem regionalem Bezug und sauberer Struktur, damit Suchmaschinen verstehen, wo und wofür Sie zuständig sind. Dazu die Werkzeuge, die den Alltag entlasten.',
    focus: ['Dienstleister', 'Kultur & Bildung', 'Handwerk', 'Gastronomie'],
    faq: [
      {
        q: 'Wie unterscheiden wir uns von Leipzig-Anbietern?',
        a: 'Über echten Ortsbezug: Inhalte, die Ihr Einzugsgebiet und Ihre Kundschaft beschreiben, statt allgemeiner Werbetexte.',
      },
      { q: 'Können wir Termine online vergeben?', a: 'Ja, mit Ihren Regeln zu Zeiten, Vorlauf und Sperrzeiten.' },
      { q: 'Was kostet die Pflege?', a: 'Das legen wir vorher fest, damit es planbar bleibt.' },
    ],
  },
  {
    slug: 'magdeburg',
    city: 'Magdeburg',
    inCity: 'in Magdeburg',
    region: 'Sachsen-Anhalt',
    group: 'Deutschland',
    travel: 'Rund 3 Stunden – Zusammenarbeit remote.',
    intro:
      'Magdeburg ist Landeshauptstadt mit Maschinenbau, Logistik und einem wachsenden Technologieumfeld. Viele Betriebe wachsen gerade in eine Größe, in der Handarbeit nicht mehr reicht.',
    situation:
      'Genau dort setzen wir an: Der erste Schritt ist selten ein großes System, sondern die eine Übersicht, die alle brauchen. Von da aus wächst es kontrolliert weiter.',
    focus: ['Maschinenbau', 'Logistik', 'Handwerk', 'Dienstleister'],
    faq: [
      {
        q: 'Womit fangen wir an?',
        a: 'Mit dem Ablauf, der am meisten Zeit frisst. Den bauen wir zuerst und messen, ob es wirklich hilft.',
      },
      {
        q: 'Können mehrere Personen gleichzeitig arbeiten?',
        a: 'Ja, mit Rollen und Rechten, damit nicht jeder alles sehen oder ändern kann.',
      },
      {
        q: 'Was passiert bei einem Ausfall?',
        a: 'Sicherungen laufen automatisch, und wir sagen Ihnen vorher, wie lange eine Wiederherstellung dauert.',
      },
    ],
  },
  {
    slug: 'freiburg',
    city: 'Freiburg im Breisgau',
    inCity: 'in Freiburg',
    region: 'Baden-Württemberg',
    group: 'Deutschland',
    travel: 'Rund 6 Stunden – Zusammenarbeit remote.',
    intro:
      'Freiburg ist geprägt von Nachhaltigkeit, Tourismus und einer starken Hochschullandschaft. Kundschaft und Betriebe legen hier überdurchschnittlich viel Wert auf Haltung und Datenschutz.',
    situation:
      'Das passt zu unserer Bauweise: eigene Schriften, kein unnötiges Tracking, schlanke Seiten mit geringem Energiebedarf und Einwilligung nur da, wo sie wirklich nötig ist. Das ist gleichzeitig gut für Ladezeit und Ranking.',
    focus: ['Tourismus & Gastronomie', 'Nachhaltige Wirtschaft', 'Handwerk', 'Bildung'],
    faq: [
      {
        q: 'Wie datensparsam ist die Seite?',
        a: 'So sparsam, dass für die reine Nutzung kein Einwilligungsbanner nötig wäre. Wir laden Schriften selbst aus und binden keine fremden Skripte ein.',
      },
      {
        q: 'Was bedeutet das für die Ladezeit?',
        a: 'Weniger Fremdcode heißt schnellere Seiten – das ist zugleich ein Rankingfaktor.',
      },
      { q: 'Könnt ihr Buchungen abbilden?', a: 'Ja, mit eigener Buchungsstrecke statt Provisionsportal.' },
    ],
  },
  {
    slug: 'luebeck',
    city: 'Lübeck',
    inCity: 'in Lübeck',
    region: 'Schleswig-Holstein',
    group: 'Deutschland',
    travel: 'Rund 4 Stunden – Zusammenarbeit remote.',
    intro:
      'Lübeck lebt von Hafen, Handel, Handwerk und sehr viel Tourismus. Wer hier Gäste erreichen will, muss vor der Anreise sichtbar sein – nicht erst in der Altstadt.',
    situation:
      'Wir bauen Seiten, die genau dann gefunden werden, wenn jemand die Reise plant: schnelle Ladezeit, klare Informationen, direkte Buchung ohne Portalprovision. Für Handwerk und Handel die üblichen Werkzeuge für Aufträge und Kasse.',
    focus: ['Tourismus & Gastronomie', 'Handel', 'Handwerk', 'Logistik'],
    faq: [
      {
        q: 'Wie werden wir vor der Anreise gefunden?',
        a: 'Mit Inhalten, die die Fragen von Reisenden beantworten, sauberer lokaler Struktur und einem gepflegten Google-Unternehmensprofil.',
      },
      {
        q: 'Können Gäste direkt buchen?',
        a: 'Ja. Eine eigene Buchungsstrecke spart Provision und gibt Ihnen den Kundenkontakt.',
      },
      { q: 'Ist die Seite mehrsprachig möglich?', a: 'Ja, gerade bei Gästen aus dem Ausland lohnt sich das früh.' },
    ],
  },
  {
    slug: 'oberhausen',
    city: 'Oberhausen',
    inCity: 'in Oberhausen',
    region: 'Ruhrgebiet, Nordrhein-Westfalen',
    group: 'Nordrhein-Westfalen',
    travel: 'Rund 2 Stunden – Zusammenarbeit remote.',
    intro:
      'Oberhausen ist Handels- und Freizeitstandort mit sehr viel Wettbewerb um Aufmerksamkeit. Für kleinere Anbieter heißt das: Man muss dort auftauchen, wo konkret gesucht wird.',
    situation:
      'Deshalb bauen wir statt einer einzigen allgemeinen Seite mehrere konkrete: eine pro Leistung, mit den Begriffen, die Kunden wirklich eingeben. Das ist unspektakulär und wirkt.',
    focus: ['Handel & Freizeit', 'Gastronomie', 'Handwerk', 'Dienstleister'],
    faq: [
      {
        q: 'Warum mehrere Seiten statt einer?',
        a: 'Weil Suchmaschinen jede Seite einzeln bewerten. Eine Seite pro Leistung schlägt eine Seite, auf der alles steht.',
      },
      {
        q: 'Wie viele Seiten brauchen wir?',
        a: 'So viele, wie Sie echte Leistungen haben. Erfundene Seiten bringen nichts.',
      },
      {
        q: 'Können wir das selbst erweitern?',
        a: 'Ja, wenn Sie wollen – wir richten die Pflege so ein, dass neue Seiten ohne uns entstehen können.',
      },
    ],
  },
  {
    slug: 'erfurt',
    city: 'Erfurt',
    inCity: 'in Erfurt',
    region: 'Thüringen',
    group: 'Deutschland',
    travel: 'Rund 3,5 Stunden – Zusammenarbeit remote.',
    intro:
      'Erfurt ist Landeshauptstadt mit lebendiger Innenstadt, Logistik und einem breiten Handwerk. Vieles läuft über Empfehlung – online wird das selten abgebildet.',
    situation:
      'Wir sorgen dafür, dass die gute Reputation auch digital ankommt: echte Bewertungen sichtbar machen, Referenzen zeigen, den Kontaktweg kurz halten. Dazu Werkzeuge für Termine und Aufträge.',
    focus: ['Handwerk', 'Handel', 'Logistik', 'Gastronomie'],
    faq: [
      {
        q: 'Können wir Bewertungen einbinden?',
        a: 'Ja, datenschutzkonform und ohne dass die Seite dadurch langsam wird.',
      },
      {
        q: 'Was bringt uns das konkret?',
        a: 'Vertrauen. Wer Sie noch nicht kennt, entscheidet oft anhand dessen, was andere schreiben.',
      },
      {
        q: 'Kümmert ihr euch auch um das Google-Profil?',
        a: 'Wir beraten dabei und sorgen dafür, dass Profil und Website zusammenpassen.',
      },
    ],
  },
  {
    slug: 'rostock',
    city: 'Rostock',
    inCity: 'in Rostock',
    region: 'Mecklenburg-Vorpommern',
    group: 'Deutschland',
    travel: 'Rund 5 Stunden – Zusammenarbeit remote.',
    intro:
      'Rostock ist Hafenstadt, Universitätsstadt und Tourismusziel. Der Sommer bestimmt bei vielen Betrieben den Jahresumsatz – und damit auch, wann eine Website liefern muss.',
    situation:
      'Wir planen solche Projekte mit Blick auf den Kalender: rechtzeitig vor der Saison live, danach ausbauen. Für Hafen- und Logistikbetriebe stattdessen Werkzeuge, die das ganze Jahr tragen.',
    focus: ['Tourismus & Gastronomie', 'Maritime Wirtschaft', 'Handel', 'Handwerk'],
    faq: [
      {
        q: 'Schafft ihr es vor der Saison?',
        a: 'Wenn wir rechtzeitig starten, ja. Wir sagen Ihnen im Erstgespräch ehrlich, ob der Termin realistisch ist.',
      },
      {
        q: 'Können wir außerhalb der Saison sparen?',
        a: 'Ja, wir richten Pflege und Betreuung so ein, dass sie zum Geschäftsjahr passen.',
      },
      { q: 'Wie läuft der Support im Notfall?', a: 'Über einen festen Kanal mit vereinbarter Reaktionszeit.' },
    ],
  },
  {
    slug: 'kassel',
    city: 'Kassel',
    inCity: 'in Kassel',
    region: 'Hessen',
    group: 'Deutschland',
    travel: 'Rund 2,5 Stunden – Termine planbar.',
    intro:
      'Kassel liegt geografisch in der Mitte Deutschlands und ist ein wichtiger Logistik- und Industriestandort. Viele Betriebe bedienen von hier aus die gesamte Republik.',
    situation:
      'Wer bundesweit liefert, braucht online kein Ortsschild, sondern klare Leistungen und Erreichbarkeit. Wir bauen entsprechend: Auftritt mit überregionaler Ausrichtung plus Werkzeuge für Aufträge und Statusmeldungen.',
    focus: ['Logistik', 'Industrie', 'Handwerk', 'Dienstleister'],
    faq: [
      {
        q: 'Wir liefern bundesweit – wie zeigen wir das?',
        a: 'Über klar beschriebene Leistungen und Einzugsgebiete statt reiner Ortsangabe. Suchmaschinen und Kunden verstehen dann beides.',
      },
      { q: 'Kommt ihr für Termine nach Kassel?', a: 'Ja, das ist eine gut machbare Strecke.' },
      { q: 'Könnt ihr Sendungsstatus einbinden?', a: 'Wenn Ihr System die Daten liefert, ja.' },
    ],
  },
  {
    slug: 'hagen',
    city: 'Hagen',
    inCity: 'in Hagen',
    region: 'Südwestfalen, Nordrhein-Westfalen',
    group: 'Nordrhein-Westfalen',
    travel: 'Rund 90 Minuten – Termine planbar.',
    intro:
      'Hagen ist das Tor zum Sauerland und geprägt von Metallverarbeitung und Zulieferbetrieben. Viele arbeiten in engen Lieferketten mit hohen Nachweispflichten.',
    situation:
      'Für solche Betriebe zählt Rückverfolgbarkeit mehr als Design. Wir bauen Systeme, in denen jeder Schritt dokumentiert ist, und Auftritte, die für Einkäufer und Bewerber überzeugen.',
    focus: ['Metallverarbeitung', 'Zulieferer', 'Handwerk', 'Handel'],
    faq: [
      {
        q: 'Könnt ihr Nachweise revisionssicher ablegen?',
        a: 'Wir bauen Protokolle so, dass Änderungen nachvollziehbar bleiben. Rechtliche Anforderungen an Revisionssicherheit werden projektspezifisch abgestimmt.',
      },
      { q: 'Passt das zu unserer bestehenden Software?', a: 'Meistens ja – wir ergänzen, statt zu ersetzen.' },
      {
        q: 'Wie lange dauert so ein Projekt?',
        a: 'Das hängt am Umfang. Wir schneiden es in Stufen, damit früh etwas Nutzbares steht.',
      },
    ],
  },
  {
    slug: 'potsdam',
    city: 'Potsdam',
    inCity: 'in Potsdam',
    region: 'Brandenburg',
    group: 'Deutschland',
    travel: 'Rund 4 Stunden – Zusammenarbeit remote.',
    intro:
      'Potsdam verbindet Landesverwaltung, Wissenschaft und sehr viel Tourismus. Entsprechend unterschiedlich sind die Anforderungen – von Barrierefreiheit bis Buchbarkeit.',
    situation:
      'Für öffentliche und verbandsnahe Auftraggeber bauen wir zugänglich und dokumentiert. Für Gastgeber und Händler das Gegenstück: gefunden werden, buchen lassen, ohne Portalprovision.',
    focus: ['Verwaltung & Verbände', 'Tourismus', 'Wissenschaft', 'Dienstleister'],
    faq: [
      {
        q: 'Erfüllt ihr Barrierefreiheits-Anforderungen?',
        a: 'Wir bauen standardmäßig zugänglich und prüfen bei verpflichteten Stellen gezielt gegen die Vorgaben.',
      },
      {
        q: 'Können wir Formulare rechtssicher anbieten?',
        a: 'Technisch ja – mit Bestätigung, Protokoll und sauberer Datenhaltung. Die inhaltliche Prüfung bleibt bei Ihnen.',
      },
      {
        q: 'Wie ist die Zusammenarbeit organisiert?',
        a: 'Fester Ansprechpartner, dokumentierte Entscheidungen, nachvollziehbare Abnahmen.',
      },
    ],
  },
  {
    slug: 'saarbruecken',
    city: 'Saarbrücken',
    inCity: 'in Saarbrücken',
    region: 'Saarland',
    group: 'Deutschland',
    travel: 'Rund 4,5 Stunden – Zusammenarbeit remote.',
    intro:
      'Saarbrücken liegt an der Grenze zu Frankreich, mit entsprechend vielen Betrieben, die über die Grenze hinweg arbeiten. Mehrsprachigkeit ist hier keine Kür.',
    situation:
      'Wir planen sie deshalb von Anfang an ein – Struktur, Adressen und Inhalte so aufgebaut, dass Französisch später nicht nachgebaut werden muss. Dazu die üblichen Werkzeuge für Angebote und Aufträge.',
    focus: ['Industrie & Zulieferer', 'Handel', 'Gastronomie', 'Dienstleister'],
    faq: [
      {
        q: 'Wie funktioniert Mehrsprachigkeit sauber?',
        a: 'Mit eigenen Adressen je Sprache und klaren Verweisen zwischen ihnen – nicht mit automatischer Übersetzung.',
      },
      {
        q: 'Lohnt sich Französisch für uns?',
        a: 'Wenn ein relevanter Teil Ihrer Kunden von jenseits der Grenze kommt: ja.',
      },
      {
        q: 'Wer übersetzt die Texte?',
        a: 'Das übernehmen Sie oder ein Übersetzungsbüro – wir liefern die Struktur und bauen es ein.',
      },
    ],
  },
  {
    slug: 'ludwigshafen',
    city: 'Ludwigshafen am Rhein',
    inCity: 'in Ludwigshafen',
    region: 'Rheinland-Pfalz',
    group: 'Deutschland',
    travel: 'Rund 4 Stunden – Zusammenarbeit remote.',
    intro:
      'Ludwigshafen ist Chemie- und Industriestandort. Im Umfeld der großen Werke arbeiten viele spezialisierte Dienstleister, für die Sicherheit und Dokumentation Alltag sind.',
    situation:
      'Diesen Anspruch übertragen wir auf die Software: Rechte serverseitig geprüft, Eingaben validiert, Protokolle für kritische Vorgänge, keine Daten, die nicht gebraucht werden.',
    focus: ['Chemie-Umfeld', 'Industriedienstleister', 'Handwerk', 'Logistik'],
    faq: [
      {
        q: 'Wie geht ihr mit Zugriffsrechten um?',
        a: 'Rollenbasiert und immer serverseitig geprüft. Was der Browser sagt, ist nie die Grundlage einer Entscheidung.',
      },
      { q: 'Können wir Dokumentationspflichten abbilden?', a: 'Ja, mit Protokollen und nachvollziehbaren Änderungen.' },
      { q: 'Wo läuft das System?', a: 'Auf europäischen Servern, auf Wunsch auch bei Ihrem eigenen Anbieter.' },
    ],
  },
  {
    slug: 'oldenburg',
    city: 'Oldenburg',
    inCity: 'in Oldenburg',
    region: 'Niedersachsen',
    group: 'Deutschland',
    travel: 'Rund 2,5 Stunden – Termine planbar.',
    intro:
      'Oldenburg ist Handels- und Dienstleistungszentrum für eine große ländliche Region. Viele Betriebe bedienen ein weites Umland und nicht nur die Stadt.',
    situation:
      'Deshalb bauen wir Auftritte, die das Einzugsgebiet klar benennen, statt nur den Firmensitz. Kunden aus dem Umland sollen sich angesprochen fühlen – und Suchmaschinen sollen es verstehen.',
    focus: ['Handel', 'Agrarnahe Betriebe', 'Handwerk', 'Gesundheit'],
    faq: [
      {
        q: 'Wie sprechen wir das Umland an?',
        a: 'Mit Inhalten, die das Einzugsgebiet konkret beschreiben, und mit Angaben zu Anfahrt und Erreichbarkeit.',
      },
      { q: 'Kommt ihr für Termine?', a: 'Ja, Oldenburg ist von Gütersloh gut erreichbar.' },
      {
        q: 'Können wir Öffnungszeiten zentral pflegen?',
        a: 'Ja, an einer Stelle – Website und Google-Profil bleiben dann konsistent.',
      },
    ],
  },
  {
    slug: 'leverkusen',
    city: 'Leverkusen',
    inCity: 'in Leverkusen',
    region: 'Rheinland, Nordrhein-Westfalen',
    group: 'Nordrhein-Westfalen',
    travel: 'Rund 2 Stunden – Zusammenarbeit remote.',
    intro:
      'Leverkusen ist industriell geprägt und liegt zwischen Köln und Düsseldorf. Viele Betriebe konkurrieren online mit Anbietern aus beiden Großstädten.',
    situation:
      'Dagegen hilft Klarheit im Ortsbezug: eine Seite, die eindeutig zeigt, wo Sie sitzen und wen Sie bedienen. Dazu Ladezeit und Struktur, damit Sie technisch nicht hinten liegen.',
    focus: ['Industrie & Chemie', 'Handwerk', 'Handel', 'Dienstleister'],
    faq: [
      {
        q: 'Wie konkurrieren wir mit Köln und Düsseldorf?',
        a: 'Über Nähe. Wer in Leverkusen sucht, will meist jemanden aus Leverkusen – das muss die Seite eindeutig zeigen.',
      },
      {
        q: 'Ist unsere alte Seite noch zu retten?',
        a: 'Wir sehen sie uns an und sagen ehrlich, ob Überarbeitung oder Neubau günstiger ist.',
      },
      {
        q: 'Was passiert mit den alten Adressen?',
        a: 'Die leiten wir sauber weiter, damit nichts an Sichtbarkeit verloren geht.',
      },
    ],
  },
  {
    slug: 'heidelberg',
    city: 'Heidelberg',
    inCity: 'in Heidelberg',
    region: 'Baden-Württemberg',
    group: 'Deutschland',
    travel: 'Rund 4 Stunden – Zusammenarbeit remote.',
    intro:
      'Heidelberg ist Wissenschafts- und Tourismusstadt mit hoher internationaler Sichtbarkeit. Betriebe hier haben oft Kunden und Gäste aus aller Welt.',
    situation:
      'Das heißt konkret: Mehrsprachigkeit, klare Informationen und Buchungswege, die auch aus dem Ausland funktionieren. Für forschungsnahe Kunden dazu Anwendungen mit sauberer Datenhaltung.',
    focus: ['Wissenschaft & Medizintechnik', 'Tourismus', 'Handel', 'Dienstleister'],
    faq: [
      {
        q: 'Können internationale Gäste bei uns buchen?',
        a: 'Ja – mit englischer Fassung, klaren Preisen und Zahlungswegen, die international funktionieren.',
      },
      {
        q: 'Wie geht ihr mit Forschungsdaten um?',
        a: 'Datensparsam, mit klaren Rollen und Verschlüsselung. Was nicht nötig ist, wird nicht gespeichert.',
      },
      {
        q: 'Wer pflegt die englische Fassung?',
        a: 'Sie oder ein Übersetzungsbüro – wir bauen die Struktur so, dass es ohne uns geht.',
      },
    ],
  },
  {
    slug: 'darmstadt',
    city: 'Darmstadt',
    inCity: 'in Darmstadt',
    region: 'Hessen',
    group: 'Deutschland',
    travel: 'Rund 3,5 Stunden – Zusammenarbeit remote.',
    intro:
      'Darmstadt ist Technologie- und Wissenschaftsstadt mit hoher Dichte an IT- und Ingenieurunternehmen. Der Anspruch an technische Sauberkeit ist entsprechend hoch.',
    situation:
      'Wir liefern hier eher Substanz als Show: klare Architektur, dokumentierte Schnittstellen, Tests für die kritischen Wege und ein Betrieb, der ohne Überraschungen läuft.',
    focus: ['IT & Technologie', 'Ingenieurwesen', 'Handel', 'Dienstleister'],
    faq: [
      {
        q: 'Wie dokumentiert ihr Schnittstellen?',
        a: 'Maschinenlesbar und mit Beispielen, damit auch andere Teams sie ohne Rückfragen nutzen können.',
      },
      {
        q: 'Könnt ihr in ein bestehendes System einsteigen?',
        a: 'Ja, nach einer kurzen Bestandsaufnahme. Wir sagen ehrlich, wenn es unwirtschaftlich ist.',
      },
      {
        q: 'Wie läuft der Betrieb?',
        a: 'Automatische Sicherungen, Überwachung der Erreichbarkeit und vereinbarte Reaktionszeiten.',
      },
    ],
  },
  {
    slug: 'solingen',
    city: 'Solingen',
    inCity: 'in Solingen',
    region: 'Bergisches Land, Nordrhein-Westfalen',
    group: 'Nordrhein-Westfalen',
    travel: 'Rund 2 Stunden – Zusammenarbeit remote.',
    intro:
      'Solingen steht seit Jahrhunderten für Schneidwaren und Präzision. Viele Betriebe haben eine Marke, die stärker ist als ihr Online-Auftritt.',
    situation:
      'Genau da lohnt sich Arbeit: Wer eine Geschichte und ein Handwerk hat, kann das online zeigen – mit echten Bildern, Herstellungsschritten und einem Shop, der die Marge im Haus lässt.',
    focus: ['Manufaktur & Handwerk', 'Handel & Shops', 'Industrie', 'Dienstleister'],
    faq: [
      {
        q: 'Lohnt sich ein eigener Shop?',
        a: 'Wenn Sie eine Marke haben, fast immer. Ohne Marktplatz-Provision und mit eigenem Kundenkontakt rechnet es sich schnell.',
      },
      {
        q: 'Wie zeigen wir Handwerk online?',
        a: 'Mit Herstellungsschritten, Materialien und echten Bildern statt Katalogtexten.',
      },
      {
        q: 'Können wir international verkaufen?',
        a: 'Ja – Sprachen, Währungen und Versandregeln planen wir dann von Anfang an ein.',
      },
    ],
  },
  {
    slug: 'regensburg',
    city: 'Regensburg',
    inCity: 'in Regensburg',
    region: 'Bayern',
    group: 'Deutschland',
    travel: 'Rund 5,5 Stunden – Zusammenarbeit remote.',
    intro:
      'Regensburg verbindet Weltkulturerbe-Tourismus mit einem starken Technologie- und Automotive-Umfeld. Zwei Zielgruppen, die kaum unterschiedlicher sein könnten.',
    situation:
      'Für Gastgeber bauen wir Sichtbarkeit und Buchbarkeit, für technische Betriebe Werkzeuge und Schnittstellen. In beiden Fällen gilt: erst verstehen, wie gearbeitet wird, dann bauen.',
    focus: ['Tourismus & Gastronomie', 'Automotive-Umfeld', 'Handel', 'Dienstleister'],
    faq: [
      {
        q: 'Wie startet ein Projekt bei euch?',
        a: 'Mit einem kostenlosen Erstgespräch, in dem wir Ihren Ablauf verstehen wollen – nicht mit einer Präsentation.',
      },
      {
        q: 'Bekommen wir ein Festangebot?',
        a: 'Für klar umrissene Projekte ja. Wo Unsicherheit besteht, sagen wir das offen, statt zu raten.',
      },
      { q: 'Wie oft sehen wir Zwischenstände?', a: 'Regelmäßig und früh, damit Kurskorrekturen billig bleiben.' },
    ],
  },
  {
    slug: 'herne',
    city: 'Herne',
    inCity: 'in Herne',
    region: 'Ruhrgebiet, Nordrhein-Westfalen',
    group: 'Nordrhein-Westfalen',
    travel: 'Rund 100 Minuten – Zusammenarbeit remote.',
    intro:
      'Herne liegt mitten im Ruhrgebiet und ist stark von Handwerk, Handel und Dienstleistung geprägt. Die Konkurrenz sitzt hier wörtlich in der Nachbarstadt.',
    situation:
      'Deshalb zählt lokale Klarheit: Wer Sie sind, was Sie machen, wo Sie arbeiten und wie man Sie erreicht. Wir bauen das kompakt, schnell und ohne Ballast – und ergänzen später, was sich rechnet.',
    focus: ['Handwerk', 'Handel', 'Gastronomie', 'Dienstleister'],
    faq: [
      {
        q: 'Reicht uns eine kleine Seite?',
        a: 'Oft ja. Wichtiger als Umfang ist, dass die richtigen Informationen sofort sichtbar sind.',
      },
      {
        q: 'Wie werden wir lokal gefunden?',
        a: 'Über klare Ortsangaben, ein gepflegtes Unternehmensprofil und Inhalte, die Ihr Einzugsgebiet beschreiben.',
      },
      { q: 'Können wir später einen Shop ergänzen?', a: 'Ja, wir bauen von Anfang an erweiterbar.' },
    ],
  },
  {
    slug: 'neuss',
    city: 'Neuss',
    inCity: 'in Neuss',
    region: 'Rheinland, Nordrhein-Westfalen',
    group: 'Nordrhein-Westfalen',
    travel: 'Rund 2 Stunden – Zusammenarbeit remote.',
    intro:
      'Neuss ist Logistikdrehscheibe am Rhein mit starkem Handel und Handwerk. Viele Betriebe arbeiten eng mit Düsseldorf zusammen und werden trotzdem lokal gesucht.',
    situation:
      'Wir bauen Auftritte, die beides bedienen: regionale Auffindbarkeit und überregionale Kompetenzdarstellung. Dazu Werkzeuge für Aufträge, Termine und Statusinformationen.',
    focus: ['Logistik & Hafen', 'Handel', 'Handwerk', 'Dienstleister'],
    faq: [
      {
        q: 'Können wir in zwei Städten gefunden werden?',
        a: 'Ja, wenn es dafür echte Inhalte gibt. Kopierte Seiten mit getauschtem Ortsnamen bringen nichts.',
      },
      {
        q: 'Wie messen wir den Erfolg?',
        a: 'An Anfragen und Anrufen. Wir richten die Seite so ein, dass man die Quelle sieht.',
      },
      {
        q: 'Was, wenn wir wachsen?',
        a: 'Die Struktur ist darauf ausgelegt, dass Standorte und Teams dazukommen können.',
      },
    ],
  },
  {
    slug: 'ingolstadt',
    city: 'Ingolstadt',
    inCity: 'in Ingolstadt',
    region: 'Bayern',
    group: 'Deutschland',
    travel: 'Rund 5,5 Stunden – Zusammenarbeit remote.',
    intro:
      'Ingolstadt ist stark vom Automobilbau und seinen Zulieferern geprägt. Prozesssicherheit und Dokumentation sind hier Alltag, nicht Ausnahme.',
    situation:
      'Software muss in diesem Umfeld nachvollziehbar sein. Wir bauen deshalb erst das Datenmodell, dokumentieren Entscheidungen und liefern Tests für alles, was im Fehlerfall teuer wird.',
    focus: ['Automotive-Zulieferer', 'Ingenieurdienstleister', 'Handwerk', 'Handel'],
    faq: [
      { q: 'Könnt ihr Prozessschritte abbilden?', a: 'Ja, inklusive Freigaben, Rollen und Protokollen.' },
      {
        q: 'Wie geht ihr mit Änderungswünschen um?',
        a: 'Transparent: Was den Aufwand ändert, sagen wir vorher, nicht in der Rechnung.',
      },
      {
        q: 'Arbeitet ihr mit unserer IT zusammen?',
        a: 'Gerne. Wir sprechen direkt über Datenmodell, Rechte und Betrieb.',
      },
    ],
  },
  {
    slug: 'offenbach',
    city: 'Offenbach am Main',
    inCity: 'in Offenbach',
    region: 'Hessen',
    group: 'Deutschland',
    travel: 'Rund 3,5 Stunden – Zusammenarbeit remote.',
    intro:
      'Offenbach liegt direkt neben Frankfurt und lebt von Design, Handel und einem sehr internationalen Mittelstand. Sichtbarkeit entsteht hier selten über Größe.',
    situation:
      'Wir setzen auf Profil statt Lautstärke: klare Positionierung, echte Beispiele, mehrsprachig wo nötig. Technisch schlank, damit die Seite auch bei schlechter Verbindung schnell ist.',
    focus: ['Design & Handel', 'Internationale Kleinbetriebe', 'Gastronomie', 'Dienstleister'],
    faq: [
      {
        q: 'Wie heben wir uns von Frankfurt ab?',
        a: 'Über konkrete Inhalte zu Ihrem Angebot und Ihrem Ort statt allgemeiner Werbesprache.',
      },
      {
        q: 'Können wir mehrsprachig starten?',
        a: 'Ja – gerade bei internationaler Kundschaft lohnt es sich von Anfang an.',
      },
      {
        q: 'Wie schnell ist die Seite mobil?',
        a: 'Wir bauen für unter zwei Sekunden, auch bei mittelmäßiger Verbindung.',
      },
    ],
  },
  {
    slug: 'fuerth',
    city: 'Fürth',
    inCity: 'in Fürth',
    region: 'Bayern',
    group: 'Deutschland',
    travel: 'Rund 4 Stunden – Zusammenarbeit remote.',
    intro:
      'Fürth gehört zur Metropolregion Nürnberg und hat viele inhabergeführte Betriebe mit langer Geschichte. Online treten die meisten unter Wert auf.',
    situation:
      'Wir helfen, aus dieser Geschichte einen Vorteil zu machen: Herkunft, Handwerk und Menschen zeigen, statt austauschbarer Stockbilder. Dazu die üblichen Werkzeuge für Termine, Bestellung und Kasse.',
    focus: ['Einzelhandel', 'Handwerk', 'Gastronomie', 'Dienstleister'],
    faq: [
      {
        q: 'Was macht eine Seite persönlich?',
        a: 'Echte Bilder, echte Namen, echte Beispiele. Nichts wirkt schneller austauschbar als gekaufte Fotos.',
      },
      {
        q: 'Was, wenn wir keine Fotos haben?',
        a: 'Wir sagen, welche wenigen Motive wirklich reichen, und bauen das Layout darauf aus.',
      },
      { q: 'Können wir Bestellungen annehmen?', a: 'Ja, direkt über die Seite und mit Anbindung an Ihre Kasse.' },
    ],
  },
  {
    slug: 'wuerzburg',
    city: 'Würzburg',
    inCity: 'in Würzburg',
    region: 'Bayern',
    group: 'Deutschland',
    travel: 'Rund 4 Stunden – Zusammenarbeit remote.',
    intro:
      'Würzburg ist Universitäts-, Wein- und Tourismusstadt. Viele Betriebe leben von Gästen, die vorher online recherchieren.',
    situation:
      'Deshalb bauen wir Seiten, die genau in dieser Recherchephase überzeugen: schnelle Ladezeit, klare Angaben, direkte Buchung. Für Handwerk und Dienstleister dagegen die Werkzeuge für Termine und Aufträge.',
    focus: ['Tourismus & Gastronomie', 'Weinbau & Handel', 'Bildung', 'Handwerk'],
    faq: [
      {
        q: 'Wie wichtig ist die mobile Ansicht?',
        a: 'Entscheidend. Der Großteil der Recherche passiert unterwegs auf dem Handy.',
      },
      { q: 'Können wir Veranstaltungen abbilden?', a: 'Ja, mit Terminen, Anmeldungen und automatischer Bestätigung.' },
      {
        q: 'Was kostet der Einstieg?',
        a: 'Nach einem kostenlosen Erstgespräch bekommen Sie ein konkretes Angebot statt einer Pauschale.',
      },
    ],
  },
  {
    slug: 'ulm',
    city: 'Ulm',
    inCity: 'in Ulm',
    region: 'Baden-Württemberg',
    group: 'Deutschland',
    travel: 'Rund 5 Stunden – Zusammenarbeit remote.',
    intro:
      'Ulm hat eine bemerkenswert hohe Dichte an Technologie- und Ingenieurbetrieben. Wer hier verkauft, verkauft an Fachleute.',
    situation:
      'Marketingsprache hilft dabei nicht. Wir bauen Auftritte mit Substanz – Verfahren, Daten, Beispiele – und Anwendungen, die technische Abläufe präzise abbilden statt sie zu vereinfachen.',
    focus: ['Technologie & Ingenieurwesen', 'Produktion', 'Handel', 'Dienstleister'],
    faq: [
      {
        q: 'Könnt ihr komplexe Produkte darstellen?',
        a: 'Ja, mit Varianten, Datenblättern und Vergleichen statt bloßer Bildergalerie.',
      },
      {
        q: 'Wie tief geht die Beratung?',
        a: 'So tief, wie es braucht. Wir fragen lieber einmal mehr, bevor wir etwas Falsches bauen.',
      },
      { q: 'Wer betreibt das System später?', a: 'Auf Wunsch wir – oder Ihre IT, dann übergeben wir betriebsfertig.' },
    ],
  },
  {
    slug: 'heilbronn',
    city: 'Heilbronn',
    inCity: 'in Heilbronn',
    region: 'Baden-Württemberg',
    group: 'Deutschland',
    travel: 'Rund 4,5 Stunden – Zusammenarbeit remote.',
    intro:
      'Heilbronn wächst als Bildungs- und Technologiestandort und hat gleichzeitig eine traditionsreiche Wein- und Handelswirtschaft. Beides trifft selten dieselbe Software.',
    situation:
      'Wir passen die Lösung dem Betrieb an, nicht umgekehrt: für Händler und Winzer Shop und Direktverkauf, für Technologiebetriebe Portale und Schnittstellen.',
    focus: ['Handel & Weinbau', 'Technologie & Bildung', 'Logistik', 'Handwerk'],
    faq: [
      {
        q: 'Können wir direkt an Endkunden verkaufen?',
        a: 'Ja, mit eigenem Shop inklusive Versand, Zahlung und – wo nötig – Altersprüfung.',
      },
      {
        q: 'Wie aufwendig ist die Pflege eines Shops?',
        a: 'Weniger, als viele denken, wenn Produktdaten an einer Stelle gepflegt werden.',
      },
      { q: 'Könnt ihr an unsere Warenwirtschaft andocken?', a: 'Wenn eine Schnittstelle existiert, ja.' },
    ],
  },
  {
    slug: 'pforzheim',
    city: 'Pforzheim',
    inCity: 'in Pforzheim',
    region: 'Baden-Württemberg',
    group: 'Deutschland',
    travel: 'Rund 4,5 Stunden – Zusammenarbeit remote.',
    intro:
      'Pforzheim steht für Schmuck, Präzisionstechnik und Gestaltung. Betriebe mit einem Produkt, das man sehen muss, um es zu verstehen.',
    situation:
      'Für solche Produkte bauen wir Auftritte, in denen Bild und Detail im Vordergrund stehen – ohne dass die Seite dadurch langsam wird. Dazu Shops, die Varianten und Materialien sauber abbilden.',
    focus: ['Schmuck & Manufaktur', 'Präzisionstechnik', 'Handel', 'Design'],
    faq: [
      {
        q: 'Wie zeigen wir Details ohne lange Ladezeit?',
        a: 'Mit modernen Bildformaten, richtigen Größen und Nachladen erst bei Bedarf.',
      },
      {
        q: 'Können Kunden Varianten konfigurieren?',
        a: 'Ja, wenn die Varianten sauber im Datenmodell abgebildet sind.',
      },
      {
        q: 'Bekommen wir Hilfe bei den Produktfotos?',
        a: 'Wir sagen Ihnen, was gebraucht wird, und bereiten die Bilder technisch auf.',
      },
    ],
  },
  {
    slug: 'wolfsburg',
    city: 'Wolfsburg',
    inCity: 'in Wolfsburg',
    region: 'Niedersachsen',
    group: 'Deutschland',
    travel: 'Rund 2,5 Stunden – Termine planbar.',
    intro:
      'Wolfsburg ist von der Automobilindustrie geprägt, mit einem dichten Netz an Zulieferern und Dienstleistern. Wer hier liefert, kennt strenge Vorgaben.',
    situation:
      'Wir bauen entsprechend belastbar: dokumentierte Schnittstellen, klare Rollen, Tests für alles, was im Fehlerfall Geld kostet. Für kleinere Dienstleister genügt oft schon ein sauberer Auftritt mit klarer Positionierung.',
    focus: ['Automotive-Zulieferer', 'Dienstleister', 'Handwerk', 'Handel'],
    faq: [
      {
        q: 'Könnt ihr Vorgaben großer Auftraggeber erfüllen?',
        a: 'Technisch in der Regel ja. Was formal gefordert ist, klären wir vorher gemeinsam.',
      },
      { q: 'Wie schnell könnt ihr starten?', a: 'Nach dem Erstgespräch bekommen Sie einen realistischen Zeitplan.' },
      { q: 'Kommt ihr nach Wolfsburg?', a: 'Für Kick-off und wichtige Termine gerne.' },
    ],
  },
  {
    slug: 'goettingen',
    city: 'Göttingen',
    inCity: 'in Göttingen',
    region: 'Niedersachsen',
    group: 'Deutschland',
    travel: 'Rund 2 Stunden – Termine planbar.',
    intro:
      'Göttingen ist eine der bekanntesten Universitätsstädte Deutschlands, mit viel Forschung, Medizintechnik und wissenschaftsnahen Dienstleistern.',
    situation:
      'In diesem Umfeld zählen Struktur und Nachvollziehbarkeit. Wir bauen Anwendungen mit sauberem Datenmodell und Auftritte, die komplexe Themen verständlich ordnen, ohne sie zu verflachen.',
    focus: ['Forschung & Medizintechnik', 'Bildung', 'Dienstleister', 'Handel'],
    faq: [
      {
        q: 'Könnt ihr wissenschaftliche Inhalte strukturieren?',
        a: 'Ja – mit Ordnung, Suche und Filtern statt endloser PDF-Listen.',
      },
      {
        q: 'Wie steht es um Datenschutz bei sensiblen Daten?',
        a: 'Datensparsam bauen, Rechte trennen, verschlüsselt übertragen und speichern.',
      },
      { q: 'Kommt ihr für Termine?', a: 'Ja, Göttingen ist von Gütersloh gut erreichbar.' },
    ],
  },
  {
    slug: 'bottrop',
    city: 'Bottrop',
    inCity: 'in Bottrop',
    region: 'Ruhrgebiet, Nordrhein-Westfalen',
    group: 'Nordrhein-Westfalen',
    travel: 'Rund 2 Stunden – Zusammenarbeit remote.',
    intro:
      'Bottrop ist eine Stadt im Wandel, mit Fokus auf Energie, Handwerk und lokalem Handel. Viele Betriebe leben von Kundschaft im direkten Umfeld.',
    situation:
      'Für die zählt genau eine Sache: gefunden werden, wenn jemand in der Nähe sucht. Wir bauen dafür schlanke Seiten mit sauberem Ortsbezug und einem Kontaktweg, der auf dem Handy funktioniert.',
    focus: ['Handwerk & Bau', 'Energie & Technik', 'Handel', 'Dienstleister'],
    faq: [
      {
        q: 'Wie werden wir in der Nähe gefunden?',
        a: 'Über eindeutige Ortsangaben, ein gepflegtes Unternehmensprofil und Inhalte zu Ihrem Einzugsgebiet.',
      },
      { q: 'Brauchen wir viele Seiten?', a: 'Nein – aber die wenigen müssen die richtigen Fragen beantworten.' },
      { q: 'Was kostet die laufende Betreuung?', a: 'Das legen wir vorher fest, damit es planbar bleibt.' },
    ],
  },
  {
    slug: 'reutlingen',
    city: 'Reutlingen',
    inCity: 'in Reutlingen',
    region: 'Baden-Württemberg',
    group: 'Deutschland',
    travel: 'Rund 5 Stunden – Zusammenarbeit remote.',
    intro:
      'Reutlingen liegt am Rand der Schwäbischen Alb und ist geprägt von Textil-, Maschinen- und Verpackungsindustrie. Viele Betriebe sind in ihrer Nische führend.',
    situation:
      'Führend zu sein und so zu wirken sind zwei verschiedene Dinge. Wir bauen Auftritte, die Spezialisierung sichtbar machen, und intern Werkzeuge, die Angebote und Nachweise zusammenhalten.',
    focus: ['Textil & Verpackung', 'Maschinenbau', 'Handwerk', 'Handel'],
    faq: [
      {
        q: 'Wie zeigt man eine Nische online?',
        a: 'Mit konkreten Anwendungsfällen statt allgemeiner Branchenwörter. Wer sucht, sucht sein Problem, nicht Ihre Kategorie.',
      },
      {
        q: 'Können wir Angebote digital erstellen?',
        a: 'Ja, mit Vorlagen und Daten aus einer Quelle statt Copy-and-paste.',
      },
      { q: 'Wie lange dauert die Einführung?', a: 'Wir schneiden es in Stufen, damit früh etwas Nutzbares steht.' },
    ],
  },
  {
    slug: 'koblenz',
    city: 'Koblenz',
    inCity: 'in Koblenz',
    region: 'Rheinland-Pfalz',
    group: 'Deutschland',
    travel: 'Rund 3,5 Stunden – Zusammenarbeit remote.',
    intro:
      'Koblenz liegt am Zusammenfluss von Rhein und Mosel und lebt stark von Tourismus, Verwaltung und Mittelstand. Saison und Wetter bestimmen bei vielen den Umsatz.',
    situation:
      'Wir bauen deshalb Seiten, die kurzfristige Entscheidungen unterstützen: aktuelle Öffnungszeiten, freie Termine, direkte Buchung. Für Verwaltung und Verbände dagegen zugängliche, dokumentierte Auftritte.',
    focus: ['Tourismus & Gastronomie', 'Verwaltung & Verbände', 'Handwerk', 'Handel'],
    faq: [
      {
        q: 'Können wir Verfügbarkeiten tagesaktuell zeigen?',
        a: 'Ja, wenn die Daten irgendwo entstehen, lassen sie sich anbinden.',
      },
      {
        q: 'Ist die Seite barrierefrei?',
        a: 'Wir bauen standardmäßig zugänglich und prüfen bei Bedarf gezielt gegen die Vorgaben.',
      },
      { q: 'Wie schnell reagiert ihr in der Saison?', a: 'Reaktionszeiten vereinbaren wir vorher verbindlich.' },
    ],
  },
  {
    slug: 'bremerhaven',
    city: 'Bremerhaven',
    inCity: 'in Bremerhaven',
    region: 'Freie Hansestadt Bremen',
    group: 'Deutschland',
    travel: 'Rund 3 Stunden – Zusammenarbeit remote.',
    intro:
      'Bremerhaven ist Hafen-, Fischerei- und Tourismusstadt. Viele Betriebe arbeiten in Logistikketten, andere leben von Besuchern – oft in derselben Straße.',
    situation:
      'Für Logistik bauen wir Werkzeuge mit Status und Nachweisen, für Gastgeber Seiten mit Sichtbarkeit und Buchung. Gemeinsam ist beiden: Es muss auch bei Wind und schlechtem Netz auf dem Handy funktionieren.',
    focus: ['Hafen & Logistik', 'Tourismus', 'Handwerk', 'Handel'],
    faq: [
      {
        q: 'Funktioniert das auch bei schlechter Verbindung?',
        a: 'Ja, dafür bauen wir schlank und laden Inhalte erst bei Bedarf nach.',
      },
      { q: 'Könnt ihr Sendungs- oder Auftragsstatus zeigen?', a: 'Wenn Ihr System die Daten liefert, ja.' },
      { q: 'Arbeitet ihr auch für kleine Betriebe?', a: 'Ja. Wir skalieren den Umfang, nicht die Qualität.' },
    ],
  },
  {
    slug: 'bergisch-gladbach',
    city: 'Bergisch Gladbach',
    inCity: 'in Bergisch Gladbach',
    region: 'Rheinland, Nordrhein-Westfalen',
    group: 'Nordrhein-Westfalen',
    travel: 'Rund 2 Stunden – Zusammenarbeit remote.',
    intro:
      'Bergisch Gladbach liegt im Speckgürtel von Köln, mit vielen kleinen und mittleren Betrieben, die überwiegend regional arbeiten.',
    situation:
      'Der Wettbewerb kommt aus der Großstadt nebenan. Dagegen hilft, was Großstadtanbieter selten liefern: Erreichbarkeit, Ortskenntnis und eine Seite, die genau das zeigt. Technisch bauen wir sie so schnell wie jede Agenturseite aus Köln.',
    focus: ['Handwerk & Bau', 'Dienstleister', 'Handel', 'Gesundheit'],
    faq: [
      {
        q: 'Wie konkurrieren wir mit Kölner Anbietern?',
        a: 'Über Nähe und Verfügbarkeit – wenn die Seite das klar zeigt, ist das ein echter Vorteil.',
      },
      { q: 'Wie schnell ist die Seite?', a: 'Wir bauen für unter zwei Sekunden mobil, ohne Fremd-Ballast.' },
      { q: 'Können wir klein anfangen?', a: 'Ja, und später erweitern – die Struktur ist darauf ausgelegt.' },
    ],
  },
  {
    slug: 'jena',
    city: 'Jena',
    inCity: 'in Jena',
    region: 'Thüringen',
    group: 'Deutschland',
    travel: 'Rund 4 Stunden – Zusammenarbeit remote.',
    intro:
      'Jena ist Wissenschafts- und Optikstandort mit einer für die Stadtgröße außergewöhnlichen Technologiedichte. Software wird hier kritisch beurteilt.',
    situation:
      'Uns ist das recht: Wir legen Architektur und Entscheidungen offen und bauen so, dass ein anderes Team damit weiterarbeiten könnte. Für Handel und Gastronomie in der Innenstadt gilt dagegen das Einfache: schnell, klar, mobil.',
    focus: ['Optik & Technologie', 'Forschung', 'Handel', 'Gastronomie'],
    faq: [
      {
        q: 'Bekommen wir Einblick in Architektur und Code?',
        a: 'Ja, vollständig. Das ist bei technischen Kunden meist der schnellste Weg zu Vertrauen.',
      },
      {
        q: 'Könnt ihr Messdaten verarbeiten?',
        a: 'Ja, sofern klar ist, in welchem Format sie entstehen und was daraus werden soll.',
      },
      {
        q: 'Wie läuft die Zusammenarbeit?',
        a: 'Fester Ansprechpartner, kurze Videotermine, früh sichtbare Zwischenstände.',
      },
    ],
  },
  {
    slug: 'trier',
    city: 'Trier',
    inCity: 'in Trier',
    region: 'Rheinland-Pfalz',
    group: 'Deutschland',
    travel: 'Rund 4 Stunden – Zusammenarbeit remote.',
    intro:
      'Trier ist die älteste Stadt Deutschlands, mit entsprechend viel Tourismus, Weinbau und Handel – und einer Grenzlage zu Luxemburg.',
    situation:
      'Wer hier arbeitet, hat oft Kunden aus mehreren Ländern. Mehrsprachigkeit und klare Preisangaben sind deshalb kein Extra. Dazu bauen wir Buchung und Bestellung, die ohne Portal auskommen.',
    focus: ['Tourismus & Weinbau', 'Handel', 'Gastronomie', 'Dienstleister'],
    faq: [
      {
        q: 'Lohnt sich Französisch oder Englisch?',
        a: 'Bei Kundschaft aus Luxemburg und dem Ausland fast immer. Wir planen es von Anfang an ein.',
      },
      { q: 'Können wir ohne Buchungsportal auskommen?', a: 'Ja, mit eigener Buchungsstrecke – das spart Provision.' },
      {
        q: 'Wie werden wir bei Reiseplanung gefunden?',
        a: 'Mit Inhalten, die die Fragen von Gästen beantworten, und einem gepflegten Unternehmensprofil.',
      },
    ],
  },
  {
    slug: 'erlangen',
    city: 'Erlangen',
    inCity: 'in Erlangen',
    region: 'Bayern',
    group: 'Deutschland',
    travel: 'Rund 4 Stunden – Zusammenarbeit remote.',
    intro:
      'Erlangen ist Medizintechnik- und Forschungsstandort mit hoher Ingenieursdichte. Anforderungen sind hier meist schon vor dem ersten Gespräch klar formuliert.',
    situation:
      'Das macht Projekte angenehm – vorausgesetzt, man baut wirklich, was gefordert ist. Wir schreiben Anforderungen fest, dokumentieren Schnittstellen und liefern Tests für alles Kritische.',
    focus: ['Medizintechnik', 'Forschung & Technologie', 'Dienstleister', 'Handel'],
    faq: [
      {
        q: 'Könnt ihr mit klar spezifizierten Anforderungen arbeiten?',
        a: 'Ja, das ist uns lieber als vage Wünsche. Wir bestätigen sie schriftlich, bevor wir bauen.',
      },
      {
        q: 'Wie geht ihr mit sensiblen Daten um?',
        a: 'Datensparsam, verschlüsselt, mit klaren Rollen und Protokollen.',
      },
      {
        q: 'Was ist mit Abnahmen und Freigaben?',
        a: 'Wir arbeiten in Stufen mit dokumentierter Abnahme statt einer großen Schlussabnahme.',
      },
    ],
  },
  {
    slug: 'moers',
    city: 'Moers',
    inCity: 'in Moers',
    region: 'Niederrhein, Nordrhein-Westfalen',
    group: 'Nordrhein-Westfalen',
    travel: 'Rund 2 Stunden – Zusammenarbeit remote.',
    intro:
      'Moers liegt am linken Niederrhein, mit einem Mix aus Handel, Handwerk und Logistik. Viele Betriebe bedienen ein weites Umland ohne große Stadt im Rücken.',
    situation:
      'Dann muss die Website die Rolle des Schaufensters übernehmen. Wir bauen sie so, dass Leistungen, Einzugsgebiet und Erreichbarkeit sofort klar sind – und ergänzen Werkzeuge, wo im Betrieb Zeit verloren geht.',
    focus: ['Handel', 'Handwerk', 'Logistik', 'Dienstleister'],
    faq: [
      {
        q: 'Wie beschreiben wir unser Einzugsgebiet?',
        a: 'Konkret, mit den Orten, in denen Sie tatsächlich arbeiten – das verstehen Kunden und Suchmaschinen.',
      },
      {
        q: 'Können wir Anfragen automatisch vorsortieren?',
        a: 'Ja, über gezielte Formularfelder statt eines leeren Nachrichtenfelds.',
      },
      {
        q: 'Landen Anfragen zuverlässig bei uns?',
        a: 'Wir versenden über einen echten Maildienst mit Zustellprüfung, nicht über ein Skript.',
      },
    ],
  },
  {
    slug: 'hildesheim',
    city: 'Hildesheim',
    inCity: 'in Hildesheim',
    region: 'Niedersachsen',
    group: 'Deutschland',
    travel: 'Rund 2 Stunden – Termine planbar.',
    intro:
      'Hildesheim verbindet Weltkulturerbe, Hochschule und einen soliden Mittelstand. Die Stadt liegt für uns nah genug, dass persönliche Termine unkompliziert bleiben.',
    situation:
      'Wir bauen hier Auftritte für Betriebe, die regional stark sind, aber online kaum stattfinden – und ergänzen Werkzeuge, die den Alltag entlasten: Termine, Aufträge, Nachweise.',
    focus: ['Handwerk', 'Handel', 'Bildung & Kultur', 'Dienstleister'],
    faq: [
      { q: 'Kommt ihr für ein Erstgespräch?', a: 'Ja, Hildesheim ist von Gütersloh gut erreichbar.' },
      { q: 'Wie viel Aufwand haben wir?', a: 'Ein Kick-off, Inhalte liefern, abnehmen. Den Rest übernehmen wir.' },
      {
        q: 'Was passiert nach dem Livegang?',
        a: 'Updates, Sicherheit und Weiterentwicklung – auf Wunsch komplett bei uns.',
      },
    ],
  },
  {
    slug: 'salzgitter',
    city: 'Salzgitter',
    inCity: 'in Salzgitter',
    region: 'Niedersachsen',
    group: 'Deutschland',
    travel: 'Rund 2,5 Stunden – Termine planbar.',
    intro:
      'Salzgitter ist Stahl- und Industriestandort mit vielen Zulieferern und Dienstleistern im Umfeld. Abläufe sind hier klar geregelt und dokumentationspflichtig.',
    situation:
      'Software muss sich dem unterordnen. Wir bilden bestehende Abläufe ab, statt sie umzuwerfen, und sorgen dafür, dass jeder Schritt nachvollziehbar bleibt.',
    focus: ['Stahl & Industrie', 'Zulieferer', 'Handwerk', 'Logistik'],
    faq: [
      {
        q: 'Müssen wir unsere Abläufe ändern?',
        a: 'Nein. Wir bilden ab, wie Sie arbeiten – Änderungen schlagen wir nur vor, wo sie klar etwas bringen.',
      },
      { q: 'Können mehrere Schichten damit arbeiten?', a: 'Ja, mit Rollen und Übergaben zwischen den Schichten.' },
      { q: 'Wann wird gewartet?', a: 'In Fenstern, die zu Ihrem Betrieb passen, nicht zu unserem Kalender.' },
    ],
  },
  {
    slug: 'cottbus',
    city: 'Cottbus',
    inCity: 'in Cottbus',
    region: 'Brandenburg',
    group: 'Deutschland',
    travel: 'Rund 5 Stunden – Zusammenarbeit remote.',
    intro:
      'Cottbus steht mitten im Strukturwandel der Lausitz: Energie, Bahntechnik und eine wachsende Hochschullandschaft prägen die Region.',
    situation:
      'Wo sich viel verändert, entstehen neue Betriebe und neue Abläufe. Wir bauen dafür bewusst erweiterbar – klein anfangen, mit dem Betrieb mitwachsen, ohne dass später alles neu gemacht werden muss.',
    focus: ['Energie & Bahntechnik', 'Handwerk', 'Handel', 'Dienstleister'],
    faq: [
      {
        q: 'Können wir klein starten?',
        a: 'Ja, das empfehlen wir sogar. Erst das, was jetzt hilft – der Rest kommt, wenn es sich trägt.',
      },
      {
        q: 'Was, wenn sich unsere Abläufe ändern?',
        a: 'Dann ändern wir die Software mit. Dafür bauen wir sie erweiterbar.',
      },
      { q: 'Wie planbar sind die Kosten?', a: 'Wir arbeiten mit klaren Paketen pro Ausbaustufe.' },
    ],
  },
  {
    slug: 'kaiserslautern',
    city: 'Kaiserslautern',
    inCity: 'in Kaiserslautern',
    region: 'Rheinland-Pfalz',
    group: 'Deutschland',
    travel: 'Rund 4,5 Stunden – Zusammenarbeit remote.',
    intro:
      'Kaiserslautern ist Technologie- und Forschungsstandort mit starkem Fokus auf Softwaretechnik – und gleichzeitig eine Stadt mit sehr bodenständigem Handwerk und Handel.',
    situation:
      'Für technische Auftraggeber liefern wir Substanz und Dokumentation. Für alle anderen das Einfache, das trotzdem selten gut gemacht wird: eine schnelle, klare Seite, die Anfragen bringt.',
    focus: ['Softwaretechnik & Forschung', 'Handwerk', 'Handel', 'Gastronomie'],
    faq: [
      {
        q: 'Arbeitet ihr auch mit technischen Auftraggebern?',
        a: 'Ja, und wir legen Architektur und Entscheidungen dabei offen.',
      },
      {
        q: 'Ist eine einfache Seite genug?',
        a: 'Oft ja – solange sie schnell ist und die richtigen Fragen beantwortet.',
      },
      { q: 'Was kostet ein Erstgespräch?', a: 'Nichts, und es verpflichtet zu nichts.' },
    ],
  },
];

export const locationBySlug = new Map(locations.map((entry) => [entry.slug, entry]));
