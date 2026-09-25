import type { Program } from '@/lib/data';

export interface ChannelScheduleInfo {
  streamId: string;
  streamer: string;
  category: string;
  thumbnailUrl: string;
  schedule: Program[];
}

export const DAYS_OF_WEEK = [
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
  'Domingo'
] as const;

export type DayOfWeek = typeof DAYS_OF_WEEK[number];

/**
 * Grilla semanal completa y oficial de todos los canales en StreamFLIX
 */
export const CHANNEL_SCHEDULES: Record<string, Program[]> = {
  // LUZU TV
  'luzu-tv': [
    ...(['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'] as DayOfWeek[]).flatMap((day) => [
      { id: `luzu-1-${day}`, title: 'Antes Que Nadie', description: 'Diego Leuco, Yoyi Francella, Mica Vázquez y Trinche con la mejor energía para empezar el día.', dayOfWeek: day, startTime: '08:00', endTime: '10:00' },
      { id: `luzu-2-${day}`, title: 'Nadie Dice Nada', description: 'Nico Occhiato, Flor Jazmín Peña, Momi Giardina y Santi Talledo en el streaming líder de Argentina.', dayOfWeek: day, startTime: '10:00', endTime: '13:00' },
      { id: `luzu-3-${day}`, title: 'Patria y Familia', description: 'Fede Popgold, Anita Espósito, Lucas Spadafora y Cami Mayan con debate, chismes y diversión.', dayOfWeek: day, startTime: '13:00', endTime: '15:00' },
      { id: `luzu-4-${day}`, title: 'Entre Nosotros', description: 'Mateo Guasconi, Manu Dons, Sofi Gonet y equipo debatiendo temas generacionales.', dayOfWeek: day, startTime: '15:00', endTime: '17:00' },
      { id: `luzu-5-${day}`, title: 'Tarde de Tertulia', description: 'Marti Benza, Nico Ferrero y Cami Jara para cerrar la tarde con anécdotas y risas.', dayOfWeek: day, startTime: '17:00', endTime: '19:00' },
      { id: `luzu-6-${day}`, title: 'Luzu Nights & Música', description: 'Sesiones especiales, invitados sorpresa y acústicos en vivo.', dayOfWeek: day, startTime: '19:00', endTime: '21:00' }
    ]),
    ...(['Sábado', 'Domingo'] as DayOfWeek[]).flatMap((day) => [
      { id: `luzu-wk-${day}`, title: 'Lo Mejor de la Semana Luzu', description: 'Los mejores momentos, anécdotas imperdibles y resúmenes de Nadie Dice Nada y Antes Que Nadie.', dayOfWeek: day, startTime: '15:00', endTime: '19:00' }
    ])
  ],

  // OLGA
  'olga-envivo': [
    ...(['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'] as DayOfWeek[]).flatMap((day) => [
      { id: `olga-1-${day}`, title: 'Paraíso Fiscal', description: 'Fer Dente, Luciana Geuna y Noelia Custodio abren la mañana con noticias, humor y música.', dayOfWeek: day, startTime: '06:00', endTime: '08:00' },
      { id: `olga-2-${day}`, title: 'Sería Increíble', description: 'Nati Jota, Eial Moldavsky, Damián Betular y Homero Pettinato.', dayOfWeek: day, startTime: '08:00', endTime: '10:00' },
      { id: `olga-3-${day}`, title: 'Soñé Que Volaba', description: 'Migue Granados, Lucas Fridman y Sofi Morandi. Charlas delirantes y bandas en vivo.', dayOfWeek: day, startTime: '10:00', endTime: '13:00' },
      { id: `olga-4-${day}`, title: 'Mi Primo es Así', description: 'Martín Rechimuzzi, Toto Kirzner y Evelyn Botto.', dayOfWeek: day, startTime: '13:00', endTime: '15:00' },
      { id: `olga-5-${day}`, title: 'Generación Dorada', description: 'Elizabeth La Negra Vernaci, Humberto Tortonese y Yayo.', dayOfWeek: day, startTime: '15:00', endTime: '17:00' },
      { id: `olga-6-${day}`, title: 'Olga Sessions & Acústicos', description: 'Conciertos íntimos en el estudio y zapadas históricas con grandes artistas.', dayOfWeek: day, startTime: '17:00', endTime: '19:00' }
    ]),
    ...(['Sábado', 'Domingo'] as DayOfWeek[]).flatMap((day) => [
      { id: `olga-wk-${day}`, title: 'Especiales Acústicos y Festivales', description: 'Transmisión especial de los shows masivos, Spinetta Day, Charly Day y lo mejor de Olga.', dayOfWeek: day, startTime: '16:00', endTime: '20:00' }
    ])
  ],

  // BLENDER
  'blender-oficial': [
    ...(['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'] as DayOfWeek[]).flatMap((day) => [
      { id: `blender-1-${day}`, title: 'Duro de Pasar', description: 'El arranque de la mañana con actualidad desenfadada y cultura pop.', dayOfWeek: day, startTime: '09:00', endTime: '11:00' },
      { id: `blender-2-${day}`, title: 'Hay Algo Ahí', description: 'Tomás Rebord, Guille Aquino y Juanita Groisman con análisis y debate.', dayOfWeek: day, startTime: '11:00', endTime: '13:30' },
      { id: `blender-3-${day}`, title: 'Último Aviso', description: 'Fio Sargenti y equipo con lo último en cine, series, internet y memes.', dayOfWeek: day, startTime: '13:30', endTime: '15:30' },
      { id: `blender-4-${day}`, title: 'Qué Día!', description: 'Mauro Szeta, Sol Rivas, Lu Iacono y Dario Gannio con policiales, sociedad y debate.', dayOfWeek: day, startTime: '18:00', endTime: '20:00' },
      { id: `blender-5-${day}`, title: 'Blender At Night', description: 'José María Listorti, Pachu Peña, Diego Della Sala e invitados.', dayOfWeek: day, startTime: '20:00', endTime: '22:00' },
      { id: `blender-6-${day}`, title: 'Fort Night Show / Especiales', description: 'Marta Fort y equipo en el late night show más irreverente.', dayOfWeek: day, startTime: '22:00', endTime: '23:30' }
    ])
  ],

  // GELATINA
  'gelatina-canal': [
    ...(['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'] as DayOfWeek[]).flatMap((day) => [
      { id: `gela-1-${day}`, title: 'Tres Estrellas', description: 'Pedro Rosemblat, Ivana Szerman y Marcos Aramburu. Humor político y actualidad caliente.', dayOfWeek: day, startTime: '10:00', endTime: '13:00' },
      { id: `gela-2-${day}`, title: 'Fábrica de Jingles', description: 'La icónica fábrica de canciones y sátiras enviadas por los oyentes.', dayOfWeek: day, startTime: '13:00', endTime: '15:00' },
      { id: `gela-3-${day}`, title: 'Gelatina Federal', description: 'Informes especiales, columnas de coyuntura nacional y entrevistas de fondo.', dayOfWeek: day, startTime: '18:00', endTime: '20:00' }
    ])
  ],

  // BONDI LIVE
  'bondi-live': [
    ...(['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'] as DayOfWeek[]).flatMap((day) => [
      { id: `bondi-1-${day}`, title: 'Ángel Responde', description: 'Ángel de Brito y Dalma Maradona con todas las primicias del espectáculo y farándula.', dayOfWeek: day, startTime: '09:00', endTime: '11:00' },
      { id: `bondi-2-${day}`, title: 'Nadie Nos Para', description: 'Beto Casella y su clásico panel con humor, archivos insólitos y delirios.', dayOfWeek: day, startTime: '11:00', endTime: '13:00' },
      { id: `bondi-3-${day}`, title: 'El Ejército de la Mañana', description: 'Pepe Ochoa y Fefe Bongiorno con primicias exclusivas de LAM y redes sociales.', dayOfWeek: day, startTime: '13:00', endTime: '15:00' }
    ])
  ],

  // TN (TODO NOTICIAS)
  'tn-noticias': [
    ...(['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'] as DayOfWeek[]).flatMap((day) => [
      { id: `tn-1-${day}`, title: 'Tempraneros', description: 'Sergio Lapegüe y Roxy Vázquez con el clima, tránsito y las primeras noticias.', dayOfWeek: day, startTime: '06:00', endTime: '10:00' },
      { id: `tn-2-${day}`, title: 'TN de 10 a 13', description: 'Lorena Maciel y Guillermo Lobo con coberturas en vivo desde todo el país.', dayOfWeek: day, startTime: '10:00', endTime: '13:00' },
      { id: `tn-3-${day}`, title: 'Nuestra Tarde', description: 'Dominique Metzger y equipo con móviles, actualidad y testimonios.', dayOfWeek: day, startTime: '13:00', endTime: '16:00' },
      { id: `tn-4-${day}`, title: 'Está Pasando', description: 'Carolina Amoroso con el análisis de los hechos más relevantes de la jornada.', dayOfWeek: day, startTime: '16:00', endTime: '18:00' },
      { id: `tn-5-${day}`, title: 'TN Central', description: 'Mario Massaccesi con el resumen informativo y análisis de fondo.', dayOfWeek: day, startTime: '18:00', endTime: '20:00' },
      { id: `tn-6-${day}`, title: 'Solo Una Vuelta Más', description: 'Diego Sehinkman con la mesa política más influyente de la noche.', dayOfWeek: day, startTime: '20:00', endTime: '22:00' },
      { id: `tn-7-${day}`, title: 'A Dos Voces / El Corresponsal', description: 'Marcelo Bonelli y Edgardo Alfano con debate político cara a cara.', dayOfWeek: day, startTime: '22:00', endTime: '00:00' }
    ]),
    ...(['Sábado', 'Domingo'] as DayOfWeek[]).flatMap((day) => [
      { id: `tn-wk-1-${day}`, title: 'TN Fin de Semana', description: 'Actualidad nacional, informes especiales y deportes.', dayOfWeek: day, startTime: '08:00', endTime: '13:00' },
      { id: `tn-wk-2-${day}`, title: 'TN Deportivo & Coberturas', description: 'Transmisiones especiales, fútbol y móviles federales.', dayOfWeek: day, startTime: '13:00', endTime: '20:00' }
    ])
  ],

  // C5N
  'c5n-vivo': [
    ...(['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'] as DayOfWeek[]).flatMap((day) => [
      { id: `c5n-1-${day}`, title: 'Mañanas Argentinas', description: 'Información al instante, tránsito, clima y los primeros títulos.', dayOfWeek: day, startTime: '06:30', endTime: '10:00' },
      { id: `c5n-2-${day}`, title: 'Nos Vemos', description: 'Móviles en vivo, economía del bolsillo y actualidad social.', dayOfWeek: day, startTime: '10:00', endTime: '13:00' },
      { id: `c5n-3-${day}`, title: 'De Una', description: 'Análisis informativo y cobertura federal al mediodía.', dayOfWeek: day, startTime: '13:00', endTime: '16:00' },
      { id: `c5n-4-${day}`, title: 'Minuto a Minuto', description: 'La tarde caliente con debate económico y político.', dayOfWeek: day, startTime: '16:00', endTime: '18:00' },
      { id: `c5n-5-${day}`, title: 'El Diario', description: 'Víctor Hugo Morales con sus editoriales y análisis de la realidad.', dayOfWeek: day, startTime: '18:00', endTime: '20:00' },
      { id: `c5n-6-${day}`, title: 'Minuto Uno', description: 'Gustavo Sylvestre con primicias políticas y documentos exclusivos.', dayOfWeek: day, startTime: '20:00', endTime: '21:30' },
      { id: `c5n-7-${day}`, title: 'Duro de Domar', description: 'Pablo Duggan y un panel picante con debate y archivo televisivo.', dayOfWeek: day, startTime: '21:30', endTime: '23:30' }
    ])
  ],

  // LA NACIÓN +
  'lanacion-mas': [
    ...(['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'] as DayOfWeek[]).flatMap((day) => [
      { id: `ln-1-${day}`, title: '8 AM', description: 'Luis Novaresio con entrevistas y la agenda de la mañana.', dayOfWeek: day, startTime: '06:00', endTime: '10:00' },
      { id: `ln-2-${day}`, title: 'Buen Día Nación', description: 'Luis Majul con editoriales y análisis económico.', dayOfWeek: day, startTime: '10:00', endTime: '13:00' },
      { id: `ln-3-${day}`, title: 'El Noticiero de LN+', description: 'Eduardo Feinmann con las noticias más comentadas de la jornada.', dayOfWeek: day, startTime: '13:00', endTime: '15:00' },
      { id: `ln-4-${day}`, title: 'Hora 18', description: 'Información en vivo y panel político de la tarde.', dayOfWeek: day, startTime: '18:00', endTime: '20:00' },
      { id: `ln-5-${day}`, title: 'La Ves?', description: 'Mesa de debate con los columnistas principales del canal.', dayOfWeek: day, startTime: '20:00', endTime: '22:00' },
      { id: `ln-6-${day}`, title: 'Odisea Argentina', description: 'Carlos Pagni con el análisis político más agudo de la televisión.', dayOfWeek: day, startTime: '22:00', endTime: '23:30' }
    ])
  ],

  // CRÓNICA TV
  'cronica-tv': [
    ...(['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'] as DayOfWeek[]).flatMap((day) => [
      { id: `cro-1-${day}`, title: 'La Primera de Crónica', description: 'Chiche Gelblung con las noticias de la gente y móviles en directo.', dayOfWeek: day, startTime: '06:00', endTime: '09:00' },
      { id: `cro-2-${day}`, title: 'Tiempo Real', description: 'Placas rojas y cobertura de casos populares en la calle.', dayOfWeek: day, startTime: '09:00', endTime: '12:00' },
      { id: `cro-3-${day}`, title: 'Crónica Noticias Mediodía', description: 'Reclamos vecinales, justicia y actualidad popular.', dayOfWeek: day, startTime: '12:00', endTime: '15:00' },
      { id: `cro-4-${day}`, title: 'Las Tardes de Crónica', description: 'Móviles policiales y testimonios cara a cara.', dayOfWeek: day, startTime: '15:00', endTime: '18:00' },
      { id: `cro-5-${day}`, title: 'Crónica Central', description: 'El resumen más contundente de las noticias del día.', dayOfWeek: day, startTime: '18:00', endTime: '21:00' },
      { id: `cro-6-${day}`, title: 'El Run Run del Espectáculo', description: 'Lío Pecoraro y Fernando Piaggio con primicias y farándula.', dayOfWeek: day, startTime: '21:00', endTime: '23:30' }
    ])
  ],

  // TELEFE
  'telefe-canal': [
    ...(['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'] as DayOfWeek[]).flatMap((day) => [
      { id: `telefe-1-${day}`, title: 'Buen Telefe', description: 'Las primeras noticias del día con el estilo cercano de Telefe.', dayOfWeek: day, startTime: '07:00', endTime: '09:30' },
      { id: `telefe-2-${day}`, title: 'Ariel en su Salsa', description: 'Ariel Rodríguez Palacios y equipo con recetas espectaculares.', dayOfWeek: day, startTime: '09:30', endTime: '13:00' },
      { id: `telefe-3-${day}`, title: 'El Noticiero de la Gente', description: 'Germán Paoloski con las noticias del mediodía y actualidad.', dayOfWeek: day, startTime: '13:00', endTime: '14:30' },
      { id: `telefe-4-${day}`, title: 'Cortá por Lozano', description: 'Verónica Lozano con entrevistas en diván, risas y actualidad.', dayOfWeek: day, startTime: '14:30', endTime: '17:00' },
      { id: `telefe-5-${day}`, title: 'Novelas Éxito de Telefe', description: 'Las superproducciones internacionales más vistas de la tarde.', dayOfWeek: day, startTime: '17:00', endTime: '20:00' },
      { id: `telefe-6-${day}`, title: 'Telefe Noticias', description: 'Rodolfo Barili con la edición central del noticiero insignia.', dayOfWeek: day, startTime: '20:00', endTime: '21:45' },
      { id: `telefe-7-${day}`, title: 'Gran Hermano / Prime Time', description: 'Galas en vivo, debate y entretenimiento para toda la familia.', dayOfWeek: day, startTime: '21:45', endTime: '00:00' }
    ]),
    ...(['Sábado', 'Domingo'] as DayOfWeek[]).flatMap((day) => [
      { id: `telefe-wk-${day}`, title: 'La Peña de Morfi', description: 'Música en vivo con grandes artistas nacionales y comida criolla.', dayOfWeek: day, startTime: '11:30', endTime: '16:30' }
    ])
  ],

  // EL TRECE
  'eltrece-canal': [
    ...(['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'] as DayOfWeek[]).flatMap((day) => [
      { id: `trece-1-${day}`, title: 'Arriba Argentinos', description: 'El clásico matutino con todo lo que necesitas saber antes de salir.', dayOfWeek: day, startTime: '07:00', endTime: '09:00' },
      { id: `trece-2-${day}`, title: 'Mañanísima', description: 'Carmen Barbieri con cocina, salud, farándula y emoción.', dayOfWeek: day, startTime: '09:00', endTime: '11:30' },
      { id: `trece-3-${day}`, title: 'Socios del Espectáculo', description: 'Rodrigo Lussich y Adrián Pallares con los escandalones del día.', dayOfWeek: day, startTime: '11:30', endTime: '13:00' },
      { id: `trece-4-${day}`, title: 'Mediodía Noticias', description: 'Cobertura al instante con móviles en todo el conurbano y CABA.', dayOfWeek: day, startTime: '13:00', endTime: '14:30' },
      { id: `trece-5-${day}`, title: '100 Argentinos Dicen / Ahora Caigo', description: 'Darío Barassi con juegos y diversión en familia.', dayOfWeek: day, startTime: '14:30', endTime: '17:00' },
      { id: `trece-6-${day}`, title: 'Telenoche', description: 'Nelson Castro y Dominique Metzger con investigaciones especiales.', dayOfWeek: day, startTime: '20:00', endTime: '21:30' },
      { id: `trece-7-${day}`, title: 'Los 8 Escalones de los 3 Millones', description: 'Guido Kaczka entrega millones todos los días con preguntas de cultura general.', dayOfWeek: day, startTime: '21:30', endTime: '23:15' }
    ]),
    ...(['Sábado', 'Domingo'] as DayOfWeek[]).flatMap((day) => [
      { id: `trece-wk-${day}`, title: 'La Noche de Mirtha / Almorzando con Juana', description: 'Las tradicionales mesas de fin de semana con invitados de primer nivel.', dayOfWeek: day, startTime: '21:30', endTime: '23:45' }
    ])
  ],

  // TV PÚBLICA
  'tv-publica': [
    ...(['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'] as DayOfWeek[]).flatMap((day) => [
      { id: `tvp-1-${day}`, title: 'TV Pública Noticias Mañana', description: 'Resumen federal con corresponsales en las 24 provincias.', dayOfWeek: day, startTime: '08:00', endTime: '10:00' },
      { id: `tvp-2-${day}`, title: 'Cocinate / Sabores Federales', description: 'La cocina de cada rincón de la República Argentina.', dayOfWeek: day, startTime: '10:00', endTime: '12:00' },
      { id: `tvp-3-${day}`, title: 'Festival País', description: 'Transmisiones de los festivales tradicionales de folklore y doma.', dayOfWeek: day, startTime: '12:00', endTime: '14:00' },
      { id: `tvp-4-${day}`, title: 'TV Pública Noticias Central', description: 'Noticiero federal con alcance en todo el territorio nacional.', dayOfWeek: day, startTime: '19:00', endTime: '20:30' },
      { id: `tvp-5-${day}`, title: 'Cine Nacional y Documentales', description: 'Las mejores películas argentinas y producciones del INCAA.', dayOfWeek: day, startTime: '21:00', endTime: '23:00' }
    ])
  ],

  // TYC SPORTS
  'tyc-sports': [
    ...(['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'] as DayOfWeek[]).flatMap((day) => [
      { id: `tyc-1-${day}`, title: 'Sportia Primera Mañana', description: 'Toda la actividad del fútbol argentino y polideportivo al despertar.', dayOfWeek: day, startTime: '07:00', endTime: '10:00' },
      { id: `tyc-2-${day}`, title: 'Superfútbol', description: 'Gonzalo Bonadeo y panelistas debaten la fecha con toda la información.', dayOfWeek: day, startTime: '10:00', endTime: '12:00' },
      { id: `tyc-3-${day}`, title: 'Líbero', description: 'Ariel Senosiain y Hugo Balassone con el análisis táctico y el clásico Líbero VS.', dayOfWeek: day, startTime: '12:00', endTime: '15:00' },
      { id: `tyc-4-${day}`, title: 'Dale al Medio', description: 'Debate apasionado sobre Boca, River y la Selección Argentina.', dayOfWeek: day, startTime: '15:00', endTime: '17:00' },
      { id: `tyc-5-${day}`, title: 'Sportia Edición Tarde', description: 'Entrenamientos en vivo, conferencias de prensa y móviles de campo.', dayOfWeek: day, startTime: '17:00', endTime: '19:00' },
      { id: `tyc-6-${day}`, title: 'Presión Alta', description: 'Discusión sin filtro sobre la polémica futbolera de la fecha.', dayOfWeek: day, startTime: '19:00', endTime: '21:00' },
      { id: `tyc-7-${day}`, title: 'La Noche de TyC Sports', description: 'Resumen completo de partidos, goles y jugadas destacadas.', dayOfWeek: day, startTime: '21:00', endTime: '23:00' }
    ]),
    ...(['Sábado', 'Domingo'] as DayOfWeek[]).flatMap((day) => [
      { id: `tyc-wk-${day}`, title: 'Fútbol en Vivo & Ascenso', description: 'Transmisión exclusiva de los partidos de Primera Nacional y Liga Profesional.', dayOfWeek: day, startTime: '13:00', endTime: '23:30' }
    ])
  ],

  // ESPN ARGENTINA
  'espn-argentina': [
    ...(['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'] as DayOfWeek[]).flatMap((day) => [
      { id: `espn-1-${day}`, title: 'SportsCenter Primera Edición', description: 'Las noticias deportivas de la mañana y actualidad del fútbol europeo.', dayOfWeek: day, startTime: '08:00', endTime: '11:00' },
      { id: `espn-2-${day}`, title: 'ESPN F12', description: 'Mariano Closs con el relato de los hechos clave del fútbol argentino.', dayOfWeek: day, startTime: '11:00', endTime: '13:00' },
      { id: `espn-3-${day}`, title: 'ESPN F90', description: 'Sebastián El Pollo Vignolo, Morena Beltrán, Chavo Fucks y panel con debate caliente.', dayOfWeek: day, startTime: '13:00', endTime: '15:00' },
      { id: `espn-4-${day}`, title: 'ESPN F360', description: 'Gustavo López con entrevistas a protagonistas y análisis de campo.', dayOfWeek: day, startTime: '15:00', endTime: '17:00' },
      { id: `espn-5-${day}`, title: 'SportsCenter Tarde', description: 'Resumen de tenis, básquet, Champions League y fútbol sudamericano.', dayOfWeek: day, startTime: '17:00', endTime: '19:00' },
      { id: `espn-6-${day}`, title: 'ESPN F90 Noche', description: 'La continuidad del show líder del mediodía con análisis nocturno.', dayOfWeek: day, startTime: '19:00', endTime: '21:00' },
      { id: `espn-7-${day}`, title: 'ESPN Equipo F', description: 'Mesa de periodistas debatiendo los partidos de la jornada.', dayOfWeek: day, startTime: '21:00', endTime: '23:00' }
    ])
  ],

  // URBANA PLAY
  'urbana-play': [
    ...(['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'] as DayOfWeek[]).flatMap((day) => [
      { id: `urb-1-${day}`, title: 'De Acá en Más', description: 'María O\'Donnell con periodismo riguroso, política y análisis social.', dayOfWeek: day, startTime: '06:00', endTime: '09:00' },
      { id: `urb-2-${day}`, title: 'Perros de la Calle', description: 'Andy Kusnetzoff, Sofi Martínez y Harry Salvarrey con entrevistas y emociones.', dayOfWeek: day, startTime: '09:00', endTime: '13:00' },
      { id: `urb-3-${day}`, title: 'Todo Pasa', description: 'Matías Martin, Clemente Cancela y Emilse Pizarro con cultura y anécdotas.', dayOfWeek: day, startTime: '13:00', endTime: '17:00' },
      { id: `urb-4-${day}`, title: 'Vuelta y Media', description: 'Sebastián Wainraich, Julieta Pink y Pablo Fábregas para cerrar el día con humor.', dayOfWeek: day, startTime: '17:00', endTime: '20:00' }
    ])
  ],

  // VORTERIX
  'vorterix-oficial': [
    ...(['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'] as DayOfWeek[]).flatMap((day) => [
      { id: `vort-1-${day}`, title: 'Quién Paga la Fiesta', description: 'Martín Ciccioli con la mañana más rockera y cargada de energía.', dayOfWeek: day, startTime: '07:00', endTime: '10:00' },
      { id: `vort-2-${day}`, title: 'Maldición Va a Ser un Día Hermoso', description: 'Mario Pergolini con tecnología, tendencias, música e ironía.', dayOfWeek: day, startTime: '10:00', endTime: '13:00' },
      { id: `vort-3-${day}`, title: 'Vorterix Rock & Talk', description: 'Entrevistas a las mejores bandas de rock nacional e internacional.', dayOfWeek: day, startTime: '13:00', endTime: '16:00' },
      { id: `vort-4-${day}`, title: 'Paren Todo', description: 'La tarde de Vorterix con debates, streaming y transmisiones en vivo.', dayOfWeek: day, startTime: '16:00', endTime: '19:00' },
      { id: `vort-5-${day}`, title: 'Generación V', description: 'Contenido digital para jóvenes con creadores de contenido.', dayOfWeek: day, startTime: '19:00', endTime: '21:30' }
    ])
  ],

  // PAREN LA MANO
  'luquitas-rodriguez': [
    ...(['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'] as DayOfWeek[]).flatMap((day) => [
      { id: `plm-1-${day}`, title: 'Paren La Mano', description: 'Luquitas Rodríguez, Germán Beder, Alfredo Montes de Oca y Roberto Galati en el programa de culto de streaming.', dayOfWeek: day, startTime: '19:00', endTime: '21:30' }
    ])
  ],

  // SPREEN
  'spreen-stream': [
    ...(['Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'] as DayOfWeek[]).flatMap((day) => [
      { id: `spreen-1-${day}`, title: 'Spreen en Vivo', description: 'Directo nocturno de Iván Spreen: Just Chatting, videojuegos, retos y risas con la comunidad.', dayOfWeek: day, startTime: '19:00', endTime: '23:30' }
    ])
  ]
};

export const CHANNEL_NUMBERS: Record<string, number> = {
  'luzu-tv': 10,
  'olga-envivo': 11,
  'blender-oficial': 12,
  'gelatina-canal': 13,
  'bondi-live': 14,
  'tn-noticias': 20,
  'c5n-vivo': 21,
  'lanacion-mas': 22,
  'cronica-tv': 23,
  'telefe-canal': 30,
  'eltrece-canal': 31,
  'tv-publica': 32,
  'tyc-sports': 40,
  'espn-argentina': 41,
  'urbana-play': 50,
  'vorterix-oficial': 51,
  'luquitas-rodriguez': 60,
  'spreen-stream': 61,
};

/**
 * Obtener la grilla de un canal específico
 */
export function getChannelSchedule(streamId: string): Program[] {
  return CHANNEL_SCHEDULES[streamId] || [];
}

/**
 * Convierte "HH:MM" a minutos transcurridos desde las 00:00
 */
export function timeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  if (timeStr === '24:00') return 1440;
  const [h, m] = timeStr.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

/**
 * Convierte minutos a "HH:MM"
 */
export function minutesToTime(minutes: number): string {
  const clamped = Math.max(0, Math.min(1440, minutes));
  const h = Math.floor(clamped / 60);
  const m = clamped % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/**
 * Genera la grilla ininterrumpida de 24 horas (00:00 a 24:00) para un canal
 * rellenando automáticamente cualquier hueco como en Flow.
 */
export function getFilledDaySchedule(channelId: string, day: DayOfWeek, channelName = 'Canal'): Program[] {
  const rawPrograms = (CHANNEL_SCHEDULES[channelId] || []).filter(p => p.dayOfWeek === day);
  
  if (rawPrograms.length === 0) {
    // Si el canal no emite programas en vivo específicos este día, mostrar bloque continuo
    return [
      {
        id: `${channelId}-cont-${day}`,
        title: `Transmisión Continuada • ${channelName}`,
        description: `Lo mejor de ${channelName}, entrevistas destacadas, archivo y especiales en emisión continua.`,
        dayOfWeek: day,
        startTime: '00:00',
        endTime: '24:00'
      }
    ];
  }

  // Ordenar programas por hora de inicio
  const sorted = [...rawPrograms].sort((a, b) => a.startTime.localeCompare(b.startTime));
  const result: Program[] = [];
  let currentMin = 0;

  for (let i = 0; i < sorted.length; i++) {
    const prog = sorted[i];
    const startMin = timeToMinutes(prog.startTime);
    const endMin = prog.endTime ? timeToMinutes(prog.endTime) : Math.min(1440, startMin + 120);

    // Si hay un hueco antes de este programa
    if (startMin > currentMin) {
      result.push({
        id: `${channelId}-filler-${day}-${currentMin}`,
        title: currentMin === 0 ? `Trasnoche ${channelName}` : `Espacio ${channelName}`,
        description: `Música, repeticiones de los mejores momentos y archivo exclusivo de ${channelName}.`,
        dayOfWeek: day,
        startTime: minutesToTime(currentMin),
        endTime: minutesToTime(startMin)
      });
    }

    result.push({
      ...prog,
      endTime: minutesToTime(endMin)
    });

    currentMin = Math.max(currentMin, endMin);
  }

  // Si queda tiempo hasta las 24:00
  if (currentMin < 1440) {
    result.push({
      id: `${channelId}-filler-end-${day}-${currentMin}`,
      title: `Cierre y Madrugada ${channelName}`,
      description: `Lo más visto de la semana, momentos destacados y transmisión de trasnoche.`,
      dayOfWeek: day,
      startTime: minutesToTime(currentMin),
      endTime: '24:00'
    });
  }

  return result;
}

/**
 * Obtener todos los programas de todos los canales filtrados por día
 */
export function getProgramsByDay(day: DayOfWeek): Array<{ channelId: string; program: Program }> {
  const result: Array<{ channelId: string; program: Program }> = [];
  
  for (const [channelId, programs] of Object.entries(CHANNEL_SCHEDULES)) {
    const dayPrograms = programs.filter(p => p.dayOfWeek === day);
    for (const program of dayPrograms) {
      result.push({ channelId, program });
    }
  }

  // Ordenar cronológicamente por hora de inicio
  return result.sort((a, b) => a.program.startTime.localeCompare(b.program.startTime));
}
