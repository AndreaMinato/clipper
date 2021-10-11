import Airtable from 'airtable';
Airtable.configure({
  apiKey: import.meta.env.VITE_APP_AIRTABLE_API_KEY,
  endpointUrl: import.meta.env.VITE_APP_AIRTABLE_ENDPOINT_URL,
});

const useClipper = function (table) {
  const airtable = Airtable.base('appRkSKeFUiZJXDzA')(table);
  return { airtable, };
};

export { useClipper };
