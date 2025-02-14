import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Mettre à jour l'état pour que le prochain rendu affiche l'UI de repli
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Vous pouvez également loguer l'erreur dans un service de reporting
    console.error('Erreur capturée par ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Vous pouvez rendre n'importe quelle UI de repli
      return (
        <div className="error-boundary">
          <h1>Oups! Quelque chose s'est mal passé.</h1>
          <p>Nous sommes désolés pour la gêne occasionnée. Veuillez réessayer plus tard.</p>
          <button onClick={() => window.location.reload()}>Rafraîchir la page</button>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;