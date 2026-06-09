from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
import openpyxl
import os
from django.conf import settings

class Client(models.Model):
    DOMAIN_CHOICES = [
        ('SOCIETE', 'Société'),
        ('PARFUMERIE', 'Parfumerie'),
        ('PARTICULIER', 'Client Particulier'),
        ('GROSSISTE', 'Grossiste'),
    ]
    name = models.CharField(max_length=200)
    domain = models.CharField(max_length=50, choices=DOMAIN_CHOICES)
    address = models.TextField()
    phone = models.CharField(max_length=20)
    rc = models.CharField(max_length=100, blank=True, null=True, help_text="Registre de Commerce")
    nif = models.CharField(max_length=100, blank=True, null=True, help_text="Numéro d'Identification Fiscale")
    nis = models.CharField(max_length=100, blank=True, null=True, help_text="Numéro d'Identification Statistique")
    ai = models.CharField(max_length=100, blank=True, null=True, help_text="Article d'Imposition")
    
    total_debt = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    total_paid = models.DecimalField(max_digits=15, decimal_places=2, default=0)

    def __str__(self):
        return self.name

    @property
    def balance(self):
        # La balance est la dette restante : Dette Totale - Total Payé
        # On s'assure qu'elle ne soit pas négative par sécurité d'affichage
        res = self.total_debt - self.total_paid
        return max(res, 0)

    def save(self, *args, **kwargs):
        # Régularisation : si par erreur total_paid > total_debt, on peut choisir de plafonner
        # Mais ici on va laisser la logique de validation faire le travail.
        super().save(*args, **kwargs)

class Payment(models.Model):
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='payments')
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    date = models.DateTimeField(auto_now_add=True)
    note = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return f"Payment of {self.amount} DA from {self.client.name}"

@receiver(post_save, sender=Payment)
def update_client_balance(sender, instance, created, **kwargs):
    if created:
        client = instance.client
        client.total_paid += instance.amount
        client.save()
        sync_to_excel()

def sync_to_excel():
    """Logic to sync all clients and financial data to an Excel file as backup."""
    try:
        excel_path = os.path.join(settings.BASE_DIR, 'AKRABIOLAB_FINANCIAL_BACKUP.xlsx')
        wb = openpyxl.Workbook()
        ws = wb.active
        ws.title = "Clients & Debts"
        
        # Headers
        headers = ['Client Name', 'Domain', 'Phone', 'Total Debt (DA)', 'Total Paid (DA)', 'Remaining Balance (DA)']
        ws.append(headers)
        
        for client in Client.objects.all():
            ws.append([
                client.name, 
                client.get_domain_display(), 
                client.phone, 
                float(client.total_debt), 
                float(client.total_paid), 
                float(client.balance)
            ])
        
        wb.save(excel_path)
    except Exception as e:
        print(f"Excel sync failed (likely file is open): {e}")
