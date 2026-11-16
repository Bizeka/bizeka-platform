# Bizeka.ServiceCatalog - Türkçe özet (sahip için)

Karar: [ADR 0004](../../adr/0004-service-catalog-community-module.md). Ayrıntı: bu klasördeki 01, 02 ve 03 belgeleri.

## Ne öneriliyor
Platforma yedinci açık kaynak modül: **Bizeka.ServiceCatalog**, "Serenity üstünde Backstage-lite". Bir ekibin servislerini (API, web uygulaması, veritabanı, zamanlanmış iş, kuyruk, kütüphane), sahibi olan takımı ve yaşam döngüsünü kayıt altına alan küçük bir geliştirici portalı. Yalnızca Serenity ve Platform'un açık modüllerine (Extensions, DynamicForms, Todo, Theme) dayanır.

## Neden bu
- Geliştirici kendi problemini görür; fork edip ekibine uyarlaması doğaldır.
- Dört Platform modülünü de doğal rolünde sergiler; eksik olan entegrasyon örneği olur.
- Todo'daki `DynamicDataJson` kolonunu ilk kez gerçek bir tüketici kullanır.
- İlk katkı kod değil veri: yeni bir ServiceKind satırı + bir DynamicForms tanımı.

## Yapı
- Tablolar: Teams, ServiceKinds, Services, ServiceDependencies, ServiceTasks (bağ tablosu).
- Todo şeması değişmez; servis-görev bağını yeni modül sahiplenir.
- Özel UI yalnızca iki parça: (1) seçilen kind'a göre dinamik alanlar, (2) Northwind Customer -> Notes desenindeki gibi servis dialogunda **Görevler** tabı. Tab içinde Todo'nun kendi grid ve dialogu çalışır.
- Görevler de `ServiceCatalog.Task` tanımıyla Environment, RunbookUrl, ChangeTicket alanları taşır (TaskItems.DynamicDataJson).

## Kapsam dışı (topluluğa veya host'a)
Health check, GitHub/CI entegrasyonu, bağımlılık grafiği, bildirim, SLA/incident. Modüle bunları ekleyen PR'lar ayrı uzantı paketine yönlendirilir.

## Süre tahmini
Toplam 4 ila 5 iş günü, altı PR grubu halinde (iskelet, veri, üretilen UI, dinamik alanlar, görev tabı, demo ve dokümanlar). Ayrıntılı liste 03-task-list.md içinde.

## Açık sorular
1. `DynamicBaseDialog` yüklendikten sonra şema yeniden yükleyebiliyor mu? Yoksa DynamicForms'a küçük bir ekleme gerekir.
2. `TaskItemDialog`'u DynamicBaseDialog'a çevirmek mi, alt sınıf mı? Öneri: Todo'da ayrı commit, varsayılan form key null.
3. Modül adı: `ServiceCatalog` mi, kısa `Catalog` mı? mevcut Catalog projesiyle karışmaması için ServiceCatalog önerildi.

## Durum
Yalnızca tasarım yazıldı; kod yok, commit yok. Dosyalar `feat/demo-ux-polish` dalının çalışma ağacında duruyor.
