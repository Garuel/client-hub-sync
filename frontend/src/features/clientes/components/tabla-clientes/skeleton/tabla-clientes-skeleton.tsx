export const TablaClientesSkeleton = () => {
    return (
        <div className="w-full overflow-hidden bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700 animate-pulse">
            <div className="h-10 bg-gray-100 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700" />
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-4 gap-4">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/6" />
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 hidden md:block" />
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-20" />
                    </div>
                ))}
            </div>
        </div>
    );
};