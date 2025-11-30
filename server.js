const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer'); // Dosya yükleme için
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('uploads')); // Yüklenen dosyalara erişim için

// Dosya Yükleme Ayarları
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = './uploads';
        if (!fs.existsSync(dir)) fs.mkdirSync(dir);
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// MySQL Bağlantısı
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',      // MySQL kullanıcı adınız
    password: 'Onur123!',      // MySQL şifreniz
    database: 'sirket_yonetim'
});

db.connect(err => {
    if (err) console.error('Veritabanı bağlantı hatası:', err);
    else console.log('MySQL veritabanına bağlandı.');
});

// --- API ENDPOINTS ---

// 1. PERSONEL
app.get('/api/personel', (req, res) => {
    db.query('SELECT * FROM personel ORDER BY id DESC', (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

app.post('/api/personel', (req, res) => {
    const data = req.body;
    const sql = `INSERT INTO personel (ad_soyad, tc_no, departman, kan_grubu, telefon, ise_giris, isten_cikis, acil_kisi_ad, acil_kisi_yakinlik, acil_kisi_telefon, resim_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    // Varsayılan avatar
    const img = `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=0D8ABC&color=fff`; 
    db.query(sql, [data.name, data.tc, data.role, data.blood, data.phone, data.entry, data.exit || null, data.emergency?.name, data.emergency?.relation, data.emergency?.phone, img], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ id: result.insertId, ...data });
    });
});

// Personel Güncelleme
app.put('/api/personel/:id', (req, res) => {
    const data = req.body;
    const sql = `UPDATE personel SET ad_soyad=?, tc_no=?, departman=?, kan_grubu=?, telefon=?, ise_giris=?, isten_cikis=?, acil_kisi_ad=?, acil_kisi_yakinlik=?, acil_kisi_telefon=? WHERE id=?`;
    db.query(sql, [data.name, data.tc, data.role, data.blood, data.phone, data.entry, data.exit || null, data.emergency?.name, data.emergency?.relation, data.emergency?.phone, req.params.id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ success: true });
    });
});

app.delete('/api/personel/:id', (req, res) => {
    db.query('DELETE FROM personel WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ success: true });
    });
});

// 2. ARAÇLAR
app.get('/api/arac', (req, res) => {
    db.query('SELECT * FROM araclar ORDER BY id DESC', (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

app.post('/api/arac', (req, res) => {
    const d = req.body;
    const img = `https://ui-avatars.com/api/?name=${encodeURIComponent(d.plaka)}&background=d97706&color=fff`;
    const sql = `INSERT INTO araclar (plaka, marka, model, yil, zimmetli_kisi, kasko_bitis, trafik_sigorta_bitis, muayene_bitis, resim_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    db.query(sql, [d.plaka, d.brand, d.model, d.year, d.user, d.kasko, d.trafik, d.muayene, img], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ id: result.insertId, ...d });
    });
});

app.put('/api/arac/:id', (req, res) => {
    const d = req.body;
    const sql = `UPDATE araclar SET plaka=?, marka=?, model=?, yil=?, zimmetli_kisi=?, kasko_bitis=?, trafik_sigorta_bitis=?, muayene_bitis=? WHERE id=?`;
    db.query(sql, [d.plaka, d.brand, d.model, d.year, d.user, d.kasko, d.trafik, d.muayene, req.params.id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ success: true });
    });
});

app.delete('/api/arac/:id', (req, res) => {
    db.query('DELETE FROM araclar WHERE id = ?', [req.params.id], (err) => res.json({success: !err}));
});

// 3. DEMİRBAŞLAR
app.get('/api/demirbas', (req, res) => {
    db.query('SELECT * FROM demirbaslar ORDER BY id DESC', (err, results) => res.json(results));
});

app.post('/api/demirbas', (req, res) => {
    const d = req.body;
    const img = `https://ui-avatars.com/api/?name=${encodeURIComponent(d.name)}&background=4f46e5&color=fff`;
    const sql = `INSERT INTO demirbaslar (ad, tip, dask_bitis, sigorta_bitis, resim_url) VALUES (?, ?, ?, ?, ?)`;
    db.query(sql, [d.name, d.tip, d.dask, d.sigorta, img], (err, result) => res.json({ id: result.insertId }));
});

app.put('/api/demirbas/:id', (req, res) => {
    const d = req.body;
    const sql = `UPDATE demirbaslar SET ad=?, tip=?, dask_bitis=?, sigorta_bitis=? WHERE id=?`;
    db.query(sql, [d.name, d.tip, d.dask, d.sigorta, req.params.id], (err) => res.json({success: !err}));
});

app.delete('/api/demirbas/:id', (req, res) => db.query('DELETE FROM demirbaslar WHERE id = ?', [req.params.id], (err) => res.json({success: !err})));

// 4. DOSYA YÖNETİMİ
// Belirli bir kayıda ait dosyaları getir
app.get('/api/files/:type/:id', (req, res) => {
    const sql = `SELECT * FROM dosyalar WHERE relation_type = ? AND relation_id = ?`;
    db.query(sql, [req.params.type, req.params.id], (err, results) => res.json(results));
});

// Dosya Yükleme
app.post('/api/upload', upload.single('file'), (req, res) => {
    const { relation_type, relation_id, category } = req.body;
    if (!req.file) return res.status(400).send('Dosya yüklenmedi.');
    
    const sql = `INSERT INTO dosyalar (relation_type, relation_id, dosya_adi, dosya_yolu, kategori) VALUES (?, ?, ?, ?, ?)`;
    db.query(sql, [relation_type, relation_id, req.file.originalname, req.file.filename, category], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ success: true, file: req.file });
    });
});

app.delete('/api/files/:id', (req, res) => {
    db.query('DELETE FROM dosyalar WHERE id = ?', [req.params.id], (err) => res.json({success: !err}));
});

// 5. ŞİRKET BELGELERİ
app.get('/api/belgeler', (req, res) => db.query('SELECT * FROM sirket_belgeleri', (err, r) => res.json(r)));
app.post('/api/belgeler', (req, res) => {
    const d = req.body;
    db.query('INSERT INTO sirket_belgeleri (ad, gecerlilik_bitis) VALUES (?, ?)', [d.name, d.bitis], (err, r) => res.json({id: r.insertId}));
});
app.delete('/api/belgeler/:id', (req, res) => {
    db.query(
        'DELETE FROM sirket_belgeleri WHERE id = ?',
        [req.params.id],
        (err) => {
            res.json({ success: !err });
        }
    );
});

// 6. NOTLAR
app.get('/api/todos', (req, res) => {
    db.query(
        'SELECT * FROM notlar ORDER BY tarih ASC',
        (err, r) => {
            res.json(r);
        }
    );
});

app.post('/api/todos', (req, res) => {
    const d = req.body;
    db.query(
        'INSERT INTO notlar (baslik, etiket, tarih) VALUES (?, ?, ?)',
        [d.text, d.subtext, d.date],
        (err, r) => {
            res.json({ id: r.insertId });
        }
    );
});

app.delete('/api/todos/:id', (req, res) => {
    db.query(
        'DELETE FROM notlar WHERE id = ?',
        [req.params.id],
        (err) => {
            res.json({ success: !err });
        }
    );
});
app.put('/api/todos/:id', (req, res) => {
    db.query('UPDATE notlar SET tamamlandi = NOT tamamlandi WHERE id = ?', [req.params.id], (err) => res.json({success: !err}));
});

// 7. FİRMA AYARLARI
app.get('/api/company', (req, res) => db.query('SELECT * FROM firma_ayarlari WHERE id=1', (err, r) => res.json(r[0])));
app.post('/api/company', (req, res) => {
    const d = req.body;
    db.query('UPDATE firma_ayarlari SET firma_adi=?, unvan=?, logo_base64=? WHERE id=1', [d.name, d.title, d.logo], (err) => res.json({success: !err}));
});

app.listen(PORT, () => {
    console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor`);
});