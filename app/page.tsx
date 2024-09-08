"use client";
import { useState } from 'react';
import React from 'react';
import raw_time_data from './courses.json';

type CalendarTime = {
  day: number;
  time: number;
  lecture: string;
  test?: boolean;
};

type TimeData = Record<string, CalendarTime[]>;
const time_data = raw_time_data as TimeData;

const DAYS = [1, 2, 3, 4, 5];
const HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
const COURSES = Object.keys(time_data).sort();
const YEARS = ["first", "second", "third", "fourth"];
type Year = "first" | "second" | "third" | "fourth";

const YEAR_COURSES = {
  "first": COURSES.filter(course => course.charAt(3) === "1"),
  "second": COURSES.filter(course => course.charAt(3) === "2"),
  "third": COURSES.filter(course => course.charAt(3) === "3"),
  "fourth": COURSES.filter(course => course.charAt(3) === "4")
}

type CalendarProps = {
  selectedCourses: typeof COURSES[number][];
  showTests: boolean;
};

function Calendar({ selectedCourses, showTests }: CalendarProps) {
  const calendarData = selectedCourses.map(course => time_data[course])
    .reduce((acc, curr) => [...acc, ...curr], [])
    .filter(course => showTests || !course.test);

  const getLecs = (day: number, time: number) => {
    const lecs = calendarData.filter(course => course.time === time && course.day === day)
      .map(course => course.lecture);
    const hasTest = calendarData.some(course => course.time === time && course.day === day && course.test);
    return {
      lecs,
      hasTest
    };
  };

  const tdColor = (num: number, isTest: boolean) => {
    if (isTest) {
      return "bg-blue-400";
    }
    switch (num) {
      case 0:
      return "";
      case 1:
        return "bg-orange-100";
      case 2:
        return "bg-orange-200";
      case 3:
        return "bg-orange-300";
      case 4:
        return "bg-orange-400";
      case 5:
        return "bg-orange-500";
      case 6:
        return "bg-orange-600";
      case 7:
        return "bg-orange-700";
      case 8:
        return "bg-orange-800";
      default:
        return "bg-orange-900";
    };
  }

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
              const lecsObj = getLecs(day, hour);
              const lecs = lecsObj.lecs;
              const colorClass = tdColor(lecs.length, lecsObj.hasTest);
              return (
                <td key={day} className={`border text-center h-12 ${colorClass}`}>
                  {lecs.map(lec => <div key={lec}>{lec}</div>)}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

type SelectCoursesProps = {
  setSelectedCourses: React.Dispatch<React.SetStateAction<typeof COURSES[number][]>>;
}

function SelectCourses({ setSelectedCourses }: SelectCoursesProps) {
  const handleClicked = (e: React.MouseEvent<HTMLInputElement>) => {
    const course = (e.target as HTMLInputElement).value;
    if ((e.target as HTMLInputElement).checked) {
      setSelectedCourses((prev: typeof COURSES[number][]) => [...prev, course]);
    } else {
      setSelectedCourses((prev: typeof COURSES[number][]) => prev.filter(item => item !== course));
    }
  };

  const handleYearClicked = (e: React.MouseEvent<HTMLInputElement>) => {
    if ((e.target as HTMLInputElement).checked) {
      const year = (e.target as HTMLInputElement).value as Year;
      const courses = YEAR_COURSES[year] as typeof COURSES[number][];
      courses.forEach(course => {
        const checkbox = document.getElementById(course) as HTMLInputElement;
        if (!checkbox.checked) {
          checkbox.checked = true;
        }
      });
      setSelectedCourses((prev: typeof COURSES[number][]) => {
        const newCourses = [...prev];
        courses.forEach(course => {
          if (!newCourses.includes(course)) {
            newCourses.push(course);
          }
        });
        return newCourses;
      });
    } else {
      const year = (e.target as HTMLInputElement).value as Year;
      const courses = YEAR_COURSES[year] as typeof COURSES[number][];
      courses.forEach(course => {
        const checkbox = document.getElementById(course) as HTMLInputElement;
        if (checkbox.checked) {
          checkbox.checked = false;
        }
      });
      setSelectedCourses((prev: typeof COURSES[number][]) => prev.filter(item => !courses.includes(item)));
    };
  };

  const capitalize = (s: string) => {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  return (
    <div>
      {(YEARS as Year[]).map(year => (
        <div key={year}>
          <div className="p-2 hover:bg-gray-200">
            <label className="text-lg" htmlFor={"first"}>
              <input className="mx-2" type="checkbox" id={year} name={year} value={year} onClick={handleYearClicked} />
              {capitalize(year)} Year
            </label>
          </div>
          {YEAR_COURSES[year].map((course) => (
            <div key={course} className="ml-16 p-2 hover:bg-gray-200">
              <label htmlFor={course}>
                <input className="mx-2" type="checkbox" id={course} name={course} value={course} onClick={handleClicked} />
                {course}
              </label>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const [selectedCourses, setSelectedCourses] = useState<typeof COURSES[number][]>([]);
  const [showTests, setShowTests] = useState<boolean>(false);

  return (
    <div className="p-4 flex flex-direction-row font-[family-name:var(--font-geist-sans)]">
      <div className="w-[70%]">
        <h2 className="py-4 text-xl font-bold">Calendar</h2>
        <Calendar selectedCourses={selectedCourses} showTests={showTests} />
      </div>
      <div className="p-4 flex-grow">
        <div className="flex flex-direction-row justify-between items-center">
          <h2 className="py-4 text-xl font-bold">Select Courses</h2>
          <label htmlFor={"tests"}>
            Show Midterms
            <input className="mx-2" type="checkbox" id={"tests"} name={"tests"} value={"tests"}
              onClick={(e) => setShowTests((e.target as HTMLInputElement).checked)}
            />
          </label>
        </div>
        <SelectCourses setSelectedCourses={setSelectedCourses} />
      </div>
    </div>
  );
}
