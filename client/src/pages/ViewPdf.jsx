import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { httpRoute, axiosTokenHeader } from '../helperFunctions.js';
import { DNA } from 'react-loader-spinner';

export default function ViewPdf() {
    const { articleId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [pdfUrl, setPdfUrl] = useState(null);
    const [error, setError] = useState(null);
    const [articleTitle, setArticleTitle] = useState('');
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    useEffect(() => {
        const fetchSignedUrl = async () => {
            try {
                axios.defaults.headers.common['Authorization'] = axiosTokenHeader();
                const response = await axios.get(`${httpRoute}/api/journalArticle/get-viewer-url/${articleId}`);
                
                setPdfUrl(response.data.signedUrl);
                setArticleTitle(response.data.articleTitle);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching PDF URL:', err);
                if (err.response?.status === 403) {
                    setError('Subscription required or expired. Please subscribe to view this article.');
                } else if (err.response?.status === 404) {
                    setError('Article not found.');
                } else {
                    setError('Failed to load PDF. Please try again.');
                }
                setLoading(false);
            }
        };

        fetchSignedUrl();
    }, [articleId]);

    useEffect(() => {
        if (!pdfUrl) return;

        // Disable right-click
        const disableRightClick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            return false;
        };

        // Comprehensive keyboard shortcuts blocking
        const disableKeyboardShortcuts = (e) => {
            const key = e.key.toLowerCase();
            const ctrl = e.ctrlKey || e.metaKey; // Support both Ctrl and Cmd (Mac)
            const shift = e.shiftKey;

            // Copy shortcuts
            if (ctrl && key === 'c') {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
            // Cut shortcut
            if (ctrl && key === 'x') {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
            // Paste shortcut
            if (ctrl && key === 'v') {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
            // Select All
            if (ctrl && key === 'a') {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
            // Save
            if (ctrl && key === 's') {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
            // Print
            if (ctrl && key === 'p') {
                e.preventDefault();
                e.stopPropagation();
                alert('Printing is disabled for subscribed content');
                return false;
            }
            // View Source / Inspect Element
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
            // F12 (DevTools)
            if (e.key === 'F12' || e.keyCode === 123) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
            // Print Screen
            if (e.key === 'PrintScreen' || e.keyCode === 44) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
            // Screenshot shortcuts (Windows: Win+Shift+S, Mac: Cmd+Shift+4)
            if ((e.metaKey || e.ctrlKey) && shift && (key === 's' || key === '4')) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        };

        // Prevent text selection via mouse drag
        const preventSelection = (e) => {
            if (e.button === 0) { // Left mouse button
                e.preventDefault();
                return false;
            }
        };

        const preventDragStart = (e) => {
            e.preventDefault();
            return false;
        };

        // Disable text selection on all elements
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

        // Apply to body and html
        document.body.style.userSelect = 'none';
        document.body.style.webkitUserSelect = 'none';
        document.body.style.mozUserSelect = 'none';
        document.body.style.msUserSelect = 'none';
        document.documentElement.style.userSelect = 'none';
        document.documentElement.style.webkitUserSelect = 'none';

        // Override window.print
        const originalPrint = window.print;
        window.print = () => {
            alert('Printing is disabled for subscribed content');
        };

        // Override clipboard API
        const originalWriteText = navigator.clipboard?.writeText;
        if (navigator.clipboard) {
            navigator.clipboard.writeText = () => {
                return Promise.reject(new Error('Copying is disabled'));
            };
        }

        // Add event listeners with capture phase to catch events early
        const options = { capture: true, passive: false };
        document.addEventListener('contextmenu', disableRightClick, options);
        document.addEventListener('keydown', disableKeyboardShortcuts, options);
        document.addEventListener('keyup', disableKeyboardShortcuts, options);
        document.addEventListener('selectstart', preventSelection, options);
        document.addEventListener('dragstart', preventDragStart, options);
        document.addEventListener('mousedown', preventSelection, options);

        // Cleanup function
        return () => {
            document.removeEventListener('contextmenu', disableRightClick, options);
            document.removeEventListener('keydown', disableKeyboardShortcuts, options);
            document.removeEventListener('keyup', disableKeyboardShortcuts, options);
            document.removeEventListener('selectstart', preventSelection, options);
            document.removeEventListener('dragstart', preventDragStart, options);
            document.removeEventListener('mousedown', preventSelection, options);
            
            // Remove style tag
            const styleTag = document.getElementById('pdf-viewer-restrictions');
            if (styleTag) {
                styleTag.remove();
            }
            
            // Restore styles
            document.body.style.userSelect = '';
            document.body.style.webkitUserSelect = '';
            document.body.style.mozUserSelect = '';
            document.body.style.msUserSelect = '';
            document.documentElement.style.userSelect = '';
            document.documentElement.style.webkitUserSelect = '';
            
            // Restore functions
            window.print = originalPrint;
            if (navigator.clipboard && originalWriteText) {
                navigator.clipboard.writeText = originalWriteText;
            }
        };
    }, [pdfUrl]);

    // Generate watermark text
    const getWatermarkText = () => {
        if (currentUser?.user?.email) {
            const timestamp = new Date().toLocaleString();
            return `${currentUser.user.email} - ${timestamp}`;
        }
        return 'Restricted Content';
    };

    if (loading) {
        return (
            <div className='flex justify-center items-center h-screen'>
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
            <div className='flex flex-col justify-center items-center h-screen p-8'>
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

    return (
        <div 
            style={{ 
                position: 'relative', 
                width: '100%', 
                height: '100vh', 
                overflow: 'hidden',
                userSelect: 'none',
                WebkitUserSelect: 'none',
                MozUserSelect: 'none',
                msUserSelect: 'none'
            }}
            onContextMenu={(e) => e.preventDefault()}
            onSelectStart={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
        >
            {/* Watermark Overlay */}
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

            {/* PDF Iframe with inline content disposition from backend */}
            <iframe
                src={pdfUrl}
                title={articleTitle}
                type="application/pdf"
                style={{
                    width: '100%',
                    height: '100vh',
                    border: 'none',
                    position: 'relative',
                    zIndex: 1,
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                    MozUserSelect: 'none',
                    msUserSelect: 'none',
                    pointerEvents: 'auto'
                }}
                onContextMenu={(e) => e.preventDefault()}
                onLoad={() => {
                    console.log('PDF iframe loaded successfully');
                    // Try to disable selection in iframe (may not work due to cross-origin)
                    try {
                        const iframe = document.querySelector('iframe[title="' + articleTitle + '"]');
                        if (iframe && iframe.contentDocument) {
                            iframe.contentDocument.body.style.userSelect = 'none';
                        }
                    } catch (e) {
                        // Cross-origin restriction - expected
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

