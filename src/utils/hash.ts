export const setHash = (str: string) => {
  location.hash = `#${encodeURIComponent(str)}`;
};

export const parseHash = () => decodeURIComponent(location.hash.slice(1));
