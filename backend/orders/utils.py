import io
import os
from django.http import FileResponse, Http404
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm
from reportlab.lib.utils import ImageReader
from django.conf import settings
from .models import Order
from num2words import num2words

# --- GUARANTEED ABSOLUTE PATH ---
LOGO_PATH = r"C:\Users\HP\OneDrive\Bureau\akrabiolab\frontend\public\images\akrabilab-logo.png"

def get_order_or_404(order_id):
    try:
        return Order.objects.get(pk=order_id)
    except Order.DoesNotExist:
        raise Http404

def draw_header_and_logo(p, width, height, title, order):
    """Draws a large transparent background logo and professional header."""
    
    # 1. FULL PAGE WATERMARK (The request)
    if os.path.exists(LOGO_PATH):
        try:
            logo = ImageReader(LOGO_PATH)
            p.saveState()
            p.setFillAlpha(0.07) # Professional transparency (7%)
            # Center the logo largely on the page
            side = 14*cm
            p.drawImage(logo, (width-side)/2, (height-side)/2, width=side, height=side, preserveAspectRatio=True, mask='auto')
            p.restoreState()
            
            # Also a small sharp one at top-left for the header
            p.drawImage(logo, 1.5*cm, height-4.5*cm, width=3.5*cm, preserveAspectRatio=True, mask='auto')
        except Exception as e:
            print(f"Watermark Error: {e}")

    # 2. Company Info (Identité)
    p.setFillColorRGB(0, 0, 0)
    p.setFont("Helvetica-Bold", 12)
    p.drawString(1.5*cm, height-5.5*cm, "LABORATOIRE AKRABIOLAB")
    p.setFont("Helvetica", 8)
    p.drawString(1.5*cm, height-6.1*cm, "Lot 05 Local N° 01, RDC, Sidi Moussa 16046, Alger")
    p.drawString(1.5*cm, height-6.6*cm, "RC: 16/00-5142591 A 21 | NIF: 196161180033615200000")
    p.drawString(1.5*cm, height-7.1*cm, "Tél: 0797 21 22 52")
    
    # 3. Document Info (Top-Right)
    p.setFont("Helvetica-Bold", 14)
    p.drawRightString(width-1.5*cm, height-2*cm, f"{title} N° {order.id:04d}")
    p.setFont("Helvetica", 10)
    p.drawRightString(width-1.5*cm, height-2.6*cm, f"Date: {order.created_at.strftime('%d/%m/%Y')}")

    # 4. Client Box
    p.setStrokeColorRGB(0.5, 0.5, 0.5)
    p.rect(1.5*cm, height-10*cm, width-3*cm, 2.5*cm)
    p.setFont("Helvetica-Bold", 10)
    p.drawString(2*cm, height-8.2*cm, "DESTINATAIRE / CLIENT:")
    p.setFont("Helvetica-Bold", 12)
    p.drawString(2.5*cm, height-8.9*cm, f"{order.client.name}")
    p.setFont("Helvetica", 9)
    p.drawString(2.5*cm, height-9.4*cm, f"ADRESSE: {order.client.address}")
    p.drawString(2.5*cm, height-9.8*cm, f"TÉL: {order.client.phone}")

def generate_invoice_pdf(request, order_id):
    order = get_order_or_404(order_id)
    buffer = io.BytesIO()
    p = canvas.Canvas(buffer, pagesize=A4)
    width, height = A4
    
    draw_header_and_logo(p, width, height, "FACTURE PRO-FORMA", order)
    
    # Items Table
    y = height - 11.5*cm
    p.setFont("Helvetica-Bold", 9)
    p.drawString(1.5*cm, y, "DÉSIGNATION DES PRODUITS")
    p.drawString(10*cm, y, "QTÉ")
    p.drawString(12.5*cm, y, "LITRES")
    p.drawString(14.5*cm, y, "PRIX/L")
    p.drawString(17*cm, y, "TOTAL HT")
    p.line(1.5*cm, y-0.2*cm, width-1.5*cm, y-0.2*cm)

    y -= 0.8*cm
    p.setFont("Helvetica", 9)
    from .formats import FORMATS
    for item in order.items.all():
        line_total = float(item.liters) * float(item.price_at_sale)
        fmt = FORMATS.get(item.format, {})
        designation = f"{item.product.name} - {fmt.get('label', item.format)}"
        p.drawString(1.5*cm, y, designation[:50])
        p.drawString(10*cm, y, f"{item.quantity} {fmt.get('unit_label', '')}")
        p.drawString(12.5*cm, y, f"{item.liters:g}")
        p.drawString(14.5*cm, y, f"{item.price_at_sale:,.2f}")
        p.drawString(17*cm, y, f"{line_total:,.2f}")
        y -= 0.6*cm
        if y < 6*cm:
            p.showPage()
            draw_header_and_logo(p, width, height, "FACTURE PRO-FORMA", order)
            y = height - 11.5*cm

    # Totals
    y -= 1*cm
    p.line(12*cm, y, width-1.5*cm, y)
    y -= 0.5*cm
    p.setFont("Helvetica-Bold", 10)
    p.drawString(12*cm, y, "TOTAL HT:")
    p.drawRightString(width-1.5*cm, y, f"{order.total_amount_ht:,.2f} DA")
    y -= 0.6*cm
    p.drawString(12*cm, y, "TVA (19%):")
    tva = float(order.total_amount_ht) * 0.19
    p.drawRightString(width-1.5*cm, y, f"{tva:,.2f} DA")
    y -= 1*cm
    
    # Net à payer
    p.setFont("Helvetica-Bold", 12)
    p.rect(11.5*cm, y-0.4*cm, width-13*cm, 1.2*cm, fill=0)
    p.drawString(11.8*cm, y+0.2*cm, "NET À PAYER TTC:")
    p.setFont("Helvetica-Bold", 14)
    p.drawRightString(width-1.8*cm, y-0.2*cm, f"{order.total_amount_ttc:,.2f} DA")

    # Words
    y -= 2.5*cm
    p.setFont("Helvetica-Oblique", 9)
    try:
        amount_words = num2words(float(order.total_amount_ttc), lang='fr').upper()
        p.drawString(1.5*cm, y, f"Arrêté la présente facture à la somme de :")
        y -= 0.4*cm
        p.setFont("Helvetica-BoldOblique", 9)
        p.drawString(1.5*cm, y, f"{amount_words} DINARS ALGÉRIENS")
    except: pass
        
    p.showPage()
    p.save()
    buffer.seek(0)
    return FileResponse(buffer, as_attachment=True, filename=f"FACTURE_{order.id}.pdf")

def generate_bl_pdf(request, order_id):
    order = get_order_or_404(order_id)
    buffer = io.BytesIO()
    p = canvas.Canvas(buffer, pagesize=A4)
    width, height = A4
    
    draw_header_and_logo(p, width, height, "BON DE LIVRAISON", order)
    
    y = height - 11.5*cm
    p.setFont("Helvetica-Bold", 9)
    p.drawString(1.5*cm, y, "DÉSIGNATION")
    p.drawString(12*cm, y, "QUANTITÉ")
    p.drawString(16*cm, y, "OBSERVATION")
    p.line(1.5*cm, y-0.2*cm, width-1.5*cm, y-0.2*cm)
    
    y -= 0.8*cm
    p.setFont("Helvetica", 9)
    from .formats import FORMATS
    for item in order.items.all():
        fmt = FORMATS.get(item.format, {})
        designation = f"{item.product.name} - {fmt.get('label', item.format)}"
        p.drawString(1.5*cm, y, designation[:60])
        p.drawString(12*cm, y, f"{item.quantity} {fmt.get('unit_label', '')} ({item.liters:g} L)")
        p.drawString(16*cm, y, "---")
        y -= 0.6*cm
        if y < 4*cm:
            p.showPage()
            draw_header_and_logo(p, width, height, "BON DE LIVRAISON", order)
            y = height - 11.5*cm

    y -= 2*cm
    p.setFont("Helvetica-Bold", 10)
    p.drawString(2*cm, y, "Signature & Cachet Client")
    p.drawRightString(width-2*cm, y, "Accusé de réception")
        
    p.showPage()
    p.save()
    buffer.seek(0)
    return FileResponse(buffer, as_attachment=True, filename=f"BL_{order.id}.pdf")
