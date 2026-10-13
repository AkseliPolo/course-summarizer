// Finnish translation of week 3. Same order as ../w3.js, item for item; code examples are shared.

export default {
  label: 'Viikko 3',
  title: 'DOM',
  blurb: 'DOM-puu, elementtien valitseminen ja muuttaminen, tapahtumat ja delegointi, lomakkeet, dynaamisen sisällön rakentaminen ja localStorage.',
  topics: [
    [
      'DOM',
      [
        ['Mikä DOM on', 'Dokumenttioliomalli eli DOM on selaimen HTML:stä rakentama elävä oliopuu. JavaScript muuttaa käyttäjän näkemää sivua muuttamalla tätä puuta, ei muokkaamalla HTML-tiedostoa.'],
        ['document-olio', 'Globaali `document`-olio on puun sisäänkäynti. Jokainen sivun elementti, tekstinpätkä ja kommentti on solmu jossakin sen alla.'],
        ['Mihin skriptit sijoitetaan', 'Skripti suoritetaan heti, kun selain tulee sen kohdalle. Jos se suoritetaan ennen kuin elementit ovat olemassa, valitsimet palauttavat arvon null. Sijoita skripti body-osan loppuun tai lataa se `defer`-attribuutilla tai määrityksellä `type="module"`.'],
        ['ES-moduulit', 'Tiedosto voi viedä funktioita ja arvoja `export`-sanalla, ja toinen tiedosto voi tuoda ne nimen perusteella `import`-sanalla. Selaimessa aloitusskripti on ladattava määrityksellä `type="module"`.'],
      ],
    ],
    [
      'Elementtien valitseminen',
      [
        ['querySelector', '`document.querySelector` ottaa minkä tahansa CSS-valitsimen ja palauttaa ensimmäisen siihen täsmäävän elementin, tai arvon null, jos mikään ei täsmää.'],
        ['querySelectorAll', '`document.querySelectorAll` palauttaa NodeList-kokoelman kaikista osumista. NodeListillä on `forEach`, ja se toimii `for...of`-silmukassa, mutta se ei ole taulukko: siinä ei ole `map`- eikä `filter`-metodia, ennen kuin muunnat sen taulukoksi `Array.from`-funktiolla.'],
        ['getElementById', '`document.getElementById` hakee yhden elementin sen id:n perusteella. Toisin kuin `querySelector`-metodille, id annetaan ilman risuaitaa.'],
        ['closest', '`element.closest` ottaa valitsimen ja kulkee elementistä ylöspäin. Se palauttaa lähimmän valitsimeen täsmäävän esivanhemman tai elementin itsensä, ja arvon null, jos sellaista ei ole.'],
      ],
    ],
    [
      'Sivun muuttaminen',
      [
        ['textContent', '`textContent` lukee tai korvaa elementin sisällä olevan tekstin. Kaikki, mitä siihen sijoitat, näytetään pelkkänä tekstinä, joten tagit näkyvät ruudulla sellaisinaan. Siksi se on turvallinen käyttäjän syötteelle.'],
        ['innerHTML', '`innerHTML` jäsentää sijoittamasi merkkijonon HTML:nä ja rakentaa siitä elementtejä. Älä koskaan käytä sitä käyttäjältä tulleen tekstin kanssa, koska sen kautta sivullesi voidaan ujuttaa skriptejä.'],
        ['classList', '`classList` lisää, poistaa ja vaihtaa CSS-luokkia koskematta muihin luokkiin. `toggle` lisää luokan, jos se puuttuu, ja poistaa sen, jos se on jo olemassa.'],
        ['Attribuutit ja data-attribuutit', '`setAttribute` ja `getAttribute` kirjoittavat ja lukevat minkä tahansa attribuutin. Oma data tallennetaan attribuutteihin, joiden nimi alkaa `data-`. Takaisin luettu arvo on aina merkkijono, vaikka olisit tallentanut luvun.'],
        ['Elementtien luominen', 'Elementin rakentamisessa on kolme vaihetta: luo se `document.createElement`-metodilla, täytä sen sisältö ja luokat ja liitä se sitten sivulle `append`-metodilla. Elementti ei näy ennen kuin se on liitetty.'],
        ['Poistaminen ja tyhjentäminen', 'Kutsu `element.remove()`, kun haluat poistaa yhden elementin sivulta. Säiliön saa tyhjennettyä asettamalla sen `textContent`- tai `innerHTML`-ominaisuudeksi tyhjän merkkijonon.'],
        ['Render-malli', 'Pidä data JavaScript-taulukossa ja kirjoita yksi render-funktio, joka tyhjentää säiliön ja rakentaa kaikki elementit uudelleen datasta. Kutsu render-funktiota uudelleen aina, kun data muuttuu.'],
      ],
    ],
    [
      'Tapahtumat',
      [
        ['addEventListener', '`addEventListener` ottaa tapahtuman nimen ja funktion ja kutsuu funktiota aina, kun kyseinen tapahtuma sattuu elementissä. Funktiota sanotaan tapahtumankuuntelijaksi. Välitä itse funktio; älä kutsu sitä.'],
        ['Tapahtumaolio', 'Käsittelijä saa tapahtumaolion, joka kuvaa, mitä tapahtui. `event.target` on elementti, josta tapahtuma lähti, ja tekstikentän kohdalla `event.target.value` on kentän nykyinen sisältö.'],
        ['target vai currentTarget', '`event.target` on sisin elementti, jota todella napsautettiin. `event.currentTarget` on elementti, johon kuuntelija on liitetty. Ne eroavat aina, kun napsautus osuu lapsielementtiin.'],
        ['preventDefault', '`event.preventDefault()` peruu selaimen oman reaktion tapahtumaan, kuten sivun uudelleenlatauksen lomaketta lähetettäessä tai linkin seuraamisen sitä napsautettaessa.'],
        ['Kupliminen', 'Kun tapahtuma on lauennut elementissä, se kulkee ylöspäin jokaisen esivanhemman kautta dokumenttiin asti ja suorittaa myös niiden kuuntelijat samalle tapahtumalle. `event.stopPropagation()` pysäyttää matkan.'],
        ['Tapahtumien delegointi', 'Sen sijaan, että jokaisella kohdalla olisi oma kuuntelija, liitä yksi kuuntelija niiden yhteiseen vanhempaan ja selvitä `event.target`-ominaisuuden ja `closest`-metodin avulla, mihin kohtaan osuttiin. Tämä toimii kuplimisen ansiosta ja kattaa myös myöhemmin lisätyt kohdat.'],
        ['Yleiset tapahtumat', '`click` painikkeille, `input` aina kun kentän arvo muuttuu, `change` kun muutos vahvistetaan, `submit` lomakkeelle, `keydown` näppäinpainalluksille ja `DOMContentLoaded`, kun HTML on jäsennetty.'],
      ],
    ],
    [
      'Lomakkeet',
      [
        ['submit-tapahtuma', 'Kuuntele `submit`-tapahtumaa lomake-elementissä äläkä painikkeen napsautusta, jotta myös Enterin painaminen toimii. Kutsu ensin `preventDefault`-metodia, muuten selain lataa sivun uudelleen.'],
        ['Kenttien arvojen lukeminen', 'Kentän `value` on aina merkkijono, myös numerokentässä, joten muunna se `Number`-funktiolla ennen laskemista. Valintaruutu käyttää sen sijaan totuusarvoista `checked`-ominaisuutta.'],
        ['Validointi', 'HTML-attribuutit, kuten `required`, `type`, `min` ja `maxlength`, antavat perusvalidoinnin ilmaiseksi. JavaScriptissä siisti arvo `trim`-metodilla ja hylkää se, jos se on tyhjä.'],
        ['Reaaliaikainen suodatus', 'Kuuntele hakukentän `input`-tapahtumaa, suodata datataulukko `includes`-metodilla ja renderöi tulos. Muunna molemmat puolet `toLowerCase`-metodilla, jotta haku ei välitä kirjainkoosta.'],
      ],
    ],
    [
      'localStorage',
      [
        ['Mikä localStorage on', 'Selaimeen sisäänrakennettu avain–arvo-varasto. Data säilyy sivun uudelleenlatausten ja selaimen uudelleenkäynnistysten yli, ja jokaisella originilla on oma erillinen varastonsa.'],
        ['localStoragen rajapinta', '`setItem` tallentaa arvon avaimen alle, `getItem` lukee sen takaisin, `removeItem` poistaa yhden avaimen ja `clear` poistaa kaiken. Jos avainta ei ole, lukeminen antaa arvon null.'],
        ['Vain merkkijonoja', 'localStorageen voi tallentaa vain merkkijonoja. Tallenna taulukko tai olio `JSON.stringify`-funktiolla ja lue se takaisin `JSON.parse`-funktiolla. Varaudu oletusarvolla ensimmäiseen käyntikertaan, jolloin mitään ei ole vielä tallennettu.'],
        ['sessionStorage', '`sessionStorage`-varastolla on sama rajapinta, mutta sen data tyhjennetään, kun välilehti suljetaan.'],
        ['localStoragen rajoitukset', 'Siihen mahtuu noin viisi megatavua, se on synkroninen, ja mikä tahansa sivun skripti voi lukea sitä, joten älä koskaan tallenna sinne salasanoja tai salaisuuksia. Toisin kuin evästeitä, sitä ei lähetetä palvelimelle.'],
      ],
    ],
  ],

  questions: [
    [
      'Mikä DOM on?',
      ['Oliopuu, jonka selain rakentaa HTML:stä ja jota JavaScript voi lukea ja muuttaa', 'HTML-tiedosto sellaisena kuin se on tallennettu palvelimelle', 'JavaScript-kirjasto käyttöliittymien rakentamiseen', 'CSS:n osa, joka määrää asettelun'],
      'DOM on selaimen muistissa oleva malli sivusta. Sen muuttaminen muuttaa sitä, mitä ruudulla näkyy; itse HTML-tiedostoa ei koskaan muuteta.',
    ],
    [
      'Mitä sivulla näkyy?',
      ['Teksti `<h1>Hello World!</h1>` sellaisenaan, tagit mukaan lukien', 'Suuri otsikko, jossa lukee Hello World!', 'Alkuperäinen sana Test', 'Ei mitään; div tyhjennetään'],
      '`textContent` ei koskaan jäsennä HTML:ää, joten tagit näytetään tavallisina merkkeinä. `innerHTML` olisi tuottanut otsikon.',
    ],
    [
      'Sivulla ei ole elementtiä, jolla on luokka `sidebar`. Mitä tämä tulostaa?',
      [null, null, 'Tyhjän taulukon', 'Syntyy virhe'],
      '`querySelector` palauttaa arvon null, kun mikään ei täsmää. Virhe tulee vasta myöhemmin, kun yrität käyttää null-arvon ominaisuutta.',
    ],
    [
      'Mitä tapahtuu, kun tämä suoritetaan sivulla, jolla on kolme listan kohtaa?',
      ['TypeError: `items.map` ei ole funktio', '`texts` on kolmen merkkijonon taulukko', '`texts` on kolmen merkkijonon NodeList', '`texts` on `undefined`'],
      'NodeListillä on `forEach` mutta ei `map`-metodia. Muunna se ensin: `Array.from(items).map(...)`.',
    ],
    ['Mitä tämä tulostaa?', null, 'toggle poistaa luokan, joka on olemassa, ja lisää luokan, joka puuttuu. `open` poistetaan, `active` lisätään ja `card` jää ennalleen.'],
    [
      'Sivulla ei näy mitään uutta tämän koodin suorittamisen jälkeen. Miksi?',
      ['Elementti luotiin, mutta sitä ei koskaan liitetty sivulle', '`createElement` toimii vain div-elementeille', '`textContent`-ominaisuutta ei voi asettaa uudelle elementille', 'Skriptin pitää kutsua sen jälkeen `render()`-funktiota'],
      'Luotu elementti on olemassa vain muistissa, kunnes liität sen sivulle esimerkiksi kutsulla `document.body.append(title)`.',
    ],
    [
      'Mikä tässä rivissä on vialla?',
      ['`handleClick` suoritetaan heti, ja sen paluuarvo rekisteröidään kuuntelijaksi', 'Ei mikään; näin kuuntelija kuuluu lisätä', 'Tapahtuman nimen pitäisi olla `onclick`', '`addEventListener` tarvitsee kolmannen argumentin'],
      "Sulkeet kutsuvat funktiota saman tien. Välitä itse funktio: `addEventListener('click', handleClick)`.",
    ],
    ['Käyttäjä napsauttaa Delete-painiketta. Mitä tulostuu?', null, '`target` on elementti, jota todella napsautettiin. `currentTarget` on elementti, johon kuuntelija on liitetty.'],
    [
      'Miksi listan yksi click-kuuntelija toimii myös kohdille, jotka lisätään listaan myöhemmin?',
      ['Click-tapahtumat kuplivat kohdasta ylös listaan, jossa kuuntelija on', 'Selain kopioi kuuntelijat automaattisesti uusiin lapsielementteihin', '`addEventListener` suoritetaan uudelleen aina, kun DOM muuttuu', 'Se ei toimi; jokainen uusi kohta tarvitsee oman kuuntelijansa'],
      'Tämä on tapahtumien delegointia. Kuuntelija on vanhemmassa, ja jokainen sen sisällä tapahtuva napsautus kuplii ylös riippumatta siitä, milloin lapsi on luotu.',
    ],
    [
      'Käyttäjä rastittaa ensimmäisen tehtävän valintaruudun. Mitä tapahtuu?',
      ["Mikään ei muutu, koska merkkijono `'1'` ei ole tiukasti yhtä suuri kuin luku `1`", 'Ensimmäinen tehtävä merkitään tehdyksi', 'Syntyy TypeError', 'Kaikki tehtävät merkitään tehdyiksi'],
      '`getAttribute` palauttaa aina merkkijonon. Muunna se `Number`-funktiolla tai vertaa kahdella yhtäsuuruusmerkillä, kuten luentodemossa tehtiin.',
    ],
    ['Laskuri alkaa nollasta. Mitä se näyttää kolmen napsautuksen jälkeen?', null, 'Muuttuja esitellään käsittelijän sisällä, joten jokainen napsautus alkaa taas nollasta. Jotta tila säilyisi napsautusten välillä, esittele muuttuja käsittelijän ulkopuolella.'],
    ['Käyttäjä kirjoittaa kenttään 5. Mitä tulostuu?', null, 'Kentän arvo on aina merkkijono, myös kun `type="number"`. Plusmerkki merkkijonon kanssa yhdistää arvot peräkkäin. Käytä muotoa `Number(amount) + 1`.'],
    [
      'Käyttäjä kirjoittaa hakukenttään `lap`. Mitkä tuotteet näytetään?',
      ['Ei yhtään', 'Laptop', 'Laptop ja Tablet', 'Tablet'],
      '`includes` erottelee isot ja pienet kirjaimet, ja sanassa `Laptop` on iso L. Muunna molemmat puolet pieniksi kirjaimiksi, jotta haku ei välitä kirjainkoosta.',
    ],
    [
      'Mitä `event.preventDefault()` tekee lomakkeen submit-käsittelijässä?',
      ['Estää selainta lähettämästä lomaketta ja lataamasta sivua uudelleen', 'Estää tapahtumaa kuplimasta vanhempiin elementteihin', 'Tyhjentää lomakkeen kaikki kentät', 'Poistaa lähetyspainikkeen käytöstä'],
      'Submit-tapahtuman oletustoiminto on sivun vaihtuminen. Kuplimisen pysäyttää eri metodi, `stopPropagation`.',
    ],
    ['Mitä tämä tulostaa?', null, 'localStorage tallentaa kaiken merkkijonona. Luku 5 tulee takaisin merkkijonona 5.'],
    ['Mitä tämä tulostaa?', null, 'Olio muunnetaan merkkijonoksi oletustavalla, jolloin data katoaa. Tallenna se sen sijaan `JSON.stringify`-funktiolla.'],
    [
      'Mikä on localStoragen ja sessionStoragen ero?',
      ['sessionStorage tyhjennetään, kun välilehti suljetaan; localStorage säilyy', 'sessionStorage tallennetaan palvelimelle; localStorage selaimeen', 'sessionStorageen voi tallentaa olioita; localStorageen vain merkkijonoja', 'localStorage tyhjennetään jokaisella sivun uudelleenlatauksella'],
      'Molemmilla on sama rajapinta, ja molempiin voi tallentaa vain merkkijonoja. Ne eroavat vain siinä, kuinka kauan data säilyy.',
    ],
  ],
}
