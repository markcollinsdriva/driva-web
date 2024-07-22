
create or replace function uuid7() returns uuid 
as $$
  declare
    v_time timestamp with time zone:= null;
    v_secs bigint := null;
    v_usec bigint := null;
    v_timestamp bigint := null;
    v_timestamp_hex varchar := null;
    v_random bigint := null;
    v_random_hex varchar := null;
    v_bytes bytea;
    c_variant bit(64):= x'8000000000000000'; -- RFC-4122 variant: b'10xx...'
  begin
    -- Get seconds and micros
    v_time := clock_timestamp();
    v_secs := EXTRACT(EPOCH FROM v_time);
    v_usec := mod(EXTRACT(MICROSECONDS FROM v_time)::numeric, 10^6::numeric);
    -- Generate timestamp hexadecimal (and set version 7)
    v_timestamp := (((v_secs * 1000) + div(v_usec, 1000))::bigint << 12) | (mod(v_usec, 1000) << 2);
    v_timestamp_hex := lpad(to_hex(v_timestamp), 16, '0');
    v_timestamp_hex := substr(v_timestamp_hex, 2, 12) || '7' || substr(v_timestamp_hex, 14, 3);
    -- Generate the random hexadecimal (and set variant b'10xx')
    v_random := ((random()::numeric * 2^62::numeric)::bigint::bit(64) | c_variant)::bigint;
    v_random_hex := lpad(to_hex(v_random), 16, '0');
    -- Concat timestemp and random hexadecimal
    v_bytes := decode(v_timestamp_hex || v_random_hex, 'hex');
    return encode(v_bytes, 'hex')::uuid;
  end 
$$ language plpgsql;

create extension if not exists moddatetime with schema extensions;

drop table if exists public."Profiles" cascade;

drop type if exists "residency";
create type "residency" AS enum (
  'citizen',
  'pr',
  'visa'
);

drop type if exists "employmentType";
create type "employmentType" AS enum (
  'fullTime',
  'partTime',
  'selfEmployed',
  'casual',
  'unemployed',
  'pension',
  'contractor'
);

drop type if exists "livingSituation";
create type "livingSituation" AS enum (
  'renting',
  'ownerWithMortgage',
  'ownerWithoutMortgage',
  'livingWithParents',
  'board'
);

create table public."Profiles" (
  "id" uuid default uuid7() primary key not null,
  "email" text not null unique,
  "mobilePhone" text not null unique,
  "firstName" text,
  "lastName" text,
  "addressLine1" text,
  "addressLine2" text,
  "suburb" text,
  "state" text,
  "postCode" text,
  "dateOfBirthYear" integer check (
    "dateOfBirthYear" >= 1920
    and "dateOfBirthYear" <= 2025
  ),
  "dateOfBirthMonth" integer check (
    "dateOfBirthMonth" >= 1
    and "dateOfBirthMonth" <= 12
  ),
  "dateOfBirthDay" integer check (
    "dateOfBirthDay" >= 1
    and "dateOfBirthDay" <= 31
  ),
  "residency" "residency",
  "employmentType" "employmentType",
  "livingSituation" "livingSituation",
  "insertedAt" timestamp with time zone default timezone('utc' :: text, now()) not null,
  "updatedAt" timestamp with time zone default timezone('utc' :: text, now()) not null
);

drop table if exists public."CreditScores" cascade;

create table public."CreditScores" (
  "id" uuid default uuid7() primary key not null,
  "profileId" uuid references public."Profiles" on delete cascade not null,
  "score" integer,
  "error" text,
  "insertedAt" timestamp with time zone default timezone('utc' :: text, now()) not null,
  "updatedAt" timestamp with time zone default timezone('utc' :: text, now()) not null
);

drop table if exists public."Events" cascade;

create table public."Events" (
  "id" uuid default uuid7() primary key not null,
  "name" text not null,
  "meta" jsonb,
  "env" text not null,
  "insertedAt" timestamp with time zone default timezone('utc' :: text, now()) not null
);

insert into
  public."Profiles" (
    "email",
    "firstName",
    "lastName",
    "mobilePhone",
    "addressLine1",
    "addressLine2",
    "suburb",
    "state",
    "postCode",
    "dateOfBirthYear",
    "dateOfBirthMonth",
    "dateOfBirthDay",
    "residency",
    "employmentType",
    "livingSituation"
  )
values
  (
    'test123@test123.com',
    'Ruth',
    'Orlando',
    '0491578148',
    '48 warrangi st',
    null,
    'turramurra',
    'NSW',
    '2074',
    1987,
    5,
    4,
    'citizen',
    'fullTime',
    'ownerWithMortgage'
  ),
  (
    'marktest@testtest.com',
    'Ruth',
    'Orlando',
    '0423590966',
    '48 warrangi st',
    null,
    'turramurra',
    'NSW',
    '2074',
    1987,
    5,
    4,
    'citizen',
    'fullTime',
    'ownerWithMortgage'
  );