import PDFDocument from 'pdfkit';
import { PDFDocument as PDFLibDocument } from 'pdf-lib';
import fetch from 'node-fetch';

const LOGO_URL = 'https://s3-scientific-journal.s3.ap-south-1.amazonaws.com/Images/logo-removebg-preview.jpg';
const INK = '#543a31';
const TEXT = '#2c241f';
const MUTED = '#6b5a52';
const RULE = '#cbb9b0';
const PANEL = '#F7F1ED';
const LEFT = 48;

const formatDate = (value) => {
    if (!value) return '—';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '—';
    return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
};

const authorName = (author) =>
    [author?.authorTitle, author?.authorGivenName, author?.authorLastName].filter(Boolean).join(' ');

const issueLabel = (article) => (
    article.specialReview
        ? `Special Issue ${article.articleIssue}`
        : `Issue ${article.articleIssue}`
);

const renderFrontMatter = (article, logoBuffer) => new Promise((resolve, reject) => {
    const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 64, bottom: 136, left: LEFT, right: LEFT },
        bufferPages: true,
    });
    const chunks = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const contentWidth = doc.page.width - LEFT * 2;
    const journalTitle = article.journalTitle || 'Scientific Journals Portal';
    const bottomLimit = () => doc.page.height - doc.page.margins.bottom;

    const fillPage = () => {
        doc.save();
        doc.rect(0, 0, doc.page.width, doc.page.height).fill('#ffffff');
        doc.restore();
    };
    fillPage();

    doc.on('pageAdded', () => {
        fillPage();
        const savedX = doc.x;
        const savedY = doc.y;
        doc.font('Times-Italic').fontSize(8).fillColor(MUTED);
        doc.text(journalTitle, LEFT, 30, { width: contentWidth * 0.72, lineBreak: false });
        doc.text('Continued', LEFT, 30, { width: contentWidth, align: 'right', height: 12 });
        doc.moveTo(LEFT, 46).lineTo(LEFT + contentWidth, 46).lineWidth(0.4).stroke(RULE);
        doc.x = savedX;
        doc.y = Math.max(savedY, 64);
    });

    const ensureSpace = (needed) => {
        if (doc.y + needed > bottomLimit()) doc.addPage();
    };

    if (logoBuffer) {
        doc.image(logoBuffer, LEFT, 32, { fit: [108, 46] });
    }

    const titleX = LEFT + 128;
    const titleWidth = contentWidth - 128;
    doc.font('Times-Bold').fontSize(13).fillColor(INK);
    doc.text(journalTitle, titleX, 36, { width: titleWidth, align: 'right' });
    const headerBits = ['Scientific Journals Portal'];
    if (article.journalISSN) headerBits.push(`ISSN ${article.journalISSN}`);
    doc.font('Times-Roman').fontSize(8).fillColor(MUTED);
    doc.text(headerBits.join('   ·   '), titleX, doc.y + 2, { width: titleWidth, align: 'right' });

    const ruleY = Math.max(88, doc.y + 10);
    doc.moveTo(LEFT, ruleY).lineTo(LEFT + contentWidth, ruleY).lineWidth(1.6).stroke(INK);
    doc.moveTo(LEFT, ruleY + 3.5).lineTo(LEFT + contentWidth, ruleY + 3.5).lineWidth(0.35).stroke(INK);

    doc.x = LEFT;
    doc.y = ruleY + 18;

    doc.font('Times-Bold').fontSize(8).fillColor(INK);
    doc.text(article.specialReview ? 'SPECIAL ISSUE' : 'ARTICLE', LEFT, doc.y, {
        width: contentWidth,
        characterSpacing: 1.1,
    });
    doc.moveDown(0.45);

    doc.font('Times-Bold').fontSize(18).fillColor(TEXT);
    doc.text(article.articleTitle || '', LEFT, doc.y, {
        width: contentWidth,
        align: 'left',
        lineGap: 2,
    });
    doc.moveDown(0.7);

    const authors = Array.isArray(article.articleAuthors) ? article.articleAuthors : [];
    const affiliationOrder = [];
    const affiliationNumber = new Map();
    authors.forEach((author) => {
        const affiliation = String(author?.authorAffiliation || '').trim();
        if (!affiliation || affiliationNumber.has(affiliation)) return;
        affiliationNumber.set(affiliation, affiliationOrder.length + 1);
        affiliationOrder.push(affiliation);
    });

    let cursorX = LEFT;
    let cursorY = doc.y;
    authors.forEach((author, index) => {
        const name = authorName(author);
        if (!name) return;
        const affiliation = String(author?.authorAffiliation || '').trim();
        const marker = affiliation ? String(affiliationNumber.get(affiliation)) : '';
        const separator = index < authors.length - 1 ? ',  ' : '';

        doc.font('Times-Roman').fontSize(11);
        const nameWidth = doc.widthOfString(name);
        doc.fontSize(7);
        const markerWidth = marker ? doc.widthOfString(marker) : 0;
        doc.font('Times-Roman').fontSize(11);
        const separatorWidth = doc.widthOfString(separator);
        const runWidth = nameWidth + markerWidth + separatorWidth + 2;

        if (cursorX > LEFT && cursorX + runWidth > LEFT + contentWidth) {
            cursorX = LEFT;
            cursorY += 16;
        }

        doc.font('Times-Roman').fontSize(11).fillColor(TEXT);
        doc.text(name, cursorX, cursorY, { lineBreak: false });
        if (marker) {
            doc.font('Times-Roman').fontSize(7).fillColor(INK);
            doc.text(marker, cursorX + nameWidth + 1, cursorY - 4, { lineBreak: false });
        }
        if (separator) {
            doc.font('Times-Roman').fontSize(11).fillColor(TEXT);
            doc.text(separator, cursorX + nameWidth + markerWidth + 2, cursorY, { lineBreak: false });
        }
        cursorX += runWidth;
    });

    doc.x = LEFT;
    doc.y = cursorY + (authors.length ? 18 : 0);

    affiliationOrder.forEach((affiliation, index) => {
        ensureSpace(16);
        doc.font('Times-Italic').fontSize(9).fillColor(MUTED);
        doc.text(`${index + 1}   ${affiliation}`, LEFT, doc.y, { width: contentWidth });
        doc.moveDown(0.12);
    });

    if (affiliationOrder.length) doc.moveDown(0.45);

    const abstractText = article.articleAbstract || '';
    doc.font('Times-Roman').fontSize(10.5);
    const abstractInnerWidth = contentWidth - 28;
    const abstractTextHeight = doc.heightOfString(abstractText, {
        width: abstractInnerWidth,
        align: 'justify',
    });
    const panelHeight = abstractTextHeight + 40;
    const abstractFits = doc.y + panelHeight <= bottomLimit();

    if (abstractFits) {
        const panelY = doc.y;
        doc.save();
        doc.roundedRect(LEFT, panelY, contentWidth, panelHeight, 3).fill(PANEL);
        doc.rect(LEFT, panelY, 3, panelHeight).fill(INK);
        doc.restore();
        doc.font('Times-Bold').fontSize(8).fillColor(INK);
        doc.text('ABSTRACT', LEFT + 16, panelY + 12, { width: abstractInnerWidth, characterSpacing: 0.8 });
        doc.font('Times-Roman').fontSize(10.5).fillColor(TEXT);
        doc.text(abstractText, LEFT + 16, panelY + 26, {
            width: abstractInnerWidth,
            align: 'justify',
            lineGap: 1.5,
        });
        doc.x = LEFT;
        doc.y = panelY + panelHeight + 14;
    } else {
        ensureSpace(36);
        doc.font('Times-Bold').fontSize(8).fillColor(INK);
        doc.text('ABSTRACT', LEFT, doc.y, { width: contentWidth, characterSpacing: 0.8 });
        doc.moveDown(0.35);
        doc.font('Times-Roman').fontSize(10.5).fillColor(TEXT);
        doc.text(abstractText, LEFT, doc.y, {
            width: contentWidth,
            align: 'justify',
            lineGap: 1.5,
        });
        doc.moveDown(0.8);
    }

    const keywords = article.articleKeywords || '';
    doc.font('Times-Bold').fontSize(10);
    const keywordLabel = 'Keywords:  ';
    const labelWidth = doc.widthOfString(keywordLabel);
    ensureSpace(doc.font('Times-Roman').fontSize(10).heightOfString(keywords, { width: contentWidth - labelWidth }) + 8);
    const keywordY = doc.y;
    doc.font('Times-Bold').fontSize(10).fillColor(INK);
    doc.text(keywordLabel, LEFT, keywordY, { lineBreak: false });
    doc.font('Times-Italic').fontSize(10).fillColor(TEXT);
    doc.text(keywords, LEFT + labelWidth, keywordY, { width: contentWidth - labelWidth });
    const cells = [
        ['Received', formatDate(article.articleReceivedDate)],
        ['Accepted', formatDate(article.articleAcceptedDate)],
        ['Published', formatDate(article.articlePublishedDate)],
        ['Volume / Issue', `Vol. ${article.articleVolume}, ${issueLabel(article)}`],
    ];

    const range = doc.bufferedPageRange();
    for (let i = 0; i < range.count; i += 1) {
        doc.switchToPage(range.start + i);
        doc.page.margins.bottom = 0;

        if (i === range.count - 1) {
            const metaHeight = 58;
            const metaY = doc.page.height - 112;
            const cellWidth = contentWidth / cells.length;
            doc.save();
            doc.roundedRect(LEFT, metaY, contentWidth, metaHeight, 3).lineWidth(0.6).stroke(RULE);
            doc.restore();
            cells.forEach((cell, index) => {
                const cellX = LEFT + index * cellWidth;
                if (index > 0) {
                    doc.moveTo(cellX, metaY + 8).lineTo(cellX, metaY + metaHeight - 8).lineWidth(0.4).stroke(RULE);
                }
                doc.font('Times-Bold').fontSize(7).fillColor(MUTED);
                doc.text(cell[0].toUpperCase(), cellX + 8, metaY + 12, {
                    width: cellWidth - 16,
                    height: 12,
                    characterSpacing: 0.4,
                });
                doc.font('Times-Roman').fontSize(9).fillColor(TEXT);
                doc.text(cell[1], cellX + 8, metaY + 28, {
                    width: cellWidth - 16,
                    height: 22,
                });
            });
        }

        const footerY = doc.page.height - 40;
        const citation = [
            journalTitle,
            article.journalAbbreviation || null,
            `Volume ${article.articleVolume}`,
            issueLabel(article),
        ].filter(Boolean).join('  ·  ');
        doc.moveTo(LEFT, footerY).lineTo(LEFT + contentWidth, footerY).lineWidth(0.45).stroke(RULE);
        doc.font('Times-Italic').fontSize(8).fillColor(MUTED);
        doc.text(citation, LEFT, footerY + 8, {
            width: contentWidth - 36,
            height: 18,
            ellipsis: true,
        });
        doc.font('Times-Roman').fontSize(8).fillColor(INK);
        doc.text(String(i + 1), LEFT, footerY + 8, { width: contentWidth, align: 'right', height: 12 });
    }

    doc.end();
});

const fetchLogo = async () => {
    const response = await fetch(LOGO_URL);
    if (!response.ok) {
        throw new Error(`Failed to fetch journal logo (${response.status})`);
    }
    const bytes = await response.arrayBuffer();
    return Buffer.from(bytes);
};

export const buildPublishedPdf = async ({ article, originalPdfBuffer }) => {
    const logoBuffer = await fetchLogo();
    const frontBuffer = await renderFrontMatter(article, logoBuffer);
    const frontDoc = await PDFLibDocument.load(frontBuffer);
    const originalDoc = await PDFLibDocument.load(originalPdfBuffer);
    const merged = await PDFLibDocument.create();

    const frontPages = await merged.copyPages(frontDoc, frontDoc.getPageIndices());
    frontPages.forEach((page) => merged.addPage(page));

    const originalPages = await merged.copyPages(originalDoc, originalDoc.getPageIndices());
    originalPages.forEach((page) => merged.addPage(page));

    return Buffer.from(await merged.save());
};
