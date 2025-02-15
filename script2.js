document.addEventListener('DOMContentLoaded', () => {
    const selectElement = document.getElementById('exoplanet-select');

    fetch('kepler_exoplanets.csv')
        .then(response => response.text())
        .then(text => {
            const data = csvToJson(text);
            populateSelect(data);
        })
        .catch(error => console.error('Error loading CSV file:', error));

    function csvToJson(csv) {
        const lines = csv.split('\n').filter(line => line.trim() !== '');
        const headers = lines[0].split(',');
        const result = [];

        for (let i = 1; i < lines.length; i++) {
            const obj = {};
            const currentline = lines[i].split(',');
            if (currentline.length === headers.length) {
                for (let j = 0; j < headers.length; j++) {
                    obj[headers[j].trim()] = currentline[j].trim();
                }
                result.push(obj);
            }
        }
        return result;
    }

    function populateSelect(data) {
        const filteredData = data.filter(exoplanet => exoplanet['kepler_name'] && exoplanet['kepler_name'].trim() !== '');

        filteredData.forEach(exoplanet => {
            const option = document.createElement('option');
            option.value = exoplanet['kepler_name'];
            option.textContent = exoplanet['kepler_name'];
            selectElement.appendChild(option);
        });

        selectElement.addEventListener('change', (event) => {
            let selectedName = event.target.value;
            if (selectedName) {
                selectedName = selectedName.replace(/ /g, '_');
                window.location.href = `https://eyes.nasa.gov/apps/exo/#/planet/${selectedName}`;
            }
        });
    }
});
