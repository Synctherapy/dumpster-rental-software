-- Migration: 202610090001_custom_dumpster_sizes.sql
-- Allow custom dumpster / container sizes between 1 and 100 yards.

alter table public.pricing_rules drop constraint if exists pricing_rules_size_yards_check;
alter table public.pricing_rules add constraint pricing_rules_size_yards_check check(size_yards between 1 and 100);

alter table public.containers drop constraint if exists containers_size_yards_check;
alter table public.containers add constraint containers_size_yards_check check(size_yards between 1 and 100);
