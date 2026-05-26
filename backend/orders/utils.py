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

# Absolute path to the logo in the public folder
LOGO_PATH = os.path.join(settings.BASE_DIR, '..', 'frontend', 'public', 'images', 'akrabilab-logo.png')

def get_order_or_404(order_id):
    try:
        return Order.objects.get(pk=order_id)
    except Order.DoesNotExist:
        raise Http404

def draw_header_and_logo(p, width, height, title, order):
    """Utility to draw logo, company info, and client info on PDF."""
    # 1. Logo
    if os.path.exists(LOGO_PATH):
        try:
            logo = ImageReader(LOGO_PATH)
            p.drawImage(logo, 1.5*cm, height-3.5*cm, width=4.5*cm, preserveAspectRatio=True, mask='auto')
        except Exception as e:
            print(f"Logo error: {e}")
    
    # 2. Company Info
    p.setFont("Helvetica-Bold", 16)
    p.drawRightString(width-1.5*cm, height-2*cm, "LABORATOIRE AKRABIOLAB")
    p.setFont("Helvetica", 8)
    p.drawRightString(width-1.5*cm, height-2.6*cm, "Bordj El Bahri, Alger, Algérie")
    p.drawRightString(width-1.5*cm, height-3.0*cm, "RC: 16/00-5142591 A 21 | NIF: 196161180033615200000")
    
    # 3. Document Title
    p.setFont("Helvetica-Bold", 14)
    p.drawRightString(width-1.5*cm, height-4.5*cm, f"{title} N° {order.id:04d}")
    p.setFont("Helvetica", 10)
    p.drawRightString(width-1.5*cm, height-5.1*cm, f"Date: {order.created_at.strftime('%d/%m/%Y')}")

    # 4. Client Box
    p.rect(1.5*cm, height-8*cm, width-3*cm, 2.5*cm)
    p.setFont("Helvetica-Bold", 11)
    p.drawString(2*cm, height-6.3*cm, "DESTINATAIRE / CLIENT:")
    p.setFont("Helvetica-Bold", 12)
    p.drawString(2.5*cm, height-7.0*cm, f"{order.client.name}")
    p.setFont("Helvetica", 10)
    p.drawString(2.5*cm, height-7.5*cm, f"ADRESSE: {order.client.address}")
    p.drawString(2.5*cm, height-8.0*cm, f"TÉL: {order.client.phone}")

def generate_invoice_pdf(request, order_id):
    order = get_order_or_404(order_id)
    buffer = io.BytesIO()
    p = canvas.Canvas(buffer, pagesize=A4)
    width, height = A4
    
    draw_header_and_logo(p, width, height, "FACTURE PRO-FORMA", order)
    
    # Items Table
    y = height - 9.5*cm
    p.setFont("Helvetica-Bold", 10)
    p.drawString(1.5*cm, y, "DÉSIGNATION DES PRODUITS")
    p.drawString(11*cm, y, "QTÉ")
    p.drawString(13.5*cm, y, "PRIX UNIT")
    p.drawString(17*cm, y, "TOTAL HT")
    p.line(1.5*cm, y-0.2*cm, width-1.5*cm, y-0.2*cm)
    
    y -= 0.8*cm
    p.setFont("Helvetica", 10)
    for item in order.items.all():
        line_total = item.quantity * item.price_at_sale
        p.drawString(1.5*cm, y, item.product.name[:45])
        p.drawString(11*cm, y, f"{item.quantity}")
        p.drawString(13.5*cm, y, f"{item.price_at_sale:,.2f}")
        p.drawString(17*cm, y, f"{line_total:,.2f}")
        y -= 0.7*cm
        if y < 6*cm:
            p.showPage()
            y = height - 2*cm

    # Totals
    y -= 1*cm
    p.line(12*cm, y, width-1.5*cm, y)
    y -= 0.6*cm
    p.setFont("Helvetica-Bold", 11)
    p.drawString(12*cm, y, "TOTAL HT:")
    p.drawRightString(width-1.5*cm, y, f"{order.total_amount_ht:,.2f} DA")
    y -= 0.6*cm
    p.drawString(12*cm, y, "TVA (19%):")
    tva = float(order.total_amount_ht) * 0.19
    p.drawRightString(width-1.5*cm, y, f"{tva:,.2f} DA")
    y -= 0.8*cm
    p.setFont("Helvetica-Bold", 14)
    p.rect(11.5*cm, y-0.2*cm, width-13*cm, 0.8*cm, fill=0)
    p.drawString(12*cm, y, "NET À PAYER TTC:")
    p.drawRightString(width-1.8*cm, y, f"{order.total_amount_ttc:,.2f} DA")

    # Amount in words
    y -= 2*cm
    p.setFont("Helvetica-Oblique", 10)
    try:
        amount_words = num2words(float(order.total_amount_ttc), lang='fr').upper()
        p.drawString(1.5*cm, y, f"Arrêté la présente facture à la somme de :")
        y -= 0.5*cm
        p.setFont("Helvetica-BoldOblique", 10)
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
    
    y = height - 9.5*cm
    p.setFont("Helvetica-Bold", 10)
    p.drawString(1.5*cm, y, "DÉSIGNATION")
    p.drawString(12*cm, y, "QUANTITÉ")
    p.drawString(16*cm, y, "OBSERVATION")
    p.line(1.5*cm, y-0.2*cm, width-1.5*cm, y-0.2*cm)
    
    y -= 0.8*cm
    p.setFont("Helvetica", 10)
    for item in order.items.all():
        p.drawString(1.5*cm, y, item.product.name[:50])
        p.drawString(12*cm, y, f"{item.quantity}")
        p.drawString(16*cm, y, "---")
        y -= 0.7*cm
        if y < 4*cm:
            p.showPage()
            y = height - 2*cm

    y -= 2*cm
    p.setFont("Helvetica-Bold", 10)
    p.drawString(2*cm, y, "Signature & Cachet Client")
    p.drawRightString(width-2*cm, y, "Accusé de réception")
        
    p.showPage()
    p.save()
    buffer.seek(0)
    return FileResponse(buffer, as_attachment=True, filename=f"BL_{order.id}.pdf")
