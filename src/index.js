import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;
let countriesList = '';

const countryInput = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

countryInput.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));
countryList.addEventListener('click', onCountryClick);


function onInput(event) {
   
    const country = event.target.value.trim(); 
    if (!country) {
        return;
    }
  
    fetchCountries(country)
        .then(displayCountries)
        .catch(() => { Notiflix.Notify.failure('Oops, there is no country with that name'); });
  
}


function onCountryClick(event) {
    event.preventDefault();

    const countryValue = event.target;
    const countryName = countryValue.querySelector('.country-name').textContent;

    countryList.innerHTML = '';
    countryInfo.innerHTML = createCountryInfoMarkup(
    countriesList.find(country => country.name.official === countryName),
  );
}


function displayCountries(countries) {

    if (countries.length >= 10) {
        Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
        return;
    }

    if (countries.lenght === 1) {

        countryList.innerHTML = '';
        countryInfo.innerHTML = displayOneCountryInfo(countries[0]);
        return;
    }

        countryList.innerHTML = displayAllCountriesInfo(countries);
        countryInfo.innerHTML = '';
        countriesList = countries;
}



function displayAllCountriesInfo(countries) {

    return countries.map(({ flags, name }) => {
      return `<li>
                  <img src="${flags.svg}" alt="${name}'s flag"></img>
                  <h2>${name.official}</h2>
                <li>`;
    })
    .join('');
}

function displayOneCountryInfo({ name, capital, languages, population, flags: { svg: flag } }) {
    return `<div>
            <img src="${flag}" alt="${name}'s flag"></img>
            <h2>${name.official}</h2>
            <p><b>Capital:</b> ${capital}</p>
            <p><b>Population:</b> ${population}</p>
            <p><b>Languages:</b> ${Object.values(languages).join(', ')}</p>
            </div>`;
}
  