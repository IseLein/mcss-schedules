#!/bin/bash

# create a list and then loop through it
LIST="CSC108H5F MAT102H5F MAT135H5F MAT137H5F CSC207H5F CSC236H5F CSC258H5F MAT202H5F MAT223H5F MAT224H5F MAT232H5F MAT236H5F MAT244H5F STA256H5F STA258H5F"
for COURSE in $LIST
do
    echo "Making request for $COURSE"
    PAYLOAD='{"courseCodeAndTitleProps":{"courseCode":"","courseTitle":"'"${COURSE}"'","courseSectionCode":"","searchCourseDescription":true},"departmentProps":[],"campuses":[],"sessions":["20249","20251","20249-20251"],"requirementProps":[],"instructor":"","courseLevels":[],"deliveryModes":[],"dayPreferences":[],"timePreferences":[],"divisions":["ERIN"],"creditWeights":[],"availableSpace":false,"waitListable":false,"page":1,"pageSize":20,"direction":"asc"}'
    # echo $PAYLOAD | jq .
    curl -d $PAYLOAD -H "Content-Type: application/json" -X POST https://api.easi.utoronto.ca/ttb/getPageableCourses > ${COURSE}-raw.xml
    xq . ${COURSE}-raw.xml > ${COURSE}-raw.json
done
