
import os
import json

raw_data = {}
for filename in os.listdir('.'):
    if filename.endswith('raw.json'):
        with open(filename, 'r') as f:
            course_data = json.load(f)['TTBResponse']['payload']['pageableCourse']['courses']['courses']
            course_code = course_data['code']
            sections = list(course_data['sections']['sections'])
            lecture_sections = [section for section in sections if section['type'] == 'Lecture' and section['meetingTimes'] is not None]
            meeting_times = []
            for lec in lecture_sections:
                print(lec['name'])
                lec_mts = list(lec['meetingTimes']['meetingTimes'])
                for lec_mt in lec_mts:
                    start = int(int(lec_mt['start']['millisofday']) / (1000 * 3600))
                    end = int(int(lec_mt['end']['millisofday']) / (1000 * 3600))
                    day = int(int(lec_mt['start']['day']))
                    for i in range(start, end):
                        new_mt = {
                            'day': day,
                            'time': i,
                            'lecture': course_code + ' ' + lec['name'],
                        }
                        meeting_times.append(new_mt)
            raw_data[course_code] = meeting_times

with open('parsed.json', 'w') as f:
    json.dump(raw_data, f, indent=4)
