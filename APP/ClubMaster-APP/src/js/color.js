/**
 * Retourne une couleur hexa calculée par rapport aux valeurs des caractères de la valeur envoyée
 * 
 * Valeur attendue : ClubMaster
 * 
 * Formatage retourné : #RRGGBB
 * 
 * @param {string} val Un label
 * 
 * @returns {string} couleur hexa
 */
export function getColorFromString(val) {
    if (!val || typeof val !== 'string') {
        return '#000000';
    }

    let hash = 0;
    for (let i = 0; i < val.length; i++) {
        hash = val.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';
    for (let i = 0; i < 3; i++) {
        const value = (hash >> (i * 8)) & 0xFF;
        color += ('00' + value.toString(16)).substr(-2);
    }

    return color;
}