
interface TableSkeletonProps {
    rows?: number;
    cols?: number;
}

export const TableSkeleton = ({ rows = 5, cols = 4 }: TableSkeletonProps) => {
    return (
        <div
            aria-hidden="true"
            className="w-full overflow-hidden bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700 animate-pulse"
        >

            <div className="h-10 bg-gray-100 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700" />


            <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {[...Array(rows)].map((_, rowIndex) => (
                    <div key={rowIndex} className="flex items-center justify-between p-4 gap-4">
                        {[...Array(cols)].map((_, colIndex) => (
                            <div
                                key={colIndex}
                                className={`h-4 bg-gray-200 dark:bg-gray-700 rounded ${colIndex === 0 ? 'w-1/4' : 'w-1/6'
                                    } ${colIndex >= 2 ? 'hidden sm:block' : ''}`}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};