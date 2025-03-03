export const downloadMembershipForm = async (response, clubLabel) => {
    try {
        // Vérifier si la réponse est directement un Blob ou contenue dans response.data
        const pdfBlob = response instanceof Blob ? response : response.data;
        
        if (!pdfBlob || !(pdfBlob instanceof Blob)) {
            throw new Error('La réponse n\'est pas un PDF valide');
        }

        // Vérifier la taille du blob
        if (pdfBlob.size === 0) {
            throw new Error('Le PDF reçu est vide');
        }

        const url = window.URL.createObjectURL(pdfBlob);
        
        // Créer un lien temporaire et déclencher le téléchargement
        const link = document.createElement('a');
        link.href = url;
        link.download = `formulaire-adhesion-${clubLabel}-${new Date().toLocaleDateString('fr-FR').replace(/\//g, '-')}.pdf`;
        
        // Ajouter le lien de manière cachée
        link.style.display = 'none';
        document.body.appendChild(link);
        
        // Déclencher le téléchargement
        link.click();
        
        // Nettoyer après un court délai pour s'assurer que le téléchargement a commencé
        setTimeout(() => {
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        }, 100);
    } catch (error) {
        console.error('Erreur détaillée lors du téléchargement du formulaire:', {
            message: error.message,
            error: error,
            stack: error.stack
        });
        alert('Erreur lors du téléchargement du formulaire. Veuillez réessayer.');
    }
};