🚀 FINAL MASTER PROMPT – RYU FACTION PORTAL (FULL STACK + DATABASE)

Saya ingin membuat website portal informasi crafting untuk fraksi FiveM bernama RYU menggunakan Next.js 14 (App Router) dengan database dan sistem admin.

Website ini akan di-deploy ke GitHub lalu ke Vercel.

Gunakan arsitektur full-stack modern yang production-ready.

🏗 TECH STACK WAJIB

Gunakan:

Next.js 14 (App Router)

Tailwind CSS

Framer Motion (animasi)

Supabase (Database + Auth + Storage)

TypeScript

Modular architecture

Clean scalable folder structure

Deployment target:

GitHub repository

Deploy ke Vercel

🗄 DATABASE (SUPABASE)

Gunakan Supabase sebagai:

PostgreSQL database

Authentication (Admin login only)

Storage (upload gambar bahan, lokasi, logo, galeri)

Buat schema database lengkap berikut:

TABLE: crafting_items

id (uuid)

name

description

category

base_price (optional)

image_url

created_at

TABLE: materials

id (uuid)

crafting_id (relation ke crafting_items)

name

quantity_per_item

tutorial (text panjang)

image_url (gambar bahan)

location_image_url (gambar koordinat)

created_at

TABLE: map_locations

id (uuid)

name

description

x_position (untuk pin map)

y_position

image_url

created_at

TABLE: gallery

id

title

image_url

created_at

TABLE: announcements

id

title

content

created_at

Gunakan relational query yang clean.

🔐 AUTH SYSTEM

Gunakan Supabase Auth.

Hanya Admin yang bisa:

Login

Akses /admin

CRUD crafting

CRUD materials

CRUD map pin

Upload logo

Upload galeri

Manage announcement

Non-admin tidak bisa akses dashboard.

🌀 LOADING SCREEN DENGAN LOGO RYU

Saat pertama kali membuka website:

Fullscreen loader

Background dark animated gradient

Logo RYU di tengah

Glow pulse animation

Smooth fade out setelah load selesai

Logo harus bisa:

Diupload lewat Admin Panel

Disimpan di Supabase Storage

Disimpan URL-nya di database

🛠 HALAMAN CRAFTING
FITUR WAJIB:
1️⃣ Search Crafting Item

Real-time filter

2️⃣ Filter by Category
3️⃣ Klik Item → Detail Page

Tampilkan:

Kebutuhan bahan per 1 item.

🔢 Crafting Calculator

User input:
"Berapa jumlah ingin dibuat?"

Auto calculate total bahan secara real-time.

💰 Profit Estimator

Input:

Harga jual per item

Auto calculate:

Total produksi

Total estimasi pendapatan

Gunakan animated counter.

📘 DETAIL MATERIAL

Setiap material memiliki:

Nama

Tutorial step by step

Gambar bahan (upload admin)

Gambar lokasi koordinat (upload admin)

Semua gambar disimpan di Supabase Storage.

🗺 MAP SECTION

Gunakan image full GTA map sebagai background

Dynamic pin berdasarkan database

Pin clickable

Muncul popup:

Nama lokasi

Deskripsi

Gambar lokasi

Admin bisa:

Tambah pin

Edit

Delete

🏢 STRUKTUR RYU SIXNINEv2

Tampilkan dalam animated hierarchy modern.

Struktur:

BOSS:

MING14

OG:

Bli Duta

Mami Jane

VICE:

A Gery

Levy

Jacob

SDM:

Jarot

Lihua

Gary

PUNISHER:

Uci

Odet

Gary

BRANGKAS:

Alinuy

Grim

Grey

Lihua

Gary

RC:

Colins

Bos Madun

Smith

Johor

Blu

Gunakan:

Neon blue glow hover

Smooth entrance animation

Elite gangster aesthetic

🎨 DESIGN SYSTEM

Warna:

Midnight blue primary

Electric blue accent

Dark gradient background

Subtle neon glow

Style:

Glassmorphism ringan

Clean modern UI

Elite faction look

📂 PROJECT STRUCTURE WAJIB CLEAN

Gunakan struktur seperti:

app/
admin/
components/
modules/
lib/
hooks/
types/
utils/

Pisahkan:

UI components

Database logic

Supabase config

Types

🔄 DEPLOYMENT REQUIREMENT

Project harus:

Siap push ke GitHub

Environment variables untuk Supabase

Compatible untuk deploy ke Vercel

Tidak menggunakan server custom

Menggunakan Server Actions / Route Handlers

🎬 ANIMASI WAJIB

Page transition

Scroll reveal

Hover glow

Animated counters

Loader animation

Smooth fade transitions

🎯 GOAL AKHIR

Website ini harus terlihat:

Profesional

Modern

Gangster elite

Full animasi

Dynamic

Production-ready

Mudah dikembangkan ke depan

Jika memungkinkan, generate:

SQL schema untuk Supabase

Supabase setup guide

Folder structure example

Example CRUD implementation

Example image upload implementation

Buat semuanya clean, scalable, dan best practice untuk Next.js production.