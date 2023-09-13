PROJECTIONS := Base CC
YEARS := 20 50 100

.PHONY: all

all: tilled_data

tilled_data: $(foreach projection,$(PROJECTIONS),$(foreach year,$(YEARS),_tilled_data/geojson/hazard$(projection)_$(year)yr.geojson _tilled_data/vectors/hazard$(projection)_$(year)yr.mvt))

_tilled_data/geojson/hazard%yr.geojson: hazard%yr.shp
	ogr2ogr -f GeoJSON _tilled_data/geojson/hazard$*yr.geojson $<

_tilled_data/vectors/hazard%yr.mvt: _tilled_data/geojson/hazard%yr.geojson
	ogr2ogr -f MVT _tilled_data/vectors/hazard$*yr _tilled_data/geojson/hazard$*yr.geojson -progress -dsco COMPRESS=NO

clean:
	rm -rf _tilled_data

version=$(shell date +%FT%H:%M)
bucket=10208-fcd9acb029f419e6493edf97f4592b96

cdn-put:
	s3cmd put --recursive --acl-public --guess-mime-type cdn s3://${bucket}/monash-flood-portal/${version}/

cdn-ls:
	s3cmd ls --acl-public s3://${bucket}/monash-flood-portal/

cdn-sync:
	mkdir -p cdn-local
	s3cmd sync s3://${bucket}/monash-flood-portal/${version}/ cdn-local/
