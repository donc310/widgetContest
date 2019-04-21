
const data = [
    {
        "ID": "2f87fd92ae7dc1c07ccd62301e7705de",
        "LOCATION": "Starbucks Coffee",
        "Mild": 1,
        "state": "NE",
        "Level_2": "cafe",
        "Level_1": "food_drink",
        "Frequent": 0,
        "ChainID": 1.35314e+18,
        "Moderate": 0,
        "_map": [
            {
                "name": "Nebraska",
                "longitude": -98.268082,
                "latitude": 41.12537,
                "abv": "NE"
            }
        ],
        "count": 3
    },
    {
        "ID": "2f87fd92ae7dc1c07ccd62301e7705de",
        "LOCATION": "Starbucks Coffee",
        "Mild": 1,
        "state": "NE",
        "Level_2": "pharmacy",
        "Level_1": "health",
        "Frequent": 0,
        "ChainID": 1.35314e+18,
        "Moderate": 0,
        "_map": [
            {
                "name": "Nebraska",
                "longitude": -98.268082,
                "latitude": 41.12537,
                "abv": "NE"
            }
        ],
        "count": 3
    },
    {
        "ID": "2f87fd92ae7dc1c07ccd62301e7705de",
        "LOCATION": "Starbucks Coffee",
        "Mild": 1,
        "state": "NE",
        "Level_2": "shopping_mall",
        "Level_1": "shopping",
        "Frequent": 0,
        "ChainID": 1.35314e+18,
        "Moderate": 0,
        "_map": [
            {
                "name": "Nebraska",
                "longitude": -98.268082,
                "latitude": 41.12537,
                "abv": "NE"
            }
        ],
        "count": 3
    }]
 const result =[]

const map = new Map();
for (const item of data) {
    if (!map.has(item.ID)) {
        map.set(item.ID, true);
        result.push(
            {
                ID: item.ID,
                count: item.count,
            });
    }
}