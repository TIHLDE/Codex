import { MinuteGroup } from "@/auth/types";
import clsx from "clsx";


interface CourseOrganizerProps {
    organizer: MinuteGroup;
};

export const CourseOrganizer = ({ organizer }: CourseOrganizerProps) => {

    const getColor = () => {
        switch (organizer) {
            case "Index": return "bg-orange-500";
            case "Drift": return "bg-indigo-500";
            default: return "bg-gray-500";
        }
    };

    return (
        <div className={clsx(`px-2 py-1 rounded-lg text-white`, getColor())}>
            <p className="text-xs">
                {organizer}
            </p>
        </div>
    );
}; 