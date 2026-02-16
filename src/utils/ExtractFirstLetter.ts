export const getFirstLetter = (name?: string): string => {
  return name ? name.trim().charAt(0).toUpperCase() : "";
};

