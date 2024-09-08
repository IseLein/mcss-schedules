
import os
import json
import pprint

t_file = open("test-times.json", "r")
test_times = json.load(t_file)
t_file.close()

raw_data = {}
for filename in os.listdir('.'):
    if filename.endswith('raw.json'):
        with open(filename, 'r') as f:
            course_data = json.load(f)['TTBResponse']['payload']['pageableCourse']['courses']['courses']
            course_code = course_data['code']
            sections = list(course_data['sections']['sections'])
            lecture_sections = [section for section in sections if section['type'] == 'Lecture' and section['meetingTimes'] is not None]

            test_time = test_times.get(course_code)
            has_test = test_time is not None
            added_test = False

            meeting_times = []
            print(course_code)
            for lec in lecture_sections:
                lec_mts = lec['meetingTimes']['meetingTimes']
                if type(lec_mts) is not list:
                    lec_mts = [lec_mts]
                for lec_mt in lec_mts:
                    start = int(int(lec_mt['start']['millisofday']) / (1000 * 3600))
                    end = int(int(lec_mt['end']['millisofday']) / (1000 * 3600))
                    day = int(int(lec_mt['start']['day']))
                    if (has_test and start == test_time['start'] and
                            end == test_time['end'] and
                            day == test_time['day']):
                        if not added_test:
                            for i in range(start, end):
                                new_mt = {
                                    'day': day,
                                    'time': i,
                                    'lecture': course_code + ' ' + 'Midterm',
                                    'test': True,
                                }
                                meeting_times.append(new_mt)
                            added_test = True
                    else:
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
