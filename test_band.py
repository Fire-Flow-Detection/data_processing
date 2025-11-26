import rasterio

path = "bc_wildfire_2020_fire_24333252_2020-08-15.tif"

with rasterio.open(path) as src:
    print("Band count:", src.count)
    print("Band names:", src.descriptions)
    print("Shape (height, width):", (src.height, src.width))
    print("Dtype:", src.dtypes)