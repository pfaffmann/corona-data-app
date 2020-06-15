export const generateOctaveData = function (array) {
  let octaveData = [];
  let datum = 0;
  let cummulatedCases = 0;
  let cummulatedRecovered = 0;
  let cummulatedDeaths = 0;
  let cases = 0;
  let recovered = 0;
  let deaths = 0;
  array.map((element, index, arr) => {
    if (index < arr.length - 1) {
      if (
        arr[index].attributes.Meldedatum ===
        arr[index + 1].attributes.Meldedatum
      ) {
        cases +=
          element.attributes.NeuerFall === 0 ||
          element.attributes.NeuerFall === 1
            ? element.attributes.AnzahlFall
            : 0;
        deaths +=
          element.attributes.NeuerTodesfall === 0 ||
          element.attributes.NeuerTodesfall === 1
            ? element.attributes.AnzahlTodesfall
            : 0;
        recovered +=
          element.attributes.NeuGenesen === 0 ||
          element.attributes.NeuGenesen === 1
            ? element.attributes.AnzahlGenesen
            : 0;
      } else {
        cases +=
          element.attributes.NeuerFall === 0 ||
          element.attributes.NeuerFall === 1
            ? element.attributes.AnzahlFall
            : 0;
        deaths +=
          element.attributes.NeuerTodesfall === 0 ||
          element.attributes.NeuerTodesfall === 1
            ? element.attributes.AnzahlTodesfall
            : 0;
        recovered +=
          element.attributes.NeuGenesen === 0 ||
          element.attributes.NeuGenesen === 1
            ? element.attributes.AnzahlGenesen
            : 0;
        datum = element.attributes.Meldedatum;
        cummulatedCases += cases;
        cummulatedDeaths += deaths;
        cummulatedRecovered += recovered;
        //Speichere die Werte in Array
        octaveData.push({
          cummulatedCases,
          cummulatedRecovered,
          cummulatedDeaths,
          cases,
          recovered,
          deaths,
          date: datum,
        });
        //setze zurück auf 0
        cases = 0;
        deaths = 0;
        recovered = 0;
      }
    } else {
      cases +=
        element.attributes.NeuerFall === 0 || element.attributes.NeuerFall === 1
          ? element.attributes.AnzahlFall
          : 0;
      deaths +=
        element.attributes.NeuerTodesfall === 0 ||
        element.attributes.NeuerTodesfall === 1
          ? element.attributes.AnzahlTodesfall
          : 0;
      recovered +=
        element.attributes.NeuGenesen === 0 ||
        element.attributes.NeuGenesen === 1
          ? element.attributes.AnzahlGenesen
          : 0;
      datum = element.attributes.Meldedatum;
      cummulatedCases += cases;
      cummulatedDeaths += deaths;
      cummulatedRecovered += recovered;
      //Speichere die Were in Array
      octaveData.push({
        cummulatedCases,
        cummulatedRecovered,
        cummulatedDeaths,
        cases,
        recovered,
        deaths,
        date: datum,
      });
    }
    return;
  });
  return octaveData;
};

export const toDate = (intDate) => {
  return new Date(intDate).toLocaleString('de-DE', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });
};

export const sortArrayByMeldedatum = (array) => {
  let sortedArray = [];
  sortedArray = array.sort(
    (a, b) => a.attributes.Meldedatum - b.attributes.Meldedatum
  );
  return sortedArray;
};

export const combineArray = (array) => {
  let dataArray = [];
  array.map((data) => (dataArray = dataArray.concat(data.features)));
  return dataArray;
};
