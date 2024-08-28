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
                    obj[headers[j]] = currentline[j];
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
            option.value = exoplanet['kepler_name'];
            option.textContent = exoplanet['kepler_name'];
            selectElement.appendChild(option);
        });

        // Add event listener for redirection and search
        selectElement.addEventListener('change', (event) => {
            const selectedName = event.target.value;
            if (selectedName) {
                const searchUrl = `https://eyes.nasa.gov/apps/exo/#/search?query=${encodeURIComponent(selectedName)}`;
                window.location.href = searchUrl;
            }
        });
    }
});
