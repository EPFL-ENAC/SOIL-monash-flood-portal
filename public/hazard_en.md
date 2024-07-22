## Hazard

In this research, several hazard indicators were considered. These hazard indicators are integrated via Saaty’s AHP method (Saaty 1988). The hazard indicators considered for this research are:

1. **Inundation Map**

The final inundation map obtained for the ARIs 20, 50, and 100 from MIKE FLOOD would be utilised in the final flood hazard map. 

2. **Rainfall Map**

An isohyetal rainfall map was developed for the catchment area. These isohyetal rainfall maps can help to determine the areas susceptible to high rainfall. These areas could be in danger of pluvial floods within the area. A total of 26 rainfall stations were considered, scattered throughout the catchment, with data ranging from 2006 – 2017. The inverse distance weighting (IDW) method within the ArcGIS software was used with the power value set to 2

3. **Slope and Elevation**

Slope and elevation maps were derived from the DEM map obtained from the Department of Survey and Mapping Malaysia (known as JUPEM in local language) from the catchment area.

4. **Lithology**

In recent years, lithology has been considered an essential factor in flood analysis (Dung et al. 2021). Generally, past researchers have investigated the degree of permeability factor, which specifically ranks layers based on the value of hydraulic conductivity respectively. However, lithology does not directly influence flooding but affects the drainage network capabilities within the catchment (Das 2020). Thus, the hypothesis is that the more permeable the layer, the lower the flood susceptibility within that area. The ranking of the permeability level of the lithology profile within the catchment area is done by adopting the ranking system done by Vojtek and Vojteková (2019). The lithology map was obtained from the Department of mineral and geoscience Malaysia.

5. **Barren land erosion risk map**

The barren land erosion risk map was considered utilising the land use and soil erosion risk map provided by the Department of Agriculture Malaysia (known as DOA in local language). The soil erosion risk map was developed using the revised universal soil loss equation (USLE) which is shown in Eq. (1). Soil conservationists highly utilise USLE for estimating soil loss. It helps determine the best practices to control erosion at the specific site of interest (Renard et al. 2017). Note that each element within the equation is dimensionless.
A = R K L S C P
(1)


Where,
* A = Computed soil loss   
* R = rainfall-runoff erosivity factor
* K = soil erodibility factor
* L =  Slope length factor
* S = slope steepness factor
* C = cover management factor
* P = management factor

One of the concerns due to a flood event is the potential sediment generation in areas susceptible to soil erosion. The highest susceptibility for sediment generation is generally exposed land with no vegetation cover or structure. The exposed topsoil would easily be washed away due to a flood event and could be detrimental to surrounding areas. These areas could include barren land or undeveloped land within the catchment area. Thus, the land use map was integrated with the soil erosion risk map to determine these areas. The risk criteria were then classified based on the USLE equation.

6. **Land Use Land Cover (LULC)**

LULC within the catchment area was obtained from the Federal Department of Town and Country Planning (PLANMalaysia). The different types of LULC within the catchment area have various infiltration rates; thus, the LULC map plays a part in flood hazard mapping (Kazakis et al. 2015).

The 6 hazard indicators considered for this research are shown in Figure 3. Each hazard map is classified into 5 parts for consistency. A rating of 1 to 5 is given to each hazard indicator, where 5 is considered to provide the largest contribution to hazard, whereas 1 is the lowest. The rating and weightage of each hazard indicator that will be utilised for AHP are shown in Table 1.

Table 1: Weightage and ranking considered for the hazard indicators considered in AHP

| Parameters       | Class         | Rating  | Weight (%) |
| ---------------- | ------------- | ------- | ---------- |
| Inundation (m)   | 0 - 0.25      | 1       | 37         |
|                  | 0.26 - 0.50   | 2       |            |
|                  | 0.51 - 1.00   | 3       |            |
|                  | 1.00 - 1.50   | 4       |            |
|                  | ≥ 1.50        | 5       |            |
| Rainfall (mm/yr) | 1,480 - 1,813 | 1       | 29         |
|                  | 1,814 - 2,147 | 2       |            |
|                  | 2,148 - 2,481 | 3       |            |
|                  | 2,482 - 2,814 | 4       |            |
|                  | ≥ 2,815       | 5       |            |
| Slope (°)        | 0 - 10        | 5       | 12         |
|                  | 11 - 25       | 4       |            |
|                  | 26 - 40       | 3       |            |
|                  | 41 - 60       | 2       |            |
|                  | ≥ 61          | 1       |            |
| Elevation (m)    | 0 - 150       | 5       | 11         |
|                  | 151 - 400     | 4       |            |
|                  | 401 - 700     | 3       |            |
|                  | 701 - 1000    | 2       |            |
|                  | ≥ 1001        | 1       |            |
| Land Use         | Water bodies  | 5       | 5          |
|                  | Built-up area | 4       |            |
|                  | Bare land     | 3       |            |
|                  | Agriculture   | 2       |            |
|                  | Forest        | 1       |            |
| Lithology        | Very low      | 1       | 3          |
| (Permeability)   | Low           | 2       |            |
|                  | Moderate      | 3       |            |
|                  | High          | 4       |            |
|                  | Very high     | 5       |            |
| Barren land soil erosion | Very low | 1    | 3          |
|                  | Low           | 2       |            |
|                  | Moderate      | 3       |            |
|                  | High          | 4       |            |
|                  | Very high     | 5       |            |
