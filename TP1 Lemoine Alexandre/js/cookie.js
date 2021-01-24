class Cookie {
  static urlsImagesNormales = [
    "./assets/images/Croissant@2x.png",
    "./assets/images/Cupcake@2x.png",
    "./assets/images/Danish@2x.png",
    "./assets/images/Donut@2x.png",
    "./assets/images/Macaroon@2x.png",
    "./assets/images/SugarCookie@2x.png",
  ];
  static urlsImagesSurlignees = [
    "./assets/images/Croissant-Highlighted@2x.png",
    "./assets/images/Cupcake-Highlighted@2x.png",
    "./assets/images/Danish-Highlighted@2x.png",
    "./assets/images/Donut-Highlighted@2x.png",
    "./assets/images/Macaroon-Highlighted@2x.png",
    "./assets/images/SugarCookie-Highlighted@2x.png",
  ];

  constructor(type, ligne, colonne) {
    // A FAIRE
    this.type = type;
    this.ligne = ligne;
    this.colonne = colonne;
    this.htmlImage = document.createElement("img");
    this.htmlImage.src = Cookie.urlsImagesNormales[this.type];
    this.htmlImage.width = 80;
    this.htmlImage.height = 80;
    this.htmlImage.dataset.ligne = ligne;
    this.htmlImage.dataset.colonne = colonne;
    // on rajoute la classe CSS
    this.htmlImage.classList.add("cookies");
    this.supprimerCookie = false;
  }

  selectionnee() {
    // on change l'image et la classe CSS
    this.htmlImage.classList.add("cookies-selected");
    this.htmlImage.src = Cookie.urlsImagesSurlignees[this.type];
  }

  deselectionnee() {
    // on change l'image et la classe CSS
    this.htmlImage.classList.remove("cookies-selected");
    this.htmlImage.src = Cookie.urlsImagesNormales[this.type];
  }

  supprimer() {
    this.htmlImage.classList.add("cookie-cachee");
    this.supprimerCookie = true;
  }

  annulerASupprimer() {
    this.htmlImage.classList.remove("cookie-cachee");
    this.supprimerCookie = true;
  }

  isASupprimer() {
  //  return this.htmlImage.classList.contains("cookie-cachee");
    this.supprimerCookie = true;
  }

  static swapCookies(cookie1, cookie2) {
    console.log("SWAP C1 C2");
    // On échange leurs images et types
    let tmpType = cookie1.type;
    let tmpImgSrc = cookie1.htmlImage.src;
    let tmpSup =cookie1.supprimerCookie;
    let tmpImage = cookie1.classList;

    cookie1.type = cookie2.type;
    cookie1.htmlImage.src = cookie2.htmlImage.src;
    cookie1.supprimerCookie = cookie2.supprimerCookie
    cookie1.classList = cookie2.classList;

    cookie2.type = tmpType;
    cookie2.htmlImage.src = tmpImgSrc;
    cookie2.supprimerCookie = tmpSup;
    cookie2.classList=tmpImage;
    
    // et on remet les désélectionne
  }

  /** renvoie la distance entre deux cookies */
  static distance(cookie1, cookie2) {
    let l1 = cookie1.ligne;
    let c1 = cookie1.colonne;
    let l2 = cookie2.ligne;
    let c2 = cookie2.colonne;

    const distance = Math.sqrt((c2 - c1) * (c2 - c1) + (l2 - l1) * (l2 - l1));
    console.log("Distance = " + distance);
    return distance;
  }
}
