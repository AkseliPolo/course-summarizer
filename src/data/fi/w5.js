// Finnish translation of week 5. Same order as ../w5.js, item for item; code examples are shared.

export default {
  label: 'Viikko 5',
  title: 'Hookit, efektit ja olio-ohjelmointi',
  blurb: 'Hookien säännöt, useEffect ja sen riippuvuustaulukko, datan hakeminen Reactissa, lomakkeet, virheenjäljitys ja olio-ohjelmointi JavaScriptillä: this, konstruktorit, yksityiset kentät, getterit ja static.',
  topics: [
    [
      'Hookit',
      [
        ['Hookit', 'Hookit ovat funktioita, joiden nimi alkaa sanalla `use`. Niiden avulla funktiokomponentti voi käyttää Reactin ominaisuuksia, kuten tilaa `useState`-hookilla ja sivuvaikutuksia `useEffect`-hookilla.'],
        ['Hookien säännöt', 'Kutsu hookeja vain komponentin ylimmällä tasolla, älä koskaan ehdon, silmukan tai sisäkkäisen funktion sisällä. Kutsu niitä myös vain komponenteista tai toisista hookeista. React tunnistaa jokaisen hookin sen kutsujärjestyksen perusteella, joten järjestys ei saa koskaan muuttua.'],
        ['Laiska alkutila', 'Jos annat `useState`-hookille funktion, React suorittaa sen vain ensimmäisellä renderöinnillä ja käyttää sen paluuarvoa alkutilana. Se on oikea paikka hitaalle työlle, kuten localStoragen lukemiselle.'],
        ['Omat hookit', 'Oma hook on itse kirjoittamasi funktio, jonka nimi alkaa sanalla `use` ja joka kutsuu muita hookeja. Sen avulla useat komponentit voivat jakaa saman logiikan; jokainen sitä kutsuva komponentti saa silti oman erillisen tilansa.'],
      ],
    ],
    [
      'useEffect',
      [
        ['Sivuvaikutukset', 'Sivuvaikutus on mitä tahansa, mikä ulottuu renderöinnin ulkopuolelle: datan hakeminen, ajastimen käynnistäminen, localStorageen kirjoittaminen, dokumentin otsikon muuttaminen. Sivuvaikutuksia ei saa suorittaa itse renderöinnin aikana.'],
        ['useEffect', '`useEffect` ottaa funktion ja suorittaa sen, kun komponentti on renderöity ja ruutu päivitetty. Sen avulla komponentti synkronoituu jonkin Reactin ulkopuolisen asian kanssa.'],
        ['Riippuvuustaulukko', 'Toinen argumentti määrää, milloin efekti suoritetaan uudelleen. Ilman taulukkoa se suoritetaan jokaisen renderöinnin jälkeen. Tyhjällä taulukolla se suoritetaan kerran, ensimmäisen renderöinnin jälkeen. Kun taulukossa on arvoja, se suoritetaan ensimmäisen renderöinnin jälkeen ja aina, kun jokin näistä arvoista on muuttunut.'],
        ['Siivousfunktio', 'Efekti voi palauttaa funktion. React kutsuu sitä ennen kuin efekti suoritetaan uudelleen ja kun komponentti poistetaan sivulta. Pysäytä siinä ajastimet, peru pyynnöt ja pura kaikki, minkä efekti käynnisti.'],
        ['Ikuisen silmukan ansa', 'Efekti, joka asettaa tilan ja jolla ei ole riippuvuustaulukkoa, suoritetaan jokaisen renderöinnin jälkeen, ja tilan asettaminen aiheuttaa uuden renderöinnin. Komponentti renderöityy loputtomasti. Anna tällaiselle efektille aina riippuvuustaulukko.'],
        ['Vanhentuneet arvot efekteissä', 'Efekti näkee sen renderöinnin tilan ja propsit, jossa se luotiin. Jos se käyttää arvoa, joka puuttuu riippuvuustaulukosta, se jatkaa työskentelyä vanhalla arvolla. Lisää arvo taulukkoon tai käytä päivitysfunktiota.'],
        ['Tilan tallentaminen efektillä', 'Kun haluat tilan säilyvän, kirjoita se localStorageen efektissä, joka riippuu kyseisestä tilasta. Silloin se tallentuu automaattisesti jokaisen muutoksen jälkeen.'],
        ['StrictMode suorittaa efektit kahdesti', 'Kehitystilassa StrictMode liittää jokaisen komponentin sivulle kahdesti: efekti suoritetaan, sen siivousfunktio suoritetaan ja efekti suoritetaan uudelleen. Tämä on tarkoituksellista, jotta puuttuvat siivoukset paljastuisivat. Tuotantoversiossa näin ei tapahdu.'],
      ],
    ],
    [
      'Datan hakeminen Reactissa',
      [
        ['Hakeminen efektissä', 'Lataa data efektissä, jolla on tyhjä riippuvuustaulukko, jolloin pyyntö tehdään kerran, kun komponentti ilmestyy sivulle. Tallenna tulos tilaan; tilan muutos renderöi datan.'],
        ['Efektifunktio ei voi olla async', 'Async-funktio palauttaa aina promisen, mutta efektin pitää palauttaa joko ei mitään tai siivousfunktio. Määrittele siis async-funktio efektin sisällä ja kutsu sitä saman tien.'],
        ['Lataus-, virhe- ja datatila', 'Dataa hakeva komponentti tarvitsee kolme tilaa: datan, lataamisesta kertovan lipun, joka on aluksi true, ja virheilmoituksen. Renderöi jokaiselle jotakin erilaista: latausteksti, virheilmoitus tai data.'],
        ['Haettavan datan alkutila', 'Ensimmäinen renderöinti tapahtuu ennen kuin dataa on saapunut. Aloita lista tyhjänä taulukkona, jotta `map` toimii; jos tila on aluksi undefined, `map`-metodin kutsuminen aiheuttaa virheen.'],
        ['Pyynnön peruminen', 'Luo `AbortController`, välitä sen `signal` fetch-kutsulle ja kutsu `abort`-metodia efektin siivousfunktiossa. Näin perutaan pyyntö, jonka komponentti on jo poistunut sivulta.'],
      ],
    ],
    [
      'Lomakkeet Reactissa',
      [
        ['Lomakkeen lähettäminen Reactissa', 'Aseta `onSubmit` lomake-elementille. Kutsu käsittelijässä `preventDefault`-metodia, validoi tilassa olevat arvot, käytä ne ja tyhjennä kentät palauttamalla tila alkuarvoonsa.'],
        ['Useita kenttiä', 'Pidä joko yksi tilamuuttuja jokaista kenttää kohti tai yksi olio, jota päivität käyttämällä kentän `name`-attribuuttia laskettuna avaimena.'],
        ['Valintaruudut ja valintalistat', 'Valintaruutua ohjataan `checked`-ominaisuudella, ja sen arvo luetaan kohdasta `event.target.checked`. Select-elementin arvo tulee merkkijonona, joten muunna se `Number`-funktiolla, kun tarvitset numeerisen id:n.'],
        ['Validointivirheiden näyttäminen', 'Pidä virheilmoitus tilassa ja renderöi se ehdollisesti lomakkeen viereen. Tyhjennä se, kun syöte muuttuu kelvolliseksi.'],
      ],
    ],
    [
      'Reactin virheenjäljitys',
      [
        ['Virheilmoitusten lukeminen', 'Lue konsolin virheilmoituksen ensimmäinen rivi sekä tiedosto ja rivi, johon se viittaa. Sen alla oleva komponenttipino näyttää, mitä komponenttia renderöitiin virheen sattuessa.'],
        ['Yleiset React-virheet', 'Cannot read properties of undefined, reading map: data ei ole vielä latautunut. Each child in a list should have a unique key: lisää key. Too many re-renders: tilaa asetetaan renderöinnin aikana. Objects are not valid as a React child: laitoit JSX:ään kokonaisen olion.'],
        ['React Developer Tools', 'Selainlaajennus lisää Components-välilehden, jossa voit valita minkä tahansa komponentin ja tarkastella sen nykyisiä propseja ja tilaa.'],
        ['Tulostaminen komponentissa', 'Komponentin rungossa oleva `console.log` suoritetaan jokaisella renderöinnillä, joten sillä näkee nopeasti, milloin ja miksi komponentti renderöityy. Kehitystilassa StrictModen kanssa tuloste näkyy kahdesti.'],
      ],
    ],
    [
      'Oliot, this ja konstruktorit',
      [
        ['Metodit', 'Metodi on funktio, joka on tallennettu olion ominaisuudeksi. Sen sisällä `this` antaa pääsyn olion muihin ominaisuuksiin.'],
        ['Miten this määräytyy', '`this`-sanan arvoa ei lyödä lukkoon, kun funktio kirjoitetaan. Se määräytyy joka kerta, kun funktiota kutsutaan: kutsussa `user.greet()` `this` on pistettä edeltävä olio.'],
        ['this-arvon katoaminen', 'Jos irrotat metodin oliostaan ja kutsut sitä sellaisenaan tai välität sen jonnekin callbackina, pisteen edessä ei ole oliota ja `this` on undefined. Kääri kutsu nuolifunktioon, jotta olio säilyy.'],
        ['Nuolifunktiot ja this', 'Nuolifunktiolla ei ole omaa `this`-arvoa; se käyttää ympäröivän koodin `this`-arvoa. Siksi nuolifunktiot sopivat hyvin callbackeiksi metodien sisällä mutta eivät itse metodien määrittelyyn.'],
        ['Konstruktorifunktiot', 'Ennen luokkia oliot luotiin tavallisilla funktioilla, jotka nimettiin isolla alkukirjaimella ja joita kutsuttiin `new`-sanalla. Luokka tekee saman selkeämmällä syntaksilla.'],
        ['Mitä new tekee', 'Kun funktiota kutsutaan `new`-sanalla, luodaan tyhjä olio, se linkitetään funktion prototyyppiin, funktio suoritetaan niin, että `this` on uusi olio, ja lopuksi olio palautetaan.'],
      ],
    ],
    [
      'Kapselointi ja staattiset jäsenet',
      [
        ['Kapselointi', 'Kapselointi tarkoittaa, että olion sisäinen data piilotetaan ja ulospäin tarjotaan vain hallittu julkinen rajapinta, jolloin ulkopuolinen koodi ei voi saattaa oliota virheelliseen tilaan.'],
        ['Yksityiset kentät', 'Kenttä, jonka nimi alkaa risuaidalla, on yksityinen. Sitä voi lukea ja muuttaa vain luokan rungon sisällä oleva koodi. Yritys käyttää sitä ulkopuolelta on syntaksivirhe.'],
        ['Getterit ja setterit', 'Getteri ja setteri näyttävät ulospäin tavalliselta ominaisuudelta, mutta ne suorittavat metodin, kun ominaisuus luetaan tai siihen sijoitetaan arvo. Setteri on oikea paikka uuden arvon validoinnille. Getteri ilman setteriä tekee ominaisuudesta vain luettavan.'],
        ['Staattiset metodit', 'Staattinen metodi kuuluu luokalle itselleen, ei sen ilmentymille. Sitä kutsutaan luokan nimen kautta luomatta oliota, samaan tapaan kuin `Math.abs`. Käytä static-sanaa apufunktioille, jotka eivät tarvitse ilmentymän dataa.'],
        ['Metodien ylikirjoittaminen', 'Aliluokka voi määritellä metodin samalla nimellä kuin yliluokassa, jolloin käytetään aliluokan versiota. Sen sisällä `super.method()` kutsuu yliluokan versiota, joten voit laajentaa sitä korvaamisen sijaan.'],
      ],
    ],
  ],

  questions: [
    [
      'Kuinka monta kertaa tämä efekti suoritetaan, kun komponentti pysyy sivulla?',
      ['Kerran, ensimmäisen renderöinnin jälkeen', 'Jokaisen renderöinnin jälkeen', 'Ei koskaan, koska taulukko on tyhjä', 'Kerran ennen ensimmäistä renderöintiä'],
      'Tyhjä riippuvuustaulukko tarkoittaa, ettei mikään voi muuttua, joten efekti suoritetaan vain ensimmäisen renderöinnin jälkeen. (Kehitystilassa StrictMode suorittaa sen tarkoituksella kahdesti.)',
    ],
    [
      'Milloin tämä efekti suoritetaan?',
      ['Ensimmäisen renderöinnin jälkeen ja uudelleen aina, kun `todos` on muuttunut', 'Vain kun `todos` muuttuu, ei ensimmäisen renderöinnin jälkeen', 'Jokaisen renderöinnin jälkeen', 'Vain kerran'],
      'Jokainen efekti suoritetaan ensimmäisen renderöinnin jälkeen. Sen jälkeen React suorittaa sen uudelleen vain, kun jokin riippuvuustaulukon arvo on muuttunut.',
    ],
    [
      'Mitä tapahtuu, kun tämä komponentti renderöidään?',
      ['Ikuinen silmukka: jokainen renderöinti suorittaa efektin, joka käynnistää uuden renderöinnin', 'Se näyttää luvun 1 ja pysähtyy', 'Se näyttää luvun 0 ja pysähtyy', 'Syntyy virhe, koska efektit eivät voi asettaa tilaa'],
      'Ilman riippuvuustaulukkoa efekti suoritetaan jokaisen renderöinnin jälkeen, ja jokainen suoritus muuttaa tilaa, mikä renderöi uudelleen.',
    ],
    [
      'Riippuvuustaulukkoa ei ole. Mitä tapahtuu joka sekunti?',
      ['Laskuri kasvaa yhdellä; siivousfunktio pysäyttää vanhan intervallin ja efekti käynnistää uuden', 'Joka kerta lisätään uusi intervalli, joten laskuri nopeutuu', 'Laskuri nousee arvoon 1 ja pysyy siinä', 'Ei mitään; efekti ei voi käynnistää ajastinta'],
      'Efekti suoritetaan uudelleen jokaisen renderöinnin jälkeen, mutta sen siivousfunktio suoritetaan ensin ja pysäyttää edellisen intervallin, joten käynnissä on aina vain yksi ajastin.',
    ],
    [
      'Tyhjä riippuvuustaulukko lisätään. Mitä laskuri näyttää viiden sekunnin kuluttua?',
      null,
      'Efekti suoritetaan kerran, ja sen callback näkee koko ajan ensimmäisen renderöinnin laskurin, joka on 0. Jokainen tikitys asettaa tilaksi 0 + 1. `setCounter(c => c + 1)` korjaa ongelman.',
    ],
    [
      'Milloin React kutsuu efektin palauttamaa funktiota?',
      ['Ennen kuin efekti suoritetaan uudelleen ja kun komponentti poistetaan', 'Heti efektin jälkeen, samalla renderöinnillä', 'Vain kun sivu suljetaan', 'Vain jos efekti aiheuttaa virheen'],
      'Tuo funktio on siivousfunktio. Se purkaa edellisen efektin ennen seuraavan alkua ja vielä kerran, kun komponentti poistuu sivulta.',
    ],
    [
      'Miksi tämä on väärin?',
      ['Async-funktio palauttaa promisen, mutta efektin pitää palauttaa ei mitään tai siivousfunktio', '`await`-sanaa ei voi käyttää yhdessä `fetch`-funktion kanssa', 'Efektit eivät saa asettaa tilaa', 'Riippuvuustaulukossa pitää olla `posts`'],
      'Määrittele async-funktio efektin sisällä ja kutsu sitä sen sijaan, että tekisit itse efektifunktiosta asyncin.',
    ],
    [
      'Mitä tapahtuu ensimmäisellä renderöinnillä?',
      [null, 'Tyhjä lista näytetään, kunnes data saapuu', 'Käyttäjälista näytetään heti', 'Efekti suoritetaan ensin, joten data on valmiina'],
      'Efektit suoritetaan renderöinnin jälkeen, joten ensimmäisellä renderöinnillä `users` on vielä undefined. Aloita kutsulla `useState([])`.',
    ],
    [
      'Mihin `setLoading(false)` pitäisi sijoittaa, jotta se suoritetaan sekä haun onnistuessa että epäonnistuessa?',
      ['`finally`-lohkoon', '`try`-lohkon loppuun', '`catch`-lohkoon', 'Ennen `try`-lohkoa'],
      '`finally` suoritetaan aina. `try`-lohkon lopussa se jäisi virheen sattuessa väliin; `catch`-lohkossa se jäisi väliin onnistuessa.',
    ],
    [
      'Mikä näistä rikkoo hookien sääntöjä?',
      [null, "`const [text, setText] = useState('')` komponentin ensimmäisellä rivillä", '`useEffect`-hookin kutsuminen kahdesti samassa komponentissa', '`useState`-hookin kutsuminen omassa hookissa nimeltä `useForm`'],
      'Hookeja on kutsuttava samassa järjestyksessä jokaisella renderöinnillä, joten ne eivät voi olla ehdon sisällä.',
    ],
    [
      'Milloin `useState`-hookille annettu funktio suoritetaan?',
      ['Vain ensimmäisellä renderöinnillä', 'Jokaisella renderöinnillä', 'Aina kun `setTodos` kutsutaan', 'Ei koskaan; `useState` ei huomioi funktioita'],
      'Tämä on laiska alkutila. React kutsuu funktiota kerran saadakseen alkuarvon eikä huomioi sitä sen jälkeen.',
    ],
    [
      'Mitä tämä rivi tekee lomakkeessa, jossa on useita kenttiä?',
      ['Kopioi lomakeolion ja päivittää sen yhden ominaisuuden, joka on nimetty muuttuneen kentän mukaan', 'Korvaa koko lomakkeen yhdellä ominaisuudella', 'Luo taulukon, jossa on kentän nimi ja arvo', 'Lisää ominaisuuden, jonka nimi on kirjaimellisesti `event.target.name`'],
      'Hakasulkeet tekevät lasketun avaimen: kentän `name`-attribuutti määrää, mikä ominaisuus kopiossa korvataan.',
    ],
    [
      'Mikä on todennäköisin syy virheeseen "Too many re-renders"?',
      ['Tilaa asetetaan renderöinnin aikana, esimerkiksi `onClick={setCount(count + 1)}`', 'Lista renderöidään ilman avaimia', 'Komponentissa on useampi kuin yksi `useState`', 'Efektillä on tyhjä riippuvuustaulukko'],
      'Asetusfunktion kutsuminen renderöinnin aikana käynnistää uuden renderöinnin, joka kutsuu sitä taas. Kääri kutsu nuolifunktioon: `onClick={() => setCount(count + 1)}`.',
    ],
    [
      'Tämä suoritetaan strict-tilassa, kuten kaikki moduulikoodi. Mitä tapahtuu?',
      ['Syntyy TypeError, koska `this` on undefined', "Tulostuu `'Hi, Ada'`", "Tulostuu `'Hi, undefined'`", "Tulostuu `'Hi, user'`"],
      '`this` määräytyy sen mukaan, miten funktiota kutsutaan. Kun sitä kutsutaan sellaisenaan ilman oliota pisteen edessä, `this` on undefined.',
    ],
    [
      'Mitä tapahtuu viimeisellä rivillä?',
      ['SyntaxError: yksityisiä kenttiä ei voi käyttää luokan ulkopuolelta', "Tulostuu `'Example Street 1'`", 'Tulostuu `undefined`', 'Tulostuu `null`'],
      'Risuaidalla alkava kenttä on olemassa vain luokan rungon sisällä olevalle koodille. Tarjoa se getterin kautta, jos ulkopuolisen koodin pitää lukea sitä.',
    ],
    [
      'Mitä tämä tulostaa?',
      [null, null, null, 'Syntyy TypeError'],
      'Sijoitus `address`-ominaisuuteen suorittaa setterin. Ensimmäinen arvo tallennetaan; toinen on pelkkiä välilyöntejä, joten setteri palaa heti ja Oulu säilyy.',
    ],
    [
      'Mitä tämä tulostaa?',
      [null, null, null, 'Syntyy TypeError'],
      'Staattinen metodi sijaitsee luokassa, ei sen ilmentymissä. Siksi kirjoitetaan `Math.abs(-5)` luomatta Math-oliota.',
    ],
    [
      'Mitä tämä tulostaa?',
      [null, 'Itse funktion', null, 'Syntyy virhe, koska `area`-metodia ei kutsuttu'],
      'Getteri luetaan kuten ominaisuus, ilman sulkeita, ja se suorittaa metodinsa joka kerta.',
    ],
    [
      'Mitä näistä `new`-operaattori EI tee?',
      ['Kopioi luokan kaikki metodit uuteen olioon', 'Luo uuden tyhjän olion', 'Suorittaa konstruktorin niin, että `this` on uusi olio', 'Palauttaa uuden olion'],
      'Metodeja ei kopioida. Uusi olio linkitetään prototyyppiin, johon metodit on tallennettu kerran ja josta ne jaetaan.',
    ],
  ],
}
