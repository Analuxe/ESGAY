-- ESGAY Abandoned Embassy Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- VENDORS (The Underground Artisans)
create table if not exists public.vendors (
  id uuid primary key default uuid_generate_v4(),
  moniker text not null unique,
  manifesto text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- THE WINGS (Categories)
create type public.embassy_wing as enum (
  'the-galleries', 
  'the-yardsmiths', 
  'sartorial-spite', 
  'propaganda-parody', 
  'the-apothecary'
);

-- ARTIFACTS (The Inventory / Products)
create table if not exists public.artifacts (
  id uuid primary key default uuid_generate_v4(),
  vendor_id uuid references public.vendors(id) on delete cascade not null,
  title text not null,
  description text not null, -- The Poetic Subversion copy
  price numeric(10, 2) not null,
  wing embassy_wing not null,
  stock_count integer default 1 not null,
  image_urls text[] default '{}'::text[],
  is_confiscated boolean default false, -- Status flag for sold out / archived
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS (Row Level Security)
alter table public.vendors enable row level security;
alter table public.artifacts enable row level security;

-- Policies (Public can view, only authenticated admins/vendors can write)
create policy "Vendors are viewable by everyone." on public.vendors for select using (true);
create policy "Artifacts are viewable by everyone." on public.artifacts for select using (true);

-- Seed some dummy data (The Found Artifacts)
insert into public.vendors (moniker, manifesto) values 
('Divine Scavenger', 'We do not apologize for being too much.'),
('Havana Decay', 'Finding the gold within the rot.')
on conflict do nothing;

insert into public.artifacts (vendor_id, title, description, price, wing, stock_count)
select id, 'Shattered Obsidian Choker', 'Heavy, tangible craftsmanship pulled from the wreckage. Wear it like armor.', 1450.00, 'the-yardsmiths', 3 
from public.vendors where moniker = 'Havana Decay'
limit 1;

insert into public.artifacts (vendor_id, title, description, price, wing, stock_count)
select id, 'Tarnished Silk Trench', 'Tailored venom. A high-end silhouette designed specifically to intimidate the establishment.', 3200.00, 'sartorial-spite', 1
from public.vendors where moniker = 'Divine Scavenger'
limit 1;

-- DYNAMIC ADMINISTRATORS
create table if not exists public.admins (
  id uuid primary key default uuid_generate_v4(),
  email text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.admins enable row level security;

-- Policies (Admins can be viewed/modified by authenticated administrators)
create policy "Admins are viewable by everyone" on public.admins for select using (true);
create policy "Admins can be managed via service role" on public.admins for all using (true);

