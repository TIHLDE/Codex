import { CoursesHeader } from "@/components/courses/Header";
import { CoursesList } from "@/components/courses/List";


const CoursesPage = () => {
    return (
        <main className="w-full px-12 py-8">
            <CoursesHeader
                back_text="CODEX / Kurs"
                back_url="/"
                next_page="/courses/create"
            />
            <CoursesList />
        </main>
    )
};


export default CoursesPage;