// ========================================
// Utilidades para el sw
// ========================================

function actualizaCacheDinamico( dynamicCacheName, req, resp ) {

  if ( resp.ok ) {

    // Aprovechamos para guardar el archivo en caché

    caches.open( dynamicCacheName ).then( openResp => {

      openResp.put( req, resp );

      // Limpiamos la caché

      //   limpiarCache( dynamicCacheName, 5 );

    } );

    // No podemos usar dos veces resp así que lo clonamos

    return resp.clone();

  } else {

    // No hay nada que hacer, no se puede almacenar nada

    return resp.clone();

  }
}
