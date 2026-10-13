// Finnish translation of week 4. Same order as ../w4.js, item for item; code examples are shared.

export default {
  label: 'Viikko 4',
  title: 'Reactin perusteet',
  blurb: 'Komponentit, JSX, propsit, tila useState-hookilla, tapahtumankäsittelijät, taulukoiden päivittäminen tilassa ja Reactin ajattelutapa.',
  topics: [
    [
      'Mikä React on',
      [
        ['React', 'React on JavaScript-kirjasto, jolla käyttöliittymät rakennetaan komponenteista. Kuvaat, miltä käyttöliittymän pitää näyttää nykyisellä datalla, ja React päivittää DOMin vastaamaan sitä.'],
        ['Deklaratiivinen vai imperatiivinen', 'DOM-rajapinnalla kirjoitat vaiheet: luo elementti, aseta sen teksti, liitä se sivulle. Reactilla ilmoitat, minkä lopputuloksen haluat tietyllä tilalla, ja React päättelee vaiheet.'],
        ['Komponentit', 'Komponentti on JavaScript-funktio, joka palauttaa JSX:ää. Sen nimen on alettava isolla kirjaimella, ja sitä käytetään kuin HTML-tagia. Saman komponentin voi renderöidä monta kertaa.'],
        ['Sovelluksen aloituspiste', 'HTML-tiedostossa on yksi tyhjä juurielementti. Tiedostossa `main.jsx` `createRoot` ottaa tuon elementin ja renderöi siihen ylimmän tason App-komponentin. Vite on työkalu, joka ajaa kehityspalvelinta ja kääntää projektin.'],
        ['Virtuaalinen DOM', 'Kun tila muuttuu, React kutsuu komponenttejasi uudelleen, vertaa uutta tulosta edelliseen ja muuttaa vain ne DOM-solmut, jotka todella eroavat.'],
      ],
    ],
    [
      'JSX',
      [
        ['JSX', 'JSX on syntaksi, joka näyttää HTML:ltä mutta sijaitsee JavaScriptin sisällä. Käännöstyökalu kääntää sen tavallisiksi funktiokutsuiksi; selaimet eivät osaa suorittaa sitä suoraan.'],
        ['Yksi juurielementti', 'Komponentin on palautettava yksi juurielementti. Jos haluat palauttaa useita sisaruksia ilman ylimääräistä div-elementtiä, kääri ne fragmenttiin, joka kirjoitetaan tyhjänä tagiparina.'],
        ['Aaltosulkeet JSX:ssä', 'Aaltosulkeet vaihtavat merkkauksesta takaisin JavaScriptiin. Niiden sisään voi kirjoittaa minkä tahansa lausekkeen: muuttujan, laskutoimituksen, funktiokutsun tai ternary-lausekkeen. Lauseet, kuten `if` ja `for`, eivät käy.'],
        ['JSX:n erot HTML:ään', 'Käytä `className`-attribuuttia class-attribuutin ja `htmlFor`-attribuuttia for-attribuutin sijaan. Tapahtumien nimet kirjoitetaan camelCase-muodossa, kuten `onClick`. Jokainen tagi on suljettava. `style`-attribuutti saa arvokseen olion, ei merkkijonoa.'],
        ['Ehdollinen renderöinti', 'Valitse kahden vaihtoehdon välillä ternary-operaattorilla, näytä jotakin tai ei mitään kahdella et-merkillä kirjoitettavalla ja-operaattorilla, tai poimi JSX muuttujaan tavallisella `if`- tai `switch`-lauseella ennen return-lausetta.'],
        ['Listojen renderöinti', 'Muunna datataulukko elementtitaulukoksi `map`-metodilla. Jokainen listan elementti tarvitsee `key`-propin.'],
        ['Avaimet', 'Avaimen eli key-propin on oltava sisarusten kesken yksilöllinen ja pysyttävä samana renderöintien välillä. Se kertoo Reactille, mikä kohta on mikä, kun lista muuttuu. Käytä datasta saatavaa id:tä; taulukon indeksi hajoaa, kun kohtia järjestetään uudelleen tai poistetaan.'],
      ],
    ],
    [
      'Propsit',
      [
        ['Propsit', 'Propsit ovat syötteitä, jotka vanhempi välittää lapsikomponentille, ja ne kirjoitetaan kuten HTML-attribuutit. Lapsi saa ne kaikki yhtenä oliona.'],
        ['Propsit ovat vain luettavia', 'Komponentti ei saa koskaan muuttaa omia propsejaan. Jos arvon täytyy muuttua ajan myötä, se kuuluu tilaan.'],
        ['Propsien destrukturointi', 'Sen sijaan, että kirjoittaisit kaikkialle `props.name`, pura propsit suoraan parametrilistassa.'],
        ['Arvojen välittäminen', 'Merkkijonon voi välittää lainausmerkeissä. Kaikki muu kirjoitetaan aaltosulkeisiin: luvut, totuusarvot, oliot, taulukot ja funktiot.'],
        ['Yksisuuntainen tietovirta', 'Data kulkee alaspäin vanhemmalta lapselle propsien kautta. Kun jotakin pitää lähettää takaisin ylöspäin, vanhempi välittää funktion propsina ja lapsi kutsuu sitä.'],
      ],
    ],
    [
      'Tila',
      [
        ['Tila', 'Tila on komponentin muisti: dataa, joka muuttuu ajan myötä ja vaikuttaa siihen, mitä renderöidään. Kun tila muuttuu, React renderöi komponentin uudelleen.'],
        ['useState', '`useState` palauttaa parin: nykyisen arvon ja funktion, jolla sitä muutetaan. Argumentti on alkuarvo, jota käytetään vain ensimmäisellä renderöinnillä.'],
        ['Miksi tavallinen muuttuja ei riitä', 'Paikallinen muuttuja luodaan uudelleen jokaisella renderöinnillä, joten sen arvo katoaa. Sen muuttaminen ei myöskään kerro Reactille, että pitää renderöidä uudelleen, joten ruutu ei koskaan päivity.'],
        ['Tilan asettaminen käynnistää renderöinnin', 'Asetusfunktion kutsuminen tekee kaksi asiaa: se tallentaa uuden arvon ja pyytää Reactia kutsumaan komponenttifunktiota uudelleen tällä arvolla.'],
        ['Tila on tilannekuva', 'Yhden renderöinnin aikana tilamuuttuja ei koskaan muutu. Asetusfunktion kutsun jälkeen muuttujassa on yhä vanha arvo seuraavaan renderöintiin asti, joten sen tulostaminen heti näyttää vanhan arvon.'],
        ['Päivitysfunktio', 'Kun annat asetusfunktiolle funktion, se saa viimeisimmän odottavan arvon. Käytä sitä aina, kun uusi tila riippuu vanhasta, etenkin kun päivität tilaa useammin kuin kerran samassa käsittelijässä.'],
        ['Tila on jokaisen ilmentymän oma', 'Jos renderöit saman komponentin kolme kertaa, jokaisella on oma erillinen tilansa. Yhden muuttaminen ei vaikuta muihin.'],
        ['Älä koskaan muuta tilaa suoraan', 'Kohtele tilaa vain luettavana ja anna asetusfunktiolle aina uusi taulukko tai olio. React vertaa viittauksia: jos muutat olemassa olevaa taulukkoa ja annat saman takaisin, React ei näe muutosta eikä renderöi.'],
      ],
    ],
    [
      'Taulukot ja oliot tilassa',
      [
        ['Lisääminen tilassa olevaan taulukkoon', 'Luo uusi taulukko spread-syntaksilla ja uudella alkiolla. Älä käytä `push`-metodia.'],
        ['Poistaminen tilassa olevasta taulukosta', 'Rakenna `filter`-metodilla uusi taulukko, jossa poistettavaa alkiota ei ole.'],
        ['Alkion muuttaminen tilassa olevassa taulukossa', 'Käytä `map`-metodia. Palauta täsmäävästä alkiosta spreadilla tehty muutettu kopio ja kaikki muut alkiot sellaisinaan.'],
        ['Tilassa olevan olion päivittäminen', 'Levitä vanha olio uuteen spreadilla ja korvaa ne ominaisuudet, jotka muuttuvat.'],
      ],
    ],
    [
      'Tapahtumat Reactissa',
      [
        ['Tapahtumankäsittelijät', 'Välitä `onClick`-propille funktio. Jos kirjoitat funktion nimen sulkeiden kanssa, sitä kutsutaan renderöinnin aikana eikä napsautettaessa. Kun haluat välittää argumentin, kääri kutsu nuolifunktioon.'],
        ['Kontrolloitu syöte', 'Kontrolloitu syötekenttä saa `value`-arvonsa tilasta ja päivittää tilaa `onChange`-käsittelijässä. Tila on ainoa totuuden lähde, joten kenttä näyttää aina täsmälleen sen, mitä tilassa on.'],
        ['Kontrolloimaton syöte', 'Syötekenttä ilman `value`-propia säilyttää oman arvonsa DOMissa. Voit silti kuunnella `onChange`-tapahtumaa, mutta React ei päätä, mitä kenttä näyttää.'],
        ['Reactin tapahtumaolio', 'Käsittelijät saavat tapahtumaolion, joka toimii kuten selaimen oma: `event.target.value` antaa kentän sisällön, ja `event.preventDefault()` estää lomaketta lataamasta sivua uudelleen.'],
      ],
    ],
    [
      'Reactin ajattelutapa',
      [
        ['Reactin ajattelutapa', 'Viisi vaihetta: jaa käyttöliittymä komponenttihierarkiaksi, rakenna staattinen versio propseilla, etsi pienin tarvittava tila, päätä, mikä komponentti omistaa minkäkin tilan, ja lisää callbackit, jotka lähettävät muutokset takaisin ylöspäin.'],
        ['Mikä kuuluu tilaan', 'Arvo ei ole tilaa, jos se ei koskaan muutu, jos se tulee vanhemmalta propsina tai jos sen voi laskea muusta tilasta tai propseista. Laske johdetut arvot renderöinnin aikana sen sijaan, että tallentaisit ne.'],
        ['Tilan nostaminen', 'Kun kaksi komponenttia tarvitsee samaa dataa, siirrä tila niiden lähimpään yhteiseen vanhempaan. Vanhempi välittää arvon alas propsina yhdessä funktion kanssa, jota lapset kutsuvat muuttaakseen arvoa.'],
        ['Renderöinti ja commit', 'Jokaisessa päivityksessä on kolme vaihetta. Käynnistys: ensimmäinen renderöinti tai tilan muutos. Renderöinti: React kutsuu komponenttejasi. Commit: React vie erot DOMiin.'],
        ['Renderöinnin on oltava puhdasta', 'Samoilla propseilla ja samalla tilalla komponentin pitää palauttaa sama JSX eikä muuttaa mitään itsensä ulkopuolella. Sivuvaikutukset kuuluvat tapahtumankäsittelijöihin tai efekteihin.'],
      ],
    ],
  ],

  questions: [
    [
      'Miksi React-komponentin nimen on alettava isolla kirjaimella?',
      ['Pienellä alkavat nimet tulkitaan JSX:ssä sisäänrakennetuiksi HTML-tageiksi', 'JavaScript-funktioiden nimet on aina kirjoitettava isolla alkukirjaimella', 'Isolla kirjaimella alkavat funktiot ovat nopeampia', 'Se on vain tyylikäytäntö, jolla ei ole vaikutusta'],
      'React päättelee asian ensimmäisestä kirjaimesta: `<div>` on HTML-elementti, `<Greeting>` on oma komponenttisi.',
    ],
    [
      'Mikä JSX on?',
      ['Syntaksilaajennus, joka käännetään JavaScript-funktiokutsuiksi', 'Mallikieli, jota selaimet suorittavat suoraan', 'HTML:n uusi versio', 'CSS-in-JavaScript-kirjasto'],
      'JSX vain näyttää HTML:ltä. Käännöstyökalu, kuten Vite, kääntää sen JavaScriptiksi ennen kuin selain näkee sen.',
    ],
    [
      'Mikä tässä komponentissa on vialla?',
      ['Se palauttaa kaksi sisaruselementtiä ilman yhtä juurta', 'Funktion nimen pitää alkaa pienellä kirjaimella', 'JSX:ää ei voi kääriä sulkeisiin', 'Ei mikään; se renderöi otsikon ja kappaleen'],
      'Komponentti palauttaa yhden juurielementin. Kääri sisarukset div-elementtiin tai fragmenttiin: `<>...</>`.',
    ],
    ['Millä attribuutilla CSS-luokka asetetaan JSX:ssä?', null, '`class` on JavaScriptissä varattu sana, joten JSX käyttää nimeä `className`.'],
    [
      'Käyttäjä napsauttaa painiketta kolme kertaa. Mitä painikkeessa lukee?',
      [null, null, null, 'Ensimmäinen napsautus aiheuttaa virheen'],
      'Paikallisen muuttujan muuttaminen ei käynnistä renderöintiä, joten ruutu ei koskaan päivity. Tähän tarvitaan `useState`.',
    ],
    [
      'count on 0, ja painiketta napsautetaan kerran. Mitä tulostuu?',
      ['`Before: 0` ja sitten `After: 0`', '`Before: 0` ja sitten `After: 1`', '`Before: 1` ja sitten `After: 1`', '`Before: 0` ja sitten `After: undefined`'],
      'Tila on tilannekuva. Muuttuja säilyttää arvonsa koko renderöinnin ajan; uusi arvo tulee vasta seuraavan renderöinnin mukana.',
    ],
    ['count on 0. Mikä count on yhden napsautuksen jälkeen?', null, 'Tässä renderöinnissä count on 0, joten kaikki kolme kutsua sanovat: aseta arvoksi 1.'],
    ['count on 0. Mikä count on yhden napsautuksen jälkeen?', null, 'Päivitysfunktio saa viimeisimmän odottavan arvon, joten kolme päivitystä rakentuvat toistensa päälle.'],
    [
      'Uusi tehtävä lisätään, mutta ruudulla näkyvä lista ei muutu. Miksi?',
      ['Takaisin annetaan sama taulukko, joten React ei näe muutosta', '`push` ei voi lisätä olioita taulukkoon', '`setTodos` on kutsuttava ennen `push`-metodia', 'Tilassa olevat taulukot on jäädytetty, joten `push` aiheuttaa virheen'],
      'React vertaa vanhaa ja uutta tilaa viittauksen perusteella. Luo sen sijaan uusi taulukko: `setTodos([...todos, newTodo])`.',
    ],
    [
      'Mikä rivi poistaa oikein tilasta tehtävän, jolla on annettu id?',
      null,
      'filter palauttaa uuden taulukon, jossa on kaikki paitsi täsmäävä alkio. Vaihtoehto, jossa vertailu on `===`, säilyttäisi vain sen alkion, jonka halusit poistaa.',
    ],
    ['Mitä `toggleTodo(2)` jättää tilaan?', null, 'map säilyttää jokaisen alkion. Vain se, jonka id täsmää, korvataan kopiolla, jossa done on käännetty.'],
    [
      'Mikä tässä painikkeessa on ongelmana?',
      ['`deleteItem`-funktiota kutsutaan renderöinnin aikana, ei silloin kun painiketta napsautetaan', '`onClick`-propia ei voi käyttää painikkeessa', 'Tapahtumankäsittelijöille ei voi välittää argumentteja', 'Ei mikään; tämä on oikein'],
      'Sulkeet kutsuvat funktiota heti. Kääri kutsu nuolifunktioon: `onClick={() => deleteItem(todo.id)}`.',
    ],
    [
      'Voiko lapsikomponentti muuttaa saamiaan propseja?',
      ['Ei, propsit ovat vain luettavia; se pyytää vanhempaa muuttamaan arvoa kutsumalla propsina saatua funktiota', 'Kyllä, sijoittamalla arvon ominaisuuteen `props.name`', 'Kyllä, mutta vain tapahtumankäsittelijän sisällä', 'Kyllä, kutsumalla `setProps`-funktiota'],
      'Data kulkee yhteen suuntaan, vanhemmalta lapselle. Muutokset kulkevat takaisin ylös callback-propsien kautta.',
    ],
    [
      'Mihin `key`-propia käytetään listaa renderöitäessä?',
      ['Sen avulla React erottaa kohdat toisistaan renderöintien välillä', 'Se asettaa elementin `id`-attribuutin DOMiin', 'Se järjestää listan', 'Se välitetään lapselle nimellä `props.key`'],
      'Avaimet antavat jokaiselle kohdalle pysyvän identiteetin, jotta React osaa yhdistää vanhat ja uudet kohdat. Lapsi ei saa avainta propsina.',
    ],
    [
      'Ostoskori on tyhjä, joten `count` on 0. Mitä tämä renderöi div-elementin sisään?',
      [null, 'Ei mitään', null, null],
      'Ja-operaattori palauttaa vasemman puolensa, kun se on epätosi, ja React renderöi luvun 0. Kirjoita sen sijaan `count > 0 && ...`.',
    ],
    [
      'Kahden sisaruskomponentin täytyy näyttää ja muuttaa samaa arvoa. Missä tilan pitäisi sijaita?',
      ['Niiden lähimmässä yhteisessä vanhemmassa, josta se välitetään alas propseina', 'Molemmissa komponenteissa, efekteillä synkronoituna', 'Globaalissa muuttujassa Reactin ulkopuolella', 'Siinä sisaruksessa, joka renderöidään ensin'],
      'Tämä on tilan nostamista. Vanhempi omistaa tilan ja antaa lapsille arvon sekä funktion, jolla sitä muutetaan.',
    ],
    [
      'Missä järjestyksessä Reactin päivityksen kolme vaihetta tapahtuvat?',
      ['Käynnistys, renderöinti, commit', 'Renderöinti, käynnistys, commit', 'Commit, renderöinti, käynnistys', 'Käynnistys, commit, renderöinti'],
      'Jokin käynnistää päivityksen, React kutsuu komponenttejasi renderöidäkseen ne ja vie sitten muutokset DOMiin commit-vaiheessa.',
    ],
    [
      'Käyttäjä kirjoittaa tähän kenttään `ab` kirjain kerrallaan. Mitä kentässä näkyy?',
      [null, null, null, 'Ei mitään; kenttä pysyy tyhjänä'],
      'Kontrolloidussa kentässä näkyy se, mitä tilassa on, ja tässä käsittelijä tallentaa tekstin isoiksi kirjaimiksi muutettuna.',
    ],
  ],
}
