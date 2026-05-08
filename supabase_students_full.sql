create extension if not exists pgcrypto;

create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  matricula text not null unique,
  nombre text not null,
  apellidos text not null,
  grupo text not null check (grupo in ('DPGM', 'CPGM')),
  carrera text not null,
  qr_payload text not null unique,
  activo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.students (matricula, nombre, apellidos, grupo, carrera, qr_payload) values
('244020800510194', 'MANUEL ALEXANDER', 'ALVAREZ COTA', 'DPGM', 'Programación', 'https://www.cecytebc.edu.mx/lincesapp/prod/controlesc/credential/265582/05669'),
('244020800510308', 'MOISES', 'ARANA ARANA', 'CPGM', 'Programación', 'https://www.cecytebc.edu.mx/lincesapp/prod/controlesc/credential/266723/05669'),
('24402080059930', 'LEIA DAYANNA', 'CASTILLO OLIVA', 'CPGM', 'Programación', 'https://www.cecytebc.edu.mx/lincesapp/prod/controlesc/credential/262879/05669'),
('244020800510411', 'SHECCID XIMENA', 'CORNEJO SAUCEDO', 'DPGM', 'Programación', 'https://www.cecytebc.edu.mx/lincesapp/prod/controlesc/credential/272542/05669'),
('244020800510151', 'ANGEL DAVID', 'CUADRAS RAMOS', 'CPGM', 'Programación', 'https://www.cecytebc.edu.mx/lincesapp/prod/controlesc/credential/272968/05669'),
('24402080157043', 'CRISTIAN ALBERTO', 'GUTIERREZ MORALES', 'DPGM', 'Programación', 'https://www.cecytebc.edu.mx/lincesapp/prod/controlesc/credential/263887/05669'),
('244020800510180', 'KARINA', 'LIZARRAGA CORONA', 'CPGM', 'Programación', 'https://www.cecytebc.edu.mx/lincesapp/prod/controlesc/credential/265451/05669'),
('244020800510221', 'CATIA GUADALUPE', 'MENDOZA SILVA', 'DPGM', 'Programación', 'https://www.cecytebc.edu.mx/lincesapp/prod/controlesc/credential/265865/05669'),
('244020800511053', 'JESUS ADRIEL', 'MEZA MACHADO', 'DPGM', 'Programación', 'https://www.cecytebc.edu.mx/lincesapp/prod/controlesc/credential/294504/05669'),
('244020800511084', 'ZULEMA GUADALUPE', 'MONTAÑO ESTRADA', 'CPGM', 'Programación', 'https://www.cecytebc.edu.mx/lincesapp/prod/controlesc/credential/305058/05669'),
('24402080157023', 'JOSE EMILIO', 'MOTTA MERCADO', 'CPGM', 'Programación', 'https://www.cecytebc.edu.mx/lincesapp/prod/controlesc/credential/263724/05669'),
('244020800510415', 'BRAYAN', 'NIETO SALAZAR', 'DPGM', 'Programación', 'https://www.cecytebc.edu.mx/lincesapp/prod/controlesc/credential/272574/05669'),
('244020800510367', 'SHIRLETH', 'PADILLA CABRERA', 'DPGM', 'Programación', 'https://www.cecytebc.edu.mx/lincesapp/prod/controlesc/credential/267344/05669'),
('244020800510450', 'MARTIN ALEXANDER', 'REYNA ZAMBRANO', 'CPGM', 'Programación', 'https://www.cecytebc.edu.mx/lincesapp/prod/controlesc/credential/272968/05669'),
('23402080059473', 'BRITTANY DENISSE', 'RODRIGUEZ LOZANO', 'DPGM', 'Programación', 'https://www.cecytebc.edu.mx/lincesapp/prod/controlesc/credential/235075/05669'),
('244020800510346', 'XIOMARA JACQUELINE', 'TALAVERA GUERRERO', 'CPGM', 'Programación', 'https://www.cecytebc.edu.mx/lincesapp/prod/controlesc/credential/267142/05669'),
('24402080059961', 'EYDANN ALONSO', 'VALENZUELA BAÑALES', 'CPGM', 'Programación', 'https://www.cecytebc.edu.mx/lincesapp/prod/controlesc/credential/263092/05669'),
('244020800510264', 'BRANDON DONNOVAN', 'VAZQUEZ MARTINEZ', 'CPGM', 'Programación', 'https://cecytebc.edu.mx/lincesapp/prod/controlesc/credential/244020800510264'),
('244020800510167', 'MARCUS ALEXIS', 'VAZQUEZ ZAVALA', 'DPGM', 'Programación', 'https://www.cecytebc.edu.mx/lincesapp/prod/controlesc/credential/265147/05669')
on conflict (matricula) do update set
  nombre = excluded.nombre,
  apellidos = excluded.apellidos,
  grupo = excluded.grupo,
  carrera = excluded.carrera,
  qr_payload = excluded.qr_payload;
