# TikLive Intelligence başvuru sayfaları

Bu değişiklik mevcut statik siteye aşağıdaki ürün sayfalarını ekler:

- `https://kodzen.tr/tiklive/`
- `https://kodzen.tr/tiklive/privacy.html`
- `https://kodzen.tr/tiklive/terms.html`

Ana sayfanın ürünler alt menüsüne bağlantı ve sitemap'e üç adres eklendi. Mevcut genel privacy/terms sayfaları başka ürünlerin OAuth kapsamlarını anlattığından değiştirilmedi; TikLive için ürüne özgü metinler oluşturuldu.

## Mevcut durum

Sayfalar simülasyon, içeri aktarma ve yerel lisanslı MVP'yi tanıtır. Gerçek TikTok LIVE erişimi, OAuth ve ödeme entegrasyonu varmış gibi gösterilmez. Bu değişiklik uygulama panelini internete açmaz; yönetici parolası, lisans anahtarı veya ortam dosyası içermez. İletişim bilgisi mevcut KRTZEN sayfasındaki KODZEN iletişiminden alındı.

## Yayın sonrası başvuru

1. Üç URL'nin internette 200 yanıt verdiğini kontrol et.
2. TikTok Developer Portal'da yeni uygulamanın web sitesi, gizlilik ve koşullar alanlarına uygun URL'leri gir.
3. Portalın verdiği gerçek URL doğrulama dosyasını, adı ve içeriği değiştirilmeden belirtilen konuma ekle. Bu dosya henüz sağlanmadığı için uydurma doğrulama dosyası eklenmedi.
4. LIVE veri erişimi için destek/partner uygunluğunu netleştir. Login Kit/Display API onayı LIVE erişimi anlamına gelmez.
5. OAuth uygulanmadığı için çalışmayan redirect adresi tanımlama. Entegrasyon tamamlanınca gerçek uç nokta ve veri akışı ekle.
6. İnceleme videosunda simülasyonun niteliğini açıkça belirt; çalışmayan bağlantıyı çalışıyor gibi sunma.

Resmî başvuru rehberi: https://developers.tiktok.com/docs/en/getting-started-create-an-app

## Doğrulama

Statik HTML başlıkları, canonical adresleri, sayfa içi hedefler, yerel bağlantılar ve sitemap XML kontrol edilir. Yeni sayfalarda JavaScript, analitik, ödeme, kayıt veya kişisel veri toplama formu yoktur. Tarayıcı bu oturumda bağlı olmadığından görsel inceleme doğrulanamadı.
