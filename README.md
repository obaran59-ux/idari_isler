# Pro-Admin İdari İşler Yönetim Paneli

Bu proje, bir şirketin **idari işleri**ni tek ekrandan yönetmek için tasarlanmış,
çok modüllü bir **yönetim panelidir**.  

Uygulama sadece basit notlar değil; personel dosyaları, araç filoları, demirbaşlar,
şirket belgeleri ve kritik tarihleri (sigorta, muayene, DASK vb.) takip eder.
Dashboard üzerinde yaklaşan bitiş tarihleri için **kritik uyarılar** üretir.

> Arayüz tamamen web tabanlıdır ve Tailwind CSS + Vanilla JS ile geliştirilmiştir.

---

## 🧩 Modüller

### 1. Dashboard

- Aktif personel sayısı
- Toplam araç sayısı (Filo)
- Toplam demirbaş varlık
- Kritik uyarı sayısı (sigortası/ruhsatı biten araçlar, süresi dolmuş belgeler, vb.)
- **Kritik Sistem Uyarıları tablosu:**
  - Araç kasko, trafik sigortası, muayene
  - Demirbaş DASK ve sigorta tarihleri
  - Şirket belgelerinin bitiş tarihleri
- **Ajanda & Hatırlatmalar:**
  - Tarih, etiket ve metinle not ekleme (İK, Finans, Filo, Acil vb.)
  - Tamamlandı işaretleme / silme

### 2. Personel & İK Modülü

- Aktif / Eski personel filtreleri  
- İsme göre arama
- Personel kartı:
  - Ad Soyad, rol, telefon, kan grubu, TC
  - İşe giriş / çıkış tarihleri
  - Otomatik **kıdem hesabı (yıl + ay)**
  - Acil durum kişisi ve telefonu
- **Personel klasör yapısı:**
  - Özlük
  - Sözleşme
  - Sağlık
  - Zimmet
- Her klasöre dosya yükleme / silme (simülasyon dosya yönetimi)
- Personel çıkış işlemi (işten çıkarma tarihi ile)

### 3. Araç & Filo Modülü

- Araç listesi (plaka, marka/model, yıl, kullanıcı)
- Risk durum ikonu (sigorta/muayene süreleri geçmişse uyarı)
- Araç detay kartı:
  - Kasko, trafik sigortası, muayene bitiş tarihleri
  - Her tarih için kalan gün / süre doldu etiketleri
- **Araç klasör yapısı:**
  - Ruhsat & Tescil
  - Sigorta & Kasko
  - Bakım & Servis
  - Ceza & HGS
- Her klasöre belge/dosya ekleme (simülasyon)

### 4. Demirbaş & Emlak Modülü

- Varlık listesi (adı, tipi/konumu)
- DASK ve sigorta bitiş tarihlerine göre uyarı
- Demirbaş detay kartı:
  - DASK bitiş
  - Sigorta bitiş
- **Demirbaş klasör yapısı:**
  - Tapu & Sözleşme
  - Sigorta & DASK
  - Zimmet
  - Garanti & Fatura

### 5. Şirket Belgeleri Modülü

- Kurumsal evrakların kart bazlı listesi
- Belge adına göre arama
- Her belge için:
  - Bitiş tarihi
  - Kalan gün / süresi doldu etiketi (renkli badge)
  - Belgeye bağlı dosyalar (PDF / görsel sayısı)
- “Belge Ekle” ve dosya yönetimi (simülasyon file manager)

### 6. Ayarlar & Sistem Modülü

- **Firma Bilgileri & Kimlik**
  - Kısa firma adı
  - Ünvan / alt başlık
  - Logo yükleme (Base64 olarak saklanıyor)
  - Bilgiler otomatik olarak sol menüdeki logo ve isim alanına yansır
- **Veri & Sistem Yönetimi**
  - Yedek indir (simülasyon)
  - Sistemi sıfırla:
    - Tüm verileri temizleyip uygulamayı fabrika ayarlarına döndürür

---

## 🧱 Kullanılan Teknolojiler

- **Frontend**
  - HTML5
  - Tailwind CSS (CDN)
  - Font Awesome ikon seti
  - Google Fonts (Inter)
  - SweetAlert2 (güzel popup’lar için)
  - Vanilla JavaScript

- **Veri Yönetimi (şu anki versiyon)**
  - `localStorage` üzerinde tek bir `state` objesi
  - Tüm modüllerin verileri `state.personel`, `state.arac`, `state.demirbas`, `state.belgeler`, `state.todos` şeklinde tutulur.

> Not: Proje istenirse Node.js + MySQL backend ile entegre edilip  
> localStorage yerine gerçek veritabanı kullanılacak şekilde genişletilebilir.

---

## 📂 Proje Yapısı (Özet)

```text
idari_isler/
 ├─ index.html      # Tüm arayüz ve JS mantığı (tek sayfa uygulama)
 ├─ server.js       # (Planlanan) Node.js backend (Express + MySQL)
 ├─ database.sql    # Veritabanı şeması / tablolar (İdari işler yapısına göre)
 ├─ package.json    # Node.js bağımlılıkları
 └─ ...
