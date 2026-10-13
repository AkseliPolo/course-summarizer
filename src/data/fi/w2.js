// Finnish translation of week 2. Same order as ../w2.js, item for item; code examples are shared.

export default {
  label: 'Viikko 2',
  title: 'JavaScript',
  blurb: 'Muuttujat ja tyypit, funktiot ja näkyvyysalue, oliot, taulukot ja niiden metodit, luokat ja prototyyppiketju sekä JSON.',
  topics: [
    [
      'Muuttujat ja tyypit',
      [
        ['let, const ja var', '`const`-muuttujaan ei voi sijoittaa uutta arvoa. `let`-muuttujaan voi, ja molemmat ovat voimassa vain siinä lohkossa, jossa ne on esitelty. `var` on vanha, funktion laajuinen muoto, jota kannattaa välttää.'],
        ['Primitiivityypit', 'Primitiivityyppejä ovat string, number, boolean, null, undefined, bigint ja symbol. Kaikki muu on olioita, myös taulukot ja funktiot.'],
        ['Dynaaminen tyypitys', 'Muuttujalla ei ole kiinteää tyyppiä; tyyppi on sen sisältämällä arvolla. `typeof`-operaattori palauttaa tyypin merkkijonona. Kaksi yllätystä: `typeof null` on `object`, ja niin on myös taulukon `typeof`.'],
        ['Löyhä ja tiukka yhtäsuuruus', 'Kolme yhtäsuuruusmerkkiä vertaa arvoa ja tyyppiä ilman muunnoksia. Kaksi yhtäsuuruusmerkkiä muuntaa tyypit ensin, joten merkkijono 5 on yhtä suuri kuin luku 5. Käytä kolmea yhtäsuuruusmerkkiä, ellei ole syytä toimia toisin.'],
        ['Truthy ja falsy', 'Ehdossa kuusi arvoa tulkitaan epätodeksi: `false`, nolla, tyhjä merkkijono, `null`, `undefined` ja `NaN`. Kaikki muu on tosi, myös tyhjä taulukko ja tyhjä olio.'],
        ['undefined vai null', '`undefined` tarkoittaa, ettei arvoa ole asetettu: esitelty muuttuja, puuttuva ominaisuus tai funktio ilman return-lausetta. `null` on arvo, jonka asetat itse tarkoittamaan ei mitään.'],
        ['Template literalit', 'Gravis-merkkien sisään kirjoitettuun merkkijonoon voi upottaa minkä tahansa lausekkeen dollarimerkin ja aaltosulkeiden sisään, ja merkkijono voi jatkua usealle riville.'],
        ['Tyyppimuunnos plusmerkillä', 'Jos plusmerkin jommallakummalla puolella on merkkijono, toinenkin puoli muunnetaan merkkijonoksi ja ne yhdistetään. Miinus, kerto ja jako muuntavat arvot aina luvuiksi.'],
      ],
    ],
    [
      'Funktiot ja näkyvyysalue',
      [
        ['Kolme tapaa kirjoittaa funktio', 'Funktion esittely, muuttujaan tallennettu funktiolauseke ja nuolifunktio. Kaikkia kolmea kutsutaan samalla tavalla.'],
        ['Nuolifunktiot', 'Nuolifunktio ilman aaltosulkeita palauttaa lausekkeensa arvon automaattisesti. Aaltosulkeiden kanssa tarvitaan erillinen `return`. Jos parametreja on täsmälleen yksi, sulkeet sen ympäriltä voi jättää pois.'],
        ['Parametrit ja paluuarvo', 'Parametrille voi antaa oletusarvon, jota käytetään, kun argumentti puuttuu. Funktio, joka päättyy ilman `return`-lausetta, palauttaa arvon `undefined`.'],
        ['Funktiot ovat arvoja', 'Funktion voi tallentaa muuttujaan, välittää toiselle funktiolle argumenttina ja palauttaa funktiosta. Funktiota, joka välitetään myöhemmin kutsuttavaksi, sanotaan callbackiksi eli takaisinkutsuksi.'],
        ['Näkyvyysalue', '`let`- tai `const`-sanalla esitelty muuttuja on olemassa vain lähimpien aaltosulkeiden sisällä. Sisempi koodi voi lukea ulompia muuttujia, mutta ulompi koodi ei näe sisempiä.'],
        ['Hoisting eli nostaminen', 'Funktion esittelyä voi kutsua ennen riviä, jolla se määritellään. `let`- ja `const`-muuttujia ei voi käyttää ennen niiden esittelyä: siitä seuraa ReferenceError.'],
        ['Sulkeumat', 'Funktio muistaa luontipaikkansa muuttujat vielä senkin jälkeen, kun ulompi funktio on päättynyt. Jokainen ulomman funktion kutsu luo uudet, omat muuttujansa.'],
      ],
    ],
    [
      'Oliot',
      [
        ['Olioliteraalit', 'Olio on kokoelma avain–arvo-pareja. Ominaisuus luetaan pisteellä, tai hakasulkeilla, kun avain on muuttujassa. Olioita voi olla sisäkkäin toisissa olioissa ja taulukoissa.'],
        ['Oliot ovat viittauksia', 'Olion sijoittaminen toiseen muuttujaan ei kopioi sitä. Molemmat muuttujat viittaavat samaan olioon, joten toisen kautta tehty muutos näkyy toisenkin kautta. Kaksi erillistä oliota, joilla on sama sisältö, eivät ole yhtä suuria.'],
        ['const ja oliot', '`const` estää vain sijoittamasta muuttujaan uutta arvoa. Oliota tai taulukkoa, johon muuttuja viittaa, voi silti muuttaa.'],
        ['Destrukturointi', 'Destrukturointi purkaa ominaisuudet muuttujiin yhdellä rivillä. Olioissa se toimii nimen ja taulukoissa paikan perusteella.'],
        ['Spread-syntaksi', 'Kolme pistettä kopioi olion tai taulukon sisällön uuteen. Se on tavallisin tapa tehdä muutettu kopio koskematta alkuperäiseen.'],
        ['Valinnainen ketjutus ja nullish coalescing', 'Kysymysmerkki ennen pistettä pysäyttää ketjun ja antaa arvon `undefined`, jos vasemmalla oleva arvo on null tai undefined, sen sijaan että syntyisi virhe. Kaksi kysymysmerkkiä antaa vara-arvon null- ja undefined-arvoille.'],
      ],
    ],
    [
      'Taulukot',
      [
        ['Taulukoiden perusteet', 'Taulukon indeksit alkavat nollasta, ja taulukolla on `length`-ominaisuus. `push` ja `pop` lisäävät ja poistavat lopusta, `unshift` ja `shift` alusta. Kaikki neljä muuttavat alkuperäistä taulukkoa.'],
        ['Silmukat', 'Perinteinen `for`-silmukka käyttää indeksiä. `for...of`-silmukka antaa jokaisen arvon suoraan, ja yleensä juuri sitä halutaan.'],
        ['map', '`map` palauttaa uuden, yhtä pitkän taulukon, jossa jokainen alkio on tulos funktiosi kutsumisesta alkuperäisellä alkiolla.'],
        ['filter', '`filter` palauttaa uuden taulukon, jossa ovat vain ne alkiot, joille funktiosi palauttaa toden arvon.'],
        ['reduce', '`reduce` tiivistää taulukon yhdeksi arvoksi. Funktiosi saa tähänastisen tuloksen ja käsiteltävän alkion, ja toinen argumentti on alkuarvo.'],
        ['find, some, every ja includes', '`find` palauttaa ensimmäisen ehdon täyttävän alkion tai arvon `undefined`. `some` ja `every` palauttavat true tai false. `includes` tarkistaa, onko arvo taulukossa.'],
        ['forEach', '`forEach` suorittaa funktion jokaiselle alkiolle ja palauttaa arvon `undefined`. Käytä sitä sivuvaikutuksiin, kuten tulostamiseen; käytä `map`-metodia, kun haluat uuden taulukon.'],
        ['sort', '`sort` muuttaa alkuperäistä taulukkoa, ja ilman vertailufunktiota se järjestää alkiot merkkijonoina, jolloin 10 tulee ennen yhdeksää. Anna luvuille vertailufunktio: a miinus b nousevaan ja b miinus a laskevaan järjestykseen.'],
        ['Muuttavat ja ei-muuttavat metodit', '`push`, `pop`, `splice`, `sort` ja `reverse` muuttavat alkuperäistä taulukkoa. `map`, `filter`, `slice`, `concat` ja spread palauttavat uuden. Puhdas funktio ei koskaan muuta saamaansa taulukkoa.'],
      ],
    ],
    [
      'Luokat ja prototyypit',
      [
        ['Luokan syntaksi', 'Luokka on olioiden piirustus. `constructor` suoritetaan, kun luot ilmentymän `new`-sanalla, ja se asettaa ominaisuudet `this`-olioon. Metodit kirjoitetaan ilman function-avainsanaa.'],
        ['Perintä extends-sanalla', 'Luokka voi periä toisen luokan ja saa silloin kaikki sen metodit. Aliluokan konstruktorissa on kutsuttava `super` ennen kuin `this`-sanaa voi käyttää. Samanniminen metodi korvaa yliluokan metodin, ja `super.method()` kutsuu silti alkuperäistä.'],
        ['Prototyyppiketju', 'Jokaisella oliolla on piilotettu linkki toiseen olioon, sen prototyyppiin. Kun ominaisuutta luetaan, JavaScript etsii sitä ensin oliosta itsestään ja kulkee sitten ketjua ylöspäin, kunnes ominaisuus löytyy tai vastaan tulee null.'],
        ['Missä metodit sijaitsevat', 'Luokan metodit tallennetaan kerran luokan prototyyppiin, ja kaikki ilmentymät jakavat ne. Konstruktorissa `this`-olioon asetetut ominaisuudet tallennetaan erikseen jokaiseen ilmentymään.'],
        ['Luokat ovat syntaktista sokeria', 'class-avainsana on siistimpi tapa kirjoittaa se, mitä JavaScript on aina tehnyt konstruktorifunktioilla ja prototyypeillä. Luokan `typeof` on `function`.'],
        ['instanceof', '`instanceof` tarkistaa, löytyykö luokka mistään kohtaa olion prototyyppiketjua, joten Student on sekä Student- että Person-luokan ilmentymä.'],
      ],
    ],
    [
      'JSON',
      [
        ['Mikä JSON on', 'JSON on JavaScriptin oliosyntaksiin perustuva tekstimuoto tiedon siirtämiseen. Sen avulla selaimet ja palvelimet tavallisesti lähettävät dataa toisilleen.'],
        ['JSONin syntaksisäännöt', 'Avaimet ja merkkijonot kirjoitetaan kaksinkertaisiin lainausmerkkeihin. Sallittuja arvoja ovat vain oliot, taulukot, merkkijonot, luvut, true, false ja null. Funktiot, undefined, kommentit ja viimeisen alkion jälkeinen pilkku eivät ole sallittuja.'],
        ['JSON.stringify', '`JSON.stringify` muuntaa JavaScript-arvon JSON-merkkijonoksi, joka voidaan lähettää tai tallentaa. Funktiot ja undefined-arvoiset ominaisuudet jäävät pois ilman varoitusta.'],
        ['JSON.parse', '`JSON.parse` muuntaa JSON-merkkijonon takaisin JavaScript-arvoksi. Jos teksti ei ole kelvollista JSONia, syntyy SyntaxError.'],
      ],
    ],
  ],

  questions: [
    ['Mitä tämä tulostaa?', null, 'Kielen vanha omituisuus: `typeof null` on `object`. Tarkista null vertaamalla `value === null`.'],
    ['Mitä tämä tulostaa?', null, 'Plusmerkki yhdistää merkkijonon kanssa merkkijonoja, joten tulos on 53. Miinus toimii vain luvuilla, joten merkkijono muunnetaan luvuksi ja tulos on 2.'],
    ['Mitä tämä tulostaa?', null, 'Kaksi yhtäsuuruusmerkkiä muuntaa merkkijonon ensin luvuksi. Kolme yhtäsuuruusmerkkiä vertaa myös tyyppiä, eikä luku ole koskaan tiukasti yhtä suuri kuin merkkijono.'],
    ['Mikä näistä arvoista on falsy eli tulkitaan epätodeksi?', null, 'Epätosia arvoja ovat false, 0, tyhjä merkkijono, null, undefined ja NaN. Ei-tyhjä merkkijono, tyhjä taulukko ja tyhjä olio ovat kaikki tosia.'],
    ['Mitä tämä tulostaa?', [null, null, null, 'Syntyy TypeError'], 'Sijoitus ei kopioi oliota. `copy` ja `user` viittaavat samaan olioon, joten muutos näkyy kummankin kautta.'],
    ['Mitä tämä tulostaa?', [null, null, 'Syntyy TypeError', null], '`const` estää sijoittamasta muuttujaan uutta arvoa, mutta ei taulukon muuttamista. `list = [1, 2, 3]` aiheuttaisi virheen; `push` on sallittu.'],
    ['Mitä tämä tulostaa?', null, 'filter säilyttää parilliset luvut 2 ja 4. Sen jälkeen map kertoo kummankin kymmenellä.'],
    ['Mitä tämä tulostaa?', null, 'reduce aloittaa nollasta ja lisää jokaisen tuotteen hinnan kerrottuna määrällä: 1000 + 100.'],
    ['Mitä tämä tulostaa?', null, 'Jokainen makeCounter-kutsu luo oman count-muuttujansa. Funktiota a on kutsuttu kolme kertaa, funktiota b kerran.'],
    ['Mitä tämä tulostaa?', [null, null, null, 'Syntyy SyntaxError'], 'Aaltosulkeiden kanssa nuolifunktio tarvitsee erillisen return-lauseen. Ilman sitä funktio palauttaa arvon undefined.'],
    ['Mitä tämä tulostaa?', null, 'Ilman vertailufunktiota sort vertaa alkioita merkkijonoina, ja merkkijono 10 tulee ennen merkkijonoa 9. Käytä luvuille muotoa `sort((a, b) => a - b)`.'],
    ['Mitä tämä tulostaa?', null, 'b miinus a järjestää laskevaan järjestykseen, ja sort muuttaa alkuperäistä taulukkoa, joten suurin luku on nyt ensimmäisenä.'],
    [
      'Mitä tapahtuu, kun tämä suoritetaan?',
      ['Syntyy ReferenceError', 'Tulostuu `undefined`', 'Tulostuu `5`', 'Tulostuu `null`'],
      '`let`-muuttujaa ei voi käyttää ennen sen esittelyä. `var`-sanalla tämä tulostaisi sen sijaan undefined.',
    ],
    [
      'Mitä tämä tulostaa?',
      [null, null, null, 'Syntyy virhe, koska Dog-luokalla ei ole konstruktoria'],
      'Dog-luokalla ei ole omaa konstruktoria, joten yliluokan konstruktori suoritetaan ja se asettaa nimen. Dog korvaa speak-metodin ja kutsuu yliluokan versiota super-sanan kautta.',
    ],
    [
      'Mitä aliluokan konstruktorissa on tapahduttava, ennen kuin `this`-sanaa voi käyttää?',
      ['On kutsuttava `super()`', 'Kaikki ominaisuudet on esiteltävä `let`-sanalla', 'Yliluokasta on luotava ilmentymä `new`-sanalla', 'Ei mitään; `this` on aina käytettävissä'],
      'Perivässä luokassa olion luo yliluokan konstruktori, joten `this` ei ole olemassa ennen kuin `super()` on suoritettu.',
    ],
    [
      'Mihin luokan metodit tallennetaan?',
      ['Kerran prototyyppiin, josta kaikki ilmentymät jakavat ne', 'Ne kopioidaan jokaiseen ilmentymään, kun se luodaan', 'Globaaliin näkyvyysalueeseen', 'Konstruktorifunktion paikallisiin muuttujiin'],
      'Metodit sijaitsevat kohteessa `ClassName.prototype`. Ilmentymät löytävät ne kulkemalla prototyyppiketjua ylöspäin.',
    ],
    ['Mikä näistä on kelvollista JSONia?', null, 'JSON vaatii kaksinkertaiset lainausmerkit avaimien ja merkkijonojen ympärille eikä salli pilkkua viimeisen alkion jälkeen.'],
    ['Mitä tämä tulostaa?', null, 'stringify tuottaa merkkijonon. Olion saa takaisin kutsumalla `JSON.parse`.'],
  ],
}
