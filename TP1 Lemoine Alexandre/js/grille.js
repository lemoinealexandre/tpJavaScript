/* Classe principale du jeu, c'est une grille de cookies. Le jeu se joue comme
Candy Crush Saga etc... c'est un match-3 game... */
class Grille {
  tabCookiesCliquees = [];
  nbCookiesDifferents = 6;

  constructor(l, c) {
    this.nbLignes = l;
    this.nbColonnes = c;

    this.remplirTableauDeCookies();
  }

  /**
   * parcours la liste des divs de la grille et affiche les images des cookies
   * correspondant à chaque case. Au passage, à chaque image on va ajouter des
   * écouteurs de click et de drag'n'drop pour pouvoir interagir avec elles
   * et implémenter la logique du jeu.
   */
  showCookies() {
    let caseDivs = document.querySelectorAll("#grille div");

    caseDivs.forEach((div, index) => {
      let ligne = Math.floor(index / this.nbColonnes);
      let colonne = index % this.nbColonnes;

      /*console.log(
        "On remplit le div index=" + index + " l=" + ligne + " col=" + colonne
      );*/
      let img = this.tabCookies[ligne][colonne].htmlImage;
      // on affiche l'image dans le div pour la faire apparaitre à l'écran.

      img.onclick = (evt) => {
        let imgClickee = evt.target;
        let l = imgClickee.dataset.ligne;
        let c = imgClickee.dataset.colonne;
        let cookieCliquee = this.tabCookies[l][c];
        cookieCliquee.selectionnee();

        if (this.tabCookiesCliquees.length === 0) {
          // le tableau est vide
          this.tabCookiesCliquees.push(cookieCliquee);
        } else if (this.tabCookiesCliquees.length === 1) {
          // le tableau a déjà une cookie dedans, on traite donc ici
          // le cas de la seconde cookie
          this.tabCookiesCliquees.push(cookieCliquee);

          if (this.swapPossible()) {
            console.log("swap");
            this.swapCookies();
          } else {
            console.log("SWAP PAS POSSIBLE");
          }
          // dans tous les cas on remet le tableau qui contient les
          // deux cookies à vide et on les déselectionne
          this.tabCookiesCliquees[0].deselectionnee();
          this.tabCookiesCliquees[1].deselectionnee();
          this.tabCookiesCliquees = [];
        }
      };

      // ------- pour le drag n drop
      img.ondragstart = (evt) => {
        console.log("dragstart");
        let imgClickee = evt.target;
        let l = imgClickee.dataset.ligne;
        let c = imgClickee.dataset.colonne;
        let cookieDragguee = this.tabCookies[l][c];

        this.tabCookiesCliquees = [];
        this.tabCookiesCliquees.push(cookieDragguee);
        cookieDragguee.selectionnee();

        // on peut copier une valeur dans le "clipboard"
      };

      img.ondragover = (evt) => {
        return false;
      };

      img.ondragenter = (evt) => {
        console.log("ondragenter");
        let img = evt.target;
        // on ajoute la classe CSS grilleDragOver
        img.classList.add("grilleDragOver");
      };

      img.ondragleave = (evt) => {
        console.log("ondragleave");
        let img = evt.target;
        // on enlève la classe CSS grilleDragOver
        img.classList.remove("grilleDragOver");
      };

      img.ondrop = (evt) => {
        console.log("ondrop");
        let imgDrop = evt.target;
        let l = imgDrop.dataset.ligne;
        let c = imgDrop.dataset.colonne;
        let cookieSurZoneDeDrop = this.tabCookies[l][c];

        this.tabCookiesCliquees.push(cookieSurZoneDeDrop);

        if (this.swapPossible()) {
          console.log("swap");
          this.swapCookies();
        } else {
          console.log("SWAP PAS POSSIBLE");
        }
        this.tabCookiesCliquees[0].deselectionnee();
        this.tabCookiesCliquees[1].deselectionnee();
        imgDrop.classList.remove("grilleDragOver");

        this.tabCookiesCliquees = [];
      };
      div.append(img);
    });
  }
  swapPossible() {
    let cookie1 = this.tabCookiesCliquees[0];
    let cookie2 = this.tabCookiesCliquees[1];

    /*
    let diffLignes = Math.abs(cookie1.ligne - cookie2.ligne);
    let diffColonnes = Math.abs(cookie1.colonne - cookie2.colonne);

    return (diffLignes === 1) || (diffColonnes === 1);
    */
    return Cookie.distance(cookie1, cookie2) === 1;
  }

  swapCookies() {
    let cookie1 = this.tabCookiesCliquees[0];
    let cookie2 = this.tabCookiesCliquees[1];

    let tmpType = cookie1.type;
    let tmpImgSrc = cookie1.htmlImage.src;

    cookie1.type = cookie2.type;
    cookie1.htmlImage.src = cookie2.htmlImage.src;

    cookie2.type = tmpType;
    cookie2.htmlImage.src = tmpImgSrc;

    // on a swappé, est-ce qu'on a un ou plusieurs alignement ?
    while (this.detecteTousLesAlignements()){
      this.remplirTrouDeLaGrille();
    }
    
  }
  /**
   * Initialisation du niveau de départ. Le paramètre est le nombre de cookies différents
   * dans la grille. 4 types (4 couleurs) = facile de trouver des possibilités de faire
   * des groupes de 3. 5 = niveau moyen, 6 = niveau difficile
   *
   * Améliorations : 1) s'assurer que dans la grille générée il n'y a pas déjà de groupes
   * de trois. 2) S'assurer qu'il y a au moins 1 possibilité de faire un groupe de 3 sinon
   * on a perdu d'entrée. 3) réfléchir à des stratégies pour générer des niveaux plus ou moins
   * difficiles.
   *
   * On verra plus tard pour les améliorations...
   */
  remplirTableauDeCookies() {
    // A FAIRE
    // déclarer le tableau des cookies
    this.tabCookies = create2DArray(9);

    do {
      console.log("ON ESSAIE DE GENERER UNE GRILLE SANS ALIGNEMENTS");
      // faire ceci tant que la condition dans le while est vraie
      //le remplir ligne par ligne et colonne par colonne
      // avec une instance de cookie dont le type est tiré
      // au hasard parmi les nbDeCookiesDifferents possibles
      for (let l = 0; l < this.nbLignes; l++) {
        for (let c = 0; c < this.nbColonnes; c++) {
          let type = Math.floor(Math.random() * this.nbCookiesDifferents);
          this.tabCookies[l][c] = new Cookie(type, l, c);
        }
      }
    } while (this.detecteTousLesAlignements());

    // on a généré une grille sans aucun alignement au départ
    console.log("GRILLE SANS ALIGNEMENTS GENEREE");
  }

  detecteTousLesAlignements() {
    this.nbAlignements = 0;

    // pour chaque ligne on va appeler detecteAlignementLigne et idem pour chaque colonne
    for (let l = 0; l < this.nbLignes; l++) {
      this.detecteAlignementLigne(l);
    }

    for (let c = 0; c < this.nbColonnes; c++) {
      this.detecteAlignementColonne(c);
    }

    return this.nbAlignements !== 0;
  }

  
  detecteAlignementLigne(ligne) {
    // on va parcourir la ligne et voir si on des alignements
    let ligneGrille = this.tabCookies[ligne];

    //console.log(ligneGrille); // ok ça, c'est le tableau des cookies sur la ligne
    // on va le parcourir de l'index 0 à l'index 6 inclu (this.nbColonnes -3);le dernier
    // triplet testé sera composé des cookies aux indexes 6, 7 et 8 (on va de 0 à 9)

    for (let l = 0; l <= this.nbColonnes - 3; l++) {
      //console.log("Je teste les indexes " + l + " " + (l + 1) + " " + (l + 2));
      let cookie1 = ligneGrille[l];
      let cookie2 = ligneGrille[l + 1];
      let cookie3 = ligneGrille[l + 2];

      if (cookie1.type === cookie2.type && cookie1.type === cookie3.type) {
        // on marque les trois
        cookie1.supprimer();
        cookie2.supprimer();
        cookie3.supprimer();
        this.nbAlignements++;
      }
    }
  }


  detecteAlignementColonne(colonne) {
    // on veut afficher les cookies situées sur une colonne donnée
    for (let ligne = 0; ligne <= this.nbLignes - 3; ligne++) {
      //console.log("On va examiner la case " + ligne + " " + colonne);
      let cookie1 = this.tabCookies[ligne][colonne];
      let cookie2 = this.tabCookies[ligne + 1][colonne];
      let cookie3 = this.tabCookies[ligne + 2][colonne];

      if (cookie1.type === cookie2.type && cookie1.type === cookie3.type) {
        // on marque les trois
        cookie1.supprimer();
        cookie2.supprimer();
        cookie3.supprimer();

        this.nbAlignements++;
      }
    }
  }

  remplirTrouDeLaGrille() {
    let valeur = 0;
    for (let ligne = this.nbLignes-1; ligne >= 0; ligne--) {
      for (let col = 0; col < this.nbColonnes; col++) {
        let cookie1 = this.tabCookies[ligne][col];
        if (cookie1.supprimerCookie && !this.tabCookies[ligne-1][col].supprimerCookie) {
          for (let i = ligne; i >= 0; i--) {
            
            
            
            if (i==0){
              this.tabCookies[i][col].annulerASupprimer();
              let newType = Math.floor(Math.random() * this.nbCookiesDifferents);
              this.tabCookies[i][col].type = newType;
              this.tabCookies[i][col].htmlImage.src = Cookie.urlsImagesNormales[newType];
              this.tabCookies[i][col].supprimerCookie= false;
            }
            else{
              this.tabCookies[i][col].annulerASupprimer();
              this.tabCookies[i][col].type = this.tabCookies[i-1][col].type;
              this.tabCookies[i][col].htmlImage.src = this.tabCookies[i-1][col].htmlImage.src;
              this.tabCookies[i][col].supprimerCookie= false;
            }
        
          }
        }
        else if (cookie1.supprimerCookie && this.tabCookies[ligne-1][col].supprimerCookie){
          for (let i = ligne; i >= 0; i--) {
            if(!this.tabCookies[i][col].supprimerCookie){
                valeur=i;
                break
            }
            
          } 
          if(valeur == 0 &&  this.tabCookies[0][col].supprimerCookie){
            let newType = Math.floor(Math.random() * this.nbCookiesDifferents);
            this.tabCookies[valeur][col].type = newType;
            this.tabCookies[valeur][col].htmlImage.src = Cookie.urlsImagesNormales[newType];
            this.tabCookies[valeur][col].supprimerCookie= false;
          }
          
            this.tabCookies[ligne][col].annulerASupprimer();
              this.tabCookies[ligne][col].type = this.tabCookies[valeur][col].type;
              this.tabCookies[ligne][col].htmlImage.src = this.tabCookies[valeur][col].htmlImage.src;;
              this.tabCookies[ligne][col].supprimerCookie= false;
              this.tabCookies[valeur][col].supprimerCookie=true;
              this.tabCookies[valeur][col].supprimer;
          
          
        }
        
        

      }
    }
  }
  
}
