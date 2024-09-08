does this work??

Note: some times are reserved for tests. I should note this (TODO)

TODO
- Mobile
- Proper Year > Course ticking (when all courses in a year are ticked, the year should be ticked)

To add a new course,
1. Add the course to the course list in `data-stuff/get_raw.sh`. Ensure that its the full course code (e.g CSC108H5F)
2. If the course has dedicated test times, add it to `data-stuff/test_times.json`
3. Run `data-stuff/get_raw.sh` to hit the api for the course information
4. Run `data-stuff/parse.py` to parse the data into the format for the website
5. Copy the created `data-stuff/parsed.json` to `app/courses.json`
