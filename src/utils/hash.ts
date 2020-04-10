export const setHash = (str: string) => {
  location.hash = !str ? '' : `#${encodeURIComponent(str)}`;
};

export const parseHash = () =>
  decodeURIComponent(location.hash.slice(1).toLowerCase());
