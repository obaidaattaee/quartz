import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-[#0d0d0b] text-[#ebe4d5] ring-1 ring-black/10 dark:ring-white/15">
                <AppLogoIcon className="size-6" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    Quartz
                </span>
                <span className="truncate text-xs leading-tight text-muted-foreground">
                    Admin
                </span>
            </div>
        </>
    );
}
