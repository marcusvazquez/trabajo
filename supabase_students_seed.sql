insert into public.students (matricula, nombre, apellidos, grupo, carrera, qr_payload) values
('244020800510194', 'MANUEL ALEXANDER', 'ALVAREZ COTA', 'DPGM', 'Programación', 'https://www.cecytebc.edu.mx/lincesapp/prod/controlesc/credential/265582/05669'),
('244020800510308', 'MOISES', 'ARANA ARANA', 'CPGM', 'Programación', 'https://www.cecytebc.edu.mx/lincesapp/prod/controlesc/credential/266723/05669'),
('24402080059930', 'LEIA DAYANNA', 'CASTILLO OLIVA', 'CPGM', 'Programación', 'https://www.cecytebc.edu.mx/lincesapp/prod/controlesc/credential/262879/05669'),
('244020800510151', 'ANGEL DAVID', 'CUADRAS RAMOS', 'CPGM', 'Programación', 'https://www.cecytebc.edu.mx/lincesapp/prod/controlesc/credential/272968/05669'),
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
