import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export const AddLinkedFilePage: React.FC = () => {
    const navigate = useNavigate();
    const [selectedFile, setSelectedFile] = useState<string | null>('Cell_Structure_Analysis_Final.pdf');

    const handleFileClick = (fileName: string) => {
        setSelectedFile(fileName);
    };

    return (
        <div className="bg-background-light dark:bg-background-dark font-display min-h-screen flex flex-col overflow-hidden text-text-main">
            {/* Top Navigation Bar */}
            <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-white/50 bg-white/80 px-10 py-3 shadow-sm z-10 backdrop-blur-sm">
                <Link to="/" className="flex items-center gap-4 text-text-main">
                    <div className="size-8 flex items-center justify-center bg-primary rounded-lg text-white">
                        <span className="material-symbols-outlined">school</span>
                    </div>
                    <h2 className="text-text-main text-lg font-bold leading-tight tracking-[-0.015em]">Student Workspace</h2>
                </Link>
                <div className="flex flex-1 justify-end gap-8 items-center">
                    <nav className="hidden md:flex items-center gap-9">
                        <Link className="text-text-main text-sm font-medium leading-normal hover:text-primary transition-colors" to="/">Dashboard</Link>
                        <Link className="text-text-main text-sm font-medium leading-normal hover:text-primary transition-colors" to="/project">Projects</Link>
                        <a className="text-text-main text-sm font-medium leading-normal hover:text-primary transition-colors" href="#">Tasks</a>
                    </nav>
                    <div className="bg-center bg-no-repeat bg-cover rounded-full size-10 border-2 border-white shadow-md cursor-pointer" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBr9s2JpoMezDzmwW2a2yazM_WWST2M86CRBMV4XPmZ6WETS9BWHOgnUcfCBhU7mwxwzKPtCi2ehq9Jy0YccQKasqbNxVWTNr_Xrw4ZD_JifY-SVYbjWnxbxLkVLHXEa9kCX1qVNyt6cxpcUhg1dUN0er714LzwtRAcoeJoH-VSCXK0vCtTUc_fvg5UcY8JkBNGZ-DU7Nd3gQaLeaN2qcyvPTOyhmu8O2Aw2dJM8BqtiKRMjXQvQf2MmyJn3QxLuRJV-JJ4Lv-AEJ3A')" }}></div>
                </div>
            </header>

            {/* Main Content Area (Modal Wrapper) */}
            <main className="flex-1 flex items-center justify-center p-4 md:p-8">
                {/* Modal Container */}
                <div className="relative w-full max-w-6xl h-[85vh] bg-modal-bg rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex flex-col md:flex-row overflow-hidden border border-white/40">
                    {/* Close Button (Absolute) */}
                    <button onClick={() => navigate('/project/resources')} className="absolute top-4 right-4 z-20 p-2 text-text-sub hover:text-text-main hover:bg-black/5 rounded-full transition-colors md:hidden">
                        <span className="material-symbols-outlined">close</span>
                    </button>

                    {/* Sidebar (Service Selector) */}
                    <aside className="w-full md:w-64 bg-[#f0f0e0]/50 border-r border-[#e5e3dc] flex flex-col shrink-0">
                        <div className="p-6 pb-2">
                            <h1 className="text-xl font-bold text-text-main">Add Linked File</h1>
                            <p className="text-sm text-text-sub mt-1">Select a source</p>
                        </div>
                        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
                            <a className="flex items-center gap-3 px-3 py-3 rounded-lg text-text-sub hover:bg-white/60 hover:text-text-main transition-all group" href="#">
                                <span className="material-symbols-outlined group-hover:text-primary transition-colors">cloud_upload</span>
                                <span className="font-medium">Upload</span>
                            </a>
                            <a className="flex items-center gap-3 px-3 py-3 rounded-lg bg-white shadow-sm text-text-main ring-1 ring-black/5 relative overflow-hidden" href="#">
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
                                <span className="material-symbols-outlined text-blue-600">add_to_drive</span>
                                <span className="font-bold">Google Drive</span>
                            </a>
                            <a className="flex items-center gap-3 px-3 py-3 rounded-lg text-text-sub hover:bg-white/60 hover:text-text-main transition-all group" href="#">
                                <span className="material-symbols-outlined text-blue-400 group-hover:text-primary transition-colors">box</span>
                                <span className="font-medium">Dropbox</span>
                            </a>
                            <a className="flex items-center gap-3 px-3 py-3 rounded-lg text-text-sub hover:bg-white/60 hover:text-text-main transition-all group" href="#">
                                <span className="material-symbols-outlined text-blue-700 group-hover:text-primary transition-colors">cloud</span>
                                <span className="font-medium">OneDrive</span>
                            </a>
                            <div className="my-4 border-t border-[#e5e3dc] mx-3"></div>
                            <a className="flex items-center gap-3 px-3 py-3 rounded-lg text-text-sub hover:bg-white/60 hover:text-text-main transition-all group" href="#">
                                <span className="material-symbols-outlined group-hover:text-primary transition-colors">link</span>
                                <span className="font-medium">URL Link</span>
                            </a>
                        </nav>
                        <div className="p-4 mt-auto">
                            <div className="rounded-xl bg-primary/10 p-4 border border-primary/20">
                                <div className="flex items-center gap-2 text-primary font-bold mb-1 text-sm">
                                    <span className="material-symbols-outlined text-[20px]">storage</span>
                                    <span>Storage</span>
                                </div>
                                <div className="w-full bg-white/50 rounded-full h-1.5 mb-2">
                                    <div className="bg-primary h-1.5 rounded-full" style={{ width: '75%' }}></div>
                                </div>
                                <p className="text-xs text-text-sub">15GB of 20GB used</p>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content Area */}
                    <section className="flex-1 flex flex-col min-w-0 bg-modal-bg">
                        {/* Browser Header */}
                        <div className="px-6 py-5 border-b border-[#e5e3dc] flex flex-col gap-4">
                            {/* Breadcrumbs & Window Controls */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm text-text-sub">
                                    <span className="hover:text-primary cursor-pointer transition-colors">Google Drive</span>
                                    <span className="material-symbols-outlined text-xs">chevron_right</span>
                                    <span className="hover:text-primary cursor-pointer transition-colors">Biology 101</span>
                                    <span className="material-symbols-outlined text-xs">chevron_right</span>
                                    <span className="font-bold text-text-main bg-white px-2 py-0.5 rounded shadow-sm">Project References</span>
                                </div>
                                <button onClick={() => navigate('/project/resources')} className="text-text-sub hover:text-text-main hidden md:block">
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>
                            {/* Search Bar */}
                            <div className="flex items-center gap-3 w-full">
                                <div className="relative flex-1">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-sub">search</span>
                                    <input className="w-full h-11 pl-10 pr-4 rounded-xl border-none bg-white shadow-sm focus:ring-2 focus:ring-primary/50 text-sm placeholder:text-text-sub/70" placeholder="Search in Project References..." type="text" />
                                </div>
                                <button className="h-11 px-4 bg-white rounded-xl shadow-sm border border-transparent text-text-sub hover:text-primary hover:border-primary/30 transition-all flex items-center gap-2">
                                    <span className="material-symbols-outlined">filter_list</span>
                                    <span className="hidden sm:inline text-sm font-medium">Filter</span>
                                </button>
                            </div>
                        </div>

                        {/* File Browser List */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                            <div className="grid grid-cols-12 gap-4 pb-2 border-b border-[#e5e3dc] text-xs font-bold text-text-sub uppercase tracking-wider mb-2 select-none">
                                <div className="col-span-6 pl-2">Name</div>
                                <div className="col-span-3">Date Modified</div>
                                <div className="col-span-3 text-right pr-2">Size</div>
                            </div>

                            {/* Folder Item */}
                            <div className="group flex items-center rounded-lg hover:bg-white p-2 cursor-pointer transition-all border border-transparent hover:border-[#e5e3dc] hover:shadow-sm mb-1">
                                <div className="grid grid-cols-12 gap-4 w-full items-center">
                                    <div className="col-span-6 flex items-center gap-3">
                                        <span className="material-symbols-outlined text-yellow-500 fill-current">folder</span>
                                        <span className="text-text-main font-medium text-sm truncate">Lab Results 2023</span>
                                    </div>
                                    <div className="col-span-3 text-text-sub text-sm">Oct 24, 2023</div>
                                    <div className="col-span-3 text-right text-text-sub text-sm">-</div>
                                </div>
                            </div>

                            {/* File Item 1 */}
                            <div
                                onClick={() => handleFileClick('Cell_Structure_Analysis_Final.pdf')}
                                className={`group flex items-center rounded-lg p-2 cursor-pointer transition-all mb-1 relative ${selectedFile === 'Cell_Structure_Analysis_Final.pdf' ? 'bg-primary/10 border border-primary' : 'hover:bg-white border border-transparent hover:border-[#e5e3dc] hover:shadow-sm'}`}
                            >
                                {selectedFile === 'Cell_Structure_Analysis_Final.pdf' && (
                                    <div className="absolute -right-2 -top-2 bg-primary text-white rounded-full size-5 flex items-center justify-center shadow-sm z-10">
                                        <span className="material-symbols-outlined text-xs font-bold">check</span>
                                    </div>
                                )}
                                <div className="grid grid-cols-12 gap-4 w-full items-center">
                                    <div className="col-span-6 flex items-center gap-3">
                                        <div className="size-8 rounded bg-red-100 flex items-center justify-center text-red-500 shrink-0">
                                            <span className="material-symbols-outlined text-[20px]">picture_as_pdf</span>
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-text-main font-bold text-sm truncate">Cell_Structure_Analysis_Final.pdf</span>
                                            <span className="text-xs text-text-sub">Shared by Prof. Oaks</span>
                                        </div>
                                    </div>
                                    <div className="col-span-3 text-text-sub text-sm">Just now</div>
                                    <div className="col-span-3 text-right text-text-sub text-sm">2.4 MB</div>
                                </div>
                            </div>

                            {/* File Item 2 */}
                            <div
                                onClick={() => handleFileClick('Research_Notes_Draft_v2.docx')}
                                className={`group flex items-center rounded-lg p-2 cursor-pointer transition-all mb-1 relative ${selectedFile === 'Research_Notes_Draft_v2.docx' ? 'bg-primary/10 border border-primary' : 'hover:bg-white border border-transparent hover:border-[#e5e3dc] hover:shadow-sm'}`}
                            >
                                {selectedFile === 'Research_Notes_Draft_v2.docx' && (
                                    <div className="absolute -right-2 -top-2 bg-primary text-white rounded-full size-5 flex items-center justify-center shadow-sm z-10">
                                        <span className="material-symbols-outlined text-xs font-bold">check</span>
                                    </div>
                                )}
                                <div className="grid grid-cols-12 gap-4 w-full items-center">
                                    <div className="col-span-6 flex items-center gap-3">
                                        <div className="size-8 rounded bg-blue-100 flex items-center justify-center text-blue-500 shrink-0">
                                            <span className="material-symbols-outlined text-[20px]">description</span>
                                        </div>
                                        <span className="text-text-main font-medium text-sm truncate">Research_Notes_Draft_v2.docx</span>
                                    </div>
                                    <div className="col-span-3 text-text-sub text-sm">Oct 22, 2023</div>
                                    <div className="col-span-3 text-right text-text-sub text-sm">845 KB</div>
                                </div>
                            </div>

                            {/* File Item 3 */}
                            <div
                                onClick={() => handleFileClick('Data_Set_Population_Growth.xlsx')}
                                className={`group flex items-center rounded-lg p-2 cursor-pointer transition-all mb-1 relative ${selectedFile === 'Data_Set_Population_Growth.xlsx' ? 'bg-primary/10 border border-primary' : 'hover:bg-white border border-transparent hover:border-[#e5e3dc] hover:shadow-sm'}`}
                            >
                                {selectedFile === 'Data_Set_Population_Growth.xlsx' && (
                                    <div className="absolute -right-2 -top-2 bg-primary text-white rounded-full size-5 flex items-center justify-center shadow-sm z-10">
                                        <span className="material-symbols-outlined text-xs font-bold">check</span>
                                    </div>
                                )}
                                <div className="grid grid-cols-12 gap-4 w-full items-center">
                                    <div className="col-span-6 flex items-center gap-3">
                                        <div className="size-8 rounded bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                                            <span className="material-symbols-outlined text-[20px]">table_chart</span>
                                        </div>
                                        <span className="text-text-main font-medium text-sm truncate">Data_Set_Population_Growth.xlsx</span>
                                    </div>
                                    <div className="col-span-3 text-text-sub text-sm">Oct 20, 2023</div>
                                    <div className="col-span-3 text-right text-text-sub text-sm">1.2 MB</div>
                                </div>
                            </div>

                            {/* File Item 4 */}
                            <div
                                onClick={() => handleFileClick('Microscope_Slide_04.jpg')}
                                className={`group flex items-center rounded-lg p-2 cursor-pointer transition-all mb-1 relative ${selectedFile === 'Microscope_Slide_04.jpg' ? 'bg-primary/10 border border-primary' : 'hover:bg-white border border-transparent hover:border-[#e5e3dc] hover:shadow-sm'}`}
                            >
                                {selectedFile === 'Microscope_Slide_04.jpg' && (
                                    <div className="absolute -right-2 -top-2 bg-primary text-white rounded-full size-5 flex items-center justify-center shadow-sm z-10">
                                        <span className="material-symbols-outlined text-xs font-bold">check</span>
                                    </div>
                                )}
                                <div className="grid grid-cols-12 gap-4 w-full items-center">
                                    <div className="col-span-6 flex items-center gap-3">
                                        <div className="size-8 rounded bg-purple-100 flex items-center justify-center text-purple-500 shrink-0">
                                            <span className="material-symbols-outlined text-[20px]">image</span>
                                        </div>
                                        <span className="text-text-main font-medium text-sm truncate">Microscope_Slide_04.jpg</span>
                                    </div>
                                    <div className="col-span-3 text-text-sub text-sm">Oct 18, 2023</div>
                                    <div className="col-span-3 text-right text-text-sub text-sm">4.8 MB</div>
                                </div>
                            </div>

                            {/* Skeleton Loader Item */}
                            <div className="group flex items-center rounded-lg p-2 mb-1 animate-pulse opacity-50">
                                <div className="grid grid-cols-12 gap-4 w-full items-center">
                                    <div className="col-span-6 flex items-center gap-3">
                                        <div className="size-8 rounded bg-gray-200 shrink-0"></div>
                                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                    </div>
                                    <div className="col-span-3 h-4 bg-gray-200 rounded w-2/3"></div>
                                    <div className="col-span-3 h-4 bg-gray-200 rounded w-1/4 ml-auto"></div>
                                </div>
                            </div>
                        </div>

                        {/* Footer / Action Bar */}
                        <div className="p-6 border-t border-[#e5e3dc] bg-[#fdfdfb] flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                <div className="size-10 bg-white border border-[#e5e3dc] rounded-lg flex items-center justify-center shadow-sm">
                                    <span className="material-symbols-outlined text-red-500">picture_as_pdf</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-text-sub uppercase tracking-wide">Selected File</span>
                                    <span className="text-sm font-bold text-text-main truncate max-w-[200px]">{selectedFile || 'No file selected'}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                                <button onClick={() => navigate('/project/resources')} className="px-6 py-2.5 rounded-lg border border-[#e5e3dc] bg-white text-text-main font-bold text-sm hover:bg-gray-50 hover:border-gray-300 transition-all">
                                    Cancel
                                </button>
                                <button onClick={() => navigate('/project/resources')} className="px-8 py-2.5 rounded-lg bg-primary text-white font-bold text-sm shadow-md shadow-primary/20 hover:bg-primary-hover hover:shadow-lg hover:shadow-primary/30 transform active:scale-95 transition-all flex items-center gap-2">
                                    <span>Link File</span>
                                    <span className="material-symbols-outlined text-sm">link</span>
                                </button>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
};
