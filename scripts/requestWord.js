const apiKey = '11T7+R/6NKmmgUzKDLGAbw==toVDmzydvk6glOyz';
const keywordUrl = 'https://api.api-ninjas.com/v1/randomword';
const definitionUrl = 'https://api.api-ninjas.com/v1/dictionary?word='

const fetch_file_location = 'json/data.json';

const options = {
    method: 'GET',
    headers: { 'x-api-key': apiKey},
    type: 'noun'
};

async function getWordFromAPI() {
    try {
        // First fetch request
        console.log('fetching data1')
        const response1 = await fetch(keywordUrl, options);
        if (!response1.ok) throw new Error('First fetch failed');
        console.log('done fetching data1')
        const data1 = await response1.json();
        const keyword = data1['word'];
    
        // Second fetch request depends on the first one being completed
        console.log('fetching data2')

        const response2 = await fetch(definitionUrl+keyword, options);
        if (!response2.ok) throw new Error('Second fetch failed');
        console.log('done fetching data2')


        const data2 = await response2.json();

        if(data2['valid'] === false){
            return getWord(keywordUrl, definitionUrl, options);
        }

        const definitionArray = data2['definition'].split(/[.;]/);
        let definition;

        if(definitionArray[0].length > 4){
            definition = definitionArray[0];
        }
        else{
            definition = definitionArray[1].trim();
        }

        return [keyword, definition]
    
    } catch (error) {
        console.error('Failed to fetch data:', error);
        return [null, null]
    }
}
    
async function getWordFromJSON() {
    try {
        const response = await fetch(fetch_file_location);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        if (Array.isArray(data) && data.length) {
            const randomIndex = Math.floor(Math.random() * data.length);
            const randomValue = data[randomIndex];
            return randomValue;
        } else {
            throw new Error('JSON data is not an array or is empty');
        }
    } catch (error) {
        console.error('Error fetching or processing data:', error);
    }
}