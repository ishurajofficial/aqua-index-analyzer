# Water Quality Mock Datasets

This folder contains sample CSV files with water quality data for testing the Aqua Index Analyzer application.

## 📁 Available Datasets

### 1. `sample-water-quality-data.csv` (20 samples)
- **Purpose**: Basic testing and demonstration
- **Samples**: 20 locations across different zones
- **Risk Levels**: Mixed (Low to High)
- **Use Case**: Quick testing and UI demonstration

### 2. `comprehensive-water-quality-data.csv` (20 samples)
- **Purpose**: Comprehensive testing with real Indian cities
- **Samples**: 20 major Indian cities with diverse characteristics
- **Risk Levels**: Varied based on location type
- **Use Case**: Real-world scenario testing

### 3. `extreme-water-quality-data.csv` (10 samples)
- **Purpose**: Edge case testing and validation
- **Samples**: 10 locations with extreme values
- **Risk Levels**: From minimal to extremely high risk
- **Use Case**: Testing algorithm limits and UI handling

## 📊 Data Structure

All CSV files follow this format:

| Column | Description | Unit | Range |
|--------|-------------|------|-------|
| Location | Sample site name | - | Text |
| Latitude | GPS latitude | degrees | 0-90 |
| Longitude | GPS longitude | degrees | -180 to 180 |
| As | Arsenic concentration | mg/L | 0.001-0.200 |
| Cd | Cadmium concentration | mg/L | 0.0005-0.080 |
| Cr | Chromium concentration | mg/L | 0.002-0.200 |
| Pb | Lead concentration | mg/L | 0.0008-0.120 |
| Zn | Zinc concentration | mg/L | 0.003-0.300 |
| Notes/Status | Additional information | - | Text (optional) |

## 🎯 Usage Instructions

1. **Upload any CSV file** using the "Upload File" button in the dashboard
2. **Select analysis standard** (WHO or BIS)
3. **Click "Process Data"** to calculate indices
4. **View results** in charts, tables, and maps
5. **Export reports** in various formats

## ⚠️ Important Notes

- **Units**: All concentrations are in mg/L (milligrams per liter)
- **Standards**: Data is designed to work with both WHO and BIS standards
- **Coordinates**: Real GPS coordinates for major Indian cities
- **Realistic Values**: Based on typical groundwater contamination ranges
- **Testing**: Use extreme dataset to test error handling and edge cases

## 🔬 Expected Results

### Sample Dataset
- **HPI Range**: 15-85
- **HEI Range**: 8-45
- **PLI Range**: 0.5-2.5
- **Risk Distribution**: Mixed levels

### Comprehensive Dataset
- **HPI Range**: 10-95
- **HEI Range**: 5-50
- **PLI Range**: 0.3-3.0
- **Risk Distribution**: Realistic urban/rural mix

### Extreme Dataset
- **HPI Range**: 5-200
- **HEI Range**: 2-100
- **PLI Range**: 0.1-8.0
- **Risk Distribution**: Full spectrum from safe to critical

## 🚀 Quick Start

1. Download any dataset from this folder
2. Open the Aqua Index Analyzer dashboard
3. Upload the CSV file
4. Select your preferred standard (WHO/BIS)
5. Process the data and explore results!

---

*These datasets are for testing purposes only and do not represent real water quality measurements.*
