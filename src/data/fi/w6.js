// Finnish translation of week 6. Same order as ../w6.js, item for item; code examples are shared.

export default {
  label: 'Viikko 6',
  title: 'Asynkronisuus, Fetch ja REST',
  blurb: 'Tapahtumasilmukka, callbackit, promiset, async ja await, Fetch-rajapinta, JSON HTTP:n yli ja RESTin perusajatukset.',
  topics: [
    [
      'Synkroninen ja asynkroninen koodi',
      [
        ['Yksi säie', 'JavaScript on yksisäikeinen: se suorittaa yhtä koodinpätkää kerrallaan. Kun hidas synkroninen tehtävä on käynnissä, mitään muuta ei voi tapahtua: sivu ei pysty reagoimaan napsautuksiin eikä piirtämään itseään uudelleen.'],
        ['Asynkroniset operaatiot', 'Hidas työ, kuten verkkopyyntö tai ajastin, käynnistetään ja annetaan selaimen hoidettavaksi. Koodisi jatkaa heti eteenpäin, ja tulos käsitellään myöhemmin callbackissa tai promisen avulla.'],
        ['Tapahtumasilmukka', 'Valmistunut asynkroninen työ odottaa jonossa. Tapahtumasilmukka ottaa jonosta seuraavan callbackin vasta, kun parhaillaan suoritettava koodi on kokonaan valmis. Siksi asynkroniset callbackit suoritetaan aina niitä ympäröivän synkronisen koodin jälkeen.'],
        ['Promisen callbackit ennen ajastimia', 'Promisen callbackit odottavat omassa, korkeamman prioriteetin jonossaan. Kun nykyinen koodi päättyy, kaikki odottavat promisen callbackit suoritetaan ennen yhtäkään ajastimen callbackia, vaikka ajastin olisi nolla millisekuntia.'],
      ],
    ],
    [
      'Callbackit',
      [
        ['Callbackit', 'Callback eli takaisinkutsu on funktio, jonka välität toiselle funktiolle, jotta sitä voidaan kutsua myöhemmin, esimerkiksi kun ajastin laukeaa, tapahtuma sattuu tai data saapuu.'],
        ['Callback-helvetti', 'Kun useat asynkroniset vaiheet riippuvat toisistaan, callbackit päätyvät sisäkkäin toistensa sisään. Koodi valuu oikealle, sitä on vaikea lukea, ja jokainen taso tarvitsee oman virheenkäsittelynsä. Promiset luotiin korjaamaan tämä.'],
      ],
    ],
    [
      'Promiset',
      [
        ['Promise', 'Promise eli lupaus on olio, joka edustaa asynkronisen operaation myöhemmin valmistuvaa tulosta. Saat sen heti ja liität siihen käsittelijät arvolle, joka saapuu myöhemmin.'],
        ['Promisen tilat', 'Promise on aluksi odottava eli pending. Sen jälkeen siitä tulee joko täytetty eli fulfilled, jolloin sillä on arvo, tai hylätty eli rejected, jolloin sillä on virhe. Kun tila on ratkennut, se ei enää koskaan muutu.'],
        ['then', '`then` rekisteröi funktion, joka suoritetaan, kun promise täyttyy, ja funktio saa promisen arvon. `then` palauttaa uuden promisen, ja juuri se tekee ketjuttamisen mahdolliseksi.'],
        ['Promisejen ketjutus', 'Se, mitä `then`-käsittelijä palauttaa, on seuraavan `then`-käsittelijän syöte. Jos se palauttaa promisen, ketju odottaa sitä. Jos se ei palauta mitään, seuraava käsittelijä saa arvon undefined.'],
        ['catch', '`catch` käsittelee hylkäyksen mistä tahansa ketjun aiemmasta vaiheesta, myös `then`-käsittelijän sisällä heitetyn virheen. Kun catch on käsitellyt virheen, ketju jatkuu normaalisti.'],
        ['finally', '`finally` suoritetaan riippumatta siitä, täyttyikö promise vai hylättiinkö se. Se ei saa arvoa, ja se on tarkoitettu siivoamiseen, kuten latausilmaisimen piilottamiseen.'],
        ['Promisen luominen', 'Promise-konstruktori ottaa funktion, jolla on kaksi parametria, `resolve` ja `reject`. Kutsu `resolve`-funktiota tuloksella, kun työ onnistuu, tai `reject`-funktiota virheellä, kun se epäonnistuu.'],
        ['Promise.all', '`Promise.all` ottaa taulukon promiseja, suorittaa ne rinnakkain ja täyttyy taulukolla, jossa ovat kaikkien tulokset. Jos yksikin niistä hylätään, koko kutsu hylätään.'],
      ],
    ],
    [
      'async ja await',
      [
        ['async-funktiot', '`async`-sanalla merkitty funktio palauttaa aina promisen. Palauttamastasi arvosta tulee promisen arvo, ja heittämästäsi virheestä tulee hylkäys.'],
        ['await', '`await` pysäyttää async-funktion, kunnes promise ratkeaa, ja antaa sitten sen arvon. Vain kyseinen funktio pysähtyy; muu ohjelma jatkaa toimintaansa.'],
        ['Missä await on sallittu', '`await`-sanaa voi käyttää vain async-funktion sisällä tai moduulin ylimmällä tasolla. Muualla se on syntaksivirhe.'],
        ['Virheet awaitin kanssa', 'Kun odotettu promise hylätään, `await` heittää virheen. Sijoita await-kutsut `try`-lohkoon ja käsittele epäonnistumiset `catch`-lohkossa, täsmälleen kuten synkroniset virheet.'],
        ['Awaitin unohtaminen', 'Ilman `await`-sanaa saat itse odottavan promisen, et sen arvoa. Koodi jatkaa promisen kanssa siinä, missä odotit dataa, ja se näkyy yleensä undefined-arvoisina ominaisuuksina.'],
        ['Peräkkäin vai rinnakkain', 'Kaksi peräkkäistä await-kutsua suoritetaan yksi toisensa jälkeen: toinen pyyntö alkaa vasta, kun ensimmäinen on valmis. Kun haluat ajaa toisistaan riippumattomat pyynnöt samaan aikaan, käynnistä ne yhdessä ja odota `Promise.all`-kutsua.'],
        ['Syntaktista sokeria promisejen päällä', 'Async ja await eivät korvaa promiseja; ne ovat luettavampi tapa käyttää niitä. Minkä tahansa async-funktion tulosta voi käsitellä myös `then`- ja `catch`-metodeilla.'],
      ],
    ],
    [
      'Fetch-rajapinta',
      [
        ['fetch', '`fetch` käynnistää HTTP-pyynnön ja palauttaa promisen. Promise täyttyy Response-oliolla heti, kun tilakoodi ja otsakkeet saapuvat. Se ei ole vielä itse data.'],
        ['Kaksi awaitia', 'Datan lukemisessa on kaksi vaihetta, ja molemmat ovat asynkronisia. Odota ensin `fetch`-kutsua, jotta saat vastauksen. Odota sitten `response.json()`-kutsua, joka lataa rungon ja jäsentää sen.'],
        ['response.ok ja status', '`response.status` on numeerinen tilakoodi. `response.ok` on true, kun tilakoodi on välillä 200–299.'],
        ['fetch ei hylkää HTTP-virheistä', 'fetchin promise hylätään vain, kun itse pyyntö epäonnistuu, esimerkiksi verkkovirheen tai estetyn pyynnön vuoksi. 404 tai 500 täyttää promisen silti normaalisti. Sinun on itse tarkistettava `response.ok` ja heitettävä virhe, jos se on false.'],
        ['POST ja JSON', 'Kun lähetät dataa, anna asetusolio: `method`, `Content-Type`-otsake arvolla `application/json` ja `body`, joka on `JSON.stringify`-funktiolla tehty merkkijono.'],
        ['PUT, PATCH ja DELETE fetchillä', 'Muut metodit noudattavat samaa kaavaa kuin POST: aseta `method` ja lisää otsakkeet ja runko, kun lähetät dataa. DELETE-pyynnössä ei yleensä ole runkoa.'],
        ['Rungon lukeminen', '`response.json()` jäsentää rungon JSONina, ja `response.text()` antaa sen tavallisena merkkijonona. Rungon voi lukea vain kerran, ja tyhjän tai muun kuin JSON-muotoisen rungon jäsentäminen JSONina aiheuttaa virheen.'],
      ],
    ],
    [
      'JSON HTTP:n yli',
      [
        ['JSON tiedonsiirtomuotona', 'Rajapinnat lähettävät datan JSON-tekstinä otsakkeella `Content-Type: application/json`. Asiakkaan päässä `response.json()` muuntaa tekstin tavallisiksi JavaScript-olioiksi ja -taulukoiksi.'],
        ['Datan löytäminen vastauksesta', 'Rajapinta käärii listansa usein olion sisään. Katso ensin vastauksen rakenne: taulukko voi olla kohdassa `data.posts` tai `data.recipes` eikä ylimmällä tasolla.'],
        ['Unexpected token -virheet', 'Jäsennyksen aikana syntyvä SyntaxError odottamattomasta merkistä tarkoittaa yleensä, ettei palvelin lähettänyt JSONia lainkaan. Usein se lähetti HTML-virhesivun, koska URL oli väärä.'],
      ],
    ],
    [
      'REST',
      [
        ['REST', 'REST on tyyli web-rajapintojen suunnitteluun. Data mallinnetaan resursseina, jokaisella resurssilla on URL, HTTP-metodi kertoo, mitä resurssille tehdään, ja jokainen pyyntö on tilaton.'],
        ['Resurssien URL-osoitteet', 'URL-osoitteet nimeävät asioita, eivät toimintoja. Käytä monikollisia substantiiveja: `/todos` on koko kokoelma ja `/todos/42` yksi alkio. Toiminto tulee HTTP-metodista, joten polkua `/getTodos` ei koskaan tarvita.'],
        ['CRUD ja HTTP-metodit', 'Neljä perusoperaatiota vastaavat metodeja. Luominen on POST, lukeminen GET, päivittäminen PUT tai PATCH ja poistaminen DELETE.'],
        ['Tilattomat pyynnöt', 'Jokaisen pyynnön on sisällettävä kaikki, mitä palvelin tarvitsee sen käsittelyyn. Palvelin ei muista, mikä pyyntö tuli aiemmin.'],
      ],
    ],
  ],

  questions: [
    ['Missä järjestyksessä kirjaimet tulostuvat?', null, 'Vaikka viive on nolla, ajastimen callback odottaa jonossa, kunnes kaikki synkroninen koodi on suoritettu.'],
    ['Missä järjestyksessä luvut tulostuvat?', null, 'Ensin synkroninen koodi: 1 ja 4. Sitten promisen callbackit, joilla on etusija ajastimiin nähden: 3. Ajastin tulee viimeisenä: 2.'],
    [
      'Mikä näistä EI ole tila, jossa promise voi olla?',
      ['Peruttu (cancelled)', 'Odottava (pending)', 'Täytetty (fulfilled)', 'Hylätty (rejected)'],
      'Promise on ensin odottava ja ratkeaa sitten täytetyksi tai hylätyksi. Peruttua tilaa ei ole.',
    ],
    [
      'Mitä tulostuu?',
      ['`6` ja sitten `undefined`', '`6` ja sitten `6`', '`2` ja sitten `6`', 'Vain `6`'],
      'Toinen käsittelijä tulostaa luvun 6 mutta ei palauta mitään, joten kolmas käsittelijä saa arvon undefined.',
    ],
    ['Mitä tulostuu?', null, 'Hylkäys ohittaa ensimmäisen then-käsittelijän ja päätyy catch-käsittelijään. Kun catch on käsitellyt virheen, ketju jatkuu seuraavalla then-käsittelijällä.'],
    [
      'Mitä tämä tulostaa?',
      ['Promisen', null, null, 'Syntyy SyntaxError'],
      'Async-funktio palauttaa aina promisen. Luvun 42 saat kirjoittamalla `await getNumber()` tai käyttämällä `.then`-metodia.',
    ],
    [
      'Rajapinta palauttaa JSON-taulukon. Mitä tämä tulostaa?',
      [null, null, null, 'Syntyy TypeError'],
      '`response.json()` palauttaa promisen. Ilman `await`-sanaa `todos` on tuo promise, ei taulukko.',
    ],
    ['Missä järjestyksessä luvut tulostuvat?', null, 'Funktio suoritetaan synkronisesti ensimmäiseen awaitiin asti. await pysäyttää sen ja antaa muun skriptin jatkaa, joten 3 tulostuu ennen lukua 2.'],
    [
      'Palvelin vastaa tähän pyyntöön tilakoodilla 404. Mitä tulostuu?',
      [null, null, null, 'Ei mitään'],
      'fetch hylkää vain, kun itse pyyntö epäonnistuu. 404 on tavallinen vastaus, jossa `ok` on false.',
    ],
    [
      'Milloin `fetch`-funktion palauttama promise hylätään?',
      ['Kun pyyntöä ei saada suoritettua, esimerkiksi verkkovian vuoksi', 'Aina kun tilakoodi on 400 tai suurempi', 'Aina kun tilakoodi on 500 tai suurempi', 'Kun vastauksen runko ei ole JSONia'],
      'HTTP-virhekoodit täyttävät promisen silti. Tarkista `response.ok` ja heitä niistä oma virhe.',
    ],
    ['Mitä tulostuu?', null, 'throw hyppää suoraan catch-lohkoon ja ohittaa try-lohkon loppuosan. finally suoritetaan aina sen jälkeen.'],
    [
      'Mitä tästä pyynnöstä puuttuu, jos palvelimen pitäisi saada JSONia?',
      ['Rungon on oltava `JSON.stringify(...)`, ja tarvitaan otsake `Content-Type: application/json`', 'Ei mitään; fetch muuntaa oliot JSONiksi automaattisesti', 'Metodin pitäisi olla GET, kun lähetetään dataa', 'Riittää, että URL päättyy merkkeihin `.json`'],
      'fetch lähettää rungon sellaisenaan. Olio lähetettäisiin tekstinä `[object Object]`, eikä palvelin jäsennä runkoa JSONina ilman otsaketta.',
    ],
    ['Pyyntö palauttaa `{ "posts": [...], "total": 251 }`. Mikä rivi tallentaa julkaisulistan tilaan?', null, 'Taulukko on yhtä tasoa alempana, jäsennetyn olion `posts`-ominaisuudessa.'],
    ['Mikä pyyntö noudattaa REST-käytäntöjä, kun luetaan tehtävä, jonka id on 7?', null, 'URL nimeää resurssin monikollisella substantiivilla ja sen id:llä. Metodi GET kertoo, mitä resurssille tehdään.'],
    ['Mikä HTTP-metodi luo uuden resurssin REST-rajapinnassa?', null, 'Luominen vastaa POST-metodia, lukeminen GET-metodia, päivittäminen PUT- tai PATCH-metodia ja poistaminen DELETE-metodia.'],
    [
      'Minkä ongelman promiset ratkaisevat tavallisiin callbackeihin verrattuna?',
      ['Syvälle sisäkkäin menevät callbackit, joita on vaikea lukea ja joiden virheitä on vaikea käsitellä', 'Sen, että JavaScript on yksisäikeinen', 'Sen, että verkkopyynnöt ovat hitaita', 'Sen, että muuttujat ovat funktion laajuisia'],
      'Promiset litistävät callback-helvetin ketjuksi, ja yksi `catch` voi käsitellä jokaisen vaiheen virheet.',
    ],
    [
      'Yksi kolmesta pyynnöstä epäonnistuu. Mitä `Promise.all`-kutsulle tapahtuu?',
      ['Se hylätään, ja await heittää virheen', 'Se täyttyy kahdella onnistuneella tuloksella', 'Se täyttyy niin, että epäonnistuneen tilalla on `undefined`', 'Se odottaa ikuisesti'],
      '`Promise.all` on kaikki tai ei mitään: se täyttyy vain, jos jokainen promise täyttyy.',
    ],
    [
      'Mitä tapahtuu, kun tämä koodi ladataan?',
      ['SyntaxError, koska `await`-sanaa käytetään funktiossa, joka ei ole async', 'Se toimii ja palauttaa tehtävät', 'Se palauttaa odottavan promisen', 'Se palauttaa arvon `undefined`'],
      '`await` on sallittu vain `async`-funktion sisällä tai moduulin ylimmällä tasolla.',
    ],
  ],
}
