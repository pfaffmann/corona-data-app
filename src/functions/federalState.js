import { sortArrayByMeldedatum, generateOctaveData } from './index';

export const filterArrayByFederalStateId = (array, id) => {
  let filteredArray = [];
  filteredArray = array.filter((a) => a.attributes.IdBundesland === id);
  return filteredArray;
};
export const getFederalStateObject = (array) => {
  let federalStateArray = [];
  const sortedArray = sortArrayByMeldedatum(array);
  const minMeldedatum = sortedArray[0].attributes.Meldedatum;
  const maxMeldedatum =
    sortedArray[sortedArray.length - 1].attributes.Meldedatum;
  const einTagInMs = 60 * 60 * 24 * 1000;
  const anzahlTage = (maxMeldedatum - minMeldedatum) / einTagInMs;
  //   console.log(
  //     `Min: ${minMeldedatum} Max: ${maxMeldedatum} Tage: ${anzahlTage}`
  //   );
  for (let i = 1; i <= 16; i++) {
    federalStateArray.push(
      sortArrayByMeldedatum(filterArrayByFederalStateId(array, i))
    );
  }
  return { federalStateArray, minMeldedatum, maxMeldedatum };
};

export const reduceFederalStateArray = (object) => {
  const { federalStateArray, minMeldedatum, maxMeldedatum } = object;
  let reducedArray = [];
  federalStateArray.map((federalArray) => {
    let length = 0;
    reducedArray.push(generateOctaveData(federalArray));
    length = reducedArray.length;
  });
  return { reducedArray, minMeldedatum, maxMeldedatum };
};

export const expandFederalStateObject = (object) => {
  const expandedArray = [];
  const { reducedArray, minMeldedatum, maxMeldedatum } = object;
  const dayInMs = 24 * 60 * 60 * 1000;
  const anzahlTage = (maxMeldedatum - minMeldedatum) / dayInMs;
  reducedArray.map((element) => {
    let length = element.length;
    while (length <= anzahlTage) {
      element.push({ date: length });
      length = element.length;
    }
  });
  let emptyArray = [anzahlTage + 1];
  const emptyEntry = {
    cases: 0,
    deaths: 0,
    recovered: 0,
    cummulatedCases: 0,
    cummulatedDeaths: 0,
    cummulatedRecovered: 0,
    nodata: true,
  };

  reducedArray.map((reduced) => {
    emptyArray = [];
    for (let i = 0; i <= anzahlTage; i++) {
      emptyArray[i] = { ...emptyEntry, date: minMeldedatum + i * dayInMs };
    }
    for (let i = 0; i < reduced.length; i++) {
      for (let j = 0; j < emptyArray.length; j++) {
        if (emptyArray[j].date === reduced[i].date) {
          emptyArray[j] = reduced[i];
          break;
        }
      }
    }
    expandedArray.push(emptyArray);
  });
  return expandedArray;
};

export const createFederalCoronaData = (data) => {
  return expandFederalStateObject(
    reduceFederalStateArray(getFederalStateObject(data))
  );
  //return reduceFederalStateArray(getFederalStateObject(data)).reducedArray;
};
