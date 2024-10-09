import React, { useRef } from "react";

interface IImport {
    file: File | null;
    setFile: (file: File | null) => void;
}

export const ImportFile: React.FC<IImport> = ({ file, setFile }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const handleChooseFile = () => {
        inputRef?.current?.click();
    };
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            setFile(files[0]);
        }
    };
    return <section className="flex flex-col sm:flex-row items-center gap-2">
        <input ref={inputRef} type="file" accept=".xlsx" hidden onChange={handleFileUpload} />
        <button onClick={handleChooseFile} className="border border-gray-600 bg-slate-100 hover:bg-slate-200 py-1 px-4 rounded-xl">{file !== null ? "Change report file" : "Upload report file"}</button>
        {file !== null && <p><span className='text-gray-500'>Choosed file:</span><span className='text-blue-900'> {file?.name}</span></p>}
    </section>;
};
