# Chat de Héroes

Un cascarón de chat usando jQuery para PWAs

La lógica de la app no importa aquí está hecho con jquery, nos centraremos en sw y aprenderemos a segmentar el sw en varios archivos
y aprenderemos a manejar el archivo `manifest.json`

El objetivo no es crear una app sino tomar una app existente y transformarla en una PWA

## JShint

Vamos a crear un archivo de configuración del linter de js `.jshintrc` y ajustamos esversion, strict y globals


## http-server

Si no tenemos instalado `http-server` lo instalamos. Es un paquete que permite levantar rápidamente un servidor

> `npm install http-server -g` Hay que tener permisos de Administrador en la consola

Tiene varias opciones que pueden verse > `http-server --help`

Lo necesitamos para poder usar el protocolo `http` en el navegador y no el protocolo `file`

Desde la raiz del proyecto levantamos el servidor local > `http-server -o` -o lo abre automáticamente en el navegador

Tenemos que usar siempre `http://127.0.0.1:8080` 127.0.0.1 equivale a localhost. Una PWA sólo puede correr desde `localhost` o desde un `https://`
porque los service workers sólo pueden funcionar en entornos seguros y localhost se considera seguro

Si el puerto 8080 estuviera ocupado podemos asignar otro puerto > `http-server -o -p 8081`

Si hemos trabajado en local en el puerto 8080 con otros proyectos y en especial con PWAs es posible que tengamos información guardada en el Storage
del navegador, vamos a limpiar el Storage.

Vamos al inspector > Application > Clear storage

## Registar el sw en app.js

Registramos el sw y creamos el archivos `sw.js`

Declaramos nuestros espacios de cache y declaramos nuestra app shell, para ello analizamos la app desde el index.html para ver qué es esencial,
no hay que olvidar incluir `'/'`

Ahora instalamos el sw, después en el evento activate implementamos el borrado de cachés viejas.

Implementamos para los fetch la estrategia de Cache with network fallback, aquí vamos a refactorizar y ponemos parte del código en otro archivo

`js/sw-utils.js`, lo importamos a `sw.js` con `importScripts`, añadimos `importScripts` al `.jshintrc` para que no de error del linter

Invocamos la función de `actualizaCacheDinamico` del `js/sw-utils.js` en sw.js en la parte del evento fetch para cuando el recurso no se
encuentra en la caché para que lo busque en internet lo guarde en el caché dinámico y lo muestre

En el caso de font awesome no se usa en la primera página de forma que si no pasamos a la siguientes páginas nunca se almacena en el caché dinámico,
un truco es usarlo en algún lugar de la primera página para forzar su guardado en el caché dinámico

## manifest.js

Documentación: `https://web.dev/add-manifest/`

Creamos el archivo `manifest.json` el nombre no importa lo importante es que sea un json

{
  "short_name": "Twitter", // Lo que se va a ver en la pantalla de inicio del usuario
  "name": "Weather: Do I need an umbrella?", // Para usar en el banner de instalación de apps web
  "start_url": "/?source=pwa", // Pueden enviarse parámetros
  "background_color": "#3367D6", // El color de fondo en el spash screen
  "display": "standalone", // Cómo se muestra la app en el web view, puede ser fullscreen, standalone, minimal-ui, browser
  "orientation": "portrait", // Puede ser landscape
  "theme_color": "red" // Debe coincidir con el meta theme-color
}

Añadimos un enlace al manifest en cada página de la app <link rel="manifest" href="manifest.json">

En index.html ponemos <meta name="theme-color" content="#3498db"> el mismo color de fondo del spash, esto es para el tool bar

Podemos probar el manifest en la depuradora > Application > Manifest


## Depurar y correr en un dispositivo real

En el dispositivo vamos a opciones de desarrollador, debe estar activo y activar USB debugging

Conectamos por USB el dispositivo al ordenador, en el depurador vamos a `Remote devices` debemos tener marcada `Discover USB devices`

En Port forwarding ponemos Port: 8080 y en IP: localhost:8080 y activamos `Port forwarding`

En la parte de Devices debe salir el dispositivo, en el campo Open tab with url ponemos localhost:8080 y presionamos Open

La aplicación se abre en el dispositivo y en algunos casos pregunta si queremos añadirla a la pantalla de inicio

Podemos inspeccionar la app del dispositivo

La app en el dispositivo no se ve como una app nativa aparece como una página web, esto es porque no la estamos lanzando desde
un servidor https


## Desplegar aplicación en GitHub Pages

Vamos github y creamos un nuevo repositorio, subimos la app

Ahora vamos acceder al repositorio como si fuera una página web

Vamos a Settings > GitHub Pages > Source > master branch > Save

La app es ahora accesible desde `https://awandor.github.io/twitter-pwa/`

Si abrimos el inspector tenemos error en consola: `Uncaught (in promise) TypeError: Failed to register a ServiceWorker`

El problema está en que la app no se encuentra en la raiz del dominio, está en una subcarpeta

En `app.js` estamos llamando al sw `navigator.serviceWorker.register( '/sw.js' );`

`'/sw.js'` la barra indica que está en la raiz pero en github no lo está

Vamos a añadir una pequeña verificación en `app.js`

También hay que tener cuidado en sw.js en APP_SHELL con la barra, ésta nos sirve para desarrollo en localhost pero no en github, la comentamos

Subimos los cambios a github




# GIT

En nuestra cuenta de github creamos un repositorio

Si no tenemos repositorio git local lo creamos > `git init`

Si no tenemos archivo `.gitignore` lo creamos, especialmente para evitar `node_modules`

Añadimos los cambios a GIT> `git add .`
Commit > `git commit -m "Primer commit"`

Si en este punto borro accidentalmente algo puedo recuperarlo con > `git checkout -- .`

Que nos recontruye los archivos tal y como estaban en el último commit.

Enlazamos el repositorio local con un repositorio externo en GitHub donde tenemos cuenta y hemos creado un repositorio
`git remote add origin https://github.com/Awandor/twitter-pwa.git`

Situarnos en la rama master > `git branch -M master`

Subir todos los cambios a la rama master remota > `git push -u origin master`

Para reconstruir en local el código de GitHub nos bajamos el código y ejecutamos `npm install` que instala todas las dependencias


## Tags y Releases

Crear un tag en Github y un Release

> `git tag -a v1.0.0 -m "Versión 1 - Lista para producción"`

> `git tag` muestra los tags

> `git push --tags` > sube los tags al repositorio remoto

En github vamos a Tags > Add release notes