## Solutions d'inspiration naturelle

### Critères d'évaluation de l'adéquation

Ces critères sont utilisés pour sélectionner les emplacements appropriés pour chaque NbS (Natural Based Solution en anglais), basés sur le manuel EU NWRM. Certaines NbS peuvent avoir des critères similaires à d'autres, d'où des emplacements similaires, et donc, elles se chevauchent. Les NbS préférées seront évaluées en fonction des résultats du modèle hydraulique. De plus, pour chaque NbS, la carte d'adéquation est croisée avec l'étendue des inondations ARI de 20, 50 et 100 ans afin que les NbS soient mises en œuvre dans les zones sujettes aux inondations et soient conçues pour la plus grande étendue des inondations.

#### Reboisement

- Pente >= 30%
  - Idéal jusqu'aux pentes plus raides, car il procure des avantages en termes de rétention des sédiments et de prévention de l'érosion.
- Espace libre et ouvert (forêts, terres agricoles, terres nues, espaces de loisirs et terres non développées)
  - Ces zones permettent des changements d'utilisation des terres par rapport aux zones bâties.
- Distance des routes >= 50 m
  - Permet un tampon par rapport aux routes pour éviter les perturbations, ex. pollution.

#### Restauration des plaines inondables

- Pente >= 5%:
  - Les pentes faibles réduisent les pics de débit et prolongent les périodes de rétention, tandis que les pentes plus raides aggravent les effets de rétention, surtout lorsque la vague de crue est totalement déchargée dans le chenal.
- Espace libre et ouvert (forêts, terres agricoles, terres nues, espaces de loisirs et terres non développées)
  - Ces zones permettent des changements d'utilisation des terres par rapport aux zones bâties.
- Faible érosion des sols
  - Évite l'érosion des plaines inondables.
- Distance des routes >= 50 m
  - Permet un tampon par rapport aux routes pour éviter les perturbations, ex. pollution.

#### Espaces verts et parcs

- Dans les zones urbaines
  - Par définition, les parcs doivent être situés dans des zones urbaines.
- Espace libre et ouvert (forêts, terres agricoles, terres nues, espaces de loisirs et terres non développées)
  - Ces zones permettent des changements d'utilisation des terres par rapport aux zones bâties.

#### Zones humides

- Pente >= 5%
  - Les zones humides se trouvent naturellement dans des zones plates ou dans des dépressions topographiques.
- Espace libre et ouvert (forêts, terres agricoles, terres nues, espaces de loisirs et terres non développées)
  - Ces zones permettent des changements d'utilisation des terres par rapport aux zones bâties.
- Sol à faible perméabilité
  - Les zones humides sont plus efficaces dans les sols à faible perméabilité pour permettre la rétention d'eau, le contrôle de l'érosion et l'amélioration de la qualité de l'eau.
- Distance des routes >= 50 m
  - Permet un tampon par rapport aux routes pour éviter les perturbations, ex. pollution.

#### Bassin d'infiltration

- Pente >= 5%
  - Ils doivent être rendus aussi plats que possible pour maximiser le potentiel de stockage et d'infiltration et minimiser le risque d'érosion.
- Espace libre et ouvert (forêts, terres agricoles, terres nues, espaces de loisirs et terres non développées)
  - Ces zones permettent des changements d'utilisation des terres par rapport aux zones bâties.
- Faible érosion des sols:
  - Les bassins ne doivent pas être situés sur des sols instables pour assurer l'intégrité structurelle.
- Distance des friches industrielles, étangs de mines d'étain, infrastructures et utilités, et industrie
  - En raison du risque de lixiviation des contaminants dans les eaux souterraines sous-jacentes.
- Sols à haute perméabilité:
  - Pour permettre l'infiltration de l'eau.
- Zones à faible potentiel de nappe phréatique
  - Éviter la lixiviation des contaminants dans la source d'eau.
- Distance des routes >= 50 m
  - Permet un tampon par rapport aux routes pour éviter les perturbations.

### Manning’s n

Le type de couverture terrestre qui est prédominant en Malaisie est classé selon le US National Land Cover Dataset (NLCD). Ces valeurs sont sélectionnées comme guide pour attribuer le coefficient de rugosité Manning’s n à chaque couverture terrestre dans ce système de classification basé sur le manuel HEC-RAS 2D.

- Reboisement :
  - Couverture terrestre : Forêt sempervirente (LC = 42)
  - n = 0.15
- Zones humides :
  - Couverture terrestre : Zones humides boisées (LC = 90)
  - n = 0.08
- Restauration des plaines inondables
  - n = 0.15
  - Cette NbS implique de restaurer les plaines inondables à leurs conditions originales (sempervirentes)
- Espaces verts et parcs
  - Couverture terrestre : Espaces ouverts aménagés (LC = 21)
  - n = 0.035
- Bassin d'infiltration
  - Type de canal : Canaux excavés ou dragués, terre, droit et uniforme, gravier section uniforme, propre avec de l'herbe courte, peu de mauvaises herbes
  - n = 0.027

### Références

- Emplacements appropriés pour chaque NbS : http://nwrm.eu
- Système de classification NLCD : https://www.mrlc.gov/data/legends/national-land-cover-database-class-legend-and-description
- Manuel HEC-RAS : https://www.hec.usace.army.mil/software/hec-ras/documentation/HEC-RAS%205.0%20Reference%20Manual.pdf
- Guide : https://rashms.com/blog/mannings-n-roughness-coefficient-for-hec-ras-2d-modeling/
