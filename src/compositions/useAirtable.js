import Airtable from 'airtable';
Airtable.configure({ apiKey: process.env.VUE_APP_AIRTABLE_API_KEY, endpointUrl: process.env.VUE_APP_AIRTABLE_ENDPOINT_URL, });

const useClipper = function () {
  const base = Airtable.base('appRkSKeFUiZJXDzA');
  return { base, };
};

export { useClipper };
