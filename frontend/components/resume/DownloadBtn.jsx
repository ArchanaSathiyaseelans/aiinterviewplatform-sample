import React, { useState } from 'react'
import { FiDownload } from 'react-icons/fi'
import html2pdf from 'html2pdf.js'
import { useCoins } from '../../apis/user.api'

function DownloadBtn({ docRef, user, setUser, fileName = "Resume" }) {
    const [downloading, setDownloading] = useState(false);

    const handleDownloadPdf = async () => {
        if (!docRef?.current) {
            alert("Resume document preview is not ready yet.");
            return;
        }

        try {
            setDownloading(true);

            // Deduct coins if available
            try {
                const coinResponse = await useCoins({ coins: 10, action: "download-pdf" });
                const newCoins = coinResponse?.interviewCoin ?? coinResponse?.coinsRemaining ?? coinResponse?.coins;
                if (setUser && newCoins !== undefined) {
                    setUser((prev) => ({
                        ...prev,
                        interviewCoin: newCoins,
                        coins: newCoins,
                    }));
                }
            } catch (coinError) {
                console.warn("Coin check notice:", coinError);
            }

            // Clone element to ensure 100% unscaled A4 output
            const originalElement = docRef.current;
            const clone = originalElement.cloneNode(true);
            clone.style.transform = 'none';
            clone.style.margin = '0';
            clone.style.position = 'absolute';
            clone.style.left = '-9999px';
            clone.style.top = '0';
            clone.style.width = '210mm';
            document.body.appendChild(clone);

            const opt = {
                margin:       [0, 0, 0, 0],
                filename:     `${(fileName || 'My_Resume').replace(/\s+/g, '_')}_ATS.pdf`,
                image:        { type: 'jpeg', quality: 0.98 },
                html2canvas:  { 
                    scale: 2, 
                    useCORS: true, 
                    logging: false,
                    onclone: (clonedDoc) => {
                        // Strip any oklch color declarations from stylesheets inside cloned document
                        const styleTags = clonedDoc.querySelectorAll('style');
                        styleTags.forEach((s) => {
                            if (s.textContent && s.textContent.includes('oklch')) {
                                s.textContent = s.textContent.replace(/oklch\([^)]+\)/g, 'rgb(0, 0, 0)');
                            }
                        });

                        // Ensure template root element has explicit clean background
                        const templateNode = clonedDoc.querySelector('#ats-resume-template');
                        if (templateNode) {
                            templateNode.style.backgroundColor = '#ffffff';
                            templateNode.style.color = '#000000';
                        }
                    }
                },
                jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };

            await html2pdf().set(opt).from(clone).save();

            // Clean up clone
            if (document.body.contains(clone)) {
                document.body.removeChild(clone);
            }
            setDownloading(false);
        } catch (error) {
            console.error("PDF generation failed, launching print fallback:", error);
            setDownloading(false);
            window.print();
        }
    };

    return (
        <button 
            type="button"
            onClick={handleDownloadPdf}
            disabled={downloading}
            className='flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-purple-600/30 transition-all border border-white/20 cursor-pointer disabled:opacity-50'>
            <FiDownload size={15} />
            <span>{downloading ? "Exporting PDF..." : "Download PDF"}</span>
        </button>
    );
}

export default DownloadBtn;
