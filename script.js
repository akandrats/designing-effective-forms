let clickCount = 0;

const countryInput = document.getElementById('country');
const myForm = document.getElementById('form');
const modal = document.getElementById('form-feedback-modal');
const clicksInfo = document.getElementById('click-count');
const countryCodeInput = document.getElementById('countryCode');
const vatUECheckbox = document.getElementById('vatUE');
const vatNumberField = document.getElementById('vatNumberField');
const invoiceDataCheckbox = document.getElementById('invoiceDataCheckbox');
const invoiceDataField = document.getElementById('invoiceDataField');
const paymentMethodRadios = document.querySelectorAll('input[name="paymentMethod"]');
const paymentMethodError = document.getElementById('paymentMethodError')
const submitButton = document.getElementById('submitButton');

function handleClick() {
    clickCount++;
    clicksInfo.innerText = clickCount;
}

async function fetchAndFillCountries() {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        if (!response.ok) {
            throw new Error('Błąd pobierania danych');
        }
        const data = await response.json();
        const countries = data.map(country => country.name.common);
        countryInput.innerHTML = countries.map(country => `<option value="${country}">${country}</option>`).join('');
    } catch (error) {
        console.error('Wystąpił błąd:', error);
    }
}

function getCountryByIP() {
    fetch('https://get.geojs.io/v1/ip/geo.json')
        .then(response => response.json())
        .then(data => {
            const country = data.country;
            if (country) {
                // Ustawienie kraju w polu wyboru
                countryInput.value = country;
                getCountryCode(country);
            }
        })
        .catch(error => {
            console.error('Błąd pobierania danych z serwera GeoJS:', error);
        });
}

function getCountryCode(countryName) {
    const apiUrl = `https://restcountries.com/v3.1/name/${countryName}?fullText=true`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Błąd pobierania danych');
            }
            return response.json();
        })
        .then(data => {
            const countryCode = data[0].idd.root + data[0].idd.suffixes.join("");
            // Ustawienie kodu kierunkowego w polu wyboru
            countryCodeInput.value = countryCode;
        })
        .catch(error => {
            console.error('Wystąpił błąd:', error);
        });
}

(() => {
    document.addEventListener('click', handleClick);

    fetchAndFillCountries();
    getCountryByIP();
})();

vatUECheckbox.addEventListener('change', function() {
    if (this.checked) {
        vatNumberField.style.display = 'block';
    } else {
        vatNumberField.style.display = 'none';
    }
});

invoiceDataCheckbox.addEventListener('change', function() {
	if (this.checked) {
        invoiceDataField.style.display = 'block';
    } else {
        invoiceDataField.style.display = 'none';
    }
})

submitButton.addEventListener('keypress', function(event) {
	if (event.key === 'Enter') {
		event.preventDefault();
		myForm.submit();
	}
});
