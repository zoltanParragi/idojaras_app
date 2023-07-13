# Időjárás App

A világ fővárosaira vonatkozó aktuális időjárás és 5 napos időjárás előrejelzés adatok megjelenítése és naplózása.

## Felhasznált technológiák

- Frontend: ReactJS
- HTML/CSS keretrendszer: Bootstrap
- Google charts
- Backend: Laravel 8.83.27
- Adatbázis: MySQL

## API-k

- A világ országai és fővárosaik: https://countriesnow.space
- Települések geo koordinátái: http://api.openweathermap.org/geo
- Időjárás adatok: http://api.weatherapi.com

## Használat, tulajdonságok

- Kezdjük el begépelni az adott város nevét a keresőmezőbe.
- A megjelenő legördülő listából kiválaszthatjuk a megfelelő várost.
- A kiválasztás után megjelennek az adott városra vonatkozó aktuális és 5 napos előrejelzési adatok.
- A hőmérséklet adatok áttekintését grafikon segíti.
- A lekéréskor az adatbázisban mentésre kerül az adott város neve, az 5 napos előrejelzési adatok, a kliens IP címe és a lekérés ideje.


