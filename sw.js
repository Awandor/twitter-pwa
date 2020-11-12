// ========================================
// Importación de archivo de apoyo
// ========================================

importScripts( 'js/sw-utils.js' ); // añadimos importScripts al .jshintrc

// Tenemos que añadirlo al APP_SHELL


// ========================================
// Declaración de variables
// ========================================


const STATIC_CACHE_NAME = 'staticCache-v1';
const DYNAMIC_CACHE_NAME = 'dynamicCache-v1';
const UNMUTABLE_CACHE_NAME = 'unmutableCache-v1';

const APP_SHELL = [
  // '/', // Sólo para desarrollo en localhost
  'index.html',
  'css/style.css',
  'img/favicon.ico',
  'img/avatars/hulk.jpg',
  'img/avatars/ironman.jpg',
  'img/avatars/spiderman.jpg',
  'img/avatars/thor.jpg',
  'img/avatars/wolverine.jpg',
  'js/app.js',
  'js/sw-utils.js'
];

const APP_SHELL_INMUTABLE = [
  'https://fonts.googleapis.com/css?family=Quicksand:300,400',
  'https://fonts.googleapis.com/css?family=Lato:400,300',
  'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
  'css/animate.css',
  'js/libs/jquery.js'
];


// ========================================
// Instalación del sw
// ========================================

self.addEventListener( 'install', installEvent => {

  const staticCache = caches.open( STATIC_CACHE_NAME ).then( respCache => {

    return respCache.addAll( APP_SHELL );

  } );

  const inmutableCache = caches.open( UNMUTABLE_CACHE_NAME ).then( respCache => {

    return respCache.addAll( APP_SHELL_INMUTABLE );

  } );

  // waitUntil necesita que el argumento retorne algo

  installEvent.waitUntil( Promise.all( [ staticCache, inmutableCache ] ) );

} );


// ========================================
// Activación del sw
// ========================================

// El evento activate comienza cuando termina la instalación con sus promesas en waitUntil

self.addEventListener( 'activate', activateEvent => {

  // Borrar todos los caches con nombre static pero que no sean igual a STATIC_CACHE_NAME

  const limpiarCachesViejos = caches.keys().then( promesaKeys => {

    console.log( 'Estos son los nombres de los caches', promesaKeys );

    promesaKeys.forEach( key => {

      if ( key !== STATIC_CACHE_NAME && key.includes( 'static' ) ) {

        return caches.delete( key );

      }

    } );

  } );

  // waitUntil necesita que el argumento retorne algo

  activateEvent.waitUntil( limpiarCachesViejos );

} );


// ========================================
// Estrategia del cache en los fetch
// ========================================

self.addEventListener( 'fetch', fetchEvent => {

  // ========================================
  // Cache with Network fallback
  // ========================================

  const fallback = caches.match( fetchEvent.request ).then( matchResp => {

    if ( matchResp ) {

      // Si encuentra algo en la caché retorna eso mismo

      return matchResp;

    } else {

      console.log( 'fetchEvent request', fetchEvent.request.url );

      // Si no encuentra en la caché búscalo con un fetch en internet

      return fetch( fetchEvent.request ).then( fetchResp => {

        // Aprovecha para almacenarlo en DYNAMIC_CACHE_NAME y muéstralo

        return actualizaCacheDinamico( DYNAMIC_CACHE_NAME, fetchEvent.request, fetchResp );

      } );
    }

  } );

  // respondWith necesita que el argumento retorne algo

  fetchEvent.respondWith( fallback );

} );
