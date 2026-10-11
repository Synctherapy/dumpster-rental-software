-- Migration: 202610110001_pickup_proof.sql
-- Add pickup_proof_url column to jobs table for retrieval driveway condition photos
alter table public.jobs add column if not exists pickup_proof_url text;

-- Update transition_job to also record pickup_proof_url
create or replace function public.transition_job(p_id uuid,p_org uuid,p_patch jsonb,p_driver uuid default null) returns jsonb language plpgsql security definer set search_path=public as $$
declare j public.jobs; c public.containers; next_status text; assigned_driver uuid; assigned_container uuid; next_pickup date; next_delivery date;
begin
 select * into j from public.jobs where id=p_id and org_id=p_org for update;
 if not found then raise exception 'Job not found'; end if;
 if p_driver is not null and j.driver_id is distinct from p_driver then raise exception 'Forbidden'; end if;
 if exists(select 1 from public.invoice_attempts where job_id=j.id) or j.status in ('completed','cancelled') then raise exception 'This job is closed or its invoice is locked'; end if;
 next_status:=coalesce(p_patch->>'status',j.status);
 if next_status<>j.status and not ((j.status='booked' and next_status in ('dispatched','cancelled')) or (j.status='quoted' and next_status='cancelled') or (j.status='dispatched' and next_status in ('delivered','cancelled')) or (j.status='delivered' and next_status='picked_up')) then raise exception 'Move this job through its stages in order'; end if;
 if p_driver is not null and (next_status not in ('delivered','picked_up') or p_patch ?| array['driver_id','container_id','notes','delivery_date','pickup_date']) then raise exception 'Forbidden'; end if;
 assigned_driver:=case when p_patch?'driver_id' then (p_patch->>'driver_id')::uuid else j.driver_id end;
 assigned_container:=case when p_patch?'container_id' then (p_patch->>'container_id')::uuid else j.container_id end;
 if assigned_driver is not null and not exists(select 1 from public.users where id=assigned_driver and org_id=p_org and role='driver') then raise exception 'Invalid driver'; end if;
 if j.status in ('dispatched','delivered','picked_up') and assigned_container is distinct from j.container_id then raise exception 'An active container cannot be reassigned'; end if;
 if next_status='dispatched' then
  if assigned_driver is null or assigned_container is null then raise exception 'Assign a driver and container first'; end if;
  select * into c from public.containers where id=assigned_container and org_id=p_org for update;
  if not found or c.size_yards<>j.size_yards or c.status='maintenance' or (c.current_job_id is not null and c.current_job_id<>j.id) or (c.status='on_site' and c.current_job_id is distinct from j.id) then raise exception 'This container is already on site or unavailable'; end if;
  update public.containers set status='on_site',current_job_id=j.id where id=c.id;
 end if;
 if next_status='delivered' and coalesce(p_patch->>'proof_url',j.proof_url,'')='' then raise exception 'Upload delivery proof first'; end if;
 next_pickup:=coalesce((p_patch->>'pickup_date')::date,j.pickup_date);next_delivery:=coalesce((p_patch->>'delivery_date')::date,j.delivery_date);
 if next_delivery<>j.delivery_date and j.status<>'booked' then raise exception 'Delivery date is locked after dispatch'; end if;
 if next_status in ('picked_up','cancelled') then update public.containers set status='yard',current_job_id=null where current_job_id=j.id; end if;
 update public.jobs set status=next_status,driver_id=assigned_driver,container_id=assigned_container,
 delivery_date=next_delivery,pickup_date=next_pickup,
 price_cents=(pricing_snapshot->>'base_price_cents')::int+greatest(0,next_pickup-next_delivery-(pricing_snapshot->>'included_days')::int)*extra_day_cents,
 notes=coalesce(p_patch->>'notes',notes),tons_actual=coalesce((p_patch->>'tons_actual')::numeric,tons_actual),proof_url=coalesce(p_patch->>'proof_url',proof_url),
 pickup_proof_url=coalesce(p_patch->>'pickup_proof_url',pickup_proof_url),
 delivered_at=case when next_status='delivered' then coalesce(delivered_at,now()) else delivered_at end,
 picked_up_at=case when next_status='picked_up' then coalesce(picked_up_at,now()) else picked_up_at end
 where id=j.id returning * into j;
 return to_jsonb(j);
end $$;
