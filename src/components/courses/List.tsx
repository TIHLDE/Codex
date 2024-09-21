import authOptions from "@/auth/auth";
import { getCourses } from "@/auth/tihlde";
import { getServerSession } from "next-auth";
import { CourseItem } from "./CourseItem";


export const CoursesList = async () => {
    const session = await getServerSession(authOptions);
    const token = session?.user.tihldeUserToken ?? "";

    const courses = await getCourses(token);

    return (
        <div className="max-w-4xl w-full mx-auto mt-20 grid grid-cols-1 gap-4">
            {courses.results.map((course) => <CourseItem course={course} token={token} />)}
        </div>
    );
};