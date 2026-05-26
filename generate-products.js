/**
 * Generates 100 realistic products and appends them to server/db.json
 * Images use Picsum Photos (stable, no auth needed): https://picsum.photos/seed/X/400/400
 * Run: node generate-products.js
 */

const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'server', 'db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

const randId = () => Math.random().toString(36).slice(2, 9);
const pick   = (arr) => arr[Math.floor(Math.random() * arr.length)];
const range  = (min, max) => +(Math.random() * (max - min) + min).toFixed(2);
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Picsum stable seeds per category keyword
const img = (seed, w = 400, h = 400) =>
   `https://picsum.photos/seed/${seed}/${w}/${h}`;

// ── Product catalogue ─────────────────────────────────────────────────────────

const products = [

   // ═══ ELECTRONICS ═══
   { name: 'Sony WH-1000XM5 Headphones', price: 349.99, category: ['Electronics', 'Audio'],
     description: 'Industry-leading noise cancellation with 30-hour battery life, multipoint connection and crystal-clear hands-free calling.',
     imgs: [img('headphones1'), img('headphones2'), img('headphones3')], inventory: 42, discount: 0.10, currency: 'USD' },

   { name: 'Apple AirPods Pro 2nd Gen', price: 249.00, category: ['Electronics', 'Audio'],
     description: 'Active Noise Cancellation, Adaptive Transparency, Personalised Spatial Audio with head tracking.',
     imgs: [img('airpods1'), img('airpods2')], inventory: 85, discount: 0, currency: 'USD' },

   { name: 'Samsung 55" 4K QLED Smart TV', price: 799.00, category: ['Electronics', 'TV'],
     description: 'Quantum Dot technology for bold, brilliant colors. 120Hz refresh rate, HDR10+, built-in Alexa.',
     imgs: [img('tv1'), img('tv2'), img('tv3')], inventory: 18, discount: 0.15, currency: 'USD' },

   { name: 'MacBook Air M2 13"', price: 1099.00, category: ['Electronics', 'Laptops'],
     description: 'Apple M2 chip, 8GB RAM, 256GB SSD. Up to 18 hours battery. Fanless design, MagSafe charging.',
     imgs: [img('macbook1'), img('macbook2')], inventory: 31, discount: 0, currency: 'USD' },

   { name: 'iPad Pro 12.9" Wi-Fi 256GB', price: 1099.00, category: ['Electronics', 'Tablets'],
     description: 'Apple M2 chip, Liquid Retina XDR display, ProMotion 120Hz, USB-C with Thunderbolt.',
     imgs: [img('ipad1'), img('ipad2')], inventory: 24, discount: 0.05, currency: 'USD' },

   { name: 'Logitech G502 X Gaming Mouse', price: 89.99, category: ['Electronics', 'Gaming'],
     description: 'LIGHTFORCE hybrid optical-mechanical primary switches, HERO 25K sensor, 13 programmable buttons.',
     imgs: [img('mouse1'), img('mouse2')], inventory: 67, discount: 0, currency: 'USD' },

   { name: 'Keychron K8 Mechanical Keyboard', price: 74.99, category: ['Electronics', 'Keyboards'],
     description: 'Tenkeyless layout, hot-swappable switches, RGB backlight, compatible with Mac and Windows.',
     imgs: [img('keyboard1'), img('keyboard2')], inventory: 53, discount: 0.10, currency: 'USD',
     variants: ['switch:Red', 'switch:Brown', 'switch:Blue'] },

   { name: 'Logitech C920 Webcam HD', price: 69.99, category: ['Electronics', 'Webcams'],
     description: 'Full HD 1080p at 30fps, built-in dual stereo microphones, autofocus, works with Zoom & Teams.',
     imgs: [img('webcam1'), img('webcam2')], inventory: 39, discount: 0.15, currency: 'USD' },

   { name: 'Anker 7-in-1 USB-C Hub', price: 35.99, category: ['Electronics', 'Accessories'],
     description: '4K HDMI, 100W Power Delivery, 5Gbps USB-A data ports, SD & microSD card reader.',
     imgs: [img('hub1'), img('hub2')], inventory: 120, discount: 0.20, currency: 'USD' },

   { name: 'Apple Watch Series 9 GPS 45mm', price: 429.00, category: ['Electronics', 'Wearables'],
     description: 'S9 SiP chip, Double Tap gesture, Always-On Retina display, blood oxygen, ECG, crash detection.',
     imgs: [img('watch1'), img('watch2')], inventory: 44, discount: 0, currency: 'USD',
     variants: ['color:Midnight', 'color:Starlight', 'color:Pink', 'color:Red'] },

   { name: 'JBL Charge 5 Bluetooth Speaker', price: 179.95, category: ['Electronics', 'Audio'],
     description: 'IP67 waterproof, 20 hours playtime, built-in powerbank, JBL Pro Sound.',
     imgs: [img('speaker1'), img('speaker2')], inventory: 58, discount: 0.10, currency: 'USD',
     variants: ['color:Black', 'color:Blue', 'color:Red', 'color:Squad'] },

   { name: 'Kindle Paperwhite 16GB', price: 139.99, category: ['Electronics', 'E-readers'],
     description: '6.8" glare-free display, adjustable warm light, IPX8 waterproof, 12-week battery life.',
     imgs: [img('kindle1'), img('kindle2')], inventory: 76, discount: 0.05, currency: 'USD' },

   { name: 'Samsung T7 Portable SSD 1TB', price: 89.99, category: ['Electronics', 'Storage'],
     description: 'USB 3.2 Gen 2, up to 1,050 MB/s read speed, military-grade shock resistance.',
     imgs: [img('ssd1'), img('ssd2')], inventory: 94, discount: 0, currency: 'USD' },

   { name: 'Anker 737 Power Bank 24000mAh', price: 79.99, category: ['Electronics', 'Accessories'],
     description: '140W max output, charges MacBook Pro at full speed, digital display, three simultaneous charges.',
     imgs: [img('powerbank1'), img('powerbank2')], inventory: 61, discount: 0.20, currency: 'USD' },

   { name: 'DJI Mini 3 Pro Drone', price: 759.00, category: ['Electronics', 'Drones'],
     description: '4K/60fps video, 48MP photo, tri-directional obstacle sensing, 34-min flight time.',
     imgs: [img('drone1'), img('drone2')], inventory: 15, discount: 0, currency: 'USD' },

   { name: 'Sony PlayStation 5 Controller DualSense', price: 69.99, category: ['Electronics', 'Gaming'],
     description: 'Haptic feedback, adaptive triggers, built-in microphone, USB-C charging.',
     imgs: [img('controller1'), img('controller2')], inventory: 88, discount: 0, currency: 'USD',
     variants: ['color:White', 'color:Midnight Black', 'color:Cosmic Red'] },

   { name: 'ASUS ROG Gaming Headset 7.1', price: 99.99, category: ['Electronics', 'Gaming', 'Audio'],
     description: 'Virtual 7.1 surround sound, 50mm drivers, retractable microphone, USB connection.',
     imgs: [img('headset1'), img('headset2')], inventory: 47, discount: 0.15, currency: 'USD' },

   { name: 'Elgato Stream Deck MK.2', price: 149.99, category: ['Electronics', 'Streaming'],
     description: '15 customizable LCD keys, drag-and-drop interface, works with OBS, Twitch, YouTube.',
     imgs: [img('streamdeck1'), img('streamdeck2')], inventory: 33, discount: 0, currency: 'USD' },

   { name: 'LED Ring Light 18" with Tripod', price: 49.99, category: ['Electronics', 'Photography'],
     description: '3 light modes, 10 brightness levels, phone holder, ideal for streaming, TikTok, makeup.',
     imgs: [img('ringlight1'), img('ringlight2')], inventory: 72, discount: 0.25, currency: 'USD' },

   { name: 'Sony Alpha a7 IV Mirrorless Camera', price: 2499.00, category: ['Electronics', 'Photography'],
     description: '33MP full-frame sensor, 4K 60fps video, real-time AF, 5-axis stabilization, 759 phase-detect points.',
     imgs: [img('camera1'), img('camera2'), img('camera3')], inventory: 8, discount: 0, currency: 'USD' },

   // ═══ CLOTHING & ACCESSORIES ═══
   { name: 'Men\'s Slim-Fit Denim Jeans', price: 59.99, category: ['Clothing', 'Men'],
     description: 'Premium stretch denim, slim fit through seat and thigh, tapered leg. Machine washable.',
     imgs: [img('jeans1'), img('jeans2')], inventory: 130, discount: 0, currency: 'USD',
     variants: ['size:28', 'size:30', 'size:32', 'size:34', 'color:Blue', 'color:Black', 'color:Grey'] },

   { name: 'Women\'s Puffer Winter Coat', price: 129.99, category: ['Clothing', 'Women'],
     description: 'Warm recycled polyester fill, water-resistant shell, detachable hood, multiple pockets.',
     imgs: [img('coat1'), img('coat2')], inventory: 55, discount: 0.20, currency: 'USD',
     variants: ['size:XS', 'size:S', 'size:M', 'size:L', 'size:XL', 'color:Black', 'color:Navy', 'color:Beige'] },

   { name: 'Nike Air Max 270 Running Shoes', price: 149.99, category: ['Clothing', 'Footwear'],
     description: 'Max Air unit in the heel, engineered mesh upper, foam midsole for lightweight cushioning.',
     imgs: [img('shoes1'), img('shoes2'), img('shoes3')], inventory: 200, discount: 0.10, currency: 'USD',
     variants: ['size:6', 'size:7', 'size:8', 'size:9', 'size:10', 'size:11', 'size:12', 'color:Black', 'color:White', 'color:Red'] },

   { name: 'Men\'s Merino Wool Crew Sweater', price: 79.99, category: ['Clothing', 'Men'],
     description: '100% extra-fine merino wool, temperature regulating, naturally odor-resistant, slim fit.',
     imgs: [img('sweater1'), img('sweater2')], inventory: 68, discount: 0, currency: 'USD',
     variants: ['size:S', 'size:M', 'size:L', 'size:XL', 'color:Navy', 'color:Charcoal', 'color:Burgundy'] },

   { name: 'Women\'s High-Waist Yoga Leggings', price: 54.99, category: ['Clothing', 'Women', 'Sports'],
     description: 'Squat-proof 4-way stretch fabric, hidden waistband pocket, moisture-wicking, 25" inseam.',
     imgs: [img('leggings1'), img('leggings2')], inventory: 175, discount: 0.15, currency: 'USD',
     variants: ['size:XS', 'size:S', 'size:M', 'size:L', 'size:XL', 'color:Black', 'color:Navy', 'color:Charcoal'] },

   { name: 'Classic Canvas Backpack 30L', price: 49.99, category: ['Accessories', 'Bags'],
     description: 'Waxed canvas, leather trim, padded laptop compartment fits 15", multiple organizer pockets.',
     imgs: [img('backpack1'), img('backpack2')], inventory: 89, discount: 0, currency: 'USD',
     variants: ['color:Brown', 'color:Navy', 'color:Olive'] },

   { name: 'Minimalist Leather Bifold Wallet', price: 34.99, category: ['Accessories'],
     description: 'Full-grain genuine leather, RFID blocking, holds up to 8 cards + cash, ultra-thin 6mm profile.',
     imgs: [img('wallet1'), img('wallet2')], inventory: 144, discount: 0, currency: 'USD',
     variants: ['color:Black', 'color:Brown', 'color:Tan'] },

   { name: 'Polarized Aviator Sunglasses', price: 29.99, category: ['Accessories', 'Eyewear'],
     description: 'UV400 protection, lightweight aluminum frame, polarized lenses reduce glare 99%.',
     imgs: [img('sunglasses1'), img('sunglasses2')], inventory: 210, discount: 0.30, currency: 'USD',
     variants: ['color:Gold/Brown', 'color:Silver/Grey', 'color:Black/Green'] },

   { name: 'Women\'s Crossbody Leather Bag', price: 89.99, category: ['Accessories', 'Bags'],
     description: 'Genuine pebbled leather, adjustable strap, gold hardware, zip closure, lined interior.',
     imgs: [img('crossbody1'), img('crossbody2')], inventory: 43, discount: 0, currency: 'USD',
     variants: ['color:Black', 'color:Tan', 'color:Burgundy'] },

   { name: 'Men\'s Chelsea Boots', price: 119.99, category: ['Clothing', 'Footwear', 'Men'],
     description: 'Full-grain leather upper, elastic side panels, leather lining, rubber lug sole.',
     imgs: [img('boots1'), img('boots2')], inventory: 37, discount: 0, currency: 'USD',
     variants: ['size:8', 'size:9', 'size:10', 'size:11', 'size:12', 'color:Black', 'color:Brown'] },

   { name: 'Adidas Ultraboost 23 Sneakers', price: 189.99, category: ['Clothing', 'Footwear'],
     description: 'Continental rubber outsole, Primeknit+ upper, BOOST midsole cushioning, torsion system.',
     imgs: [img('sneakers1'), img('sneakers2')], inventory: 115, discount: 0.10, currency: 'USD',
     variants: ['size:6', 'size:7', 'size:8', 'size:9', 'size:10', 'size:11'] },

   { name: 'Unisex Baseball Cap', price: 19.99, category: ['Accessories', 'Clothing'],
     description: 'Embroidered logo, adjustable snapback, 100% cotton, structured 6-panel design.',
     imgs: [img('cap1'), img('cap2')], inventory: 280, discount: 0, currency: 'USD',
     variants: ['color:Black', 'color:White', 'color:Navy', 'color:Red'] },

   { name: 'Men\'s Slim Fit Polo Shirt', price: 39.99, category: ['Clothing', 'Men'],
     description: '100% pima cotton, flatlock seaming, moisture-wicking, machine washable. Available in 8 colors.',
     imgs: [img('polo1'), img('polo2')], inventory: 160, discount: 0, currency: 'USD',
     variants: ['size:S', 'size:M', 'size:L', 'size:XL', 'size:XXL', 'color:White', 'color:Black', 'color:Navy'] },

   { name: 'Cashmere Blend Scarf', price: 44.99, category: ['Accessories', 'Clothing'],
     description: '70% cashmere 30% wool, fringed ends, 70" × 12", naturally soft and warm.',
     imgs: [img('scarf1'), img('scarf2')], inventory: 92, discount: 0.20, currency: 'USD',
     variants: ['color:Camel', 'color:Grey', 'color:Burgundy', 'color:Navy'] },

   { name: 'Leather Belt Men\'s', price: 29.99, category: ['Accessories', 'Men'],
     description: 'Full-grain leather, single prong buckle, 1.5" wide, hand-stitched edges. Sizes 30-44.',
     imgs: [img('belt1'), img('belt2')], inventory: 185, discount: 0, currency: 'USD',
     variants: ['color:Black', 'color:Brown', 'color:Tan'] },

   // ═══ HOME & GARDEN ═══
   { name: 'Breville Barista Express Espresso', price: 699.99, category: ['Home', 'Kitchen', 'Coffee'],
     description: 'Integrated conical burr grinder, 15-bar Italian pump, dose control grinding, steam wand.',
     imgs: [img('espresso1'), img('espresso2'), img('espresso3')], inventory: 22, discount: 0, currency: 'USD' },

   { name: 'Dyson V15 Detect Cordless Vacuum', price: 749.99, category: ['Home', 'Appliances'],
     description: 'Laser dust detection, LCD screen shows particle count, up to 60 min runtime, HEPA filtration.',
     imgs: [img('vacuum1'), img('vacuum2')], inventory: 19, discount: 0.10, currency: 'USD' },

   { name: 'Levoit Core 400S Air Purifier', price: 199.99, category: ['Home', 'Appliances'],
     description: 'H13 True HEPA filter, covers 403 sq ft, smart Wi-Fi control, ultra-quiet sleep mode.',
     imgs: [img('purifier1'), img('purifier2')], inventory: 48, discount: 0.15, currency: 'USD' },

   { name: 'Philips Hue Smart Bulbs 4-Pack', price: 49.99, category: ['Home', 'Smart Home'],
     description: '16 million colors, 800 lumen, works with Alexa/Google/Apple HomeKit, no hub required.',
     imgs: [img('bulbs1'), img('bulbs2')], inventory: 134, discount: 0, currency: 'USD' },

   { name: 'Lodge Cast Iron Skillet 12"', price: 44.99, category: ['Home', 'Kitchen'],
     description: 'Pre-seasoned with 100% natural vegetable oil, works on all heat sources including induction.',
     imgs: [img('skillet1'), img('skillet2')], inventory: 78, discount: 0, currency: 'USD' },

   { name: 'Cozy Throw Blanket 50"×60"', price: 34.99, category: ['Home', 'Bedding'],
     description: 'Ultra-soft sherpa fleece, machine washable, perfect for sofa or bed, 6 color options.',
     imgs: [img('blanket1'), img('blanket2')], inventory: 203, discount: 0.15, currency: 'USD',
     variants: ['color:Grey', 'color:Beige', 'color:Navy', 'color:Blush'] },

   { name: 'Decorative Throw Pillow Set (2 pcs)', price: 27.99, category: ['Home', 'Decor'],
     description: 'Velvet cover, hidden zipper, removable insert, 18"×18". Mix and match colors.',
     imgs: [img('pillows1'), img('pillows2')], inventory: 156, discount: 0, currency: 'USD',
     variants: ['color:Mustard', 'color:Sage', 'color:Terracotta', 'color:Navy'] },

   { name: 'Bamboo Cutting Board Set (3 pcs)', price: 39.99, category: ['Home', 'Kitchen'],
     description: 'Organic bamboo, juice grooves, non-slip rubber feet, easy-grip handle. Dishwasher safe.',
     imgs: [img('cuttingboard1'), img('cuttingboard2')], inventory: 97, discount: 0.20, currency: 'USD' },

   { name: 'iRobot Roomba j7+ Robot Vacuum', price: 649.99, category: ['Home', 'Appliances', 'Smart Home'],
     description: 'Smart mapping, avoids pet waste, self-emptying base, compatible with Alexa & Google.',
     imgs: [img('roomba1'), img('roomba2')], inventory: 14, discount: 0, currency: 'USD' },

   { name: 'Scented Soy Candle Set (4 pcs)', price: 32.99, category: ['Home', 'Decor'],
     description: 'Hand-poured soy wax, cotton wick, 40-50 hour burn time per candle. Assorted fragrances.',
     imgs: [img('candles1'), img('candles2')], inventory: 167, discount: 0.10, currency: 'USD' },

   { name: 'Abstract Canvas Wall Art 3-Panel', price: 79.99, category: ['Home', 'Decor', 'Art'],
     description: 'Gallery-wrapped canvas, ready to hang, UV-resistant ink, 60"×30" total. Free shipping.',
     imgs: [img('wallart1'), img('wallart2')], inventory: 61, discount: 0, currency: 'USD' },

   { name: 'Egyptian Cotton Bath Towel Set (6 pcs)', price: 54.99, category: ['Home', 'Bath'],
     description: '600 GSM long-staple Egyptian cotton, 2 bath + 2 hand + 2 face towels, quick-dry.',
     imgs: [img('towels1'), img('towels2')], inventory: 88, discount: 0.25, currency: 'USD',
     variants: ['color:White', 'color:Grey', 'color:Navy', 'color:Sage'] },

   { name: 'Non-Stick Cookware Set 10-Piece', price: 149.99, category: ['Home', 'Kitchen'],
     description: 'Ceramic-coated aluminum, PFOA-free, dishwasher safe, compatible with all cooktops.',
     imgs: [img('cookware1'), img('cookware2'), img('cookware3')], inventory: 36, discount: 0.30, currency: 'USD' },

   { name: 'Monstera Deliciosa Indoor Plant', price: 29.99, category: ['Home', 'Plants', 'Garden'],
     description: 'Tropical split-leaf philodendron, 4" pot, low maintenance, air-purifying. Ships in nursery pot.',
     imgs: [img('plant1'), img('plant2')], inventory: 45, discount: 0, currency: 'USD' },

   { name: 'Coffee Table Modern Oval', price: 249.99, category: ['Home', 'Furniture'],
     description: 'Solid oak legs, tempered glass top, Scandinavian design, 47"×24". Easy assembly.',
     imgs: [img('coffeetable1'), img('coffeetable2')], inventory: 12, discount: 0, currency: 'USD' },

   // ═══ SPORTS & FITNESS ═══
   { name: 'Manduka PRO Yoga Mat 6mm', price: 120.00, category: ['Sports', 'Yoga'],
     description: 'High-density cushion, lifetime guarantee, closed-cell surface prevents bacteria, non-slip.',
     imgs: [img('yogamat1'), img('yogamat2')], inventory: 73, discount: 0, currency: 'USD',
     variants: ['color:Black', 'color:Deep Sea', 'color:Verve', 'color:Chakra'] },

   { name: 'Bowflex SelectTech Adjustable Dumbbells', price: 399.00, category: ['Sports', 'Fitness'],
     description: 'Replaces 15 sets of weights, 5 to 52.5 lbs, dial system adjusts in 2.5 lb increments.',
     imgs: [img('dumbbells1'), img('dumbbells2')], inventory: 21, discount: 0.10, currency: 'USD' },

   { name: 'Resistance Bands Set (5 bands)', price: 24.99, category: ['Sports', 'Fitness'],
     description: 'Natural latex, 10-50 lb resistance levels, stackable, comes with door anchor, handles, ankle straps.',
     imgs: [img('bands1'), img('bands2')], inventory: 189, discount: 0.15, currency: 'USD' },

   { name: 'Hydro Flask 32oz Water Bottle', price: 49.95, category: ['Sports', 'Hydration'],
     description: 'TempShield double-wall vacuum insulation, keeps cold 24h / hot 12h, leakproof Flex Cap.',
     imgs: [img('bottle1'), img('bottle2')], inventory: 240, discount: 0, currency: 'USD',
     variants: ['color:Black', 'color:Pacific', 'color:Flamingo', 'color:Stainless'] },

   { name: 'TRX All-in-One Suspension Trainer', price: 109.95, category: ['Sports', 'Fitness'],
     description: '300+ exercises using your bodyweight, supports up to 350 lbs, door anchor included.',
     imgs: [img('trx1'), img('trx2')], inventory: 56, discount: 0, currency: 'USD' },

   { name: 'YETI Rambler 20oz Tumbler', price: 34.99, category: ['Sports', 'Outdoors'],
     description: 'Double-wall vacuum insulation, dishwasher safe 18/8 stainless steel, MagSlider lid.',
     imgs: [img('tumbler1'), img('tumbler2')], inventory: 178, discount: 0, currency: 'USD',
     variants: ['color:Black', 'color:Navy', 'color:White', 'color:Seafoam'] },

   { name: 'Jump Rope Speed Pro', price: 19.99, category: ['Sports', 'Fitness'],
     description: 'Adjustable lightweight aluminum handles, 10-bearing system for ultra-fast rotation, PVC cable.',
     imgs: [img('jumprope1'), img('jumprope2')], inventory: 213, discount: 0.20, currency: 'USD' },

   { name: 'TriggerPoint GRID Foam Roller', price: 36.99, category: ['Sports', 'Recovery'],
     description: 'Multi-density exterior, solid core, can support up to 500 lbs, 13"×5.5".',
     imgs: [img('foamroller1'), img('foamroller2')], inventory: 104, discount: 0, currency: 'USD' },

   { name: 'Garmin Forerunner 265 GPS Watch', price: 449.99, category: ['Sports', 'Wearables', 'Electronics'],
     description: 'AMOLED display, training readiness, race predictor, 13-day battery in smartwatch mode.',
     imgs: [img('garmin1'), img('garmin2')], inventory: 29, discount: 0, currency: 'USD',
     variants: ['color:Black', 'color:Light Blue', 'color:White'] },

   { name: 'Spalding NBA Basketball Size 7', price: 39.99, category: ['Sports', 'Basketball'],
     description: 'Official NBA game ball, full-grain leather composite, wide channel design, indoor/outdoor.',
     imgs: [img('basketball1'), img('basketball2')], inventory: 87, discount: 0, currency: 'USD' },

   { name: 'Head Speed MP Tennis Racket', price: 229.99, category: ['Sports', 'Tennis'],
     description: '100 sq in head, Graphene 360+, spin-optimized string pattern, for intermediate to advanced.',
     imgs: [img('racket1'), img('racket2')], inventory: 34, discount: 0.15, currency: 'USD' },

   { name: 'Nike Dri-FIT Training Gloves', price: 24.99, category: ['Sports', 'Fitness'],
     description: 'Silicone grip pattern, wrist wrap closure, Dri-FIT technology wicks sweat.',
     imgs: [img('gloves1'), img('gloves2')], inventory: 145, discount: 0, currency: 'USD',
     variants: ['size:S', 'size:M', 'size:L', 'size:XL'] },

   { name: 'Osprey Daylite Plus 20L Daypack', price: 75.00, category: ['Sports', 'Outdoors', 'Bags'],
     description: 'Ventilated back panel, sleeve fits 15" laptop, top and front zip pockets, hydration compatible.',
     imgs: [img('daypack1'), img('daypack2')], inventory: 62, discount: 0, currency: 'USD',
     variants: ['color:Black', 'color:Cave Green', 'color:Stonewash'] },

   // ═══ BEAUTY & HEALTH ═══
   { name: 'TrueOcean Vitamin C Serum 30ml', price: 34.99, category: ['Beauty', 'Skincare'],
     description: '20% Vitamin C, Hyaluronic Acid & Vitamin E complex. Brightens skin, reduces dark spots.',
     imgs: [img('serum1'), img('serum2')], inventory: 156, discount: 0.10, currency: 'USD' },

   { name: 'CeraVe Moisturizing Cream 19oz', price: 22.99, category: ['Beauty', 'Skincare'],
     description: 'Ceramides 1, 3, 6-II + hyaluronic acid. Non-comedogenic, fragrance-free, accepted by NPF.',
     imgs: [img('cream1'), img('cream2')], inventory: 220, discount: 0, currency: 'USD' },

   { name: 'Oral-B iO Series 9 Electric Toothbrush', price: 249.99, category: ['Beauty', 'Oral Care'],
     description: '7 smart modes, AI recognition, pressure sensor, 3D teeth tracking app. 14-day battery.',
     imgs: [img('toothbrush1'), img('toothbrush2')], inventory: 41, discount: 0.20, currency: 'USD',
     variants: ['color:Black', 'color:White', 'color:Rose'] },

   { name: 'Dyson Supersonic Hair Dryer', price: 429.99, category: ['Beauty', 'Hair Care'],
     description: 'Digital motor V9, magnetic attachments, intelligent heat control, 1600W, 3 speed settings.',
     imgs: [img('hairdryer1'), img('hairdryer2')], inventory: 27, discount: 0, currency: 'USD',
     variants: ['color:Black/Nickel', 'color:Fuchsia/Nickel', 'color:Copper/Nickel'] },

   { name: 'DIOR Sauvage Eau de Parfum 100ml', price: 144.00, category: ['Beauty', 'Fragrance'],
     description: 'Fresh and raw masculinity. Notes of Ambroxan with bergamot from Calabria. Long lasting.',
     imgs: [img('perfume1'), img('perfume2')], inventory: 53, discount: 0, currency: 'USD' },

   { name: 'La Roche-Posay SPF 50 Sunscreen 3oz', price: 19.99, category: ['Beauty', 'Skincare'],
     description: 'Ultra-light fluid, non-greasy, tested on sensitive skin, Mexoryl XL UVA/UVB protection.',
     imgs: [img('sunscreen1'), img('sunscreen2')], inventory: 198, discount: 0, currency: 'USD' },

   { name: 'Philips OneBlade Pro Trimmer', price: 69.99, category: ['Beauty', 'Grooming'],
     description: 'Trim, edge and shave any length of hair, 360 blade for precise lines, 90 min runtime.',
     imgs: [img('trimmer1'), img('trimmer2')], inventory: 84, discount: 0.15, currency: 'USD' },

   { name: 'PURA D\'OR Biotin Shampoo 16oz', price: 21.99, category: ['Beauty', 'Hair Care'],
     description: 'DHT blocker, 17+ active ingredients, argan oil, clinically tested for hair thinning.',
     imgs: [img('shampoo1'), img('shampoo2')], inventory: 112, discount: 0.10, currency: 'USD' },

   { name: 'Neutrogena Collagen Eye Cream', price: 12.99, category: ['Beauty', 'Skincare'],
     description: 'Collagen moisturizing formula, reduces look of fine lines and wrinkles, fragrance-free.',
     imgs: [img('eyecream1'), img('eyecream2')], inventory: 234, discount: 0, currency: 'USD' },

   { name: 'InnoGear Essential Oil Diffuser 500ml', price: 29.99, category: ['Beauty', 'Wellness', 'Home'],
     description: '7 LED colors, auto shut-off, covers 430 sq ft, quiet ultrasonic technology.',
     imgs: [img('diffuser1'), img('diffuser2')], inventory: 128, discount: 0.15, currency: 'USD' },

   // ═══ BOOKS ═══
   { name: 'Atomic Habits — James Clear', price: 16.99, category: ['Books', 'Self-Development'],
     description: 'An Easy & Proven Way to Build Good Habits & Break Bad Ones. #1 NYT Bestseller.',
     imgs: [img('book1'), img('book2')], inventory: 300, discount: 0, currency: 'USD' },

   { name: 'Deep Work — Cal Newport', price: 14.99, category: ['Books', 'Productivity'],
     description: 'Rules for Focused Success in a Distracted World. Learn how to produce at your peak level.',
     imgs: [img('book3'), img('book4')], inventory: 245, discount: 0, currency: 'USD' },

   { name: 'The Psychology of Money — Morgan Housel', price: 15.99, category: ['Books', 'Finance'],
     description: 'Timeless lessons on wealth, greed, and happiness. 19 short stories exploring people\'s relationship with money.',
     imgs: [img('book5'), img('book6')], inventory: 289, discount: 0, currency: 'USD' },

   { name: 'Dune — Frank Herbert', price: 12.99, category: ['Books', 'Sci-Fi'],
     description: 'The greatest science fiction novel ever written. Set in the distant future amid a feudal interstellar society.',
     imgs: [img('book7'), img('book8')], inventory: 178, discount: 0.10, currency: 'USD' },

   { name: 'Clean Code — Robert C. Martin', price: 34.99, category: ['Books', 'Programming'],
     description: 'A Handbook of Agile Software Craftsmanship. Essential reading for every software developer.',
     imgs: [img('book9'), img('book10')], inventory: 134, discount: 0, currency: 'USD' },

   { name: 'Thinking, Fast and Slow — Daniel Kahneman', price: 14.99, category: ['Books', 'Psychology'],
     description: 'Nobel Prize winner explores the two systems that drive the way we think — fast, intuitive and slow, deliberate.',
     imgs: [img('book11'), img('book12')], inventory: 201, discount: 0, currency: 'USD' },

   { name: 'The Pragmatic Programmer 20th Anniversary', price: 49.99, category: ['Books', 'Programming'],
     description: 'Your journey to mastery. Updated for modern software development practices and new technologies.',
     imgs: [img('book13'), img('book14')], inventory: 87, discount: 0, currency: 'USD' },

   { name: '1984 — George Orwell', price: 9.99, category: ['Books', 'Classics', 'Fiction'],
     description: 'The dystopian social science fiction novel and cautionary tale about the dangers of totalitarianism.',
     imgs: [img('book15'), img('book16')], inventory: 320, discount: 0, currency: 'USD' },

   { name: 'Rich Dad Poor Dad — Robert Kiyosaki', price: 13.99, category: ['Books', 'Finance'],
     description: 'What the Rich Teach Their Kids About Money That the Poor and Middle Class Do Not.',
     imgs: [img('book17'), img('book18')], inventory: 265, discount: 0.05, currency: 'USD' },

   { name: 'System Design Interview — Alex Xu', price: 39.99, category: ['Books', 'Programming'],
     description: 'An insider\'s guide to system design questions. Real interview questions from top tech companies.',
     imgs: [img('book19'), img('book20')], inventory: 112, discount: 0, currency: 'USD' },

   // ═══ KITCHEN & APPLIANCES ═══
   { name: 'Instant Pot Duo 7-in-1 6 Quart', price: 99.95, category: ['Kitchen', 'Appliances'],
     description: 'Pressure cooker, slow cooker, rice cooker, steamer, sauté, yogurt maker, warmer. 13 one-touch programs.',
     imgs: [img('instantpot1'), img('instantpot2')], inventory: 77, discount: 0.20, currency: 'USD' },

   { name: 'Ninja AF150AMZ Air Fryer 5.5 Qt', price: 129.99, category: ['Kitchen', 'Appliances'],
     description: 'Up to 75% less fat, 4 functions: air fry, roast, reheat, dehydrate. 5.5 Qt ceramic-coated basket.',
     imgs: [img('airfryer1'), img('airfryer2')], inventory: 58, discount: 0.15, currency: 'USD' },

   { name: 'KitchenAid Artisan Stand Mixer 5 Qt', price: 449.99, category: ['Kitchen', 'Appliances'],
     description: '10 speeds, tilt-head design, 59-point planetary mixing action, includes bowl, whisk, hook, paddle.',
     imgs: [img('mixer1'), img('mixer2')], inventory: 18, discount: 0, currency: 'USD',
     variants: ['color:Empire Red', 'color:Matte Black', 'color:Ice Blue', 'color:Contour Silver'] },

   { name: 'Cuisinart 14-Cup Food Processor', price: 179.99, category: ['Kitchen', 'Appliances'],
     description: '720W motor, 14-cup work bowl, stainless steel blade, dough blade, disc for slicing/shredding.',
     imgs: [img('foodprocessor1'), img('foodprocessor2')], inventory: 35, discount: 0.10, currency: 'USD' },

   { name: 'Wüsthof Classic Chef\'s Knife 8"', price: 149.99, category: ['Kitchen', 'Knives'],
     description: 'High-carbon stainless steel, precision forged, full tang, triple riveted handle. Made in Germany.',
     imgs: [img('knife1'), img('knife2')], inventory: 61, discount: 0, currency: 'USD' },

   { name: 'Nespresso Vertuo Next Coffee Maker', price: 159.99, category: ['Kitchen', 'Coffee'],
     description: 'Centrifusion extraction, 5 cup sizes, 30-second heat up, automatic capsule ejection.',
     imgs: [img('nespresso1'), img('nespresso2')], inventory: 43, discount: 0.25, currency: 'USD',
     variants: ['color:Black', 'color:White', 'color:Red'] },

   { name: 'Fellow Stagg EKG Electric Kettle', price: 165.00, category: ['Kitchen', 'Coffee'],
     description: 'Variable temperature 135-212°F, PID controller, 60-min hold mode, 0.9L capacity.',
     imgs: [img('kettle1'), img('kettle2')], inventory: 29, discount: 0, currency: 'USD',
     variants: ['color:Matte Black', 'color:Polished Steel', 'color:Stone Blue'] },

   { name: 'OXO Good Grips Salad Spinner', price: 34.99, category: ['Kitchen', 'Tools'],
     description: 'Non-slip base, pump and brake mechanism, clear bowl doubles as serving bowl, BPA-free.',
     imgs: [img('spinner1'), img('spinner2')], inventory: 93, discount: 0, currency: 'USD' },

   { name: 'Vitamix E310 Explorian Blender', price: 349.95, category: ['Kitchen', 'Appliances'],
     description: '10 variable speeds, 48 oz container, self-cleaning in 60 seconds, pulse feature, 5-year warranty.',
     imgs: [img('blender1'), img('blender2')], inventory: 24, discount: 0, currency: 'USD',
     variants: ['color:Black', 'color:White', 'color:Red'] },

   { name: 'Zojirushi Rice Cooker & Warmer 5.5 Cup', price: 149.99, category: ['Kitchen', 'Appliances'],
     description: 'Micom fuzzy logic technology, spherical inner pan, multiple settings: white, sushi, porridge, steam.',
     imgs: [img('ricecooker1'), img('ricecooker2')], inventory: 46, discount: 0.10, currency: 'USD' },

   // ═══ TOYS & GAMING ═══
   { name: 'LEGO Technic Lamborghini Sián 42115', price: 379.99, category: ['Toys', 'LEGO'],
     description: '3696 pieces, scale model of Lamborghini Sián FKP 37, working V12 engine, automatic gearbox.',
     imgs: [img('lego1'), img('lego2'), img('lego3')], inventory: 16, discount: 0, currency: 'USD' },

   { name: 'Nintendo Switch OLED Model', price: 349.99, category: ['Electronics', 'Gaming'],
     description: '7" OLED screen, wide adjustable stand, 64GB storage, enhanced audio, dock with LAN port.',
     imgs: [img('switch1'), img('switch2')], inventory: 33, discount: 0, currency: 'USD',
     variants: ['color:White', 'color:Neon Blue/Red'] },

   { name: 'Razer DeathAdder V3 Gaming Mouse', price: 89.99, category: ['Electronics', 'Gaming'],
     description: 'Focus Pro 30K optical sensor, 6 programmable buttons, 90-hour battery, ultra-lightweight 63g.',
     imgs: [img('mouse3'), img('mouse4')], inventory: 71, discount: 0.10, currency: 'USD' },

   { name: 'Rubik\'s Cube 3×3 Speed Cube', price: 14.99, category: ['Toys', 'Puzzles'],
     description: 'Official Rubik\'s brand, spring-tensioned mechanism for smooth rotation, pop-resistant design.',
     imgs: [img('rubik1'), img('rubik2')], inventory: 350, discount: 0, currency: 'USD' },

   { name: 'Hot Wheels Ultimate Garage Playset', price: 79.99, category: ['Toys', 'Kids'],
     description: '4 feet tall, holds 140+ cars, working elevator, spiral track, includes 2 Hot Wheels cars.',
     imgs: [img('hotwheels1'), img('hotwheels2')], inventory: 27, discount: 0.20, currency: 'USD' },

   // ═══ OFFICE & DESK ═══
   { name: 'ErgoChair Pro Ergonomic Chair', price: 499.00, category: ['Office', 'Furniture'],
     description: 'Lumbar support, adjustable armrests, recline to 45°, breathable mesh back, up to 300 lbs.',
     imgs: [img('chair1'), img('chair2')], inventory: 13, discount: 0.10, currency: 'USD',
     variants: ['color:Black', 'color:Grey', 'color:White'] },

   { name: 'Autonomous Electric Standing Desk', price: 449.99, category: ['Office', 'Furniture'],
     description: 'Dual motor, 265 lbs capacity, 4 height presets, 28" to 47.6" adjustable, anti-collision.',
     imgs: [img('desk1'), img('desk2')], inventory: 10, discount: 0, currency: 'USD' },

   { name: 'LG 27" 4K IPS UltraFine Monitor', price: 599.99, category: ['Electronics', 'Monitors', 'Office'],
     description: '3840×2160, DCI-P3 95%, Thunderbolt 3, VESA mount compatible, USB-C 60W PD.',
     imgs: [img('monitor1'), img('monitor2')], inventory: 20, discount: 0.15, currency: 'USD' },

   { name: 'Blue Yeti USB Microphone', price: 129.99, category: ['Electronics', 'Audio', 'Streaming'],
     description: 'Four pickup patterns, tri-capsule array, built-in headphone amp, plug & play USB.',
     imgs: [img('mic1'), img('mic2')], inventory: 55, discount: 0, currency: 'USD',
     variants: ['color:Blackout', 'color:Silver', 'color:Blue', 'color:Midnight Blue'] },

   { name: 'Moleskine Classic Notebook A5 Ruled', price: 19.99, category: ['Office', 'Stationery'],
     description: 'Hard cover, 240 pages, elastic closure, bookmark ribbon, expandable inner pocket.',
     imgs: [img('notebook1'), img('notebook2')], inventory: 450, discount: 0, currency: 'USD',
     variants: ['color:Black', 'color:Sapphire Blue', 'color:Scarlet Red'] },

];

// ── Assign IDs, timestamps, empty reviews, seller_id null ─────────────────────

const newProducts = products.map((p) => ({
   id: randId(),
   ...p,
   reviews: [],
   seller_id: null,
   seller_name: null,
   commission_rate: 0,
   seller_price: p.price,
   is_available: true,
   created_at: new Date(Date.now() - randInt(0, 365 * 24 * 60 * 60 * 1000)).toISOString(),
   updated_at: new Date().toISOString(),
}));

// ── Append to db ──────────────────────────────────────────────────────────────

db.products = [...db.products, ...newProducts];
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf-8');

console.log(`✅ Added ${newProducts.length} products.`);
console.log(`📦 Total products in DB: ${db.products.length}`);
console.log('\nSample product:', JSON.stringify(newProducts[0], null, 2));
