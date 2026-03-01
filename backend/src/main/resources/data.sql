-- Seed menu items only if the table is empty
-- This prevents duplicate data on repeated restarts

INSERT INTO menu_items (name, description, price, category, available, display_order)
SELECT * FROM (VALUES
    -- Hot Beverages
    ('Velvet Espresso',       'Double shot of our signature dark-roast espresso with silky crema',         3.50,  'HOT_BEVERAGES',   true, 1),
    ('Honey Latte',           'Espresso with steamed whole milk and a swirl of raw wildflower honey',      5.50,  'HOT_BEVERAGES',   true, 2),
    ('Cardamom Cappuccino',   'Classic cappuccino dusted with hand-ground cardamom and cinnamon',          5.00,  'HOT_BEVERAGES',   true, 3),
    ('Spiced Chai Latte',     'House-brewed masala chai with oat milk and a cinnamon stick',               4.75,  'HOT_BEVERAGES',   true, 4),
    ('Flat White',            'Ristretto shots with velvety micro-foam — our most requested drink',        5.25,  'HOT_BEVERAGES',   true, 5),
    -- Cold Beverages
    ('Cold Brew Reserve',     '20-hour cold-steeped Ethiopian Yirgacheffe, served over clear ice',         6.00,  'COLD_BEVERAGES',  true, 6),
    ('Iced Rose Latte',       'Cold espresso, oat milk, and a hint of rose water over ice',                5.75,  'COLD_BEVERAGES',  true, 7),
    ('Mango Lassi Smoothie',  'Alphonso mango blended with yogurt, cardamom, and a mint sprig',            6.50,  'COLD_BEVERAGES',  true, 8),
    ('Sparkling Citrus Tonic','Cold brew concentrate topped with tonic and blood orange slice',             6.25,  'COLD_BEVERAGES',  true, 9),
    -- Pastries
    ('Almond Croissant',      'Twice-baked buttery croissant filled with frangipane and sliced almonds',   4.50,  'PASTRIES',        true, 10),
    ('Brown Butter Kouign',   'Caramelised sugar layered pastry with a crisp shell and tender centre',     5.00,  'PASTRIES',        true, 11),
    ('Matcha Marble Loaf',    'Dense, moist slice of matcha and vanilla swirl loaf cake',                  4.25,  'PASTRIES',        true, 12),
    ('Cardamom Knot',         'Swedish-style knot bun with cardamom, brown sugar, and pearl sugar',        3.75,  'PASTRIES',        true, 13),
    -- Mains
    ('Smashed Avo Toast',     'Sourdough with smashed avocado, poached egg, chilli flakes, and dukkah',    12.50, 'MAINS',           true, 14),
    ('Granola Bowl',          'House granola, coconut yogurt, seasonal fruit, and toasted seeds',           10.50, 'MAINS',           true, 15),
    ('Ricotta Pancakes',      'Three fluffy ricotta pancakes with berry compote and maple cream',           13.50, 'MAINS',           true, 16),
    ('Croque Madame',         'Gruyère and ham toastie topped with béchamel and a fried egg',              14.00, 'MAINS',           true, 17),
    -- Starters
    ('Roasted Tomato Soup',   'Slow-roasted tomato soup with basil oil and sourdough crisp',                6.75,  'STARTERS',        true, 18),
    ('Citrus Salad',          'Seasonal greens, orange segments, fennel, and toasted almonds',              7.25,  'STARTERS',        true, 19),
    -- Desserts
    ('Chocolate Torte',       'Rich flourless chocolate torte with vanilla bean cream',                     6.50,  'DESSERTS',        true, 20),
    ('Rose Panna Cotta',      'Silky panna cotta with rose syrup and pistachio crumble',                    6.25,  'DESSERTS',        true, 21)
) AS v(name, description, price, category, available, display_order)
WHERE NOT EXISTS (SELECT 1 FROM menu_items LIMIT 1);
