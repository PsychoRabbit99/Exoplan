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
        const lines = csv.split('\n').filter(line => line.trim() !== ''); // Remove empty lines
        const headers = lines[0].split(',');
        const result = [];

        for (let i = 1; i < lines.length; i++) {
            const obj = {};
            const currentline = lines[i].split(',');
            if (currentline.length === headers.length) { // Ensure the line has the correct number of columns
                for (let j = 0; j < headers.length; j++) {
                    obj[headers[j].trim()] = currentline[j].trim();
                }
                result.push(obj);
            }
        }
        return result;
    }

    function populateSelect(data) {
        // Filter out entries with empty 'kepler_name'
        const filteredData = data.filter(exoplanet => exoplanet['kepler_name'] && exoplanet['kepler_name'].trim() !== '');

        filteredData.forEach(exoplanet => {
            const option = document.createElement('option');
            option.value = exoplanet['kepler_name']; // Use the kepler_name as the value
            option.textContent = exoplanet['kepler_name'];
            selectElement.appendChild(option);
        });

        // Add event listener for redirection
        selectElement.addEventListener('change', (event) => {
            let selectedName = event.target.value;
            if (selectedName) {
                // Replace spaces with underscores
                selectedName = selectedName.replace(/ /g, '_');
                window.location.href = `https://eyes.nasa.gov/apps/exo/#/planet/${selectedName}`;
            }
        });
    }
});
