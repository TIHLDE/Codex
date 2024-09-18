import authOptions from "@/auth/auth";
import { isLeader } from "@/auth/tihlde";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import { PlusIcon } from "@heroicons/react/24/outline";
import { getServerSession } from "next-auth";
import Link from "next/link";


type CoursesHeaderProps = {
    back_url: string;
    back_text: string;
    next_page?: string;
};

export const CoursesHeader = async ({
    back_text,
    back_url,
    next_page
}: CoursesHeaderProps) => {
    const session = await getServerSession(authOptions);

    const hasAccess = await isLeader(session?.user.tihldeUserToken ?? "");

    return (
        <div className="flex items-center justify-between">
            <Link
              href={back_url}
              className="flex flex-row items-center text-base font-semibold leading-6 text-gray-900 dark:text-gray-100"
            >
              <ArrowLeftIcon className="mr-2 inline h-5 w-5" /> {back_text}
            </Link>

            {next_page && hasAccess && (
                <Link
                    href="/courses/create"
                    className="flex items-center space-x-2"
                >
                    <p>
                        Opprett kurs
                    </p>
                    <PlusIcon className="h-6 w-6 text-gray-900 dark:text-gray-100" />
                </Link>
            )}
        </div>
    );
};