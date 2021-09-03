export const getRootUrl = () => {
  let rootUrl = "";

  if (
    process.env.NODE_ENV === "development" ||
    process.env.NODE_ENV === "test"
  ) {
    rootUrl = "http://localhost:3333/api";
  } else {
    rootUrl = "https://money-tracker-monorepo-api.herokuapp.com/api";
  }
  return rootUrl;
};
