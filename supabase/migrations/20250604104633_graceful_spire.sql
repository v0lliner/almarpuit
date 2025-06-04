/*
  # Create initial sections and content

  1. New Content
    - Insert base sections for all main content areas
    - Add initial translations for Estonian and English
    - Set up default images

  2. Security
    - Ensure RLS policies are in place
    - Grant appropriate access rights
*/

-- Insert base sections if they don't exist
INSERT INTO sections (key)
VALUES 
  ('hero'),
  ('about'),
  ('products'),
  ('woodPurchase'),
  ('contact')
ON CONFLICT (key) DO NOTHING;

-- Get section IDs
DO $$
DECLARE
  hero_id uuid;
  about_id uuid;
  products_id uuid;
  wood_purchase_id uuid;
  contact_id uuid;
BEGIN
  -- Get section IDs
  SELECT id INTO hero_id FROM sections WHERE key = 'hero';
  SELECT id INTO about_id FROM sections WHERE key = 'about';
  SELECT id INTO products_id FROM sections WHERE key = 'products';
  SELECT id INTO wood_purchase_id FROM sections WHERE key = 'woodPurchase';
  SELECT id INTO contact_id FROM sections WHERE key = 'contact';

  -- Insert initial translations
  INSERT INTO translations (section_id, key, et, en)
  VALUES
    -- Hero section
    (hero_id, 'title', 'Tere tulemast OÜ Almar Puit kodulehele!', 'Welcome to OÜ Almar Puit!'),
    (hero_id, 'subtitle', 'Kvaliteetsed ja loodussõbralikud puittooted Teie kodule ja ärile.', 'High-quality, eco-friendly wood products for your home and business.'),
    (hero_id, 'cta', 'Tutvu meie toodetega', 'Explore our products'),

    -- About section
    (about_id, 'title', 'Meist', 'About Us'),
    (about_id, 'content', 'OÜ Almar Puit on 2006. aastal Kagu-Eestis asutatud ettevõte, mis toob looduse lähemale. Pakume keskkonnasõbralikke lahendusi koduaedadele ja puhkealadele ning kvaliteetseid kütte- ja kaminapuid. Meie pühendumus innovatsioonile paistab silma PRIA toetustega, mis on aidanud meil automatiseerida tootmisprotsessi, tagades parima kvaliteedi ja kiire tarne.', 'Founded in 2006 in Southeast Estonia, OÜ Almar Puit brings nature closer to you. We offer eco-friendly solutions for gardens and recreational areas, alongside premium heating and fireplace wood. Our commitment to innovation shines through PRIA funding, enabling us to automate production for top quality and fast delivery.'),

    -- Products section
    (products_id, 'fireplaceWoodTitle', 'Kaminapuu', 'Fireplace Wood'),
    (products_id, 'fireplaceWoodDescription', 'Naudi soojust meie aastaringselt kuivatatud kaminapuudega. Pakume 30 cm ja 25 cm kasehalge, pakendatuna 40 l kottidesse või 2 m³ kastidesse – täiuslik valik Sinu kaminasse.', 'Enjoy warmth with our year-round dried fireplace wood. We offer 30 cm and 25 cm birch logs, packaged in 40L bags or 2 m³ crates – the perfect choice for your fireplace.'),
    (products_id, 'heatingWoodTitle', 'Küttepuud', 'Heating Wood'),
    (products_id, 'heatingWoodDescription', 'Kvaliteetsed küttepuud ahjudele ja pliitidele, kohandatavad Sinu soovitud pikkusele. Garanteerime kuiva puidu kättesaadavuse igal ajal aastas.', 'Premium heating wood for stoves and furnaces, customizable to your desired length. We guarantee dry wood availability year-round.'),

    -- Wood Purchase section
    (wood_purchase_id, 'title', 'Puidu kokkuost', 'Wood Purchase'),
    (wood_purchase_id, 'content', 'Otsime usaldusväärseid tarnijaid! Ostame kasepaberipuid, 3 m küttepuud ja piiratud koguses palki. Võta ühendust ja alustame koostööd.', 'We''re looking for reliable suppliers! We purchase birch paper wood, 3 m heating wood, and limited quantities of logs. Contact us to start a partnership.'),
    (wood_purchase_id, 'cta', 'Paku oma puitu', 'Offer your wood'),

    -- Contact section
    (contact_id, 'businessAddress', 'Tobrokamäe 4, Mikitamäe küla, Mikitamäe vald, Põlvamaa', 'Tobrokamäe 4, Mikitamäe village, Mikitamäe parish, Põlva County'),
    (contact_id, 'legalAddress', 'Kastani 12, Räpina linn, Põlvamaa 64506', 'Kastani  12, Räpina city, Põlva County 64506'),
    (contact_id, 'contact1Name', 'Margus Alver', 'Margus Alver'),
    (contact_id, 'contact1Phone', '+372 51 07 463', '+372 51 07 463'),
    (contact_id, 'contact1Email', 'info@almarpuit.ee', 'info@almarpuit.ee'),
    (contact_id, 'contact2Name', 'Siim Alver', 'Siim Alver'),
    (contact_id, 'contact2Phone', '+372 5330 4845', '+372 5330 4845'),
    (contact_id, 'contact2Email', 'siim@almarpuit.ee', 'siim@almarpuit.ee'),
    (contact_id, 'formLabelName', 'Nimi', 'Name'),
    (contact_id, 'formLabelEmail', 'E-post', 'Email'),
    (contact_id, 'formLabelMessage', 'Sõnum', 'Message'),
    (contact_id, 'formLabelSubmit', 'Saada', 'Send'),
    (contact_id, 'notificationEmail', 'info@almarpuit.ee', 'info@almarpuit.ee')
  ON CONFLICT (section_id, key) DO NOTHING;

  -- Insert initial images
  INSERT INTO images (section_id, key, url, alt_text)
  VALUES
    (hero_id, 'background', 'https://images.pexels.com/photos/167699/pexels-photo-167699.jpeg?auto=compress&cs=tinysrgb&w=1600', 'Forest landscape with trees'),
    (about_id, 'background', 'https://images.pexels.com/photos/129733/pexels-photo-129733.jpeg?auto=compress&cs=tinysrgb&w=1600', 'Wood processing facility'),
    (products_id, 'fireplaceWoodImage', 'https://images.pexels.com/photos/6492397/pexels-photo-6492397.jpeg?auto=compress&cs=tinysrgb&w=1600', 'Stacked fireplace wood'),
    (products_id, 'heatingWoodImage', 'https://images.pexels.com/photos/5965528/pexels-photo-5965528.jpeg?auto=compress&cs=tinysrgb&w=1600', 'Heating wood pile')
  ON CONFLICT (section_id, key) DO NOTHING;
END $$;