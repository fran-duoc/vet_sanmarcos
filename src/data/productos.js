import imgBadge from '../assets/img/badge.jpg';
import imgPipeta from '../assets/img/pipeta.jpg';
import imgChampu from '../assets/img/champu-mascota.jpg';
import imgSetDental from '../assets/img/set-dental.jpg';
import imgArena from '../assets/img/arena-gato.jpg';
import imgMultivitaminico from '../assets/img/multivitaminico.jpg';
import imgTucan from '../assets/img/tucan.jpg';
import imgConejo from '../assets/img/comida_conejo.jpg';
import imgDefault from '../assets/img/default-pet-product.png';

export const imagenPorDefecto = imgDefault;

export const productos = [
  {
    id: 1,
    imagen: imgBadge,
    titulo: 'Alimento Perro Adulto',
    descripcion: 'Alimento completo y balanceado formulado con proteínas de alta calidad e ingredientes naturales que facilitan una digestión saludable en perros adultos.',
    precio: '$45.990',
    precioNumero: 45990,
    categoria: 'Alimentos',
    especie: 'Perro',
    receta: 'Libre',
    rangoEdadPeso: 'Adulto (1 - 7 años) / 15 kg'
  },
  {
    id: 2,
    imagen: imgPipeta,
    titulo: 'Pipeta Antiparasitaria Gato',
    descripcion: 'Tratamiento antiparasitario de aplicación tópica que elimina y previene pulgas, garrapatas y ácaros, brindando protección continua durante 30 días.',
    precio: '$11.500',
    precioNumero: 11500,
    categoria: 'Medicamentos',
    especie: 'Gato',
    receta: 'Libre',
    rangoEdadPeso: 'Gatos desde 8 semanas / 0.5 ml'
  },
  {
    id: 3,
    imagen: imgChampu,
    titulo: 'Champú Hipoalergénico',
    descripcion: 'Fórmula suave especialmente diseñada para perros y gatos con piel sensible o propensos a irritaciones, libre de parabenos y químicos agresivos.',
    precio: '$8.990',
    precioNumero: 8990,
    categoria: 'Higiene',
    especie: 'Perro',
    receta: 'Libre',
    rangoEdadPeso: 'Todas las edades / 300 ml'
  },
  {
    id: 4,
    imagen: imgSetDental,
    titulo: 'Set Dental Canino y Felino',
    descripcion: 'Kit completo de higiene oral que remueve la acumulación de placa bacteriana, previene la formación de sarro y mantiene un aliento fresco.',
    precio: '$3.490',
    precioNumero: 3490,
    categoria: 'Higiene',
    especie: 'Perro',
    receta: 'Libre',
    rangoEdadPeso: 'Todas las edades / Kit 2 piezas'
  },
  {
    id: 5,
    imagen: imgArena,
    titulo: 'Arena Sanitaria Aglomerante',
    descripcion: 'Arena de alta absorción que forma aglomerados firmes para una limpieza rápida y sencilla, neutralizando eficazmente los malos olores del arenero.',
    precio: '$13.990',
    precioNumero: 13990,
    categoria: 'Higiene',
    especie: 'Gato',
    receta: 'Libre',
    rangoEdadPeso: 'Todas las edades / 10 kg'
  },
  {
    id: 6,
    imagen: imgMultivitaminico,
    titulo: 'Suplemento Multivitamínico',
    descripcion: 'Suplemento nutricional con vitaminas y minerales esenciales diseñado para fortalecer el sistema inmune, la salud articular y mantener un pelaje brillante.',
    precio: '$14.990',
    precioNumero: 14990,
    categoria: 'Medicamentos',
    especie: 'Perro',
    receta: 'Retenida',
    rangoEdadPeso: 'Adulto y Senior / 60 tabs'
  },
  {
    id: 7,
    imagen: imgTucan,
    titulo: 'Juguete para Mascota Tucán',
    descripcion: 'Juguete interactivo de textura resistente con sonido integrado, ideal para estimular el instinto de juego, el ejercicio físico y reducir el estrés.',
    precio: '$13.990',
    precioNumero: 13990,
    categoria: 'Accesorios',
    especie: 'Exóticos',
    receta: 'Libre',
    rangoEdadPeso: 'Aves y Mascotas pequeñas / 25 cm'
  },
  {
    id: 8,
    imagen: imgConejo,
    titulo: 'Alimento para Conejo Purina',
    descripcion: 'Mezcla nutritiva rica en fibra cruda y nutrientes esenciales, formulada especialmente para favorecer el desgaste dental y una óptima digestión en conejos.',
    precio: '$27.990',
    precioNumero: 27990,
    categoria: 'Alimentos',
    especie: 'Exóticos',
    receta: 'Libre',
    rangoEdadPeso: 'Juvenil y Adulto / 5 kg'
  }
];
