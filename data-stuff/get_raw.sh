#!/bin/bash

# create a list and then loop through it
LIST="PHY137H5S PHY147H5S PHY241H5S JCP221H5S MAT136H5S MAT139H5S MAT223H5S MAT236H5S"
for COURSE in $LIST
do
    echo "Making request for $COURSE"
    PAYLOAD='{"courseCodeAndTitleProps":{"courseCode":"","courseTitle":"'"${COURSE}"'","courseSectionCode":"","searchCourseDescription":true},"departmentProps":[],"campuses":[],"sessions":["20249","20251","20249-20251"],"requirementProps":[],"instructor":"","courseLevels":[],"deliveryModes":[],"dayPreferences":[],"timePreferences":[],"divisions":["ERIN"],"creditWeights":[],"availableSpace":false,"waitListable":false,"page":1,"pageSize":20,"direction":"asc"}'
    # echo $PAYLOAD | jq .
    curl -d $PAYLOAD -H "Content-Type: application/json" -X POST https://api.easi.utoronto.ca/ttb/getPageableCourses > ${COURSE}-raw.xml
    xq . ${COURSE}-raw.xml > ${COURSE}-raw.json
done
