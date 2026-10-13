// Finnish translation of week 1. Same order as ../w1.js, item for item; code examples are shared.
// Topics are [title, points], points are [term, text], questions are [question, options, why].
// An option left as null (or a whole options list left as null) is shown as in the original,
// which is right for options that are code.

export default {
  label: 'Viikko 1',
  title: 'HTML ja CSS',
  blurb: 'Miten web toimii, HTML:n rakenne ja semantiikka, CSS-valitsimet ja kaskadi, laatikkomalli, Flexbox ja responsiivinen suunnittelu.',
  topics: [
    [
      'Miten web toimii',
      [
        ['Asiakas–palvelin-malli', 'Selain on asiakas: se lähettää pyynnön, ja palvelin lähettää takaisin vastauksen. Asiakas aloittaa aina keskustelun; palvelin ainoastaan vastaa.'],
        ['URL:n rakenne', 'URL koostuu skeemasta, kuten `https`, isäntänimestä, kuten `example.com`, valinnaisesta portista, polusta, kysymysmerkin jälkeisestä valinnaisesta kyselyosasta ja risuaidan jälkeisestä valinnaisesta fragmentista.'],
        ['DNS', 'Nimipalvelu DNS muuntaa verkkotunnuksen palvelimen IP-osoitteeksi. Haku tehdään ennen kuin selain voi muodostaa yhteyden.'],
        ['HTTP-pyyntö', 'Pyynnössä on metodi, kuten GET tai POST, polku, otsakkeet ja joillakin metodeilla runko.'],
        ['HTTP-vastaus', 'Vastauksessa on tilakoodi, otsakkeita, kuten `Content-Type`, ja yleensä runko: HTML:ää, CSS:ää, JavaScriptiä, JSONia tai kuva.'],
        ['HTTP on tilaton', 'Jokainen pyyntö on itsenäinen. Palvelin ei muista aiemmista pyynnöistä mitään, ellei asiakas lähetä joka kerta jotakin mukana, esimerkiksi evästettä tai tokenia.'],
        ['Tilakoodien ryhmät', 'Kakkosella alkavat koodit tarkoittavat onnistumista, kolmosella alkavat uudelleenohjausta, nelosella alkavat asiakkaan virhettä ja vitosella alkavat palvelimen virhettä. Muista 200 OK, 404 Not Found ja 500 Internal Server Error.'],
        ['Sivun lataaminen', 'Selain pyytää HTML:n, jäsentää sen DOMiksi ja tekee sitten erillisen pyynnön jokaisesta linkitetystä tyylitiedostosta, skriptistä ja kuvasta, ennen kuin se voi piirtää sivun.'],
        ['HTML, CSS ja JavaScript', 'HTML antaa sivulle rakenteen ja merkityksen, CSS määrää ulkoasun, ja JavaScript lisää toiminnallisuuden ja vuorovaikutuksen.'],
      ],
    ],
    [
      'HTML:n rakenne',
      [
        ['Dokumentin runko', 'Jokainen sivu alkaa doctype-määrittelyllä. Sen jälkeen tulee `<html>`-elementti, jonka sisällä on `<head>` metatiedoille, kuten otsikolle ja tyylitiedostolinkeille, ja `<body>` kaikelle näkyvälle sisällölle.'],
        ['Elementin rakenne', 'Elementti koostuu aloitustagista, sisällöstä ja lopetustagista. Attribuutit kirjoitetaan aloitustagin sisään nimi–arvo-pareina.'],
        ['Tyhjät elementit', 'Joillakin elementeillä ei ole sisältöä eikä lopetustagia. Yleisimmät ovat `<img>`, `<br>`, `<hr>`, `<input>`, `<meta>` ja `<link>`.'],
        ['Sisäkkäisyys', 'Elementit voivat sisältää toisia elementtejä, mutta ne on suljettava päinvastaisessa järjestyksessä kuin ne avattiin. Limittäin menevät tagit ovat virheellisiä.'],
        ['Otsikot', 'Otsikkotasoja on `<h1>`:stä `<h6>`:een, ja ne muodostavat sivun sisällysluettelon. Valitse taso sisällön rakenteen mukaan, älä sen mukaan, kuinka suurelta haluat tekstin näyttävän.'],
        ['Linkit ja kuvat', 'Linkki on `<a>`-elementti, jolla on `href`-attribuutti. Kuva on `<img>`-elementti, jossa `src` kertoo tiedoston ja `alt` on tekstikuvaus. Ruudunlukijat käyttävät kuvausta, ja se näytetään, jos kuva ei lataudu.'],
        ['Listat', 'Järjestämätön lista `<ul>` näyttää luettelomerkit ja järjestetty lista `<ol>` numerot. Kummassakin jokainen kohta on `<li>`-elementti.'],
        ['Lohko- ja rivielementit', 'Lohkoelementit, kuten `<div>`, `<p>` ja `<h1>`, alkavat uudelta riviltä ja vievät koko käytettävissä olevan leveyden. Rivielementit, kuten `<span>`, `<a>` ja `<strong>`, kulkevat tekstirivin sisällä.'],
        ['id ja class', '`id`:n on oltava sivulla yksilöllinen. Samaa `class`-arvoa voi käyttää monessa elementissä, ja yhdellä elementillä voi olla useita luokkia välilyönnillä erotettuina.'],
        [
          'Merkkiviittaukset',
          'HTML:n varaamat merkit kirjoitetaan merkkiviittauksina: `&lt;` on pienempi kuin -merkki, `&gt;` suurempi kuin -merkki ja `&amp;` et-merkki.',
          'HTML:n varaamat merkit kirjoitetaan merkkiviittauksina: et-merkki, L, T ja puolipiste on pienempi kuin -merkki. Et-merkki, G, T ja puolipiste on suurempi kuin -merkki. Et-merkki, A, M, P ja puolipiste on itse et-merkki.',
        ],
      ],
    ],
    [
      'Semanttinen HTML',
      [
        ['Semanttiset elementit', 'Semanttiset elementit kertovat, mitä sisältö tarkoittaa, eivät miltä se näyttää. Tärkeimmät ovat `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>` ja `<footer>`.'],
        ['Miksi semantiikalla on väliä', 'Semanttinen merkkaus tekee sivusta saavutettavan ruudunlukijoille, helpomman hakukoneiden ymmärtää ja helpomman kehittäjien lukea ja ylläpitää.'],
        ['div ja span', '`<div>` on yleinen lohkosäiliö ja `<span>` yleinen rivisäiliö. Kummallakaan ei ole merkitystä, joten käytä niitä vain, kun mikään semanttinen elementti ei sovi.'],
        ['article vai section', '`<article>` on itsenäinen kokonaisuus, joka olisi ymmärrettävä yksinäänkin, kuten blogikirjoitus tai tuotekortti. `<section>` ryhmittelee yhteen kuuluvaa sisältöä otsikon alle.'],
        ['Lomakkeen perusteet', '`<form>` ryhmittelee syöttökentät. Jokaisella `<input>`-kentällä pitäisi olla `<label>`, joka yhdistetään kenttään toisiaan vastaavilla `for`- ja `id`-attribuuteilla. `name`-attribuutti on avain, jolla arvo lähetetään.'],
      ],
    ],
    [
      'CSS:n perusteet ja valitsimet',
      [
        ['CSS-sääntö', 'Sääntö koostuu valitsimesta ja sitä seuraavasta määrittelylohkosta. Jokainen määrittely on ominaisuus, kaksoispiste, arvo ja puolipiste.'],
        ['Kolme tapaa lisätä CSS', 'Tavallisin tapa on ulkoinen tyylitiedosto, joka linkitetään `<link>`-elementillä head-osassa. Säännöt voi kirjoittaa myös `<style>`-elementtiin tai suoraan elementin `style`-attribuuttiin.'],
        ['Perusvalitsimet', 'Tyyppivalitsin, kuten `p`, osuu kaikkiin sen tyyppisiin elementteihin. Luokkavalitsin alkaa pisteellä, kuten `.card`. Id-valitsin alkaa risuaidalla, kuten `#main`.'],
        ['Valitsimien yhdistäminen', 'Valitsimia voi tarkentaa kirjoittamalla ne yhteen: `div.menu-item` osuu vain div-elementteihin, joilla on kyseinen luokka. Välilyönti tarkoittaa mitä tahansa jälkeläistä, kuten `nav a`, ja suurempi kuin -merkki vain suoria lapsia, kuten `ul > li`.'],
        ['Pseudoluokat', 'Pseudoluokka valitsee elementin tietyssä tilassa, ja se kirjoitetaan kaksoispisteen jälkeen: `a:hover`, kun osoitin on linkin päällä, `input:focus`, kun kenttä on aktiivinen, ja `li:first-child` listan ensimmäiselle kohdalle.'],
        ['Kaskadi', 'Kun useat säännöt asettavat elementille saman ominaisuuden, selain valitsee voittajan. Ensin ratkaisee spesifisyys; jos se on sama, voittaa lähdekoodissa myöhemmin tuleva sääntö.'],
        ['Spesifisyys', 'Vahvimmasta heikoimpaan: elementin oma `style`-attribuutti, sitten id-valitsimet, sitten luokat ja pseudoluokat, sitten elementtityypit. Yksi id voittaa minkä tahansa määrän luokkia, ja yksi luokka minkä tahansa määrän elementtityyppejä.'],
        ['Periytyminen', 'Tekstiominaisuudet, kuten `color`, `font-family` ja `line-height`, periytyvät lapsielementeille. Laatikko-ominaisuudet, kuten `margin`, `padding`, `border` ja `width`, eivät periydy.'],
        ['CSS-yksiköt', '`px` on kiinteä koko. Prosentti on suhteessa vanhempaan. `em` on suhteessa elementin omaan fonttikokoon ja `rem` juurielementin fonttikokoon. `vw` ja `vh` ovat prosentteja näkymän leveydestä ja korkeudesta.'],
      ],
    ],
    [
      'Laatikkomalli',
      [
        ['Laatikkomalli', 'Jokainen elementti on suorakulmainen laatikko, jossa on neljä kerrosta. Sisältä ulospäin: sisältö, täyte eli padding, reunus eli border ja marginaali eli margin.'],
        ['Padding vai margin', 'Padding on reunuksen sisäpuolella oleva tila reunuksen ja sisällön välissä, ja elementin tausta näkyy sen läpi. Margin on reunuksen ulkopuolella oleva läpinäkyvä tila, joka työntää muut elementit kauemmas.'],
        ['box-sizing', 'Oletuksena `width` asettaa vain sisällön leveyden, joten padding ja reunus lisätään sen päälle. Arvolla `box-sizing: border-box` leveys sisältää myös paddingin ja reunuksen.'],
        ['display-ominaisuus', '`display: block` asettaa elementin omalle rivilleen. `inline` pitää sen tekstivirrassa eikä huomioi leveyttä ja korkeutta. `inline-block` kulkee rivillä mutta noudattaa leveyttä ja korkeutta. `none` poistaa elementin sivulta.'],
        ['Lyhennetyt arvot', 'Kahdella arvolla, kuten `margin: 10px 20px`, ensimmäinen koskee ylä- ja alareunaa ja toinen vasenta ja oikeaa reunaa. Neljä arvoa kiertävät myötäpäivään: ylä, oikea, ala, vasen.'],
        ['Lohkon keskittäminen', 'Anna lohkoelementille leveys tai enimmäisleveys ja aseta `margin: 0 auto`. Selain jakaa ylijäävän vaakatilan tasan molemmille puolille.'],
      ],
    ],
    [
      'Flexbox',
      [
        ['Flex-säiliö ja flex-elementit', 'Kun elementille asetetaan `display: flex`, siitä tulee flex-säiliö. Sen suorista lapsista tulee flex-elementtejä, jotka asettuvat oletuksena riviin.'],
        ['Pääakseli ja poikkiakseli', 'Pääakseli kulkee flex-suunnan mukaan, oletuksena vaakasuunnassa. Poikkiakseli on kohtisuorassa sitä vastaan. Arvolla `flex-direction: column` akselit vaihtavat paikkaa, eli pääakselista tulee pystysuora.'],
        ['justify-content', 'Jakaa elementit pääakselin suunnassa. Arvoja ovat `flex-start`, `center`, `flex-end`, `space-between`, `space-around` ja `space-evenly`. `space-between` työntää ensimmäisen ja viimeisen elementin reunoihin.'],
        ['align-items', 'Sijoittaa elementit poikkiakselin suunnassa. Oletus on `stretch`, joka venyttää jokaisen elementin säiliön korkuiseksi. Muita arvoja ovat `flex-start`, `center` ja `flex-end`.'],
        ['Täydellinen keskitys', 'Kun haluat keskittää jotakin sekä vaaka- että pystysuunnassa, tee sen vanhemmasta flex-säiliö ja aseta sekä `justify-content` että `align-items` arvoon `center`.'],
        ['flex-wrap ja gap', 'Oletuksena elementit eivät rivity vaan kutistuvat mahtuakseen yhdelle riville. `flex-wrap: wrap` antaa niiden siirtyä uusille riveille. `gap` asettaa elementtien välisen tilan ilman marginaaleja.'],
        ['flex-grow', 'Määrää, miten ylijäävä tila jaetaan. Elementti, jolla on `flex-grow: 1`, kasvaa täyttämään vapaan tilan, ja useat tällaiset elementit jakavat sen tasan. Tavallisesti tämä kirjoitetaan lyhenteellä `flex: 1`.'],
        ['Flexboxin tyypilliset käyttökohteet', 'Navigointipalkit arvolla `space-between`, sisällön keskittäminen, rivittyvät korttirivit sekä sivun alareunassa pysyvä alatunniste, joka tehdään sarakesuuntaisella säiliöllä, jossa pääsisällöllä on `flex: 1`.'],
      ],
    ],
    [
      'Responsiivinen suunnittelu',
      [
        ['Viewport-metatagi', 'Ilman viewport-metatagia puhelin piirtää sivun pienennettynä työpöytäsivuna. Tagi käskee selainta käyttämään laitteen todellista leveyttä.'],
        ['Mediakyselyt', 'Mediakysely ottaa säännöt käyttöön vain, kun ehto täyttyy. Ehto on useimmiten näkymän vähimmäis- tai enimmäisleveys.'],
        ['Mobiili ensin', 'Kirjoita perustyylit pienille näytöille ja lisää sitten `min-width`-mediakyselyt, jotka muokkaavat asettelua suuremmille näytöille.'],
        ['Joustava mitoitus', 'Suosi prosentteja, `rem`-yksikköä, `max-width`-ominaisuutta ja flex-rivitystä kiinteiden pikselileveyksien sijaan, jotta asettelu mukautuu myös murtokohtien välillä. Kuvilla `max-width: 100%` estää niitä valumasta säiliönsä yli.'],
      ],
    ],
  ],

  questions: [
    [
      'Mikä HTTP-vastauksen osa kertoo selaimelle, onnistuiko pyyntö?',
      ['Tilakoodi', 'Content-Type-otsake', 'Pyynnön metodi', 'URL:n fragmentti'],
      'Tilakoodi tiivistää tuloksen: 2xx onnistui, 3xx uudelleenohjaus, 4xx asiakkaan virhe, 5xx palvelimen virhe.',
    ],
    [
      'Palvelin vastaa tilakoodilla 404. Mitä se kertoo?',
      ['Asiakas pyysi resurssia, jota ei ole olemassa', 'Palvelin kaatui pyyntöä käsitellessään', 'Resurssi on siirretty uuteen osoitteeseen', 'Pyyntö onnistui, mutta sisältöä ei ole'],
      '4xx-koodit ovat asiakkaan virheitä. 404 tarkoittaa Not Found eli ei löytynyt. Palvelimen kaatuminen olisi 5xx-koodi.',
    ],
    [
      'Mitä tarkoittaa, että HTTP on tilaton?',
      ['Jokainen pyyntö käsitellään itsenäisesti; palvelin ei muista aiempia pyyntöjä', 'Palvelin ei voi koskaan tallentaa mitään tietoa', 'Yhteys ei ole salattu', 'Vastauksissa ei koskaan ole tilakoodia'],
      'Tilattomuus koskee protokollaa: pyyntöjen välillä ei säily mitään, ellei asiakas lähetä tietoa uudelleen esimerkiksi evästeessä.',
    ],
    [
      'Mikä näistä on tyhjä elementti, joka kirjoitetaan ilman lopetustagia?',
      null,
      '`<img>`-elementillä ei ole sisältöä, joten sillä ei ole lopetustagia. Sama koskee elementtejä `<br>`, `<input>`, `<meta>` ja `<link>`.',
    ],
    [
      'Mikä elementti sopii parhaiten sivuston päänavigaation linkeille?',
      null,
      '`<nav>` on navigaation semanttinen elementti. Div toimii ulkoasun kannalta, mutta se ei kerro mitään ruudunlukijoille eikä hakukoneille.',
    ],
    [
      'Minkä värinen otsikon teksti on?',
      ['Keltainen', 'Vihreä', 'Sininen', 'Musta'],
      'Elementin oma `style`-attribuutti on spesifisempi kuin mikään tyylitiedoston valitsin, joten se voittaa.',
    ],
    [
      'Toisella otsikolla ei ole style-attribuuttia. Minkä värinen se on?',
      ['Vihreä', 'Sininen', 'Keltainen', 'Musta'],
      'Molemmissa säännöissä valitsin on `h1`, joten spesifisyys on sama ja myöhempi sääntö voittaa. `<style>`-lohko tulee linkitetyn tiedoston jälkeen.',
    ],
    [
      'Minkä värinen kappaleen teksti on?',
      ['Punainen', 'Sininen', 'Vihreä', 'Musta'],
      'Id-valitsin voittaa minkä tahansa luokkien ja elementtityyppien yhdistelmän riippumatta siitä, missä kohdassa lähdekoodia se on.',
    ],
    [
      'Kuinka leveä tämä laatikko on ruudulla, kun `box-sizing` on oletusarvossaan?',
      null,
      'Oletusarvolla content-box leveys tarkoittaa vain sisältöä: 200 + 20 + 20 paddingia + 5 + 5 reunusta = 250 pikseliä.',
    ],
    [
      'Kuinka leveä tämä laatikko on ruudulla?',
      null,
      'Arvolla border-box leveys sisältää paddingin ja reunuksen, joten laatikko on tasan 200 pikseliä leveä ja sisältöalue kutistuu 150 pikseliin.',
    ],
    [
      'Tässä säiliössä on neljä valikkokohtaa. Miten ne asettuvat?',
      [
        'Riviin: ensimmäinen vasempaan reunaan, viimeinen oikeaan reunaan ja tasaiset välit niiden väliin',
        'Riviin, kaikki tiiviisti keskelle',
        'Sarakkeeseen, ylhäältä alas jaettuna',
        'Riviin niin, että jokaisen kohdan molemmilla puolilla on yhtä paljon tilaa, myös reunoilla',
      ],
      'Oletussuunta on rivi, ja `space-between` sijoittaa vapaan tilan vain elementtien väliin, joten reunimmaiset elementit koskettavat reunoja.',
    ],
    [
      'Mitä `align-items: center` tekee tässä säiliössä?',
      ['Keskittää elementit vaakasuunnassa', 'Keskittää elementit pystysuunnassa', 'Keskittää tekstin jokaisen elementin sisällä', 'Ei mitään, koska suunta on column'],
      '`align-items` vaikuttaa poikkiakselin suunnassa. Sarakesäiliössä pääakseli on pystysuora, joten poikkiakseli on vaakasuora.',
    ],
    [
      'Näkyykö valikko puhelimessa, jonka näyttö on 480 pikseliä leveä?',
      ['Ei, se on piilotettu', 'Kyllä, flex-säiliönä', 'Kyllä, lohkoelementtinä', 'Vasta kun sivua zoomataan'],
      'Mediakysely on voimassa vasta 600 pikselin leveydestä alkaen. 480 pikselin leveydellä vain ensimmäinen sääntö on voimassa.',
    ],
    [
      'Mikä ominaisuus periytyy oletuksena lapsielementeille?',
      null,
      'Tekstiominaisuudet, kuten color ja font-family, periytyvät. Laatikko-ominaisuudet eivät periydy; muuten jokainen lapsi saisi vanhempansa reunuksen.',
    ],
    [
      'Mikä on paddingin ja marginin ero?',
      [
        'Padding on reunuksen sisäpuolella, margin sen ulkopuolella',
        'Padding on reunuksen ulkopuolella, margin sen sisäpuolella',
        'Padding toimii vain lohkoelementeissä, margin vain rivielementeissä',
        'Eroa ei ole; ne ovat kaksi nimeä samalle tilalle',
      ],
      'Sisältä ulospäin laatikkomalli on sisältö, padding, reunus, margin. Taustaväri täyttää paddingin mutta ei marginia.',
    ],
    [
      'Mikä metatagi saa sivun asettumaan oikein puhelimessa?',
      null,
      'Ilman viewport-tagia puhelin esittää olevansa leveä työpöytänäyttö ja pienentää sivun, jolloin mediakyselyt eivät koskaan täsmää.',
    ],
  ],
}
