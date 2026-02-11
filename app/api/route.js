import { NextResponse } from 'next/server';
import { query } from '../../lib/db';
import { jsPDF } from 'jspdf';
import 'jspdf/dist/jspdf.umd.min.js';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const hostelType = searchParams.get('hostel_type');
        const rollNumber = searchParams.get('roll_number');
        const year = searchParams.get('year');
        const download = searchParams.get('download');

        let sql = 'SELECT * FROM students WHERE 1=1';
        const params = [];
        let paramCount = 1;

        if (hostelType) {
            sql += ` AND hostel = $${paramCount}`;
            params.push(hostelType);
            paramCount++;
        }
        if (rollNumber) {
            sql += ` AND roll_number ILIKE $${paramCount}`;
            params.push(`%${rollNumber}%`);
            paramCount++;
        }
        if (year) {
            sql += ` AND year = $${paramCount}`;
            params.push(year);
            paramCount++;
        }

        sql += ' ORDER BY id DESC';

        const result = await query(sql, params);
        
        if (download === 'pdf') {
            return generatePDF(result.rows, hostelType, rollNumber, year);
        }
        
        if (download === 'csv') {
            return downloadCSV(result.rows);
        }
        
        return NextResponse.json(result.rows);
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const { name, college_type, roll_number, state, hostel_type, year } = await request.json();
        const result = await query(
            'INSERT INTO students(name, college_type, roll_number, state, hostel, year) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [name, college_type, roll_number, state, hostel_type || null, year || null]
        );
        return NextResponse.json(result.rows[0], { status: 201 });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        const { id, name, college_type, roll_number, state, hostel_type, year } = await request.json();
        const result = await query(
            'UPDATE students SET name=$1, college_type=$2, roll_number=$3, state=$4, hostel=$5, year=$6 WHERE id=$7 RETURNING *',
            [name, college_type, roll_number, state, hostel_type || null, year || null, id]
        );
        return NextResponse.json(result.rows[0]);
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const { id } = await request.json();
        await query('DELETE FROM students WHERE id=$1', [id]);
        return NextResponse.json({ success: true });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

function generatePDF(data, hostelType, rollNumber, year) {
    try {
        const doc = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4'
        });

        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        let yPos = 15;

        // Title
        doc.setFontSize(20);
        doc.text('STUDENT LIST', pageWidth / 2, yPos, { align: 'center' });
        yPos += 10;

        // Filter info
        doc.setFontSize(10);
        let filterText = hostelType || rollNumber || year 
            ? `Filters: ${[hostelType && `Hostel: ${hostelType}`, rollNumber && `Roll #: ${rollNumber}`, year && `Year: ${year}`].filter(Boolean).join(' | ')}`
            : 'All Students';
        doc.text(filterText, pageWidth / 2, yPos, { align: 'center' });
        yPos += 7;

        // Generated date
        doc.setFontSize(8);
        doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth / 2, yPos, { align: 'center' });
        yPos += 10;

        // Table
        const headers = ['#', 'Name', 'Roll #', 'College', 'State', 'Hostel', 'Year'];
        const columnWidths = [12, 35, 30, 30, 25, 35, 28];
        const startX = 10;
        const rowHeight = 8;

        // Header row
        doc.setFillColor(217, 119, 6); // Orange
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(9);
        doc.setFont(undefined, 'bold');

        headers.forEach((header, i) => {
            const x = startX + columnWidths.slice(0, i).reduce((a, b) => a + b, 0);
            doc.rect(x, yPos, columnWidths[i], rowHeight, 'F');
            doc.text(header, x + 2, yPos + 5.5, { maxWidth: columnWidths[i] - 4 });
        });

        yPos += rowHeight;

        // Data rows
        doc.setTextColor(0, 0, 0);
        doc.setFont(undefined, 'normal');
        doc.setFontSize(8);

        data.forEach((row, idx) => {
            // Page break
            if (yPos > pageHeight - 20) {
                doc.addPage();
                yPos = 20;
            }

            // Alternate row colors
            if (idx % 2 === 0) {
                doc.setFillColor(243, 244, 246);
                headers.forEach((_, i) => {
                    const x = startX + columnWidths.slice(0, i).reduce((a, b) => a + b, 0);
                    doc.rect(x, yPos, columnWidths[i], rowHeight, 'F');
                });
            }

            // Row data
            const rowData = [
                String(idx + 1),
                String(row.name || 'N/A').substring(0, 25),
                String(row.roll_number || 'N/A').substring(0, 20),
                String(row.college_type || 'N/A').substring(0, 20),
                String(row.state || 'N/A').substring(0, 15),
                String(row.hostel || 'N/A').substring(0, 20),
                String(row.year || 'N/A').substring(0, 10)
            ];

            rowData.forEach((cell, i) => {
                const x = startX + columnWidths.slice(0, i).reduce((a, b) => a + b, 0);
                doc.text(cell, x + 2, yPos + 5.5, { maxWidth: columnWidths[i] - 4 });
            });

            yPos += rowHeight;
        });

        // Footer
        doc.setFontSize(7);
        doc.setTextColor(85, 85, 85);
        doc.text(`Total Records: ${data.length}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
        doc.text('© 2026 qmexai - Ramadan Data Platform', pageWidth / 2, pageHeight - 5, { align: 'center' });

        const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
        
        return new NextResponse(pdfBuffer, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="student-list-${new Date().toISOString().split('T')[0]}.pdf"`
            }
        });
    } catch (err) {
        console.error('PDF Error:', err);
        throw err;
    }
}

function downloadCSV(data) {
    const headers = ['ID', 'Name', 'Roll Number', 'College Type', 'State', 'Hostel', 'Year'];
    const rows = data.map(d => [
        d.id,
        `"${d.name}"`,
        d.roll_number,
        d.college_type,
        d.state || 'N/A',
        d.hostel || 'N/A',
        d.year || 'N/A'
    ]);

    const csv = [
        headers.join(','),
        ...rows.map(row => row.join(','))
    ].join('\n');

    return new NextResponse(csv, {
        status: 200,
        headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': `attachment; filename="ramadan-data-${new Date().toISOString().split('T')[0]}.csv"`
        }
    });
}