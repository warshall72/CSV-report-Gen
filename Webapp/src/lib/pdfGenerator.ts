
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import type { Report } from "@/lib/api";

const GITHUB_LOGO_URL = "/github-logo.png";
const GITHUB_PROFILE_LINK = "https://github.com/krishsinghhura";

export const generateReportPDF = async (report: Report, chartElementId: string) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;
    let cursorY = margin;

    const addHeader = () => {
        // Add Logo
        const imgWidth = 10;
        const imgHeight = 10;
        try {
            doc.addImage(GITHUB_LOGO_URL, "PNG", pageWidth - margin - imgWidth, 10, imgWidth, imgHeight);
        } catch (e) {
            console.warn("Could not add logo", e);
        }

        // Add Link Text
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 255);
        doc.textWithLink("krishsinghhura", pageWidth - margin - imgWidth - 30, 16, { url: GITHUB_PROFILE_LINK });
        doc.setTextColor(0, 0, 0); // Reset color
    };

    const addText = (text: string, fontSize: number = 12, isBold: boolean = false) => {
        doc.setFontSize(fontSize);
        doc.setFont("helvetica", isBold ? "bold" : "normal");

        const lines = doc.splitTextToSize(text, contentWidth);

        if (cursorY + lines.length * fontSize * 0.5 > pageHeight - margin) {
            doc.addPage();
            addHeader();
            cursorY = margin + 20;
        }

        doc.text(lines, margin, cursorY);
        cursorY += lines.length * fontSize * 0.5 + 5; // Use simple line height approx
    };

    const addList = (items: string[]) => {
        items.forEach(item => {
            addText(`• ${item}`, 11);
        });
        cursorY += 5;
    };

    addHeader();
    cursorY += 20;

    // Title
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text(`CSV Insights Report`, margin, cursorY);
    cursorY += 15;

    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text(`File: ${report.filename}`, margin, cursorY);
    cursorY += 10;
    doc.text(`Date: ${new Date(report.createdAt).toLocaleDateString()}`, margin, cursorY);
    cursorY += 20;

    // Summary
    addText("Executive Summary", 16, true);
    addText(report.summary.summary, 12);
    cursorY += 10;

    // Trends
    addText("Key Trends", 16, true);
    const trends = Array.isArray(report.summary.trends)
        ? report.summary.trends
        : Object.entries(report.summary.trends || {}).map(([k, v]) => `${k}: ${v}`);

    if (trends.length > 0) {
        addList(trends);
    } else {
        addText("No specific trends identified.", 11);
    }
    cursorY += 10;


    // Outliers
    addText("Outliers & Anomalies", 16, true);
    const outliers = Array.isArray(report.summary.outliers)
        ? report.summary.outliers
        : Object.entries(report.summary.outliers || {}).map(([k, v]) => `${k}: ${v}`);

    if (outliers.length > 0) {
        addList(outliers);
    } else {
        addText("No critical outliers detected.", 11);
    }
    cursorY += 10;

    // Recommendations
    addText("Recommendations", 16, true);
    const recommendations = Array.isArray(report.summary.recommendations)
        ? report.summary.recommendations
        : Object.entries(report.summary.recommendations || {}).map(([k, v]) => `${k}: ${v}`);

    if (recommendations.length > 0) {
        addList(recommendations);
    } else {
        addText("No recommendations provided.", 11);
    }

    // Visualizations (New Page)
    doc.addPage();
    addHeader();
    cursorY = margin + 20;

    addText("Data Visualizations", 16, true);
    cursorY += 10;

    const chartElement = document.getElementById(chartElementId);
    if (chartElement) {
        try {
            const canvas = await html2canvas(chartElement, { scale: 2 });
            const imgData = canvas.toDataURL("image/png");
            const imgProps = doc.getImageProperties(imgData);
            const pdfWidth = contentWidth;
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            doc.addImage(imgData, "PNG", margin, cursorY, pdfWidth, pdfHeight);
        } catch (e) {
            console.error("Failed to capture chart", e);
            addText("Chart visualization could not be captured.", 12);
        }
    } else {
        addText("Charts not available in view.", 12);
    }

    doc.save(`report-${report.filename}.pdf`);
};
