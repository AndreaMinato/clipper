import Airtable from 'airtable';
Airtable.configure({ apiKey: process.env.VUE_APP_AIRTABLE_API_KEY, endpointUrl: process.env.VUE_APP_AIRTABLE_ENDPOINT_URL, });

const useClipBase = function (table) {
  const airtable = Airtable.base('appRkSKeFUiZJXDzA')(table);
  return { airtable, };
};

export { useClipBase };
