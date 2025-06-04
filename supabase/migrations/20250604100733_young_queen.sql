-- Insert initial translations for hero section
WITH hero_section AS (
  SELECT id FROM sections WHERE key = 'hero'
)
INSERT INTO translations (section_id, key, et, en) 
SELECT 
  hero_section.id,
  key,
  et,
  en
FROM hero_section, (VALUES 
  ('title', 'Tere tulemast OÜ Almar Puit kodulehele!', 'Welcome to OÜ Almar Puit!'),
  ('subtitle', 'Kvaliteetsed ja loodussõbralikud puittooted Teie kodule ja ärile.', 'High-quality, eco-friendly wood products for your home and business.'),
  ('cta', 'Tutvu meie toodetega', 'Explore our products')
) AS t(key, et, en);

-- Insert initial translations for about section
WITH about_section AS (
  SELECT id FROM sections WHERE key = 'about'
)
INSERT INTO translations (section_id, key, et, en)
SELECT 
  about_section.id,
  'description',
  'OÜ Almar Puit on 2006. aastal Kagu-Eestis asutatud ettevõte, mis toob looduse lähemale. Pakume keskkonnasõbralikke lahendusi koduaedadele ja puhkealadele ning kvaliteetseid kütte- ja kaminapuid. Meie pühendumus innovatsioonile paistab silma PRIA toetustega, mis on aidanud meil automatiseerida tootmisprotsessi, tagades parima kvaliteedi ja kiire tarne.',
  'Founded in 2006 in Southeast Estonia, OÜ Almar Puit brings nature closer to you. We offer eco-friendly solutions for gardens and recreational areas, alongside premium heating and fireplace wood. Our commitment to innovation shines through PRIA funding, enabling us to automate production for top quality and fast delivery.'
FROM about_section;

-- Insert initial translations for products section
WITH products_section AS (
  SELECT id FROM sections WHERE key = 'products'
)
INSERT INTO translations (section_id, key, et, en)
SELECT 
  products_section.id,
  key,
  et,
  en
FROM products_section, (VALUES 
  ('firewood_title', 'Kaminapuu', 'Fireplace Wood'),
  ('firewood_description', 'Naudi soojust meie aastaringselt kuivatatud kaminapuudega. Pakume 30 cm ja 25 cm kasehalge, pakendatuna 40 l kottidesse või 2 m³ kastidesse – täiuslik valik Sinu kaminasse.', 'Enjoy warmth with our year-round dried fireplace wood. We offer 30 cm and 25 cm birch logs, packaged in 40L bags or 2 m³ crates – the perfect choice for your fireplace.'),
  ('heating_title', 'Küttepuud', 'Heating Wood'),
  ('heating_description', 'Kvaliteetsed küttepuud ahjudele ja pliitidele, kohandatavad Sinu soovitud pikkusele. Garanteerime kuiva puidu kättesaadavuse igal ajal aastas.', 'Premium heating wood for stoves and furnaces, customizable to your desired length. We guarantee dry wood availability year-round.')
) AS t(key, et, en);

-- Insert initial translations for wood purchase section
WITH wood_purchase_section AS (
  SELECT id FROM sections WHERE key = 'wood_purchase'
)
INSERT INTO translations (section_id, key, et, en)
SELECT 
  wood_purchase_section.id,
  key,
  et,
  en
FROM wood_purchase_section, (VALUES 
  ('title', 'Puidu kokkuost', 'Wood Purchase'),
  ('description', 'Otsime usaldusväärseid tarnijaid! Ostame kasepaberipuid, 3 m küttepuud ja piiratud koguses palki. Võta ühendust ja alustame koostööd.', 'We''re looking for reliable suppliers! We purchase birch paper wood, 3 m heating wood, and limited quantities of logs. Contact us to start a partnership.'),
  ('cta', 'Paku oma puitu', 'Offer your wood')
) AS t(key, et, en);

-- Insert initial images
WITH hero_section AS (
  SELECT id FROM sections WHERE key = 'hero'
)
INSERT INTO images (section_id, key, url, alt_text)
SELECT 
  hero_section.id,
  'background',
  'https://images.pexels.com/photos/167699/pexels-photo-167699.jpeg?auto=compress&cs=tinysrgb&w=1600',
  'Forest landscape with sunlight'
FROM hero_section;

WITH products_section AS (
  SELECT id FROM sections WHERE key = 'products'
)
INSERT INTO images (section_id, key, url, alt_text)
SELECT 
  products_section.id,
  key,
  url,
  alt_text
FROM products_section, (VALUES 
  ('firewood', 'https://images.pexels.com/photos/6492397/pexels-photo-6492397.jpeg?auto=compress&cs=tinysrgb&w=1600', 'Stacked fireplace wood'),
  ('heating', 'https://images.pexels.com/photos/5965528/pexels-photo-5965528.jpeg?auto=compress&cs=tinysrgb&w=1600', 'Heating wood pile')
) AS t(key, url, alt_text);