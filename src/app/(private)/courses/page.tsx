import { CoursesHeader } from "@/components/courses/Header";


const CoursesPage = () => {
    return (
        <main className="w-full px-12 py-8">
            <CoursesHeader
                back_text="CODEX / Kurs"
                back_url="/"
                next_page="/courses/create"
            />
        </main>
    )
};


export default CoursesPage;