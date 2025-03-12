// Créer un nouveau service de navigation
let navigate = null;

export const setNavigate = (navigateFunction) => {
  navigate = navigateFunction;
};

export const getNavigate = () => {
  return navigate;
};