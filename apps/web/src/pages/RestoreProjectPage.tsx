import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export const RestoreProjectPage: React.FC = () => {
    const navigate = useNavigate();

    const handleRestore = () => {
        // In a real app, logic to restore the project would go here
        navigate('/project/restore/success');
    };

    return (
        <div className="bg-neutral-bg min-h-screen flex items-center justify-center p-4 font-display">
            {/* Main Container */}
            <div className="w-full max-w-[560px] flex flex-col items-center">
                {/* Confirmation Card */}
                <div className="w-full bg-custom-card rounded-2xl shadow-soft border border-white/50 overflow-hidden relative">
                    {/* Decorative background pattern */}
                    <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white/40 to-transparent pointer-events-none"></div>
                    <div className="relative px-8 pt-10 pb-8 flex flex-col items-center">
                        {/* Icon */}
                        <div className="size-16 rounded-full bg-custom-gold/20 flex items-center justify-center mb-6 text-custom-gold">
                            <span className="material-symbols-outlined text-[32px]">history</span>
                        </div>
                        {/* Headline */}
                        <h1 className="text-text-main text-3xl font-bold tracking-tight text-center mb-3">
                            Restore Project?
                        </h1>
                        {/* Description */}
                        <p className="text-text-sub text-base text-center leading-relaxed max-w-[440px] mb-8">
                            You are about to restore <span className="font-bold text-text-main">'History 101 Final'</span> from the archive. It will reappear on your active dashboard and be editable by all team members.
                        </p>
                        {/* Project Summary Card (Context) */}
                        <div className="w-full bg-white/60 rounded-xl p-5 mb-8 border border-white/50 backdrop-blur-sm">
                            <div className="flex items-center gap-4">
                                {/* Project Thumbnail */}
                                <div className="h-16 w-16 rounded-lg bg-cover bg-center shrink-0 shadow-sm" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD3eXt9TYe7aZnjMyaZRYe2Kxyu0TaMG2Jj5G4dUuUMm3diZj-6Q23CdgR63kPeUpB--84hABYETyduQ_ZmlQigsetOVbV1ABC9zifJI6SwnGdELq_Eou_iEOCsH6FoL3prPV7DOd9CPnb3FSI2NzocdSN-ztDezKPK6LI6M2DX9yD8zuLnLoF8OBmIsG32NwqSj-dlG1AMrq-HkhB1-Jn3pt-gqjAtNB_UvFYOrkvBU7OUos172O-fxxIeiRJamteCAxlp37Zw578o')" }}></div>
                                {/* Project Details */}
                                <div className="flex flex-col flex-1 min-w-0">
                                    <h3 className="text-text-main font-bold text-lg truncate">History 101 Final</h3>
                                    <div className="flex items-center gap-4 mt-1">
                                        <div className="flex items-center gap-1.5 text-text-sub text-xs font-medium uppercase tracking-wider">
                                            <span className="material-symbols-outlined text-[16px]">folder_open</span>
                                            <span>Humanities</span>
                                        </div>
                                        <div className="w-1 h-1 rounded-full bg-text-sub/40"></div>
                                        <div className="flex items-center gap-1.5 text-text-sub text-xs">
                                            <span>Archived Oct 12, 2023</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Additional Info Rows */}
                            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-text-main/5">
                                <div>
                                    <p className="text-[11px] uppercase tracking-wider text-text-sub font-bold mb-1">Team Lead</p>
                                    <div className="flex items-center gap-2">
                                        <div className="size-5 rounded-full bg-gray-300 bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBl74fPwp-VrOCK0bkuVx5HVA2HizMAnFFzBJrrW4DUq0yNhNpFYMPmrlZJhWxlvP38vGKBW9oReMGiDIsoKQuDxmq4OEFW8yf2npgvJXs6D_LiyMV56cZw3UbkUslKb4gP-U_1JI1iHGHBXtCf9WYDnM1xya5OLD9r6bMyQW40tOKRp49HdaExvKZ6t4fNnIzC0HX86mcqC5wLQla2cAU8HXK-Zgwx9JuoLgZkYTKmWWw9LUBcV9Kk9hXUDvEkTWlEJOTr_0fKcwKE')" }}></div>
                                        <span className="text-sm font-medium text-text-main">Sarah Jenkins</span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[11px] uppercase tracking-wider text-text-sub font-bold mb-1">Last Edited</p>
                                    <p className="text-sm font-medium text-text-main">3 months ago</p>
                                </div>
                            </div>
                        </div>
                        {/* Actions */}
                        <div className="flex flex-col-reverse sm:flex-row gap-3 w-full">
                            <Link to="/archived" className="flex-1 h-12 rounded-lg border-2 border-custom-back text-custom-back hover:bg-custom-back hover:text-white transition-colors duration-200 font-bold text-base flex items-center justify-center focus:ring-4 focus:ring-custom-back/20 outline-none">
                                Cancel
                            </Link>
                            <button
                                onClick={handleRestore}
                                className="flex-1 h-12 rounded-lg bg-custom-gold hover:bg-[#d4a015] text-text-main font-bold text-base flex items-center justify-center transition-colors duration-200 shadow-md hover:shadow-lg focus:ring-4 focus:ring-custom-gold/40 outline-none gap-2"
                            >
                                <span className="material-symbols-outlined text-[20px]">settings_backup_restore</span>
                                Confirm Restore
                            </button>
                        </div>
                    </div>
                </div>
                {/* Optional Footer Link */}
                <div className="mt-6 text-center">
                    <a className="text-custom-back hover:text-text-main text-sm font-medium flex items-center gap-1 transition-colors" href="#">
                        <span className="material-symbols-outlined text-[16px]">help</span>
                        Need help with archives?
                    </a>
                </div>
            </div>
        </div>
    );
};
