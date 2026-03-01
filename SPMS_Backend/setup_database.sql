-- ============================================================
-- SPMS - Student Project Management System
-- MySQL Database Setup Script
-- Run this ONLY if you want to manually create the DB
-- (The app auto-migrates on startup)
-- ============================================================

CREATE DATABASE IF NOT EXISTS SPMSDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE SPMSDB;

-- ============================================================
-- STEPS TO RUN THE BACKEND:
-- 1. Update appsettings.json with your MySQL credentials
-- 2. Open terminal in the SPMS_Backend folder
-- 3. Run: dotnet ef database update
--    OR just run: dotnet run  (auto-migrates on startup)
-- ============================================================
