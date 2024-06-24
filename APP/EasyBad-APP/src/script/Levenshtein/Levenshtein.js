const Minimum = (nb1, nb2, nb3) => {
    return Math.min(nb1, Math.min(nb2, nb3));
}

const Levenshtein = (chaine1, chaine2) => {
    const LEN_STR_1 = chaine1.length;
    const LEN_STR_2 = chaine2.length;

    // Initialisation de la matrice dist
    let dist = [];
    for (let i = 0; i <= LEN_STR_1; i++) {
        dist[i] = [];
        dist[i][0] = i;
    }
    for (let j = 0; j <= LEN_STR_2; j++) {
        dist[0][j] = j;
    }

    // Calcul de la distance de Levenshtein
    for (let i = 1; i <= LEN_STR_1; i++) {
        for (let j = 1; j <= LEN_STR_2; j++) {
            let cost = (chaine1[i - 1] === chaine2[j - 1]) ? 0 : 1;
            dist[i][j] = Minimum(
                dist[i - 1][j] + 1,    // Effacement
                dist[i][j - 1] + 1,    // Insertion
                dist[i - 1][j - 1] + cost // Substitution
            );
        }
    }

    return dist[LEN_STR_1][LEN_STR_2];
}

export default Levenshtein;