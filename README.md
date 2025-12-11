# data_processing

This repository builds a reproducible pipeline to transform raw multi-source Earth observation data into a harmonized spatiotemporal dataset for wildfire spread modeling.

The pipeline:

- takes fire event metadata (from GlobFire),
- converts it into configuration files,
- and uses Google Earth Engine (GEE) + Google Cloud Storage (GCS) to export daily raster patches around each fire.

---

## Repository Structure

- `config/`  
  YAML configuration files describing the fires to download (year, output bucket, fire IDs, locations, time range, etc.).

- `data_pipeline/`  
  Core Python modules that talk to Google Earth Engine and Google Cloud Storage to build the dataset (via `DatasetPrepareService`).

- `GEE_get_GlobFire_data.js`  
  Google Earth Engine script to export GlobFire fire records (as a CSV) for a given region and year.

- `csv_to_yaml.py`  
  Helper script to convert the GlobFire CSV of fires into a YAML config file used by the data extraction pipeline.

- `main.py`  
  Entry point that:
  - loads a YAML config (e.g., `config/BCdata/bc_fire_2020.yaml`),
  - initializes a GEE service account,
  - iterates over all fires in the config,
  - exports per-day raster patches to a specified GCS bucket.

- `test_band.py`  
  Small utility script using `rasterio` to inspect a downloaded `.tif` file (band count, names, shape, dtype).

- `requirements.txt`  
  Python dependencies (Earth Engine API, GCS client, rasterio, GDAL, etc.).

---

## Requirements

- Python 3.8+ (3.9/3.10 recommended)
- A Google Cloud project with:
  - Earth Engine enabled  
  - Google Cloud Storage bucket (for raster outputs)
- A service account with:
  - Earth Engine access  
  - permission to write to the target GCS bucket
- Service account key JSON file downloaded locally
- `gcloud` CLI (optional, for bulk downloading from GCS)

---

## Setup

```bash
# 1. Clone the repo
git clone https://github.com/Fire-Flow-Detection/data_processing.git
cd data_processing

# 2. (Recommended) create and activate a virtual environment
python -m venv .venv
source .venv/bin/activate   # on macOS / Linux
# .venv\Scripts\activate    # on Windows

# 3. Install dependencies
pip install -r requirements.txt
