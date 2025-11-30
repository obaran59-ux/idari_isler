CREATE DATABASE IF NOT EXISTS sirket_yonetim;
USE sirket_yonetim;

-- Personel Tablosu
CREATE TABLE IF NOT EXISTS personel (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ad_soyad VARCHAR(100) NOT NULL,
    tc_no VARCHAR(11),
    departman VARCHAR(100),
    kan_grubu VARCHAR(10),
    telefon VARCHAR(20),
    ise_giris DATE,
    isten_cikis DATE,
    resim_url VARCHAR(255),
    acil_kisi_ad VARCHAR(100),
    acil_kisi_yakinlik VARCHAR(50),
    acil_kisi_telefon VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Araçlar Tablosu
CREATE TABLE IF NOT EXISTS araclar (
    id INT AUTO_INCREMENT PRIMARY KEY,
    plaka VARCHAR(20) NOT NULL,
    marka VARCHAR(50),
    model VARCHAR(50),
    yil INT,
    zimmetli_kisi VARCHAR(100),
    kasko_bitis DATE,
    trafik_sigorta_bitis DATE,
    muayene_bitis DATE,
    resim_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Demirbaşlar Tablosu
CREATE TABLE IF NOT EXISTS demirbaslar (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ad VARCHAR(100) NOT NULL,
    tip VARCHAR(50),
    dask_bitis DATE,
    sigorta_bitis DATE,
    resim_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Şirket Belgeleri Tablosu
CREATE TABLE IF NOT EXISTS sirket_belgeleri (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ad VARCHAR(100) NOT NULL,
    gecerlilik_bitis DATE,
    dosya_yolu VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Dosyalar (Dijital Klasör Sistemi)
-- relation_type: 'personel', 'arac', 'demirbas'
-- category: 'ozluk', 'ruhsat', 'kaza' vb.
CREATE TABLE IF NOT EXISTS dosyalar (
    id INT AUTO_INCREMENT PRIMARY KEY,
    relation_type VARCHAR(20) NOT NULL,
    relation_id INT NOT NULL,
    dosya_adi VARCHAR(255),
    dosya_yolu VARCHAR(255),
    kategori VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ajanda / Notlar Tablosu
CREATE TABLE IF NOT EXISTS notlar (
    id INT AUTO_INCREMENT PRIMARY KEY,
    baslik VARCHAR(255),
    etiket VARCHAR(50),
    tarih DATE,
    tamamlandi BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Firma Ayarları (Tek satır tutulacak)
CREATE TABLE IF NOT EXISTS firma_ayarlari (
    id INT PRIMARY KEY DEFAULT 1,
    firma_adi VARCHAR(100) DEFAULT 'D Makina',
    unvan VARCHAR(100) DEFAULT 'A.Ş.',
    logo_base64 LONGTEXT
);

INSERT INTO firma_ayarlari (id, firma_adi) VALUES (1, 'D Makina') ON DUPLICATE KEY UPDATE id=1;