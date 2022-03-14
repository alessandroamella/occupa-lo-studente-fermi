# Occupa lo studente

Progetto SSH sviluppato da Alessandro Amella e Yaroslav Pavlik.

Gli aggiornamenti sullo sviluppo vengono pubblicati sul [diario di bordo](https://docs.google.com/document/d/1ny17KGs7dYGhpsIwQ2wDmOm99uGUGTmu0b_gZlSWAsM/edit?usp=sharing "diario di bordo").

## Architettura

Viene usato lo stack MERN insieme a Docker.

### Backend

Per la parte backend viene usato Node.js, TypeScript (JavaScript con tipizzazione statica), il framework Express per gestire il server web, e il database MongoDB.

### Frontend

Per il frontend viene usato React, che permette di avere uno stato interno senza dover modificare manualmente il DOM, e di suddividere il codice HTML in componenti.

### Docker

L'intera applicazione viene Dockerizzata in modo da poter essere facilmente utilizzabile ovunque.
Vengono creati 3 container: il backend, il frontend, e l'immagine di MongoDB

## Note

Alcune variabili d'ambiente usate nel backend sono segrete, come le credenziali per Google OAuth.

Per impostarle, bisogna creare un file `.env` all'interno della cartella `backend` e dichiararle lì nel formato `ENV=valore`.