import { User } from "@/auth/types";


interface EventLecturerProps {
    lecturer: User;
};

export const EventLecturer = ({ lecturer }: EventLecturerProps) => {
    return (
        <div className="space-y-2">
        <p className="text-sm">
            Foredragsholder:
        </p>
        <div className="flex items-center space-x-2">
            <div>
                {lecturer.image ? (
                    <img src={lecturer.image} alt={lecturer.first_name} className="w-10 h-10 rounded-full" />
                ) : (
                    <div className="w-10 h-10 rounded-full bg-slate-950 flex items-center justify-center">
                        <p className="text-white font-bold">
                            {lecturer.first_name[0]}
                        </p>
                    </div>
                )}
            </div>
            <p className="text-sm">
                {lecturer.first_name} {lecturer.last_name}
            </p>
        </div>
    </div>
    );
};