import clsx from "clsx";


interface EventDateProps {
    date: string;
    className?: string;
};

export const EventDate = ({ date, className }: EventDateProps) => {
    return (
        <p className={clsx("text-sm text-gray-400", className)}>
            {new Date(date).toLocaleDateString('nb-NO', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })} {new Date(date).toLocaleTimeString('nb-NO', {
                hour: '2-digit',
                minute: '2-digit'
            })}
        </p>
    )
};