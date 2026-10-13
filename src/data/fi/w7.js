// Finnish translation of week 7. Same order as ../w7.js, item for item; code examples are shared.

export default {
  label: 'Viikko 7',
  title: 'Express ja full stack',
  blurb: 'HTTP-metodit ja tilakoodit tarkemmin, Node.js, REST-rajapinnan rakentaminen Expressillä, CORS ja kehitysproxy, Reactin yhdistäminen backendiin sekä virheenkäsittely.',
  topics: [
    [
      'HTTP-metodit',
      [
        ['GET', 'GET lukee resurssin. Sillä ei ole runkoa, eikä se saa muuttaa palvelimella mitään.'],
        ['POST', 'POST luo uuden resurssin tai lähettää dataa, joka kulkee pyynnön rungossa. Saman POST-pyynnön lähettäminen kahdesti luo kaksi resurssia.'],
        ['PUT ja PATCH', 'PUT korvaa koko resurssin rungossa olevalla, joten jokainen kenttä on lähetettävä. PATCH muuttaa vain ne kentät, jotka ovat mukana.'],
        ['DELETE', 'DELETE poistaa URL-osoitteessa olevan resurssin.'],
        ['Turvalliset metodit', 'Metodi on turvallinen, jos se ei muuta palvelimella mitään. GET on turvallinen. POST, PUT, PATCH ja DELETE eivät ole.'],
        ['Idempotentit metodit', 'Metodi on idempotentti, jos saman pyynnön lähettäminen monta kertaa jättää palvelimen samaan tilaan kuin sen lähettäminen kerran. GET, PUT ja DELETE ovat idempotentteja. POST ei ole.'],
      ],
    ],
    [
      'Tilakoodit tarkemmin',
      [
        ['200 ja 201', '200 OK on yleinen onnistumisen koodi. 201 Created on vastaus POST-pyyntöön, joka loi jotakin; rungossa on tavallisesti uusi resurssi, ja Location-otsake kertoo sen URL-osoitteen.'],
        ['204 No Content', '204 tarkoittaa, että pyyntö onnistui ja runko on tarkoituksella tyhjä. Se on tavallinen vastaus onnistuneeseen DELETE-pyyntöön.'],
        ['400 Bad Request', '400 tarkoittaa, että itse pyyntö on virheellinen: rikkinäistä JSONia, puuttuva pakollinen kenttä tai väärän tyyppinen arvo. Asiakkaan on korjattava pyyntö.'],
        ['401 ja 403', '401 Unauthorized tarkoittaa, ettei palvelin tiedä, kuka olet: kirjaudu ensin sisään. 403 Forbidden tarkoittaa, että se tietää, kuka olet, eikä sinulla ole oikeutta.'],
        ['404 Not Found', '404 tarkoittaa, ettei tässä URL-osoitteessa ole resurssia, esimerkiksi koska id:tä ei ole olemassa.'],
        ['409 ja 422', '409 Conflict tarkoittaa, että pyyntö on ristiriidassa nykyisen tilan kanssa, esimerkiksi kaksoiskappaleen vuoksi. 422 Unprocessable Content tarkoittaa, että pyyntö on muodoltaan oikea mutta ei läpäise validointisääntöjä.'],
        ['500 Internal Server Error', '500 tarkoittaa, että palvelimen koodi kaatui virheeseen, jota se ei käsitellyt. Vika on palvelimessa, ei asiakkaassa.'],
      ],
    ],
    [
      'Node.js',
      [
        ['Node.js', 'Node.js suorittaa JavaScriptiä selaimen ulkopuolella. Siinä ei ole window-oliota, document-oliota eikä DOMia, mutta se voi lukea tiedostoja, kuunnella verkkoportteja ja keskustella tietokantojen kanssa.'],
        ['npm ja package.json', 'npm asentaa paketit `node_modules`-kansioon. `package.json` luettelee projektin riippuvuudet ja skriptit, joten kuka tahansa voi luoda kansion uudelleen komennolla `npm install`. `node_modules`-kansiota ei koskaan viedä gitiin.'],
        ['CommonJS ja ES-moduulit', 'Node tukee kahta moduulijärjestelmää. CommonJS käyttää `require`-funktiota ja `module.exports`-oliota. ES-moduulit käyttävät `import`- ja `export`-sanoja, ja ne otetaan käyttöön asettamalla `package.json`-tiedostossa type-kentän arvoksi module.'],
        ['Frontend vai backend', 'Frontend-koodi ladataan ja suoritetaan jokaisen käyttäjän selaimessa, joten käyttäjät voivat lukea ja muuttaa sitä. Backend-koodi suoritetaan palvelimella, jossa se voi säilyttää salaisuuksia, valvoa sääntöjä ja käyttää tietokantaa.'],
        ['Ympäristömuuttujat', 'Asetukset, jotka vaihtelevat koneiden välillä, kuten portti, luetaan `process.env`-oliosta, ja paikallista kehitystä varten annetaan oletusarvo.'],
      ],
    ],
    [
      'Express',
      [
        ['Express', 'Express on minimalistinen web-sovelluskehys Nodelle. Luot sovelluksen, rekisteröit siihen reitit ja middlewaret ja käynnistät sen kuuntelemaan porttia.'],
        ['Reitit', 'Reitti on HTTP-metodin ja polun yhdistelmä, jolla on käsittelijäfunktio. `app.get`, `app.post`, `app.put`, `app.patch` ja `app.delete` rekisteröivät kukin yhden reitin.'],
        ['req ja res', 'Jokainen käsittelijä saa kaksi oliota. `req` kuvaa saapuvan pyynnön: sen parametrit, kyselyn, rungon ja otsakkeet. `res`-oliolla lähetät vastauksen.'],
        ['Reittiparametrit', 'Kaksoispiste polussa merkitsee parametria. Polulla `/todos/:id` pyyntö osoitteeseen `/todos/42` asettaa arvon 42 kohtaan `req.params.id` merkkijonona. Muunna se `Number`-funktiolla, jos id:t ovat lukuja.'],
        ['Pyynnön runko', 'JSON-muotoinen pyynnön runko on saatavilla kohdassa `req.body`, mutta vain jos `express.json()`-middleware on rekisteröity. Ilman sitä `req.body` on undefined.'],
        ['Vastausten lähettäminen', '`res.json` lähettää datan JSONina tilakoodilla 200. Ketjuta eteen `res.status`, kun haluat valita toisen koodin. Jokaisen pyynnön on saatava täsmälleen yksi vastaus, joten kirjoita `return`, kun lähetät virheen.'],
        ['Middleware', 'Middleware eli väliohjelmisto on funktio, joka suoritetaan ennen reittien käsittelijöitä siinä järjestyksessä, jossa se on rekisteröity `app.use`-kutsulla. Se voi lukea tai muuttaa pyyntöä, ja sen on joko lähetettävä vastaus tai kutsuttava `next`-funktiota, joka päästää pyynnön eteenpäin.'],
        ['Virheenkäsittely-middleware', 'Express tunnistaa virheenkäsittelijän sen neljästä parametrista: error, request, response ja next. Rekisteröi se viimeisenä. Siinä odottamattomat virheet muutetaan 500-vastaukseksi.'],
      ],
    ],
    [
      'REST-rajapinnan rakentaminen',
      [
        ['CRUD-reitit', 'Täydellisellä resurssilla on viisi reittiä: GET koko kokoelmalle, GET yhdelle alkiolle id:n perusteella, POST luomiseen, PUT tai PATCH alkion päivittämiseen id:n perusteella ja DELETE alkion poistamiseen id:n perusteella.'],
        ['POST-käsittelijä', 'Validoi runko ja vastaa koodilla 400, jos se on virheellinen. Muuten rakenna uusi olio, jonka id luodaan palvelimella, tallenna se ja vastaa koodilla 201 ja luodulla oliolla.'],
        ['Validointi palvelimella', 'Älä koskaan luota asiakkaalta tulevaan dataan. Kuka tahansa voi lähettää minkä tahansa pyynnön, joten palvelimen on tarkistettava jokainen kenttä itse, vaikka React-lomake jo validoisi syötteen.'],
        ['Data muistissa', 'Taulukkomuuttujassa pidettävä data on olemassa vain niin kauan kuin palvelinprosessi on käynnissä. Palvelimen uudelleenkäynnistys hävittää sen kokonaan. Oikeat sovellukset tallentavat datan tietokantaan.'],
        ['Tuntemattomat reitit', 'Viimeinen `app.use` ilman polkua ottaa kiinni jokaisen pyynnön, johon mikään aiempi reitti ei vastannut. Lähetä siinä 404 JSONina, jotta rajapinnan asiakkaat eivät koskaan saa HTML-sivua.'],
      ],
    ],
    [
      'CORS ja kehitysproxy',
      [
        ['Origin', 'Origin eli alkuperä on skeeman, isäntänimen ja portin yhdistelmä. Localhost portissa 5173 ja localhost portissa 3000 ovat kaksi eri originia, koska portit eroavat.'],
        ['Saman alkuperän käytäntö', 'Turvallisuussyistä selain ei anna JavaScriptin lukea eri originista tulevaa vastausta, ellei kyseinen palvelin nimenomaisesti salli sitä.'],
        ['CORS', 'Cross-Origin Resource Sharing on tapa, jolla palvelin antaa tuon luvan. Se lisää vastauksiinsa otsakkeen `Access-Control-Allow-Origin`, joka nimeää originit, jotka saavat lukea vastaukset.'],
        ['Kuka valvoo CORSia', 'CORSia valvoo selain, ei palvelin. Se ei vaikuta lainkaan työkaluihin, kuten curliin tai Postmaniin. Siksi CORS-virhe korjataan aina palvelimen päässä, ei koskaan React-koodissa.'],
        ['cors-middleware', 'Asenna Expressissä `cors`-paketti ja rekisteröi se ennen reittejä. Se lisää oikeat otsakkeet ja vastaa selaimen preflight-pyyntöihin.'],
        ['Preflight-pyyntö', 'Ennen originien välistä pyyntöä, joka lähettää JSONia tai käyttää metodia PUT, PATCH tai DELETE, selain lähettää ensin OPTIONS-pyynnön ja kysyy, onko varsinainen pyyntö sallittu.'],
        ['Kehitysproxy', 'Vaihtoehto on välttää originien ylittäminen kokonaan. Viten kehityspalvelin voi toimia välityspalvelimena ja ohjata jokaisen polulla `/api` alkavan pyynnön Express-palvelimelle. Selain keskustelee vain oman origininsa kanssa, joten CORS ei tule lainkaan kuvaan.'],
        ['Käännetyn sovelluksen tarjoilu Expressistä', 'Tuotannossa Express voi itse tarjoilla käännetyt React-tiedostot `express.static`-middlewarella. Frontend ja rajapinta jakavat silloin saman originin.'],
      ],
    ],
    [
      'Reactin yhdistäminen backendiin',
      [
        ['Full stack -arkkitehtuuri', 'React-sovellus toimii selaimessa ja pitää käyttöliittymän tilan. Express-palvelin omistaa datan. Ne viestivät vain HTTP-pyynnöillä, joissa kulkee JSONia.'],
        ['Lataaminen komponentin ilmestyessä', 'Hae alkudata efektissä, jolla on tyhjä riippuvuustaulukko, ja tallenna tulos tilaan.'],
        ['Luominen rajapinnan kautta', 'Lähetä POST, odota vastausta ja lisää palvelimen palauttama olio tilaan. Käytä palvelimen versiota, koska siinä on palvelimen luoma id.'],
        ['Fetch-kääre', 'Sijoita toistuva työ yhteen funktioon: lisää polun alkuosa, aseta JSON-otsake, jäsennä runko ja heitä Error, kun `response.ok` on false. Komponentit käsittelevät silloin vain dataa tai kiinni otettua virhettä.'],
        ['Kaksoislähetysten estäminen', 'Pidä tilassa lippu, joka kertoo lähetyksen olevan käynnissä. Aseta se arvoon true ennen pyyntöä ja takaisin arvoon false `finally`-lohkossa, ja poista lomake käytöstä, kun lippu on true.'],
      ],
    ],
    [
      'Virheenkäsittely',
      [
        ['try, catch ja finally', 'Kun `try`-lohkon sisällä heitetään virhe, lohkon loppuosa ohitetaan ja `catch` suoritetaan. `finally` suoritetaan sen jälkeen joka tapauksessa, onnistuipa koodi tai ei.'],
        ['Virheiden heittäminen', 'Luo oma virhe lauseella `throw new Error` ja anna sille viesti. Viesti on saatavilla catch-lohkossa kohdassa `error.message`.'],
        ['Kaksi tapaa, joilla fetch epäonnistuu', 'Verkkovirhe saa fetchin promisen hylätyksi, joten se päätyy `catch`-lohkoon itsestään. HTTP-virhekoodi ei tee niin: promise täyttyy, ja sinun on itse tarkistettava `response.ok` ja heitettävä virhe.'],
        ['Virheet promise-ketjuissa', 'Ketjun lopussa oleva `catch` käsittelee hylkäyksen mistä tahansa sitä edeltävästä vaiheesta, myös `then`-käsittelijän sisällä heitetyn virheen. Hylätty promise, jota mikään ei ota kiinni, raportoidaan konsolissa käsittelemättömänä virheenä.'],
        ['try ja catch tarvitsevat awaitin', '`try`-lohko ottaa hylätyn promisen kiinni vain, jos odotat sitä `await`-sanalla lohkon sisällä. Ilman `await`-sanaa funktio on jo edennyt, kun hylkäys tapahtuu, ja virhe jää käsittelemättä.'],
        ['Virheiden näyttäminen käyttäjälle', 'Tallenna virheilmoitus tilaan ja renderöi se, mieluiten niin, että käyttäjä voi yrittää uudelleen. Epäonnistunut pyyntö ei saa koskaan jättää käyttäjää katsomaan tyhjää tai jumiutunutta ruutua.'],
      ],
    ],
  ],

  questions: [
    ['Mikä näistä HTTP-metodeista EI ole idempotentti?', null, 'POST-pyynnön toistaminen luo joka kerta uuden resurssin. GET-, PUT- tai DELETE-pyynnön toistaminen jättää palvelimen samaan tilaan kuin yksi pyyntö.'],
    [
      'Mitä tarkoittaa, että HTTP-metodi on "turvallinen"?',
      ['Se ei muuta palvelimella mitään', 'Se lähetetään aina salatun yhteyden yli', 'Sen voi toistaa samalla lopputuloksella', 'Se vaatii, että käyttäjä on kirjautunut sisään'],
      'Turvallinen tarkoittaa vain lukevaa. Toistettavuus samalla vaikutuksella on idempotenssia, joka on eri ominaisuus.',
    ],
    ['Minkä tilakoodin onnistuneen `POST /todos` -pyynnön pitäisi palauttaa?', null, '201 kertoo, että uusi resurssi luotiin. Rungossa on tavallisesti tuo resurssi ja siinä palvelimen luoma id.'],
    [
      'Tehtävä poistetaan onnistuneesti, eikä palvelin lähetä runkoa. Mikä tilakoodi sopii?',
      [null, null, null, '200 OK ja tyhjä merkkijono'],
      '204 tarkoittaa onnistumista, jossa runko on tarkoituksella tyhjä.',
    ],
    [
      'Mikä on koodien 401 ja 403 ero?',
      ['401: palvelin ei tiedä, kuka olet. 403: se tietää, eikä sinulla ole oikeutta', '401: sinulla ei ole oikeutta. 403: palvelin ei tiedä, kuka olet', '401 on palvelimen virhe, 403 asiakkaan virhe', 'Ne tarkoittavat samaa'],
      '401 koskee tunnistautumista (kirjaudu ensin sisään). 403 koskee valtuutusta (olet kirjautunut, mutta sinulla ei ole oikeutta).',
    ],
    [
      'Asiakas lähettää `POST /todos` -pyynnön, jonka rungossa ei ole nimeä, ja nimi on pakollinen. Minkä tilakoodin palvelimen pitäisi palauttaa?',
      null,
      'Pyyntö on virheellinen ja asiakkaan on korjattava se, joten koodi on 4xx. 500 syyttäisi virheellisesti palvelinta.',
    ],
    [
      'Mikä Node.js on?',
      ['Ajoympäristö, joka suorittaa JavaScriptiä selaimen ulkopuolella', 'JavaScript-kehys käyttöliittymien rakentamiseen', 'C++:lla kirjoitettu web-palvelin', 'Tietokanta JSON-dokumenteille'],
      'Node on ympäristö. Express on Noden päällä toimiva sovelluskehys; React on käyttöliittymäkirjasto.',
    ],
    ['Mikä näistä EI ole käytettävissä Node.js:ssä?', null, 'Nodessa ei ole sivua, joten siinä ei ole `document`- eikä `window`-oliota eikä DOMia.'],
    ['Asiakas tekee pyynnön `GET /users/42`. Mitä palvelin lähettää?', null, 'Reittiparametrit ovat URL:n osia, joten ne ovat aina merkkijonoja.'],
    [
      'Asiakas lähettää tälle palvelimelle kelvollista JSONia. Mitä palvelin tulostaa?',
      [null, 'Jäsennetyn olion', 'JSONin merkkijonona', 'Tyhjän olion'],
      'Mikään ei jäsennä runkoa, koska `app.use(express.json())` puuttuu.',
    ],
    ['Millä tilakoodilla tämä reitti vastaa?', null, 'Jos et kutsu `res.status`-metodia, Express käyttää koodia 200.'],
    [
      'Palvelin tallentaa tehtävät numeerisilla id:illä. Asiakas tekee pyynnön `GET /todos/1`. Mitä se saa?',
      ["Tilakoodin 404, koska merkkijono `'1'` ei ole koskaan tiukasti yhtä suuri kuin luku `1`", 'Tilakoodin 200 ja Milk-tehtävän', 'Tilakoodin 500', 'Tilakoodin 400'],
      '`req.params.id` on merkkijono. Muunna se ensin: `Number(req.params.id)`.',
    ],
    [
      'Mitä middleware-funktion on tehtävä?',
      ['Joko lähetettävä vastaus tai kutsuttava `next()`', 'Kutsuttava aina `next()`, myös vastauksen lähettämisen jälkeen', 'Palautettava muokattu pyyntöolio', 'Oltava rekisteröity kaikkien reittien jälkeen'],
      'Jos se ei tee kumpaakaan, pyyntöön ei koskaan vastata ja asiakas odottaa, kunnes aikakatkaisu laukeaa.',
    ],
    [
      'Mistä Express tunnistaa virheenkäsittely-middlewaren?',
      ['Sillä on neljä parametria: error, req, res, next', 'Sen nimi alkaa sanalla `error`', 'Se rekisteröidään kutsulla `app.error()`', 'Se on ensimmäinen rekisteröity middleware'],
      'Neljän parametrin muoto on tunnusmerkki. Rekisteröi se reittien jälkeen.',
    ],
    [
      'Mitä tehtäville tapahtuu, kun palvelinprosessi käynnistetään uudelleen?',
      ['Ne kaikki katoavat, koska taulukko on olemassa vain muistissa', 'Ne palautetaan `package.json`-tiedostosta', 'Ne säilyvät, koska `const`-arvot ovat pysyviä', 'Ne tallennetaan selaimen localStorageen'],
      'Muuttuja on olemassa vain niin kauan kuin prosessi. Datan säilyttäminen uudelleenkäynnistysten yli vaatii tiedoston tai tietokannan.',
    ],
    [
      'Millä URL-parilla on sama origin?',
      ['`https://example.com/a` ja `https://example.com/b`', '`http://localhost:5173` ja `http://localhost:3000`', '`http://example.com` ja `https://example.com`', '`https://api.example.com` ja `https://example.com`'],
      'Origin on skeema, isäntänimi ja portti. Polku ei kuulu siihen. Muissa pareissa eroaa portti, skeema tai isäntänimi.',
    ],
    [
      'Mikä valvoo CORSia?',
      ['Selain', 'Express-palvelin', 'Verkon reititin', 'React-kirjasto'],
      'Palvelin vain lähettää otsakkeet. Selain lukee ne ja päättää, saako JavaScript-koodisi nähdä vastauksen.',
    ],
    [
      'React portissa 5173 kutsuu rajapintaa portissa 3000, ja konsolissa näkyy CORS-virhe. Missä korjaus tehdään?',
      ['Palvelimella: lähetä `Access-Control-Allow-Origin`, esimerkiksi `cors`-middlewarella', 'Reactissa: lisää `useEffect`-hookille asetus `cors: true`', 'Fetch-kutsussa: aseta metodiksi OPTIONS', 'Selaimessa: lataa sivu uudelleen välimuisti pois päältä'],
      'Vain palvelin voi antaa luvan. Vaihtoehto on välttää originien välinen pyyntö kokonaan kehitysproxylla.',
    ],
    [
      "Tällä Vite-asetuksella React kutsuu `fetch('/api/products')`. Miksi CORS-ongelmaa ei synny?",
      ['Selain lähettää pyynnön omaan originiinsa, ja Vite välittää sen Expressille', 'Proxy-asetus kytkee CORSin pois päältä selaimessa', 'Localhostiin lähetetyt pyynnöt eivät koskaan kuulu CORSin piiriin', 'Express tunnistaa Viten ja lisää otsakkeet automaattisesti'],
      'Selaimen näkökulmasta pyyntö pysyy portissa 5173. Hyppy porttiin 3000 tapahtuu kahden palvelimen välillä, missä CORS ei ole voimassa.',
    ],
    [
      'Palvelin vastaa tähän DELETE-pyyntöön kutsulla `res.status(204).end()`. Mitä asiakkaalla tapahtuu?',
      ['`response.json()` heittää virheen, koska jäsennettävää runkoa ei ole', '`data` on `null`', '`data` on tyhjä olio', '`fetch` hylkää, koska 204 ei ole 200'],
      '204-vastauksen runko on tyhjä, eikä tyhjä merkkijono ole kelvollista JSONia. Tarkista `response.ok` ja jätä jäsennys väliin.',
    ],
    [
      'Miksi tilaan lisätään `created` eikä selaimessa rakennettua tehtäväoliota?',
      ['Palvelimen versiossa on sen luoma id ja mahdolliset palvelimen täyttämät oletusarvot', 'Tilassa voi olla vain olioita, jotka ovat tulleet `fetch`-kutsusta', 'Paikallisesti rakennettua oliota ei voisi renderöidä', 'Se nopeuttaa pyyntöä'],
      'Palvelin omistaa datan. Ilman sen antamaa id:tä et voisi myöhemmin päivittää tai poistaa tehtävää.',
    ],
    [
      'Tässä osoitteessa oleva palvelin ei ole käynnissä. Mitä tulostuu?',
      ['A, ja epäonnistunut pyyntö raportoidaan käsittelemättömänä virheenä', null, 'A ja sitten B', 'Ei mitään'],
      'Ilman `await`-sanaa try-lohko päättyy ennen kuin promise hylätään, joten catch ei koskaan näe virhettä.',
    ],
  ],
}
