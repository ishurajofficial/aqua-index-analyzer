// All values are in mg/L, unless otherwise specified.

// Permissible limits for heavy metals in drinking water
export const whoPermissibleLimits = {
    As: 0.01,
    Cd: 0.003,
    Cr: 0.05,
    Pb: 0.01,
    Zn: 5.0,
};

export const bisPermissibleLimits = {
    As: 0.01,
    Cd: 0.003,
    Cr: 0.05,
    Pb: 0.01,
    Zn: 5.0,
};

// Ideal limits (for HPI calculation)
export const idealLimits = {
    As: 0.001,
    Cd: 0.001,
    Cr: 0.001,
    Pb: 0.001,
    Zn: 0.1,
};

// Metal weights (for HPI calculation) - unitless
export const metalWeights = {
    As: 10,
    Cd: 30,
    Cr: 2,
    Pb: 10,
    Zn: 1,
};

// Risk categorization limits for indices
export const whoRiskLimits = {
    hpi: 100, // Critical pollution index value
    hei: 20,  // High risk
    cf: 3,    // High contamination
    pli: 1,   // Polluted
};

export const bisRiskLimits = {
    hpi: 100,
    hei: 20,
    cf: 3,
    pli: 1,
};
