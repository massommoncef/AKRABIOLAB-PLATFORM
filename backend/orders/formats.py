"""
Order formats catalogue.

A Product is a liquid (identified by its alcohol degree). At order time the
client picks a FORMAT. Each format maps one ordered unit to:
  - a liquid volume in liters
  - a list of packaging items consumed (type, size, count per unit)
  - a number of degree-specific labels consumed per unit

Ordering rule (confirmed with client):
  - Flacons are ordered BY FULL CARTON (24 x 250ml, 16 x 500ml, 12 x 1L).
  - Bidon 5L = 1 bidon + 1 label, cap included (no separate cap).
  - IBC 1000L and VRAC = liquid only, no stocked packaging.
"""

# format_key -> definition
FORMATS = {
    'CARTON_250': {
        'label': 'Carton 250 ml (×24)',
        'liters_per_unit': 6.0,          # 24 * 0.25
        'unit_label': 'carton',
        # (packaging type, size, qty per ordered unit)
        'packaging': [
            ('BOTTLE', '250ML', 24),
            ('CAP', 'NA', 24),
            ('CARTON', 'PETIT', 1),
        ],
        'labels_per_unit': 24,
    },
    'CARTON_500': {
        'label': 'Carton 500 ml (×16)',
        'liters_per_unit': 8.0,          # 16 * 0.5
        'unit_label': 'carton',
        'packaging': [
            ('BOTTLE', '500ML', 16),
            ('CAP', 'NA', 16),
            ('CARTON', 'GRAND', 1),
        ],
        'labels_per_unit': 16,
    },
    'CARTON_1L': {
        'label': 'Carton 1 L (×12)',
        'liters_per_unit': 12.0,         # 12 * 1
        'unit_label': 'carton',
        'packaging': [
            ('BOTTLE', '1L', 12),
            ('CAP', 'NA', 12),
            ('CARTON', 'GRAND', 1),
        ],
        'labels_per_unit': 12,
    },
    'BIDON_5L': {
        'label': 'Bidon 5 L',
        'liters_per_unit': 5.0,
        'unit_label': 'bidon',
        'packaging': [
            ('BIDON', '5L', 1),          # cap included with the bidon
        ],
        'labels_per_unit': 1,
    },
    'IBC_1000': {
        'label': 'IBC 1000 L',
        'liters_per_unit': 1000.0,
        'unit_label': 'IBC',
        'packaging': [],
        'labels_per_unit': 0,
    },
    'VRAC': {
        'label': 'Vrac (litres)',
        'liters_per_unit': 1.0,          # quantity is expressed directly in liters
        'unit_label': 'litre',
        'packaging': [],
        'labels_per_unit': 0,
    },
}

FORMAT_CHOICES = [(key, val['label']) for key, val in FORMATS.items()]

DEFAULT_FORMAT = 'VRAC'


def liters_for(format_key, quantity):
    """Total liters of liquid for `quantity` units of `format_key`."""
    fmt = FORMATS.get(format_key, FORMATS[DEFAULT_FORMAT])
    return fmt['liters_per_unit'] * quantity


def consumption_for(format_key, quantity, alcohol_degree):
    """
    Return the full bill of materials for an order line.

    Returns a list of dicts: {type, size, alcohol_degree, count}
    plus the liquid is handled separately by the caller via liters_for().
    """
    fmt = FORMATS.get(format_key, FORMATS[DEFAULT_FORMAT])
    items = []
    for ptype, size, per_unit in fmt['packaging']:
        items.append({
            'type': ptype,
            'size': size,
            'alcohol_degree': 0,
            'count': per_unit * quantity,
        })
    labels = fmt['labels_per_unit'] * quantity
    if labels:
        items.append({
            'type': 'LABEL',
            'size': 'NA',
            'alcohol_degree': alcohol_degree or 0,
            'count': labels,
        })
    return items
