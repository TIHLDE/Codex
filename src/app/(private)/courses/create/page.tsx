import authOptions from "@/auth/auth";
import { isLeader } from "@/auth/tihlde";
import { CourseForm } from "@/components/courses/CourseForm";
import { CoursesHeader } from "@/components/courses/Header";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";


const CreateCoursePage = async () => {
    const session = await getServerSession(authOptions);

    const hasAccess = await isLeader(session?.user.tihldeUserToken ?? "");

    if (!hasAccess) {
        redirect("/courses");
    }

    return (
        <main className="w-full px-12 py-8 space-y-12">
            <CoursesHeader
                back_text="CODEX / Nytt kurs"
                back_url="/courses"
            />
            <CourseForm />
        </main>
    );
};


export default CreateCoursePage;