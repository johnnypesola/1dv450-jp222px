# Backend (REST API)

### Instruktioner för att testa REST-API:t

Applikationen borde vara relativt lätt att testa då den finns tillgänglig på nätet under adressen http://www.pesola.se:3000.
Se till att ladda ner denna [Postman kollektionsfil för test av API:t](Climbing_report_REST_API_(ruby).json.postman_collection) och importera in i [Postman](https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop).

Den förinställa token som finns inställt i postman-konfigurationen har för studen en giltighetstid på två veckor, vilket gör att man under peer-reviewens tid inte borde bli utloggad.

Jag rekommenderar att REST-API:ts OAuth del (Session controllern) testas i slutskedet, eftersom man då slipper skriva in det nya genererade tokenet i Postmans alla anrop, vilket sparar en del tid.

[Här finns en enkel klient](http://www.pesola.se/temp/1dv450-client/) för att testa OAuth funktionaliteten (lånad ifrån John Häggerud). Den autentiserar emot Github för att sedan generera ett nytt token som sedan skickas med i varje API anrop.


# Backend (API nycklar)

### Ruby version

2.2.3

### Databas

mysql 14.14

### Instruktioner för att provköra backenden

Backenden har för närvarande ett beroende till en mysqldatabas på en server. Av den anledningen så finns applikationen tillgänglig för test online. http://www.pesola.se:3000
   
#### Inlogg för admin 
Användarnamn: admin@admin.com
Lösenord: password

# Frontend

Mer info kommer senare
