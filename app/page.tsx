"use client";
import { useState } from 'react';
import raw_time_data from './courses.json';

const DAYS = [1, 2, 3, 4, 5];
const HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
const COURSES = [
  'CSC108H5',
  'MAT102H5',
  'MAT135H5',
  'MAT137H5',
];

type CalendarTime = {
  day: number;
  time: number;
  lecture: string;
};

type TimeData = {
  [key: typeof COURSES[number]]: CalendarTime[];
};

const time_data = raw_time_data as TimeData;

type CalendarProps = {
  selectedCourses: typeof COURSES[number][];
};

function Calendar({ selectedCourses }: CalendarProps) {
  console.log(selectedCourses);
  const calendarData = selectedCourses.map(course => time_data[course]).reduce(
    (acc, curr) => [...acc, ...curr], []
  );

  const getLecs = (day: number, time: number) => {
    return calendarData.filter(course => course.time === time && course.day === day)
      .map(course => course.lecture)
      .reduce((acc, curr) => acc.concat('\n', curr), '');
  };

  return (
    <table className="w-full table-fixed border">
      <colgroup>
        <col className="w-[10%]" />
        <col className="w-[18%]" />
        <col className="w-[18%]" />
        <col className="w-[18%]" />
        <col className="w-[18%]" />
        <col className="w-[18%]" />
      </colgroup>
      <tbody>
        <tr>
          <th className="border"></th>
          <th className="border">Monday</th>
          <th className="border">Tuesday</th>
          <th className="border">Wednesday</th>
          <th className="border">Thursday</th>
          <th className="border">Friday</th>
        </tr>
        {HOURS.map((hour) => (
          <tr key={hour}>
            <td className="border text-center h-12">{hour}:00</td>
            {DAYS.map((day) => {
              const lecs = getLecs(day, hour);
              if (lecs == '') {
                return <td key={day} className="border text-center h-12"></td>
              } else {
                return <td key={day} className="border text-center h-12 bg-orange-300">{lecs}</td>
              }
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

type SelectCoursesProps = {
  onCourseSelect: (course: typeof COURSES[number]) => void;
  onCourseDeselect: (course: typeof COURSES[number]) => void;
}

function SelectCourses({ onCourseSelect, onCourseDeselect }: SelectCoursesProps) {
  const handleClicked = (e: React.MouseEvent<HTMLInputElement>) => {
    console.log((e.target as HTMLInputElement).value);
    const course = (e.target as HTMLInputElement).value;
    if ((e.target as HTMLInputElement).checked) {
      onCourseSelect(course);
    } else {
      onCourseDeselect(course);
    }
  }
  return (
    <div>
      <div>
        <label htmlFor={'first'}>
          <input type="checkbox" id={'1'} name={'first'} value={'first'} disabled />
          First Year
        </label>
      </div>
      {COURSES.map((course) => (
        <div key={course} className="ml-16">
          <label htmlFor={course}>
            <input type="checkbox" id={course} name={course} value={course} onClick={handleClicked} />
            {course}
          </label>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const [selectedCourses, setSelectedCourses] = useState<typeof COURSES[number][]>([]);

  const onCourseSelect = (course: typeof COURSES[number]) => {
    setSelectedCourses([...selectedCourses, course]);
  }
  const onCourseDeselect = (course: typeof COURSES[number]) => {
    setSelectedCourses((prev) => prev.filter(item => item !== course));
  }


  return (
    <div className="p-4 flex flex-direction-row">
      <div className="w-[70%]">
        <h2 className="text-xl font-bold">Calendar</h2>
        <Calendar selectedCourses={selectedCourses} />
      </div>
      <div className="p-4 flex-grow">
        <h2 className="text-xl font-bold">Select Courses</h2>
        <SelectCourses onCourseSelect={onCourseSelect} onCourseDeselect={onCourseDeselect} />
      </div>
    </div>
  );
}
