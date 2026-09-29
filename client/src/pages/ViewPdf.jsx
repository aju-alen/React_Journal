import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { httpRoute, axiosTokenHeader } from '../helperFunctions.js';
import { DNA } from 'react-loader-spinner';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const isIosDevice = () => {
    if (typeof navigator === 'undefined') return false;
    const ua = navigator.userAgent || '';
    const iOSUa = /iPad|iPhone|iPod/.test(ua);
    const iPadOs = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
    return iOSUa || iPadOs;
};

export default function ViewPdf() {
    const { articleId } = useParams();
    const [searchParams] = useSearchParams();
    const isOpenAccess = searchParams.get('access') === 'open';
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [pdfUrl, setPdfUrl] = useState(null);
    const [streamUrl, setStreamUrl] = useState(null);
    const [error, setError] = useState(null);
    const [articleTitle, setArticleTitle] = useState('');
    const [iosRenderFailed, setIosRenderFailed] = useState(false);
    const [isIos] = useState(() => isIosDevice());
    const canvasContainerRef = useRef(null);
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    useEffect(() => {
        const fetchSignedUrl = async () => {
            try {
                if (isIos) {
                    const filePath = isOpenAccess
                        ? `${httpRoute}/api/journalArticle/open-access/file/${articleId}`
                        : `${httpRoute}/api/journalArticle/get-viewer-file/${articleId}`;
                    setStreamUrl(filePath);

                    try {
                        let signedResponse;
                        if (isOpenAccess) {
                            signedResponse = await axios.get(`${httpRoute}/api/journalArticle/open-access/viewer/${articleId}`);
                        } else {
                            axios.defaults.headers.common['Authorization'] = axiosTokenHeader();
                            signedResponse = await axios.get(`${httpRoute}/api/journalArticle/get-viewer-url/${articleId}`);
                        }
                        setPdfUrl(signedResponse.data.signedUrl);
                        setArticleTitle(signedResponse.data.articleTitle || '');
                    } catch (signedErr) {
                        // Stream render can still succeed; signed URL is only for Open PDF fallback
                        console.error('Signed URL fallback unavailable:', signedErr);
                        if (signedErr.response?.status === 403 || signedErr.response?.status === 404) {
                            throw signedErr;
                        }
                    }
                    setLoading(false);
                    return;
                }

                let response;
                if (isOpenAccess) {
                    response = await axios.get(`${httpRoute}/api/journalArticle/open-access/viewer/${articleId}`);
                } else {
                    axios.defaults.headers.common['Authorization'] = axiosTokenHeader();
                    response = await axios.get(`${httpRoute}/api/journalArticle/get-viewer-url/${articleId}`);
                }

                setPdfUrl(response.data.signedUrl);
                setArticleTitle(response.data.articleTitle);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching PDF URL:', err);
                if (err.response?.status === 403) {
                    setError(isOpenAccess
                        ? 'This article is not available as open access.'
                        : 'Subscription required or expired. Please subscribe to view this article.');
                } else if (err.response?.status === 404) {
                    setError('Article not found.');
                } else {
                    setError('Failed to load PDF. Please try again.');
                }
                setLoading(false);
            }
        };

        fetchSignedUrl();
    }, [articleId, isOpenAccess, isIos]);

    useEffect(() => {
        if (!isIos || !streamUrl || loading || error) return;

        let cancelled = false;

        const renderPdf = async () => {
            try {
                const headers = {};
                if (!isOpenAccess) {
                    headers.Authorization = axiosTokenHeader();
                }

                const response = await fetch(streamUrl, { headers });
                if (!response.ok) {
                    throw new Error(`Stream failed with status ${response.status}`);
                }

                const data = new Uint8Array(await response.arrayBuffer());
                if (cancelled) return;

                const pdf = await pdfjsLib.getDocument({ data }).promise;
                if (cancelled) return;

                const container = canvasContainerRef.current;
                if (!container) return;
                container.innerHTML = '';

                const containerWidth = container.clientWidth || window.innerWidth;
                const dpr = Math.max(1, window.devicePixelRatio || 1);

                for (let pageNum = 1; pageNum <= pdf.numPages; pageNum += 1) {
                    const page = await pdf.getPage(pageNum);
                    if (cancelled) return;

                    const unscaled = page.getViewport({ scale: 1 });
                    // Fit to container CSS width; floor at 1.5 so phone text stays readable
                    const cssScale = Math.max(1.5, Math.min(2, containerWidth / unscaled.width));
                    const viewport = page.getViewport({ scale: cssScale });

                    const canvas = document.createElement('canvas');
                    canvas.width = Math.floor(viewport.width * dpr);
                    canvas.height = Math.floor(viewport.height * dpr);
                    canvas.style.width = '100%';
                    canvas.style.height = 'auto';
                    canvas.style.display = 'block';
                    canvas.style.marginBottom = '8px';
                    container.appendChild(canvas);

                    const context = canvas.getContext('2d');
                    context.setTransform(dpr, 0, 0, dpr, 0, 0);

                    await page.render({
                        canvasContext: context,
                        viewport
                    }).promise;
                }
            } catch (err) {
                console.error('iOS PDF.js render error:', err);
                if (!cancelled) {
                    setIosRenderFailed(true);
                }
            }
        };

        renderPdf();

        return () => {
            cancelled = true;
            if (canvasContainerRef.current) {
                canvasContainerRef.current.innerHTML = '';
            }
        };
    }, [isIos, streamUrl, loading, error, isOpenAccess]);

    useEffect(() => {
        if (!pdfUrl || isIos || isOpenAccess) return;

        // Disable right-click
        const disableRightClick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            return false;
        };

        const disableKeyboardShortcuts = (e) => {
            const key = e.key.toLowerCase();
            const ctrl = e.ctrlKey || e.metaKey;
            const shift = e.shiftKey;

            if (ctrl && key === 'c') {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
            if (ctrl && key === 'x') {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
            if (ctrl && key === 'v') {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
            if (ctrl && key === 'a') {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
            if (ctrl && key === 's') {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
            if (ctrl && key === 'p') {
                e.preventDefault();
                e.stopPropagation();
                alert('Printing is disabled for subscribed content');
                return false;
            }
            if (ctrl && shift && key === 'i') {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
            if (ctrl && shift && key === 'c') {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
            if (ctrl && shift && key === 'j') {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
            if (ctrl && key === 'u') {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
            if (e.key === 'F12' || e.keyCode === 123) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
            if (e.key === 'PrintScreen' || e.keyCode === 44) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
            if ((e.metaKey || e.ctrlKey) && shift && (key === 's' || key === '4')) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        };

        const preventSelection = (e) => {
            if (e.button === 0) {
                e.preventDefault();
                return false;
            }
        };

        const preventDragStart = (e) => {
            e.preventDefault();
            return false;
        };

        const style = document.createElement('style');
        style.id = 'pdf-viewer-restrictions';
        style.textContent = `
            * {
                -webkit-user-select: none !important;
                -moz-user-select: none !important;
                -ms-user-select: none !important;
                user-select: none !important;
                -webkit-touch-callout: none !important;
                -webkit-tap-highlight-color: transparent !important;
            }
            *::selection {
                background: transparent !important;
            }
            *::-moz-selection {
                background: transparent !important;
            }
        `;
        document.head.appendChild(style);

        document.body.style.userSelect = 'none';
        document.body.style.webkitUserSelect = 'none';
        document.body.style.mozUserSelect = 'none';
        document.body.style.msUserSelect = 'none';
        document.documentElement.style.userSelect = 'none';
        document.documentElement.style.webkitUserSelect = 'none';

        const originalPrint = window.print;
        window.print = () => {
            alert('Printing is disabled for subscribed content');
        };

        const originalWriteText = navigator.clipboard?.writeText;
        if (navigator.clipboard) {
            navigator.clipboard.writeText = () => {
                return Promise.reject(new Error('Copying is disabled'));
            };
        }

        const options = { capture: true, passive: false };
        document.addEventListener('contextmenu', disableRightClick, options);
        document.addEventListener('keydown', disableKeyboardShortcuts, options);
        document.addEventListener('keyup', disableKeyboardShortcuts, options);
        document.addEventListener('selectstart', preventSelection, options);
        document.addEventListener('dragstart', preventDragStart, options);
        document.addEventListener('mousedown', preventSelection, options);

        return () => {
            document.removeEventListener('contextmenu', disableRightClick, options);
            document.removeEventListener('keydown', disableKeyboardShortcuts, options);
            document.removeEventListener('keyup', disableKeyboardShortcuts, options);
            document.removeEventListener('selectstart', preventSelection, options);
            document.removeEventListener('dragstart', preventDragStart, options);
            document.removeEventListener('mousedown', preventSelection, options);

            const styleTag = document.getElementById('pdf-viewer-restrictions');
            if (styleTag) {
                styleTag.remove();
            }

            document.body.style.userSelect = '';
            document.body.style.webkitUserSelect = '';
            document.body.style.mozUserSelect = '';
            document.body.style.msUserSelect = '';
            document.documentElement.style.userSelect = '';
            document.documentElement.style.webkitUserSelect = '';

            window.print = originalPrint;
            if (navigator.clipboard && originalWriteText) {
                navigator.clipboard.writeText = originalWriteText;
            }
        };
    }, [pdfUrl, isIos, isOpenAccess]);

    const getWatermarkText = () => {
        if (currentUser?.user?.email) {
            const timestamp = new Date().toLocaleString();
            return `${currentUser.user.email} - ${timestamp}`;
        }
        return 'Restricted Content';
    };

    const handleOpenPdfFallback = () => {
        if (pdfUrl) {
            window.open(pdfUrl, '_blank', 'noopener,noreferrer');
            return;
        }
        // OA stream is same-origin and needs no auth header in a new tab
        if (isOpenAccess && streamUrl) {
            window.open(streamUrl, '_blank', 'noopener,noreferrer');
        }
    };

    if (loading) {
        return (
            <div className='flex justify-center items-center pt-[5.5rem] sm:pt-[6.5rem] md:pt-28 h-screen box-border'>
                <DNA
                    visible={true}
                    height="80"
                    width="80"
                    ariaLabel="dna-loading"
                    wrapperStyle={{}}
                    wrapperClass="dna-wrapper"
                />
            </div>
        );
    }

    if (error) {
        return (
            <div className='flex flex-col justify-center items-center pt-[5.5rem] sm:pt-[6.5rem] md:pt-28 h-screen box-border p-8'>
                <div className='text-center max-w-md'>
                    <h2 className='text-2xl font-bold mb-4 text-red-600'>Error</h2>
                    <p className='text-lg mb-6'>{error}</p>
                    <button
                        onClick={() => navigate(-1)}
                        className='px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    if (isIos) {
        return (
            <div className="pt-[5.5rem] sm:pt-[6.5rem] md:pt-28 h-screen box-border flex flex-col">
                {iosRenderFailed && (
                    <div className="p-4 text-center bg-amber-50 border-b border-amber-200">
                        <p className="mb-3 text-sm text-amber-900">
                            Unable to render the PDF in this browser. You can open it directly instead.
                        </p>
                        <button
                            type="button"
                            onClick={handleOpenPdfFallback}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Open PDF
                        </button>
                    </div>
                )}
                <div
                    ref={canvasContainerRef}
                    className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-100 px-2 py-2"
                    style={{ WebkitOverflowScrolling: 'touch' }}
                />
                {!iosRenderFailed && (
                    <div className="p-3 border-t bg-white text-center">
                        <button
                            type="button"
                            onClick={handleOpenPdfFallback}
                            className="text-sm text-blue-700 underline"
                        >
                            Open PDF
                        </button>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div 
            className="pt-[5.5rem] sm:pt-[6.5rem] md:pt-28 h-screen box-border"
            style={{ 
                position: 'relative', 
                width: '100%', 
                overflow: 'hidden',
                userSelect: isOpenAccess ? 'auto' : 'none',
                WebkitUserSelect: isOpenAccess ? 'auto' : 'none',
                MozUserSelect: isOpenAccess ? 'auto' : 'none',
                msUserSelect: isOpenAccess ? 'auto' : 'none'
            }}
            onContextMenu={isOpenAccess ? undefined : (e) => e.preventDefault()}
            onSelectStart={isOpenAccess ? undefined : (e) => e.preventDefault()}
            onDragStart={isOpenAccess ? undefined : (e) => e.preventDefault()}
        >
            {!isOpenAccess && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        pointerEvents: 'none',
                        zIndex: 9999,
                        background: 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden'
                    }}
                >
                    <div
                        style={{
                            color: 'rgba(0, 0, 0, 0.15)',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            transform: 'rotate(-45deg)',
                            whiteSpace: 'nowrap',
                            userSelect: 'none',
                            WebkitUserSelect: 'none',
                            MozUserSelect: 'none',
                            msUserSelect: 'none'
                        }}
                    >
                        {getWatermarkText()}
                    </div>
                </div>
            )}

            <iframe
                src={pdfUrl}
                title={articleTitle}
                type="application/pdf"
                className="h-full"
                style={{
                    width: '100%',
                    border: 'none',
                    position: 'relative',
                    zIndex: 1,
                    userSelect: isOpenAccess ? 'auto' : 'none',
                    WebkitUserSelect: isOpenAccess ? 'auto' : 'none',
                    MozUserSelect: isOpenAccess ? 'auto' : 'none',
                    msUserSelect: isOpenAccess ? 'auto' : 'none',
                    pointerEvents: 'auto'
                }}
                onContextMenu={isOpenAccess ? undefined : (e) => e.preventDefault()}
                onLoad={() => {
                    console.log('PDF iframe loaded successfully');
                    if (isOpenAccess) return;
                    try {
                        const iframe = document.querySelector('iframe[title="' + articleTitle + '"]');
                        if (iframe && iframe.contentDocument) {
                            iframe.contentDocument.body.style.userSelect = 'none';
                        }
                    } catch (e) {
                        console.log('Cannot access iframe content due to cross-origin policy');
                    }
                }}
                onError={(e) => {
                    console.error('Iframe load error:', e);
                    setError('Failed to load PDF. Please try again.');
                }}
            />
        </div>
    );
}
