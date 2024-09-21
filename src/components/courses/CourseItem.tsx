"use client";

import { createCourseRegistration } from "@/auth/tihlde";
import { Course, MinuteGroup } from "@/auth/types";
import { useRouter } from "next/navigation";
import { CourseTag } from "./CourseTag";
import { CourseOrganizer } from "./CourseOrganizer";
import { Button } from "../Button";


interface CourseItemProps {
    course: Course;
    token: string;
};

export const CourseItem = ({ course, token }: CourseItemProps) => {
    const router = useRouter();

    const handleRegistration = async () => {
        try {
            await createCourseRegistration(token, course.id);
            router.refresh();        
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="w-full border px-3 py-2 rounded-md space-y-8">
            <div className="space-y-2">
                <div>
                    <h1 className="text-xl font-bold">
                        {course.title}
                    </h1>
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-400">
                            {new Date(course.start_date).toLocaleDateString('nb-NO', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })} {new Date(course.start_date).toLocaleTimeString('nb-NO', {
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </p>

                        <p className="text-sm text-gray-400">
                            {
                                course.number_of_registrations === 0 && (
                                    "Ingen påmeldte"
                                )
                            }

                            {
                                course.number_of_registrations === 1 && (
                                    "1 påmeldt"
                                )
                            }

                            {
                                course.number_of_registrations > 1 && (
                                    `${course.number_of_registrations} påmeldte`
                                )
                            }
                        </p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <CourseTag tag={course.tag} />
                    <CourseOrganizer organizer={course.organizer.name as MinuteGroup} />
                </div>
            </div>
            
            
            <div className="space-y-2">
                <p className="text-sm">
                    Foredragsholder:
                </p>
                <div className="flex items-center space-x-2">
                    <div>
                        {course.lecturer.image ? (
                            <img src={course.lecturer.image} alt={course.lecturer.first_name} className="w-10 h-10 rounded-full" />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-slate-950 flex items-center justify-center">
                                <p className="text-white font-bold">
                                    {course.lecturer.first_name[0]}
                                </p>
                            </div>
                        )}
                    </div>
                    <p className="text-sm">
                        {course.lecturer.first_name} {course.lecturer.last_name}
                    </p>
                </div>
            </div>

            <Button
                className="w-full"
                onClick={handleRegistration}
            >
                Meld deg på
            </Button>
        </div>
    );
};