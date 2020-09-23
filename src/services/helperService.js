import * as turf from '@turf/turf'

export function calculateAreaOfFeature(feature) {
    const isMultiPolygon = feature.geometry.coordinates.length > 1;
    let polygon = isMultiPolygon ? turf.multiPolygon(feature.geometry.coordinates) : turf.polygon(feature.geometry.coordinates);
    let area = turf.area(polygon);

    if (!area && isMultiPolygon) {
        const longestArray = feature.geometry.coordinates[feature.geometry.coordinates.reduce((p, c, i, a) => a[p].length > c.length ? p : i, 0)];
        polygon = turf.polygon([longestArray]);
        area = turf.area(polygon);
    }

    return area;
}

export function calculatePropertyPrice(feature) {
    return calculatePrice(feature, 1000);
}

export function calculateRentPrice(feature) {
    return calculatePrice(feature, 15);
}

export function calculateBuyExperience(feature) {
    return calculatePropertyPrice(feature) / 10;
}

export function calculateRentExperience(feature) {
    return calculateRentPrice(feature) / 20;
}

export function calculateIncomeRentingOfFeature(feature) {
    return feature.rentPrice * 0.04;
}

export function calculateIncomeOwnedOfFeature(feature) {
    return feature.rentPrice * 2.9;
}

export function formatCurrency(price) {
    return new Intl.NumberFormat('en-US', { style: "currency", currency: "EUR" }).format(price);
}

export function getLevelFromExperience(experience) {
    return Math.floor((Math.sqrt(100 * (2 * experience + 25)) + 50) / 100);
}

export function getExperienceFromLevel(level) {
    return (Math.pow(level, 2) + level) / 2 * 100 - (level * 100)
}

export function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export function getLevelRequiredForBuilding(feature) {
    return Math.ceil(feature.area * getHeightFactor(feature) / 100);
}

// Private methods

function getHeightFactor(feature) {
    let heightFactor = feature.properties.height;
    
    if (feature.area < 30 && heightFactor > 3) {
        heightFactor /= 3;
        
        if (heightFactor < 3) {
            heightFactor = 3;
        }
    }

    return heightFactor;
}

function calculatePrice(feature, priceMultiplier) {
    let heightFactor = getHeightFactor(feature);

    let finalPrice = feature.area * heightFactor * priceMultiplier;

    return finalPrice;
}