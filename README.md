# Health Academy – Headless CMS (Next.js + WordPress + LearnDash)

A modern Headless LMS platform using:

WordPress — backend CMS + LearnDash + Users

Next.js (App Router) — frontend UI, SSR, middleware, components

JWT Authentication — secure login with HttpOnly cookies

REST API + LearnDash API — fetch courses, progress, lessons

Vercel Deployment — fast hosting + global edge network

🏗️ System Architecture
WordPress CMS (Backend, LearnDash)<br>
 ├─ REST API (wp-json/wp/v2)<br>
 ├─ LearnDash API (wp-json/ldlms/v2)<br>
 ├─ JWT Authentication (wp-json/jwt-auth/v1/token)<br>
 └─ MySQL Database (not accessed directly)

Next.js Frontend (Vercel)<br>
 ├─ Server Components (SSR)<br>
 ├─ API Routes (/api/login, logout, me)<br>
 ├─ AuthContext (client)<br>
 ├─ Middleware (route protection)<br>
 └─ Tailwind UI<br>

Browser (User)<br>
 └─ Interacts ONLY with Next.js frontend

WordPress = Backend CMS
Next.js = Frontend Application

## Installation
Install xamp and mysql. 

Install node 24.11.1 or later version 

### In bash terminal: 

git clone https://github.com/narkmn/F2025_4495_050_Nen408.git 

WordPress CMS (Backend) installation guide 

cp -r F2025_4495_050_Nen408/Implementation/healthacademy C:\xampp\htdocs 

Run xampp and start Apache and Mysql 

Go to http://localhost/phpmyadmin/  

Import database (The database is not provided due privacy, also WP files are not fully uploaded into github due to storage size) 

Go to http://localhost/healthacademy 

To migration to webserver please read wordpress documentation. 

https://developer.wordpress.org/advanced-administration/upgrade/migrating/ 

### NextJS front end
After cloning the repository

cd F2025_4495_050_Nen408/Implementation/wpnextjs/

To test: npm run dev

To build: npm run built

To start: npm run start

.env: (due to purpose of security, it is not uploaded in Github)

to deploy on Vercel, please read documentation.
https://vercel.com/docs/deployments

### Test Deployment
www.healthacademy.ca
https://f2025-4495-050-nen408.vercel.app/

# Summary

This repository contains a fully-featured Headless CMS using:

WordPress (backend)

Next.js (frontend)

LearnDash (LMS)

JWT Auth (secure login)

REST API integration

SSR/Middleware architecture

Vercel (serverless Hosting)

All UI and user experience are handled by Next.js, while WordPress remains the content + LMS backend.