## Danger

Dans cette recherche, plusieurs indicateurs de risque ont été pris en compte. Ces indicateurs de risque sont intégrés via la méthode AHP de Saaty (Saaty 1988). Les indicateurs de risque considérés pour cette recherche sont :

1. **Carte d'inondation**

La carte finale d'inondation obtenue pour les ARIs 20, 50 et 100 ans à partir de MIKE FLOOD serait utilisée dans la carte finale des risques d'inondation.

2. **Carte des précipitations**

Une carte isohyétale des précipitations a été développée pour le bassin versant. Ces cartes isohyétales des précipitations peuvent aider à déterminer les zones susceptibles de recevoir de fortes précipitations. Ces zones pourraient être en danger d'inondations pluviales au sein de la région. Un total de 26 stations de précipitations ont été considérées, réparties dans tout le bassin versant, avec des données allant de 2006 à 2017. La méthode de pondération inverse des distances (IDW) au sein du logiciel ArcGIS a été utilisée avec la valeur de puissance réglée à 2.

3. **Pente et Élévation**

Les cartes de pente et d'élévation ont été dérivées du modèle numérique de terrain (DEM) obtenu auprès du Département de l'arpentage et de la cartographie de Malaisie (connu sous le nom de JUPEM localement) pour le bassin versant.

4. **Lithologie**

Ces dernières années, la lithologie a été considérée comme un facteur essentiel dans l'analyse des inondations (Dung et al. 2021). Généralement, les chercheurs précédents ont étudié le degré de perméabilité, qui classe spécifiquement les couches en fonction de la valeur de conductivité hydraulique respective. Cependant, la lithologie n'influence pas directement les inondations mais affecte les capacités du réseau de drainage au sein du bassin versant (Das 2020). Ainsi, l'hypothèse est que plus la couche est perméable, plus la susceptibilité aux inondations est faible dans cette zone. La classification du niveau de perméabilité du profil lithologique au sein du bassin versant est effectuée en adoptant le système de classement de Vojtek et Vojteková (2019). La carte lithologique a été obtenue auprès du Département des mines et de la géoscience de Malaisie.

5. **Carte du risque d'érosion des terres nues**

La carte du risque d'érosion des terres nues a été considérée en utilisant la carte d'utilisation des terres et la carte du risque d'érosion des sols fournie par le Département de l'agriculture de Malaisie (connu sous le nom de DOA en langue locale). La carte du risque d'érosion des sols a été développée en utilisant l'équation universelle révisée des pertes de sol (USLE) qui est montrée dans l'équation (1). Les spécialistes de la conservation des sols utilisent largement l'USLE pour estimer les pertes de sol. Elle aide à déterminer les meilleures pratiques pour contrôler l'érosion sur le site d'intérêt spécifique (Renard et al. 2017). Notez que chaque élément de l'équation est sans dimension.
A = R K L S C P
(1)

Où,

- A = Perte de sol calculée
- R = facteur d'érosivité des précipitations
- K = facteur d'érodibilité des sols
- L = facteur de longueur de pente
- S = facteur de pente
- C = facteur de gestion de la couverture
- P = facteur de gestion

Une des préoccupations en cas d'inondation est la génération potentielle de sédiments dans les zones sujettes à l'érosion des sols. La susceptibilité la plus élevée à la génération de sédiments se trouve généralement sur des terres exposées sans couverture végétale ni structure. La couche arable exposée serait facilement emportée en raison d'une inondation et pourrait être préjudiciable aux zones environnantes. Ces zones pourraient inclure des terres nues ou non développées au sein du bassin versant. Ainsi, la carte d'utilisation des terres a été intégrée à la carte du risque d'érosion des sols pour déterminer ces zones. Les critères de risque ont ensuite été classés en fonction de l'équation USLE.

6. **Occupation du sol et couverture terrestre (LULC)**

Le LULC au sein du bassin versant a été obtenu auprès du Département fédéral de la planification urbaine et rurale (PLANMalaysia). Les différents types de LULC au sein du bassin versant ont divers taux d'infiltration; ainsi, la carte LULC joue un rôle dans la cartographie des risques d'inondation (Kazakis et al. 2015).

Les 6 indicateurs de risque considérés pour cette recherche sont montrés dans la Figure 3. Chaque carte de risque est classée en 5 parties pour plus de cohérence. Une note de 1 à 5 est attribuée à chaque indicateur de risque, où 5 est considéré comme apportant la plus grande contribution au risque, tandis que 1 est le plus faible. La notation et la pondération de chaque indicateur de risque qui seront utilisées pour l'AHP sont montrées dans le Tableau 1.

Tableau 1: Pondération et classement considérés pour les indicateurs de risque pris en compte dans l'AHP

| Paramètres                                | Classe        | Note | Poids (%) |
| ----------------------------------------- | ------------- | ---- | --------- |
| Inondation (m)                            | 0 - 0.25      | 1    | 37        |
|                                           | 0.26 - 0.50   | 2    |           |
|                                           | 0.51 - 1.00   | 3    |           |
|                                           | 1.00 - 1.50   | 4    |           |
|                                           | ≥ 1.50        | 5    |           |
| Précipitations (mm/an)                    | 1,480 - 1,813 | 1    | 29        |
|                                           | 1,814 - 2,147 | 2    |           |
|                                           | 2,148 - 2,481 | 3    |           |
|                                           | 2,482 - 2,814 | 4    |           |
|                                           | ≥ 2,815       | 5    |           |
| Pente (°)                                 | 0 - 10        | 5    | 12        |
|                                           | 11 - 25       | 4    |           |
|                                           | 26 - 40       | 3    |           |
|                                           | 41 - 60       | 2    |           |
|                                           | ≥ 61          | 1    |           |
| Élévation (m)                             | 0 - 150       | 5    | 11        |
|                                           | 151 - 400     | 4    |           |
|                                           | 401 - 700     | 3    |           |
|                                           | 701 - 1000    | 2    |           |
|                                           | ≥ 1001        | 1    |           |
| Utilisation des terres                    | Plans d'eau   | 5    | 5         |
|                                           | Zones bâties  | 4    |           |
|                                           | Terres nues   | 3    |           |
|                                           | Agriculture   | 2    |           |
|                                           | Forêt         | 1    |           |
| Lithologie                                | Très faible   | 1    | 3         |
| (Perméabilité)                            | Faible        | 2    |           |
|                                           | Modéré        | 3    |           |
|                                           | Élevé         | 4    |           |
|                                           | Très élevé    | 5    |           |
| Risque d'érosion des sols des terres nues | Très faible   | 1    | 3         |
|                                           | Faible        | 2    |           |
|                                           | Modéré        | 3    |           |
|                                           | Élevé         | 4    |           |
|                                           | Très élevé    | 5    |           |
