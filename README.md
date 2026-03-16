# ⚡ SkillMatch v2

Bu proje, Java Spring Boot ile geliştirilmiş, iş arayanları işverenlerle buluşturan bir yetenek eşleştirme platformudur. Kullanıcılar yeteneklerine göre iş ilanlarıyla eşleştirilir ve işverenlerle gerçek zamanlı mesajlaşabilir.

---

## 🚀 Proje İçeriği

* **Rol Seçimi:** Kullanıcı iş arayan (Seeker) veya işveren (Employer) olarak kayıt olabilir.
* **İş İlanları:** İşverenler ilan oluşturabilir, iş arayanlar yeteneklerine göre eşleşme yüzdesiyle ilanları görüntüleyebilir.
* **Başvuru Sistemi:** İş arayanlar tek tıkla ilanlara başvurabilir.
* **Gerçek Zamanlı Mesajlaşma:** İş arayan ve işveren arasında chat drawer üzerinden mesajlaşma.
* **Bildirim Sistemi:** Okunmamış mesaj ve yeni başvuru bildirimleri.
* **İşveren Paneli:** Tüm ilanlar ve başvuran adayların listesi.

---

## 🛠️ Kullanılan Teknolojiler

* **Java 17+** — Backend dili
* **Spring Boot 4** — Web framework
* **Thymeleaf** — Server-side template engine
* **Spring Data JPA / Hibernate** — ORM ve veritabanı yönetimi
* **PostgreSQL** — Veritabanı (Docker üzerinde)
* **Lombok** — Boilerplate kod azaltma
* **HTML5 / CSS3 / Vanilla JS** — Frontend

---

## ⚙️ Kurulum

### Gereksinimler
- Java 17+
- Maven
- Docker

### 1. Repoyu klonlayın

```bash
git clone https://github.com/livanurdeli/Skill-Matching-System-v2.git
cd Skill-Matching-System-v2
```

### 2. PostgreSQL'i Docker ile başlatın

```bash
docker run --name skillmatch-db \
  -e POSTGRES_USER=skillmatch_user \
  -e POSTGRES_PASSWORD=skillmatch_pass \
  -e POSTGRES_DB=skillmatch \
  -p 5433:5432 \
  -d postgres:15
```

### 3. `application.properties` ayarları

```properties
spring.datasource.url=jdbc:postgresql://localhost:5433/skillmatch
spring.datasource.username=skillmatch_user
spring.datasource.password=skillmatch_pass
spring.jpa.hibernate.ddl-auto=update
```

### 4. Uygulamayı başlatın

```bash
mvn spring-boot:run
```

Tarayıcıda açın: [http://localhost:8080](http://localhost:8080)

---

## 👤 Kullanıcı Akışı

```
/role-select
  ├── Seeker  → /login → /home        (ilan listesi, başvur, mesajlaş)
  └── Employer → /login → /employer/home  (ilan yönetimi, aday listesi, mesajlaş)
```

---

## 📁 Proje Yapısı

```
src/main/java/com/demo/skillmatch/
├── controller/   → AuthController, HomeController, EmployerController, ChatController
├── model/        → User, JobPosting, Application, Message, Skill
├── repository/   → JPA Repository arayüzleri
├── service/      → İş mantığı servisleri
└── config/       → Uygulama konfigürasyonları

src/main/resources/templates/
├── role-select.html
├── login.html
├── register-seeker.html
├── register-employer.html
├── home.html
├── employer-home.html
└── employer-job-form.html
```


## 📸 Uygulama Görselleri
[![Ekran Resmi 2026-03-15 20.36.16.png](../../Ekran%20Resmi%202026-03-15%2020.36.16.png)
![Ekran Resmi 2026-03-15 20.39.49.png](../../Ekran%20Resmi%202026-03-15%2020.39.49.png)
![Ekran Resmi 2026-03-15 20.39.17.png](../../Ekran%20Resmi%202026-03-15%2020.39.17.png)
![Ekran Resmi 2026-03-15 20.37.56.png](../../Ekran%20Resmi%202026-03-15%2020.37.56.png)
![Ekran Resmi 2026-03-15 20.37.14.png](../../Ekran%20Resmi%202026-03-15%2020.37.14.png)](https://github.com/livanurdeli/Skill-Matching-System-v2/issues/1#issue-4078938469)

