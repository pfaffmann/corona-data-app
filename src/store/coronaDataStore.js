import { action, thunk } from 'easy-peasy';

const OBJECT_ID_API_URL =
  'https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_COVID19/FeatureServer/0/query?where=1%3D1&objectIds=&time=&resultType=none&outFields=*&returnIdsOnly=true&returnUniqueIdsOnly=false&returnCountOnly=false&returnDistinctValues=false&cacheHint=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&sqlFormat=none&f=pjson&token=';

const DATA_API_URL = (untereSchranke, obereSchranke) => {
  return `https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_COVID19/FeatureServer/0/query?where=objectId+>%3D+${untereSchranke}+AND+objectId+<+${obereSchranke}&objectIds=&time=&resultType=none&outFields=IdBundesland%2C+AnzahlFall%2C+AnzahlTodesfall%2C+AnzahlGenesen%2C+NeuerFall%2C+NeuerTodesfall%2C+NeuGenesen%2C+Meldedatum&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnDistinctValues=false&cacheHint=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&sqlFormat=none&f=pjson&token=`;
};
function combineArray(array) {
  let dataArray = [];
  array.map((data) => (dataArray = dataArray.concat(data.features)));
  return dataArray;
}

const coronaDataStore = {
  loading: false,
  error: '',
  data: null,
  setLoading: action((state, loading) => {
    state.loading = loading;
  }),
  setError: action((state, error) => {
    state.error = error;
  }),
  setData: action((state, data) => {
    state.data = data;
  }),
  getData: thunk(async (actions) => {
    actions.setLoading(true);
    try {
      let fetchedCoronaData = [];
      let result = await fetch(OBJECT_ID_API_URL);
      let data = await result.json();
      const maxSchranke = data.objectIds[data.objectIds.length - 1] - 1;
      const fetchCycles = Math.ceil(data.objectIds.length / 5000);
      for (let cycle = 0; cycle < fetchCycles; cycle++) {
        let untereSchranke = data.objectIds[cycle * 5000];
        let obereSchranke =
          untereSchranke + 5000 < maxSchranke
            ? untereSchranke + 5000
            : maxSchranke;
        let res = await fetch(DATA_API_URL(untereSchranke, obereSchranke));
        let d = await res.json();
        fetchedCoronaData.push(d);
      }
      actions.setData(combineArray(fetchedCoronaData));
    } catch (error) {
      actions.setError(error.message);
      actions.setData(null);
    }
    actions.setLoading(false);
  }),
};

export default coronaDataStore;
